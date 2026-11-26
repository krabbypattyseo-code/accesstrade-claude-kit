// Audio lewat ffmpeg bawaan Remotion (remotion ffmpeg): ubah format, normalkan loudness, potong.
// Jalan di macOS dan Windows tanpa shell.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {IS_MAC, remotion, systemFfmpeg} from './run.mjs';

const ff = (args, opts = {}) => {
  const r = remotion(['ffmpeg', '-hide_banner', '-nostdin', ...args], opts);
  if (r.status !== 0) throw new Error(`ffmpeg gagal: ${args.join(' ')}\n${String(r.stderr).slice(-1500)}`);
  return r;
};

/** Durasi file audio/video (detik) lewat ffprobe bawaan Remotion. */
export const audioDuration = (file) => {
  const r = remotion(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'});
  const d = parseFloat(r.stdout);
  if (!(d > 0)) throw new Error(`Tidak bisa membaca durasi ${file}: ${r.stderr}`);
  return d;
};

/** Codec video pertama (h264, hevc, ...) atau null. */
export const videoCodec = (file) => {
  const r = remotion(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', file], {encoding: 'utf8'});
  return String(r.stdout ?? '').trim() || null;
};

/**
 * Ubah rekaman apa pun ke WAV PCM 16-bit.
 * ffmpeg bawaan Remotion tidak punya decoder ALAC (Voice Memos iPhone mode Lossless) dan AIFF, jadi:
 * 1. macOS: afconvert bawaan sistem
 * 2. ffmpeg sistem (versi lengkap) kalau terpasang (Windows: winget install Gyan.FFmpeg)
 * 3. ffmpeg bawaan Remotion (cukup untuk AAC/M4A biasa, MP3, WAV)
 */
export const toPcmWav = (src, dest) => {
  if (/\.wav$/i.test(src)) return src;
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  if (IS_MAC) {
    const r = spawnSync('afconvert', [src, '-o', dest, '-f', 'WAVE', '-d', 'LEI16'], {encoding: 'utf8'});
    if (r.status === 0 && fs.existsSync(dest)) return dest;
  }
  const sys = systemFfmpeg();
  if (sys) {
    const r = spawnSync(sys, ['-hide_banner', '-nostdin', '-y', '-i', src, '-vn', '-c:a', 'pcm_s16le', dest], {encoding: 'utf8'});
    if (r.status === 0 && fs.existsSync(dest)) return dest;
  }
  try {
    ff(['-y', '-i', src, '-vn', '-c:a', 'pcm_s16le', dest]);
    return dest;
  } catch (e) {
    throw new Error(
      `Rekaman ${path.basename(src)} tidak bisa dibaca. Kemungkinan format ALAC (Voice Memos mode Lossless).\n` +
        '  Solusi: rekam dengan mode Compressed, kirim sebagai .wav, atau pasang ffmpeg lengkap (Windows: winget install Gyan.FFmpeg).',
    );
  }
};

/** Ukur loudness (EBU R128) dengan loudnorm tahap 1. */
export const measureLoudness = (file, {I = -14, TP = -1.5, LRA = 11} = {}) => {
  const r = ff(['-i', file, '-vn', '-af', `loudnorm=I=${I}:TP=${TP}:LRA=${LRA}:print_format=json`, '-f', 'null', '-'], {encoding: 'utf8'});
  const m = String(r.stderr).match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);
  if (!m) throw new Error('Tidak bisa membaca hasil loudnorm');
  return JSON.parse(m[0]);
};

/**
 * Normalkan ke target LUFS (default -14), true peak -1,5 dBTP.
 * Dua tahap: ukur dulu, lalu loudnorm linear (dinamika suara tidak diubah). Output WAV 48 kHz.
 */
export const normalizeLoudness = (src, dest, {I = -14, TP = -1.5, LRA = 11, mono = true} = {}) => {
  const m = measureLoudness(src, {I, TP, LRA});
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  const out = [...(mono ? ['-ac', '1'] : []), '-ar', '48000', '-c:a', 'pcm_s16le', dest];
  const af =
    `loudnorm=I=${I}:TP=${TP}:LRA=${LRA}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:` +
    `measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  ff(['-y', '-i', src, '-vn', '-af', af, ...out]);
  let after = measureLoudness(dest, {I, TP, LRA});
  let mode = 'linear';
  // Rekaman HP yang pelan dengan puncak tajam: gain linear tertahan batas true peak sebelum sampai target.
  // Jalan keluarnya gain + limiter (alimiter) dari ffmpeg sistem, karena ffmpeg bawaan Remotion tidak punya alimiter.
  if (+after.input_i < I - 1) {
    const sys = systemFfmpeg();
    if (sys) {
      const limit = Math.pow(10, (TP - 0.5) / 20).toFixed(3);
      let gain = I - +m.input_i;
      for (let pass = 0; pass < 3; pass++) {
        const r = spawnSync(sys, ['-hide_banner', '-nostdin', '-y', '-i', src, '-vn', '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=${limit}:attack=3:release=60:level=disabled`, ...out], {encoding: 'utf8'});
        if (r.status !== 0) throw new Error(`ffmpeg sistem gagal: ${String(r.stderr).slice(-600)}`);
        after = measureLoudness(dest, {I, TP, LRA});
        mode = 'gain + limiter';
        if (Math.abs(+after.input_i - I) <= 0.3) break;
        gain += I - +after.input_i;
      }
    } else {
      mode = 'linear (tertahan true peak; pasang ffmpeg lengkap untuk limiter)';
    }
  }
  return {before: +m.input_i, after: +after.input_i, peak: +after.input_tp, mode};
};

/** Potong satu atau beberapa bagian [start, end] (detik) lalu sambung jadi satu WAV. */
export const cutSegments = (src, dest, segments) => {
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  if (segments.length === 1) {
    const [a, b] = segments[0];
    ff(['-y', '-i', src, '-ss', a.toFixed(3), '-to', b.toFixed(3), '-c:a', 'pcm_s16le', dest]);
    return;
  }
  const parts = segments.map(([a, b], i) => `[0:a]atrim=start=${a.toFixed(3)}:end=${b.toFixed(3)},asetpts=PTS-STARTPTS[p${i}]`);
  const fc = `${parts.join(';')};${segments.map((_, i) => `[p${i}]`).join('')}concat=n=${segments.length}:v=0:a=1[out]`;
  ff(['-y', '-i', src, '-filter_complex', fc, '-map', '[out]', '-c:a', 'pcm_s16le', dest]);
};

/** Ubah ke M4A (AAC 192k), dipakai untuk musik. */
export const toM4a = (src, dest) => {
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  ff(['-y', '-i', src, '-vn', '-c:a', 'aac', '-b:a', '192k', dest]);
};

/**
 * Siapkan klip video untuk Remotion: metadata (lokasi, kamera) dibuang.
 * H.264 cukup disalin ulang tanpa encode; codec lain (HEVC dari iPhone, ProRes) diubah ke H.264
 * karena Chrome di Windows tidak bisa memutar HEVC. Opsional: potong dari `from` sepanjang `dur` detik.
 */
export const prepareClip = (src, dest, {from, dur} = {}) => {
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  const cut = [...(from ? ['-ss', String(from)] : []), ...(dur ? ['-t', String(dur)] : [])];
  const codec = videoCodec(src);
  const copy = codec === 'h264' && !cut.length;
  const args = ['-y', '-i', src, ...cut, '-map_metadata', '-1', '-movflags', '+faststart'];
  const enc = copy ? ['-c', 'copy'] : ['-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k'];
  try {
    ff([...args, ...enc, dest]);
  } catch (e) {
    const sys = systemFfmpeg();
    if (!sys) throw new Error(`Klip tidak bisa diproses (${codec ?? 'codec tidak dikenal'}). Pasang ffmpeg lengkap lalu coba lagi.\n${e.message}`);
    const r = spawnSync(sys, ['-hide_banner', '-nostdin', ...args, ...enc, dest], {encoding: 'utf8'});
    if (r.status !== 0) throw new Error(`ffmpeg sistem gagal: ${String(r.stderr).slice(-600)}`);
  }
  return {codec, copied: copy};
};

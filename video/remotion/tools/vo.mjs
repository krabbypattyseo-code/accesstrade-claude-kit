#!/usr/bin/env node
// Satu rekaman utuh per video → potongan per adegan siap render.
//
// Pakai (dari folder remotion/):
//   npm run vo -- ../scripts/reels/01-contoh.json                 cari rekaman/reels/01-*.m4a (terbaru)
//   npm run vo -- ../scripts/youtube/01-contoh.json --file ~/Downloads/x.m4a
//   flag: --model medium (lebih akurat, lebih lambat) · --fresh (transkrip ulang)
//
// Langkah: ubah ke WAV → normalkan loudness (default -14 LUFS, dari brand/tokens.json) → transkrip per kata (Whisper)
// → cocokkan tiap kalimat script dari BELAKANG (take terakhir dipakai, take salah terbuang) → potong ke
// remotion/public/video/<format>-NN/vo/<id>.wav + kata.json (waktu kata asli untuk caption).
// File kerja + laporan: rekaman/olah/<format>-NN/. Koreksi manual: isi "voCut": {"3": [[12.4, 16.9]]} di script
// (detik di rekaman/olah/<format>-NN/suara-normal.wav), lalu jalankan lagi.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {PUBLIC, REKAMAN, ROOT} from '../lib/paths.mjs';
import {venvPython} from '../lib/run.mjs';
import {formatOf, mediaKey, mediaRel, numberOf, readScript, videoName} from '../lib/scripts.mjs';
import {audioDuration, cutSegments, normalizeLoudness, toPcmWav} from '../lib/audio.mjs';
import {alignScenes} from '../lib/align.mjs';
import {buildBrand} from '../lib/brand.mjs';

const PAD_IN = 0.06;
const PAD_OUT = 0.14;

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--') && /\.(json|md)$/i.test(a));
const opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
if (!input) {
  console.error('Pakai: npm run vo -- <script> [--file rekaman.m4a] [--model small|medium] [--fresh]');
  process.exit(1);
}
const script = readScript(path.resolve(process.cwd(), input));
const NN = numberOf(script);
const format = formatOf(script);
const key = mediaKey(script);
const INBOX = path.join(REKAMAN, format);
const WORK = path.join(REKAMAN, 'olah', key);
fs.mkdirSync(WORK, {recursive: true});

// 1) cari rekaman
let src = opt('--file') ? path.resolve(process.cwd(), opt('--file')) : null;
if (!src) {
  const cands = fs.existsSync(INBOX)
    ? fs
        .readdirSync(INBOX)
        .filter((f) => f.startsWith(`${NN}-`) && /\.(m4a|wav|mp3|aac|caf|aiff?)$/i.test(f))
        .map((f) => path.join(INBOX, f))
        .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
    : [];
  src = cands[0];
  if (cands.length > 1) console.warn(`! ada ${cands.length} rekaman untuk ${format} ${NN}, pakai yang terbaru: ${path.basename(src)}`);
}
if (!src || !fs.existsSync(src)) {
  console.error(`✗ Rekaman tidak ditemukan. Taruh file ${NN}-<apa saja>.m4a di rekaman/${format}/ atau pakai --file.`);
  process.exit(1);
}
console.log(`▶ ${format} ${videoName(script)} · rekaman ${path.basename(src)}`);

// 2) normalkan loudness
const target = buildBrand().audio.voiceLufs;
const norm = path.join(WORK, 'suara-normal.wav');
const pcm = toPcmWav(src, path.join(WORK, 'sumber.wav'));
const ln = normalizeLoudness(pcm, norm, {I: target});
console.log(`  loudness     : ${ln.before.toFixed(1)} LUFS → ${ln.after.toFixed(1)} LUFS (true peak ${ln.peak.toFixed(1)} dBTP, mode ${ln.mode})`);

// 3) transkrip (Whisper lewat Python di remotion/.venv, atau WHISPER_PYTHON)
const trans = path.join(WORK, 'transkrip.json');
if (args.includes('--fresh') || !fs.existsSync(trans) || fs.statSync(trans).mtimeMs < fs.statSync(norm).mtimeMs) {
  console.log('  transkrip    : Whisper (bisa 30 dtk sampai beberapa menit, tergantung panjang rekaman)…');
  const py = venvPython();
  if (!py) {
    console.error('✗ Whisper belum terpasang. Sekali saja, dari folder remotion/: npm run setup:python');
    process.exit(1);
  }
  const r = spawnSync(py, [path.join(ROOT, 'tools', 'transcribe.py'), norm, trans, opt('--model') ?? 'small'], {stdio: 'inherit'});
  if (r.status !== 0) process.exit(r.status ?? 1);
}
const {words} = JSON.parse(fs.readFileSync(trans, 'utf8'));

// 4) cocokkan kalimat script → potongan rekaman
const scenes = script.scenes.map((s, i) => ({id: s.id ?? i + 1, vo: s.vo}));
const aligned = alignScenes(scenes.filter((s) => s.vo), words);
const manual = script.voCut ?? {};
for (const a of aligned) {
  if (manual[a.id]) {
    a.segments = manual[a.id];
    a.manual = true;
  }
}
const total = audioDuration(norm);
// urutkan semua potongan per waktu supaya jeda tambahan tidak menabrak potongan lain
const all = aligned.flatMap((a) => a.segments.map((g) => ({a, g}))).sort((x, y) => x.g[0] - y.g[0]);
all.forEach(({g}, i) => {
  const prevEnd = i > 0 ? all[i - 1].g[1] : 0;
  const nextStart = i + 1 < all.length ? all[i + 1].g[0] : total;
  g[0] = Math.max(0, prevEnd + 0.01, g[0] - PAD_IN);
  g[1] = Math.min(total, nextStart - 0.01, g[1] + PAD_OUT);
});

// 5) tulis potongan per adegan + waktu kata relatif terhadap potongan
const voDir = path.join(PUBLIC, mediaRel(script), 'vo');
fs.mkdirSync(voDir, {recursive: true});
for (const f of fs.readdirSync(voDir)) if (/\.(wav|m4a|mp3|aac|json)$/i.test(f)) fs.rmSync(path.join(voDir, f));
const kata = {};
const report = [];
for (const a of aligned) {
  const sc = scenes.find((s) => String(s.id) === String(a.id));
  if (!a.segments.length) {
    report.push({id: a.id, ok: false, note: 'TIDAK KETEMU di rekaman', vo: sc.vo, heard: '', dur: 0, score: 0});
    continue;
  }
  cutSegments(norm, path.join(voDir, `${a.id}.wav`), a.segments);
  // waktu asli → waktu di dalam potongan (potongan bisa sambungan beberapa bagian)
  const rel = (t) => {
    let off = 0;
    for (const [s0, s1] of a.segments) {
      if (t <= s1) return off + Math.max(0, t - s0);
      off += s1 - s0;
    }
    return off;
  };
  if (!a.manual) kata[a.id] = a.words.map((w) => ({text: w.text, startMs: Math.round(rel(w.start) * 1000), endMs: Math.round(rel(w.end) * 1000)}));
  const dur = a.segments.reduce((x, [s0, s1]) => x + s1 - s0, 0);
  const ok = a.manual || (a.score ?? 0) >= 0.7;
  report.push({
    id: a.id,
    ok,
    note: a.manual ? 'voCut manual' : a.segments.length > 1 ? `${a.segments.length} potongan (ada take ulang dibuang)` : '',
    vo: sc.vo,
    heard: a.heard,
    dur,
    score: a.score,
    seg: a.segments.map(([s0, s1]) => `${s0.toFixed(2)}-${s1.toFixed(2)}`).join(', '),
  });
}
fs.writeFileSync(path.join(voDir, 'kata.json'), JSON.stringify(kata, null, 1));

// 6) laporan
const esc = (t) => String(t ?? '').replace(/\|/g, '/');
const lines = [
  `# Suara ${format} ${videoName(script)}`,
  '',
  `- Rekaman: \`${path.basename(src)}\` · loudness ${ln.before.toFixed(1)} → ${ln.after.toFixed(1)} LUFS, true peak ${ln.peak.toFixed(1)} dBTP`,
  `- Potongan: \`remotion/public/${mediaRel(script)}/vo/<id>.wav\`. Waktu di tabel = detik di \`rekaman/olah/${key}/suara-normal.wav\`.`,
  '- Skor < 0,7: dengarkan potongannya. Kalau salah, isi `"voCut": {"<id>": [[mulai, selesai]]}` di script lalu jalankan lagi.',
  '',
  '| Adegan | Skor | Durasi | Bagian rekaman | Catatan | Script | Terdengar |',
  '|---|---|---|---|---|---|---|',
  ...report.map((r) => `| ${r.id} | ${r.score === null || r.score === undefined ? '-' : r.score.toFixed(2)}${r.ok ? '' : ' ⚠'} | ${r.dur.toFixed(1)} dtk | ${r.seg ?? '-'} | ${r.note} | ${esc(r.vo)} | ${esc(r.heard)} |`),
  '',
];
fs.writeFileSync(path.join(WORK, 'laporan.md'), lines.join('\n'));
for (const r of report) console.log(`  adegan ${String(r.id).padEnd(3)}: ${r.ok ? '✓' : '⚠'} ${r.dur.toFixed(1)} dtk  skor ${r.score?.toFixed?.(2) ?? '-'}  ${r.note}`);
const bad = report.filter((r) => !r.ok);
console.log(`✓ ${report.length - bad.length}/${report.length} adegan · laporan: rekaman/olah/${key}/laporan.md`);
if (bad.length) console.warn(`! cek adegan ${bad.map((r) => r.id).join(', ')} (skor rendah atau tidak ketemu) sebelum render`);

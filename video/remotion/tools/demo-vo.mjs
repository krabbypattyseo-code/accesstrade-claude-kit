#!/usr/bin/env node
// Suara SEMENTARA dari suara komputer, hanya untuk cek timing. Video yang tayang wajib pakai rekaman asli.
//
//   npm run demo-vo -- ../scripts/reels/00-contoh-reels.json            potongan per adegan langsung ke public/video/<kunci>/vo/
//   npm run demo-vo -- ../scripts/reels/00-contoh-reels.json --rekaman  satu file utuh ke rekaman/<format>/NN-demo.wav,
//                                                                        lalu bisa diuji dengan npm run vo (alur rekaman asli)
// macOS: suara "Damayanti" (Bahasa Indonesia), ganti lewat VO_VOICE (daftar: say -v '?').
// Windows: suara bawaan Windows (System.Speech). Kalau suara Bahasa Indonesia terpasang, otomatis dipakai.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {PUBLIC, REKAMAN} from '../lib/paths.mjs';
import {formatOf, mediaRel, numberOf, readScript} from '../lib/scripts.mjs';
import {IS_MAC, IS_WIN} from '../lib/run.mjs';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
if (!file) {
  console.error('Pakai: npm run demo-vo -- <file script> [--rekaman]');
  process.exit(1);
}
if (!IS_MAC && !IS_WIN) {
  console.error('✗ demo-vo hanya untuk macOS dan Windows. Rekam suara biasa lalu pakai npm run vo.');
  process.exit(1);
}

const xml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const psQuote = (t) => `'${t.replace(/'/g, "''")}'`;

/** texts: kalimat per bagian; bagian dipisah jeda 0,7 dtk. */
const speak = (texts, out) => {
  if (IS_MAC) {
    const voice = process.env.VO_VOICE || 'Damayanti';
    const rate = process.env.VO_RATE || '190';
    const r = spawnSync('say', ['-v', voice, '-r', rate, '--file-format=WAVE', '--data-format=LEI16@24000', '-o', out, texts.join(' [[slnc 700]] ')]);
    if (r.status !== 0) throw new Error(`say gagal: ${String(r.stderr)}`);
    return;
  }
  // Windows: SSML lewat PowerShell. Teks ditulis ke file dulu supaya tanda kutip tidak merusak perintah.
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="id-ID">${texts.map(xml).join('<break time="700ms"/>')}</speak>`;
  const tmp = path.join(os.tmpdir(), `demo-vo-${Date.now()}.xml`);
  fs.writeFileSync(tmp, ssml, 'utf8');
  const ps = [
    'Add-Type -AssemblyName System.Speech',
    '$s = New-Object System.Speech.Synthesis.SpeechSynthesizer',
    "$id = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -eq 'id-ID' } | Select-Object -First 1",
    'if ($id) { $s.SelectVoice($id.VoiceInfo.Name) }',
    `$s.SetOutputToWaveFile(${psQuote(out)})`,
    `$s.SpeakSsml([IO.File]::ReadAllText(${psQuote(tmp)}, [Text.Encoding]::UTF8))`,
    '$s.Dispose()',
  ].join('; ');
  const r = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps], {encoding: 'utf8'});
  fs.rmSync(tmp, {force: true});
  if (r.status !== 0 || !fs.existsSync(out)) throw new Error(`Suara Windows gagal: ${String(r.stderr).slice(-400)}`);
};

const script = readScript(path.resolve(process.cwd(), file));
const scenes = script.scenes.map((s, i) => ({id: s.id ?? i + 1, vo: s.vo})).filter((s) => s.vo?.trim());

if (args.includes('--rekaman')) {
  const dir = path.join(REKAMAN, formatOf(script));
  fs.mkdirSync(dir, {recursive: true});
  const out = path.join(dir, `${numberOf(script)}-demo.wav`);
  speak(scenes.map((s) => s.vo), out);
  console.log(`✓ ${path.relative(process.cwd(), out)} (suara komputer, hanya untuk uji). Lanjut: npm run vo -- ${file}`);
} else {
  const dir = path.join(PUBLIC, mediaRel(script), 'vo');
  fs.mkdirSync(dir, {recursive: true});
  for (const f of fs.readdirSync(dir)) if (/\.(wav|json)$/i.test(f)) fs.rmSync(path.join(dir, f));
  for (const s of scenes) {
    const out = path.join(dir, `${s.id}.wav`);
    speak([s.vo], out);
    console.log(`✓ ${path.relative(process.cwd(), out)}`);
  }
  console.log('Suara komputer, hanya untuk cek timing. Ganti dengan rekaman asli (npm run vo) sebelum tayang.');
}

#!/usr/bin/env node
// Bungkus modul video jadi zip untuk PC editor (Windows), TANPA Motion Format dan tanpa file besar/pribadi.
//   node tools/bungkus-editor.mjs            dari folder video/
// Hasil: video/_paket/accesstrade-video-editor-YYYY-MM-DD.zip (isi: folder video/)
//
// Yang dibuang:
// - Motion Format (skill + folder proyek): lisensi pribadi Harist, tidak boleh dibagikan
// - node_modules, .venv, skill resmi Remotion (dipasang ulang lewat setup di PC editor)
// - rekaman suara, hasil olahan, render, project .aep, profil AE (dibuat ulang di PC editor)
// Setelah zip jadi, isinya diperiksa ulang: kalau ada file Motion Format, zip dihapus dan proses gagal.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PARENT = path.dirname(VIDEO);
const NAME = path.basename(VIDEO); // "video"
const date = new Date().toISOString().slice(0, 10);
const outDir = path.join(VIDEO, '_paket');
const out = path.join(outDir, `accesstrade-video-editor-${date}.zip`);

const EXCLUDE = [
  // lisensi pribadi
  '.claude/skills/motion-format/*',
  'motion-format/*',
  // dipasang ulang
  'remotion/node_modules/*',
  'remotion/.venv/*',
  'remotion/.agents/*',
  'remotion/.claude/*',
  'remotion/skills-lock.json',
  // dibuat ulang / besar / per mesin
  'remotion/.render-props/*',
  'remotion/src/generated/*',
  'rekaman/olah/*',
  'rekaman/reels/*.m4a',
  'rekaman/reels/*.wav',
  'rekaman/reels/*.mp3',
  'rekaman/youtube/*.m4a',
  'rekaman/youtube/*.wav',
  'rekaman/youtube/*.mp3',
  'remotion/public/video/*/vo/*',
  'output/*.mp4',
  'output/*/*.mp4',
  'output/*/*.aep',
  'ae/proyek/*',
  'ae/profil-ae.json',
  'ae/profil-ae.md',
  '_paket/*',
  '*.DS_Store',
];
const FORBIDDEN = [/(^|\/)motion-format\//, /(^|\/)\.venv\//, /node_modules\//];

fs.mkdirSync(outDir, {recursive: true});
if (fs.existsSync(out)) fs.rmSync(out);

const zipArgs = ['-r', '-X', '-q', out, NAME, ...EXCLUDE.flatMap((p) => ['-x', `${NAME}/${p}`])];
let r = spawnSync('zip', zipArgs, {cwd: PARENT, encoding: 'utf8'});
if (r.error || r.status !== 0) {
  console.error(`✗ zip gagal: ${r.error?.message ?? r.stderr}`);
  console.error('  Perintah ini dijalankan di Mac Harist (butuh program zip bawaan macOS).');
  process.exit(1);
}

// periksa ulang isi zip
r = spawnSync('unzip', ['-Z1', out], {encoding: 'utf8', maxBuffer: 1 << 26});
const entries = String(r.stdout).split('\n').filter(Boolean);
const bad = entries.filter((e) => FORBIDDEN.some((re) => re.test(e)));
if (bad.length) {
  fs.rmSync(out);
  console.error(`✗ Zip berisi file yang tidak boleh ikut (${bad.length}), contoh: ${bad.slice(0, 3).join(', ')}. Zip dihapus.`);
  process.exit(1);
}
const size = fs.statSync(out).size / 1e6;
console.log(`✓ ${path.relative(process.cwd(), out)} · ${entries.length} file · ${size.toFixed(1)} MB`);
console.log('  Motion Format, node_modules, rekaman, dan hasil render tidak ikut. Kirim zip ini ke editor.');

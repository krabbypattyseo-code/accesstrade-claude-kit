#!/usr/bin/env node
// Render satu script ke output/<format>/.
//
//   npm run render -- ../scripts/reels/01-contoh.json               final (1080×1920 Reels / 1920×1080 YouTube)
//   npm run render -- ../scripts/reels/01-contoh.json --draft       cepat untuk dicek (setengah resolusi, tanpa cover)
//   npm run render -- ../scripts/reels/01-contoh.json --hq          Reels 1440×2560 (setara resolusi kamera HP)
//   flag lain: --out file.mp4 · --no-cover · --cover-only · flag Remotion lain diteruskan apa adanya
//
// Hasil Reels  : output/reels/NN-slug.mp4 + NN-slug-cover.jpg
// Hasil YouTube: output/youtube/NN-slug.mp4 + NN-slug-thumbnail.jpg + NN-slug.srt (subtitle) + NN-slug-chapter.txt
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {KIT, PROPS_DIR} from './lib/paths.mjs';
import {IS_WIN, node, remotion} from './lib/run.mjs';
import {checkScript, chaptersOf, outputBase, prepareScript, readScript, readyToPost, timestamp, videoName, writeRenderIndex} from './lib/scripts.mjs';
import {toSrt} from './lib/words.mjs';
import {buildBrand} from './lib/brand.mjs';

const COMP = {reels: {video: 'Reels', cover: 'ReelsCover', coverSuffix: '-cover.jpg'}, youtube: {video: 'Youtube', cover: 'YoutubeThumbnail', coverSuffix: '-thumbnail.jpg'}};
const COVER_FRAME = 29; // = COVER_FRAMES - 1 di src/Cover.tsx (animasi sudah diam)

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--') && /\.(json|md)$/i.test(a));
if (!input) {
  console.error('Pakai: npm run render -- <file script> [--draft] [--hq] [--out file.mp4] [--no-cover] [--cover-only]');
  process.exit(1);
}
const flag = (k) => args.includes(k);
const outIdx = args.indexOf('--out');
const OWN = ['--draft', '--hq', '--no-cover', '--cover-only'];
const passthrough = args.filter((a, i) => a !== input && !OWN.includes(a) && (outIdx < 0 || (i !== outIdx && i !== outIdx + 1)));

// render lain yang sedang jalan memperlambat keduanya. Hanya jumlah proses yang dicetak:
// baris perintah lengkap proses lain bisa memuat variabel lingkungan berisi token.
const busy = IS_WIN ? 0 : (spawnSync('pgrep', ['-f', 'remotion render'], {encoding: 'utf8'}).stdout ?? '').trim().split('\n').filter(Boolean).length;
if (busy) console.warn(`! ada ${busy} proses render lain yang sedang jalan. Render ini tetap lanjut, tapi keduanya jadi lebih lambat`);

const sync = node(['sync.mjs'], {stdio: 'inherit'});
if (sync.status !== 0) process.exit(sync.status ?? 1);

const script = prepareScript(readScript(path.resolve(process.cwd(), input)));
const {errors, warnings} = checkScript(script);
const fmt = script.format;
const comp = COMP[fmt];
const draft = flag('--draft');
const base = outputBase(script);
const out = outIdx >= 0 ? path.resolve(process.cwd(), args[outIdx + 1]) : `${base}${draft ? '-draft' : ''}.mp4`;
const dur = script.scenes[script.scenes.length - 1]?.end ?? 0;

console.log(`▶ ${fmt} · ${videoName(script)} · ${script.title ?? ''}`);
console.log(`  adegan  : ${script.scenes.map((s) => `${s.id}:${s.type}`).join(' · ')}`);
console.log(`  durasi  : ${timestamp(dur)}`);
console.log(`  suara   : ${script.media.clips.length ? `${script.media.clips.length} potongan rekaman (timing ikut rekaman)` : 'belum ada rekaman (timing dari dur)'}`);
console.log(`  output  : ${path.relative(process.cwd(), out)}${draft ? ' (draft)' : ''}`);
for (const w of warnings) console.warn(`! ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`  tayang  : ${readyToPost(script) ? 'boleh, setelah dicek manusia' : script.demo ? 'tidak (demo)' : 'TIDAK, ada [KONFIRMASI]'}`);

fs.mkdirSync(PROPS_DIR, {recursive: true});
fs.mkdirSync(path.dirname(out), {recursive: true});
const propsFile = path.join(PROPS_DIR, `${fmt}-${videoName(script)}.json`);
fs.writeFileSync(propsFile, JSON.stringify(script, null, 2));

const quality = draft ? ['--scale=0.5', '--crf=28'] : flag('--hq') && fmt === 'reels' ? ['--scale=1.3333333333333333', '--video-bitrate=16M'] : ['--crf=18'];
// Chrome for Testing kadang lambat menyala (apalagi dari SSD eksternal): "Timed out ... connect to the browser".
// Render dicoba sekali lagi kalau gagal.
let res = {status: 0};
if (!flag('--cover-only')) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    if (attempt > 1) console.warn('! render gagal, coba sekali lagi (Chrome kadang lambat menyala)');
    res = remotion(['render', 'src/index.ts', comp.video, out, `--props=${propsFile}`, ...quality, ...passthrough], {stdio: 'inherit'});
    if (res.status === 0) break;
  }
}

if (res.status === 0 && !draft && !flag('--no-cover')) {
  const coverOut = `${base}${comp.coverSuffix}`;
  console.log(`▶ ${fmt === 'youtube' ? 'thumbnail' : 'cover'}: ${path.relative(process.cwd(), coverOut)}`);
  // Chrome for Testing kadang lambat start (apalagi dari SSD eksternal) → coba ulang sampai 3 kali
  let c = {status: 1};
  for (let attempt = 1; attempt <= 3 && c.status !== 0; attempt++) {
    if (attempt > 1) console.warn(`! gagal, coba lagi (${attempt}/3)`);
    c = remotion(['still', 'src/index.ts', comp.cover, coverOut, `--props=${propsFile}`, `--frame=${COVER_FRAME}`, '--image-format=jpeg', '--jpeg-quality=95', '--log=error'], {stdio: 'inherit'});
  }
  if (c.status !== 0) console.warn('! cover gagal dirender, ulangi dengan: npm run render -- <script> --cover-only');
}

if (res.status === 0 && fmt === 'youtube' && !draft) {
  // subtitle untuk diunggah ke YouTube Studio (lebih rapi daripada subtitle otomatis) + chapter untuk deskripsi
  fs.writeFileSync(`${base}.srt`, toSrt(script.words ?? [], buildBrand().caption.youtube.maxWords));
  const ch = chaptersOf(script).map((c) => `${timestamp(c.t)} ${c.title}`);
  fs.writeFileSync(`${base}-chapter.txt`, `${ch.join('\n')}\n`);
  console.log(`✓ subtitle: ${path.relative(KIT, `${base}.srt`)} · chapter: ${path.relative(KIT, `${base}-chapter.txt`)}`);
}
if (res.status === 0) {
  const n = writeRenderIndex();
  console.log(`✓ output/daftar-render.md diperbarui (${n} script)`);
}
process.exit(res.status ?? 1);

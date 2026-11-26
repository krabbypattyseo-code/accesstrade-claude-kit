#!/usr/bin/env node
// Periksa script tanpa render: format, durasi, peringatan aturan brand, chapter YouTube.
//   npm run cek -- ../scripts/reels/01-contoh.json     satu script
//   npm run cek                                        semua script di scripts/reels/ dan scripts/youtube/
// Keluar dengan kode 1 kalau ada error (render pasti ditolak).
import path from 'node:path';
import {KIT} from '../lib/paths.mjs';
import {checkScript, chaptersOf, listScripts, prepareScript, readScript, readyToPost, timestamp, videoName} from '../lib/scripts.mjs';

const arg = process.argv.slice(2).find((a) => !a.startsWith('--'));
const files = arg ? [path.resolve(process.cwd(), arg)] : listScripts();
if (!files.length) {
  console.log('Belum ada script di scripts/reels/ atau scripts/youtube/.');
  process.exit(0);
}
let failed = 0;
for (const file of files) {
  let s;
  try {
    s = prepareScript(readScript(file), {quiet: true});
  } catch (e) {
    console.error(`✗ ${path.relative(KIT, file)}: ${e.message}`);
    failed++;
    continue;
  }
  const {errors, warnings} = checkScript(s);
  const dur = s.scenes.length ? s.scenes[s.scenes.length - 1].end : 0;
  const voiced = s.media.clips.length;
  console.log(`\n▶ ${s.format} · ${videoName(s)} · ${s.title ?? ''}`);
  console.log(`  file    : ${path.relative(KIT, file)}`);
  console.log(`  adegan  : ${s.scenes.length} (${s.scenes.map((x) => x.type).join(' · ')})`);
  console.log(`  durasi  : ${timestamp(dur)}${voiced ? ` (ikut rekaman, ${voiced} potongan)` : ' (perkiraan dari dur, belum ada rekaman)'}`);
  if (s.format === 'youtube') for (const c of chaptersOf(s)) console.log(`  chapter : ${timestamp(c.t)} ${c.title}`);
  for (const w of warnings) console.warn(`  ! ${w}`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.log(`  status  : ${errors.length ? 'DITOLAK render' : readyToPost(s) ? 'bisa dirender' : s.demo ? 'bisa dirender (demo, tidak untuk tayang)' : 'bisa dirender, BELUM boleh tayang ([KONFIRMASI])'}`);
  if (errors.length) failed++;
}
process.exit(failed ? 1 : 0);

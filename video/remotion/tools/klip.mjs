#!/usr/bin/env node
// Klip video (b-roll, rekaman layar, footage) → remotion/public/video/<format>-NN/klip/<nama>.mp4
// Metadata (lokasi GPS, kamera) dibuang. Klip non-H.264 (HEVC iPhone, ProRes) diubah ke H.264.
//
//   npm run klip -- ../scripts/reels/01-contoh.json ~/Desktop/IMG_4410.MOV jalan-pagi
//   npm run klip -- reels-01 ~/Desktop/rekaman-layar.mp4 dashboard --mulai 12 --durasi 8
//
// --mulai / --durasi (detik): ambil sebagian saja supaya file kecil. Di script cukup "src", tanpa "start".
// Hasil dipakai di adegan tipe klip: "props": {"src": "video/reels-01/klip/jalan-pagi.mp4"}
import path from 'node:path';
import {PUBLIC} from '../lib/paths.mjs';
import {mediaKey, readScript} from '../lib/scripts.mjs';
import {audioDuration, prepareClip} from '../lib/audio.mjs';

const args = process.argv.slice(2);
const opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
const pos = args.filter((a, i) => !a.startsWith('--') && !['--mulai', '--durasi'].includes(args[i - 1]));
const [target, src, name] = pos;
if (!target || !src || !name) {
  console.error('Pakai: npm run klip -- <script.json | reels-01> <file video> <nama> [--mulai detik] [--durasi detik]');
  process.exit(1);
}
const key = /\.(json|md)$/i.test(target) ? mediaKey(readScript(path.resolve(process.cwd(), target))) : target;
if (!/^(reels|youtube)-[a-z0-9-]+$/.test(key)) {
  console.error(`✗ Kunci media "${key}" tidak valid. Contoh: reels-01, youtube-03`);
  process.exit(1);
}
const slugName = name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
const dest = path.join(PUBLIC, 'video', key, 'klip', `${slugName}.mp4`);
const from = opt('--mulai') ? parseFloat(opt('--mulai')) : undefined;
const dur = opt('--durasi') ? parseFloat(opt('--durasi')) : undefined;
const {codec, copied} = prepareClip(path.resolve(process.cwd(), src), dest, {from, dur});
console.log(`✓ ${path.relative(process.cwd(), dest)} (${audioDuration(dest).toFixed(1)} dtk, ${codec ?? '?'}${copied ? ', disalin' : ' → H.264'}, tanpa metadata)`);
console.log(`  pakai di script: "props": {"src": "video/${key}/klip/${slugName}.mp4"}`);

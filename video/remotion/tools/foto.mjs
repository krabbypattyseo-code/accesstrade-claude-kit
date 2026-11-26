#!/usr/bin/env node
// Foto → remotion/public/video/<format>-NN/foto/<nama>.jpg, nama netral, metadata (GPS, kamera) dibuang.
//
//   npm run foto -- ../scripts/reels/01-contoh.json ~/Desktop/IMG_2211.jpg produk-depan
//   npm run foto -- reels-01 ~/Desktop/IMG_2211.HEIC produk-depan --blur 470,290,230,60
//
// Argumen pertama: file script ATAU kunci media (reels-01 / youtube-03).
// --blur x,y,w,h: buramkan data pribadi (piksel foto asli). Hasil dipakai di script sebagai "video/reels-01/foto/produk-depan.jpg".
// HEIC dari iPhone diubah dulu ke JPEG lewat `sips` (macOS).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {PUBLIC, ROOT} from '../lib/paths.mjs';
import {IS_MAC, systemPython, venvPython} from '../lib/run.mjs';
import {mediaKey, readScript} from '../lib/scripts.mjs';

const [target, srcArg, name, ...rest] = process.argv.slice(2);
let src = srcArg;
if (!target || !src || !name) {
  console.error('Pakai: npm run foto -- <script.json | reels-01> <foto> <nama> [--blur x,y,w,h]');
  process.exit(1);
}
const key = /\.(json|md)$/i.test(target) ? mediaKey(readScript(path.resolve(process.cwd(), target))) : target;
if (!/^(reels|youtube)-[a-z0-9-]+$/.test(key)) {
  console.error(`✗ Kunci media "${key}" tidak valid. Contoh: reels-01, youtube-03`);
  process.exit(1);
}
// HEIC: macOS diubah lewat sips; di Windows dibaca langsung oleh Pillow + pillow-heif (terpasang lewat npm run setup:python)
if (/\.hei[cf]$/i.test(src) && IS_MAC) {
  const tmp = path.join(os.tmpdir(), `foto-${Date.now()}.jpg`);
  const c = spawnSync('sips', ['-s', 'format', 'jpeg', path.resolve(process.cwd(), src), '--out', tmp], {encoding: 'utf8'});
  if (c.status !== 0) {
    console.error(`✗ sips gagal mengubah HEIC: ${c.stderr}`);
    process.exit(1);
  }
  src = tmp;
}
const outDir = path.join(PUBLIC, 'video', key, 'foto');
const sysPy = systemPython();
const py = venvPython() ?? sysPy?.cmd;
if (!py) {
  console.error('✗ Python belum terpasang. Lihat README bagian Setup.');
  process.exit(1);
}
const r = spawnSync(py, [...(venvPython() ? [] : (sysPy?.pre ?? [])), path.join(ROOT, 'tools', 'foto.py'), outDir, path.resolve(process.cwd(), src), name, ...rest], {stdio: 'inherit', env: {...process.env, FOTO_ASAL: path.basename(srcArg)}});
if (r.status !== 0) {
  console.error('✗ Gagal. Pastikan Pillow terpasang: npm run setup:python');
  process.exit(r.status ?? 1);
}
const slugName = name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
console.log(`  pakai di script: "video/${key}/foto/${slugName}.jpg"`);

#!/usr/bin/env node
// Musik latar → public/musik/<nama>.m4a, dinormalkan ke loudness yang sama dengan suara supaya ducking konsisten.
// Pakai: npm run musik -- ~/Downloads/lagu.mp3 ceria-pelan
// Di script: "media": {"music": {"src": "musik/ceria-pelan.m4a", "volume": 0.4}}  (volume opsional, default dari tokens)
// Hanya musik bebas lisensi atau berlisensi komersial. Catat sumber + lisensinya di public/musik/sumber-musik.txt.
import fs from 'node:fs';
import path from 'node:path';
import {PROPS_DIR, PUBLIC} from '../lib/paths.mjs';
import {normalizeLoudness, toM4a, toPcmWav} from '../lib/audio.mjs';
import {buildBrand} from '../lib/brand.mjs';

const [src, nameRaw] = process.argv.slice(2);
if (!src || !nameRaw) {
  console.error('Pakai: npm run musik -- <file musik> <nama>');
  process.exit(1);
}
const name = nameRaw.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
const abs = path.resolve(process.cwd(), src);
const tmp = path.join(PROPS_DIR, `musik-${name}.wav`);
fs.mkdirSync(PROPS_DIR, {recursive: true});
const pcm = toPcmWav(abs, tmp.replace(/\.wav$/, '-src.wav'));
const ln = normalizeLoudness(pcm, tmp, {I: buildBrand().audio.voiceLufs, mono: false});
if (pcm !== abs) fs.rmSync(pcm);
const out = path.join(PUBLIC, 'musik', `${name}.m4a`);
toM4a(tmp, out);
fs.rmSync(tmp);
fs.appendFileSync(path.join(PUBLIC, 'musik', 'sumber-musik.txt'), `${new Date().toISOString().slice(0, 10)}\t${name}.m4a\t${path.basename(abs)}\t[ISI sumber + lisensi]\n`);
console.log(`✓ public/musik/${name}.m4a (${ln.before.toFixed(1)} → ${ln.after.toFixed(1)} LUFS). Isi sumber + lisensinya di public/musik/sumber-musik.txt`);

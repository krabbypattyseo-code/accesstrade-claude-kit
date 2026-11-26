#!/usr/bin/env node
// Efek suara → remotion/public/sfx/<nama>.wav (WAV 48 kHz). Tanpa normalisasi: atur keras-pelannya lewat "volume" di script.
//   npm run sfx -- ~/Downloads/whoosh.mp3 whoosh
// Di script (per adegan): "sfx": [{"src": "sfx/whoosh.wav", "at": 0, "volume": 0.5}]
// Pakai secukupnya: volume 0,4-0,7, tidak di setiap adegan (playbook-footage.md).
// Hanya efek suara milik sendiri atau berlisensi. Catat sumbernya di public/sfx/sumber-sfx.txt.
import fs from 'node:fs';
import path from 'node:path';
import {PUBLIC} from '../lib/paths.mjs';
import {toPcmWav} from '../lib/audio.mjs';

const [src, nameRaw] = process.argv.slice(2);
if (!src || !nameRaw) {
  console.error('Pakai: npm run sfx -- <file suara> <nama>');
  process.exit(1);
}
const name = nameRaw.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
const abs = path.resolve(process.cwd(), src);
const dest = path.join(PUBLIC, 'sfx', `${name}.wav`);
fs.mkdirSync(path.dirname(dest), {recursive: true});
const wav = toPcmWav(abs, dest);
if (wav !== dest) fs.copyFileSync(wav, dest);
fs.appendFileSync(path.join(PUBLIC, 'sfx', 'sumber-sfx.txt'), `${new Date().toISOString().slice(0, 10)}\t${name}.wav\t${path.basename(abs)}\t[ISI sumber + lisensi]\n`);
console.log(`✓ public/sfx/${name}.wav. Pakai di script: "sfx": [{"src": "sfx/${name}.wav", "at": 0, "volume": 0.5}]`);

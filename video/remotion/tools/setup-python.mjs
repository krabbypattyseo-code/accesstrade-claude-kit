#!/usr/bin/env node
// Sekali saja: buat remotion/.venv dan pasang Whisper (pengenal suara) + Pillow (olah foto, termasuk HEIC).
// Jalan di macOS dan Windows: npm run setup:python
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from '../lib/paths.mjs';
import {systemPython, venvPython} from '../lib/run.mjs';

const PAKET = ['faster-whisper==1.1.1', 'requests', 'pillow', 'pillow-heif'];

const run = (cmd, args) => {
  console.log(`▶ ${path.basename(cmd)} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, {cwd: ROOT, stdio: 'inherit'});
  if (r.status !== 0) {
    console.error(`✗ Gagal (kode ${r.status}).`);
    process.exit(r.status ?? 1);
  }
};

let py = venvPython();
if (!py) {
  const sys = systemPython();
  if (!sys) {
    console.error('✗ Python 3 tidak ditemukan.');
    console.error('  Windows: pasang dari python.org (centang "Add python.exe to PATH") atau: winget install Python.Python.3.12');
    console.error('  macOS  : xcode-select --install');
    process.exit(1);
  }
  run(sys.cmd, [...sys.pre, '-m', 'venv', '.venv']);
  py = venvPython();
  if (!py || !fs.existsSync(py)) {
    console.error('✗ .venv dibuat tapi Python di dalamnya tidak ditemukan.');
    process.exit(1);
  }
}
run(py, ['-m', 'pip', 'install', '--upgrade', 'pip']);
run(py, ['-m', 'pip', 'install', ...PAKET]);
console.log('✓ Python siap. Model Whisper (±460 MB) terunduh otomatis saat pertama memproses rekaman.');

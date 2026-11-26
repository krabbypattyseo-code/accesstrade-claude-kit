// Menjalankan program lain tanpa shell, supaya sama di macOS dan Windows (path boleh berisi spasi).
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from './paths.mjs';

export const IS_WIN = process.platform === 'win32';
export const IS_MAC = process.platform === 'darwin';

/** CLI Remotion dipanggil lewat Node langsung (npx/.cmd di Windows butuh shell). */
export const REMOTION_CLI = path.join(ROOT, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');

/** Jalankan `remotion <args>` (render, still, ffmpeg, ffprobe, ...). */
export const remotion = (args, opts = {}) => {
  if (!fs.existsSync(REMOTION_CLI)) {
    throw new Error('Paket Remotion belum terpasang. Dari folder remotion/: npm install');
  }
  return spawnSync(process.execPath, [REMOTION_CLI, ...args], {cwd: ROOT, maxBuffer: 1 << 28, ...opts});
};

/** Jalankan skrip Node lain di folder remotion/. */
export const node = (args, opts = {}) => spawnSync(process.execPath, args, {cwd: ROOT, ...opts});

/** Python di remotion/.venv (Whisper + Pillow). WHISPER_PYTHON mengalahkan semuanya. */
export const venvPython = () => {
  if (process.env.WHISPER_PYTHON) return process.env.WHISPER_PYTHON;
  const p = IS_WIN ? path.join(ROOT, '.venv', 'Scripts', 'python.exe') : path.join(ROOT, '.venv', 'bin', 'python');
  return fs.existsSync(p) ? p : null;
};

/** Python sistem untuk membuat venv: Windows `py -3` / `python`, macOS `python3`. */
export const systemPython = () => {
  const cands = IS_WIN ? [['py', ['-3']], ['python', []], ['python3', []]] : [['python3', []], ['python', []]];
  for (const [cmd, pre] of cands) {
    const r = spawnSync(cmd, [...pre, '--version'], {encoding: 'utf8'});
    if (r.status === 0 && /Python 3\./.test(`${r.stdout}${r.stderr}`)) return {cmd, pre};
  }
  return null;
};

let sysFf;
/**
 * ffmpeg sistem (versi lengkap), kalau terpasang. Dipakai untuk hal yang tidak bisa dilakukan ffmpeg bawaan
 * Remotion: membaca rekaman ALAC (Voice Memos mode Lossless) di Windows, dan limiter untuk rekaman yang pelan.
 * Pasang: macOS `brew install ffmpeg`, Windows `winget install Gyan.FFmpeg`.
 */
export const systemFfmpeg = () => {
  if (sysFf !== undefined) return sysFf;
  const fixed = ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/usr/bin/ffmpeg'].find((f) => fs.existsSync(f));
  if (fixed) return (sysFf = fixed);
  const r = spawnSync(IS_WIN ? 'where' : 'which', ['ffmpeg'], {encoding: 'utf8'});
  const found = r.status === 0 ? String(r.stdout).split(/\r?\n/).map((s) => s.trim()).find(Boolean) : null;
  return (sysFf = found ?? null);
};

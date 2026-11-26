// Lokasi folder kit. Semua tool Node memakai konstanta ini, jadi struktur folder cukup diubah di sini.
import path from 'node:path';
import {fileURLToPath} from 'node:url';

/** Folder project Remotion (kit/remotion). */
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** Folder kit (induk remotion/). */
export const KIT = path.resolve(ROOT, '..');

export const PUBLIC = path.join(ROOT, 'public');
export const GENERATED = path.join(ROOT, 'src', 'generated');
export const PROPS_DIR = path.join(ROOT, '.render-props');

export const BRAND = path.join(KIT, 'brand');
export const TOKENS = path.join(BRAND, 'tokens.json');
export const SCRIPTS = path.join(KIT, 'scripts');
export const OUTPUT = path.join(KIT, 'output');
export const REKAMAN = path.join(KIT, 'rekaman');

/** Dua format video. Script Reels di scripts/reels/, script YouTube di scripts/youtube/. */
export const FORMATS = ['reels', 'youtube'];

// Membaca brand/tokens.json (milik brand) lalu melengkapinya dengan nilai default kit.
// Hasilnya dipakai sync.mjs (→ src/generated/brand.json untuk video) dan pemeriksaan script (aturan kata).
// Semua field tokens.json opsional. Penjelasan tiap field: brand/README.md.
import fs from 'node:fs';
import {TOKENS} from './paths.mjs';

export const DEFAULT_BRAND = {
  source: 'default kit (brand/tokens.json belum ada)',
  name: 'Nama Brand',
  short: 'Brand',
  handle: '',
  website: '',
  color: {
    background: '#14171F',
    surface: '#232836',
    backgroundLight: '#F5F3EE',
    primary: '#3D5AFE',
    accent: '#FFC93C',
    accentText: '#14171F',
    text: '#FFFFFF',
    textOnLight: '#14171F',
    muted: '#9AA3B5',
    alert: '#E5484D',
    /** teks dan sorotan di latar brand (primary). Kosong = sama dengan text / accent */
    textOnBrand: null,
    accentOnBrand: null,
  },
  font: {
    display: {family: 'Poppins', weights: ['700', '800']},
    body: {family: 'Inter', weights: ['400', '500', '700']},
  },
  logo: {file: null, src: null, width: 360},
  size: {
    reels: {hook: 118, title: 86, body: 50, caption: 70, label: 38, big: 240},
    youtube: {hook: 104, title: 80, body: 44, caption: 50, label: 32, big: 220},
  },
  caption: {
    reels: {maxWords: 4, style: 'karaoke', onHook: true},
    youtube: {maxWords: 8, style: 'subtitle', onHook: true},
  },
  motion: {transition: 'slide', transitionFrames: 14, stagger: 6},
  radius: {card: 32},
  audio: {voiceLufs: -14, musicVolume: 0.5, musicDuckDb: -18},
  rules: {bannedWords: [], maxHookWords: 7, maxOnScreenWords: 12, noEmoji: true},
};

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const isHex = (v) => typeof v === 'string' && HEX.test(v);
const num = (v, d) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const str = (v, d) => (typeof v === 'string' && v.trim() ? v.trim() : d);
const TRANSITIONS = ['slide', 'fade', 'wipe', 'cut'];

/** Baca tokens.json mentah, atau null kalau belum ada / rusak. */
export const readTokens = () => {
  if (!fs.existsSync(TOKENS)) return null;
  try {
    return JSON.parse(fs.readFileSync(TOKENS, 'utf8'));
  } catch (e) {
    console.warn(`! brand/tokens.json tidak bisa dibaca (${e.message}), pakai nilai default kit`);
    return null;
  }
};

/** tokens.json → objek brand lengkap (nilai yang kosong atau salah format jatuh ke default). */
export const buildBrand = (t = readTokens()) => {
  const b = structuredClone(DEFAULT_BRAND);
  if (!t) {
    b.color.textOnBrand = b.color.text;
    b.color.accentOnBrand = b.color.accent;
    return b;
  }
  b.source = `brand/tokens.json${t.version ? ` v${t.version}` : ''}`;

  const id = t.brand ?? {};
  b.name = str(id.name, b.name);
  b.short = str(id.short, b.name);
  b.handle = str(id.handle, '');
  b.website = str(id.website, '');

  for (const k of Object.keys(b.color)) {
    const v = t.color?.[k];
    if (v === undefined || v === null) continue;
    if (isHex(v)) b.color[k] = v;
    else console.warn(`! tokens.color.${k} bukan kode hex (${v}), pakai ${b.color[k]}`);
  }

  for (const k of ['display', 'body']) {
    const f = t.font?.[k];
    if (typeof f === 'string') b.font[k].family = f;
    else if (f && typeof f === 'object') {
      b.font[k].family = str(f.family, b.font[k].family);
      if (Array.isArray(f.weights) && f.weights.length) b.font[k].weights = f.weights.map(String);
    }
  }

  b.color.textOnBrand = b.color.textOnBrand ?? b.color.text;
  b.color.accentOnBrand = b.color.accentOnBrand ?? b.color.accent;

  if (t.logo?.file) b.logo.file = String(t.logo.file);
  b.logo.width = num(t.logo?.width, b.logo.width);

  for (const fmt of ['reels', 'youtube']) {
    for (const k of Object.keys(b.size[fmt])) b.size[fmt][k] = num(t.size?.[fmt]?.[k], b.size[fmt][k]);
    b.caption[fmt].maxWords = num(t.caption?.[fmt]?.maxWords, b.caption[fmt].maxWords);
    const style = t.caption?.[fmt]?.style;
    if (['karaoke', 'subtitle'].includes(style)) b.caption[fmt].style = style;
    if (typeof t.caption?.[fmt]?.onHook === 'boolean') b.caption[fmt].onHook = t.caption[fmt].onHook;
  }

  const tr = t.motion?.transition;
  if (tr !== undefined) {
    if (TRANSITIONS.includes(tr)) b.motion.transition = tr;
    else console.warn(`! tokens.motion.transition "${tr}" tidak dikenal (pilihan: ${TRANSITIONS.join(', ')})`);
  }
  b.motion.transitionFrames = num(t.motion?.transitionFrames, b.motion.transitionFrames);
  b.motion.stagger = num(t.motion?.stagger, b.motion.stagger);
  b.radius.card = num(t.radius?.card, b.radius.card);

  b.audio.voiceLufs = num(t.audio?.voiceLufs, b.audio.voiceLufs);
  b.audio.musicVolume = num(t.audio?.musicVolume, b.audio.musicVolume);
  b.audio.musicDuckDb = num(t.audio?.musicDuckDb, b.audio.musicDuckDb);

  const r = t.rules ?? {};
  b.rules.maxHookWords = num(r.maxHookWords, b.rules.maxHookWords);
  b.rules.maxOnScreenWords = num(r.maxOnScreenWords, b.rules.maxOnScreenWords);
  if (typeof r.noEmoji === 'boolean') b.rules.noEmoji = r.noEmoji;
  // bannedWords: ["kata"] atau [{"pattern": "regex", "message": "alasan"}]
  b.rules.bannedWords = (Array.isArray(r.bannedWords) ? r.bannedWords : [])
    .map((w) => (typeof w === 'string' ? {pattern: `\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, message: `hindari "${w}"`} : w))
    .filter((w) => w && typeof w.pattern === 'string');
  return b;
};

/** Aturan kata terlarang dari brand → [RegExp, pesan]. Pola yang salah tulis dilewati dengan peringatan. */
export const bannedRules = (brand = buildBrand()) =>
  brand.rules.bannedWords.flatMap((w) => {
    try {
      return [[new RegExp(w.pattern, w.flags ?? 'i'), w.message ?? `hindari pola ${w.pattern}`]];
    } catch (e) {
      console.warn(`! tokens.rules.bannedWords: pola "${w.pattern}" tidak valid (${e.message})`);
      return [];
    }
  });

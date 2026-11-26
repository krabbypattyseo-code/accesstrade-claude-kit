// Menyusun DATA untuk aekit.jsx dari script yang sudah di-prepare oleh lib Remotion (prepareScript).
// Dipakai ae/build.mjs dan ae/tools/mock-ae.mjs, jadi yang diuji mock = yang dikirim ke After Effects.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {BRAND, PUBLIC} from '../../remotion/lib/paths.mjs';
import {formatOf, numberOf, outputBase, slug, videoName} from '../../remotion/lib/scripts.mjs';

export const AE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const JSX_DIR = path.join(AE_DIR, 'jsx');
export const AEKIT_JSX = path.join(JSX_DIR, 'aekit.jsx');
export const INVENTARIS_JSX = path.join(JSX_DIR, 'inventaris.jsx');
export const PROYEK_DIR = path.join(AE_DIR, 'proyek');
export const PROFIL_JSON = path.join(AE_DIR, 'profil-ae.json');
/** opsional, diisi manusia: {"Poppins 800": "Poppins-ExtraBold", ...} kalau nama PostScript di PC berbeda */
export const FONT_MANUAL = path.join(AE_DIR, 'font-manual.json');

/** Kanvas dan zona aman. Angka sama dengan FORMATS di remotion/src/theme.ts: ubah di dua tempat. */
export const SPEC = {
  reels: {
    id: 'reels', width: 1080, height: 1920, fps: 30, vertical: true,
    safe: {top: 250, bottom: 420, left: 72, right: 120},
    content: {x: 72, y: 300, w: 888, h: 860},
    captionY: 1230,
  },
  youtube: {
    id: 'youtube', width: 1920, height: 1080, fps: 30, vertical: false,
    safe: {top: 80, bottom: 90, left: 140, right: 140},
    content: {x: 140, y: 110, w: 1640, h: 690},
    captionY: 870,
  },
};

export const specOf = (format, brand) => ({
  ...SPEC[format],
  size: {...brand.size[format]},
  caption: {...brand.caption[format], onHook: brand.caption[format]?.onHook !== false},
});

/** path untuk ExtendScript: garis miring maju (C:/Users/...), aman untuk #include dan new File() */
export const toJsxPath = (p) => String(p).replace(/\\/g, '/');

const isUrl = (s) => /^https?:/i.test(String(s));
/** media relatif ke remotion/public/ -> path absolut (URL dibiarkan, aekit memberi peringatan) */
export const absMedia = (rel) => {
  if (!rel || typeof rel !== 'string') return rel;
  if (isUrl(rel)) return rel;
  return toJsxPath(path.isAbsolute(rel) ? rel : path.join(PUBLIC, rel));
};

// ---------------------------------------------------------------- font

const STYLE = {400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black'};
const STYLE_ALIASES = {
  400: ['regular', 'normal', 'book', 'roman'],
  500: ['medium'],
  600: ['semibold', 'demibold'],
  700: ['bold'],
  800: ['extrabold', 'ultrabold'],
  900: ['black', 'heavy'],
};
/** peran font yang dipakai aekit.jsx: [font brand, ketebalan CSS] */
export const FONT_ROLES = {
  display800: ['display', 800],
  display700: ['display', 700],
  body800: ['body', 800],
  body700: ['body', 700],
  body600: ['body', 600],
  body500: ['body', 500],
};
const normStyle = (s) => String(s ?? '').toLowerCase().replace(/[\s_-]+/g, '');
const normFam = (s) => String(s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Cari nama PostScript di daftar font profil-ae.json (inventaris), kalau tidak ada: tebakan Google Fonts. */
export const fontMap = (brand, profil = null, manual = {}) => {
  const list = Array.isArray(profil?.fonts?.list) ? profil.fonts.list : [];
  const map = {};
  const detail = [];
  for (const [role, [kind, weight]] of Object.entries(FONT_ROLES)) {
    const family = brand.font[kind].family;
    const key = `${family} ${weight}`;
    let ps = null;
    let sumber = 'tebakan';
    if (manual && typeof manual[key] === 'string') {
      ps = manual[key];
      sumber = 'font-manual.json';
    } else if (list.length) {
      const fam = normFam(family);
      const styles = STYLE_ALIASES[weight] ?? [];
      const pick = (exact) =>
        list.find((f) => (exact ? normFam(f.family) === fam : normFam(f.family).startsWith(`${fam} `)) && styles.includes(normStyle(f.style)) && f.postScriptName);
      const hit = pick(true) ?? pick(false);
      if (hit) {
        ps = hit.postScriptName;
        sumber = 'profil-ae.json';
      } else sumber = 'tebakan (tidak ada di daftar font PC)';
    }
    if (!ps) ps = `${family.replace(/\s+/g, '')}-${STYLE[weight] ?? 'Regular'}`;
    map[role] = ps;
    detail.push({role, family, weight, postScriptName: ps, sumber});
  }
  return {map, detail};
};

// ---------------------------------------------------------------- DATA

const absProps = (p = {}) => {
  const out = {...p};
  if (out.image) out.image = absMedia(out.image);
  if (Array.isArray(out.images)) out.images = out.images.map((im) => (typeof im === 'string' ? absMedia(im) : im && typeof im === 'object' ? {...im, src: absMedia(im.src)} : im));
  for (const side of ['left', 'right']) if (out[side]?.image) out[side] = {...out[side], image: absMedia(out[side].image)};
  if (out.src) out.src = absMedia(out.src);
  return out;
};

/** Nama comp utama: "REELS 01 slug" / "YOUTUBE 01 slug" */
export const mainCompName = (script) => `${formatOf(script).toUpperCase()} ${numberOf(script)} ${slug(script.slug || script.title || 'video')}`;

/** Path .aep yang belum dipakai: NN-slug.aep, kalau sudah ada NN-slug-v2.aep, -v3, ... (hasil editor tidak ditimpa) */
export const freeAepPath = (base, overwrite = false) => {
  const first = `${base}.aep`;
  if (overwrite || !fs.existsSync(first)) return first;
  for (let i = 2; i < 200; i++) {
    const p = `${base}-v${i}.aep`;
    if (!fs.existsSync(p)) return p;
  }
  return `${base}-${Date.now()}.aep`;
};

/**
 * script (hasil prepareScript) + brand (buildBrand) -> DATA untuk AEKIT.build(DATA).
 * Semua path media dijadikan absolut dengan garis miring maju.
 */
export const buildData = (script, brand, {profil = null, manual = {}, options = {}, runId = '', paths = {}} = {}) => {
  const format = formatOf(script);
  const fonts = fontMap(brand, profil, manual);
  const media = script.media ?? {};
  const musicRaw = media.music;
  const music = musicRaw
    ? typeof musicRaw === 'string'
      ? {src: absMedia(musicRaw), volume: brand.audio.musicVolume}
      : {src: absMedia(musicRaw.src), volume: musicRaw.volume ?? brand.audio.musicVolume}
    : null;
  let logoPath = null;
  if (brand.logo?.file) {
    const f = path.resolve(BRAND, brand.logo.file);
    if (fs.existsSync(f)) logoPath = toJsxPath(f);
  }
  const base = outputBase(script);
  const proyek = path.join(PROYEK_DIR, `${format}-${videoName(script)}`);
  return {
    kit: 'aekit',
    runId,
    format,
    spec: specOf(format, brand),
    brand: {...brand, logo: {...brand.logo, path: logoPath}},
    fonts: fonts.map,
    fontDetail: fonts.detail,
    names: {main: mainCompName(script), base: videoName(script)},
    script: {
      format,
      number: numberOf(script),
      slug: script.slug ?? null,
      title: script.title ?? null,
      demo: Boolean(script.demo),
      captions: script.captions !== false,
      chapterIntro: script.chapterIntro ?? null,
      _file: script._file ?? null,
      scenes: script.scenes.map((s) => ({
        ...s,
        props: absProps(s.props ?? {}),
        sfx: Array.isArray(s.sfx) ? s.sfx.map((fx) => ({...fx, src: absMedia(fx?.src)})) : [],
      })),
      clips: (media.clips ?? []).map((c) => ({sceneId: c.sceneId, src: absMedia(c.src), start: c.start, duration: c.duration})),
      words: script.words ?? [],
      music,
    },
    paths: {
      aep: toJsxPath(paths.aep ?? `${base}.aep`),
      mp4: toJsxPath(paths.mp4 ?? `${base}-ae${options.draft ? '-draft' : ''}.mp4`),
      result: toJsxPath(paths.result ?? path.join(proyek, 'hasil.json')),
      frames: toJsxPath(paths.frames ?? path.join(proyek, 'frames')),
      proyek: toJsxPath(paths.proyek ?? proyek),
    },
    options: {frames: Boolean(options.frames), draft: Boolean(options.draft), overwrite: Boolean(options.overwrite)},
  };
};

/** Objek -> literal JS yang aman untuk ExtendScript: semua karakter non-ASCII ditulis \uXXXX. */
export const jsxLiteral = (obj) =>
  JSON.stringify(obj, null, 1).replace(/[\u007f-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);

const stamp = () => {
  const d = new Date(), p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

/** Isi build.jsx: #include aekit.jsx (path absolut, garis miring maju) lalu AEKIT.build(DATA). */
export const renderBuildJsx = (data, aekitPath = AEKIT_JSX) =>
  [
    `// Dibuat otomatis oleh ae/build.mjs (${stamp()}). Jangan diedit: ubah script lalu build ulang.`,
    '#target aftereffects',
    `#include ${JSON.stringify(toJsxPath(aekitPath))}`,
    `var DATA = ${jsxLiteral(data)};`,
    'AEKIT.build(DATA);',
    '',
  ].join('\n');

/** Pembungkus inventaris.jsx: folder tujuan + runId + font brand yang perlu dicek. */
export const renderInventarisJsx = ({outDir, runId, families = [], inventarisPath = INVENTARIS_JSX}) =>
  [
    `// Dibuat otomatis oleh ae/build.mjs --inventaris (${stamp()}).`,
    '#target aftereffects',
    `var AEKIT_INVENTARIS_OUT = ${jsxLiteral(toJsxPath(outDir))};`,
    `var AEKIT_RUN_ID = ${jsxLiteral(runId)};`,
    `var AEKIT_FONT_FAMILIES = ${jsxLiteral(families)};`,
    'var AEKIT_NO_ALERT = true;',
    `#include ${JSON.stringify(toJsxPath(inventarisPath))}`,
    '',
  ].join('\n');

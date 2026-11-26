// Baca, lengkapi, dan periksa script video (Node, bukan bundle Remotion).
// Dipakai render.mjs, sync.mjs, tools/cek.mjs, tools/vo.mjs, tools/demo-vo.mjs.
import fs from 'node:fs';
import path from 'node:path';
import {FORMATS, KIT, OUTPUT, PUBLIC, SCRIPTS} from './paths.mjs';
import {audioDuration} from './audio.mjs';
import {bannedRules, buildBrand} from './brand.mjs';
import {wordsOf} from './words.mjs';

const AUDIO = /\.(wav|mp3|m4a|aac|ogg|flac)$/i;

// ---------------------------------------------------------------- baca script

/** File .json, atau .md yang berisi blok ```json dengan "scenes" (blok pertama yang cocok). */
export const readScript = (file) => {
  const raw = fs.readFileSync(file, 'utf8');
  const tryParse = (s) => {
    try {
      const j = JSON.parse(s);
      return j && Array.isArray(j.scenes) ? j : null;
    } catch {
      return null;
    }
  };
  const rel = path.relative(KIT, file);
  const direct = tryParse(raw);
  if (direct) return {...direct, _file: rel};
  for (const m of raw.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)) {
    const j = tryParse(m[1]);
    if (j) return {...j, _file: rel};
  }
  throw new Error(`Tidak menemukan JSON script dengan "scenes" di ${file}`);
};

export const slug = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** "0" → "00", 7 → "07", "12" → "12" */
export const numberOf = (script) => {
  const n = String(script.number ?? script.nomor ?? '00').trim();
  return /^\d+$/.test(n) ? n.padStart(2, '0') : slug(n);
};

/** "reels" atau "youtube": dari field `format`, kalau kosong dari folder script (scripts/reels/ atau scripts/youtube/). */
export const formatOf = (script) => {
  const f = String(script.format ?? '').toLowerCase();
  if (FORMATS.includes(f)) return f;
  const fromPath = String(script._file ?? '')
    .split(/[\\/]/)
    .find((p) => FORMATS.includes(p));
  return fromPath ?? 'reels';
};

/** Nama dasar output: NN-<slug>, mis. 01-tiga-salah-kaprah */
export const videoName = (script) => `${numberOf(script)}-${slug(script.slug || script.title || 'video')}`;
/** Kunci media per video: reels-01 / youtube-01 (nomor boleh sama antar format) */
export const mediaKey = (script) => `${formatOf(script)}-${numberOf(script)}`;
/** Folder media di public/: video/reels-01/ (foto/, vo/) */
export const mediaRel = (script) => path.posix.join('video', mediaKey(script));
/** output/reels/01-slug (tanpa ekstensi) */
export const outputBase = (script) => path.join(OUTPUT, formatOf(script), videoName(script));

// ---------------------------------------------------------------- tipe adegan

const TYPE_ALIASES = {
  hook: ['hook', 'pembuka', 'intro', 'judul'],
  bab: ['bab', 'chapter', 'bagian', 'segmen'],
  poin: ['poin', 'point', 'pernyataan', 'statement', 'teks', 'text'],
  daftar: ['daftar', 'list', 'tips', 'langkah', 'steps'],
  angka: ['angka', 'stat', 'statistik', 'number', 'data'],
  kutipan: ['kutipan', 'quote'],
  foto: ['foto', 'photo', 'gambar', 'image'],
  banding: ['banding', 'perbandingan', 'compare', 'vs', 'mitos-fakta', 'sebelum-sesudah'],
  outro: ['outro', 'cta', 'penutup', 'endscreen', 'end-screen'],
  klip: ['klip', 'clip', 'broll', 'b-roll', 'footage', 'rekaman-layar'],
};
export const SCENE_TYPES = Object.keys(TYPE_ALIASES);
/** Nama tipe baku, atau null kalau tidak dikenal. */
export const normalizeType = (raw) => {
  const low = String(raw ?? '').trim().toLowerCase();
  for (const [k, list] of Object.entries(TYPE_ALIASES)) if (k === low || list.includes(low)) return k;
  return null;
};

const TRANSITIONS = ['slide', 'fade', 'wipe', 'cut'];

const toSec = (v) =>
  typeof v === 'number' ? v : String(v ?? 0).replace(',', '.').split(':').reduce((a, n) => a * 60 + (parseFloat(n) || 0), 0);

// ---------------------------------------------------------------- timing

/** Durasi default per format. Outro YouTube 12 dtk = ruang untuk end screen (YouTube: 5-20 dtk terakhir). */
export const TIMING = {
  reels: {defaultDur: 3, leadIn: 0.25, tail: 0.4, outroMin: 2.5},
  youtube: {defaultDur: 4, leadIn: 0.3, tail: 0.5, outroMin: 12},
};

/**
 * Lengkapi script: format, tipe adegan baku, start/end berurutan, rekaman per adegan dari public/video/<kunci>/vo/,
 * sinkron kata (`onWord`), tanda [KONFIRMASI], dan waktu kata untuk caption.
 * Kalau ada rekaman, panjang tiap adegan = jeda awal + rekaman + jeda akhir (+ `extra`), jadi `dur` cukup perkiraan.
 */
export const prepareScript = (script, {quiet = false} = {}) => {
  const warn = quiet ? () => {} : (m) => console.warn(m);
  const format = formatOf(script);
  const T = TIMING[format];
  const rel = mediaRel(script);
  const dir = path.join(PUBLIC, rel);

  // 1) tipe baku + start/end. Kalau start/end kosong: pakai `dur` atau default format, berurutan.
  let cursor = 0;
  let scenes = script.scenes.map((s, i) => {
    const type = normalizeType(s.type) ?? 'poin';
    const hasTimes = s.start !== undefined && s.end !== undefined;
    const start = hasTimes ? toSec(s.start) : cursor;
    const dflt = type === 'outro' ? T.outroMin : T.defaultDur;
    const end = hasTimes ? toSec(s.end) : start + (toSec(s.dur) || dflt);
    cursor = end;
    return {...s, id: s.id ?? i + 1, type, rawType: s.type, start, end};
  });
  scenes.sort((a, b) => a.start - b.start);

  // 2) musik (opsional)
  const media = {...(script.media || {})};
  delete media.clips;
  const musicSrc = typeof media.music === 'object' && media.music ? media.music.src : media.music;
  if (musicSrc && !/^https?:/.test(musicSrc) && !fs.existsSync(path.join(PUBLIC, musicSrc))) {
    warn(`! media.music tidak ditemukan di public/: ${musicSrc} (diabaikan)`);
    delete media.music;
  }

  // 3) rekaman per adegan di vo/ (hasil npm run vo atau npm run demo-vo)
  const voDir = path.join(dir, 'vo');
  const voFiles = fs.existsSync(voDir) ? fs.readdirSync(voDir).filter((f) => AUDIO.test(f) && !f.startsWith('.')) : [];
  const clips = [];
  if (voFiles.length) {
    const findClip = (id) => voFiles.find((f) => path.parse(f).name === String(id));
    let kata = {};
    try {
      kata = fs.existsSync(path.join(voDir, 'kata.json')) ? JSON.parse(fs.readFileSync(path.join(voDir, 'kata.json'), 'utf8')) : {};
    } catch {
      kata = {};
    }
    let t = 0;
    scenes = scenes.map((s) => {
      const f = s.vo ? findClip(s.id) : undefined;
      const minDur = s.minDur ?? (s.type === 'outro' ? T.outroMin : 1.5);
      let dur = Math.max(0.5, s.end - s.start);
      if (f) {
        const d = audioDuration(path.join(voDir, f));
        clips.push({sceneId: s.id, src: `${rel}/vo/${f}`, start: +(t + T.leadIn).toFixed(3), duration: +d.toFixed(3), words: kata[s.id] ?? kata[String(s.id)]});
        dur = Math.max(minDur, T.leadIn + d + T.tail + (s.extra ?? 0));
      }
      const out = {...s, start: +t.toFixed(3), end: +(t + dur).toFixed(3)};
      t += dur;
      return out;
    });
    const missing = scenes.filter((s) => s.vo && !findClip(s.id)).map((s) => s.id);
    if (missing.length) warn(`! belum ada rekaman untuk adegan: ${missing.join(', ')} (pakai durasi dari script)`);
  }
  media.clips = clips;

  // 4) tanda [KONFIRMASI] di teks layar: video belum boleh tayang
  scenes = scenes.map((s) => ({...s, needsConfirm: /\[KONFIRMASI\]/i.test(JSON.stringify({onScreen: s.onScreen, props: s.props ?? {}}))}));

  // 5) sinkron ke kata di rekaman: poin daftar (`items[].onWord`), foto (`images[].onWord`), sisi kanan banding (`revealOnWord`)
  const normW = (w) => String(w ?? '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  scenes = scenes.map((s) => {
    const c = clips.find((k) => String(k.sceneId) === String(s.id));
    const p = s.props ?? {};
    if (!c?.words?.length) return s;
    const off = c.start - s.start;
    const find = (w, afterMs = -1) => c.words.find((x) => normW(x.text) === normW(w) && x.startMs > afterMs);
    const at = (w, lead) => +Math.max(0, off + w.startMs / 1000 - lead).toFixed(2);
    const props = {...p};
    if (p.revealOnWord) {
      const w = find(p.revealOnWord);
      if (w) props.revealAt = at(w, 0.2);
    }
    for (const key of ['items', 'images']) {
      if (!Array.isArray(p[key])) continue;
      let last = -1;
      props[key] = p[key].map((it) => {
        if (!it || typeof it !== 'object' || !it.onWord) return it;
        const w = find(it.onWord, last);
        if (!w) return it;
        last = w.startMs;
        return {...it, at: at(w, 0.15)};
      });
    }
    return {...s, props};
  });

  const prepared = {...script, format, number: numberOf(script), scenes, media};
  prepared.words = wordsOf(scenes, clips);
  return prepared;
};

// ---------------------------------------------------------------- pemeriksaan

const countWords = (t) => String(t ?? '').replace(/\*/g, '').split(/\s+/).filter(Boolean).length;
const strip = (t) => String(t ?? '').replace(/\*/g, '');

/** Bab YouTube → daftar chapter untuk deskripsi. Chapter pertama selalu 0:00. */
export const chaptersOf = (script) => {
  const babs = script.scenes.filter((s) => s.type === 'bab');
  const list = babs.map((s) => ({t: s.start, title: strip(s.props?.title ?? s.onScreen ?? `Bab ${s.props?.number ?? ''}`).trim()}));
  if (!list.length || list[0].t > 0.5) list.unshift({t: 0, title: script.chapterIntro ?? 'Pembuka'});
  else list[0].t = 0;
  return list;
};

export const timestamp = (sec) => {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`;
};

/** Periksa script yang sudah di-prepare. errors = render dibatalkan, warnings = perlu dicek manusia. */
export const checkScript = (script) => {
  const errors = [];
  const warnings = [];
  const brand = buildBrand();
  const banned = bannedRules(brand);
  const fmt = script.format;
  const imgs = [];
  if (!script.scenes.length) errors.push('script tidak punya adegan');

  for (const s of script.scenes) {
    const p = s.props ?? {};
    const tag = `adegan ${s.id} (${s.type})`;
    if (!normalizeType(s.rawType)) warnings.push(`adegan ${s.id}: tipe "${s.rawType}" tidak dikenal, dipakai sebagai "poin". Pilihan: ${SCENE_TYPES.join(', ')}`);
    if (p.image) imgs.push([s.id, p.image]);
    for (const im of p.images ?? []) imgs.push([s.id, typeof im === 'string' ? im : im?.src]);
    for (const side of ['left', 'right']) if (p[side]?.image) imgs.push([s.id, p[side].image]);
    if (s.type === 'klip' && p.src) imgs.push([s.id, p.src]);
    for (const fx of s.sfx ?? []) imgs.push([s.id, fx?.src]);

    // isi wajib per tipe
    if (s.type === 'daftar' && !(p.items ?? []).length) errors.push(`${tag}: wajib props.items`);
    if (s.type === 'angka' && (p.value === undefined || p.value === '')) errors.push(`${tag}: wajib props.value`);
    if (s.type === 'angka' && !p.source && !script.demo) warnings.push(`${tag}: angka tanpa props.source. Cantumkan sumber datanya`);
    if (s.type === 'kutipan' && !p.quote) errors.push(`${tag}: wajib props.quote`);
    if (s.type === 'foto' && !p.image && !(p.images ?? []).length) errors.push(`${tag}: wajib props.image atau props.images`);
    if (s.type === 'banding' && !(p.left && p.right)) errors.push(`${tag}: wajib props.left dan props.right`);
    if (s.type === 'bab' && fmt === 'reels') warnings.push(`${tag}: tipe bab untuk YouTube, di Reels sebaiknya pakai poin`);
    if (s.type === 'klip' && !p.src) errors.push(`${tag}: wajib props.src (hasil npm run klip)`);
    if (s.type === 'klip' && p.src && !/\.(mp4|mov|webm)$/i.test(p.src)) errors.push(`${tag}: props.src harus file video .mp4 (hasil npm run klip)`);
    if (s.sfx && !Array.isArray(s.sfx)) errors.push(`adegan ${s.id}: sfx harus daftar, mis. [{"src": "sfx/whoosh.wav", "at": 0, "volume": 0.5}]`);
    for (const fx of Array.isArray(s.sfx) ? s.sfx : []) if (typeof fx?.volume === 'number' && fx.volume > 0.8) warnings.push(`adegan ${s.id}: sfx ${fx.src} volume ${fx.volume}, playbook menyarankan 0,4-0,7`);

    // panjang teks layar
    if (s.type === 'hook' && countWords(s.onScreen) > brand.rules.maxHookWords) warnings.push(`${tag}: ${countWords(s.onScreen)} kata, maks ${brand.rules.maxHookWords} untuk hook`);
    else if (countWords(s.onScreen) > brand.rules.maxOnScreenWords) warnings.push(`${tag}: teks layar ${countWords(s.onScreen)} kata, maks ${brand.rules.maxOnScreenWords}`);

    // aturan kata dari brand
    const shown = [
      s.onScreen, p.kicker, p.title, p.sub, p.label, p.value, p.quote, p.by, p.cta, p.text,
      ...(p.items ?? []).map((x) => x?.text ?? x),
      ...(p.images ?? []).map((x) => x?.text),
      p.left?.label, p.left?.text, p.right?.label, p.right?.text,
    ]
      .filter((x) => x !== undefined && x !== null)
      .join(' ');
    const said = `${shown} ${s.vo ?? ''}`;
    for (const [re, msg] of banned) if (re.test(said)) warnings.push(`adegan ${s.id}: ${msg}`);
    if (brand.rules.noEmoji && /\p{Extended_Pictographic}/u.test(shown)) warnings.push(`adegan ${s.id}: ada emoji di teks layar`);
    if (s.needsConfirm) warnings.push(`adegan ${s.id}: ada [KONFIRMASI] di layar → BELUM BOLEH TAYANG`);

    // vo
    if (s.vo && countWords(s.vo) > 25 && !/[.?!]/.test(s.vo)) warnings.push(`adegan ${s.id}: vo panjang tanpa titik/tanda tanya. Pecah jadi kalimat supaya pencocokan rekaman akurat`);
    const voToks = String(s.vo ?? '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/);
    const onWords = [p.revealOnWord, ...(p.items ?? []).map((i) => i?.onWord), ...(p.images ?? []).map((i) => i?.onWord)].filter(Boolean);
    for (const w of onWords) if (!voToks.includes(String(w).toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''))) warnings.push(`adegan ${s.id}: kata "${w}" (onWord) tidak ada di teks vo`);
    if (s.transition && !TRANSITIONS.includes(s.transition)) warnings.push(`adegan ${s.id}: transisi "${s.transition}" tidak dikenal (pilihan: ${TRANSITIONS.join(', ')})`);
  }

  for (const [id, img] of imgs) {
    if (!img) continue;
    if (/^https?:/.test(img)) continue;
    const what = /\.(mp4|mov|webm)$/i.test(img) ? 'klip' : /\.(wav|mp3|m4a)$/i.test(img) ? 'suara' : 'gambar';
    const tool = what === 'klip' ? 'npm run klip' : what === 'suara' ? 'npm run sfx' : 'npm run foto';
    if (img.includes('..') || path.isAbsolute(img)) errors.push(`adegan ${id}: ${what} harus di remotion/public/ (pakai ${tool}), bukan ${img}`);
    else if (!fs.existsSync(path.join(PUBLIC, img))) errors.push(`adegan ${id}: ${what} tidak ditemukan di remotion/public/: ${img}`);
  }

  // aturan per format
  const first = script.scenes[0];
  const last = script.scenes[script.scenes.length - 1];
  const total = last ? last.end : 0;
  if (first && first.type !== 'hook') warnings.push(`adegan pertama sebaiknya hook (sekarang ${first.type})`);
  if (last && last.type !== 'outro') warnings.push(`adegan terakhir sebaiknya outro (sekarang ${last.type})`);
  if (fmt === 'reels') {
    if (total > 90) warnings.push(`durasi ${total.toFixed(0)} dtk. Reels idealnya di bawah 90 dtk`);
  } else {
    const ch = chaptersOf(script);
    if (ch.length < 3) warnings.push(`baru ${ch.length} chapter (termasuk pembuka). YouTube butuh minimal 3 supaya chapter muncul: tambah adegan bab`);
    ch.forEach((c, i) => {
      const end = ch[i + 1]?.t ?? total;
      if (end - c.t < 10) warnings.push(`chapter "${c.title}" cuma ${(end - c.t).toFixed(0)} dtk. YouTube minta minimal 10 dtk per chapter`);
    });
    if (last?.type === 'outro') {
      const d = last.end - last.start;
      if (d < 5 || d > 20) warnings.push(`outro ${d.toFixed(0)} dtk. End screen YouTube butuh 5-20 dtk terakhir`);
    }
  }
  return {errors, warnings};
};

export const readyToPost = (script) => !script.demo && !script.scenes.some((s) => s.needsConfirm);

// ---------------------------------------------------------------- daftar script + indeks render

/** Semua script di scripts/reels/ dan scripts/youtube/ (file berawalan _ atau . dilewati). */
export const listScripts = () =>
  FORMATS.flatMap((f) => {
    const dir = path.join(SCRIPTS, f);
    return fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((x) => /\.(json|md)$/i.test(x) && !/^[._]/.test(x))
          .sort()
          .map((x) => path.join(dir, x))
      : [];
  });

/** Tulis output/daftar-render.md: semua script + status. Dibaca manusia sebelum upload. */
export const writeRenderIndex = () => {
  const rows = [];
  for (const file of listScripts()) {
    let s;
    try {
      s = prepareScript(readScript(file), {quiet: true});
    } catch {
      continue;
    }
    const base = outputBase(s);
    const rel = (f) => path.relative(OUTPUT, f);
    const mp4 = `${base}.mp4`;
    const coverFile = s.format === 'youtube' ? `${base}-thumbnail.jpg` : `${base}-cover.jpg`;
    const has = fs.existsSync(mp4);
    const konf = s.scenes.filter((x) => x.needsConfirm).map((x) => x.id);
    const hasVo = s.media.clips.length > 0;
    const status = s.demo
      ? 'Demo, tidak untuk tayang'
      : konf.length
        ? `Belum siap: [KONFIRMASI] di adegan ${konf.join(', ')}`
        : !hasVo
          ? 'Menunggu rekaman suara'
          : has
            ? 'Siap dicek sebelum upload'
            : 'Rekaman ada, belum dirender';
    rows.push(
      `| ${s.format} | ${s.number} | ${s.title ?? s.slug ?? ''} | ${has ? `\`${rel(mp4)}\`` : '-'} | ${fs.existsSync(coverFile) ? `\`${rel(coverFile)}\`` : '-'} | ${status} | \`${s._file}\` |`,
    );
  }
  const md = [
    '# Daftar render',
    '',
    '> Dibuat otomatis oleh `remotion/render.mjs` setiap render. Jangan diedit manual.',
    '> Video berstatus "Belum siap" atau "Demo" tidak boleh diupload. Upload selalu dicek manusia dulu.',
    '',
    '| Format | No | Judul | Video | Cover | Status | Script |',
    '|---|---|---|---|---|---|---|',
    ...rows,
    '',
  ].join('\n');
  fs.mkdirSync(OUTPUT, {recursive: true});
  fs.writeFileSync(path.join(OUTPUT, 'daftar-render.md'), md);
  return rows.length;
};

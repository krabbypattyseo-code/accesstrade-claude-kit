import type {Scene, Word} from './types';

/** Bagi teks jadi kata dengan waktu, bobot = panjang kata. Sama dengan lib/words.mjs. */
export const spreadWords = (text: string, startMs: number, endMs: number): Word[] => {
  const toks = text.split(/\s+/).filter(Boolean);
  if (!toks.length) return [];
  const weights = toks.map((t) => Math.max(2, t.replace(/[^\p{L}\p{N}]/gu, '').length) + 1 + (/[.,!?;:]$/.test(t) ? 2 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = startMs;
  return toks.map((tok, i) => {
    const d = ((endMs - startMs) * weights[i]) / total;
    const w = {text: tok, startMs: Math.round(t), endMs: Math.round(t + d)};
    t += d;
    return w;
  });
};

/** Cadangan kalau props.words kosong (mis. script dibuka langsung di Studio tanpa sync). */
export const wordsFromScenes = (scenes: Scene[]): Word[] =>
  scenes.flatMap((s) => (s.vo ? spreadWords(s.vo, s.start * 1000 + 200, s.end * 1000 - 300) : []));

/** "Tiga *salah kaprah* soal tidur" → [{text, hi}] untuk sorotan kata. */
export const splitHighlight = (text: string): {text: string; hi: boolean}[] =>
  text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((p) => (p.startsWith('*') && p.endsWith('*') ? {text: p.slice(1, -1), hi: true} : {text: p, hi: false}));

/** Kata per kata dengan tanda sorotan, untuk animasi muncul per kata. */
export const highlightWords = (text: string) =>
  splitHighlight(text).flatMap((part) =>
    part.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({text: w, hi: part.hi})),
  );

export const stripHighlight = (text: string) => text.replace(/\*/g, '');

/** "73%" → {prefix:'', n:73, decimals:0, suffix:'%'}; "Rp1.250.000" → {prefix:'Rp', n:1250000, ...}. Gagal → null. */
export const parseNumber = (value: string | number) => {
  if (typeof value === 'number') return {prefix: '', n: value, decimals: String(value).split('.')[1]?.length ?? 0, suffix: '', grouping: true};
  const m = String(value).match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!m) return null;
  const raw = m[2];
  // format Indonesia: titik = ribuan, koma = desimal ("1.250.000", "2,5")
  const normalized = raw.replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const n = parseFloat(normalized);
  if (!Number.isFinite(n)) return null;
  return {prefix: m[1], n, decimals: normalized.split('.')[1]?.length ?? 0, suffix: m[3], grouping: /\.\d{3}/.test(raw)};
};

export const formatNumber = (n: number, decimals: number, grouping: boolean) =>
  n.toLocaleString('id-ID', {minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouping});

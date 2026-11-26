// Waktu kata untuk caption dan file SRT (Node). Logika sama dengan src/parse.ts supaya hasil Studio = hasil render.

/** Bagi teks jadi kata dengan waktu, bobot = panjang kata (kata panjang diucapkan lebih lama). */
export const spreadWords = (text, startMs, endMs) => {
  const toks = String(text ?? '').split(/\s+/).filter(Boolean);
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

/**
 * Kata dengan waktu sepanjang video. Sumber, urut prioritas:
 * 1. waktu kata asli dari rekaman (kata.json hasil npm run vo, ikut di clips[].words)
 * 2. teks vo dibagi rata sepanjang potongan rekaman adegan
 * 3. teks vo dibagi rata sepanjang adegan (belum ada rekaman)
 */
export const wordsOf = (scenes, clips = []) =>
  scenes
    .filter((s) => Boolean(s.vo))
    .flatMap((s) => {
      const c = clips.find((k) => String(k.sceneId) === String(s.id));
      if (c?.words?.length) return c.words.map((w) => ({text: w.text, startMs: Math.round(c.start * 1000 + w.startMs), endMs: Math.round(c.start * 1000 + w.endMs)}));
      if (c) return spreadWords(s.vo, c.start * 1000, (c.start + c.duration) * 1000);
      return spreadWords(s.vo, s.start * 1000 + 200, s.end * 1000 - 300);
    });

const srtTime = (ms) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = Math.floor(ms % 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
};

/** Kata → isi file .srt. Satu baris maks `maxWords` kata, pecah juga di tanda baca dan jeda > 700 ms. */
export const toSrt = (words, maxWords = 8) => {
  const cues = [];
  let cur = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const gap = prev ? w.startMs - prev.endMs : 0;
    const punct = prev && /[.!?]$/.test(prev.text);
    if (cur.length && (cur.length >= maxWords || gap > 700 || punct)) {
      cues.push(cur);
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) cues.push(cur);
  return cues
    .map((c, i) => `${i + 1}\n${srtTime(c[0].startMs)} --> ${srtTime(c[c.length - 1].endMs)}\n${c.map((w) => w.text.replace(/\*/g, '')).join(' ')}\n`)
    .join('\n');
};

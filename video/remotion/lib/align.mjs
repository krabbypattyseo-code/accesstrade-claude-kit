// Mencocokkan teks VO di script dengan transkrip Whisper (per kata) dari satu rekaman utuh.
// Aturan rekam (brand/panduan-rekam-suara.md): kalau salah, kalimat diulang tanpa berhenti merekam.
// Jadi tiap kalimat dicari dari BELAKANG: take terakhir yang cocok yang dipakai, take yang salah terbuang.

const SATUAN = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

/** 175000 → "seratus tujuh puluh lima ribu" (cukup sampai miliar). */
export const terbilang = (n) => {
  n = Math.floor(n);
  if (n < 12) return SATUAN[n];
  if (n < 20) return `${SATUAN[n - 10]} belas`;
  if (n < 100) return `${SATUAN[Math.floor(n / 10)]} puluh${n % 10 ? ` ${SATUAN[n % 10]}` : ''}`;
  if (n < 200) return `seratus${n - 100 ? ` ${terbilang(n - 100)}` : ''}`;
  if (n < 1000) return `${SATUAN[Math.floor(n / 100)]} ratus${n % 100 ? ` ${terbilang(n % 100)}` : ''}`;
  if (n < 2000) return `seribu${n - 1000 ? ` ${terbilang(n - 1000)}` : ''}`;
  if (n < 1e6) return `${terbilang(Math.floor(n / 1000))} ribu${n % 1000 ? ` ${terbilang(n % 1000)}` : ''}`;
  if (n < 1e9) return `${terbilang(Math.floor(n / 1e6))} juta${n % 1e6 ? ` ${terbilang(n % 1e6)}` : ''}`;
  return `${terbilang(Math.floor(n / 1e9))} miliar${n % 1e9 ? ` ${terbilang(n % 1e9)}` : ''}`;
};

/** Ragam lisan disamakan supaya cocok dengan script ("gak" = "nggak", "sampe" = "sampai"). */
const VARIAN = {gak: 'nggak', ga: 'nggak', ngga: 'nggak', enggak: 'nggak', engga: 'nggak', sampe: 'sampai', cepet: 'cepat', sempet: 'sempat', udah: 'sudah', kalo: 'kalau', aja: 'saja'};

/** Teks → token kecil tanpa tanda baca; angka ditulis jadi kata ("175rb" → seratus tujuh puluh lima ribu). */
export const tokens = (text) =>
  String(text ?? '')
    .toLowerCase()
    .replace(/\*/g, '')
    .replace(/rp\.?\s?/g, '')
    .replace(/(\d+)\s?(rb|ribu|k)\b/g, (_, d) => ` ${terbilang(+d * 1000)} `)
    .replace(/(\d+)\s?(jt|juta)\b/g, (_, d) => ` ${terbilang(+d * 1e6)} `)
    .replace(/(\d+)\s?-\s?(\d+)/g, '$1 sampai $2')
    .replace(/\d{1,3}(?:\.\d{3})+|\d+/g, (d) => ` ${terbilang(+d.replace(/\./g, ''))} `)
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => VARIAN[t] ?? t);

const lev = (a, b) => {
  if (a === b) return 0;
  const dp = Array.from({length: b.length + 1}, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
};
const similar = (a, b) => a === b || (Math.max(a.length, b.length) >= 4 && 1 - lev(a, b) / Math.max(a.length, b.length) >= 0.72);

/**
 * Semi-global alignment: kalimat S harus utuh, transkrip T[0..limit) bebas awal/akhir.
 * Skor cocok +2, beda -1, sisip/hapus -1. Mengembalikan kandidat dengan akhir paling BELAKANG
 * yang skornya mendekati terbaik (take terakhir).
 */
const alignSentence = (S, T, limit) => {
  const n = S.length;
  const m = limit;
  if (!n || !m) return null;
  const NEG = -1e9;
  // H[i][j] skor terbaik menyelaraskan S[0..i) dengan T yang berakhir di j
  const H = Array.from({length: n + 1}, () => new Float64Array(m + 1));
  const B = Array.from({length: n + 1}, () => new Uint8Array(m + 1)); // 1 diag, 2 up (lewati S), 3 left (lewati T)
  for (let j = 0; j <= m; j++) H[0][j] = 0; // awal bebas di T
  for (let i = 1; i <= n; i++) {
    H[i][0] = H[i - 1][0] - 1;
    B[i][0] = 2;
    for (let j = 1; j <= m; j++) {
      const d = H[i - 1][j - 1] + (similar(S[i - 1], T[j - 1]) ? 2 : -1);
      const u = H[i - 1][j] - 1;
      const l = i === n ? NEG : H[i][j - 1] - 1; // di baris terakhir akhir bebas, jadi tidak perlu geser kiri
      if (d >= u && d >= l) {
        H[i][j] = d;
        B[i][j] = 1;
      } else if (u >= l) {
        H[i][j] = u;
        B[i][j] = 2;
      } else {
        H[i][j] = l;
        B[i][j] = 3;
      }
    }
  }
  let best = NEG;
  for (let j = 1; j <= m; j++) best = Math.max(best, H[n][j]);
  if (best < n * 2 * 0.45) return null;
  let endJ = 1;
  for (let j = m; j >= 1; j--)
    if (H[n][j] >= best - 1.5 && B[n][j] === 1) {
      endJ = j;
      break;
    }
  // telusur balik
  const pairs = new Array(n).fill(-1);
  let i = n;
  let j = endJ;
  while (i > 0 && j > 0) {
    const b = B[i][j];
    if (b === 1) {
      if (similar(S[i - 1], T[j - 1])) pairs[i - 1] = j - 1;
      i--;
      j--;
    } else if (b === 2) i--;
    else j--;
  }
  const matched = pairs.filter((x) => x >= 0);
  if (!matched.length) return null;
  return {start: Math.min(...matched), end: Math.max(...matched), pairs, score: H[n][endJ] / (n * 2)};
};

const sentencesOf = (text) =>
  String(text ?? '')
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * scenes: [{id, vo}], words: [{text, start, end}] (detik, dari Whisper).
 * Hasil per adegan: {id, segments: [[start,end],...], words: [{text, start, end}] (waktu dalam rekaman asli), score, heard}
 */
export const alignScenes = (scenes, words) => {
  // token transkrip dengan waktu sendiri (kata yang berisi beberapa token dibagi rata)
  const vocab = new Set(scenes.flatMap((s) => tokens(s.vo)));
  const raw = [];
  words.forEach((w, k) => {
    const tk = tokens(w.text);
    tk.forEach((t, i) => raw.push({tok: t, s: w.start + ((w.end - w.start) * i) / tk.length, e: w.start + ((w.end - w.start) * (i + 1)) / tk.length, w: k}));
  });
  const T = [];
  const tS = [];
  const tE = [];
  const tW = []; // token → indeks kata transkrip
  const push = (tok, a, b, w) => {
    T.push(tok);
    tS.push(a);
    tE.push(b);
    tW.push(w);
  };
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    const b = raw[i + 1];
    // Whisper memisah satu kata script ("di peluk" → "dipeluk", "buan neka"): gabungkan
    if (b && (!vocab.has(a.tok) || !vocab.has(b.tok)) && vocab.has(a.tok + b.tok)) {
      push(a.tok + b.tok, a.s, b.e, a.w);
      i++;
      continue;
    }
    // salah dengar yang terpisah dua ("buan neka" = "boneka"): gabungan yang mirip satu kata script
    if (b && !vocab.has(a.tok) && !vocab.has(b.tok)) {
      const hit = [...vocab].find((v) => v.length >= 5 && similar(a.tok + b.tok, v));
      if (hit) {
        push(hit, a.s, b.e, a.w);
        i++;
        continue;
      }
    }
    // Whisper menggabung dua kata script ("bersihkan" → "bersih kan", "seladudukan" → "sela dudukan"): pecah
    if (!vocab.has(a.tok) && a.tok.length >= 5) {
      let done = false;
      for (let c = 2; c <= a.tok.length - 2 && !done; c++) {
        const x = a.tok.slice(0, c);
        const y = a.tok.slice(c);
        if (vocab.has(x) && vocab.has(y)) {
          const mid = a.s + ((a.e - a.s) * c) / a.tok.length;
          push(x, a.s, mid, a.w);
          push(y, mid, a.e, a.w);
          done = true;
        }
      }
      if (done) continue;
    }
    push(a.tok, a.s, a.e, a.w);
  }
  const units = scenes.flatMap((s) => sentencesOf(s.vo).map((text) => ({id: s.id, text, toks: tokens(text)})));
  // jeda (detik) antara token transkrip k dan k+1
  const gapAfter = (k) => (k + 1 < T.length ? tS[k + 1] - tE[k] : Infinity);
  let limit = T.length;
  for (let u = units.length - 1; u >= 0; u--) {
    const r = alignSentence(units[u].toks, T, limit);
    if (r) {
      // Whisper kadang menggabung kata ("sela sabuk" → "selasabuk"), jadi ujung/awal kalimat tidak cocok.
      // Perpanjang ke kata transkrip di sebelahnya selama jedanya pendek dan belum masuk kalimat berikutnya.
      const matchedIdx = r.pairs.map((x, i) => (x >= 0 ? i : -1)).filter((i) => i >= 0);
      const tailMissing = units[u].toks.length - 1 - matchedIdx[matchedIdx.length - 1];
      for (let k = 0; k < tailMissing && r.end + 1 < limit && gapAfter(r.end) < 0.6; k++) r.end++;
      const headMissing = matchedIdx[0];
      for (let k = 0; k < headMissing && r.start - 1 >= 0 && gapAfter(r.start - 1) < 0.4; k++) r.start--;
    }
    units[u].match = r;
    if (r) limit = r.start;
  }
  return scenes.map((s) => {
    const us = units.filter((u) => u.id === s.id);
    if (!s.vo || !us.length) return {id: s.id, segments: [], words: [], score: null, heard: ''};
    const segs = [];
    const outWords = [];
    let scoreSum = 0;
    let heard = [];
    for (const u of us) {
      if (!u.match) {
        scoreSum += 0;
        continue;
      }
      const seg = [tS[u.match.start], tE[u.match.end]];
      const last = segs[segs.length - 1];
      // kalimat berurutan tanpa take terbuang di antaranya → satu potongan
      if (last && last.endTok + 1 >= u.match.start) {
        last[1] = seg[1];
        last.endTok = u.match.end;
      } else {
        const ns = [...seg];
        ns.endTok = u.match.end;
        segs.push(ns);
      }
      scoreSum += u.match.score * u.toks.length;
      heard.push(words.slice(tW[u.match.start], tW[u.match.end] + 1).map((w) => w.text).join(' '));
      // waktu tiap kata script: dari kata transkrip yang cocok, sisanya diinterpolasi
      const scriptWords = u.text.split(/\s+/).filter(Boolean);
      let ti = 0;
      const tokTimes = u.toks.map((_, k) => (u.match.pairs[k] >= 0 ? {start: tS[u.match.pairs[k]], end: tE[u.match.pairs[k]]} : null));
      for (const sw of scriptWords) {
        const n = tokens(sw).length || 1;
        const ts = tokTimes.slice(ti, ti + n).filter(Boolean);
        outWords.push({text: sw, start: ts.length ? ts[0].start : null, end: ts.length ? ts[ts.length - 1].end : null});
        ti += n;
      }
    }
    // isi waktu yang kosong dengan interpolasi linear
    for (let k = 0; k < outWords.length; k++) {
      if (outWords[k].start !== null) continue;
      let a = k - 1;
      while (a >= 0 && outWords[a].end === null) a--;
      let b = k + 1;
      while (b < outWords.length && outWords[b].start === null) b++;
      const from = a >= 0 ? outWords[a].end : (segs[0]?.[0] ?? 0);
      const to = b < outWords.length ? outWords[b].start : (segs[segs.length - 1]?.[1] ?? from);
      const span = b - a - 1;
      for (let q = a + 1; q < b; q++) {
        outWords[q].start = from + ((to - from) * (q - a - 1)) / span;
        outWords[q].end = from + ((to - from) * (q - a)) / span;
      }
      k = b - 1;
    }
    const nTok = us.reduce((x, u) => x + u.toks.length, 0);
    return {id: s.id, segments: segs.map((g) => [g[0], g[1]]), words: outWords, score: nTok ? scoreSum / nTok : null, heard: heard.join(' / ')};
  });
};

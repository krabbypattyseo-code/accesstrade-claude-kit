import React from 'react';
import brandJson from './generated/brand.json';
import type {Bg, Format} from './types';

/**
 * Token visual. Semua nilai brand dibaca dari src/generated/brand.json, yang ditulis sync.mjs dari
 * ../brand/tokens.json. Jangan ubah warna atau font di sini: ubah di brand/tokens.json.
 * Yang diatur di file ini hanya ukuran kanvas dan zona aman per format.
 */
export const brand = brandJson;
export const C = brand.color;

type Box = {x: number; y: number; w: number; h: number};
export type FormatSpec = {
  id: Format;
  width: number;
  height: number;
  fps: number;
  vertical: boolean;
  /** zona yang tertutup UI platform / berisiko terpotong */
  safe: {top: number; bottom: number; left: number; right: number};
  /** area konten adegan (di atas caption) */
  content: Box;
  /** posisi atas caption */
  captionY: number;
  size: typeof brand.size.reels;
  caption: {maxWords: number; style: string; onHook: boolean};
};

export const FORMATS: Record<Format, FormatSpec> = {
  // Reels / TikTok / Shorts: tombol dan teks aplikasi menutup ±250 px atas, ±420 px bawah, ±120 px kanan
  reels: {
    id: 'reels',
    width: 1080,
    height: 1920,
    fps: 30,
    vertical: true,
    safe: {top: 250, bottom: 420, left: 72, right: 120},
    content: {x: 72, y: 300, w: 888, h: 860},
    captionY: 1230,
    size: brand.size.reels,
    caption: brand.caption.reels,
  },
  // YouTube 16:9: zona aman judul ±7% tepi; caption di sepertiga bawah
  youtube: {
    id: 'youtube',
    width: 1920,
    height: 1080,
    fps: 30,
    vertical: false,
    safe: {top: 80, bottom: 90, left: 140, right: 140},
    content: {x: 140, y: 110, w: 1640, h: 690},
    captionY: 870,
    size: brand.size.youtube,
    caption: brand.caption.youtube,
  },
};

export const FormatContext = React.createContext<FormatSpec>(FORMATS.reels);
export const useFormat = () => React.useContext(FormatContext);

/** hex + alpha (0–1) → rgba */
export const alpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const bgColor = (bg: Bg) => (bg === 'light' ? C.backgroundLight : bg === 'brand' ? C.primary : C.background);
export const textColor = (bg: Bg) => (bg === 'light' ? C.textOnLight : bg === 'brand' ? (C.textOnBrand ?? C.text) : C.text);
/** warna sorotan (kata *disorot*, angka besar) di latar ini. Latar brand memakai accentOnBrand. */
export const accentOn = (bg: Bg) => (bg === 'brand' ? (C.accentOnBrand ?? C.accent) : C.accent);

/** Pegas standar */
export const SPRING = {
  pop: {damping: 14, mass: 0.6, stiffness: 180},
  soft: {damping: 200},
  bounce: {damping: 10, mass: 0.5, stiffness: 160},
};

/** Pilih ukuran huruf dari daftar (besar → kecil) berdasarkan panjang teks dan kata terpanjang. */
export const fitSize = (text: string, sizes: number[], perLine: number) => {
  const clean = text.replace(/\*/g, '');
  const longest = Math.max(1, ...clean.split(/\s+/).map((w) => w.length));
  const chars = clean.length;
  for (const s of sizes) {
    const charsPerLine = perLine / (s * 0.56);
    const lines = Math.ceil(chars / charsPerLine);
    if (longest <= charsPerLine && lines <= 4) return s;
  }
  return sizes[sizes.length - 1];
};

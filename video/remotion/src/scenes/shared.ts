import type {Bg, Scene, SceneType} from '../types';

/** Props yang diterima setiap komponen adegan. `duration` dalam frame. */
export type SceneViewProps = {
  scene: Scene;
  duration: number;
  /** khusus bab: urutan bab ke berapa dan jumlah bab */
  chapter?: {index: number; total: number};
};

/** Latar default tiap tipe adegan. Bisa diganti per adegan lewat props.bg. */
export const DEFAULT_BG: Record<SceneType, Bg> = {
  hook: 'dark',
  bab: 'brand',
  poin: 'dark',
  daftar: 'light',
  angka: 'dark',
  kutipan: 'dark',
  foto: 'dark',
  banding: 'light',
  outro: 'brand',
  klip: 'dark',
};

export const bgOf = (scene: Scene): Bg => scene.props?.bg ?? DEFAULT_BG[scene.type] ?? 'dark';

/** Waktu muncul poin ke-i (detik dari awal adegan): `at` kalau ada, selain itu dibagi rata. */
export const itemTimes = (items: {at?: number}[], durationSec: number, first = 0.5) => {
  const n = items.length;
  const step = Math.min(1.6, Math.max(0.35, (durationSec - first - 1) / Math.max(1, n)));
  return items.map((it, i) => (typeof it.at === 'number' ? it.at : first + i * step));
};

export type Format = 'reels' | 'youtube';

export type SceneType = 'hook' | 'bab' | 'poin' | 'daftar' | 'angka' | 'kutipan' | 'foto' | 'banding' | 'outro' | 'klip';

export type TransitionKind = 'slide' | 'fade' | 'wipe' | 'cut';

/** Latar adegan: dark (warna background), light (backgroundLight), brand (primary). */
export type Bg = 'dark' | 'light' | 'brand';

export type Word = {text: string; startMs: number; endMs: number};

export type ListItem = {
  text: string;
  /** ikon: check x star heart bulb clock chart chat book alert arrow target money user */
  icon?: string;
  /** detik dari awal adegan saat poin muncul (default dibagi rata) */
  at?: number;
  /** muncul saat kata ini diucapkan (diisi otomatis jadi `at` dari rekaman) */
  onWord?: string;
};

export type ImageItem = string | {src: string; at?: number; onWord?: string; text?: string; focus?: string};

export type Side = {label?: string; text: string; image?: string; icon?: string};

export type SceneProps = {
  /** semua adegan: label kecil di atas judul */
  kicker?: string;
  /** semua adegan: teks kecil di bawah judul */
  sub?: string;
  bg?: Bg;
  /** semua adegan: matikan/nyalakan caption untuk adegan ini */
  caption?: 'on' | 'off';
  /** bab */
  number?: number | string;
  title?: string;
  /** daftar */
  items?: (ListItem | string)[];
  numbered?: boolean;
  /** angka */
  value?: string | number;
  label?: string;
  source?: string;
  /** kutipan */
  quote?: string;
  by?: string;
  role?: string;
  /** foto */
  image?: string;
  images?: ImageItem[];
  focus?: string;
  text?: string;
  /** banding */
  left?: Side;
  right?: Side;
  revealAt?: number;
  revealOnWord?: string;
  /** banding: sisi yang "benar" diberi tanda centang, sisi lain silang */
  verdict?: 'left' | 'right' | 'none';
  /** outro */
  cta?: string;
  handle?: string;
  website?: string;
  /** klip: file video di public/ (hasil npm run klip), detik awal di file sumber, pakai suara klip */
  src?: string;
  start?: number;
  audio?: boolean;
};

/** Efek suara per adegan: `at` = detik dari awal adegan, volume 0-1 (playbook: 0,4-0,7). */
export type Sfx = {src: string; at?: number; volume?: number};

export type Scene = {
  id: string | number;
  type: SceneType;
  rawType?: string;
  /** detik (diisi lib/scripts.mjs) */
  start: number;
  end: number;
  dur?: number;
  vo?: string;
  /** teks besar di layar; *kata* = disorot */
  onScreen?: string;
  /** catatan visual untuk manusia, tidak dibaca renderer */
  visual?: string;
  props?: SceneProps;
  transition?: TransitionKind;
  needsConfirm?: boolean;
  minDur?: number;
  extra?: number;
  sfx?: Sfx[];
};

export type Clip = {sceneId: string | number; src: string; start: number; duration: number; words?: Word[]};

export type VideoScript = {
  format: Format;
  number: string | number;
  slug?: string;
  title?: string;
  demo?: boolean;
  /** false = tanpa caption sama sekali */
  captions?: boolean;
  cover?: {text?: string; kicker?: string; image?: string};
  chapterIntro?: string;
  scenes: Scene[];
  media?: {clips?: Clip[]; music?: string | {src: string; volume?: number}};
  words?: Word[];
};

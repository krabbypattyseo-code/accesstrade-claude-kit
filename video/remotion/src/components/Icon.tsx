import React from 'react';

/** Ikon garis sederhana (viewBox 24). Tambah ikon baru di sini lalu catat di scripts/SKEMA.md. */
const PATHS: Record<string, string> = {
  check: 'M4 12.5l5 5L20 6.5',
  x: 'M6 6l12 12M18 6L6 18',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
  heart: 'M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0112 7a4.4 4.4 0 017.5 2.9C19.5 15.4 12 20 12 20z',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2',
  chart: 'M4 20h16M7 16v-5M12 16V7M17 16v-8',
  chat: 'M4 5h16v11H9l-5 4z',
  book: 'M4 5.5C6.5 4 9.5 4 12 5.5 14.5 4 17.5 4 20 5.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0z M12 5.5V19',
  alert: 'M12 4l9 16H3zM12 10v4M12 17.2v.1',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 12.2v-.4',
  money: 'M3 7h18v10H3zM12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6.5 10v4M17.5 10v4',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5',
};
export const ICONS = Object.keys(PATHS);

export const Icon: React.FC<{name?: string; size: number; color: string; stroke?: number}> = ({name, size, color, stroke = 2.2}) => {
  const d = PATHS[name ?? ''] ?? PATHS.check;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
};

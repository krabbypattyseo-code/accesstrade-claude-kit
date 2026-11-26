import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SPRING, accentOn, alpha, textColor} from '../theme';
import {FONT_BODY, FONT_DISPLAY} from '../generated/fonts';
import {highlightWords, splitHighlight} from '../parse';
import type {Bg} from '../types';

/** Gaya sorotan *kata*: latar gelap/brand → warna accent; latar terang → stabilo accent. */
const hiStyle = (bg: Bg): React.CSSProperties =>
  bg === 'light'
    ? {background: `linear-gradient(transparent 58%, ${alpha(C.accent, 0.85)} 58%)`, padding: '0 0.08em'}
    : {color: accentOn(bg)};

/** Teks dengan *sorotan*, tanpa animasi. */
export const Rich: React.FC<{text: string; bg: Bg}> = ({text, bg}) => (
  <>
    {splitHighlight(text).map((p, i) =>
      p.hi ? (
        <span key={i} style={hiStyle(bg)}>
          {p.text}
        </span>
      ) : (
        <React.Fragment key={i}>{p.text}</React.Fragment>
      ),
    )}
  </>
);

/** Judul besar yang muncul kata per kata (membal kecil). *kata* disorot. */
export const PopWords: React.FC<{
  text: string;
  bg: Bg;
  size: number;
  delay?: number;
  stagger?: number;
  align?: 'left' | 'center';
  weight?: number;
  lineHeight?: number;
}> = ({text, bg, size, delay = 0, stagger = 3, align = 'left', weight = 800, lineHeight = 1.08}) => {
  const words = highlightWords(text);
  return (
    <div style={{fontFamily: FONT_DISPLAY, fontWeight: weight, fontSize: size, lineHeight, textAlign: align, letterSpacing: '-0.01em'}}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <PopWord delay={delay + i * stagger} style={w.hi ? hiStyle(bg) : undefined}>
            {w.text}
          </PopWord>{' '}
        </React.Fragment>
      ))}
    </div>
  );
};

const PopWord: React.FC<{delay: number; style?: React.CSSProperties; children: React.ReactNode}> = ({delay, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: SPRING.pop});
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: interpolate(p, [0, 0.35], [0, 1], {extrapolateRight: 'clamp'}),
        translate: `0px ${interpolate(p, [0, 1], [0.35, 0])}em`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Label kecil berbentuk pil di atas judul. */
export const Kicker: React.FC<{text: string; bg: Bg; size: number}> = ({text, bg, size}) => (
  <div
    style={{
      display: 'inline-block',
      width: 'fit-content',
      fontFamily: FONT_BODY,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: `${size * 0.32}px ${size * 0.7}px`,
      borderRadius: size,
      background: bg === 'brand' ? textColor('brand') : C.primary,
      color: bg === 'brand' ? C.primary : '#FFFFFF',
    }}
  >
    {text}
  </div>
);

/** Teks pendukung (sub judul, keterangan). */
export const Body: React.FC<{text: string; bg: Bg; size: number; muted?: boolean; style?: React.CSSProperties}> = ({text, bg, size, muted, style}) => (
  <div
    style={{
      fontFamily: FONT_BODY,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.35,
      color: muted ? (bg === 'light' ? alpha(C.textOnLight, 0.7) : alpha(C.text, 0.78)) : undefined,
      ...style,
    }}
  >
    <Rich text={text} bg={bg} />
  </div>
);

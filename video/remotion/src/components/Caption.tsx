import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, alpha, useFormat} from '../theme';
import {FONT_BODY, FONT_DISPLAY} from '../generated/fonts';
import type {Word} from '../types';

/** Halaman caption maks N kata; pecah juga di tanda baca atau jeda > 500 ms. */
export const pageWords = (words: Word[], max: number) => {
  const pages: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const gap = prev ? w.startMs - prev.endMs : 0;
    const punct = prev && /[.,!?;:]$/.test(prev.text);
    if (cur.length && (cur.length >= max || gap > 500 || punct)) {
      pages.push(cur);
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) pages.push(cur);
  return pages;
};

/** Rentang waktu tiap adegan: caption tampil atau tidak, dan apakah latarnya terang. */
export type CaptionSpan = {fromMs: number; toMs: number; on: boolean; light: boolean};

/**
 * Caption sepanjang video.
 * - Reels (gaya karaoke): maks 4 kata, huruf tebal dengan outline, kata yang sedang diucapkan disorot warna accent.
 * - YouTube (gaya subtitle): maks 8 kata, teks putih di kotak gelap transparan, di sepertiga bawah.
 * Gaya dan jumlah kata bisa diubah di brand/tokens.json (caption.reels / caption.youtube).
 */
export const CaptionTrack: React.FC<{words: Word[]; spans: CaptionSpan[]}> = ({words, spans}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fmt = useFormat();
  const now = (frame / fps) * 1000;
  const pages = React.useMemo(() => pageWords(words, fmt.caption.maxWords), [words, fmt.caption.maxWords]);
  const span = spans.find((s) => now >= s.fromMs && now < s.toMs);
  if (!span || !span.on) return null;

  let page: Word[] | undefined;
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const next = pages[i + 1];
    const holdUntil = Math.min(next ? next[0].startMs : Infinity, p[p.length - 1].endMs + 500, span.toMs);
    if (now >= p[0].startMs && now < holdUntil) {
      page = p;
      break;
    }
  }
  if (!page) return null;
  const pop = interpolate(now - page[0].startMs, [0, 120], [0.94, 1], {extrapolateRight: 'clamp'});
  const box = fmt.content;

  if (fmt.caption.style === 'subtitle') {
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div style={{position: 'absolute', left: box.x, width: box.w, top: fmt.captionY, textAlign: 'center'}}>
          <span
            style={{
              display: 'inline-block',
              maxWidth: box.w * 0.82,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: fmt.size.caption,
              lineHeight: 1.3,
              color: '#FFFFFF',
              background: 'rgba(0,0,0,0.62)',
              padding: `${fmt.size.caption * 0.18}px ${fmt.size.caption * 0.5}px`,
              borderRadius: 12,
            }}
          >
            {page.map((w) => w.text.replace(/\*/g, '')).join(' ')}
          </span>
        </div>
      </AbsoluteFill>
    );
  }

  const light = span.light;
  const stroke = Math.round(fmt.size.caption * 0.14);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: box.x,
          width: box.w,
          top: fmt.captionY,
          textAlign: 'center',
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: fmt.size.caption,
          lineHeight: 1.18,
          color: light ? C.textOnLight : C.text,
          WebkitTextStroke: light ? undefined : `${stroke}px ${C.background}`,
          paintOrder: 'stroke fill',
          textShadow: light ? undefined : `0 6px 0 ${alpha(C.background, 0.5)}`,
          scale: String(pop),
        }}
      >
        {page.map((w, i) => {
          const on = now >= w.startMs && now < (page![i + 1]?.startMs ?? w.endMs + 500);
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  margin: '2px 0',
                  borderRadius: 14,
                  background: on ? C.accent : 'transparent',
                  color: on ? C.accentText : undefined,
                  WebkitTextStroke: on ? '0px transparent' : undefined,
                  textShadow: on ? 'none' : undefined,
                }}
              >
                {w.text.replace(/\*/g, '')}
              </span>{' '}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

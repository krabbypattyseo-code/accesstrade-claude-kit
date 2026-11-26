import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, accentOn, alpha, bgColor, brand, textColor, useFormat} from '../theme';
import {FONT_BODY, FONT_DISPLAY} from '../generated/fonts';
import type {Bg} from '../types';

export const imgSrc = (s: string) => (/^https?:/.test(s) ? s : staticFile(s));

/** Latar adegan: warna solid + cahaya lembut warna primary di satu sudut. */
export const Background: React.FC<{bg: Bg}> = ({bg}) => {
  const fmt = useFormat();
  const glow = bg === 'brand' ? alpha(accentOn('brand'), 0.16) : alpha(C.primary, bg === 'light' ? 0.1 : 0.22);
  const at = fmt.vertical ? '85% 8%' : '88% 12%';
  return <AbsoluteFill style={{background: `radial-gradient(circle at ${at}, ${glow} 0%, transparent 55%), ${bgColor(bg)}`}} />;
};

/** Kanvas satu adegan: latar + area konten (di atas caption) dengan warna teks yang sesuai latar. */
export const SceneFrame: React.FC<{bg: Bg; children: React.ReactNode; contentStyle?: React.CSSProperties; full?: boolean}> = ({bg, children, contentStyle, full}) => {
  const fmt = useFormat();
  const box = full ? {x: fmt.safe.left, y: fmt.safe.top, w: fmt.width - fmt.safe.left - fmt.safe.right, h: fmt.height - fmt.safe.top - fmt.safe.bottom} : fmt.content;
  return (
    <AbsoluteFill style={{color: textColor(bg), overflow: 'hidden'}}>
      <Background bg={bg} />
      <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...contentStyle}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Logo brand (tokens.logo.file) atau nama brand sebagai wordmark kalau belum ada logo. */
export const Logo: React.FC<{width: number; bg: Bg}> = ({width, bg}) =>
  brand.logo.src ? (
    <Img src={staticFile(brand.logo.src)} style={{width, height: 'auto', objectFit: 'contain'}} />
  ) : (
    <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: width * 0.2, letterSpacing: '-0.02em', color: textColor(bg)}}>{brand.short}</div>
  );

/** Cap merah: teks atau angka di adegan ini belum dikonfirmasi, video belum boleh tayang. */
export const ConfirmStamp: React.FC = () => {
  const fmt = useFormat();
  return (
    <div
      style={{
        position: 'absolute',
        right: fmt.safe.right + 10,
        top: fmt.safe.top - (fmt.vertical ? 40 : 30),
        rotate: '-6deg',
        border: `6px solid ${C.alert}`,
        color: C.alert,
        background: alpha('#FFFFFF', 0.92),
        fontFamily: FONT_BODY,
        fontWeight: 800,
        fontSize: fmt.vertical ? 40 : 34,
        padding: '8px 20px',
        borderRadius: 14,
        letterSpacing: '0.06em',
        zIndex: 50,
      }}
    >
      [KONFIRMASI]
    </div>
  );
};

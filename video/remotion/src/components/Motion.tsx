import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SPRING} from '../theme';

/**
 * Elemen muncul: memudar + naik sedikit, digerakkan pegas. `delay` dalam frame.
 * useCurrentFrame dipakai di komponen sekecil ini supaya bagian lain adegan tidak ikut render ulang tiap frame.
 */
export const Rise: React.FC<{delay?: number; distance?: number; from?: 'below' | 'left' | 'right'; style?: React.CSSProperties; children: React.ReactNode}> = ({
  delay = 0,
  distance = 40,
  from = 'below',
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: SPRING.soft, durationInFrames: 18});
  const off = interpolate(p, [0, 1], [distance, 0]);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], {extrapolateRight: 'clamp'}),
        translate: from === 'below' ? `0px ${off}px` : from === 'left' ? `${-off}px 0px` : `${off}px 0px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Muncul dengan sedikit membal (badge, ikon, angka). */
export const Pop: React.FC<{delay?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({delay = 0, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: SPRING.pop});
  return <div style={{opacity: interpolate(p, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}), scale: String(interpolate(p, [0, 1], [0.6, 1])), ...style}}>{children}</div>;
};

/** Garis aksen yang memanjang dari 0 ke `length` px. */
export const GrowBar: React.FC<{delay?: number; length: number; thickness: number; color: string; vertical?: boolean; style?: React.CSSProperties}> = ({
  delay = 0,
  length,
  thickness,
  color,
  vertical,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: SPRING.soft, durationInFrames: 20});
  const l = interpolate(p, [0, 1], [0, length]);
  return <div style={{width: vertical ? thickness : l, height: vertical ? l : thickness, background: color, borderRadius: thickness, ...style}} />;
};

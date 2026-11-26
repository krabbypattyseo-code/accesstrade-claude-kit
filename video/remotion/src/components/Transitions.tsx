import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, brand, useFormat} from '../theme';
import type {TransitionKind} from '../types';

/** Lama transisi (frame), dari tokens.motion.transitionFrames. */
export const TRANSITION_FRAMES = brand.motion.transitionFrames;

/**
 * Pembungkus adegan yang masuk.
 * - slide: adegan baru menggeser masuk dari kanan (YouTube) / dari bawah (Reels) di atas adegan lama
 * - fade : adegan baru memudar masuk di atas adegan lama
 * - wipe / cut: tidak membungkus (wipe adalah overlay terpisah, lihat WipeOverlay)
 */
export const SceneEnter: React.FC<{kind: TransitionKind; children: React.ReactNode}> = ({kind, children}) => {
  const frame = useCurrentFrame();
  const fmt = useFormat();
  if (kind !== 'slide' && kind !== 'fade') return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  if (kind === 'fade') return <AbsoluteFill style={{opacity: p}}>{children}</AbsoluteFill>;
  const off = (1 - p) * 100;
  return <AbsoluteFill style={{translate: fmt.vertical ? `0px ${off}%` : `${off}% 0px`}}>{children}</AbsoluteFill>;
};

/** Panel warna primary + garis accent menyapu layar; adegan berganti tepat saat layar tertutup penuh. */
export const WipeOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const D = TRANSITION_FRAMES * 2;
  const p = interpolate(frame, [0, D], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // 0 → 0.5: panel masuk dari kiri sampai menutup; 0.5 → 1: panel keluar ke kanan
  const enter = Easing.inOut(Easing.cubic)(Math.min(1, p * 2));
  const exit = Easing.inOut(Easing.cubic)(Math.max(0, p * 2 - 1));
  const left = `${-100 + enter * 100 + exit * 100}%`;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, bottom: 0, left, width: '100%', background: C.primary}} />
      <div style={{position: 'absolute', top: 0, bottom: 0, left, width: 24, marginLeft: '100%', background: C.accent}} />
    </AbsoluteFill>
  );
};

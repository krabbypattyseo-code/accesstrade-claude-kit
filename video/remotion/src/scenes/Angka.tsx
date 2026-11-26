import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fitSize, useFormat} from '../theme';
import {FONT_DISPLAY} from '../generated/fonts';
import {SceneFrame} from '../components/Frame';
import {Body, Kicker, PopWords} from '../components/Text';
import {Pop, Rise} from '../components/Motion';
import {formatNumber, parseNumber} from '../parse';
import {bgOf, type SceneViewProps} from './shared';

/** Angka / statistik besar yang menghitung naik, label, dan sumber data. */
export const AngkaScene: React.FC<SceneViewProps> = ({scene}) => {
  const fmt = useFormat();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const label = p.label ?? scene.onScreen ?? '';
  const value = String(p.value ?? '');
  const bigSize = Math.min(S.big * (fmt.vertical ? 1 : 1.25), (fmt.vertical ? fmt.content.w : fmt.content.w * 0.5) / Math.max(2, value.length * 0.58));

  const number = (
    <Pop delay={2}>
      <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: bigSize, lineHeight: 1, color: C.accent, letterSpacing: '-0.03em', whiteSpace: 'nowrap'}}>
        <CountUp value={value} delay={4} />
      </div>
    </Pop>
  );
  const textW = fmt.vertical ? fmt.content.w : fmt.content.w * 0.42;
  const labelSize = fitSize(label, [S.title * 0.9, S.title * 0.75, S.title * 0.62], textW);
  const info = (
    <div style={{display: 'flex', flexDirection: 'column', gap: S.label * 0.7, width: textW, alignItems: fmt.vertical ? 'center' : 'flex-start'}}>
      {p.kicker ? <Kicker text={p.kicker} bg={bg} size={S.label} /> : null}
      {label ? <PopWords text={label} bg={bg} size={labelSize} delay={10} stagger={2} align={fmt.vertical ? 'center' : 'left'} /> : null}
      {p.sub ? (
        <Rise delay={16}>
          <Body text={p.sub} bg={bg} size={S.body} muted />
        </Rise>
      ) : null}
      {p.source ? (
        <Rise delay={20}>
          <Body text={`Sumber: ${p.source}`} bg={bg} size={S.label * 0.8} muted />
        </Rise>
      ) : null}
    </div>
  );
  return fmt.vertical ? (
    <SceneFrame bg={bg} contentStyle={{alignItems: 'center', textAlign: 'center', gap: S.label}}>
      {number}
      {info}
    </SceneFrame>
  ) : (
    <SceneFrame bg={bg} contentStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{width: fmt.content.w * 0.52, display: 'flex', justifyContent: 'center'}}>{number}</div>
      {info}
    </SceneFrame>
  );
};

/** Hitung naik dari 0 ke nilai dalam 1 dtk. Nilai yang bukan angka (mis. "2x lipat") langsung tampil. */
const CountUp: React.FC<{value: string; delay: number}> = ({value, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const parsed = parseNumber(value);
  if (!parsed) return <>{value}</>;
  const k = interpolate(frame - delay, [0, fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <>
      {parsed.prefix}
      {formatNumber(parsed.n * k, parsed.decimals, parsed.grouping)}
      {parsed.suffix}
    </>
  );
};

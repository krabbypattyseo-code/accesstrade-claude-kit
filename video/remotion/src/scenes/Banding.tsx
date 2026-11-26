import React from 'react';
import {Img, useVideoConfig} from 'remotion';
import {C, alpha, brand, fitSize, useFormat} from '../theme';
import {FONT_BODY} from '../generated/fonts';
import {SceneFrame, imgSrc} from '../components/Frame';
import {Kicker, PopWords, Rich} from '../components/Text';
import {Pop, Rise} from '../components/Motion';
import {Icon} from '../components/Icon';
import type {Bg, Side} from '../types';
import {bgOf, type SceneViewProps} from './shared';

/**
 * Perbandingan dua sisi: mitos vs fakta, sebelum vs sesudah, A vs B.
 * Reels bertumpuk atas-bawah, YouTube berdampingan. Sisi kanan muncul belakangan (revealAt / revealOnWord).
 */
export const BandingScene: React.FC<SceneViewProps> = ({scene, duration}) => {
  const fmt = useFormat();
  const {fps} = useVideoConfig();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const left = p.left ?? {text: ''};
  const right = p.right ?? {text: ''};
  const reveal = Math.round((p.revealAt ?? (duration / fps) * 0.4) * fps);
  const verdict = p.verdict ?? 'none';
  const title = scene.onScreen ?? p.title ?? '';
  const titleSize = fitSize(title, [S.title * 0.85, S.title * 0.72, S.title * 0.6], fmt.content.w);

  return (
    <SceneFrame bg={bg} contentStyle={{gap: S.label}}>
      {title || p.kicker ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: S.label * 0.5, alignItems: fmt.vertical ? 'flex-start' : 'center', textAlign: fmt.vertical ? 'left' : 'center'}}>
          {p.kicker ? <Kicker text={p.kicker} bg={bg} size={S.label} /> : null}
          {title ? <PopWords text={title} bg={bg} size={titleSize} stagger={2} align={fmt.vertical ? 'left' : 'center'} /> : null}
        </div>
      ) : null}
      <div style={{flex: 1, display: 'flex', flexDirection: fmt.vertical ? 'column' : 'row', gap: S.label * 0.8}}>
        <Rise delay={4} from={fmt.vertical ? 'below' : 'left'} style={{flex: 1, display: 'flex'}}>
          <Panel side={left} mark={verdict === 'none' ? undefined : verdict === 'left' ? 'good' : 'bad'} bg={bg} />
        </Rise>
        <Rise delay={reveal} from={fmt.vertical ? 'below' : 'right'} style={{flex: 1, display: 'flex'}}>
          <Panel side={right} mark={verdict === 'none' ? undefined : verdict === 'right' ? 'good' : 'bad'} bg={bg} strong={verdict === 'right'} markDelay={reveal + 8} />
        </Rise>
      </div>
    </SceneFrame>
  );
};

const Panel: React.FC<{side: Side; mark?: 'good' | 'bad'; bg: Bg; strong?: boolean; markDelay?: number}> = ({side, mark, bg, strong, markDelay = 10}) => {
  const fmt = useFormat();
  const S = fmt.size;
  const light = bg === 'light';
  const textSize = fitSize(side.text, [S.body * 1.3, S.body * 1.1, S.body * 0.95], fmt.vertical ? fmt.content.w * 0.8 : fmt.content.w * 0.4);
  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: brand.radius.card,
        overflow: 'hidden',
        background: light ? '#FFFFFF' : alpha(C.text, 0.08),
        border: `6px solid ${strong ? C.accent : 'transparent'}`,
        boxShadow: light ? `0 10px 30px ${alpha(C.textOnLight, 0.1)}` : undefined,
      }}
    >
      {side.image ? <Img src={imgSrc(side.image)} style={{width: '100%', flex: 1, minHeight: 0, objectFit: 'cover'}} /> : null}
      <div style={{padding: `${S.label * 0.8}px ${S.label}px`, display: 'flex', flexDirection: 'column', gap: S.label * 0.4, justifyContent: 'center', flex: side.image ? undefined : 1}}>
        {side.label ? (
          <div style={{fontFamily: FONT_BODY, fontWeight: 800, fontSize: S.label, letterSpacing: '0.06em', textTransform: 'uppercase', color: strong ? (light ? C.primary : C.accent) : light ? alpha(C.textOnLight, 0.6) : alpha(C.text, 0.65)}}>
            {side.label}
          </div>
        ) : null}
        <div style={{fontFamily: FONT_BODY, fontWeight: 700, fontSize: textSize, lineHeight: 1.25}}>
          <Rich text={side.text} bg={bg} />
        </div>
      </div>
      {mark ? (
        <Pop delay={markDelay} style={{position: 'absolute', top: 18, right: 18}}>
          <div style={{width: S.label * 1.8, height: S.label * 1.8, borderRadius: S.label, background: mark === 'good' ? C.accent : C.alert, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name={mark === 'good' ? 'check' : 'x'} size={S.label * 1.1} color={mark === 'good' ? C.accentText : '#FFFFFF'} stroke={3} />
          </div>
        </Pop>
      ) : null}
    </div>
  );
};

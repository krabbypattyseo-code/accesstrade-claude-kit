import React from 'react';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import {C, alpha, fitSize, useFormat} from '../theme';
import {FONT_BODY} from '../generated/fonts';
import {Kicker, PopWords} from '../components/Text';
import {Rise} from '../components/Motion';
import type {SceneViewProps} from './shared';

const src = (s: string) => (/^https?:/.test(s) ? s : staticFile(s));

/**
 * Klip video layar penuh: b-roll, rekaman layar, footage (playbook-footage.md).
 * Default tanpa suara klip (suara dari rekaman VO); props.audio = true untuk memakai suara klip.
 * onScreen opsional tampil di zona aman atas dengan gradasi gelap supaya terbaca.
 */
export const KlipScene: React.FC<SceneViewProps> = ({scene}) => {
  const fmt = useFormat();
  const {fps} = useVideoConfig();
  const S = fmt.size;
  const p = scene.props ?? {};
  const title = scene.onScreen ?? p.title ?? '';
  const width = fmt.vertical ? fmt.content.w : fmt.content.w * 0.6;
  const size = fitSize(title, [S.title * 0.85, S.title * 0.72, S.title * 0.6], width);
  return (
    <AbsoluteFill style={{background: C.background, color: C.text}}>
      {p.src ? (
        <Video
          src={src(p.src)}
          trimBefore={Math.max(0, Math.round((p.start ?? 0) * fps))}
          muted={!p.audio}
          objectFit="cover"
          style={{width: '100%', height: '100%', objectPosition: p.focus ?? '50% 50%'}}
        />
      ) : null}
      {title || p.kicker ? (
        <>
          <AbsoluteFill style={{background: `linear-gradient(180deg, ${alpha(C.background, 0.78)} 0%, ${alpha(C.background, 0)} ${fmt.vertical ? 38 : 45}%)`}} />
          <div style={{position: 'absolute', left: fmt.content.x, top: fmt.vertical ? fmt.safe.top + 20 : fmt.safe.top + 10, width, display: 'flex', flexDirection: 'column', gap: S.label * 0.5}}>
            {p.kicker ? <Kicker text={p.kicker} bg="dark" size={S.label} /> : null}
            {title ? <PopWords text={title} bg="dark" size={size} stagger={2} /> : null}
          </div>
        </>
      ) : null}
      {p.text ? (
        <Rise delay={6} style={{position: 'absolute', left: fmt.content.x, top: fmt.content.y + fmt.content.h - S.label * 2}}>
          <div style={{fontFamily: FONT_BODY, fontWeight: 700, fontSize: S.label, padding: `${S.label * 0.3}px ${S.label * 0.65}px`, borderRadius: S.label, background: C.accent, color: C.accentText}}>{p.text}</div>
        </Rise>
      ) : null}
    </AbsoluteFill>
  );
};

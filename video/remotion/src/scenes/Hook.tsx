import React from 'react';
import {C, fitSize, useFormat} from '../theme';
import {SceneFrame} from '../components/Frame';
import {Body, Kicker, PopWords} from '../components/Text';
import {GrowBar, Rise} from '../components/Motion';
import {highlightWords} from '../parse';
import {bgOf, type SceneViewProps} from './shared';

/** Pembuka: judul besar muncul kata per kata. Reels rata tengah, YouTube rata kiri. */
export const HookScene: React.FC<SceneViewProps> = ({scene}) => {
  const fmt = useFormat();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const text = scene.onScreen ?? p.title ?? '';
  const width = fmt.vertical ? fmt.content.w : fmt.content.w * 0.8;
  const size = fitSize(text, [S.hook * 1.15, S.hook, S.hook * 0.86, S.hook * 0.74], width);
  const nWords = highlightWords(text).length;
  const center = fmt.vertical;
  return (
    <SceneFrame bg={bg} contentStyle={{alignItems: center ? 'center' : 'flex-start', textAlign: center ? 'center' : 'left', gap: S.label * 0.9}}>
      {p.kicker ? (
        <Rise>
          <Kicker text={p.kicker} bg={bg} size={S.label} />
        </Rise>
      ) : null}
      <div style={{maxWidth: width}}>
        <PopWords text={text} bg={bg} size={size} delay={4} align={center ? 'center' : 'left'} />
      </div>
      <GrowBar delay={6 + nWords * 3} length={center ? 180 : 260} thickness={S.label * 0.32} color={C.accent} />
      {p.sub ? (
        <Rise delay={10 + nWords * 3} style={{maxWidth: width * 0.9}}>
          <Body text={p.sub} bg={bg} size={S.body} muted />
        </Rise>
      ) : null}
    </SceneFrame>
  );
};

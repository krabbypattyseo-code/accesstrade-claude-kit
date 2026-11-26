import React from 'react';
import {C, fitSize, useFormat} from '../theme';
import {SceneFrame} from '../components/Frame';
import {Body, Kicker, PopWords} from '../components/Text';
import {GrowBar, Rise} from '../components/Motion';
import {highlightWords} from '../parse';
import {bgOf, type SceneViewProps} from './shared';

/** Satu pernyataan penting + penjelasan singkat. Garis accent di kiri. */
export const PoinScene: React.FC<SceneViewProps> = ({scene}) => {
  const fmt = useFormat();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const text = scene.onScreen ?? p.title ?? '';
  const width = fmt.vertical ? fmt.content.w - 50 : fmt.content.w * 0.78;
  const size = fitSize(text, [S.title * 1.1, S.title, S.title * 0.85, S.title * 0.72], width);
  const n = highlightWords(text).length;
  return (
    <SceneFrame bg={bg} contentStyle={{flexDirection: 'row', alignItems: 'center', gap: 44}}>
      <GrowBar vertical delay={2} length={fmt.vertical ? 420 : 380} thickness={14} color={C.accent} />
      <div style={{display: 'flex', flexDirection: 'column', gap: S.label * 0.8, width}}>
        {p.kicker ? (
          <Rise>
            <Kicker text={p.kicker} bg={bg} size={S.label} />
          </Rise>
        ) : null}
        <PopWords text={text} bg={bg} size={size} delay={4} stagger={2} />
        {p.sub ? (
          <Rise delay={8 + n * 2}>
            <Body text={p.sub} bg={bg} size={S.body} muted />
          </Rise>
        ) : null}
      </div>
    </SceneFrame>
  );
};

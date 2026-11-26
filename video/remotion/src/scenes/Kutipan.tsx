import React from 'react';
import {C, alpha, fitSize, useFormat} from '../theme';
import {FONT_BODY, FONT_DISPLAY} from '../generated/fonts';
import {SceneFrame} from '../components/Frame';
import {Rich} from '../components/Text';
import {GrowBar, Pop, Rise} from '../components/Motion';
import {bgOf, type SceneViewProps} from './shared';

/** Kutipan (buku, ahli, pelanggan) dengan nama dan keterangan. */
export const KutipanScene: React.FC<SceneViewProps> = ({scene}) => {
  const fmt = useFormat();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const quote = p.quote ?? scene.onScreen ?? '';
  const width = fmt.vertical ? fmt.content.w : fmt.content.w * 0.8;
  const size = fitSize(quote, [S.title * 0.95, S.title * 0.8, S.title * 0.66, S.title * 0.56], width);
  return (
    <SceneFrame bg={bg} contentStyle={{alignItems: fmt.vertical ? 'flex-start' : 'center'}}>
      <div style={{width, display: 'flex', flexDirection: 'column', gap: S.label}}>
        <Pop>
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: S.big * 0.9, lineHeight: 0.6, height: S.big * 0.45, color: C.accent}}>“</div>
        </Pop>
        <Rise delay={4}>
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: size, lineHeight: 1.22}}>
            <Rich text={quote} bg={bg} />
          </div>
        </Rise>
        {p.by ? (
          <Rise delay={14} style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <GrowBar delay={14} length={70} thickness={8} color={C.accent} />
            <div style={{fontFamily: FONT_BODY, fontSize: S.body * 0.9, lineHeight: 1.3}}>
              <div style={{fontWeight: 700}}>{p.by}</div>
              {p.role ? <div style={{fontWeight: 500, color: bg === 'light' ? alpha(C.textOnLight, 0.65) : alpha(C.text, 0.7)}}>{p.role}</div> : null}
            </div>
          </Rise>
        ) : null}
      </div>
    </SceneFrame>
  );
};

import React from 'react';
import {accentOn, alpha, fitSize, textColor, useFormat} from '../theme';
import {FONT_DISPLAY} from '../generated/fonts';
import {SceneFrame} from '../components/Frame';
import {Body, Kicker, PopWords} from '../components/Text';
import {Pop, Rise} from '../components/Motion';
import {bgOf, type SceneViewProps} from './shared';

/** Kartu bab (chapter YouTube): nomor besar + judul bab + titik urutan bab. Waktunya masuk ke file chapter. */
export const BabScene: React.FC<SceneViewProps> = ({scene, chapter}) => {
  const fmt = useFormat();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const n = p.number ?? (chapter ? chapter.index + 1 : '');
  const title = p.title ?? scene.onScreen ?? '';
  const label = p.kicker ?? `Bagian ${n}`;
  const num = String(n).padStart(2, '0');
  const titleW = fmt.vertical ? fmt.content.w : fmt.content.w * 0.62;
  const size = fitSize(title, [S.title * 1.2, S.title, S.title * 0.85], titleW);

  const dots = chapter && chapter.total > 1 ? (
    <Rise delay={14} style={{display: 'flex', gap: 14, marginTop: S.label * 0.6, justifyContent: fmt.vertical ? 'center' : 'flex-start'}}>
      {Array.from({length: chapter.total}, (_, i) => (
        <div key={i} style={{width: i === chapter.index ? 54 : 18, height: 18, borderRadius: 9, background: i === chapter.index ? accentOn(bg) : alpha(textColor(bg), 0.35)}} />
      ))}
    </Rise>
  ) : null;

  const bigNumber = (
    <Pop delay={2}>
      <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: S.big * (fmt.vertical ? 1.1 : 1.5), lineHeight: 0.9, color: accentOn(bg), letterSpacing: '-0.04em'}}>{num}</div>
    </Pop>
  );

  if (fmt.vertical) {
    return (
      <SceneFrame bg={bg} contentStyle={{alignItems: 'center', textAlign: 'center', gap: S.label}}>
        {bigNumber}
        <Rise delay={6}>
          <Kicker text={label} bg={bg} size={S.label} />
        </Rise>
        <PopWords text={title} bg={bg} size={size} delay={10} align="center" />
        {p.sub ? <Body text={p.sub} bg={bg} size={S.body} muted /> : null}
        {dots}
      </SceneFrame>
    );
  }
  return (
    <SceneFrame bg={bg} contentStyle={{flexDirection: 'row', alignItems: 'center', gap: 80}}>
      <div style={{width: fmt.content.w * 0.3, display: 'flex', justifyContent: 'flex-end'}}>{bigNumber}</div>
      <div style={{width: 6, alignSelf: 'stretch', margin: '120px 0', background: alpha(textColor(bg), 0.25), borderRadius: 3}} />
      <div style={{width: titleW, display: 'flex', flexDirection: 'column', gap: S.label * 0.8}}>
        <Rise delay={6}>
          <Kicker text={label} bg={bg} size={S.label} />
        </Rise>
        <PopWords text={title} bg={bg} size={size} delay={10} />
        {p.sub ? (
          <Rise delay={18}>
            <Body text={p.sub} bg={bg} size={S.body} muted />
          </Rise>
        ) : null}
        {dots}
      </div>
    </SceneFrame>
  );
};

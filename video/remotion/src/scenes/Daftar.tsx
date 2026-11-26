import React from 'react';
import {useVideoConfig} from 'remotion';
import {C, alpha, brand, fitSize, useFormat} from '../theme';
import {FONT_BODY, FONT_DISPLAY} from '../generated/fonts';
import {SceneFrame} from '../components/Frame';
import {Kicker, PopWords, Rich} from '../components/Text';
import {Pop, Rise} from '../components/Motion';
import {Icon} from '../components/Icon';
import type {Bg, ListItem} from '../types';
import {bgOf, itemTimes, type SceneViewProps} from './shared';

/** Daftar poin / langkah / tips. Tiap poin muncul pada `at`, saat `onWord` diucapkan, atau dibagi rata. */
export const DaftarScene: React.FC<SceneViewProps> = ({scene, duration}) => {
  const fmt = useFormat();
  const {fps} = useVideoConfig();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const items: ListItem[] = (p.items ?? []).map((it) => (typeof it === 'string' ? {text: it} : it));
  const times = itemTimes(items, duration / fps);
  const title = scene.onScreen ?? p.title ?? '';
  const numbered = p.numbered ?? !items.some((i) => i.icon);

  const many = items.length > 4;
  const itemSize = fmt.vertical ? (many ? S.body * 0.92 : S.body * 1.08) : many ? S.body * 0.95 : S.body * 1.1;
  const list = (
    <div style={{display: 'flex', flexDirection: 'column', gap: itemSize * (many ? 0.55 : 0.8)}}>
      {items.map((it, i) => (
        <Rise key={i} delay={Math.round(times[i] * fps)} from="right" distance={60}>
          <Row item={it} index={i} numbered={numbered} size={itemSize} bg={bg} />
        </Rise>
      ))}
    </div>
  );

  if (fmt.vertical) {
    const size = fitSize(title, [S.title, S.title * 0.85, S.title * 0.72], fmt.content.w);
    return (
      <SceneFrame bg={bg} contentStyle={{gap: S.label * 1.4}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: S.label * 0.6}}>
          {p.kicker ? <Kicker text={p.kicker} bg={bg} size={S.label} /> : null}
          {title ? <PopWords text={title} bg={bg} size={size} stagger={2} /> : null}
        </div>
        {list}
      </SceneFrame>
    );
  }
  const leftW = fmt.content.w * 0.36;
  const size = fitSize(title, [S.title, S.title * 0.85, S.title * 0.72], leftW);
  return (
    <SceneFrame bg={bg} contentStyle={{flexDirection: 'row', alignItems: 'center', gap: fmt.content.w * 0.06}}>
      <div style={{width: leftW, display: 'flex', flexDirection: 'column', gap: S.label * 0.7}}>
        {p.kicker ? <Kicker text={p.kicker} bg={bg} size={S.label} /> : null}
        {title ? <PopWords text={title} bg={bg} size={size} stagger={2} /> : null}
      </div>
      <div style={{flex: 1}}>{list}</div>
    </SceneFrame>
  );
};

const Row: React.FC<{item: ListItem; index: number; numbered: boolean; size: number; bg: Bg}> = ({item, index, numbered, size, bg}) => {
  const badge = size * 1.5;
  const light = bg === 'light';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.6,
        background: light ? '#FFFFFF' : alpha(C.text, 0.08),
        borderRadius: brand.radius.card * 0.7,
        padding: `${size * 0.42}px ${size * 0.6}px`,
        boxShadow: light ? `0 8px 24px ${alpha(C.textOnLight, 0.08)}` : undefined,
      }}
    >
      <Pop>
        <div style={{width: badge, height: badge, borderRadius: badge / 2, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          {numbered ? (
            <span style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size * 0.8, color: C.text}}>{index + 1}</span>
          ) : (
            <Icon name={item.icon} size={size * 0.85} color={C.text} />
          )}
        </div>
      </Pop>
      <div style={{fontFamily: FONT_BODY, fontWeight: 600, fontSize: size, lineHeight: 1.25}}>
        <Rich text={item.text} bg={bg} />
      </div>
    </div>
  );
};

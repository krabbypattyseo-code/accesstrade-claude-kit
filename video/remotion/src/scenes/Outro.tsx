import React from 'react';
import {getRemotionEnvironment} from 'remotion';
import {C, alpha, brand, fitSize, textColor, useFormat} from '../theme';
import {FONT_BODY} from '../generated/fonts';
import {Logo, SceneFrame} from '../components/Frame';
import {Body, PopWords} from '../components/Text';
import {Pop, Rise} from '../components/Motion';
import {bgOf, type SceneViewProps} from './shared';

/**
 * Penutup + ajakan (CTA).
 * Reels: logo, ajakan, handle di tengah.
 * YouTube: teks di kiri, sisi kanan dikosongkan untuk elemen end screen YouTube (video + tombol subscribe),
 * yang dipasang di YouTube Studio. Kotak panduan hanya terlihat di Remotion Studio, tidak ikut dirender.
 */
export const OutroScene: React.FC<SceneViewProps> = ({scene}) => {
  const fmt = useFormat();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const cta = scene.onScreen ?? p.cta ?? '';
  const handle = p.handle ?? brand.handle;
  const website = p.website ?? brand.website;
  const contact = [handle, website].filter(Boolean);

  const pills = contact.length ? (
    <Rise delay={16} style={{display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: fmt.vertical ? 'center' : 'flex-start'}}>
      {contact.map((c) => (
        <div key={c} style={{fontFamily: FONT_BODY, fontWeight: 700, fontSize: S.body * 0.9, padding: `${S.body * 0.25}px ${S.body * 0.6}px`, borderRadius: S.body, background: bg === 'brand' ? textColor('brand') : C.accent, color: bg === 'brand' ? C.primary : C.accentText}}>
          {c}
        </div>
      ))}
    </Rise>
  ) : null;

  if (fmt.vertical) {
    const size = fitSize(cta, [S.title * 1.1, S.title, S.title * 0.85], fmt.content.w);
    return (
      <SceneFrame bg={bg} full contentStyle={{alignItems: 'center', textAlign: 'center', gap: S.label * 1.2}}>
        <Pop>
          <Logo width={brand.logo.width} bg={bg} />
        </Pop>
        {cta ? <PopWords text={cta} bg={bg} size={size} delay={6} align="center" /> : null}
        {p.sub ? <Body text={p.sub} bg={bg} size={S.body} muted /> : null}
        {pills}
      </SceneFrame>
    );
  }
  const textW = fmt.content.w * 0.42;
  const size = fitSize(cta, [S.title, S.title * 0.85, S.title * 0.72], textW);
  const studio = getRemotionEnvironment().isStudio;
  return (
    <SceneFrame bg={bg} full contentStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
      <div style={{width: textW, display: 'flex', flexDirection: 'column', gap: S.label * 0.9}}>
        <Pop>
          <Logo width={brand.logo.width * 0.8} bg={bg} />
        </Pop>
        {cta ? <PopWords text={cta} bg={bg} size={size} delay={6} /> : null}
        {p.sub ? (
          <Rise delay={12}>
            <Body text={p.sub} bg={bg} size={S.body} muted />
          </Rise>
        ) : null}
        {pills}
      </div>
      {studio ? <EndScreenGuide /> : null}
    </SceneFrame>
  );
};

/** Panduan posisi elemen end screen (hanya di Studio). */
const EndScreenGuide: React.FC = () => {
  const dash = `4px dashed ${alpha('#FFFFFF', 0.6)}`;
  const label: React.CSSProperties = {fontFamily: FONT_BODY, fontSize: 26, color: alpha('#FFFFFF', 0.8), padding: 16};
  return (
    <div style={{position: 'absolute', right: 0, top: 60, width: 820, display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'flex-end'}}>
      <div style={{width: 760, height: 428, border: dash, borderRadius: 16, ...label}}>end screen: video / playlist</div>
      <div style={{display: 'flex', gap: 40, alignItems: 'center'}}>
        <div style={{width: 200, height: 200, border: dash, borderRadius: 100, ...label}}>subscribe</div>
        <div style={{width: 520, height: 200, border: dash, borderRadius: 16, ...label}}>video kedua (opsional)</div>
      </div>
    </div>
  );
};

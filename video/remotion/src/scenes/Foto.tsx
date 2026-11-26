import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, alpha, brand, fitSize, useFormat} from '../theme';
import {FONT_BODY} from '../generated/fonts';
import {SceneFrame, imgSrc} from '../components/Frame';
import {Body, Kicker, PopWords} from '../components/Text';
import {Rise} from '../components/Motion';
import type {Bg, ImageItem} from '../types';
import {bgOf, type SceneViewProps} from './shared';

type Photo = {src: string; at: number; text?: string; focus?: string};

/** Foto (satu atau beberapa berganti) di kartu bersudut bulat dengan zoom pelan. */
export const FotoScene: React.FC<SceneViewProps> = ({scene, duration}) => {
  const fmt = useFormat();
  const {fps} = useVideoConfig();
  const S = fmt.size;
  const bg = bgOf(scene);
  const p = scene.props ?? {};
  const raw: ImageItem[] = p.images?.length ? p.images : p.image ? [p.image] : [];
  const n = raw.length;
  const imgs: Photo[] = raw.map((im, i) =>
    typeof im === 'string'
      ? {src: im, at: (i * duration) / fps / n}
      : {src: im.src, at: typeof im.at === 'number' ? im.at : (i * duration) / fps / n, text: im.text, focus: im.focus},
  );
  const title = scene.onScreen ?? p.title ?? '';

  if (fmt.vertical) {
    const size = fitSize(title, [S.title * 0.9, S.title * 0.75, S.title * 0.62], fmt.content.w);
    return (
      <SceneFrame bg={bg} contentStyle={{justifyContent: 'flex-start', gap: S.label * 0.8}}>
        {title ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: S.label * 0.5}}>
            {p.kicker ? <Kicker text={p.kicker} bg={bg} size={S.label} /> : null}
            <PopWords text={title} bg={bg} size={size} stagger={2} />
          </div>
        ) : null}
        <Rise delay={2} style={{flex: 1, position: 'relative'}}>
          <PhotoCard imgs={imgs} focus={p.focus} duration={duration} bg={bg} />
        </Rise>
      </SceneFrame>
    );
  }
  const textW = fmt.content.w * 0.34;
  const size = fitSize(title, [S.title * 0.9, S.title * 0.75, S.title * 0.62], textW);
  return (
    <SceneFrame bg={bg} contentStyle={{flexDirection: 'row', alignItems: 'stretch', gap: fmt.content.w * 0.04}}>
      <Rise delay={2} from="left" style={{flex: 1, position: 'relative'}}>
        <PhotoCard imgs={imgs} focus={p.focus} duration={duration} bg={bg} />
      </Rise>
      {title || p.sub ? (
        <div style={{width: textW, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: S.label * 0.7}}>
          {p.kicker ? <Kicker text={p.kicker} bg={bg} size={S.label} /> : null}
          {title ? <PopWords text={title} bg={bg} size={size} stagger={2} /> : null}
          {p.sub ? (
            <Rise delay={12}>
              <Body text={p.sub} bg={bg} size={S.body} muted />
            </Rise>
          ) : null}
        </div>
      ) : null}
    </SceneFrame>
  );
};

/** Kartu foto: zoom pelan sepanjang adegan, ganti foto dengan crossfade 8 frame. */
const PhotoCard: React.FC<{imgs: Photo[]; focus?: string; duration: number; bg: Bg}> = ({imgs, focus, duration, bg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fmt = useFormat();
  const t = frame / fps;
  const scale = interpolate(frame, [0, duration], [1, 1.08], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{borderRadius: brand.radius.card, overflow: 'hidden', background: alpha(C.text, 0.08), boxShadow: `0 24px 60px ${alpha('#000000', bg === 'light' ? 0.18 : 0.35)}`}}>
      {imgs.map((im, i) => {
        const fade = interpolate(t, [im.at, im.at + 8 / fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const next = imgs[i + 1];
        const visible = t >= im.at - 0.001 && (!next || t < next.at + 8 / fps);
        if (!visible) return null;
        return (
          <AbsoluteFill key={i} style={{opacity: i === 0 ? 1 : fade}}>
            <Img src={imgSrc(im.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: im.focus ?? focus ?? '50% 50%', scale: String(scale)}} />
            {im.text ? (
              <div
                style={{
                  position: 'absolute',
                  left: 28,
                  bottom: 28,
                  fontFamily: FONT_BODY,
                  fontWeight: 700,
                  fontSize: fmt.size.label,
                  padding: `${fmt.size.label * 0.3}px ${fmt.size.label * 0.65}px`,
                  borderRadius: fmt.size.label,
                  background: C.accent,
                  color: C.accentText,
                }}
              >
                {im.text}
              </div>
            ) : null}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

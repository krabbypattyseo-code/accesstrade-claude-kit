import React from 'react';
import {AbsoluteFill, Img, getRemotionEnvironment} from 'remotion';
import {C, FORMATS, FormatContext, alpha, fitSize} from './theme';
import {FONT_DISPLAY} from './generated/fonts';
import {Background, Logo, imgSrc} from './components/Frame';
import {Kicker, Rich} from './components/Text';
import type {VideoScript} from './types';

/** Cover dirender sebagai still (frame terakhir). Isinya statis, tanpa animasi. */
export const COVER_FRAMES = 30;

/** Foto cover: cover.image, kalau kosong foto pertama di adegan foto. */
const coverImage = (s: VideoScript) =>
  s.cover?.image ??
  s.scenes
    .map((x) => x.props?.image ?? (typeof x.props?.images?.[0] === 'string' ? x.props?.images?.[0] : x.props?.images?.[0]?.src))
    .find(Boolean);

/**
 * Cover Reels 1080×1920. Judul ada di kotak tengah (y 420–1500) supaya tetap utuh saat grid profil
 * memotong jadi 1:1 atau 4:5. Garis potong hanya tampil di Studio.
 */
export const ReelsCover: React.FC<VideoScript> = (script) => {
  const text = script.cover?.text ?? script.title ?? '';
  const image = coverImage(script);
  const size = fitSize(text, [140, 122, 106, 92, 80], 900);
  const studio = getRemotionEnvironment().isStudio;
  return (
    <FormatContext.Provider value={FORMATS.reels}>
      <AbsoluteFill style={{color: C.text, overflow: 'hidden'}}>
        {image ? (
          <>
            <Img src={imgSrc(image)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <AbsoluteFill style={{background: `linear-gradient(180deg, ${alpha(C.background, 0.35)} 0%, ${alpha(C.background, 0.82)} 45%, ${alpha(C.background, 0.82)} 70%, ${alpha(C.background, 0.4)} 100%)`}} />
          </>
        ) : (
          <Background bg="dark" />
        )}
        <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Logo width={260} bg="dark" />
        </div>
        <div style={{position: 'absolute', left: 90, right: 90, top: 420, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 36}}>
          {script.cover?.kicker ? <Kicker text={script.cover.kicker} bg="dark" size={44} /> : null}
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: '-0.01em'}}>
            <Rich text={text} bg="dark" />
          </div>
          <div style={{width: 180, height: 14, borderRadius: 7, background: C.accent}} />
        </div>
        {studio ? <CropGuides /> : null}
      </AbsoluteFill>
    </FormatContext.Provider>
  );
};

const CropGuides: React.FC = () => (
  <>
    {[
      {y: [420, 1500], label: '1:1'},
      {y: [285, 1635], label: '4:5'},
    ].map((g) =>
      g.y.map((y) => (
        <div key={`${g.label}${y}`} style={{position: 'absolute', left: 0, right: 0, top: y, borderTop: '3px dashed rgba(255,255,255,0.7)', fontSize: 26, color: '#fff', paddingLeft: 12}}>
          {g.label}
        </div>
      )),
    )}
  </>
);

/** Thumbnail YouTube 1280×720: judul besar di kiri, foto di kanan (atau bentuk warna brand kalau tanpa foto). */
export const YoutubeThumbnail: React.FC<VideoScript> = (script) => {
  const text = script.cover?.text ?? script.title ?? '';
  const image = coverImage(script);
  const size = fitSize(text, [128, 110, 94, 80, 68], 700);
  return (
    <FormatContext.Provider value={FORMATS.youtube}>
      <AbsoluteFill style={{color: C.text, overflow: 'hidden'}}>
        <Background bg="dark" />
        {image ? (
          <div style={{position: 'absolute', right: -40, top: 60, width: 560, height: 600, rotate: '3deg', borderRadius: 36, overflow: 'hidden', border: `10px solid ${C.accent}`, boxShadow: '0 30px 60px rgba(0,0,0,0.45)'}}>
            <Img src={imgSrc(image)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        ) : (
          <div style={{position: 'absolute', right: -160, top: -120, width: 700, height: 700, borderRadius: 350, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{marginRight: 120, marginTop: 120}}>
              <Logo width={300} bg="brand" />
            </div>
          </div>
        )}
        <div style={{position: 'absolute', left: 64, top: 0, bottom: 0, width: image ? 680 : 640, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24}}>
          {script.cover?.kicker ? <Kicker text={script.cover.kicker} bg="dark" size={34} /> : null}
          <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.02em', WebkitTextStroke: `4px ${C.background}`, paintOrder: 'stroke fill'}}>
            <Rich text={text} bg="dark" />
          </div>
        </div>
      </AbsoluteFill>
    </FormatContext.Provider>
  );
};

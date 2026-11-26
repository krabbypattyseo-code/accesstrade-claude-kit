import React from 'react';
import {AbsoluteFill, CalculateMetadataFunction, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {C, FORMATS, FormatContext, brand, useFormat} from './theme';
import type {Clip, Format, Scene, TransitionKind, VideoScript} from './types';
import {stripHighlight, wordsFromScenes} from './parse';
import {CaptionTrack, type CaptionSpan} from './components/Caption';
import {SceneEnter, TRANSITION_FRAMES, WipeOverlay} from './components/Transitions';
import {ConfirmStamp} from './components/Frame';
import {bgOf, type SceneViewProps} from './scenes/shared';
import {HookScene} from './scenes/Hook';
import {BabScene} from './scenes/Bab';
import {PoinScene} from './scenes/Poin';
import {DaftarScene} from './scenes/Daftar';
import {AngkaScene} from './scenes/Angka';
import {KutipanScene} from './scenes/Kutipan';
import {FotoScene} from './scenes/Foto';
import {BandingScene} from './scenes/Banding';
import {OutroScene} from './scenes/Outro';
import {KlipScene} from './scenes/Klip';

const src = (s: string) => (/^https?:/.test(s) ? s : staticFile(s));

/** Tipe adegan → komponen. Tipe baru: tambahkan di sini, di src/types.ts, dan di lib/scripts.mjs (TYPE_ALIASES). */
const SCENES: Record<Scene['type'], React.FC<SceneViewProps>> = {
  hook: HookScene,
  bab: BabScene,
  poin: PoinScene,
  daftar: DaftarScene,
  angka: AngkaScene,
  kutipan: KutipanScene,
  foto: FotoScene,
  banding: BandingScene,
  outro: OutroScene,
  klip: KlipScene,
};

type Planned = {scene: Scene; from: number; duration: number; tail: number; transition: TransitionKind; chapter?: {index: number; total: number}};

export const planScenes = (script: VideoScript, fps: number): Planned[] => {
  const scenes = [...script.scenes].sort((a, b) => a.start - b.start);
  const babs = scenes.filter((s) => s.type === 'bab');
  const out: Planned[] = scenes.map((scene, i) => ({
    scene,
    from: Math.round(scene.start * fps),
    duration: Math.max(1, Math.round(scene.end * fps) - Math.round(scene.start * fps)),
    tail: 0,
    transition: i === 0 ? 'cut' : (scene.transition ?? (brand.motion.transition as TransitionKind)),
    chapter: scene.type === 'bab' ? {index: babs.indexOf(scene), total: babs.length} : undefined,
  }));
  // slide & fade: adegan lama tetap tampil di bawah selama adegan baru masuk
  out.forEach((p, i) => {
    const next = out[i + 1];
    if (next && (next.transition === 'slide' || next.transition === 'fade')) p.tail = TRANSITION_FRAMES;
  });
  return out;
};

const same = (a?: string, b?: string) => {
  const n = (s?: string) => stripHighlight(s ?? '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  return Boolean(a && b) && n(a) === n(b);
};

/**
 * Caption per adegan. Default mati di outro dan di adegan yang teks layarnya sama persis dengan suaranya
 * (mis. hook yang dibaca apa adanya). props.caption "on" / "off" memaksa per adegan.
 */
const captionSpans = (plan: Planned[], fps: number, onHook: boolean): CaptionSpan[] =>
  plan.map((p) => {
    const ms = (f: number) => (f / fps) * 1000;
    const forced = p.scene.props?.caption;
    // hook tanpa caption kalau tokens caption.<format>.onHook = false (playbook-footage.md: hook cukup teks hook)
    const auto = !(p.scene.type === 'outro' || (p.scene.type === 'hook' && !onHook) || same(p.scene.onScreen, p.scene.vo));
    return {fromMs: ms(p.from), toMs: ms(p.from + p.duration), on: forced ? forced === 'on' : auto, light: bgOf(p.scene) === 'light'};
  });

/** Musik turun (tokens.audio.musicDuckDb) selama ada suara; jeda < 1,5 dtk dianggap masih bicara. */
const duckCurve = (clips: Clip[], fps: number) => {
  const low = Math.pow(10, brand.audio.musicDuckDb / 20);
  const ranges: [number, number][] = [];
  for (const c of [...clips].sort((a, b) => a.start - b.start)) {
    const a = Math.round(c.start * fps);
    const b = Math.round((c.start + c.duration) * fps);
    const last = ranges[ranges.length - 1];
    if (last && a - last[1] < 1.5 * fps) last[1] = Math.max(last[1], b);
    else ranges.push([a, b]);
  }
  const R = 8;
  return (f: number) => {
    let g = 1;
    for (const [a, b] of ranges) {
      const k = f < a - R || f > b + R ? 0 : f < a ? (f - (a - R)) / R : f > b ? 1 - (f - b) / R : 1;
      g = Math.min(g, 1 - (1 - low) * k);
    }
    return g;
  };
};

const VideoInner: React.FC<VideoScript> = (script) => {
  const {fps} = useVideoConfig();
  const fmt = useFormat();
  const plan = React.useMemo(() => planScenes(script, fps), [script, fps]);
  const clips = script.media?.clips ?? [];
  const words = script.words?.length ? script.words : wordsFromScenes(script.scenes);
  const musicCfg = script.media?.music;
  const music = typeof musicCfg === 'string' ? {src: musicCfg, volume: brand.audio.musicVolume} : musicCfg;
  const duck = React.useMemo(() => duckCurve(clips, fps), [clips, fps]);
  return (
    <AbsoluteFill style={{background: C.background}}>
      {plan.map((p, i) => {
        const View = SCENES[p.scene.type] ?? PoinScene;
        return (
          <Sequence key={`s${i}`} from={p.from} durationInFrames={p.duration + p.tail} name={`${p.scene.type} · ${p.scene.id}`} style={{zIndex: i + 1}}>
            <SceneEnter kind={p.transition}>
              <View scene={p.scene} duration={p.duration} chapter={p.chapter} />
              {p.scene.needsConfirm ? <ConfirmStamp /> : null}
            </SceneEnter>
          </Sequence>
        );
      })}

      {script.captions !== false ? (
        <Sequence name="caption" style={{zIndex: 100}}>
          <CaptionTrack words={words} spans={captionSpans(plan, fps, fmt.caption.onHook)} />
        </Sequence>
      ) : null}

      {plan.map((p, i) =>
        p.transition === 'wipe' ? (
          <Sequence key={`w${i}`} from={Math.max(0, p.from - TRANSITION_FRAMES)} durationInFrames={TRANSITION_FRAMES * 2} name="wipe" style={{zIndex: 200}}>
            <WipeOverlay />
          </Sequence>
        ) : null,
      )}

      {clips.map((c, i) => (
        <Audio key={`vo${i}`} src={src(c.src)} from={Math.round(c.start * fps)} durationInFrames={Math.max(1, Math.ceil(c.duration * fps) + 2)} name={`suara · ${c.sceneId}`} />
      ))}
      {plan.flatMap((p, i) =>
        (p.scene.sfx ?? []).map((fx, k) => (
          <Audio key={`sfx${i}-${k}`} src={src(fx.src)} from={p.from + Math.round((fx.at ?? 0) * fps)} volume={fx.volume ?? 0.5} name={`sfx · ${p.scene.id}`} />
        )),
      )}
      {music?.src ? <Audio src={src(music.src)} loop name="musik" volume={(f) => (music.volume ?? brand.audio.musicVolume) * duck(f)} /> : null}
    </AbsoluteFill>
  );
};

export const ReelsVideo: React.FC<VideoScript> = (props) => (
  <FormatContext.Provider value={FORMATS.reels}>
    <VideoInner {...props} />
  </FormatContext.Provider>
);

export const YoutubeVideo: React.FC<VideoScript> = (props) => (
  <FormatContext.Provider value={FORMATS.youtube}>
    <VideoInner {...props} />
  </FormatContext.Provider>
);

/** Durasi composition = akhir adegan terakhir (sudah disusun ulang dari panjang rekaman oleh lib/scripts.mjs). */
export const makeVideoMetadata =
  (format: Format): CalculateMetadataFunction<VideoScript> =>
  async ({props}) => {
    const f = FORMATS[format];
    const end = Math.max(1, ...props.scenes.map((s) => s.end));
    return {durationInFrames: Math.ceil(end * f.fps), fps: f.fps, width: f.width, height: f.height};
  };

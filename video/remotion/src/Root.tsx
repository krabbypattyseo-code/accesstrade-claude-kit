import React from 'react';
import {Composition, Folder} from 'remotion';
import {FORMATS} from './theme';
import {ReelsVideo, YoutubeVideo, makeVideoMetadata} from './Video';
import {COVER_FRAMES, ReelsCover, YoutubeThumbnail} from './Cover';
import type {Format, VideoScript} from './types';
import scripts from './generated/scripts.json';

type Entry = {id: string; format: Format; script: VideoScript};
const list = scripts as unknown as Entry[];

/** Contoh bawaan kalau belum ada script sama sekali. */
const fallback = (format: Format): VideoScript => ({
  format,
  number: '00',
  title: 'Contoh',
  demo: true,
  scenes: [
    {id: 1, type: 'hook', start: 0, end: 3, onScreen: 'Belum ada *script*', props: {kicker: format}},
    {id: 2, type: 'outro', start: 3, end: format === 'youtube' ? 15 : 6, onScreen: 'Tulis script di folder scripts/'},
  ],
});
const first = (f: Format) => list.find((e) => e.format === f)?.script ?? fallback(f);

const reels = {width: FORMATS.reels.width, height: FORMATS.reels.height, fps: FORMATS.reels.fps};
const youtube = {width: FORMATS.youtube.width, height: FORMATS.youtube.height, fps: FORMATS.youtube.fps};
const reelsMeta = makeVideoMetadata('reels');
const youtubeMeta = makeVideoMetadata('youtube');

export const RemotionRoot: React.FC = () => (
  <>
    {/* Empat composition yang dipakai render.mjs (props diganti dari file script). Default: script pertama tiap format. */}
    <Composition id="Reels" component={ReelsVideo} {...reels} durationInFrames={300} calculateMetadata={reelsMeta} defaultProps={first('reels')} />
    <Composition id="ReelsCover" component={ReelsCover} {...reels} durationInFrames={COVER_FRAMES} defaultProps={first('reels')} />
    <Composition id="Youtube" component={YoutubeVideo} {...youtube} durationInFrames={300} calculateMetadata={youtubeMeta} defaultProps={first('youtube')} />
    <Composition id="YoutubeThumbnail" component={YoutubeThumbnail} width={1280} height={720} fps={30} durationInFrames={COVER_FRAMES} defaultProps={first('youtube')} />

    {/* Semua script, untuk dicek satu per satu di Studio */}
    <Folder name="reels">
      {list
        .filter((e) => e.format === 'reels')
        .map((e) => (
          <React.Fragment key={e.id}>
            <Composition id={e.id} component={ReelsVideo} {...reels} durationInFrames={300} calculateMetadata={reelsMeta} defaultProps={e.script} />
            <Composition id={`${e.id}-cover`} component={ReelsCover} {...reels} durationInFrames={COVER_FRAMES} defaultProps={e.script} />
          </React.Fragment>
        ))}
    </Folder>
    <Folder name="youtube">
      {list
        .filter((e) => e.format === 'youtube')
        .map((e) => (
          <React.Fragment key={e.id}>
            <Composition id={e.id} component={YoutubeVideo} {...youtube} durationInFrames={300} calculateMetadata={youtubeMeta} defaultProps={e.script} />
            <Composition id={`${e.id}-thumbnail`} component={YoutubeThumbnail} width={1280} height={720} fps={30} durationInFrames={COVER_FRAMES} defaultProps={e.script} />
          </React.Fragment>
        ))}
    </Folder>
  </>
);

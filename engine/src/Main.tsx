import React from 'react';
import {AbsoluteFill, interpolate, Sequence, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {FPS} from './theme';
import {OPENER_SEC, STORIES} from './content';
import {TL, TOTAL_SEC, END_CARD_AT} from './lib/timeline';
import {StoryView} from './Story';
import {Chrome} from './components/Chrome';
import {Bumper, BUMPER_SEC} from './components/Bumper';
import {Opener} from './components/Opener';
import {Grain} from './components/ui';

const f = (s: number) => Math.round(s * FPS);

/** Global music level: low under the voice, swelling a little in the gaps. */
const VOICE = TL.map((x) => [x.voStart, x.voStart + STORIES[x.i].dur] as const);
const voiceNear = (g: number) => {
  let d = 99;
  for (const [a, z] of VOICE) {
    if (g >= a && g <= z) return 0;
    d = Math.min(d, Math.abs(g - a), Math.abs(g - z));
  }
  return d;
};
const level = (g: number, under: number, gap: number) => interpolate(voiceNear(g), [0, 0.35], [under, gap], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const S = (id: string) => TL[STORIES.findIndex((s) => s.id === id)];

export const Main: React.FC = () => {
  const s08 = S('s08'), s09 = S('s09'), s11 = S('s11'), s14 = S('s14');
  const segA = {from: 0, to: s08.visStart + 0.4};
  const segB = {from: s09.visStart - 0.6, to: s11.visStart + 0.2};
  const segC = {from: s11.visStart - 0.6, to: s14.visStart + 0.3};
  const segD = {from: s14.visStart, to: TOTAL_SEC};
  const fadeEdges = (g: number, a: number, z: number, fin = 0.6, fout = 0.8) =>
    interpolate(g, [a, a + fin, z - fout, z], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#060F29'}}>
      {STORIES.map((s, i) => (
        <Sequence key={s.id} from={f(TL[i].visStart)} durationInFrames={f(TL[i].visEnd - TL[i].visStart) + 2} name={`Story ${s.id}`}>
          <StoryView s={s} />
        </Sequence>
      ))}
      <Chrome />
      {STORIES.map((s, i) =>
        s.bumper ? (
          <Sequence key={'b' + s.id} from={f(TL[i].visStart - BUMPER_SEC / 2)} durationInFrames={f(BUMPER_SEC)} name={`Bumper ${s.id}`}>
            <Bumper s={s} />
          </Sequence>
        ) : null,
      )}
      <Sequence durationInFrames={f(OPENER_SEC)} name="Opener">
        <Opener />
      </Sequence>
      {/* voice */}
      {STORIES.map((s, i) => (
        <Sequence key={'v' + s.id} from={f(TL[i].voStart)} name={`VO ${s.id}`}>
          <Audio src={staticFile(`vo/${s.vo}.wav`)} volume={1} />
        </Sequence>
      ))}
      {/* music */}
      <Sequence from={f(segA.from)} durationInFrames={f(segA.to - segA.from)} name="Music A">
        <Audio src={staticFile('music/music_1.mp3')} loop volume={(fr) => {
          const g = segA.from + fr / FPS;
          const base = g < OPENER_SEC ? interpolate(g, [0, 0.5, OPENER_SEC - 0.5, OPENER_SEC + 0.5], [0, 0.32, 0.32, 0.07], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : level(g, 0.065, 0.2);
          return base * fadeEdges(g, segA.from - 1, segA.to, 0.01, 1.6);
        }} />
      </Sequence>
      <Sequence from={f(segB.from)} durationInFrames={f(segB.to - segB.from)} name="Music B">
        <Audio src={staticFile('music/music_1.mp3')} trimBefore={f(40)} loop volume={(fr) => {
          const g = segB.from + fr / FPS;
          return level(g, 0.065, 0.2) * fadeEdges(g, segB.from, segB.to, 1.0, 0.8);
        }} />
      </Sequence>
      <Sequence from={f(segC.from)} durationInFrames={f(segC.to - segC.from)} name="Music C (viral)">
        <Audio src={staticFile('music/music_2.mp3')} loop volume={(fr) => {
          const g = segC.from + fr / FPS;
          return level(g, 0.045, 0.16) * fadeEdges(g, segC.from, segC.to, 0.6, 0.9);
        }} />
      </Sequence>
      <Sequence from={f(segD.from)} durationInFrames={f(segD.to - segD.from)} name="Music D (outro)">
        <Audio src={staticFile('music/music_1.mp3')} trimBefore={f(120)} volume={(fr) => {
          const g = segD.from + fr / FPS;
          const v = g < END_CARD_AT ? level(g, 0.07, 0.2) : interpolate(g, [END_CARD_AT, END_CARD_AT + 0.8], [0.07, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return v * fadeEdges(g, segD.from, segD.to, 0.8, 2.0);
        }} />
      </Sequence>
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

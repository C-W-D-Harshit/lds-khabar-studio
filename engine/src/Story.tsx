import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Beat, LEAD, Story as StoryT} from './content';
import {EIN, io, LeadCtx, useT} from './lib/anim';
import {PhotoBeat, StoryBg} from './components/layouts';
import {Greeting, Panchang, Slam, Tithi, Tulsi, Welcome} from './scenes/s01';
import {CycloneMap, MapPin, Wind} from './scenes/maps';
import {CrimeBoard, Gainers, Market, Steps} from './scenes/s03s04';
import {Epfo, Price, Vaccine, Warning} from './scenes/s05s06';
import {Missile, Score, Seats, Tribute, TwoPlus} from './scenes/s07s10';
import {Cctv, Chat, Phone, Round2, ViralIntro, Wrap} from './scenes/viral';
import {Outro} from './scenes/outro';

const MAP: Record<string, React.FC<{b: Beat; t: number}>> = {
  welcome: Welcome, panchang: Panchang, tithi: Tithi, tulsi: Tulsi, greeting: Greeting, slam: Slam,
  cycloneMap: CycloneMap, wind: Wind, mapPin: MapPin, photo: PhotoBeat,
  crimeBoard: CrimeBoard, steps: Steps, market: Market, gainers: Gainers,
  epfo: Epfo, vaccine: Vaccine, price: Price, warning: Warning,
  twoPlus: TwoPlus, missile: Missile, tribute: Tribute, seats: Seats, score: Score,
  viralIntro: ViralIntro, phone: Phone, cctv: Cctv, round2: Round2, chat: Chat, wrap: Wrap, outro: Outro,
};

const FALLBACK_BG: Record<string, string> = {
  s01: 's01_tulsi/s01_01.jpg', s11: 's11_notes/viral_frame_burning_720x1280.jpg', s12: 's12_bulls/viral_frame_bull_on_car_720x1280.jpg', s13: 's12_bulls/viral_frame_bull_on_car_720x1280.jpg', s14: 's04_market/s04_01.jpg',
};

const vis = (t: number, b: Beat) => Math.min(io(t, b.at - 0.15, b.at + 0.35), 1 - io(t, b.until - 0.05, b.until + 0.3, EIN));

const Inner: React.FC<{s: StoryT}> = ({s}) => {
  const t = useT();
  // background segments
  let prev: string | undefined = s.beats.find((b) => b.src)?.src ?? FALLBACK_BG[s.id] ?? 's02_cyclone/s02_01.jpg';
  const bgs = s.beats.map((b) => (prev = b.src ?? prev));
  const segs: {src: string; a: number; z: number}[] = [];
  s.beats.forEach((b, i) => {
    const last = segs[segs.length - 1];
    if (last && last.src === bgs[i]) last.z = b.until;
    else segs.push({src: bgs[i]!, a: b.at, z: b.until});
  });
  if (segs.length) {
    segs[0].a = -10;
    segs[segs.length - 1].z = 999;
  }
  const somber = s.mood === 'somber';
  return (
    <AbsoluteFill>
      {segs.map((g, i) => {
        const o = Math.min(io(t, g.a - 0.2, g.a + 0.5), 1 - io(t, g.z - 0.2, g.z + 0.5, EIN));
        if (o <= 0) return null;
        return (
          <AbsoluteFill key={i} style={{opacity: i === 0 ? 1 - io(t, g.z - 0.2, g.z + 0.5, EIN) : o}}>
            <StoryBg src={g.src} t={t} somber={somber} />
          </AbsoluteFill>
        );
      })}
      {s.beats.map((b, i) => {
        if (t < b.at - 0.2 || t > b.until + 0.35) return null;
        const Comp = MAP[b.kind];
        if (!Comp) return null;
        const o = vis(t, b);
        return (
          <AbsoluteFill key={i} style={{opacity: o}}>
            <Comp b={b} t={t} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

export const StoryView: React.FC<{s: StoryT; lead?: number}> = ({s, lead = LEAD}) => (
  <LeadCtx.Provider value={lead}>
    <Inner s={s} />
  </LeadCtx.Provider>
);

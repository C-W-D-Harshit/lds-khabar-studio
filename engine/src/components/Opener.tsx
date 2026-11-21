import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {C, F} from '../theme';
import {EIN, EOUT, io, lerp, pop} from '../lib/anim';
import {Logo} from './Chrome';
import {Grain, Particles, img} from './ui';
import {DATE_HI, DAY_HI, OPENER_FLASHES as FLASHES} from '../content';

const F0 = 2.6;
const FD = 0.95;

export const Opener: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const ringDraw = io(t, 0.1, 1.0);
  const logoS = pop(t, 0.85, fps, 9, 160);
  const shake = t > 0.95 && t < 1.25 ? Math.sin(t * 90) * (1.25 - t) * 30 : 0;
  const word = io(t, 1.15, 1.6);
  const intro = 1 - io(t, F0 - 0.15, F0 + 0.1, EIN);
  const flashIdx = Math.floor((t - F0) / FD);
  const flashT = t - F0 - flashIdx * FD;
  const white = Math.max(io(t, 7.25, 7.4), 0) * (1 - io(t, 7.4, 7.5));
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${C.navy2}, ${C.navyDeep} 70%)`, overflow: 'hidden'}}>
      {/* intro segment */}
      <AbsoluteFill style={{opacity: intro, transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 960 - 300 - i * 140, top: 470 - 300 - i * 140, width: 600 + i * 280, height: 600 + i * 280, borderRadius: '50%', border: `2px ${i % 2 ? 'dashed' : 'solid'} rgba(255,255,255,${0.16 - i * 0.03})`, transform: `rotate(${t * (i % 2 ? -20 : 25)}deg) scale(${lerp(t, 0, 1.1, 0.4, 1)})`}} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={'b' + i} style={{position: 'absolute', left: 960, top: 470, width: 1400, height: 6, background: `linear-gradient(90deg, ${i % 2 ? C.red : C.yellow}, transparent)`, transformOrigin: '0 50%', transform: `rotate(${i * 60 + t * 40}deg) scaleX(${io(t, 0.2 + i * 0.05, 0.9)})`, opacity: 0.35}} />
        ))}
        <Particles n={40} color="#9EC1FF" seed={3} speed={60} size={5} opacity={0.6} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <circle cx={960} cy={470} r={190} fill="none" stroke={C.red} strokeWidth={14} strokeDasharray={1194} strokeDashoffset={1194 * (1 - ringDraw)} transform="rotate(-90 960 470)" strokeLinecap="round" />
          <circle cx={960} cy={470} r={214} fill="none" stroke={C.yellow} strokeWidth={5} strokeDasharray={1345} strokeDashoffset={-1345 * (1 - ringDraw)} transform="rotate(90 960 470)" />
        </svg>
        <div style={{position: 'absolute', left: 960 - 170, top: 470 - 170, transform: `scale(${logoS})`}}>
          <Logo size={340} t={t} ring={false} />
        </div>
        <div style={{position: 'absolute', left: 960 - 170, top: 470 - 170, width: 340, height: 340, borderRadius: '50%', boxShadow: `0 0 ${io(t, 0.95, 1.2) * (1 - io(t, 1.2, 1.9)) * 200}px ${io(t, 0.95, 1.2) * 60}px rgba(255,255,255,0.8)`}} />
        <div style={{position: 'absolute', top: 730, width: '100%', textAlign: 'center', opacity: word, transform: `translateY(${(1 - word) * 30}px)`}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 92, color: '#fff', lineHeight: 1, letterSpacing: 2}}>LDS <span style={{color: C.yellow}}>खबर</span></div>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, marginTop: 18}}>
            <div style={{background: C.red, color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 40, padding: '8px 26px 2px', borderRadius: 6, transform: `scale(${pop(t, 1.45)})`}}>{DATE_HI} • {DAY_HI}</div>
            <div style={{background: '#fff', color: C.navy, fontFamily: F.head, fontWeight: 700, fontSize: 40, padding: '8px 26px 2px', borderRadius: 6, transform: `scale(${pop(t, 1.65)})`}}>आज की बड़ी खबरें</div>
          </div>
        </div>
      </AbsoluteFill>

      {/* headline flashes */}
      {flashIdx >= 0 && flashIdx < FLASHES.length && (() => {
        const fl = FLASHES[flashIdx];
        const glitch = flashT < 0.12 ? (1 - flashT / 0.12) : 0;
        const tx = io(flashT, 0.05, 0.35);
        return (
          <AbsoluteFill>
            <Img src={img(fl.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.18 - flashT * 0.12}) translateX(${glitch * 40}px)`, filter: 'saturate(1.15) contrast(1.05)'}} />
            {glitch > 0 && <Img src={img(fl.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(1.18) translateX(${-glitch * 60}px)`, mixBlendMode: 'screen', opacity: 0.6, filter: 'hue-rotate(160deg) saturate(3)'}} />}
            <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(6,15,41,0.92) 0%, rgba(6,15,41,0.55) 55%, rgba(6,15,41,0.1) 100%)'}} />
            {glitch > 0 && new Array(6).fill(0).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: ((i * 173 + flashIdx * 91) % 1000), height: 14 + (i % 3) * 12, background: i % 2 ? 'rgba(224,20,30,0.7)' : 'rgba(255,255,255,0.5)', transform: `translateX(${(i % 2 ? 1 : -1) * glitch * 300}px)`}} />)}
            <div style={{position: 'absolute', left: 120, top: 360}}>
              <div style={{display: 'inline-block', background: C.red, color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 48, padding: '10px 26px 2px', borderRadius: 6, transform: `translateX(${(1 - tx) * -80}px)`}}>{fl.tag}</div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 124, color: '#fff', lineHeight: 1.08, marginTop: 14, maxWidth: 1500, clipPath: `inset(-20% ${(1 - tx) * 100}% -20% 0)`, textShadow: '0 10px 40px rgba(0,0,0,0.6)'}}>{fl.text}</div>
              <div style={{height: 10, width: 300 * tx, background: C.yellow, marginTop: 18, borderRadius: 5}} />
            </div>
            <div style={{position: 'absolute', right: 70, top: 60, fontFamily: F.num, fontWeight: 700, fontSize: 90, color: 'rgba(255,255,255,0.9)', lineHeight: 1}}>
              0{flashIdx + 1}<span style={{fontSize: 46, color: 'rgba(255,255,255,0.5)'}}>/05</span>
            </div>
            <div style={{position: 'absolute', left: 0, bottom: 0, height: 12, width: `${((flashIdx + flashT / FD) / FLASHES.length) * 100}%`, background: `linear-gradient(90deg, ${C.red}, ${C.yellow})`}} />
          </AbsoluteFill>
        );
      })()}
      <Grain opacity={0.08} />
      <AbsoluteFill style={{background: '#fff', opacity: white}} />
      <Sequence layout="none"><Audio src={staticFile('sfx/sfx_news_intro.mp3')} volume={0.55} /></Sequence>
      <Sequence from={Math.round(0.9 * fps)} layout="none"><Audio src={staticFile('sfx/sfx_impact_boom.mp3')} volume={0.45} /></Sequence>
      {FLASHES.map((_, i) => (
        <Sequence key={i} from={Math.round((F0 + i * FD) * fps)} durationInFrames={30} layout="none"><Audio src={staticFile('sfx/sfx_glitch.mp3')} volume={0.28} /></Sequence>
      ))}
      <Sequence from={Math.round(7.1 * fps)} durationInFrames={50} layout="none"><Audio src={staticFile('sfx/sfx_whoosh_3.mp3')} volume={0.4} /></Sequence>
    </AbsoluteFill>
  );
};
export {EOUT};

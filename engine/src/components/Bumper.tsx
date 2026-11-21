import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {C, F} from '../theme';
import {EIN, EIO, EOUT, io, lerp, pop} from '../lib/anim';
import {Story} from '../content';
import {Logo} from './Chrome';

export const BUMPER_SEC = 1.3;

export const Bumper: React.FC<{s: Story}> = ({s}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const v = s.bumper!.variant;
  const D = BUMPER_SEC;
  const inP = io(t, 0, 0.36, EIO);
  const outP = io(t, D - 0.38, D, EIN);
  const cols =
    v === 'somber' ? ['#2C2C33', '#0D0D10', '#8E8E96'] : v === 'fun' ? [C.yellow, C.red, '#7B2CFF'] : [C.red, C.navy, C.yellow];
  // three skewed panels sweeping right→left
  const panel = (i: number, color: string, w: number) => {
    const delay = i * 0.05;
    const pin = io(t, delay, 0.34 + delay, EIO);
    const pout = io(t, D - 0.4 + delay * 0.6, D - 0.02 + delay * 0.6, EIN);
    const x = lerp(pin, 0, 1, 2300, -150) + pout * -2600;
    return <div key={i} style={{position: 'absolute', top: -100, height: 1280, left: x, width: w, background: color, transform: 'skewX(-18deg)', boxShadow: '0 0 60px rgba(0,0,0,0.5)'}} />;
  };
  const content = Math.min(io(t, 0.22, 0.42), 1 - io(t, D - 0.36, D - 0.2));
  const title = s.bumper!.title;
  const tIn = io(t, 0.25, 0.6, EOUT);
  const kick = pop(t, 0.3);
  const chars = Array.from(title);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {panel(0, cols[0], 2400)}
      {panel(1, cols[1], 2250)}
      {v !== 'somber' && <div style={{position: 'absolute', top: -100, height: 1280, left: lerp(inP, 0, 1, 2400, 1500) + outP * -3600, width: 40, background: cols[2], transform: 'skewX(-18deg)'}} />}
      <AbsoluteFill style={{opacity: content, alignItems: 'center', justifyContent: 'center'}}>
        {/* giant outline background text */}
        <div style={{position: 'absolute', fontFamily: F.num, fontWeight: 700, fontSize: 620, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px ${v === 'fun' ? 'rgba(255,201,21,0.25)' : 'rgba(255,255,255,0.10)'}`, right: 60, top: 140, transform: `translateX(${(1 - tIn) * 120 - t * 40}px)`}}>{s.label}</div>
        <div style={{position: 'absolute', left: 140, top: 430, transform: `scale(${pop(t, 0.22)})`}}>
          <Logo size={190} t={t * 3} ring={v !== 'somber'} />
        </div>
        <div style={{position: 'absolute', left: 400, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <div style={{transform: `scale(${kick})`, transformOrigin: 'left center', background: v === 'somber' ? '#fff' : v === 'fun' ? C.red : C.yellow, color: v === 'somber' ? '#111' : v === 'fun' ? '#fff' : C.ink, fontFamily: F.head, fontWeight: 700, fontSize: 44, padding: '10px 26px 4px', borderRadius: 6}}>{s.bumper!.kicker}</div>
          <div style={{display: 'flex', marginTop: 4}}>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: v === 'fun' ? 230 : 200, lineHeight: 1.05, color: '#fff', textShadow: '0 12px 40px rgba(0,0,0,0.5)', clipPath: `inset(-20% ${(1 - tIn) * 100}% -20% 0)`, transform: `translateX(${(1 - tIn) * 60}px) ${v === 'fun' ? `rotate(${Math.sin(t * 14) * 1.5}deg)` : ''}`}}>
              {chars.join('')}
            </div>
            {v === 'fun' && <div style={{fontSize: 150, marginLeft: 20, marginTop: 40, transform: `scale(${pop(t, 0.45)}) rotate(${Math.sin(t * 10) * 12}deg)`}}>🔥</div>}
          </div>
          <div style={{height: 8, width: 520 * io(t, 0.4, 0.75), background: v === 'somber' ? '#BDBDC4' : C.red, marginTop: 6, borderRadius: 4}} />
        </div>
      </AbsoluteFill>
      {v !== 'somber' && (
        <Sequence layout="none">
          <Audio src={staticFile(`sfx/${v === 'fun' ? 'sfx_whoosh_2' : 'sfx_whoosh_1'}.mp3`)} volume={0.32} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

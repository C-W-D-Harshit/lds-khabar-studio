import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {EIN, EOUT, io, lerp, pop} from '../lib/anim';
import {Beat} from '../content';
import {CA, Card, Kicker, MarkerTitle, Photo, Point, Sfx} from './ui';

export const Rain: React.FC<{opacity?: number; n?: number}> = ({opacity = 0.5, n = 90}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg width="100%" height="100%">
        {new Array(n).fill(0).map((_, i) => {
          const r1 = Math.abs(Math.sin(i * 78.233)) % 1;
          const r2 = Math.abs(Math.sin(i * 12.9898)) % 1;
          const sp = 38 + r2 * 30;
          const y = ((r1 * 1200 + f * sp) % 1300) - 120;
          const x = ((r2 * 2100 + f * sp * 0.25) % 2100) - 100;
          const len = 40 + r1 * 50;
          return <line key={i} x1={x} y1={y} x2={x + len * 0.25} y2={y + len} stroke="rgba(210,225,255,0.75)" strokeWidth={1.6 + r1 * 1.4} strokeLinecap="round" />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Red rubber-stamp text that slams onto the frame. */
export const Stamp: React.FC<{t: number; at: number; text: string; color?: string; rot?: number; size?: number; style?: React.CSSProperties}> = ({t, at, text, color = C.red, rot = -12, size = 64, style}) => {
  if (t < at) return null;
  const s = lerp(t, at, at + 0.22, 2.4, 1, EIN);
  const o = io(t, at, at + 0.12);
  return (
    <div style={{position: 'absolute', transform: `rotate(${rot}deg) scale(${s})`, opacity: o, border: `6px solid ${color}`, color, padding: `${size * 0.12}px ${size * 0.4}px ${size * 0.02}px`, fontFamily: F.head, fontWeight: 700, fontSize: size, lineHeight: 1.1, borderRadius: 10, background: 'rgba(255,255,255,0.88)', boxShadow: `0 0 0 4px rgba(255,255,255,0.88), 0 12px 30px rgba(0,0,0,0.35)`, letterSpacing: 1, ...style}}>
      {text}
    </div>
  );
};

/** Lower-third caption inside a full photo. */
export const Caption: React.FC<{t: number; at: number; kicker?: string; text: string; somber?: boolean; width?: number}> = ({t, at, kicker, text, somber, width = 1300}) => {
  const k = pop(t, at + 0.15);
  const bar = io(t, at + 0.25, at + 0.8);
  const txt = io(t, at + 0.45, at + 0.95);
  const navy = somber ? '#17171C' : C.navy;
  const red = somber ? '#5A5A62' : C.red;
  return (
    <div style={{position: 'absolute', left: 40, bottom: 40, width}}>
      {kicker && <div style={{transform: `scale(${k})`, transformOrigin: 'left bottom', marginBottom: -2}}><Kicker text={kicker} bg={red} size={32} style={{borderRadius: '6px 6px 0 0'}} /></div>}
      <div style={{position: 'relative', overflow: 'hidden', clipPath: `inset(0 ${(1 - bar) * 100}% 0 0)`, background: `linear-gradient(90deg, ${navy} 0%, ${navy} 70%, ${somber ? '#2a2a31' : C.navy2} 100%)`, borderLeft: `10px solid ${somber ? '#BDBDC4' : C.yellow}`, padding: '20px 34px 14px', borderRadius: '0 8px 8px 8px', boxShadow: '0 20px 40px rgba(0,0,0,0.45)'}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 52, lineHeight: 1.18, color: C.white, opacity: txt, transform: `translateY(${(1 - txt) * 20}px)`}}>{text}</div>
      </div>
    </div>
  );
};

const GreenArrow: React.FC<{t: number; at: number}> = ({t, at}) => {
  const p = io(t, at, at + 1.2);
  const len = 1300;
  return (
    <svg width={CA.w} height={CA.h} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="ga" x1="0" x2="1"><stop offset="0" stopColor="#16C76A" stopOpacity="0" /><stop offset="1" stopColor="#16C76A" /></linearGradient>
      </defs>
      <path d="M 80 640 L 420 470 L 600 540 L 980 280 L 1180 330 L 1560 110" fill="none" stroke="url(#ga)" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len * 1.6} strokeDashoffset={len * 1.6 * (1 - p)} style={{filter: 'drop-shadow(0 0 18px rgba(22,199,106,0.8))'}} />
      <g transform="translate(1560,110) rotate(-30)" opacity={io(t, at + 1.0, at + 1.3)}>
        <path d="M -10 -36 L 52 0 L -10 36 Z" fill="#16C76A" />
      </g>
    </svg>
  );
};

export const PhotoBeat: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  if (b.layout === 'split') {
    const pi = io(t, b.at - 0.1, b.at + 0.5);
    const ci = io(t, b.at + 0.05, b.at + 0.6);
    const somber = !!b.somber;
    return (
      <>
        <div style={{position: 'absolute', left: CA.x, top: CA.y, transform: `translateX(${(1 - pi) * -70}px)`, opacity: pi, borderRadius: 18, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)'}}>
          <Photo src={b.src} w={1080} h={750} t={t} a={b.at} b={b.until} kb={b.kb} filter={somber ? 'grayscale(0.75) contrast(1.05)' : undefined} />
          {b.stamp && <div style={{position: 'absolute', right: 60, top: 60}}><Stamp t={t} at={b.stamp.at} text={b.stamp.text} size={78} /></div>}
          {b.stamp && <Sfx at={b.stamp.at} src="sfx_impact_boom" vol={0.18} dur={1.5} />}
        </div>
        <Card style={{left: 1150, top: CA.y, width: 730, height: 750, transform: `translateX(${(1 - ci) * 80}px)`, opacity: ci}}>
          <div style={{height: 10, background: somber ? '#3A3A40' : `linear-gradient(90deg, ${C.red}, ${C.saffron})`}} />
          <div style={{padding: '40px 46px 0'}}>
            <MarkerTitle text={b.title} t={t} at={b.at + 0.2} size={58} marker={somber ? '#D9D9DE' : C.yellow} />
            <div style={{height: 4, width: 120, background: somber ? '#9A9AA2' : C.navy, margin: '18px 0 40px 14px', borderRadius: 2}} />
            <div style={{display: 'flex', flexDirection: 'column', gap: 38, paddingLeft: 6}}>
              {b.points.map((p: any, i: number) => (
                <Point key={i} n={i + 1} text={p.text} t={t} at={p.at} size={b.points.length > 2 ? 37 : 40} accent={somber ? '#55555C' : i % 2 ? C.navy : C.red} />
              ))}
            </div>
          </div>
        </Card>
        {b.points.map((p: any, i: number) => <Sfx key={i} at={p.at} src="sfx_pop" vol={somber ? 0 : 0.22} dur={0.5} />)}
      </>
    );
  }
  // full
  const pi = io(t, b.at - 0.1, b.at + 0.55);
  const somber = !!b.somber;
  return (
    <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.55)', border: '3px solid rgba(255,255,255,0.85)', opacity: pi, transform: `scale(${1.04 - 0.04 * pi})`}}>
      <Photo src={b.src} w={CA.w} h={CA.h} t={t} a={b.at} b={b.until} kb={b.kb} filter={somber ? 'grayscale(0.75) contrast(1.05)' : 'saturate(1.08)'} creditStyle={{top: 16, bottom: 'auto'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,15,41,0) 45%, rgba(6,15,41,0.75) 100%)'}} />
      {b.rain && <Rain opacity={0.55} />}
      {b.arrow && <GreenArrow t={t} at={b.at + 0.3} />}
      <Caption t={t} at={b.at} kicker={b.kicker} text={b.caption} somber={somber} />
    </div>
  );
};

/** Story background: blurred photo + brand gradient + moving light. */
export const StoryBg: React.FC<{src?: string; t: number; somber?: boolean}> = ({src, t, somber}) => (
  <AbsoluteFill style={{background: C.navyDeep}}>
    {src && <Img src={staticFile('bg/' + src.replace('/', '_'))} style={{position: 'absolute', inset: -60, width: 2040, height: 1200, objectFit: 'cover', transform: `scale(${1.05 + 0.02 * Math.sin(t / 6)})`, filter: somber ? 'grayscale(1) brightness(0.6)' : 'brightness(0.8)'}} />}
    <AbsoluteFill style={{background: somber ? 'linear-gradient(160deg, rgba(10,10,14,0.82), rgba(30,30,36,0.7))' : 'linear-gradient(160deg, rgba(6,15,41,0.86) 0%, rgba(11,31,77,0.72) 55%, rgba(120,8,14,0.55) 100%)'}} />
    <AbsoluteFill style={{background: `radial-gradient(900px 500px at ${50 + 30 * Math.sin(t / 5)}% ${40 + 10 * Math.cos(t / 7)}%, rgba(255,255,255,0.10), transparent 70%)`}} />
    <AbsoluteFill style={{opacity: 0.09, backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '80px 80px', backgroundPosition: `${-t * 12}px ${-t * 6}px`}} />
  </AbsoluteFill>
);

export {EOUT};

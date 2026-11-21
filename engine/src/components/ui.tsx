import React, {useContext} from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {C, F} from '../theme';
import {CL, EOUT, io, lerp, LeadCtx} from '../lib/anim';
import dims from '../data/dims.json';
import {CREDIT} from '../content';

export const CA = {x: 40, y: 190, w: 1840, h: 750};
export const img = (src: string) => staticFile('img/' + src);
export const bgImg = (src: string) => staticFile('bg/' + src.replace('/', '_'));
export const credit = (src: string) => CREDIT[src] ?? '';

/** Sound effect at a story-local voice time. */
export const Sfx: React.FC<{at: number; src: string; vol?: number; dur?: number}> = ({at, src, vol = 0.3, dur = 2}) => {
  const {fps} = useVideoConfig();
  const lead = useContext(LeadCtx);
  return (
    <Sequence from={Math.round((at + lead) * fps)} durationInFrames={Math.round(dur * fps)} layout="none">
      <Audio src={staticFile('sfx/' + src + '.mp3')} volume={vol} />
    </Sequence>
  );
};

export const CreditChip: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) =>
  text ? (
    <div style={{position: 'absolute', right: 14, bottom: 14, padding: '5px 14px 4px', borderRadius: 6, background: 'rgba(6,15,41,0.72)', color: 'rgba(255,255,255,0.92)', fontFamily: F.body, fontWeight: 500, fontSize: 19, letterSpacing: 0.2, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.18)', ...style}}>
      <svg width="18" height="14" viewBox="0 0 24 18"><path d="M3 4h4l2-3h6l2 3h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="none" stroke="#FFC915" strokeWidth="2"/><circle cx="12" cy="10" r="3.6" fill="none" stroke="#FFC915" strokeWidth="2"/></svg>
      फोटो: {text}
    </div>
  ) : null;

export type KB = 'in' | 'out' | 'left' | 'right' | 'up' | 'none';
const kbTransform = (p: number, kb: KB) => {
  switch (kb) {
    case 'in': return `scale(${1.03 + 0.12 * p})`;
    case 'out': return `scale(${1.15 - 0.11 * p})`;
    case 'left': return `scale(1.13) translateX(${3 - 6 * p}%)`;
    case 'right': return `scale(1.13) translateX(${-3 + 6 * p}%)`;
    case 'up': return `scale(1.13) translateY(${3 - 6 * p}%)`;
    default: return 'scale(1.02)';
  }
};

/** Ken Burns photo that fills its box. Very portrait images in landscape boxes get a contained look with a blurred fill. */
export const Photo: React.FC<{src: string; w: number; h: number; t: number; a: number; b: number; kb?: KB; pos?: string; filter?: string; radius?: number; showCredit?: boolean; creditStyle?: React.CSSProperties; contain?: boolean}> = ({src, w, h, t, a, b, kb = 'in', pos = 'center', filter, radius = 0, showCredit = true, creditStyle, contain}) => {
  const p = lerp(t, a, b + 0.6, 0, 1, (x) => x);
  const d = (dims as Record<string, number[]>)[src] ?? [16, 9];
  const ar = d[0] / d[1];
  const box = w / h;
  const useContain = contain ?? ar < box * 0.62;
  return (
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', borderRadius: radius, background: C.navyDeep}}>
      {useContain ? (
        <>
          <Img src={bgImg(src)} style={{position: 'absolute', inset: -40, width: w + 80, height: h + 80, objectFit: 'cover', filter: 'brightness(0.55)'}} />
          <div style={{position: 'absolute', inset: 0, transform: kbTransform(p * 0.5, kb === 'out' ? 'out' : 'in'), display: 'flex', justifyContent: 'center'}}>
            <Img src={img(src)} style={{height: h, width: h * ar, objectFit: 'cover', boxShadow: '0 0 60px rgba(0,0,0,0.6)', filter}} />
          </div>
        </>
      ) : (
        <Img src={img(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: kbTransform(p, kb), filter}} />
      )}
      {showCredit && <CreditChip text={credit(src)} style={creditStyle} />}
    </div>
  );
};

/** Heading with a yellow marker swipe behind it. */
export const MarkerTitle: React.FC<{text: string; t: number; at: number; size?: number; color?: string; marker?: string}> = ({text, t, at, size = 54, color = C.ink, marker = C.yellow}) => {
  const m = io(t, at + 0.1, at + 0.6);
  const txt = io(t, at, at + 0.45);
  return (
    <div style={{position: 'relative', display: 'inline-block', padding: '0 14px'}}>
      <div style={{position: 'absolute', left: 0, bottom: size * 0.12, height: size * 0.5, width: `${m * 100}%`, background: marker, borderRadius: 4, transform: 'skewX(-12deg)'}} />
      <div style={{position: 'relative', fontFamily: F.head, fontWeight: 700, fontSize: size, color, lineHeight: 1.15, opacity: txt, transform: `translateY(${(1 - txt) * 16}px)`}}>{text}</div>
    </div>
  );
};

export const Kicker: React.FC<{text: string; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({text, bg = C.red, color = C.white, size = 30, style}) => (
  <div style={{display: 'inline-block', background: bg, color, fontFamily: F.head, fontWeight: 700, fontSize: size, lineHeight: 1, padding: `${size * 0.28}px ${size * 0.6}px ${size * 0.18}px`, borderRadius: 4, ...style}}>{text}</div>
);

/** Floating particle field (embers / dust). */
export const Particles: React.FC<{n?: number; color?: string; seed?: number; speed?: number; size?: number; opacity?: number; rise?: boolean}> = ({n = 26, color = '#FFD27A', seed = 1, speed = 30, size = 6, opacity = 0.8, rise = true}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(n).fill(0).map((_, i) => {
        const r1 = Math.abs(Math.sin((i + 1) * 91.7 * seed)) % 1;
        const r2 = Math.abs(Math.sin((i + 1) * 47.3 * seed + 3)) % 1;
        const r3 = Math.abs(Math.sin((i + 1) * 13.1 * seed + 7)) % 1;
        const H = 1080 + 100;
        const y = rise ? (((r2 * H - t * speed * (0.5 + r3)) % H) + H) % H - 50 : (r2 * H + t * speed * (0.5 + r3)) % H - 50;
        const x = r1 * 1920 + Math.sin(t * (0.6 + r3) + i) * 30;
        const s = size * (0.4 + r3);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: color, opacity: opacity * (0.35 + 0.65 * Math.abs(Math.sin(t * (1 + r1) + i))), boxShadow: `0 0 ${s * 2}px ${color}`}} />;
      })}
    </AbsoluteFill>
  );
};

/** Film grain overlay from a tiled noise texture. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{backgroundImage: `url(${staticFile('brand/noise.png')})`, backgroundPosition: `${(f * 73) % 256}px ${(f * 151) % 256}px`, opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}} />;
};

/** White content card. */
export const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode}> = ({style, children}) => (
  <div style={{position: 'absolute', background: C.white, borderRadius: 18, boxShadow: '0 30px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.4)', overflow: 'hidden', ...style}}>{children}</div>
);

/** A numbered point that slides in at `at`. */
export const Point: React.FC<{n: number; text: string; t: number; at: number; size?: number; dark?: boolean; accent?: string}> = ({n, text, t, at, size = 38, dark, accent = C.red}) => {
  const p = io(t, at, at + 0.5);
  const s = lerp(t, at, at + 0.35, 0.3, 1, EOUT);
  return (
    <div style={{display: 'flex', alignItems: 'flex-start', gap: 22, opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
      <div style={{flex: '0 0 auto', width: size * 1.45, height: size * 1.45, borderRadius: '50%', background: accent, color: C.white, fontFamily: F.num, fontWeight: 600, fontSize: size * 0.95, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, boxShadow: `0 6px 16px ${accent}66`, paddingTop: 4}}>{n}</div>
      <div style={{fontFamily: F.body, fontWeight: 700, fontSize: size, lineHeight: 1.32, color: dark ? C.white : C.ink, paddingTop: 2}}>{text}</div>
    </div>
  );
};

/** Pulsing location pin. */
export const Pin: React.FC<{x: number; y: number; t: number; at: number; label: string; main?: boolean; color?: string; labelSide?: 'left' | 'right'}> = ({x, y, t, at, label, main, color = C.red, labelSide = 'right'}) => {
  const p = io(t, at, at + 0.5);
  const drop = lerp(t, at, at + 0.45, -60, 0);
  const pulse = ((t - at) % 1.6) / 1.6;
  const lab = io(t, at + 0.25, at + 0.7);
  const s = main ? 1 : 0.72;
  if (t < at) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      {main && <circle r={12 + pulse * 60} fill="none" stroke={color} strokeWidth={3} opacity={(1 - pulse) * 0.9} />}
      {main && <circle r={12 + ((pulse + 0.5) % 1) * 60} fill="none" stroke={color} strokeWidth={2} opacity={(1 - ((pulse + 0.5) % 1)) * 0.6} />}
      <ellipse rx={10 * s} ry={4 * s} fill="rgba(0,0,0,0.45)" opacity={p} />
      <g transform={`translate(0,${drop}) scale(${s})`} opacity={p}>
        <path d="M0 0 C -6 -14 -20 -22 -20 -38 A 20 20 0 1 1 20 -38 C 20 -22 6 -14 0 0 Z" fill={color} stroke="#fff" strokeWidth={3} />
        <circle cy={-38} r={7.5} fill="#fff" />
      </g>
      <g opacity={lab} transform={`translate(${labelSide === 'right' ? 26 : -26},${-44 * s})`}>
        <text x={0} y={0} textAnchor={labelSide === 'right' ? 'start' : 'end'} fontFamily={F.head} fontWeight={700} fontSize={main ? 46 : 32} fill="#fff" stroke="rgba(6,15,41,0.85)" strokeWidth={8} paintOrder="stroke">{label}</text>
      </g>
    </g>
  );
};

export const clampT = (t: number, a: number, b: number) => Math.max(a, Math.min(b, t));
export {CL, EOUT};

import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {C, F} from '../theme';
import {EIO, EOUT, io, lerp, pop} from '../lib/anim';
import geo from '../data/geo.json';
import {Beat} from '../content';
import {CA, Card, CreditChip, credit, img, Photo, Pin, Sfx} from '../components/ui';
import {Rain} from '../components/layouts';

const HI: Record<string, string> = {
  Odisha: 'ओडिशा', 'Andhra Pradesh': 'आंध्र प्रदेश', Telangana: 'तेलंगाना', Chhattisgarh: 'छत्तीसगढ़', 'West Bengal': 'पश्चिम बंगाल', Jharkhand: 'झारखंड',
  'Uttar Pradesh': 'उत्तर प्रदेश', Uttarakhand: 'उत्तराखंड', Haryana: 'हरियाणा', Delhi: 'दिल्ली', Rajasthan: 'राजस्थान', 'Madhya Pradesh': 'मध्य प्रदेश',
  'Himachal Pradesh': 'हिमाचल प्रदेश', Gujarat: 'गुजरात', Punjab: 'पंजाब', Bihar: 'बिहार', Maharashtra: 'महाराष्ट्र', Karnataka: 'कर्नाटक', 'Tamil Nadu': 'तमिलनाडु',
};
type View = {w: number; h: number; states: {name: string; d: string; c: number[]}[]; countries: {name: string; d: string}[]; district: {name: string; d: string; c: number[]} | null; pins: Record<string, number[]>; track: number[][]};
const G = geo as unknown as Record<string, View>;

/** Stylised dark map; children are drawn in the view's coordinate space. */
export const GeoMap: React.FC<{view: string; highlight: string[]; t: number; at: number; cam?: {cx: number; cy: number; s: number}; somber?: boolean; showLabels?: string[]; districtAt?: number; children?: React.ReactNode; width: number; height: number}> = ({view, highlight, t, at, cam, somber, showLabels = [], districtAt, children, width, height}) => {
  const v = G[view];
  const draw = io(t, at, at + 1.2);
  const hl = io(t, at + 0.5, at + 1.3);
  const hot = somber ? '#9C9CA6' : C.red;
  const sc = Math.max(width / v.w, height / v.h);
  const s = cam ? cam.s : 1;
  const cx = cam ? cam.cx : v.w / 2;
  const cy = cam ? cam.cy : v.h / 2;
  const tr = `translate(${width / 2},${height / 2}) scale(${sc * s}) translate(${-cx},${-cy})`;
  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id={`sea-${view}`} cx="60%" cy="60%" r="80%"><stop offset="0" stopColor={somber ? '#1E1E24' : '#0E2A66'} /><stop offset="1" stopColor={somber ? '#0B0B0E' : '#050C24'} /></radialGradient>
        <linearGradient id={`land-${view}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={somber ? '#3A3A42' : '#1F3B80'} /><stop offset="1" stopColor={somber ? '#2A2A30' : '#152B63'} /></linearGradient>
        <linearGradient id={`hot-${view}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={somber ? '#8A8A94' : '#FF3B3B'} /><stop offset="1" stopColor={somber ? '#55555E' : '#A50D14'} /></linearGradient>
        <filter id={`glow-${view}`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
        <pattern id={`grid-${view}`} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(120,160,255,0.10)" strokeWidth="1" /></pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#sea-${view})`} />
      <rect width={width} height={height} fill={`url(#grid-${view})`} />
      <g transform={tr}>
        {v.countries.map((c) => <path key={c.name} d={c.d} fill="#13234D" stroke="rgba(150,180,255,0.25)" strokeWidth={1 / s} opacity={draw} />)}
        {v.states.map((st) => (
          <path key={st.name} d={st.d} fill={`url(#land-${view})`} stroke="rgba(170,200,255,0.55)" strokeWidth={1.4 / s} strokeLinejoin="round" opacity={draw} />
        ))}
        {v.states.filter((st) => highlight.includes(st.name)).map((st) => (
          <g key={'h' + st.name} opacity={hl}>
            <path d={st.d} fill="none" stroke={hot} strokeWidth={10 / s} filter={`url(#glow-${view})`} opacity={0.8} />
            <path d={st.d} fill={`url(#hot-${view})`} fillOpacity={0.55} stroke="#fff" strokeWidth={2.4 / s} strokeLinejoin="round" />
          </g>
        ))}
        {v.district && districtAt !== undefined && (
          <path d={v.district.d} fill={somber ? 'rgba(255,255,255,0.35)' : 'rgba(255,201,21,0.55)'} stroke={somber ? '#fff' : C.yellow} strokeWidth={2.5 / s} opacity={io(t, districtAt, districtAt + 0.5)} />
        )}
        {v.states.filter((st) => showLabels.includes(st.name)).map((st) => (
          <text key={'l' + st.name} x={st.c[0]} y={st.c[1]} textAnchor="middle" fontFamily={F.head} fontWeight={700} fontSize={(highlight.includes(st.name) ? 40 : 26) / s} fill={highlight.includes(st.name) ? '#fff' : 'rgba(200,215,255,0.65)'} opacity={hl} letterSpacing={1}>{HI[st.name] ?? st.name}</text>
        ))}
        {children}
      </g>
    </svg>
  );
};

/** Hurricane swirl drawn around the origin. */
const Swirl: React.FC<{r: number; rot: number; o: number}> = ({r, rot, o}) => (
  <g opacity={o}>
    <circle r={r * 1.25} fill="url(#swirlGlow)" />
    <g transform={`rotate(${rot})`}>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} transform={`rotate(${i * 90})`} d={`M 0 0 C ${r * 0.3} ${-r * 0.2}, ${r * 0.6} ${-r * 0.5}, ${r * 0.55} ${-r * 1.0} C ${r * 0.2} ${-r * 0.75}, ${r * 0.1} ${-r * 0.3}, 0 0 Z`} fill="rgba(235,242,255,0.85)" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <path key={'b' + i} transform={`rotate(${i * 90 + 45})`} d={`M 0 0 C ${r * 0.25} ${-r * 0.15}, ${r * 0.45} ${-r * 0.35}, ${r * 0.42} ${-r * 0.75} C ${r * 0.15} ${-r * 0.55}, ${r * 0.08} ${-r * 0.25}, 0 0 Z`} fill="rgba(200,215,255,0.55)" />
      ))}
    </g>
    <circle r={r * 0.12} fill="#0A1A44" stroke="#fff" strokeWidth={r * 0.03} />
  </g>
);

const along = (pts: number[][], p: number) => {
  const segs = pts.length - 1;
  const x = Math.max(0, Math.min(0.9999, p)) * segs;
  const i = Math.floor(x);
  const f = x - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
};

export const CycloneMap: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const v = G.east;
  const W = 1180, H = CA.h;
  const tr = v.track;
  const landIdx = 6 / (tr.length - 1);
  const p = lerp(t, 0.2, 5.0, 0, landIdx, EIO) + lerp(t, 5.0, 10.9, 0, 0.06, (x) => x);
  const pos = along(tr, p);
  const cam = {cx: lerp(t, -0.5, 6, 620, 560, EIO), cy: lerp(t, -0.5, 6, 420, 320, EIO), s: lerp(t, -0.5, 6, 1.0, 1.55, EIO)};
  const landed = io(t, 5.0, 5.3);
  const pulse = ((t - 5.0) % 1.4) / 1.4;
  const trackLen = 900;
  const drawn = io(t, 0.0, 4.8, EIO);
  const panel = io(t, 0.3, 0.9);
  const items = [
    {at: 1.9, k: 'चक्रवात', v: "'अकवान'"},
    {at: 5.0, k: 'असर', v: 'ओडिशा और आंध्र प्रदेश'},
    {at: 8.0, k: 'स्थिति', v: 'तेज़ हवाएं, भारी बारिश'},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: W, height: H, borderRadius: 18, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', opacity: io(t, -0.5, 0)}}>
        <GeoMap view="east" width={W} height={H} t={t} at={-0.4} cam={cam} highlight={['Odisha', 'Andhra Pradesh']} showLabels={['Odisha', 'Andhra Pradesh', 'Chhattisgarh', 'Telangana', 'West Bengal']} districtAt={undefined}>
          <defs>
            <radialGradient id="swirlGlow"><stop offset="0" stopColor="rgba(255,255,255,0.55)" /><stop offset="0.6" stopColor="rgba(160,190,255,0.18)" /><stop offset="1" stopColor="rgba(160,190,255,0)" /></radialGradient>
          </defs>
          <polyline points={tr.map((q) => q.join(',')).join(' ')} fill="none" stroke={C.yellow} strokeWidth={4 / cam.s} strokeDasharray={`${12 / cam.s} ${10 / cam.s}`} opacity={0.9} style={{clipPath: 'none'}} strokeDashoffset={0} />
          <polyline points={tr.map((q) => q.join(',')).join(' ')} fill="none" stroke="#050C24" strokeWidth={8 / cam.s} strokeDasharray={`${trackLen}`} strokeDashoffset={-trackLen * drawn} opacity={0.0} />
          <text x={tr[2][0] + 18} y={tr[2][1]} fontFamily={F.body} fontWeight={700} fontSize={22 / cam.s} fill={C.yellow} opacity={io(t, 1, 1.5)}>सांकेतिक मार्ग</text>
          <text x={760} y={560} textAnchor="middle" fontFamily={F.head} fontWeight={600} fontSize={34 / cam.s} fill="rgba(160,190,255,0.55)" letterSpacing={3}>बंगाल की खाड़ी</text>
          {landed > 0 && (
            <g transform={`translate(${v.pins.gopalpur[0]},${v.pins.gopalpur[1]})`}>
              <circle r={(10 + pulse * 70) / cam.s} fill="none" stroke={C.red} strokeWidth={4 / cam.s} opacity={1 - pulse} />
              <circle r={(10 + ((pulse + 0.5) % 1) * 70) / cam.s} fill="none" stroke={C.red} strokeWidth={3 / cam.s} opacity={1 - ((pulse + 0.5) % 1)} />
            </g>
          )}
          <g transform={`translate(${pos[0]},${pos[1]})`}>
            <Swirl r={(80 - landed * 20) / Math.sqrt(cam.s)} rot={t * 200} o={io(t, -0.2, 0.4)} />
          </g>
          <g transform={`translate(${v.pins.gopalpur[0]},${v.pins.gopalpur[1]})`} opacity={landed}>
            <rect x={14 / cam.s} y={-64 / cam.s} width={270 / cam.s} height={50 / cam.s} rx={6 / cam.s} fill={C.red} />
            <text x={30 / cam.s} y={-28 / cam.s} fontFamily={F.head} fontWeight={700} fontSize={32 / cam.s} fill="#fff">गोपालपुर के पास तट</text>
          </g>
        </GeoMap>
        <Rain opacity={0.25 + landed * 0.25} n={70} />
        <div style={{position: 'absolute', left: 18, bottom: 16, fontFamily: F.body, fontWeight: 500, fontSize: 18, color: 'rgba(255,255,255,0.7)'}}>मानचित्र सांकेतिक है • मार्ग केवल प्रतीकात्मक</div>
      </div>
      <Card style={{left: 1250, top: CA.y, width: 630, height: H, transform: `translateX(${(1 - panel) * 80}px)`, opacity: panel}}>
        <div style={{height: 10, background: `linear-gradient(90deg, ${C.red}, ${C.saffron})`}} />
        <div style={{padding: '34px 40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <svg width="70" height="70" viewBox="-50 -50 100 100"><g transform={`rotate(${t * 160})`}>{[0, 1, 2].map((i) => <path key={i} transform={`rotate(${i * 120})`} d="M0 0 C 18 -10 30 -26 26 -46 C 10 -34 4 -16 0 0 Z" fill={C.navy} />)}</g><circle r="9" fill={C.red} /></svg>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 60, color: C.ink, lineHeight: 1}}>मौसम अलर्ट</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 40}}>
            {items.map((it, i) => {
              const q = io(t, it.at, it.at + 0.45);
              return (
                <div key={i} style={{opacity: q, transform: `translateX(${(1 - q) * 50}px)`, borderLeft: `8px solid ${i === 0 ? C.red : C.navy}`, paddingLeft: 22}}>
                  <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 28, color: '#6B7390'}}>{it.k}</div>
                  <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 56, color: C.ink, lineHeight: 1.1}}>{it.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      {items.map((it, i) => <Sfx key={i} at={it.at} src="sfx_pop" vol={0.2} dur={0.5} />)}
      <Sfx at={5.0} src="sfx_impact_boom" vol={0.16} dur={2} />
    </AbsoluteFill>
  );
};

/** Wind speedometer: 0–120 km/h; sustained 70–80 band, gusts to 90. */
export const Wind: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 0.5);
  const MAX = 120;
  const ang = (v: number) => -120 + (v / MAX) * 240;
  const needleV = t < 18.4 ? lerp(t, b.at + 0.3, b.at + 1.4, 0, 40) : t < 22.0 ? lerp(t, 18.4, 19.6, 40, 75, EOUT) + Math.sin(t * 9) * 2.5 : lerp(t, 22.0, 22.9, 75, 88.5, EOUT) + Math.sin(t * 11) * 1.5;
  const band = io(t, 18.6, 19.4);
  const gust = io(t, 22.1, 22.7);
  const R = 300;
  const arc = (a1: number, a2: number, r: number) => {
    const p1 = [Math.sin((a1 * Math.PI) / 180) * r, -Math.cos((a1 * Math.PI) / 180) * r];
    const p2 = [Math.sin((a2 * Math.PI) / 180) * r, -Math.cos((a2 * Math.PI) / 180) * r];
    return `M ${p1[0]} ${p1[1]} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${p2[0]} ${p2[1]}`;
  };
  const shown = Math.min(90, Math.round(Math.max(0, needleV)));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, border: '3px solid rgba(255,255,255,0.85)'}}>
        <Photo src="s02_cyclone/s02_01.jpg" w={CA.w} h={CA.h} t={t} a={b.at} b={b.until} kb="in" contain={false} filter="brightness(0.55) saturate(1.2)" creditStyle={{top: 16, bottom: 'auto'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(6,15,41,0.2), rgba(6,15,41,0.85) 60%)'}} />
        <Rain opacity={0.3} n={60} />
      </div>
      <svg width={900} height={720} viewBox="-450 -380 900 720" style={{position: 'absolute', left: 120, top: 215, opacity: enter}}>
        <defs>
          <linearGradient id="wg" x1="0" x2="1"><stop offset="0" stopColor={C.green} /><stop offset="0.5" stopColor={C.yellow} /><stop offset="1" stopColor={C.red} /></linearGradient>
        </defs>
        <circle r={R + 40} fill="rgba(6,15,41,0.75)" stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
        <path d={arc(-120, 120, R)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={34} />
        <path d={arc(-120, ang(Math.max(1, needleV)), R)} fill="none" stroke="url(#wg)" strokeWidth={34} />
        <path d={arc(ang(70), ang(80), R + 44)} fill="none" stroke={C.yellow} strokeWidth={18 * band} opacity={band} />
        <path d={arc(ang(88), ang(92), R + 44)} fill="none" stroke={C.red} strokeWidth={18 * gust} opacity={gust} />
        {new Array(13).fill(0).map((_, i) => {
          const v = i * 10;
          const a = (ang(v) * Math.PI) / 180;
          return (
            <g key={i}>
              <line x1={Math.sin(a) * (R - 30)} y1={-Math.cos(a) * (R - 30)} x2={Math.sin(a) * (R - 54)} y2={-Math.cos(a) * (R - 54)} stroke="#fff" strokeWidth={4} />
              <text x={Math.sin(a) * (R - 90)} y={-Math.cos(a) * (R - 90) + 12} textAnchor="middle" fontFamily={F.num} fontWeight={500} fontSize={34} fill="#C9D4EE">{v}</text>
            </g>
          );
        })}
        <g transform={`rotate(${ang(needleV)})`}>
          <path d="M -12 0 L 0 -270 L 12 0 Z" fill={C.red} />
          <circle r={26} fill="#fff" stroke={C.red} strokeWidth={8} />
        </g>
        <text y={140} textAnchor="middle" fontFamily={F.num} fontWeight={700} fontSize={150} fill="#fff">{shown}</text>
        <text y={196} textAnchor="middle" fontFamily={F.body} fontWeight={700} fontSize={36} fill={C.yellow}>{shown > 80 ? 'झोंके • किमी/घंटा' : 'किमी/घंटा'}</text>
      </svg>
      <div style={{position: 'absolute', left: 1080, top: 260, width: 760}}>
        <div style={{opacity: io(t, b.at + 0.2, b.at + 0.7)}}>
          <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 40, color: C.yellow}}>तट पार करते समय</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 92, color: '#fff', lineHeight: 1}}>हवा की रफ़्तार</div>
        </div>
        <div style={{marginTop: 46, display: 'flex', flexDirection: 'column', gap: 24}}>
          <div style={{opacity: band, transform: `translateX(${(1 - band) * 60}px)`, background: '#fff', borderRadius: 14, padding: '18px 30px 10px', borderLeft: `12px solid ${C.yellow}`}}>
            <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 30, color: '#555'}}>लगातार हवाएं</div>
            <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 84, color: C.ink, lineHeight: 1}}>70–80 <span style={{fontFamily: F.body, fontSize: 32}}>किमी/घंटा</span></div>
          </div>
          <div style={{opacity: gust, transform: `translateX(${(1 - gust) * 60}px)`, background: C.red, borderRadius: 14, padding: '18px 30px 10px', borderLeft: `12px solid #fff`}}>
            <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 30, color: '#FFD9DB'}}>झोंके</div>
            <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 84, color: '#fff', lineHeight: 1}}>90 तक <span style={{fontFamily: F.body, fontSize: 32}}>किमी/घंटा</span></div>
          </div>
        </div>
        <div style={{marginTop: 30, fontFamily: F.body, fontWeight: 700, fontSize: 26, color: '#C9D4EE', opacity: io(t, 11, 11.6)}}>स्रोत: Reuters, भारत मौसम विज्ञान विभाग (IMD) के हवाले से</div>
      </div>
      <Sfx at={18.6} src="sfx_tick" vol={0.25} dur={0.4} />
      <Sfx at={22.1} src="sfx_whoosh_2" vol={0.25} dur={1.5} />
    </AbsoluteFill>
  );
};

/** Generic map + pins + optional chip and photo inset. */
export const MapPin: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const v = G[b.view];
  const W = CA.w, H = CA.h;
  const main = b.pins.find((p: any) => p.main);
  const mp = v.pins[main.key];
  const zoomP = io(t, b.at, main.at + 1.5, EIO);
  const cam = {cx: lerp(zoomP, 0, 1, v.w / 2, mp[0] + 60), cy: lerp(zoomP, 0, 1, v.h / 2, mp[1]), s: lerp(zoomP, 0, 1, 1.0, b.view === 'uk' ? 1.55 : 2.0)};
  const somber = !!b.somber;
  const sc = Math.max(W / v.w, H / v.h) * cam.s;
  const toScreen = (q: number[]) => [W / 2 + (q[0] - cam.cx) * sc, H / 2 + (q[1] - cam.cy) * sc];
  const titleP = io(t, b.at + 0.3, b.at + 0.9);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: W, height: H, borderRadius: 18, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', opacity: io(t, b.at - 0.1, b.at + 0.4)}}>
        <GeoMap view={b.view} width={W} height={H} t={t} at={b.at - 0.1} cam={cam} highlight={[b.highlight]} showLabels={v.states.map((s) => s.name)} somber={somber} districtAt={main.at - 0.3} />
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          {b.pins.map((p: any) => {
            const q = toScreen(v.pins[p.key]);
            return <Pin key={p.key} x={q[0]} y={q[1]} t={t} at={p.at} label={p.label} main={p.main} color={somber ? '#E8E8EE' : C.red} labelSide={p.main ? 'right' : 'left'} />;
          })}
        </svg>
        <div style={{position: 'absolute', left: 40, top: 36, opacity: titleP, transform: `translateY(${(1 - titleP) * 20}px)`}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 96, color: '#fff', lineHeight: 1, textShadow: '0 6px 20px rgba(0,0,0,0.6)'}}>{b.title}</div>
          <div style={{display: 'inline-block', marginTop: 8, background: somber ? '#E8E8EE' : C.yellow, color: C.ink, fontFamily: F.head, fontWeight: 700, fontSize: 36, padding: '6px 18px 0', borderRadius: 6}}>{b.sub}</div>
        </div>
        {b.chip && (
          <div style={{position: 'absolute', left: 40, bottom: 40, transform: `scale(${pop(t, b.chip.at)})`, transformOrigin: 'left bottom', background: C.navy, border: `3px solid ${C.yellow}`, borderRadius: 12, padding: '14px 26px 6px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 16px 30px rgba(0,0,0,0.5)'}}>
            <svg width="44" height="50" viewBox="0 0 44 50"><path d="M22 2 L40 9 V24 C40 36 31 44 22 48 C13 44 4 36 4 24 V9 Z" fill={C.red} stroke="#fff" strokeWidth="3" /><path d="M14 25 l6 6 l11 -12" fill="none" stroke="#fff" strokeWidth="4" /></svg>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 48, color: '#fff'}}>{b.chip.text}</div>
          </div>
        )}
        {b.inset && (() => {
          const ip = io(t, b.inset.at, b.inset.at + 0.5);
          return (
            <div style={{position: 'absolute', right: 40, bottom: 40, width: 620, height: 420, borderRadius: 14, overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', opacity: ip, transform: `translateY(${(1 - ip) * 60}px) rotate(${(1 - ip) * 4}deg)`}}>
              <Photo src={b.inset.src} w={620} h={420} t={t} a={b.inset.at} b={b.until} kb="in" />
              <div style={{position: 'absolute', left: 0, top: 0, background: C.red, color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 32, padding: '8px 18px 2px', borderRadius: '0 0 10px 0'}}>{b.inset.label}</div>
            </div>
          );
        })()}
      </div>
      {b.pins.map((p: any) => <Sfx key={p.key} at={p.at} src="sfx_pop" vol={somber ? 0 : p.main ? 0.3 : 0.18} dur={0.5} />)}
    </AbsoluteFill>
  );
};
export {Img, img, credit, CreditChip};

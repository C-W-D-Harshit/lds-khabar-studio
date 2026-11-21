import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {CL, EIN, io, lerp, pop} from '../lib/anim';
import {DATE_HI, DAY_EN, DAY_HI, GLANCE, STORIES} from '../content';
import {END_CARD_AT, storyAt, TL} from '../lib/timeline';

export const Logo: React.FC<{size: number; t: number; ring?: boolean}> = ({size, t, ring = true}) => (
  <div style={{position: 'relative', width: size, height: size}}>
    {ring && <div style={{position: 'absolute', inset: -size * 0.06, borderRadius: '50%', background: `conic-gradient(from ${t * 90}deg, ${C.red}, ${C.yellow}, ${C.navy2}, ${C.red})`, boxShadow: `0 0 ${size * 0.18}px rgba(224,20,30,0.55)`}} />}
    <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: '#fff', boxShadow: 'inset 0 0 0 3px #fff'}}>
      <Img src={staticFile('brand/logo.png')} style={{width: '100%', height: '100%', transform: 'scale(1.04)'}} />
    </div>
  </div>
);

const RED_ITEMS = STORIES.map((s) => s.ticker);
const isDigits = (x: string) => /^[0-9]+$/.test(x);

const TickerRow: React.FC<{items: string[]; offset: number; font: string; size: number; weight: number; color: string; sep: React.ReactNode; repeats: number}> = ({items, offset, font, size, weight, color, sep, repeats}) => (
  <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', transform: `translateX(${-offset}px)`}}>
    {new Array(repeats).fill(0).flatMap((_, r) =>
      items.map((it, i) => (
        <span key={`${r}-${i}`} style={{display: 'inline-flex', alignItems: 'center', fontFamily: font, fontSize: size, fontWeight: weight, color, paddingTop: 4}}>
          {it}
          <span style={{margin: '0 30px', display: 'inline-flex'}}>{sep}</span>
        </span>
      )),
    )}
  </div>
);

export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const g = frame / fps;
  const idx = storyAt(g);
  if (idx < 0) return null;
  const s = STORIES[idx];
  const lt = g - TL[idx].visStart;
  const g0 = g - TL[0].visStart;
  const out = io(g, END_CARD_AT, END_CARD_AT + 0.6, EIN);
  if (out >= 1) return null;
  const first = idx === 0;
  const base = first ? 0.6 : 0.45;

  const date = io(g0, 0, 0.6);
  const strip = io(g0, 0.15, 0.75);
  const logo = pop(g0, 0.35);
  const tick = io(g0, 0.25, 0.85);

  const hl = io(lt, base, base + 0.55);
  const tag = pop(lt, base + 0.05);
  const num = pop(lt, base);
  const sub = io(lt, base + 0.25, base + 0.75);

  const somberAmt = s.mood === 'somber' ? 1 : 0;
  const ringT = g;
  const pulse = 0.5 + 0.5 * Math.sin(g * 6);

  return (
    <div style={{position: 'absolute', inset: 0, filter: somberAmt ? 'grayscale(0.9)' : undefined, opacity: 1 - out}}>
      {/* Date block */}
      <div style={{position: 'absolute', left: 36, top: 30, width: 236, height: 116, transform: `translateX(${(1 - date) * -300}px)`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.45)'}}>
        <div style={{height: 72, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.red, paddingTop: 6}}>{DATE_HI}</div>
        <div style={{height: 44, background: C.navy, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: F.body, fontWeight: 800, fontSize: 21, letterSpacing: 1}}>
          <span>{DAY_EN}</span><span style={{color: C.yellow}}>•</span><span>{DAY_HI}</span>
        </div>
      </div>

      {/* Headline strip */}
      <div style={{position: 'absolute', left: 300, top: 50, width: 1390, height: 82, clipPath: `inset(0 ${(1 - strip) * 100}% 0 0)`}}>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${C.navy} 0%, ${C.navy2} 75%, ${C.navy} 100%)`, clipPath: 'polygon(0 0, 100% 0, 97.5% 100%, 0 100%)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 3, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`, transform: `translateX(${((g * 300) % 2600) - 1300}px)`}} />
        <div style={{position: 'absolute', left: 82, top: 0, height: 82, right: 60, display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 56, color: '#fff', whiteSpace: 'nowrap', paddingTop: 8, clipPath: `inset(0 ${(1 - hl) * 100}% 0 0)`, transform: `translateX(${(1 - hl) * 30}px)`}}>{s.headline}</div>
        </div>
      </div>
      {/* Number circle */}
      <div style={{position: 'absolute', left: 252, top: 43, width: 96, height: 96, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FF4A50, ${C.red} 55%, ${C.redDeep})`, border: '5px solid #fff', boxShadow: '0 8px 22px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${strip * Math.min(1.15, num)}) rotateY(${(1 - Math.min(1, num)) * 180}deg)`, fontFamily: isDigits(s.label) ? F.num : F.head, fontWeight: 700, fontSize: isDigits(s.label) ? 50 : s.label.length > 2 ? 30 : 38, color: '#fff', paddingTop: 6}}>{s.label}</div>
      {/* Category tag */}
      <div style={{position: 'absolute', left: 376, top: 14, height: 40, transform: `scale(${tag})`, transformOrigin: 'left bottom', background: C.red, borderRadius: '6px 6px 0 0', padding: '0 20px 0 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 -4px 14px rgba(0,0,0,0.3)'}}>
        <div style={{width: 10, height: 10, borderRadius: '50%', background: '#fff', opacity: 0.5 + 0.5 * pulse}} />
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 28, color: '#fff', paddingTop: 5}}>{s.tag}</div>
      </div>
      {/* Yellow sub strip */}
      <div style={{position: 'absolute', left: 376, top: 132, height: 44, maxWidth: 1250, clipPath: `inset(0 ${(1 - sub) * 100}% 0 0)`, background: `linear-gradient(90deg, ${C.yellow}, ${C.yellow2})`, padding: '0 26px', display: 'flex', alignItems: 'center', borderRadius: '0 0 8px 8px', boxShadow: '0 8px 18px rgba(0,0,0,0.35)'}}>
        <div style={{fontFamily: F.body, fontWeight: 800, fontSize: 27, color: C.ink, whiteSpace: 'nowrap', paddingTop: 3}}>{s.sub}</div>
      </div>

      {/* Logo */}
      <div style={{position: 'absolute', left: 1718, top: 24, transform: `scale(${logo})`}}>
        <Logo size={144} t={ringT} />
      </div>

      {/* Tickers */}
      <div style={{position: 'absolute', left: 0, top: 952, width: 1920, height: 128, transform: `translateY(${(1 - tick) * 140}px)`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 50, background: `linear-gradient(90deg, ${C.yellow}, ${C.yellow2} 50%, ${C.yellow})`, overflow: 'hidden', boxShadow: '0 -6px 20px rgba(0,0,0,0.35)'}}>
          <div style={{position: 'absolute', left: 250, right: 0, top: 0, bottom: 0, overflow: 'hidden'}}>
            <TickerRow items={GLANCE} offset={g * 75} font={F.body} size={27} weight={800} color={C.ink} repeats={22} sep={<span style={{width: 12, height: 12, background: C.red, transform: 'rotate(45deg)', display: 'inline-block'}} />} />
          </div>
          <div style={{position: 'absolute', left: 0, top: 0, width: 250, height: 50, background: C.navy, clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)', display: 'flex', alignItems: 'center', paddingLeft: 28, fontFamily: F.head, fontWeight: 700, fontSize: 30, color: C.yellow}}>
            <span style={{paddingTop: 5}}>एक नज़र में</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, top: 50, width: 1920, height: 64, background: `linear-gradient(180deg, ${C.red}, ${C.redDeep})`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 280, right: 200, top: 0, bottom: 0, overflow: 'hidden'}}>
            <TickerRow items={s.mood === 'somber' ? [s.ticker, 'विनम्र श्रद्धांजलि 🙏'] : RED_ITEMS} offset={s.mood === 'somber' ? Math.max(0, lt) * 105 : g * 105} font={F.head} size={38} weight={600} color="#fff" repeats={12} sep={<span style={{width: 14, height: 14, borderRadius: '50%', background: C.yellow, display: 'inline-block'}} />} />
          </div>
          <div style={{position: 'absolute', left: 0, top: 0, width: 280, height: 64, background: '#fff', clipPath: 'polygon(0 0, 100% 0, 93% 100%, 0 100%)', display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 24}}>
            <div style={{width: 16, height: 16, borderRadius: '50%', background: C.red, boxShadow: `0 0 0 ${4 + pulse * 6}px rgba(224,20,30,${0.35 - pulse * 0.25})`}} />
            <span style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: C.red, paddingTop: 6}}>ताज़ा ख़बरें</span>
          </div>
          <div style={{position: 'absolute', right: 0, top: 0, width: 200, height: 64, background: C.navy, clipPath: 'polygon(7% 0, 100% 0, 100% 100%, 0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: F.head, fontWeight: 700, fontSize: 34, color: '#fff'}}>
            <span style={{paddingTop: 6}}>LDS</span><span style={{paddingTop: 6, color: C.yellow}}>खबर</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, top: 114, width: 1920, height: 14, background: C.navyDeep}} />
      </div>
    </div>
  );
};

export {interpolate, CL, lerp};

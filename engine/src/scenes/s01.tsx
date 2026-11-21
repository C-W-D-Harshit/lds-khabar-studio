import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {C, F} from '../theme';
import {EIN, EIO, EOUT, io, lerp, pop} from '../lib/anim';
import {Beat} from '../content';
import {CA, CreditChip, credit, img, Particles, Photo, Sfx} from '../components/ui';
import {Logo} from '../components/Chrome';
import {Diya, Moon, Sun} from './common';

const LINEUP = [
  {src: 's02_cyclone/s02_03.jpg', t: 'चक्रवात'},
  {src: 's04_market/s04_01.jpg', t: 'शेयर बाज़ार'},
  {src: 's05_epfo/s05_02.jpg', t: 'PF नियम'},
  {src: 's07_japan/s07_02.jpg', t: 'भारत-जापान'},
  {src: 's10_badminton/s10_01.jpg', t: 'खेल'},
  {src: 's12_bulls/viral_frame_bull_on_car_720x1280.jpg', t: 'वायरल'},
];

export const Welcome: React.FC<{b: Beat; t: number}> = ({t}) => {
  const a = io(t, -0.3, 0.4);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{marginTop: 40, transform: `scale(${pop(t, -0.2)})`}}><Logo size={170} t={t} /></div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 130, color: '#fff', lineHeight: 1.05, marginTop: 24, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>नमस्कार 🙏</div>
        <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 40, color: C.yellow, opacity: io(t, 0.6, 1.1)}}>LDS खबर में आपका स्वागत है • आज की खबरों में</div>
        <div style={{display: 'flex', gap: 22, marginTop: 44}}>
          {LINEUP.map((l, i) => {
            const p = pop(t, 1.0 + i * 0.28);
            return (
              <div key={i} style={{width: 270, height: 200, borderRadius: 14, overflow: 'hidden', position: 'relative', transform: `translateY(${(1 - Math.min(1, p)) * 80}px) scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p * 1.5), boxShadow: '0 16px 30px rgba(0,0,0,0.45)', border: '3px solid rgba(255,255,255,0.9)'}}>
                <Img src={img(l.src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.1 + 0.03 * Math.sin(t + i)})`}} />
                <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(6,15,41,0.92))'}} />
                <div style={{position: 'absolute', left: 14, bottom: 8, fontFamily: F.head, fontWeight: 700, fontSize: 36, color: '#fff'}}>{l.t}</div>
                <div style={{position: 'absolute', left: 0, top: 0, width: 8, bottom: 0, background: i % 2 ? C.yellow : C.red}} />
              </div>
            );
          })}
        </div>
      </div>
      {LINEUP.map((_, i) => <Sfx key={i} at={1.0 + i * 0.28} src="sfx_tick" vol={0.18} dur={0.4} />)}
    </AbsoluteFill>
  );
};

const CalPage: React.FC<{day: string; wd: string; foot: string; red?: boolean}> = ({day, wd, foot}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#fff,#F3F1EA)', borderRadius: '0 0 22px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', backfaceVisibility: 'hidden'}}>
    <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 330, lineHeight: 0.9, color: C.ink, marginTop: 40}}>{day}</div>
    <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 70, color: C.red, lineHeight: 1}}>{wd}</div>
    <div style={{marginTop: 22, padding: '10px 26px 4px', background: C.navy, color: '#fff', fontFamily: F.head, fontWeight: 600, fontSize: 36, borderRadius: 8}}>{foot}</div>
  </div>
);

export const Panchang: React.FC<{b: Beat; t: number}> = ({t}) => {
  const enter = io(t, 4.4, 5.1);
  const flip = io(t, 8.7, 9.5, EIO);
  const chips = [
    {at: 11.6, k: 'मास', v: 'कार्तिक'},
    {at: 12.8, k: 'पक्ष', v: 'शुक्ल'},
    {at: 13.8, k: 'तिथि', v: 'द्वादशी'},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 210, top: 225, width: 640, height: 690, transform: `translateY(${(1 - enter) * 100}px) rotate(${(1 - enter) * -6}deg)`, opacity: enter, perspective: 1800}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 24, boxShadow: '0 40px 80px rgba(0,0,0,0.55)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 130, background: `linear-gradient(180deg, ${C.red}, ${C.redDeep})`, borderRadius: '22px 22px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.head, fontWeight: 700, fontSize: 64, color: '#fff', paddingTop: 20}}>नवंबर 2026</div>
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', top: -22, left: 70 + i * 96, width: 22, height: 54, borderRadius: 11, background: 'linear-gradient(90deg,#999,#eee,#888)', boxShadow: '0 4px 6px rgba(0,0,0,0.4)'}} />)}
        <div style={{position: 'absolute', left: 0, right: 0, top: 130, bottom: 0}}>
          <CalPage day="21" wd="शनिवार" foot="कार्तिक • शुक्ल पक्ष • द्वादशी" />
          <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 0%', transform: `rotateX(${flip * 115}deg) translateY(${flip * -20}px)`, opacity: 1 - io(t, 9.3, 9.6)}}>
            <CalPage day="20" wd="शुक्रवार" foot="कार्तिक • शुक्ल पक्ष" />
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 940, top: 260}}>
        <div style={{transform: `translateX(${(1 - io(t, 4.6, 5.2)) * 60}px)`, opacity: io(t, 4.6, 5.2)}}>
          <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 40, color: C.yellow}}>तिथि और त्योहार</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 96, color: '#fff', lineHeight: 1}}>आज का पंचांग</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 40}}>
          {chips.map((c, i) => {
            const p = io(t, c.at, c.at + 0.45);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'stretch', opacity: p, transform: `translateX(${(1 - p) * 80}px)`, boxShadow: '0 14px 30px rgba(0,0,0,0.4)', borderRadius: 12, overflow: 'hidden', width: 640}}>
                <div style={{width: 180, background: C.red, color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8}}>{c.k}</div>
                <div style={{flex: 1, background: '#fff', color: C.ink, fontFamily: F.head, fontWeight: 700, fontSize: 64, padding: '14px 34px 4px'}}>{c.v}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Sfx at={8.7} src="sfx_whoosh_3" vol={0.3} dur={1} />
      {chips.map((c, i) => <Sfx key={i} at={c.at} src="sfx_pop" vol={0.2} dur={0.5} />)}
    </AbsoluteFill>
  );
};

/** Tithi timeline: 21 Nov 00:00 → 22 Nov 09:00 (33 h). */
export const Tithi: React.FC<{b: Beat; t: number}> = ({t}) => {
  const X0 = 140, W = 1640, H0 = 0, H1 = 33;
  const hx = (h: number) => X0 + ((h - H0) / (H1 - H0)) * W;
  const ek = 6 + 31 / 60; // 6:31 AM 21 Nov
  const dw = 24 + 4 + 56 / 60; // 4:56 AM 22 Nov
  const draw = io(t, 15.6, 16.6);
  const ph = lerp(t, 16.2, 27.2, 0, dw + 1.2, EIO);
  const lbl1 = io(t, 17.4, 17.9);
  const lbl2 = io(t, 23.3, 23.8);
  const y = 560;
  const ticks = [0, 6, 12, 18, 24, 30];
  const tl = (h: number) => {
    const hh = h % 24;
    const m = hh === 0 ? 'रात 12' : hh < 12 ? `सुबह ${hh}` : hh === 12 ? 'दोपहर 12' : hh < 18 ? `दोपहर ${hh - 12}` : `शाम ${hh - 12}`;
    return m;
  };
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, background: 'rgba(6,15,41,0.55)', borderRadius: 20, border: '2px solid rgba(255,255,255,0.15)', opacity: io(t, 15.3, 15.8)}} />
      <div style={{position: 'absolute', left: 100, top: 230, opacity: io(t, 15.5, 16)}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 80, color: '#fff', lineHeight: 1}}>तिथि का समय</div>
        <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.grey, marginTop: 6}}>21 नवंबर (शनिवार) से 22 नवंबर (रविवार) सुबह तक</div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="ekg" x1="0" x2="1"><stop offset="0" stopColor="#FF8A1F" /><stop offset="1" stopColor="#FFB45A" /></linearGradient>
          <linearGradient id="dwg" x1="0" x2="1"><stop offset="0" stopColor="#FFC915" /><stop offset="1" stopColor="#FFE58A" /></linearGradient>
          <clipPath id="tclip"><rect x={X0} y={y - 60} width={W * draw} height={120} /></clipPath>
          <linearGradient id="night" x1="0" x2="1">
            <stop offset="0" stopColor="#0A1840" /><stop offset={(6.5 / 33).toFixed(3)} stopColor="#0A1840" /><stop offset={(8 / 33).toFixed(3)} stopColor="#3D6FD1" /><stop offset={(16 / 33).toFixed(3)} stopColor="#3D6FD1" /><stop offset={(18.5 / 33).toFixed(3)} stopColor="#0A1840" /><stop offset={(30.5 / 33).toFixed(3)} stopColor="#0A1840" /><stop offset="1" stopColor="#3D6FD1" />
          </linearGradient>
        </defs>
        <rect x={X0} y={y - 150} width={W * draw} height={60} rx={10} fill="url(#night)" opacity={0.85} />
        <g clipPath="url(#tclip)">
          <rect x={X0} y={y - 46} width={hx(ek) - X0} height={92} fill="url(#ekg)" />
          <rect x={hx(ek)} y={y - 46} width={hx(dw) - hx(ek)} height={92} fill="url(#dwg)" />
          <rect x={hx(dw)} y={y - 46} width={X0 + W - hx(dw)} height={92} fill="#8FA3D6" />
          <text x={(X0 + hx(ek)) / 2} y={y + 16} textAnchor="middle" fontFamily={F.head} fontWeight={700} fontSize={40} fill={C.ink}>एकादशी</text>
          <text x={(hx(ek) + hx(dw)) / 2} y={y + 18} textAnchor="middle" fontFamily={F.head} fontWeight={700} fontSize={54} fill={C.ink}>द्वादशी</text>
          <text x={(hx(dw) + X0 + W) / 2} y={y + 14} textAnchor="middle" fontFamily={F.head} fontWeight={700} fontSize={30} fill={C.ink}>त्रयोदशी</text>
        </g>
        {ticks.map((h) => (
          <g key={h} opacity={draw}>
            <line x1={hx(h)} y1={y + 52} x2={hx(h)} y2={y + 70} stroke="#fff" strokeWidth={3} />
            <text x={hx(h)} y={y + 104} textAnchor="middle" fontFamily={F.num} fontWeight={500} fontSize={34} fill="#C9D4EE">{tl(h)}</text>
          </g>
        ))}
        <line x1={hx(24)} y1={y - 160} x2={hx(24)} y2={y + 60} stroke="#fff" strokeWidth={2} strokeDasharray="8 8" opacity={draw * 0.6} />
        <text x={hx(24) + 12} y={y - 166} fontFamily={F.head} fontWeight={600} fontSize={30} fill="#fff" opacity={draw}>22 नवंबर</text>
        <text x={X0 + 6} y={y - 166} fontFamily={F.head} fontWeight={600} fontSize={30} fill="#fff" opacity={draw}>21 नवंबर</text>
        {/* playhead */}
        <g transform={`translate(${hx(ph)},0)`} opacity={io(t, 16.2, 16.5)}>
          <line x1={0} y1={y - 80} x2={0} y2={y + 60} stroke={C.red} strokeWidth={5} />
          <circle cy={y - 86} r={12} fill={C.red} stroke="#fff" strokeWidth={4} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: hx(6.8) - 40, top: y - 152 - 6}}><Sun size={70} t={t} /></div>
      <div style={{position: 'absolute', left: hx(1.5) - 30, top: y - 146}}><Moon size={50} /></div>
      <div style={{position: 'absolute', left: hx(26) - 30, top: y - 146, opacity: draw}}><Moon size={50} /></div>
      {/* labels */}
      <div style={{position: 'absolute', left: hx(ek) - 190, top: y + 140, width: 520, opacity: lbl1, transform: `translateY(${(1 - lbl1) * 30}px)`}}>
        <div style={{width: 4, height: 50, background: C.saffron, marginLeft: 190, marginTop: -60, marginBottom: 10}} />
        <div style={{background: '#fff', borderRadius: 12, padding: '14px 22px 8px', borderLeft: `10px solid ${C.saffron}`, boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 28, color: '#555'}}>एकादशी समाप्त</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 50, color: C.ink, lineHeight: 1.1}}>सुबह 6:31 बजे</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: hx(dw) - 470, top: y + 140, width: 580, opacity: lbl2, transform: `translateY(${(1 - lbl2) * 30}px)`}}>
        <div style={{width: 4, height: 50, background: C.yellow, marginLeft: 470, marginTop: -60, marginBottom: 10}} />
        <div style={{background: '#fff', borderRadius: 12, padding: '14px 22px 8px', borderLeft: `10px solid ${C.yellow}`, boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 28, color: '#555'}}>द्वादशी तिथि रहेगी</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 50, color: C.ink, lineHeight: 1.1}}>22 नवंबर, सुबह 4:56 तक</div>
        </div>
      </div>
      <div style={{position: 'absolute', right: 70, bottom: 160, fontFamily: F.body, fontWeight: 500, fontSize: 22, color: C.grey, opacity: draw}}>समय पंचांग के अनुसार; स्थान के हिसाब से थोड़ा अंतर संभव</div>
      <Sfx at={17.4} src="sfx_pop" vol={0.2} dur={0.5} />
      <Sfx at={23.3} src="sfx_pop" vol={0.2} dur={0.5} />
    </AbsoluteFill>
  );
};

export const Tulsi: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const p = io(t, b.at - 0.1, b.at + 0.6);
  const ttl = io(t, b.at + 0.3, b.at + 1.0);
  const sub = io(t, 30.4, 31.0);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 50%, rgba(255,160,40,0.35), transparent 60%)', opacity: p}} />
      <Particles n={30} color="#FFB347" seed={5} speed={45} size={9} opacity={0.75} />
      <div style={{position: 'absolute', left: 150, top: 205, width: 540, height: 720, borderRadius: 300, overflow: 'hidden', border: `8px solid ${C.gold}`, boxShadow: `0 0 80px rgba(255,170,60,0.6), 0 30px 60px rgba(0,0,0,0.5)`, transform: `scale(${0.9 + 0.1 * p})`, opacity: p}}>
        <Photo src={b.src} w={540} h={720} t={t} a={b.at} b={b.until} kb="in" showCredit={false} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 205, width: 540, height: 720}}><CreditChip text={credit(b.src)} style={{right: 130, bottom: 40}} /></div>
      <div style={{position: 'absolute', left: 120, top: 800}}><Diya t={t} size={130} /></div>
      <div style={{position: 'absolute', left: 590, top: 800}}><Diya t={t + 1.3} size={130} /></div>
      <div style={{position: 'absolute', left: 800, top: 300, width: 1050}}>
        <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 44, color: C.gold, opacity: ttl}}>आज है</div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 170, lineHeight: 1, background: `linear-gradient(180deg, #FFF3C4, ${C.gold} 55%, #E08A1E)`, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))', clipPath: `inset(-20% ${(1 - ttl) * 100}% -20% 0)`}}>तुलसी विवाह</div>
        <div style={{height: 6, width: 600 * ttl, background: `linear-gradient(90deg, ${C.gold}, transparent)`, margin: '10px 0 30px'}} />
        <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 48, lineHeight: 1.35, color: '#fff', opacity: sub, transform: `translateY(${(1 - sub) * 20}px)`}}>
          तुलसी माता और भगवान शालिग्राम<br />के विवाह का पावन पर्व
        </div>
      </div>
      <Sfx at={b.at + 0.2} src="sfx_whoosh_3" vol={0.2} dur={1} />
    </AbsoluteFill>
  );
};

export const Greeting: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const p = io(t, b.at - 0.1, b.at + 0.5);
  const txt = pop(t, b.at + 0.2, 30, 12, 120);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: p, border: `3px solid ${C.gold}`}}>
        <Photo src={b.src} w={CA.w} h={CA.h} t={t} a={b.at} b={b.until} kb="in" creditStyle={{top: 16, bottom: 'auto'}} />
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, rgba(60,20,0,0.25), rgba(30,8,0,0.8))'}} />
        <Particles n={34} color="#FFD27A" seed={8} speed={40} size={8} />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${txt})`}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 70, color: '#FFE9B0', textShadow: '0 6px 20px rgba(0,0,0,0.7)'}}>LDS खबर की ओर से</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 150, lineHeight: 1.05, textAlign: 'center', background: `linear-gradient(180deg, #FFF6D5, ${C.gold} 60%, #E58E1A)`, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.75))'}}>तुलसी विवाह की<br />शुभकामनाएं</div>
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

export const Slam: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const s = lerp(t, b.at + 0.05, b.at + 0.3, 3.2, 1, EIN);
  const o = io(t, b.at, b.at + 0.15);
  const shake = t > b.at + 0.3 && t < b.at + 0.6 ? Math.sin(t * 120) * (b.at + 0.6 - t) * 40 : 0;
  const bars = io(t, b.at, b.at + 0.4, EOUT);
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake / 2}px)`}}>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', background: `linear-gradient(135deg, ${C.redDeep}, ${C.red} 45%, ${C.navy} 46%, ${C.navyDeep})`, opacity: o}}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{position: 'absolute', top: 120 + i * 120, left: -200, width: 2400, height: 26, background: i % 2 ? 'rgba(255,201,21,0.4)' : 'rgba(255,255,255,0.12)', transform: `skewX(-30deg) translateX(${(1 - bars) * (i % 2 ? 2000 : -2000) + ((t * 300 * (i % 2 ? 1 : -1)) % 200)}px)`}} />
        ))}
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{transform: `scale(${s})`, opacity: o, textAlign: 'center'}}>
            <div style={{display: 'inline-block', background: C.yellow, color: C.ink, fontFamily: F.num, fontWeight: 700, fontSize: 70, padding: '6px 34px 0', letterSpacing: 6, transform: 'skewX(-10deg)'}}>LATEST NEWS</div>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 190, color: '#fff', lineHeight: 1.05, textShadow: '0 14px 40px rgba(0,0,0,0.6)'}}>{b.text}</div>
          </div>
        </AbsoluteFill>
      </div>
      <Sfx at={b.at} src="sfx_breaking_news_alert" vol={0.32} dur={3.2} />
    </AbsoluteFill>
  );
};
export {EIO};

import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {C, F} from '../theme';
import {EIN, EIO, EOUT, fmtIN, io, lerp, pop, win} from '../lib/anim';
import {Beat} from '../content';
import {bgImg, CA, Card, img, Particles, Photo, Sfx} from '../components/ui';
import {Diya, FlagIN, FlagJP, FlagSG} from './common';
import {GeoMap} from './maps';
import geo from '../data/geo.json';

/* ───────────── S07: India–Japan 2+2 ───────────── */
const Minister: React.FC<{t: number; at: number; name: string; role: string; jp?: boolean}> = ({t, at, name, role, jp}) => {
  const p = pop(t, at, 30, 14, 150);
  return (
    <div style={{width: 430, background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 18px 36px rgba(0,0,0,0.45)', transform: `translateY(${(1 - Math.min(1, p)) * 80}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 1.6)}}>
      <div style={{height: 10, background: jp ? '#BC002D' : 'linear-gradient(90deg,#FF9933 33%,#fff 33% 66%,#138808 66%)'}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px 8px'}}>
        {jp ? <FlagJP w={60} /> : <FlagIN w={60} />}
        <div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: 1.05}}>{name}</div>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 22, color: '#6B7390'}}>{role}</div>
        </div>
      </div>
    </div>
  );
};

export const TwoPlus: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at, b.at + 0.5);
  const big = pop(t, 7.3, 30, 11, 120);
  const chips = [
    {at: 5.2, text: '19 नवंबर'},
    {at: 6.3, text: 'टोक्यो'},
    {at: 6.9, text: 'चौथी वार्ता'},
  ];
  const shake = t > 7.3 && t < 7.7 ? Math.sin(t * 90) * 6 * (1 - (t - 7.3) / 0.4) : 0;
  return (
    <AbsoluteFill>
      {/* photo card right */}
      <div style={{position: 'absolute', left: 1040, top: CA.y, width: 840, height: 520, borderRadius: 18, overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', opacity: enter, transform: `translateX(${(1 - enter) * 80}px)`}}>
        <Photo src={b.src} w={840} h={520} t={t} a={b.at} b={b.until} kb="in" />
      </div>
      {/* flags + 2+2 */}
      <div style={{position: 'absolute', left: 60, top: 210, width: 940, height: 500, transform: `translateX(${shake}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, opacity: io(t, 3.3, 3.8)}}>
          <div style={{transform: `translateX(${(1 - io(t, 3.3, 3.9)) * -120}px)`}}><FlagIN w={150} /></div>
          <div style={{fontSize: 70, transform: `scale(${pop(t, 4.3)})`}}>🤝</div>
          <div style={{transform: `translateX(${(1 - io(t, 4.3, 4.9)) * 120}px)`}}><FlagJP w={150} /></div>
          <div style={{marginLeft: 16}}>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 64, color: '#fff', lineHeight: 1}}>भारत–जापान</div>
            <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 34, color: C.yellow}}>विदेश + रक्षा मंत्री स्तर</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, top: 150, fontFamily: F.num, fontWeight: 700, fontSize: 330, lineHeight: 0.85, color: '#fff', transform: `scale(${big})`, transformOrigin: 'left center', opacity: Math.min(1, big * 2), textShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
          2<span style={{color: C.yellow}}>+</span>2
        </div>
        <div style={{position: 'absolute', left: 520, top: 190, display: 'flex', flexDirection: 'column', gap: 14}}>
          {chips.map((c, i) => {
            const p = io(t, c.at, c.at + 0.35);
            return <div key={i} style={{alignSelf: 'flex-start', background: i === 2 ? C.red : C.navy, border: '2px solid rgba(255,255,255,0.5)', color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 46, padding: '8px 22px 0', borderRadius: 10, opacity: p, transform: `translateX(${(1 - p) * 50}px)`}}>{c.text}</div>;
          })}
        </div>
      </div>
      {/* ministers */}
      <div style={{position: 'absolute', left: 60, top: 760, display: 'flex', gap: 22, alignItems: 'flex-end'}}>
        <Minister t={t} at={9.8} name="एस. जयशंकर" role="विदेश मंत्री" />
        <Minister t={t} at={10.0} name="राजनाथ सिंह" role="रक्षा मंत्री" />
        <div style={{width: 6, height: 90, background: C.yellow, borderRadius: 3, opacity: io(t, 10, 10.3)}} />
        <Minister t={t} at={10.3} name="तोशिमित्सु मोतेगी" role="विदेश मंत्री" jp />
        <Minister t={t} at={10.5} name="शिंजिरो कोइज़ुमी" role="रक्षा मंत्री" jp />
      </div>
      <Sfx at={3.4} src="sfx_whoosh_1" vol={0.2} dur={0.8} />
      <Sfx at={7.3} src="sfx_impact_boom" vol={0.18} dur={1.5} />
      <Sfx at={9.8} src="sfx_whoosh_3" vol={0.2} dur={0.8} />
    </AbsoluteFill>
  );
};

export const Missile: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 0.5);
  const R = 330;
  const sweep = (t * 120) % 360;
  const fly = io(t, 26.8, 28.2, EIO);
  const hit = io(t, 28.2, 28.5);
  const boom = t > 28.2 ? io(t, 28.2, 29.4) : 0;
  const P0 = [-230, 150], P1 = [190, -120], Cp = [-60, -260];
  const q = (u: number) => [(1 - u) * (1 - u) * P0[0] + 2 * (1 - u) * u * Cp[0] + u * u * P1[0], (1 - u) * (1 - u) * P0[1] + 2 * (1 - u) * u * Cp[1] + u * u * P1[1]];
  const m = q(fly);
  const trail = new Array(30).fill(0).map((_, i) => q((fly * i) / 29)).map((p) => p.join(',')).join(' ');
  const lines = [
    {at: 24.3, k: 'प्रस्तावित प्रशिक्षण', v: 'सतह से जहाज़ पर प्रहार करने वाली मिसाइलें'},
    {at: 29.2, k: 'संभावना', v: 'इनसे जुड़े अभ्यास भी शामिल हो सकते हैं'},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: 880, height: CA.h, borderRadius: 18, overflow: 'hidden', background: 'radial-gradient(circle at 50% 50%, #08321F, #020D08 75%)', border: '3px solid rgba(80,255,160,0.55)', opacity: enter, boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
        <svg width={880} height={750} viewBox="-440 -375 880 750">
          <defs>
            <radialGradient id="sweepG" cx="0" cy="0" r="1"><stop offset="0" stopColor="rgba(60,255,150,0.0)" /><stop offset="1" stopColor="rgba(60,255,150,0.35)" /></radialGradient>
          </defs>
          {[1, 0.75, 0.5, 0.25].map((k) => <circle key={k} r={R * k} fill="none" stroke="rgba(80,255,160,0.35)" strokeWidth={2} />)}
          <line x1={-R} y1={0} x2={R} y2={0} stroke="rgba(80,255,160,0.25)" />
          <line x1={0} y1={-R} x2={0} y2={R} stroke="rgba(80,255,160,0.25)" />
          <g transform={`rotate(${sweep})`}>
            <path d={`M0 0 L${R} 0 A${R} ${R} 0 0 0 ${R * Math.cos(-0.7)} ${R * Math.sin(-0.7)} Z`} fill="rgba(60,255,150,0.22)" />
            <line x1={0} y1={0} x2={R} y2={0} stroke="#5CFFA8" strokeWidth={3} />
          </g>
          {/* coastline */}
          <path d="M-440 120 C-330 140 -300 200 -260 230 C-220 260 -250 330 -200 375 L-440 375 Z" fill="rgba(80,255,160,0.18)" stroke="#5CFFA8" strokeWidth={2} />
          {/* launcher */}
          <rect x={-246} y={140} width={34} height={20} fill="#5CFFA8" />
          {/* ship */}
          <g transform={`translate(${P1[0]},${P1[1]})`} opacity={1 - boom * 0.8}>
            <path d="M-46 0 L46 0 L34 16 L-34 16 Z" fill="#FF5A5A" />
            <rect x={-14} y={-16} width={28} height={16} fill="#FF5A5A" />
            <circle r={60 + ((t * 40) % 30)} fill="none" stroke="rgba(255,90,90,0.6)" strokeWidth={2} />
          </g>
          {fly > 0 && fly < 1 && <polyline points={trail} fill="none" stroke="#FFE14D" strokeWidth={4} strokeDasharray="10 8" />}
          {fly > 0 && fly < 1 && <circle cx={m[0]} cy={m[1]} r={9} fill="#fff" stroke={C.yellow} strokeWidth={4} />}
          {boom > 0 && <>
            <circle cx={P1[0]} cy={P1[1]} r={20 + boom * 150} fill="none" stroke="#FFE14D" strokeWidth={8 * (1 - boom)} />
            <circle cx={P1[0]} cy={P1[1]} r={70 * (1 - boom) + 10} fill="#FFB100" opacity={(1 - boom) * hit} />
          </>}
          <text x={-410} y={-335} fontFamily={F.num} fontSize={30} fill="#5CFFA8">RADAR • SURFACE-TO-SHIP</text>
          <text x={410} y={355} textAnchor="end" fontFamily={F.body} fontWeight={700} fontSize={22} fill="rgba(92,255,168,0.8)">सांकेतिक ग्राफ़िक</text>
        </svg>
      </div>
      <div style={{position: 'absolute', left: 960, top: CA.y, width: 920, height: 330, borderRadius: 18, overflow: 'hidden', border: '4px solid #fff', opacity: enter, boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}}>
        <Photo src={b.src} w={920} h={330} t={t} a={b.at} b={b.until} kb="right" />
      </div>
      <div style={{position: 'absolute', left: 960, top: 550, width: 920, display: 'flex', flexDirection: 'column', gap: 18}}>
        {lines.map((r, i) => {
          const p = io(t, r.at, r.at + 0.45);
          return (
            <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * 60}px)`, background: '#fff', borderRadius: 14, padding: '14px 26px 8px', borderLeft: `12px solid ${i ? C.saffron : C.red}`, boxShadow: '0 16px 30px rgba(0,0,0,0.4)'}}>
              <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 26, color: '#6B7390'}}>{r.k}</div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 50, color: C.ink, lineHeight: 1.12}}>{r.v}</div>
            </div>
          );
        })}
      </div>
      <Sfx at={26.8} src="sfx_whoosh_2" vol={0.22} dur={1.2} />
      <Sfx at={28.2} src="sfx_impact_boom" vol={0.22} dur={1.5} />
    </AbsoluteFill>
  );
};

/* ───────────── S08: Tribute ───────────── */
export const Tribute: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 1.0, EIO);
  const tx = io(t, b.at + 0.6, b.at + 1.6, EIO);
  if (b.wide) {
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, border: '2px solid rgba(255,255,255,0.4)'}}>
          <Photo src={b.src} w={CA.w} h={CA.h} t={t} a={b.at} b={b.until + 1} kb="out" filter="grayscale(1) brightness(0.65)" />
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15), rgba(0,0,0,0.75) 75%)'}} />
          <Particles n={22} color="#FFFFFF" speed={18} size={4} opacity={0.35} seed={3} />
        </div>
        <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: tx}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
            <Diya t={t} size={150} />
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 130, color: '#fff', letterSpacing: 2, textShadow: '0 10px 30px rgba(0,0,0,0.8)'}}>{b.line1}</div>
            <Diya t={t + 1.3} size={150} />
          </div>
          <div style={{width: 600 * tx, height: 3, background: 'linear-gradient(90deg, transparent, #fff, transparent)', margin: '10px 0 20px'}} />
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,0.85)'}}>{b.foot}</div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', background: 'radial-gradient(circle at 30% 50%, #2A2A31, #0B0B0E 75%)', border: '2px solid rgba(255,255,255,0.3)', opacity: enter}}>
        <Particles n={18} color="#FFFFFF" speed={15} size={4} opacity={0.3} seed={5} />
      </div>
      <div style={{position: 'absolute', left: 170, top: 225, width: 520, height: 650, borderRadius: '260px 260px 20px 20px', overflow: 'hidden', border: '8px solid #E8E8EE', boxShadow: '0 0 0 3px rgba(255,255,255,0.3), 0 30px 70px rgba(0,0,0,0.7)', opacity: enter, transform: `scale(${lerp(t, b.at, b.until, 1.03, 1)})`}}>
        <Photo src={b.src} w={520} h={650} t={t} a={b.at} b={b.until} kb="in" filter="grayscale(1)" pos="center 25%" creditStyle={{bottom: 74, right: 'auto', left: '50%', transform: 'translateX(-50%)'}} />
      </div>
      <div style={{position: 'absolute', left: 380, top: 810, opacity: enter}}><Diya t={t} size={110} /></div>
      <div style={{position: 'absolute', left: 820, top: 330, width: 1000, opacity: tx, transform: `translateY(${(1 - tx) * 30}px)`}}>
        <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 36, color: '#BDBDC4', letterSpacing: 2}}>दुखद समाचार</div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 140, color: '#fff', lineHeight: 1.0}}>{b.line1}</div>
        <div style={{width: 520 * tx, height: 3, background: 'linear-gradient(90deg, #fff, transparent)', margin: '18px 0'}} />
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
          <div style={{fontFamily: F.num, fontWeight: 600, fontSize: 110, color: '#E8E8EE', lineHeight: 1}}>{b.line2}</div>
        </div>
        <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 50, color: '#D5D5DB', marginTop: 16}}>{b.foot}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── S09: Rajasthan seats ───────────── */
const CONG = '#1C9BE6', BJP = '#FF8A1F';
const Bar: React.FC<{t: number; at: number; label: string; value: number; max: number; color: string; note?: string}> = ({t, at, label, value, max, color, note}) => {
  const p = io(t, at, at + 1.1, EIO);
  const v = Math.round(value * p);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, height: 84}}>
      <div style={{width: 190, display: 'flex', alignItems: 'center', gap: 10}}>
        <div style={{width: 16, height: 16, borderRadius: 4, background: color}} />
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.ink}}>{label}</div>
      </div>
      <div style={{flex: 1, height: 56, background: '#EEF1F7', borderRadius: 10, overflow: 'hidden', position: 'relative'}}>
        <div style={{width: `${(value / max) * 100 * p}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}CC)`, borderRadius: 10, boxShadow: `0 0 18px ${color}66`}} />
        {note && <div style={{position: 'absolute', right: 10, top: 12, fontFamily: F.body, fontWeight: 700, fontSize: 20, color: '#fff', background: '#6B7390', borderRadius: 6, padding: '2px 10px', opacity: io(t, at + 0.6, at + 1)}}>{note}</div>}
      </div>
      <div style={{width: 190, fontFamily: F.num, fontWeight: 700, fontSize: 76, color, lineHeight: 1, textAlign: 'right', paddingTop: 8, opacity: io(t, at, at + 0.2)}}>{fmtIN(v)}</div>
    </div>
  );
};

export const Seats: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at, b.at + 0.5);
  const v = (geo as any).raj;
  const zoom = io(t, b.at, 4, EIO);
  const cam = {cx: lerp(zoom, 0, 1, v.w / 2, 438), cy: lerp(zoom, 0, 1, v.h / 2, 390), s: lerp(zoom, 0, 1, 1, 1.25)};
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: 760, height: CA.h, borderRadius: 18, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', opacity: enter, boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
        <GeoMap view="raj" width={760} height={750} t={t} at={b.at} cam={cam} highlight={['Rajasthan']} showLabels={['Rajasthan']} />
        <div style={{position: 'absolute', left: 24, bottom: 24, width: 330, height: 220, borderRadius: 12, overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 14px 30px rgba(0,0,0,0.5)', opacity: io(t, 1.5, 2.0)}}>
          <Photo src={b.src} w={330} h={220} t={t} a={b.at} b={b.until} kb="in" creditStyle={{fontSize: 14}} />
        </div>
        <div style={{position: 'absolute', right: 24, top: 24, background: CONG, color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 44, padding: '10px 24px 2px', borderRadius: 10, transform: `scale(${pop(t, 3.1)})`, boxShadow: '0 12px 26px rgba(0,0,0,0.4)'}}>कांग्रेस आगे ▲</div>
      </div>
      <Card style={{left: 830, top: CA.y, width: 1050, height: CA.h, opacity: enter, transform: `translateX(${(1 - enter) * 60}px)`}}>
        <div style={{background: C.navy, padding: '20px 34px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 52, color: '#fff'}}>पंचायत चुनाव नतीजे</div>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 24, color: C.yellow, opacity: io(t, 3.9, 4.4), textAlign: 'right'}}>घोषित परिणाम<br />20 नवंबर, शाम 4:45 तक</div>
        </div>
        <div style={{padding: '24px 34px'}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 34, color: C.navy, marginBottom: 4, opacity: io(t, 8.4, 8.8), borderLeft: `8px solid ${C.yellow}`, paddingLeft: 12}}>पंचायत समिति सीटें <span style={{fontFamily: F.body, fontSize: 24, color: '#6B7390'}}>(आंशिक रुझान)</span></div>
          <Bar t={t} at={9.6} label="कांग्रेस" value={3436} max={3600} color={CONG} />
          <Bar t={t} at={13.8} label="भाजपा" value={2054} max={3600} color={BJP} note="अनुमान" />
          <div style={{height: 2, background: '#E3E6EE', margin: '22px 0 24px'}} />
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 34, color: C.navy, marginBottom: 4, opacity: io(t, 16.6, 17), borderLeft: `8px solid ${C.yellow}`, paddingLeft: 12}}>जिला परिषद सीटें</div>
          <Bar t={t} at={19.2} label="कांग्रेस" value={321} max={360} color={CONG} />
          <Bar t={t} at={20.8} label="भाजपा" value={125} max={360} color={BJP} />
        </div>
        <div style={{position: 'absolute', left: 34, bottom: 14, fontFamily: F.body, fontWeight: 600, fontSize: 21, color: '#6B7390'}}>शाम 4:45 तक के आंकड़े • बाद के अंतिम नतीजों में संख्या बढ़ी है</div>
      </Card>
      {[9.8, 14.0, 19.4, 21.0].map((a) => <Sfx key={a} at={a} src="sfx_tick" vol={0.22} dur={0.4} />)}
    </AbsoluteFill>
  );
};

/* ───────────── S10: Badminton score ───────────── */
export const Score: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 0.5);
  const games: [number, number, number][] = [[21, 17, 16.5], [10, 21, 17.4], [21, 13, 18.3]];
  const win1 = io(t, 18.9, 19.4);
  const Row: React.FC<{sg?: boolean}> = ({sg}) => (
    <div style={{display: 'flex', alignItems: 'center', height: 150, borderBottom: sg ? 'none' : '2px solid rgba(255,255,255,0.15)', background: !sg && win1 > 0 ? `rgba(22,199,106,${0.18 * win1})` : 'transparent'}}>
      <div style={{width: 130, display: 'flex', justifyContent: 'center'}}>{sg ? <FlagSG w={90} /> : <FlagIN w={90} />}</div>
      <div style={{flex: 1, fontFamily: F.head, fontWeight: 700, fontSize: 64, color: '#fff'}}>{sg ? 'लोह कीन यू' : 'लक्ष्य सेन'}</div>
      {games.map(([a, c, at], i) => {
        const p = pop(t, at, 30, 12, 160);
        const val = sg ? c : a;
        const won = sg ? c > a : a > c;
        return (
          <div key={i} style={{width: 150, height: 120, margin: '0 8px', borderRadius: 12, background: won ? C.yellow : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.num, fontWeight: 700, fontSize: 92, color: won ? C.ink : 'rgba(255,255,255,0.75)', transform: `scale(${Math.min(1.08, p)}) rotateX(${(1 - Math.min(1, p)) * 90}deg)`, opacity: Math.min(1, p * 2), paddingTop: 8}}>{val}</div>
        );
      })}
      <div style={{width: 160, display: 'flex', justifyContent: 'center'}}>
        {!sg && <div style={{background: C.green, color: '#fff', fontFamily: F.num, fontWeight: 700, fontSize: 52, padding: '6px 20px 0', borderRadius: 10, transform: `scale(${pop(t, 18.9)})`}}>WIN</div>}
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
        <Img src={bgImg('s10_badminton/s10_04.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,15,41,0.88), rgba(11,31,77,0.93))'}} />
        {/* court lines */}
        <svg width={CA.w} height={CA.h} style={{position: 'absolute', inset: 0, opacity: 0.12}}>
          <rect x={120} y={60} width={1600} height={630} fill="none" stroke="#fff" strokeWidth={6} />
          <line x1={920} y1={60} x2={920} y2={690} stroke="#fff" strokeWidth={6} />
          <line x1={120} y1={375} x2={1720} y2={375} stroke="#fff" strokeWidth={4} />
        </svg>
        <div style={{position: 'absolute', left: 80, top: 50, display: 'flex', alignItems: 'center', gap: 20}}>
          <div style={{background: C.red, color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 36, padding: '8px 18px 0', borderRadius: 8}}>क्वार्टर फाइनल</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 56, color: '#fff'}}>हांगकांग ओपन • पुरुष एकल</div>
        </div>
        <div style={{position: 'absolute', left: 80, right: 80, top: 190, borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden'}}>
          <div style={{display: 'flex', height: 60, alignItems: 'center', background: 'rgba(0,0,0,0.25)', fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.grey}}>
            <div style={{width: 130}} /><div style={{flex: 1}}>खिलाड़ी</div>
            {['गेम 1', 'गेम 2', 'गेम 3'].map((g) => <div key={g} style={{width: 166, textAlign: 'center'}}>{g}</div>)}
            <div style={{width: 160}} />
          </div>
          <Row />
          <Row sg />
        </div>
        <div style={{position: 'absolute', left: 80, bottom: 46, fontFamily: F.head, fontWeight: 700, fontSize: 46, color: C.yellow, opacity: io(t, 19.0, 19.5)}}>तीन गेम के मुकाबले में जीत, सेमीफाइनल में एंट्री 🏸</div>
      </div>
      {games.map(([, , at]) => <Sfx key={at} at={at} src="sfx_tick" vol={0.25} dur={0.4} />)}
      <Sfx at={18.9} src="sfx_pop" vol={0.3} dur={0.5} />
    </AbsoluteFill>
  );
};
export {EIN, EOUT, win, img};

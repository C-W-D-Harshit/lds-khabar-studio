import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F} from '../theme';
import {EIO, EOUT, fmtIN, io, lerp, pop} from '../lib/anim';
import {Beat} from '../content';
import {CA, Card, CreditChip, credit, img, MarkerTitle, Photo, Sfx} from '../components/ui';

export const CrimeBoard: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 0.5);
  const P = {x: 300, y: 380}; // centre of polaroid (screen)
  const cards = [
    {x: 1180, y: 300, rot: 2},
    {x: 1250, y: 560, rot: -2.5},
    {x: 1130, y: 800, rot: 1.5},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, background: 'radial-gradient(circle at 30% 40%, #1d2a4f, #0a1022 75%)', border: '3px solid rgba(255,255,255,0.6)'}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('brand/noise.png')})`, opacity: 0.12, mixBlendMode: 'overlay'}} />
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(500px 400px at ${30 + Math.sin(t) * 3}% 35%, rgba(255,240,200,0.14), transparent 70%)`}} />
        <div style={{position: 'absolute', right: 40, top: 30, fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.yellow, background: 'rgba(6,15,41,0.7)', padding: '6px 18px 0', borderRadius: 8}}>पुलिस का दावा</div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {b.links.map((l: any, i: number) => {
          const c = cards[i];
          const p = io(t, l.at - 0.2, l.at + 0.4, EIO);
          const x2 = P.x + 140 + (c.x - 40 - P.x - 140) * p;
          const y2 = P.y + (c.y - P.y) * p;
          const mx = (P.x + 140 + x2) / 2, my = (P.y + y2) / 2 + 40 * p;
          return <path key={i} d={`M ${P.x + 140} ${P.y} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke="#E0141E" strokeWidth={5} style={{filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.5))'}} />;
        })}
      </svg>
      {/* polaroid */}
      <div style={{position: 'absolute', left: P.x - 230, top: 240, width: 460, padding: '18px 18px 0', background: '#F4F1EA', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transform: `rotate(-3deg) scale(${pop(t, b.at)})`}}>
        <div style={{position: 'relative', width: 424, height: 470, overflow: 'hidden'}}>
          <Img src={img(b.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', filter: 'contrast(1.08) saturate(0.85)'}} />
          <CreditChip text={credit(b.src)} style={{right: 8, bottom: 8, fontSize: 16}} />
        </div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 50, color: C.ink, textAlign: 'center', padding: '12px 0 8px'}}>नसीम दुर्रानी</div>
        <div style={{position: 'absolute', top: -14, left: '50%', marginLeft: -16, width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #ff6b6b, #a00)', boxShadow: '0 4px 6px rgba(0,0,0,0.5)'}} />
      </div>
            {b.links.map((l: any, i: number) => {
        const c = cards[i];
        const p = pop(t, l.at + 0.2);
        return (
          <div key={i} style={{position: 'absolute', left: c.x - 40, top: c.y - 70, width: 660, transform: `rotate(${c.rot}deg) scale(${p})`, transformOrigin: 'left center', background: i === 0 ? '#FFF6C9' : '#fff', padding: '22px 30px 14px', boxShadow: '0 20px 40px rgba(0,0,0,0.55)', borderTop: `10px solid ${i === 0 ? C.yellow : C.red}`}}>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 46, lineHeight: 1.15, color: C.ink}}>{l.text}</div>
            <div style={{position: 'absolute', top: -20, left: 20, width: 26, height: 26, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #ff6b6b, #a00)', boxShadow: '0 4px 6px rgba(0,0,0,0.5)'}} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 1130, top: 900, fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.yellow, opacity: io(t, 12.5, 13)}}>* संबंधों का दावा पुलिस का है</div>
      {b.links.map((l: any, i: number) => <Sfx key={i} at={l.at} src="sfx_whoosh_3" vol={0.18} dur={0.8} />)}
      <Sfx at={b.at + 0.9} src="sfx_impact_boom" vol={0.14} dur={1.5} />
    </AbsoluteFill>
  );
};

export const Steps: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const pi = io(t, b.at - 0.1, b.at + 0.5);
  const icons = [
    <svg key="a" width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="20" fill="none" stroke="#fff" strokeWidth="4" /><circle cx="28" cy="28" r="6" fill="#fff" /><path d="M28 2v12M28 42v12M2 28h12M42 28h12" stroke="#fff" strokeWidth="4" /></svg>,
    <svg key="b" width="56" height="56" viewBox="0 0 56 56"><path d="M8 28h40M28 8v40" stroke="#fff" strokeWidth="10" strokeLinecap="round" /></svg>,
    <svg key="c" width="56" height="56" viewBox="0 0 56 56"><rect x="8" y="14" width="40" height="32" rx="4" fill="none" stroke="#fff" strokeWidth="4" /><path d="M28 20v20M18 30h20" stroke="#fff" strokeWidth="5" /></svg>,
  ];
  const lineP = lerp(t, b.steps[0].at, b.steps[2].at + 0.3, 0, 1, (x) => x);
  return (
    <>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, transform: `translateX(${(1 - pi) * -70}px)`, opacity: pi, borderRadius: 18, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
        <Photo src={b.src} w={900} h={750} t={t} a={b.at} b={b.until} kb="in" filter="saturate(0.8)" />
        <div style={{position: 'absolute', left: 0, top: 0, background: C.navy, color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 28, padding: '8px 18px 2px', borderRadius: '0 0 10px 0'}}>सांकेतिक तस्वीर</div>
      </div>
      <Card style={{left: 970, top: CA.y, width: 910, height: 750, opacity: pi, transform: `translateX(${(1 - pi) * 80}px)`}}>
        <div style={{height: 10, background: `linear-gradient(90deg, ${C.red}, ${C.saffron})`}} />
        <div style={{padding: '40px 50px'}}>
          <MarkerTitle text={b.title} t={t} at={b.at + 0.2} size={58} />
          <div style={{position: 'relative', marginTop: 50, paddingLeft: 10}}>
            <div style={{position: 'absolute', left: 48, top: 40, width: 8, height: 400, background: '#E3E6EF', borderRadius: 4}} />
            <div style={{position: 'absolute', left: 48, top: 40, width: 8, height: 400 * lineP, background: C.red, borderRadius: 4}} />
            {b.steps.map((s: any, i: number) => {
              const p = io(t, s.at, s.at + 0.45);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 34, height: 180, opacity: 0.25 + 0.75 * p}}>
                  <div style={{position: 'relative', width: 96, height: 96, borderRadius: '50%', background: p > 0.1 ? (i === 2 ? C.ink : C.red) : '#C5CAD8', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.8 + 0.2 * pop(t, s.at)})`, boxShadow: p > 0.1 ? '0 10px 24px rgba(224,20,30,0.4)' : 'none', zIndex: 2}}>{icons[i]}</div>
                  <div>
                    <div style={{fontFamily: F.num, fontWeight: 600, fontSize: 30, color: C.red, letterSpacing: 2}}>चरण {i + 1}</div>
                    <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 60, color: C.ink, lineHeight: 1.05, transform: `translateX(${(1 - p) * 40}px)`}}>{s.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      {b.steps.map((s: any, i: number) => <Sfx key={i} at={s.at} src="sfx_tick" vol={0.25} dur={0.4} />)}
    </>
  );
};

const Tile: React.FC<{t: number; at: number; countAt: number; name: string; ex: string; value: number; change: number; pct: number; x: number}> = ({t, at, countAt, name, ex, value, change, pct, x}) => {
  const p = pop(t, at);
  const c = lerp(t, countAt, countAt + 1.8, 0, 1, EOUT);
  const v = value - change + change * c;
  const chP = io(t, countAt, countAt + 0.4);
  const glow = 0.5 + 0.5 * Math.sin(t * 4);
  return (
    <div style={{position: 'absolute', left: x, top: 230, width: 820, height: 420, transform: `scale(${Math.min(p, 1.05)}) translateY(${(1 - Math.min(1, p)) * 60}px)`, opacity: Math.min(1, p * 1.4), borderRadius: 24, background: 'linear-gradient(160deg, #0F2A62, #071534)', border: '2px solid rgba(22,199,106,0.6)', boxShadow: `0 30px 60px rgba(0,0,0,0.55), 0 0 ${30 + glow * 30}px rgba(22,199,106,0.25)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(22,199,106,0.15), transparent 50%)'}} />
      <div style={{position: 'absolute', left: 44, top: 30, display: 'flex', alignItems: 'baseline', gap: 18}}>
        <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 84, color: '#fff', letterSpacing: 3, lineHeight: 1}}>{name}</div>
        <div style={{fontFamily: F.num, fontWeight: 500, fontSize: 38, color: C.grey}}>{ex}</div>
      </div>
      <div style={{position: 'absolute', right: 40, top: 40, width: 74, height: 74, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(22,199,106,0.7)'}}>
        <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 6 L34 26 H24 V36 H16 V26 H6 Z" fill="#fff" /></svg>
      </div>
      <div style={{position: 'absolute', left: 44, top: 140, fontFamily: F.num, fontWeight: 700, fontSize: 170, color: '#fff', lineHeight: 1, letterSpacing: 2}}>{fmtIN(v, 2)}</div>
      <div style={{position: 'absolute', left: 44, bottom: 40, display: 'flex', gap: 18, opacity: chP, transform: `translateY(${(1 - chP) * 20}px)`}}>
        <div style={{background: C.green, color: '#fff', fontFamily: F.num, fontWeight: 700, fontSize: 60, padding: '6px 22px 0', borderRadius: 10}}>▲ {fmtIN(change, 2)}</div>
        <div style={{background: 'rgba(22,199,106,0.18)', color: C.green, border: `3px solid ${C.green}`, fontFamily: F.num, fontWeight: 700, fontSize: 60, padding: '4px 22px 0', borderRadius: 10}}>+{pct.toFixed(2)}%</div>
      </div>
    </div>
  );
};

export const Market: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const bars = io(t, 18.5, 19.6, EOUT);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, background: 'radial-gradient(circle at 50% 0%, rgba(22,199,106,0.18), rgba(6,15,41,0.85) 60%)', border: '2px solid rgba(255,255,255,0.15)', opacity: io(t, b.at - 0.1, b.at + 0.4)}} />
      <Tile t={t} at={7.1} countAt={7.9} name="SENSEX" ex="BSE" value={83919.71} change={897.96} pct={1.08} x={110} />
      <Tile t={t} at={12.9} countAt={13.9} name="NIFTY 50" ex="NSE" value={25800.6} change={286.3} pct={1.12} x={990} />
      <div style={{position: 'absolute', left: 110, top: 690, width: 1700, opacity: io(t, 18.3, 18.8)}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.yellow, marginBottom: 12}}>शुक्रवार की बढ़त (%)</div>
        {[{n: 'सेंसेक्स', v: 1.08}, {n: 'निफ्टी', v: 1.12}].map((r, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 14}}>
            <div style={{width: 160, fontFamily: F.head, fontWeight: 700, fontSize: 40, color: '#fff'}}>{r.n}</div>
            <div style={{flex: 1, height: 46, background: 'rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden'}}>
              <div style={{width: `${(r.v / 1.3) * 100 * bars}%`, height: '100%', background: `linear-gradient(90deg, ${C.greenDeep}, ${C.green})`, borderRadius: 8, boxShadow: '0 0 20px rgba(22,199,106,0.5)'}} />
            </div>
            <div style={{width: 150, fontFamily: F.num, fontWeight: 700, fontSize: 54, color: C.green}}>{(r.v * bars).toFixed(2)}%</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', right: 70, top: 205, fontFamily: F.body, fontWeight: 500, fontSize: 22, color: C.grey, opacity: io(t, 8, 8.5)}}>शुक्रवार 20 नवंबर का बंद भाव</div>
      <Sfx at={7.1} src="sfx_whoosh_3" vol={0.25} dur={0.8} />
      <Sfx at={12.9} src="sfx_whoosh_3" vol={0.25} dur={0.8} />
      <Sfx at={7.9} src="sfx_tick" vol={0.2} dur={0.4} />
      <Sfx at={13.9} src="sfx_tick" vol={0.2} dur={0.4} />
    </AbsoluteFill>
  );
};

export const Gainers: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const pi = io(t, b.at - 0.1, b.at + 0.5);
  const names = [{n: 'Kotak Mahindra Bank', at: 24.0}, {n: 'HDFC Bank', at: 25.6}, {n: 'Maruti Suzuki', at: 26.5}, {n: 'ICICI Bank', at: 27.2}];
  return (
    <>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, transform: `translateX(${(1 - pi) * -70}px)`, opacity: pi, borderRadius: 18, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
        <Photo src={b.src} w={860} h={750} t={t} a={b.at} b={b.until} kb="in" />
      </div>
      <Card style={{left: 930, top: CA.y, width: 950, height: 750, opacity: pi, transform: `translateX(${(1 - pi) * 80}px)`}}>
        <div style={{height: 10, background: `linear-gradient(90deg, ${C.greenDeep}, ${C.green})`}} />
        <div style={{padding: '40px 50px'}}>
          <MarkerTitle text="इन शेयरों में दिखी खरीदारी" t={t} at={b.at + 0.2} size={58} marker="#BFF3D6" />
          <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 44}}>
            {names.map((g, i) => {
              const p = io(t, g.at, g.at + 0.4);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, background: '#F2FBF6', border: '2px solid #CDEEDB', borderRadius: 14, padding: '18px 26px', opacity: p, transform: `translateX(${(1 - p) * 70}px)`}}>
                  <div style={{width: 64, height: 64, borderRadius: 12, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg width="34" height="34" viewBox="0 0 40 40"><path d="M20 6 L34 26 H24 V36 H16 V26 H6 Z" fill="#fff" /></svg>
                  </div>
                  <div style={{fontFamily: F.num, fontWeight: 600, fontSize: 62, color: C.ink, lineHeight: 1, paddingTop: 6, letterSpacing: 1}}>{g.n}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 26, fontFamily: F.body, fontWeight: 700, fontSize: 26, color: '#6B7390', opacity: io(t, 28, 28.5)}}>बैंकिंग और ऑटो सेक्टर के बड़े नाम</div>
        </div>
      </Card>
      {names.map((g, i) => <Sfx key={i} at={g.at} src="sfx_pop" vol={0.2} dur={0.5} />)}
    </>
  );
};
export {EIO};

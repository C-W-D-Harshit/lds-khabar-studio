import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {C, F} from '../theme';
import {EIN, EIO, EOUT, io, lerp, pop, win} from '../lib/anim';
import {Beat} from '../content';
import {CA, Card, credit, CreditChip, img, MarkerTitle, Photo, Sfx} from '../components/ui';
import {Stamp} from '../components/layouts';

const Check: React.FC<{on: number; done: number; n: number; text: string}> = ({on, done, n, text}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 20px', borderRadius: 14, background: on > 0.5 ? C.navy : done > 0.5 ? '#EEF2FB' : '#F5F6FA', transform: `scale(${1 + on * 0.03})`, transition: 'none', boxShadow: on > 0.5 ? '0 12px 26px rgba(11,31,77,0.35)' : 'none'}}>
    <div style={{width: 54, height: 54, borderRadius: '50%', background: done > 0.5 ? C.green : on > 0.5 ? C.yellow : '#D5DAE6', color: on > 0.5 && done <= 0.5 ? C.ink : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.num, fontWeight: 700, fontSize: 36, paddingTop: 4, flex: '0 0 auto'}}>
      {done > 0.5 ? '✓' : n}
    </div>
    <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 38, lineHeight: 1.1, color: on > 0.5 ? '#fff' : C.ink}}>{text}</div>
  </div>
);

export const Epfo: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 0.5);
  const ph = t < 8.6 ? 0 : t < 15.4 ? 1 : t < 21.0 ? 2 : 3;
  const A = win(t, b.at, 8.7, 0.4, 0.35);
  const B = win(t, 8.5, 15.5, 0.4, 0.35);
  const Cc = win(t, 15.3, 21.1, 0.4, 0.35);
  const D = win(t, 20.9, 32.6, 0.4, 0.35);
  // donut
  const pct = lerp(t, 11.2, 12.2, 25, 10, EIO);
  const R = 170, circ = 2 * Math.PI * R;
  // months
  const months = Math.round(lerp(t, 18.9, 19.9, 12, 2, EIO));
  const coinsP = io(t, 23, 31.5, (x) => x);
  const stage = {position: 'absolute' as const, left: 640, top: 0, width: 1200, height: 750};
  return (
    <AbsoluteFill>
      <Card style={{left: CA.x, top: CA.y, width: 580, height: 750, opacity: enter, transform: `translateX(${(1 - enter) * -60}px)`}}>
        <div style={{position: 'relative', height: 300, overflow: 'hidden'}}>
          <Photo src={b.src} w={580} h={300} t={t} a={b.at} b={b.until} kb="in" />
        </div>
        <div style={{padding: '22px 26px'}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.ink, lineHeight: 1.1}}>EPFO केंद्रीय न्यासी बोर्ड</div>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 24, color: '#6B7390', marginBottom: 18}}>तीन बड़े फ़ैसलों को मंज़ूरी</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <Check n={1} text="न्यूनतम बैलेंस 25% → 10%" on={ph === 1 ? 1 : 0} done={ph > 1 ? 1 : 0} />
            <Check n={2} text="अंतिम निकासी: 2 महीने में" on={ph === 2 ? 1 : 0} done={ph > 2 ? 1 : 0} />
            <Check n={3} text="रिटायरमेंट बचत पर SWP" on={ph === 3 ? 1 : 0} done={0} />
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h}}>
        {/* A: intro */}
        <div style={{...stage, opacity: A, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 60}}>
          <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 48, color: C.yellow}}>नौकरीपेशा लोगों के लिए</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 130, color: '#fff', lineHeight: 1.0}}>PF के नियमों<br />में बदलाव</div>
          <div style={{position: 'absolute', left: 760, top: 470}}><Stamp t={t} at={4.6} text="मंज़ूरी" size={84} rot={-8} color={C.greenDeep} style={{whiteSpace: 'nowrap'}} /></div>
        </div>
        {/* B: donut */}
        <div style={{...stage, opacity: B, display: 'flex', alignItems: 'center', gap: 60, paddingLeft: 60}}>
          <svg width={440} height={440} viewBox="-220 -220 440 440">
            <circle r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={60} />
            <circle r={R} fill="none" stroke={pct > 15 ? C.saffron : C.green} strokeWidth={60} strokeDasharray={`${(pct / 100) * circ} ${circ}`} transform="rotate(-90)" strokeLinecap="butt" />
            <text y={30} textAnchor="middle" fontFamily={F.num} fontWeight={700} fontSize={130} fill="#fff">{Math.round(pct)}%</text>
            <text y={84} textAnchor="middle" fontFamily={F.body} fontWeight={700} fontSize={28} fill={C.grey}>न्यूनतम बैलेंस</text>
          </svg>
          <div style={{width: 640}}>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 64, color: '#fff', lineHeight: 1.1}}>PF खाते में रखना<br />ज़रूरी न्यूनतम बैलेंस</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 36}}>
              <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 120, color: C.grey, lineHeight: 1, position: 'relative'}}>25%<div style={{position: 'absolute', left: -6, right: -6, top: '48%', height: 10, background: C.red, transform: `scaleX(${io(t, 11.3, 11.7)})`, transformOrigin: 'left'}} /></div>
              <svg width="90" height="50" viewBox="0 0 90 50"><path d="M0 25 H70 M55 8 L78 25 L55 42" fill="none" stroke={C.yellow} strokeWidth="8" /></svg>
              <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 150, color: C.green, lineHeight: 1, transform: `scale(${pop(t, 11.6)})`}}>10%</div>
            </div>
          </div>
        </div>
        {/* C: months */}
        <div style={{...stage, opacity: Cc, paddingLeft: 60, paddingTop: 60}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 64, color: '#fff', lineHeight: 1.1}}>अंतिम निकासी की प्रतीक्षा अवधि</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 150px)', gap: 18, marginTop: 40}}>
            {new Array(12).fill(0).map((_, i) => {
              const keep = i < 2;
              const gone = keep ? 0 : io(t, 18.9 + (11 - i) * 0.07, 19.3 + (11 - i) * 0.07, EIN);
              return (
                <div key={i} style={{height: 130, borderRadius: 14, background: keep ? '#fff' : 'rgba(255,255,255,0.9)', opacity: 1 - gone * 0.85, transform: `scale(${1 - gone * 0.25}) rotate(${gone * (i % 2 ? 8 : -8)}deg)`, overflow: 'hidden', boxShadow: keep && t > 19.5 ? `0 0 0 6px ${C.green}, 0 14px 30px rgba(0,0,0,0.4)` : '0 10px 20px rgba(0,0,0,0.3)'}}>
                  <div style={{height: 34, background: keep ? C.green : C.red}} />
                  <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 64, color: C.ink, textAlign: 'center', lineHeight: '96px'}}>{i + 1}</div>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', right: 60, top: 230, textAlign: 'center'}}>
            <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 230, lineHeight: 0.9, color: months <= 2 ? C.green : '#fff'}}>{months}</div>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 56, color: C.yellow}}>महीने</div>
          </div>
        </div>
        {/* D: SWP */}
        <div style={{...stage, opacity: D, paddingLeft: 60, paddingTop: 50}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 60, color: '#fff', lineHeight: 1.1}}>रिटायरमेंट की बचत: एकमुश्त नहीं,<br /><span style={{color: C.yellow}}>समय-समय पर भुगतान</span></div>
          <div style={{display: 'flex', gap: 40, marginTop: 40}}>
            <div style={{width: 420, height: 330, borderRadius: 18, background: 'rgba(255,255,255,0.07)', border: '2px dashed rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 1 - io(t, 27.6, 28.2) * 0.55}}>
              <div style={{width: 130, height: 130, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #FFE58A, ${C.gold} 60%, #C98A12)`, border: '6px solid #B57A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.num, fontWeight: 700, fontSize: 80, color: '#7A4E00', marginBottom: 14, paddingTop: 8}}>₹</div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 46, color: '#fff'}}>एकमुश्त निकासी</div>
            </div>
            <div style={{flex: 1, height: 330, borderRadius: 18, background: '#fff', position: 'relative', overflow: 'hidden', padding: '24px 30px'}}>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.ink}}>सिस्टमैटिक विड्रॉल प्लान</div>
              <div style={{position: 'absolute', left: 30, right: 30, bottom: 40, height: 170, display: 'flex', alignItems: 'flex-end', gap: 22}}>
                {new Array(8).fill(0).map((_, i) => {
                  const p = io(coinsP, i / 9, i / 9 + 0.12);
                  return (
                    <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
                      <div style={{width: 46, height: 46, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, #FFE58A, ${C.gold} 60%, #C98A12)`, border: '3px solid #B57A0A', transform: `translateY(${(1 - p) * -120}px)`, opacity: p, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.num, fontWeight: 700, fontSize: 28, color: '#7A4E00'}}>₹</div>
                      <div style={{fontFamily: F.num, fontSize: 22, color: '#8A90A8'}}>{['जन.', 'फ़र.', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अग.'][i]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 520, bottom: 30, transform: `scale(${pop(t, 28.0)})`, background: C.green, color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 46, padding: '12px 30px 4px', borderRadius: 10, boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}>SWP को भी मंज़ूरी ✓</div>
        </div>
      </div>
      <div style={{position: 'absolute', right: 60, top: 908, fontFamily: F.body, fontWeight: 500, fontSize: 20, color: 'rgba(255,255,255,0.65)', opacity: enter}}>स्रोत: PIB (सरकारी विज्ञप्ति) • EPFO CBT की 240वीं बैठक</div>
      <Sfx at={4.6} src="sfx_impact_boom" vol={0.15} dur={1.5} />
      <Sfx at={8.6} src="sfx_whoosh_3" vol={0.22} dur={0.8} />
      <Sfx at={11.4} src="sfx_tick" vol={0.25} dur={0.4} />
      <Sfx at={15.4} src="sfx_whoosh_3" vol={0.22} dur={0.8} />
      <Sfx at={19.0} src="sfx_tick" vol={0.25} dur={0.4} />
      <Sfx at={21.0} src="sfx_whoosh_3" vol={0.22} dur={0.8} />
      <Sfx at={28.0} src="sfx_pop" vol={0.25} dur={0.5} />
    </AbsoluteFill>
  );
};

export const Vaccine: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 0.5);
  const fill = io(t, b.at + 0.3, b.at + 2.0, EIO);
  const shield = pop(t, 21.4);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, background: 'radial-gradient(circle at 30% 50%, rgba(80,170,255,0.22), rgba(6,15,41,0.85) 60%)', border: '2px solid rgba(255,255,255,0.15)', opacity: enter}} />
      {/* viruses drifting */}
      {new Array(7).fill(0).map((_, i) => {
        const x = 120 + ((i * 263) % 700) + Math.sin(t * 0.8 + i) * 30;
        const y = 240 + ((i * 197) % 600) + Math.cos(t * 0.7 + i) * 30;
        const bounce = io(t, 21.4, 22.2) * (i % 2 ? 1 : -1) * 60;
        return (
          <svg key={i} width="90" height="90" viewBox="-45 -45 90 90" style={{position: 'absolute', left: x + bounce, top: y, opacity: enter * (0.65 - io(t, 22, 23) * 0.35), transform: `rotate(${t * 30 + i * 40}deg)`}}>
            {new Array(10).fill(0).map((_, k) => <line key={k} x1="0" y1="0" x2={Math.cos((k * Math.PI) / 5) * 38} y2={Math.sin((k * Math.PI) / 5) * 38} stroke="#FF6B6B" strokeWidth="4" />)}
            <circle r="24" fill="#E0141E" stroke="#FF9A9A" strokeWidth="4" />
          </svg>
        );
      })}
      {/* shield */}
      <svg width={560} height={620} viewBox="-280 -300 560 620" style={{position: 'absolute', left: 210, top: 250, opacity: Math.min(1, shield), transform: `scale(${shield})`}}>
        <path d="M0 -280 L240 -190 V20 C240 170 120 260 0 300 C-120 260 -240 170 -240 20 V-190 Z" fill="rgba(22,199,106,0.18)" stroke={C.green} strokeWidth={10} />
      </svg>
      {/* vial */}
      <div style={{position: 'absolute', left: 360, top: 300, width: 260, height: 520, transform: `rotate(${-8 + Math.sin(t) * 2}deg) scale(${pop(t, b.at)})`}}>
        <div style={{position: 'absolute', left: 70, top: 0, width: 120, height: 70, background: `linear-gradient(90deg, #8a96b8, #dfe6f7, #8a96b8)`, borderRadius: 10}} />
        <div style={{position: 'absolute', left: 60, top: 60, width: 140, height: 30, background: '#5D6C93', borderRadius: 6}} />
        <div style={{position: 'absolute', left: 20, top: 88, width: 220, height: 420, borderRadius: '30px 30px 40px 40px', background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.3))', border: '4px solid rgba(255,255,255,0.7)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${70 * fill}%`, background: 'linear-gradient(180deg, #6FD3FF, #1E8BFF)'}}>
            <div style={{position: 'absolute', top: -10, left: 0, right: 0, height: 20, borderRadius: '50%', background: '#9BE3FF'}} />
          </div>
          <div style={{position: 'absolute', left: 14, right: 14, top: 120, height: 170, background: '#fff', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(0,0,0,0.25)'}}>
            <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 62, color: C.red, lineHeight: 1}}>H5N1</div>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 30, color: C.ink}}>पोल्ट्री वैक्सीन</div>
            <div style={{display: 'flex', gap: 3, marginTop: 6}}>{['#FF9933', '#fff', '#138808'].map((c) => <div key={c} style={{width: 40, height: 8, background: c, border: '1px solid #ddd'}} />)}</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 900, top: 250, width: 950}}>
        <div style={{opacity: io(t, b.at + 0.2, b.at + 0.7)}}>
          <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 42, color: C.yellow}}>बर्ड फ्लू से बचाव</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 100, color: '#fff', lineHeight: 1}}>स्वदेशी वैक्सीन</div>
        </div>
        <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24}}>
          {[
            {at: 15.9, k: 'किसने विकसित की', v: 'ICAR-राष्ट्रीय उच्च सुरक्षा पशुरोग संस्थान, भोपाल'},
            {at: 21.6, k: 'किसके खिलाफ', v: 'H5N1 वायरस का एक विशेष प्रकार'},
          ].map((r, i) => {
            const p = io(t, r.at, r.at + 0.45);
            return (
              <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * 60}px)`, background: '#fff', borderRadius: 14, padding: '18px 28px 12px', borderLeft: `12px solid ${i ? C.red : C.navy}`, boxShadow: '0 16px 30px rgba(0,0,0,0.4)'}}>
                <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 28, color: '#6B7390'}}>{r.k}</div>
                <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 52, color: C.ink, lineHeight: 1.12}}>{r.v}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Sfx at={15.9} src="sfx_pop" vol={0.2} dur={0.5} />
      <Sfx at={21.5} src="sfx_whoosh_3" vol={0.25} dur={0.8} />
    </AbsoluteFill>
  );
};

export const Price: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const pi = io(t, b.at - 0.1, b.at + 0.5);
  const tag = pop(t, 27.6, 30, 8, 120);
  const swing = Math.sin((t - 27.6) * 4) * 10 * Math.exp(-Math.max(0, t - 27.6) * 0.8);
  const fp = io(t, 32.0, 32.5);
  return (
    <>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', border: '3px solid rgba(255,255,255,0.85)', opacity: pi}}>
        <Photo src={b.src} w={CA.w} h={CA.h} t={t} a={b.at} b={b.until} kb="left" creditStyle={{left: 16, right: 'auto'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(6,15,41,0.1), rgba(6,15,41,0.8) 70%)'}} />
      </div>
      <div style={{position: 'absolute', left: 1180, top: 210, width: 620, opacity: io(t, b.at + 0.2, b.at + 0.6)}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 46, color: C.yellow}}>सरकारी जानकारी के अनुसार कीमत</div>
      </div>
      <div style={{position: 'absolute', left: 1220, top: 290, transformOrigin: '50% 0', transform: `rotate(${swing}deg) scale(${Math.min(1.1, tag)})`, opacity: Math.min(1, tag * 2)}}>
        <svg width="560" height="360" viewBox="0 0 560 360">
          <path d="M120 40 H520 a20 20 0 0 1 20 20 V300 a20 20 0 0 1 -20 20 H120 L20 180 Z" fill={C.yellow} stroke="#fff" strokeWidth="8" />
          <circle cx="110" cy="180" r="22" fill="#fff" />
          <text x="330" y="190" textAnchor="middle" fontFamily={F.num} fontWeight={700} fontSize="150" fill={C.ink}>₹1–2</text>
          <text x="330" y="270" textAnchor="middle" fontFamily={F.head} fontWeight={700} fontSize="52" fill={C.redDeep}>प्रति डोज़</text>
        </svg>
      </div>
      <div style={{position: 'absolute', left: 1120, top: 700, width: 720, opacity: fp, transform: `translateY(${(1 - fp) * 40}px)`, background: C.navy, border: `3px solid ${C.green}`, borderRadius: 16, padding: '20px 30px 12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 46, color: '#fff', lineHeight: 1.15}}>पोल्ट्री किसानों को बीमारी से होने वाले आर्थिक नुकसान से राहत की उम्मीद</div>
      </div>
      <Sfx at={27.6} src="sfx_pop" vol={0.3} dur={0.5} />
      <Sfx at={32.0} src="sfx_whoosh_3" vol={0.2} dur={0.8} />
    </>
  );
};

export const Warning: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const p = io(t, b.at - 0.1, b.at + 0.4);
  const x2 = pop(t, 40.7, 30, 9, 160);
  const stripes = `repeating-linear-gradient(-45deg, ${C.yellow} 0 40px, #111 40px 80px)`;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, background: stripes, backgroundPosition: `${t * 40}px 0`, opacity: p, padding: 26}}>
        <div style={{width: '100%', height: '100%', background: '#fff', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pop(t, b.at)})`}}>
            <svg width="90" height="80" viewBox="0 0 90 80"><path d="M45 4 L86 76 H4 Z" fill={C.yellow} stroke="#111" strokeWidth="6" strokeLinejoin="round" /><rect x="41" y="26" width="8" height="28" fill="#111" /><rect x="41" y="60" width="8" height="8" fill="#111" /></svg>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 90, color: C.ink}}>ध्यान दें</div>
          </div>
          <div style={{display: 'flex', gap: 80, marginTop: 50}}>
            <div style={{width: 640, borderRadius: 24, background: '#EAF9F0', border: `5px solid ${C.green}`, padding: '30px 20px 20px', textAlign: 'center', transform: `scale(${pop(t, b.at + 0.4)})`}}>
              <div style={{fontSize: 150, lineHeight: 1}}>🐔</div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 64, color: C.greenDeep}}>✓ मुर्गियों के लिए</div>
            </div>
            <div style={{width: 640, borderRadius: 24, background: '#FDECEC', border: `5px solid ${C.red}`, padding: '30px 20px 20px', textAlign: 'center', position: 'relative', transform: `scale(${pop(t, 40.4)})`}}>
              <svg width="150" height="150" viewBox="0 0 100 100"><circle cx="50" cy="28" r="18" fill="#5A6480" /><path d="M18 96 C18 64 32 52 50 52 C68 52 82 64 82 96 Z" fill="#5A6480" /></svg>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 64, color: C.redDeep}}>✗ इंसानों के लिए नहीं</div>
              <svg width="150" height="150" viewBox="0 0 220 220" style={{position: 'absolute', left: 245, top: 30, transform: `scale(${x2})`, opacity: Math.min(1, x2)}}><path d="M30 30 L190 190 M190 30 L30 190" stroke={C.red} strokeWidth="26" strokeLinecap="round" /></svg>
            </div>
          </div>
        </div>
      </div>
      <Sfx at={40.7} src="sfx_impact_boom" vol={0.18} dur={1.5} />
    </AbsoluteFill>
  );
};
export {Img, img, credit, CreditChip, MarkerTitle, EOUT};

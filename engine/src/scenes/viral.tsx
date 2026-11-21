import React, {useContext} from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import {C, F} from '../theme';
import {EIN, EIO, EOUT, io, LeadCtx, lerp, pop, rnd} from '../lib/anim';
import {Beat} from '../content';
import {bgImg, CA, img, Photo, Sfx} from '../components/ui';
import {Stamp} from '../components/layouts';

const PINK = '#FF2E7E';
const PURPLE = '#7B2FF7';

/** Plays a muted clip starting at story time `at`. */
export const Clip: React.FC<{src: string; at: number; style?: React.CSSProperties; trimBefore?: number; rate?: number; loop?: boolean; dur?: number}> = ({src, at, style, trimBefore, rate = 1, loop, dur}) => {
  const lead = useContext(LeadCtx);
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.round((at + lead) * fps)} durationInFrames={dur ? Math.round(dur * fps) : undefined} layout="none">
      <Video src={staticFile(src)} muted loop={loop} playbackRate={rate} trimBefore={trimBefore ? Math.round(trimBefore * fps) : undefined} objectFit="cover" style={{width: '100%', height: '100%', ...style}} />
    </Sequence>
  );
};

const Emoji: React.FC<{t: number; at: number; e: string; x: number; size?: number; seed?: number}> = ({t, at, e, x, size = 90, seed = 1}) => {
  if (t < at) return null;
  const u = (t - at) / 2.6;
  if (u > 1) return null;
  return <div style={{position: 'absolute', left: x + Math.sin(u * 8 + seed) * 30, top: 950 - u * 800, fontSize: size, opacity: u < 0.1 ? u * 10 : 1 - Math.max(0, (u - 0.7) / 0.3), transform: `scale(${pop(t, at, 30, 10, 180)}) rotate(${Math.sin(u * 6 + seed) * 15}deg)`}}>{e}</div>;
};

const VBadge: React.FC<{t: number; at: number; style?: React.CSSProperties}> = ({t, at, style}) => (
  <div style={{position: 'absolute', display: 'flex', alignItems: 'center', gap: 10, background: `linear-gradient(90deg, ${PINK}, ${PURPLE})`, color: '#fff', fontFamily: F.num, fontWeight: 700, fontSize: 40, padding: '6px 20px 0', borderRadius: 999, transform: `scale(${pop(t, at)})`, boxShadow: '0 10px 24px rgba(255,46,126,0.45)', ...style}}>🔥 VIRAL</div>
);

export const ViralIntro: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at, b.at + 0.5);
  const v = pop(t, 0.6, 30, 9, 140);
  const thumbs = [
    {src: 's11_notes/viral_frame_burning_720x1280.jpg', x: 1180, rot: -8, at: 3.6},
    {src: 's12_bulls/viral_frame_bull_on_car_720x1280.jpg', x: 1510, rot: 7, at: 3.9},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, background: `radial-gradient(circle at 25% 40%, ${PURPLE}AA, #12052E 70%)`, border: `3px solid ${PINK}`}}>
        {new Array(14).fill(0).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: rnd(i) * CA.w, top: ((rnd(i + 9) * CA.h - t * 40 * (0.5 + rnd(i + 3))) % CA.h + CA.h) % CA.h, fontSize: 30 + rnd(i + 5) * 30, opacity: 0.25}}>{['❤️', '💬', '↗️', '👍', '😂'][i % 5]}</div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 110, top: 250}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 56, color: '#fff', opacity: io(t, 0, 0.4)}}>चलते हैं</div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 120, color: '#fff', lineHeight: 1, opacity: io(t, 1.2, 1.6), transform: `translateY(${(1 - io(t, 1.2, 1.6)) * 30}px)`}}>सोशल मीडिया</div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 80, color: C.yellow, lineHeight: 1.1, opacity: io(t, 2.1, 2.5)}}>की दुनिया में</div>
        <div style={{display: 'flex', gap: 22, marginTop: 40}}>
          <div style={{background: '#fff', borderRadius: 18, padding: '14px 26px 6px', fontFamily: F.head, fontWeight: 700, fontSize: 48, color: C.ink, transform: `scale(${pop(t, 4.7)})`, boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}>कुछ पर हंसी 😂</div>
          <div style={{background: C.yellow, borderRadius: 18, padding: '14px 26px 6px', fontFamily: F.head, fontWeight: 700, fontSize: 48, color: C.ink, transform: `scale(${pop(t, 7.2)})`, boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}>ये आइडिया आया कहां से? 🤯</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 110, top: 200, transform: `scale(${v})`, transformOrigin: 'left center'}} />
      {thumbs.map((th, i) => {
        const p = pop(t, th.at, 30, 12, 120);
        return (
          <div key={i} style={{position: 'absolute', left: th.x, top: 260 + Math.sin(t * 1.5 + i) * 8, width: 290, height: 516, borderRadius: 26, overflow: 'hidden', border: '8px solid #111', boxShadow: '0 0 0 3px rgba(255,255,255,0.6), 0 30px 60px rgba(0,0,0,0.6)', transform: `rotate(${th.rot}deg) scale(${p})`, opacity: Math.min(1, p * 2)}}>
            <Img src={img(th.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'}} />
            <div style={{position: 'absolute', right: 12, bottom: 18, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 34}}>❤️<span>💬</span><span>↗️</span></div>
          </div>
        );
      })}
      <VBadge t={t} at={0.6} style={{left: 1290, top: 205}} />
      <Emoji t={t} at={4.8} e="😂" x={760} />
      <Emoji t={t} at={5.1} e="🤣" x={900} size={70} seed={3} />
      <Emoji t={t} at={7.3} e="🤯" x={1050} seed={5} />
      <Sfx at={0.6} src="sfx_pop" vol={0.3} dur={0.5} />
      <Sfx at={4.7} src="sfx_pop" vol={0.25} dur={0.5} />
      <Sfx at={7.2} src="sfx_pop" vol={0.25} dur={0.5} />
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{t: number; at: number; text: string; side: 'left' | 'right'; style?: React.CSSProperties}> = ({t, at, text, side, style}) => {
  const p = pop(t, at, 30, 12, 170);
  return (
    <div style={{position: 'absolute', maxWidth: 640, background: side === 'left' ? '#fff' : C.yellow, color: C.ink, fontFamily: F.head, fontWeight: 700, fontSize: 44, lineHeight: 1.15, padding: '20px 30px 12px', borderRadius: side === 'left' ? '28px 28px 28px 6px' : '28px 28px 6px 28px', boxShadow: '0 18px 40px rgba(0,0,0,0.45)', transform: `scale(${p})`, transformOrigin: side === 'left' ? 'left bottom' : 'right bottom', opacity: Math.min(1, p * 2), ...style}}>{text}</div>
  );
};

const PhoneFrame: React.FC<{x: number; y: number; w: number; h: number; rot?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, rot = 0, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: w * 0.11, background: '#0A0A0A', padding: w * 0.03, boxShadow: '0 0 0 3px #3A3A40, 0 40px 80px rgba(0,0,0,0.65)', transform: `rotate(${rot}deg)`, ...style}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.085, overflow: 'hidden', background: '#000'}}>
      {children}
      <div style={{position: 'absolute', left: '50%', top: w * 0.03, width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, borderRadius: 99, background: '#000'}} />
    </div>
  </div>
);

export const Phone: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = pop(t, b.at, 30, 14, 120);
  const cs = b.callouts as {at: number; text: string; style: string}[];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: io(t, b.at - 0.1, b.at + 0.4), border: `3px solid ${PINK}`}}>
        <Img src={bgImg('s11_notes/viral_frame_burning_720x1280.jpg')} style={{position: 'absolute', inset: -40, width: CA.w + 80, height: CA.h + 80, objectFit: 'cover', filter: 'brightness(0.45) saturate(1.3)'}} />
        <AbsoluteFill style={{background: `linear-gradient(90deg, ${PURPLE}66, transparent 40%, transparent 60%, ${PINK}55)`}} />
      </div>
      <PhoneFrame x={778} y={205} w={364} h={720} rot={lerp(t, b.at, b.at + 1, -6, 0)} style={{transform: `rotate(${lerp(t, b.at, b.at + 1, -6, 0)}deg) scale(${enter})`}}>
        <Clip src={b.video} at={b.at} loop />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))'}} />
        <div style={{position: 'absolute', right: 14, bottom: 90, display: 'flex', flexDirection: 'column', gap: 18, fontSize: 40, alignItems: 'center'}}>
          <span style={{transform: `scale(${1 + 0.25 * Math.max(0, Math.sin(t * 4))})`}}>❤️</span><span>💬</span><span>↗️</span>
        </div>
        <div style={{position: 'absolute', left: 18, bottom: 28, fontFamily: F.body, fontWeight: 700, fontSize: 22, color: '#fff'}}>वीडियो: {b.credit}</div>
        <div style={{position: 'absolute', left: 16, top: 50, background: 'rgba(0,0,0,0.55)', color: '#fff', fontFamily: F.body, fontWeight: 700, fontSize: 18, padding: '4px 10px', borderRadius: 6}}>सोशल मीडिया से</div>
      </PhoneFrame>
      <VBadge t={t} at={b.at + 0.3} style={{left: 1000, top: 150}} />
      {/* left info card */}
      <div style={{position: 'absolute', left: 90, top: 250, width: 600}}>
        {cs.filter((c) => c.style === 'tag').map((c, i) => {
          const p = io(t, c.at, c.at + 0.4);
          const out = i === 0 ? 1 - io(t, 37.8, 38.3) : 1;
          return (
            <div key={i} style={{position: 'absolute', top: 0, opacity: p * out, transform: `translateX(${(1 - p) * -50}px)`}}>
              <div style={{display: 'inline-block', background: i ? C.red : C.yellow, color: i ? '#fff' : C.ink, fontFamily: F.head, fontWeight: 700, fontSize: 40, padding: '8px 20px 0', borderRadius: 8}}>{c.text}</div>
              {i === 0 && <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 68, color: '#fff', lineHeight: 1.08, marginTop: 14, textShadow: '0 6px 20px rgba(0,0,0,0.6)', opacity: io(t, 11.2, 11.7)}}>नोटों जैसे बंडल जलाता दिखा एक शख्स 🔥</div>}
              {i === 1 && <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 36, color: '#fff', marginTop: 14, lineHeight: 1.3}}>नोट असली हैं या नकली, इसकी पुष्टि नहीं हुई है</div>}
            </div>
          );
        })}
      </div>
      {cs.filter((c) => c.style === 'bubble').map((c, i) => (
        <Bubble key={i} t={t} at={c.at} text={c.text} side={i ? 'right' : 'left'} style={i ? {left: 1210, top: 560} : {left: 1210, top: 260}} />
      ))}
      {cs.filter((c) => c.style === 'stamp').map((c, i) => (
        <div key={i} style={{position: 'absolute', left: 700, top: 500, opacity: 1 - io(t, 37.8, 38.3)}}>
          <Stamp t={t} at={c.at} text={c.text} size={40} rot={-10} style={{whiteSpace: 'nowrap', transformOrigin: 'left center'}} />
        </div>
      ))}
      <Emoji t={t} at={21.6} e="💨" x={1300} size={80} />
      <Emoji t={t} at={22.4} e="💸" x={1450} size={80} seed={2} />
      <Emoji t={t} at={16.6} e="🤔" x={300} size={70} seed={4} />
      {cs.map((c, i) => <Sfx key={i} at={c.at} src={c.style === 'stamp' ? 'sfx_impact_boom' : 'sfx_pop'} vol={c.style === 'stamp' ? 0.18 : 0.22} dur={c.style === 'stamp' ? 1.5 : 0.5} />)}
    </AbsoluteFill>
  );
};

export const Cctv: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at, b.at + 0.4);
  const replay = t >= 8.3;
  const ts = (s: number) => `▶ 00:${String(Math.floor(Math.max(0, s))).padStart(2, '0')}.${String(Math.floor((Math.max(0, s) % 1) * 10))}`;
  const clipT = replay ? 5.5 + (t - 8.3) * 0.5 : t + 0.5;
  const notes = [
    {at: 2.5, text: 'दो सांडों की लड़ाई'},
    {at: 4.6, text: 'खड़ी लाल कार तक पहुंचे'},
    {at: 7.2, text: 'कार के ऊपर चढ़ा सांड'},
    {at: 10.5, text: 'बचने के लिए हटे लोग'},
  ];
  const flash = 1 - io(t, 8.3, 8.6);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', background: '#05070C', opacity: enter, border: '3px solid rgba(255,255,255,0.85)'}}>
        <Img src={bgImg('s12_bulls/viral_frame_bull_on_car_720x1280.jpg')} style={{position: 'absolute', inset: -40, width: CA.w + 80, height: CA.h + 80, objectFit: 'cover', filter: 'brightness(0.35) grayscale(0.4)'}} />
      </div>
      {/* monitor */}
      <div style={{position: 'absolute', left: 1180, top: CA.y, width: 422, height: 750, overflow: 'hidden', borderLeft: '3px solid #222', borderRight: '3px solid #222', opacity: enter}}>
        {!replay && <Clip src={b.video} at={b.at} dur={8.8} />}
        {replay && (
          <div style={{position: 'absolute', inset: 0, transform: `scale(${lerp(t, 8.3, 9.5, 1, 1.6, EIO)})`, transformOrigin: '50% 25%'}}>
            <Clip src={b.video} at={8.3} trimBefore={5.5} rate={0.5} dur={5.2} />
          </div>
        )}
        <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 4px)', mixBlendMode: 'multiply'}} />
        <AbsoluteFill style={{boxShadow: 'inset 0 0 120px rgba(0,0,0,0.75)'}} />
        <div style={{position: 'absolute', left: 16, top: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.num, fontSize: 30, color: '#fff'}}>
          <div style={{width: 18, height: 18, borderRadius: '50%', background: '#FF2020', opacity: Math.floor(t * 2) % 2 ? 1 : 0.2}} /> {replay ? 'REPLAY ⟲' : 'REC'}
        </div>
        <div style={{position: 'absolute', right: 16, top: 16, fontFamily: F.num, fontSize: 30, color: '#fff'}}>{replay ? '0.5×' : 'CAM 02'}</div>
        <div style={{position: 'absolute', left: 16, bottom: 14, fontFamily: F.num, fontSize: 26, color: '#fff', textShadow: '0 0 6px #000'}}>{ts(clipT)}</div>
        {replay && (
          <svg width={422} height={750} style={{position: 'absolute', inset: 0}}>
            <ellipse cx={211} cy={235} rx={150 + Math.sin(t * 6) * 6} ry={115 + Math.sin(t * 6) * 5} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray={`${io(t, 8.8, 9.6) * 900} 900`} />
          </svg>
        )}
        <AbsoluteFill style={{background: '#fff', opacity: replay ? flash * 0.8 : 0}} />
      </div>
      <div style={{position: 'absolute', left: 1180, top: 950 - 4, width: 422, fontFamily: F.body, fontWeight: 700, fontSize: 0}} />
      {/* left notes */}
      <div style={{position: 'absolute', left: 100, top: 230, width: 1000}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: io(t, b.at + 0.2, b.at + 0.6)}}>
          <div style={{background: '#FF2020', color: '#fff', fontFamily: F.num, fontWeight: 700, fontSize: 40, padding: '4px 18px 0', borderRadius: 6}}>● CCTV</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 44, color: '#fff'}}>कैमरे में कैद हुई घटना</div>
        </div>
        <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 20}}>
          {notes.map((n, i) => {
            const p = io(t, n.at, n.at + 0.4);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
                <div style={{width: 64, height: 64, borderRadius: 12, background: i === 2 ? C.yellow : '#fff', fontFamily: F.num, fontWeight: 700, fontSize: 40, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6}}>{i + 1}</div>
                <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 60, color: '#fff', textShadow: '0 6px 20px rgba(0,0,0,0.7)'}}>{n.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 1622, top: 230, width: 240, opacity: io(t, 8.5, 9.0)}}>
        <div style={{background: C.yellow, color: C.ink, fontFamily: F.head, fontWeight: 700, fontSize: 40, padding: '10px 16px 2px', borderRadius: 10, textAlign: 'center'}}>फिर से देखिए</div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 34, color: '#fff', marginTop: 12, lineHeight: 1.15}}>स्लो मोशन में ⟲</div>
      </div>
      <div style={{position: 'absolute', left: 1622, top: 860, width: 260, fontFamily: F.body, fontWeight: 700, fontSize: 20, color: 'rgba(255,255,255,0.75)', opacity: enter}}>वीडियो: {b.credit}</div>
      <Sfx at={8.3} src="sfx_glitch" vol={0.25} dur={0.6} />
      <Sfx at={7.2} src="sfx_impact_boom" vol={0.15} dur={1.5} />
    </AbsoluteFill>
  );
};

export const Round2: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 0.4);
  const rnd2 = pop(t, 21.1, 30, 8, 160);
  const shake = t > 21.1 && t < 21.6 ? Math.sin(t * 100) * 10 * (1 - (t - 21.1) / 0.5) : 0;
  const safe = io(t, 17.3, 17.8);
  const x = io(t, 19.1, 19.4);
  return (
    <AbsoluteFill style={{transform: `translate(${shake}px, ${shake * 0.5}px)`}}>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, border: `3px solid ${C.yellow}`}}>
        <Photo src={b.src} w={CA.w} h={CA.h} t={t} a={b.at} b={b.until} kb="in" filter={`saturate(1.2) brightness(${0.8 - io(t, 20.8, 21.1) * 0.3})`} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65))'}} />
        {/* ropes */}
        {[90, 140, 190].map((y, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, bottom: y, height: 8, background: i === 1 ? '#fff' : C.red, opacity: io(t, 20.2, 20.7) * 0.85, boxShadow: '0 4px 10px rgba(0,0,0,0.5)'}} />)}
      </div>
      {/* parking sign */}
      <div style={{position: 'absolute', left: 90, top: 240, opacity: safe * (1 - io(t, 20.6, 21.0)), transform: `scale(${pop(t, 17.3)})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 16, padding: '14px 24px 8px', boxShadow: '0 18px 40px rgba(0,0,0,0.5)', position: 'relative'}}>
          <div style={{width: 80, height: 80, borderRadius: 12, background: '#1565D8', color: '#fff', fontFamily: F.num, fontWeight: 700, fontSize: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 8}}>P</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 54, color: C.ink}}>यहां गाड़ी सुरक्षित रहेगी 😌</div>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0}}><line x1="2" y1="90" x2={2 + 96 * x} y2={90 - 80 * x} stroke={C.red} strokeWidth="3" vectorEffect="non-scaling-stroke" style={{strokeWidth: 10}} /></svg>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: io(t, 19.8, 20.2)}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 74, color: '#fff', textShadow: '0 6px 24px rgba(0,0,0,0.9)'}}>मोहल्ले की कुश्ती</div>
        <div style={{marginTop: 10, transform: `scale(${rnd2}) rotate(-4deg)`, opacity: Math.min(1, rnd2 * 2), fontFamily: F.head, fontWeight: 700, fontSize: 190, lineHeight: 1.05, paddingTop: 20, color: C.yellow, WebkitTextStroke: `4px ${C.redDeep}`, textShadow: '0 12px 0 #7A0A0F, 0 30px 60px rgba(0,0,0,0.7)'}}>राउंड 2</div>
      </div>
      <div style={{position: 'absolute', left: 90, bottom: 160, display: 'flex', gap: 14, opacity: io(t, 21.4, 21.8)}}>
        <div style={{background: '#fff', borderRadius: 10, padding: '8px 20px 2px', fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.ink}}>🐂 सांड 1</div>
        <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 50, color: C.yellow}}>VS</div>
        <div style={{background: '#fff', borderRadius: 10, padding: '8px 20px 2px', fontFamily: F.head, fontWeight: 700, fontSize: 40, color: C.ink}}>🐂 सांड 2</div>
        <div style={{fontFamily: F.num, fontWeight: 700, fontSize: 50, color: C.yellow}}>VS</div>
        <div style={{background: C.red, borderRadius: 10, padding: '8px 20px 2px', fontFamily: F.head, fontWeight: 700, fontSize: 40, color: '#fff'}}>🚗 बेचारी कार</div>
      </div>
      <div style={{position: 'absolute', right: 70, bottom: 200, fontFamily: F.body, fontWeight: 700, fontSize: 20, color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: 6}}>सांकेतिक तस्वीर</div>
      <Sfx at={17.3} src="sfx_pop" vol={0.22} dur={0.5} />
      <Sfx at={19.1} src="sfx_glitch" vol={0.18} dur={0.5} />
      <Sfx at={21.1} src="sfx_impact_boom" vol={0.28} dur={1.5} />
    </AbsoluteFill>
  );
};

export const Chat: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at - 0.1, b.at + 0.4);
  const typing = (a: number, z: number) => t > a && t < z;
  const msgs = [
    {at: 27.3, side: 'left', text: 'जी, गाड़ी खड़ी थी तो नुकसान कैसे हुआ?', ty: 26.4},
    {at: 30.2, side: 'right', text: 'जी, ऊपर से सांड आ गया 🐂', ty: 29.5},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, background: `radial-gradient(circle at 70% 50%, ${PURPLE}88, #12052E 70%)`, border: `3px solid ${PINK}`}} />
      <div style={{position: 'absolute', left: 100, top: 280, width: 760, opacity: io(t, 23.2, 23.7)}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 60, color: '#fff', lineHeight: 1.1}}>अगर <span style={{background: '#FF2020', padding: '0 14px', borderRadius: 8}}>CCTV</span> ना होता तो...</div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 84, color: C.yellow, lineHeight: 1.1, marginTop: 20, opacity: io(t, 24.6, 25.1)}}>बीमा कंपनी को समझाना मुश्किल! 😅</div>
        <div style={{marginTop: 40, display: 'inline-block', fontFamily: F.body, fontWeight: 700, fontSize: 24, color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 8, opacity: io(t, 26, 26.5)}}>मज़ाकिया अंदाज़ में, सांकेतिक बातचीत</div>
      </div>
      <PhoneFrame x={1150} y={170} w={430} h={780} style={{transform: `translateY(${(1 - enter) * 100}px)`, opacity: enter}}>
        <div style={{position: 'absolute', inset: 0, background: '#ECE5DD'}}>
          <div style={{height: 140, background: '#075E54', display: 'flex', alignItems: 'flex-end', padding: '0 20px 14px', gap: 14}}>
            <div style={{width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30}}>🛡️</div>
            <div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 30, color: '#fff', lineHeight: 1}}>बीमा क्लेम डेस्क</div>
              <div style={{fontFamily: F.body, fontSize: 18, color: '#cfe9e5'}}>{typing(26.4, 27.3) ? 'टाइप कर रहे हैं...' : 'ऑनलाइन'}</div>
            </div>
          </div>
          <div style={{padding: 18, display: 'flex', flexDirection: 'column', gap: 14}}>
            <div style={{alignSelf: 'flex-end', background: '#DCF8C6', borderRadius: 14, padding: 8, width: 230, opacity: io(t, 23.0, 23.4), transform: `scale(${pop(t, 23.0)})`, transformOrigin: 'right top'}}>
              <div style={{height: 200, borderRadius: 10, overflow: 'hidden'}}><Img src={img(b.src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%'}} /></div>
              <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 20, color: '#333', padding: '6px 4px 0'}}>मेरी कार का क्लेम 🙏</div>
              <div style={{fontFamily: F.body, fontSize: 13, color: '#667'}}>वीडियो: X / @iNikhilsaini</div>
            </div>
            {msgs.map((m, i) => (
              <React.Fragment key={i}>
                {typing(m.ty, m.at) && (
                  <div style={{alignSelf: m.side === 'left' ? 'flex-start' : 'flex-end', background: m.side === 'left' ? '#fff' : '#DCF8C6', borderRadius: 14, padding: '12px 18px', display: 'flex', gap: 6}}>
                    {[0, 1, 2].map((k) => <div key={k} style={{width: 10, height: 10, borderRadius: '50%', background: '#999', transform: `translateY(${Math.sin(t * 12 - k) * 3}px)`}} />)}
                  </div>
                )}
                {t >= m.at && (
                  <div style={{alignSelf: m.side === 'left' ? 'flex-start' : 'flex-end', maxWidth: 330, background: m.side === 'left' ? '#fff' : '#DCF8C6', borderRadius: m.side === 'left' ? '4px 16px 16px 16px' : '16px 4px 16px 16px', padding: '10px 16px 6px', fontFamily: F.head, fontWeight: 700, fontSize: 32, lineHeight: 1.15, color: '#111', boxShadow: '0 2px 4px rgba(0,0,0,0.12)', transform: `scale(${pop(t, m.at, 30, 12, 200)})`, transformOrigin: m.side === 'left' ? 'left top' : 'right top'}}>{m.text}</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </PhoneFrame>
      <Emoji t={t} at={31.2} e="🤣" x={1640} size={80} />
      <Emoji t={t} at={31.5} e="😂" x={1740} size={70} seed={3} />
      <Sfx at={23.0} src="sfx_pop" vol={0.2} dur={0.5} />
      <Sfx at={27.3} src="sfx_pop" vol={0.25} dur={0.5} />
      <Sfx at={30.2} src="sfx_pop" vol={0.25} dur={0.5} />
    </AbsoluteFill>
  );
};

export const Wrap: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at, b.at + 0.5);
  const comment = 'बस, आज का इंटरनेट बहुत हुआ! 😂';
  const typed = Math.floor(io(t, 12.2, 13.6, (x) => x) * comment.length);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, background: `radial-gradient(circle at 50% 40%, ${PURPLE}AA, #12052E 70%)`, border: `3px solid ${PINK}`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontFamily: F.head, fontWeight: 700, fontSize: 60, color: '#fff', opacity: io(t, 0, 0.4)}}>तो ये था सोशल मीडिया का हाल</div>
      {[
        {src: 'vid/notes.mp4', x: 230, rot: -5, at: 2.2, label: 'कहीं नोटों जैसे बंडलों से धुआं 💨', k: 'A', cr: 'X / @AadyaTales'},
        {src: 'vid/bulls.mp4', x: 1390, rot: 5, at: 5.4, label: 'कहीं कार की शामत 🐂🚗', k: 'B', cr: 'X / @iNikhilsaini'},
      ].map((v, i) => {
        const p = pop(t, v.at, 30, 12, 130);
        const pick = 0;
        return (
          <React.Fragment key={i}>
            <PhoneFrame x={v.x} y={300} w={300} h={560} rot={v.rot} style={{transform: `rotate(${v.rot}deg) scale(${p})`, opacity: Math.min(1, p * 2)}}>
              <Clip src={v.src} at={v.at} loop />
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '20px 12px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', fontFamily: F.body, fontWeight: 700, fontSize: 16, color: '#fff'}}>वीडियो: {v.cr}</div>
            </PhoneFrame>
            <div style={{position: 'absolute', left: i ? 990 : 590, top: 330, width: 340, opacity: io(t, v.at + 0.3, v.at + 0.7), textAlign: i ? 'right' : 'left'}}>
              <div style={{display: 'inline-block', width: 80, height: 80, borderRadius: '50%', background: i ? C.yellow : '#fff', fontFamily: F.num, fontWeight: 700, fontSize: 56, color: C.ink, textAlign: 'center', lineHeight: '88px', boxShadow: pick ? `0 0 0 ${8 * pick}px ${C.green}` : 'none'}}>{v.k}</div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 52, color: '#fff', lineHeight: 1.1, marginTop: 10}}>{v.label}</div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: 560, top: 620, width: 800, textAlign: 'center', transform: `scale(${pop(t, 7.8)})`}}>
        <div style={{display: 'inline-block', background: C.yellow, color: C.ink, fontFamily: F.head, fontWeight: 700, fontSize: 50, padding: '12px 28px 4px', borderRadius: 14, boxShadow: '0 16px 30px rgba(0,0,0,0.45)'}}>आप A चुनेंगे या B? 🤔</div>
      </div>
      <div style={{position: 'absolute', left: 590, top: 760, width: 740, height: 120, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px', opacity: io(t, 11.9, 12.3), transform: `translateY(${(1 - io(t, 11.9, 12.3)) * 40}px)`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
        <div style={{width: 70, height: 70, borderRadius: '50%', background: `linear-gradient(135deg, ${PINK}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38}}>💬</div>
        <div style={{flex: 1, fontFamily: F.head, fontWeight: 700, fontSize: 38, color: typed ? C.ink : '#9AA0B4'}}>{typed ? comment.slice(0, typed) : 'कमेंट में बताइए...'}<span style={{opacity: Math.floor(t * 3) % 2}}>|</span></div>
        <div style={{background: '#1565D8', color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 34, padding: '10px 22px 2px', borderRadius: 999}}>कमेंट</div>
      </div>
      <Sfx at={2.2} src="sfx_whoosh_2" vol={0.18} dur={0.8} />
      <Sfx at={5.4} src="sfx_whoosh_2" vol={0.18} dur={0.8} />
      <Sfx at={7.8} src="sfx_pop" vol={0.25} dur={0.5} />
    </AbsoluteFill>
  );
};
export {EIN, EOUT};

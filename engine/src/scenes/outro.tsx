import React from 'react';
import {AbsoluteFill, Img} from 'remotion';
import {C, F} from '../theme';
import {EIN, EIO, EOUT, io, lerp, pop} from '../lib/anim';
import {ANCHOR_HI, Beat, DATE_HI, OUTRO_RECAP as RECAP, STORIES} from '../content';
import {CA, img, Particles, Sfx} from '../components/ui';
import {Logo} from '../components/Chrome';


export const Outro: React.FC<{b: Beat; t: number}> = ({b, t}) => {
  const enter = io(t, b.at, b.at + 0.5);
  const END = 14.5;
  const endP = io(t, END, END + 0.8, EIO);
  // subscribe sequence
  const subIn = pop(t, 6.2, 30, 12, 150);
  const cur = io(t, 6.5, 7.3, EIO);
  const click = t > 7.35 && t < 7.55;
  const subbed = t >= 7.45;
  const bell = t >= 7.9 ? Math.sin((t - 7.9) * 22) * 18 * Math.exp(-(t - 7.9) * 2.2) : 0;
  const cx = lerp(cur, 0, 1, 1700, 1010), cy = lerp(cur, 0, 1, 980, 690);
  return (
    <AbsoluteFill>
      {/* main bulletin part */}
      <div style={{opacity: 1 - endP}}>
        <div style={{position: 'absolute', left: CA.x, top: CA.y, width: CA.w, height: CA.h, borderRadius: 18, overflow: 'hidden', opacity: enter, background: 'radial-gradient(circle at 50% 30%, #13327A, #060F29 75%)', border: '3px solid rgba(255,255,255,0.85)'}}>
          <div style={{position: 'absolute', left: 40, right: 40, top: 30, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, opacity: 1 - io(t, 5.6, 6.1) * 0.85, filter: `blur(${io(t, 5.6, 6.1) * 10}px)`}}>
            {RECAP.map((r, i) => {
              const p = pop(t, 0.3 + i * 0.12, 30, 14, 140);
              return (
                <div key={i} style={{height: 200, borderRadius: 12, overflow: 'hidden', position: 'relative', transform: `scale(${p})`, opacity: Math.min(1, p * 2), border: '3px solid rgba(255,255,255,0.7)'}}>
                  <Img src={img(r.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '30px 14px 6px', background: 'linear-gradient(transparent, rgba(6,15,41,0.92))', fontFamily: F.head, fontWeight: 700, fontSize: 32, color: '#fff'}}>{r.t}</div>
                  <div style={{position: 'absolute', left: 10, top: 10, width: 40, height: 40, borderRadius: '50%', background: C.red, color: '#fff', fontFamily: F.num, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 3}}>{i + 1}</div>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', opacity: io(t, 0.2, 0.7) * (1 - io(t, 5.6, 6.0))}}>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 90, color: '#fff', lineHeight: 1}}>ये थीं आज की प्रमुख खबरें</div>
            <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 34, color: C.yellow, marginTop: 10}}>{DATE_HI} • LDS खबर</div>
          </div>
        </div>
        {/* subscribe */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 34, transform: `scale(${subIn})`, opacity: Math.min(1, subIn * 2)}}>
          <Logo size={130} t={t} />
          <div style={{background: subbed ? '#3A3F52' : '#E0141E', color: '#fff', fontFamily: F.head, fontWeight: 700, fontSize: 64, padding: '18px 50px 8px', borderRadius: 999, transform: `scale(${click ? 0.92 : 1})`, boxShadow: subbed ? 'none' : '0 0 0 8px rgba(224,20,30,0.25), 0 18px 40px rgba(0,0,0,0.5)'}}>{subbed ? 'सब्सक्राइब्ड ✓' : 'सब्सक्राइब करें'}</div>
          <div style={{width: 110, height: 110, borderRadius: '50%', background: subbed ? C.yellow : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, transform: `rotate(${bell}deg)`, transformOrigin: '50% 10%'}}>🔔</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', opacity: io(t, 6.0, 6.5)}}>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 70, color: '#fff'}}>बुलेटिन उपयोगी लगा?</div>
        </div>
        {/* comment */}
        <div style={{position: 'absolute', left: 560, top: 760, width: 800, display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 18, padding: '16px 26px 8px', opacity: io(t, 8.3, 8.7), transform: `translateY(${(1 - io(t, 8.3, 8.7)) * 40}px)`, boxShadow: '0 16px 30px rgba(0,0,0,0.45)'}}>
          <div style={{fontSize: 46}}>💬</div>
          <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 46, color: C.ink}}>खबरों पर अपनी राय कमेंट में बताएं</div>
        </div>
        {/* sign-off */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 410, textAlign: 'center', opacity: io(t, 11.3, 11.8)}}>
          <div style={{display: 'inline-block', fontFamily: F.head, fontWeight: 700, fontSize: 52, color: C.ink, background: C.yellow, padding: '8px 28px 0', borderRadius: 10}}>{t < 13.4 ? `प्रस्तुति: ${ANCHOR_HI}` : 'नमस्कार 🙏'}</div>
        </div>
        {/* cursor */}
        {t > 6.4 && t < 9 && (
          <svg width="60" height="70" viewBox="0 0 24 28" style={{position: 'absolute', left: cx, top: cy, opacity: 1 - io(t, 8.4, 8.9), transform: `scale(${click ? 0.85 : 1})`}}>
            <path d="M2 2 L2 22 L7 17 L11 26 L15 24 L11 15 L18 15 Z" fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )}
        {click && <div style={{position: 'absolute', left: cx - 30, top: cy - 30, width: 60, height: 60, borderRadius: '50%', border: '4px solid #fff', opacity: 0.8}} />}
      </div>
      {/* end card */}
      {t > END - 0.1 && (
        <AbsoluteFill style={{opacity: endP}}>
          <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 50%, #13327A, #060F29 70%)'}} />
          <Particles n={30} color="#FFC915" speed={20} size={5} opacity={0.4} seed={7} />
          <AbsoluteFill style={{opacity: 0.08, backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '80px 80px', backgroundPosition: `${-t * 12}px ${-t * 6}px`}} />
          <div style={{position: 'absolute', left: 110, top: 150, display: 'flex', alignItems: 'center', gap: 36, transform: `scale(${pop(t, END + 0.2)})`, transformOrigin: 'left center'}}>
            <Logo size={190} t={t} />
            <div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 120, color: '#fff', lineHeight: 1}}>LDS खबर</div>
              <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 44, color: C.yellow}}>हर खबर, आपके साथ</div>
            </div>
          </div>
          {/* YouTube end-screen safe areas */}
          <div style={{position: 'absolute', left: 110, top: 470, width: 880, height: 495, borderRadius: 16, border: '3px dashed rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: io(t, END + 0.6, END + 1.1)}}>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 48, color: 'rgba(255,255,255,0.55)'}}>▶ अगला वीडियो देखें</div>
          </div>
          <div style={{position: 'absolute', left: 1180, top: 470, width: 495, height: 495, borderRadius: '50%', border: '3px dashed rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: io(t, END + 0.8, END + 1.3)}}>
            <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 44, color: 'rgba(255,255,255,0.55)', textAlign: 'center'}}>सब्सक्राइब<br />करें</div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: F.body, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,0.5)'}}>तस्वीरें और वीडियो: संबंधित स्रोतों के सौजन्य से, स्क्रीन पर उल्लेखित</div>
        </AbsoluteFill>
      )}
      <Sfx at={6.2} src="sfx_pop" vol={0.25} dur={0.5} />
      <Sfx at={7.4} src="sfx_tick" vol={0.35} dur={0.4} />
      <Sfx at={7.9} src="sfx_pop" vol={0.2} dur={0.5} />
      <Sfx at={END} src="sfx_whoosh_1" vol={0.2} dur={1} />
    </AbsoluteFill>
  );
};
export {EIN, EOUT, STORIES};

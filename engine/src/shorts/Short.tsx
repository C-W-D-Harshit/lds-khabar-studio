import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Audio, Video} from '@remotion/media';
import {C, F} from '../theme';
import {DATE_HI, DAY_HI, STORIES} from '../content';
import {EIN, EOUT, io, lerp, pop} from '../lib/anim';
import {StoryView} from '../Story';
import {Logo} from '../components/Chrome';
import {Grain} from '../components/ui';
import {S_END, S_FPS, S_LEAD, ShortCfg, shortDur} from './config';
import CAPS from './captions.json';

type W = {w: string; s: number; e: number};
type Chunk = {s: number; e: number; words: W[]};
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W_ = 1080;

// Landscape scene crop shown in the portrait panel
const CROP = {x: 20, y: 168, w: 1880, h: 792};
const PS = W_ / CROP.w;
const PANEL_Y = 742;
const PANEL_H = Math.round(CROP.h * PS);

const firstSrc = (id: string) => {
  const s = STORIES.find((x) => x.id === id)!;
  return s.beats.find((b) => b.src)?.src as string | undefined;
};

/* ---------- background ---------- */
const Bg: React.FC<{src?: string; t: number; somber: boolean; fun: boolean}> = ({src, t, somber, fun}) => (
  <AbsoluteFill style={{background: C.navyDeep}}>
    {src && (
      <Img src={staticFile('bg/' + src.replace('/', '_'))} style={{position: 'absolute', left: -200, top: -100, width: 1480, height: 2120, objectFit: 'cover', transform: `scale(${1.08 + 0.03 * Math.sin(t / 5)})`, filter: `blur(26px) ${somber ? 'grayscale(1) brightness(0.55)' : 'brightness(0.7) saturate(1.2)'}`}} />
    )}
    <AbsoluteFill style={{background: somber ? 'linear-gradient(180deg, rgba(10,10,14,0.88), rgba(28,28,34,0.78) 50%, rgba(8,8,10,0.95))' : fun ? 'linear-gradient(180deg, rgba(40,6,70,0.88) 0%, rgba(11,31,77,0.72) 45%, rgba(150,10,20,0.75) 100%)' : 'linear-gradient(180deg, rgba(6,15,41,0.92) 0%, rgba(11,31,77,0.70) 45%, rgba(120,8,14,0.72) 100%)'}} />
    <AbsoluteFill style={{background: `radial-gradient(700px 600px at ${50 + 30 * Math.sin(t / 4)}% ${30 + 15 * Math.cos(t / 6)}%, rgba(255,255,255,0.10), transparent 70%)`}} />
    <AbsoluteFill style={{opacity: 0.08, backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '72px 72px', backgroundPosition: `${-t * 10}px ${-t * 16}px`}} />
  </AbsoluteFill>
);

/* ---------- top brand bar ---------- */
const TopBar: React.FC<{t: number; somber: boolean}> = ({t, somber}) => {
  const a = io(t, 0, 0.35);
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <div style={{position: 'absolute', left: 0, top: 64, width: W_, height: 120, opacity: a, transform: `translateY(${(1 - a) * -40}px)`}}>
      <div style={{position: 'absolute', left: 46, top: 6}}>
        <Logo size={104} t={t} />
      </div>
      <div style={{position: 'absolute', left: 172, top: 4, fontFamily: F.head, fontWeight: 700, fontSize: 62, lineHeight: 1, color: '#fff', paddingTop: 10, textShadow: '0 4px 14px rgba(0,0,0,0.5)'}}>
        LDS <span style={{color: C.yellow}}>खबर</span>
      </div>
      <div style={{position: 'absolute', left: 174, top: 80, fontFamily: F.body, fontWeight: 700, fontSize: 26, color: 'rgba(255,255,255,0.82)'}}>
        {DATE_HI} • {DAY_HI}
      </div>
      <div style={{position: 'absolute', right: 46, top: 26, height: 60, padding: '0 26px 0 20px', borderRadius: 30, background: somber ? '#3A3A42' : C.red, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 24px rgba(0,0,0,0.4)'}}>
        <div style={{width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: `0 0 0 ${3 + pulse * 6}px rgba(255,255,255,${0.35 - pulse * 0.25})`}} />
        <span style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: '#fff', paddingTop: 6}}>{somber ? 'श्रद्धांजलि' : 'ताज़ा ख़बर'}</span>
      </div>
    </div>
  );
};

/* ---------- headline block ---------- */
const Headline: React.FC<{t: number; tag: string; title: [string, string]; sub: string; top: number; size: number; somber: boolean}> = ({t, tag, title, sub, top, size, somber}) => {
  const tg = pop(t, 0.05);
  const l1 = io(t, 0.08, 0.45);
  const l2 = io(t, 0.18, 0.55);
  const sb = io(t, 0.3, 0.75);
  const y2 = somber ? '#E6E6EA' : C.yellow;
  return (
    <div style={{position: 'absolute', left: 50, top, width: 980}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: somber ? '#55555E' : C.red, borderRadius: 8, padding: '0 22px 0 18px', height: 54, transform: `scale(${tg})`, transformOrigin: 'left center', boxShadow: '0 8px 20px rgba(0,0,0,0.35)'}}>
        <div style={{width: 10, height: 10, borderRadius: '50%', background: '#fff'}} />
        <span style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: '#fff', paddingTop: 6}}>{tag}</span>
      </div>
      <div style={{marginTop: 14, borderLeft: `10px solid ${y2}`, paddingLeft: 26}}>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: '#fff', clipPath: `inset(0 ${(1 - l1) * 100}% -20% 0)`, textShadow: '0 6px 20px rgba(0,0,0,0.5)', paddingTop: 8}}>{title[0]}</div>
        <div style={{fontFamily: F.head, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: y2, clipPath: `inset(0 ${(1 - l2) * 100}% -20% 0)`, textShadow: '0 6px 20px rgba(0,0,0,0.5)'}}>{title[1]}</div>
      </div>
      <div style={{marginTop: 18, display: 'inline-block', background: somber ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '8px 22px 4px', clipPath: `inset(0 ${(1 - sb) * 100}% 0 0)`, boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>
        <span style={{fontFamily: F.body, fontWeight: 800, fontSize: 32, color: somber ? '#fff' : C.ink}}>{sub}</span>
      </div>
    </div>
  );
};

/* ---------- landscape scene panel ---------- */
const Panel: React.FC<{c: ShortCfg; t: number}> = ({c, t}) => {
  const s = STORIES.find((x) => x.id === c.id)!;
  const a = io(t, 0.1, 0.55);
  return (
    <div style={{position: 'absolute', left: 0, top: PANEL_Y, width: W_, height: PANEL_H, opacity: a, transform: `scale(${0.94 + 0.06 * a})`}}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: C.navyDeep, boxShadow: '0 30px 70px rgba(0,0,0,0.6)'}}>
        <div style={{position: 'absolute', left: -CROP.x * PS, top: -CROP.y * PS, width: 1920, height: 1080, transform: `scale(${PS})`, transformOrigin: '0 0'}}>
          <StoryView s={s} lead={S_LEAD - c.t0} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: -6, height: 6, background: `linear-gradient(90deg, ${C.red}, ${C.yellow})`}} />
    </div>
  );
};

/* ---------- ticker under panel ---------- */
const Ticker: React.FC<{t: number; text: string; somber: boolean}> = ({t, text, somber}) => {
  const a = io(t, 0.35, 0.8);
  const items = new Array(6).fill(text);
  return (
    <div style={{position: 'absolute', left: 0, top: PANEL_Y + PANEL_H, width: W_, height: 66, background: somber ? 'linear-gradient(180deg,#3A3A42,#232328)' : `linear-gradient(180deg, ${C.red}, ${C.redDeep})`, overflow: 'hidden', clipPath: `inset(0 ${(1 - a) * 100}% 0 0)`}}>
      <div style={{position: 'absolute', left: 200, right: 0, top: 0, bottom: 0, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 20, top: 0, bottom: 0, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', transform: `translateX(${-Math.max(0, t - 1.2) * 95}px)`}}>
          {items.map((x, i) => (
            <span key={i} style={{display: 'inline-flex', alignItems: 'center', fontFamily: F.head, fontWeight: 600, fontSize: 38, color: '#fff', paddingTop: 6}}>
              {x}
              <span style={{width: 14, height: 14, borderRadius: '50%', background: C.yellow, display: 'inline-block', margin: '0 28px'}} />
            </span>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: 200, height: 66, background: '#fff', clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 14}}>
        <span style={{fontFamily: F.head, fontWeight: 700, fontSize: 36, color: somber ? '#333' : C.red, paddingTop: 6}}>{somber ? 'शोक' : 'ताज़ा'}</span>
      </div>
    </div>
  );
};

/* ---------- vertical viral clip ---------- */
const VBOX = {x: 214, y: 548, w: 652, h: 1159};
const Vertical: React.FC<{c: ShortCfg; t: number; vt: number}> = ({c, t, vt}) => {
  const a = io(t, 0.1, 0.55);
  return (
    <>
      <div style={{position: 'absolute', left: VBOX.x, top: VBOX.y, width: VBOX.w, height: VBOX.h, borderRadius: 34, overflow: 'hidden', border: '5px solid rgba(255,255,255,0.92)', boxShadow: '0 40px 90px rgba(0,0,0,0.65)', opacity: a, transform: `scale(${0.92 + 0.08 * a}) rotate(${(1 - a) * -2}deg)`, background: '#000'}}>
        <Video src={staticFile(c.video!)} muted loop objectFit="cover" style={{width: '100%', height: '100%'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.7))'}} />
        <div style={{position: 'absolute', left: 18, top: 18, background: 'rgba(0,0,0,0.62)', borderRadius: 8, padding: '6px 14px 2px', fontFamily: F.body, fontWeight: 700, fontSize: 24, color: '#fff'}}>वीडियो: {c.credit}</div>
      </div>
      {(c.callouts ?? []).map((k, i) => {
        if (vt < k.at - 0.1 || vt > k.until + 0.4) return null;
        const p = pop(vt, k.at);
        const o = Math.min(io(vt, k.at, k.at + 0.15), 1 - io(vt, k.until, k.until + 0.3, EIN));
        if (k.kind === 'stamp') {
          const s = lerp(vt, k.at, k.at + 0.22, 2.2, 1, EIN);
          return (
            <div key={i} style={{position: 'absolute', right: 70, top: k.y, transform: `rotate(-10deg) scale(${s})`, opacity: o, border: `6px solid ${C.red}`, color: C.red, background: 'rgba(255,255,255,0.92)', borderRadius: 12, padding: '10px 26px 2px', fontFamily: F.head, fontWeight: 700, fontSize: 58, boxShadow: '0 14px 30px rgba(0,0,0,0.4)', whiteSpace: 'nowrap'}}>{k.text}</div>
          );
        }
        const left = k.side === 'left';
        return (
          <div key={i} style={{position: 'absolute', [left ? 'left' : 'right']: 40, top: k.y, maxWidth: 720, opacity: o, transform: `scale(${p})`, transformOrigin: left ? 'left bottom' : 'right bottom'}}>
            <div style={{background: left ? '#fff' : C.yellow, color: C.ink, borderRadius: 28, [left ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: 6, padding: '18px 28px 12px', fontFamily: F.body, fontWeight: 800, fontSize: 40, lineHeight: 1.25, boxShadow: '0 16px 36px rgba(0,0,0,0.45)'}}>{k.text}</div>
          </div>
        );
      })}
    </>
  );
};

/* ---------- karaoke captions ---------- */
const Captions: React.FC<{chunks: Chunk[]; vt: number; top: number; somber: boolean}> = ({chunks, vt, top, somber}) => {
  let idx = -1;
  for (let i = 0; i < chunks.length; i++) if (vt >= chunks[i].s - 0.05) idx = i;
  if (idx < 0) return null;
  const ch = chunks[idx];
  const next = chunks[idx + 1];
  const hideAt = next ? next.s - 0.05 : ch.e + 0.6;
  if (vt > hideAt) return null;
  const inP = io(vt, ch.s - 0.05, ch.s + 0.12);
  const hl = somber ? '#FFFFFF' : C.yellow;
  return (
    <div style={{position: 'absolute', left: 60, width: 900, top, display: 'flex', justifyContent: 'center', transform: `scale(${0.86 + 0.14 * inP})`, opacity: inP}}>
      <div style={{textAlign: 'center', lineHeight: 1.32}}>
        {ch.words.map((w, i) => {
          const on = vt >= w.s - 0.03;
          const cur = on && (i === ch.words.length - 1 || vt < ch.words[i + 1].s - 0.03);
          return (
            <span key={i} style={{display: 'inline-block', margin: '0 9px', fontFamily: F.body, fontWeight: 800, fontSize: 70, color: cur ? hl : on ? '#fff' : 'rgba(255,255,255,0.72)', WebkitTextStroke: '12px rgba(0,0,0,0.92)', paintOrder: 'stroke fill', transform: `scale(${cur ? 1.08 : 1})`, textShadow: '0 6px 18px rgba(0,0,0,0.6)'}}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- end card ---------- */
const EndCard: React.FC<{t: number; at: number; somber: boolean}> = ({t, at, somber}) => {
  const lt = t - at;
  if (lt < -0.1) return null;
  const dim = io(lt, 0, 0.45);
  const lg = pop(lt, 0.1);
  const tx = io(lt, 0.3, 0.7);
  const bt = pop(lt, 0.55);
  const pulse = 1 + 0.04 * Math.sin(Math.max(0, lt - 0.9) * 7);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: somber ? 'rgba(8,8,10,0.9)' : 'rgba(6,15,41,0.9)', opacity: dim, backdropFilter: `blur(${dim * 14}px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{transform: `scale(${lg})`}}><Logo size={280} t={t} /></div>
        <div style={{marginTop: 50, fontFamily: F.head, fontWeight: 700, fontSize: 120, color: '#fff', lineHeight: 1, opacity: tx, transform: `translateY(${(1 - tx) * 30}px)`}}>
          LDS <span style={{color: C.yellow}}>खबर</span>
        </div>
        <div style={{marginTop: 26, fontFamily: F.body, fontWeight: 700, fontSize: 40, color: 'rgba(255,255,255,0.88)', opacity: tx, textAlign: 'center', lineHeight: 1.35}}>
          {somber ? 'हर ज़रूरी खबर, सबसे पहले' : 'ऐसी ही ताज़ा खबरों के लिए'}
        </div>
        <div style={{marginTop: 44, transform: `scale(${bt * pulse})`, background: somber ? '#4A4A52' : C.red, borderRadius: 60, padding: '20px 56px 12px', fontFamily: F.head, fontWeight: 700, fontSize: 60, color: '#fff', boxShadow: somber ? 'none' : '0 16px 40px rgba(224,20,30,0.55)'}}>
          🔔 फॉलो करें
        </div>
        <div style={{marginTop: 34, fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.yellow, opacity: io(lt, 0.8, 1.2)}}>पूरा बुलेटिन देखें • LDS खबर YouTube चैनल पर</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- the short ---------- */
export const Short: React.FC<{c: ShortCfg}> = ({c}) => {
  const frame = useCurrentFrame();
  const t = frame / S_FPS;
  const s = STORIES.find((x) => x.id === c.id)!;
  const somber = s.mood === 'somber';
  const fun = s.mood === 'fun';
  const vt = t - S_LEAD + c.t0; // time in the voice clip
  const voLen = c.t1 - c.t0;
  const endAt = S_LEAD + voLen + 0.35;
  const total = shortDur(c);
  const chunks = ((CAPS as any)[c.id] ?? []) as Chunk[];
  const vertical = c.mode === 'vertical';
  const fadeOut = 1 - io(t, endAt - 0.1, endAt + 0.35);
  const music = fun ? 'music/music_2.mp3' : 'music/music_1.mp3';
  return (
    <AbsoluteFill style={{background: C.navyDeep, filter: somber ? 'grayscale(0.92)' : undefined}}>
      <Bg src={vertical ? firstSrc(c.id) ?? 's11_notes/viral_frame_burning_720x1280.jpg' : firstSrc(c.id)} t={t} somber={somber} fun={fun} />
      <TopBar t={t} somber={somber} />
      <div style={{opacity: fadeOut}}>
        <Headline t={t} tag={s.tag} title={c.title} sub={c.sub} top={vertical ? 214 : 284} size={vertical ? 72 : 86} somber={somber} />
      </div>
      <AbsoluteFill style={{opacity: fadeOut}}>
        {vertical ? <Vertical c={c} t={t} vt={vt} /> : (
          <>
            <Panel c={c} t={t} />
            <Ticker t={t} text={s.ticker} somber={somber} />
          </>
        )}
        <Captions chunks={chunks} vt={vt} top={vertical ? 1360 : 1336} somber={somber} />
      </AbsoluteFill>
      <EndCard t={t} at={endAt} somber={somber} />
      <Grain opacity={0.05} />

      {/* voice */}
      <Sequence from={Math.round(S_LEAD * S_FPS)} durationInFrames={Math.round((voLen + 0.3) * S_FPS)} name="VO">
        <Audio src={staticFile(`vo/${s.vo}.wav`)} trimBefore={Math.round(c.t0 * S_FPS)} trimAfter={Math.round(c.t1 * S_FPS)}
          volume={(f) => interpolate(f / S_FPS, [0, 0.08, voLen - 0.15, voLen], [0, 1, 1, 0], CL)} />
      </Sequence>
      {/* music */}
      {!somber && (
        <Audio src={staticFile(music)} loop trimBefore={fun ? 0 : Math.round(20 * S_FPS)}
          volume={(f) => {
            const g = f / S_FPS;
            const under = fun ? 0.05 : 0.065;
            const v = interpolate(g, [0, 0.4, S_LEAD + 0.2, endAt - 0.2, endAt + 0.5, total - 0.8, total], [0.0, 0.26, under, under, 0.28, 0.28, 0], CL);
            return v;
          }} />
      )}
      {/* stings */}
      {!somber && (
        <Sequence durationInFrames={60} name="Sting">
          <Audio src={staticFile(fun ? 'sfx/sfx_whoosh_2.mp3' : 'sfx/sfx_breaking_news_alert.mp3')} volume={fun ? 0.35 : 0.22} />
        </Sequence>
      )}
      <Sequence from={Math.round((endAt + 0.05) * S_FPS)} durationInFrames={45} name="End whoosh">
        <Audio src={staticFile('sfx/sfx_whoosh_1.mp3')} volume={somber ? 0.08 : 0.3} />
      </Sequence>
      <Sequence from={Math.round((endAt + 0.6) * S_FPS)} durationInFrames={30} name="End pop">
        <Audio src={staticFile('sfx/sfx_pop.mp3')} volume={somber ? 0 : 0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};

export {S_END, EOUT};

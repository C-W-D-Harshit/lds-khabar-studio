import React from 'react';
import {C} from '../theme';

export const Diya: React.FC<{t: number; size?: number}> = ({t, size = 120}) => {
  const fl = 1 + 0.08 * Math.sin(t * 23) + 0.05 * Math.sin(t * 37);
  const sway = Math.sin(t * 7) * 4;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="dglow"><stop offset="0" stopColor="#FFD27A" stopOpacity="0.9" /><stop offset="1" stopColor="#FF8A1F" stopOpacity="0" /></radialGradient>
        <linearGradient id="dflame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FF6A00" /><stop offset="0.5" stopColor="#FFB100" /><stop offset="1" stopColor="#FFF4C2" /></linearGradient>
        <linearGradient id="dbowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C9622B" /><stop offset="1" stopColor="#7A2E10" /></linearGradient>
      </defs>
      <circle cx="60" cy="52" r={46 * fl} fill="url(#dglow)" />
      <g transform={`translate(60,66) rotate(${sway}) scale(1,${fl})`}>
        <path d="M0 0 C -12 -10 -9 -26 0 -40 C 9 -26 12 -10 0 0 Z" fill="url(#dflame)" />
        <path d="M0 -2 C -5 -7 -4 -15 0 -22 C 4 -15 5 -7 0 -2 Z" fill="#FFFBE6" />
      </g>
      <path d="M10 70 Q 60 72 110 70 Q 100 100 60 102 Q 20 100 10 70 Z" fill="url(#dbowl)" />
      <path d="M10 70 Q 60 80 110 70" fill="none" stroke="#F6C453" strokeWidth="3" />
    </svg>
  );
};

export const FlagIN: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 2 / 3} viewBox="0 0 30 20" style={{borderRadius: 4, boxShadow: '0 6px 16px rgba(0,0,0,0.35)'}}>
    <rect width="30" height="6.67" fill="#FF9933" /><rect y="6.67" width="30" height="6.67" fill="#fff" /><rect y="13.33" width="30" height="6.67" fill="#138808" />
    <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.5" />
    {new Array(24).fill(0).map((_, i) => <line key={i} x1="15" y1="10" x2={15 + 2.6 * Math.cos((i * Math.PI) / 12)} y2={10 + 2.6 * Math.sin((i * Math.PI) / 12)} stroke="#000080" strokeWidth="0.18" />)}
  </svg>
);
export const FlagJP: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 2 / 3} viewBox="0 0 30 20" style={{borderRadius: 4, boxShadow: '0 6px 16px rgba(0,0,0,0.35)'}}>
    <rect width="30" height="20" fill="#fff" /><circle cx="15" cy="10" r="6" fill="#BC002D" />
  </svg>
);
export const FlagSG: React.FC<{w: number}> = ({w}) => (
  <svg width={w} height={w * 2 / 3} viewBox="0 0 30 20" style={{borderRadius: 4, boxShadow: '0 6px 16px rgba(0,0,0,0.35)'}}>
    <rect width="30" height="10" fill="#EF3340" /><rect y="10" width="30" height="10" fill="#fff" />
    <circle cx="7" cy="5" r="3.4" fill="#fff" /><circle cx="8.3" cy="5" r="3.2" fill="#EF3340" />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={9 + 1.6 * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / 5)} cy={5 + 1.6 * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / 5)} r="0.55" fill="#fff" />)}
  </svg>
);

export const Sun: React.FC<{size: number; t: number}> = ({size, t}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <g transform={`rotate(${t * 20})`}>{new Array(12).fill(0).map((_, i) => <rect key={i} x={-3} y={-46} width={6} height={14} rx={3} fill={C.saffron} transform={`rotate(${i * 30})`} />)}</g>
    <circle r={24} fill={C.yellow} stroke={C.saffron} strokeWidth={4} />
  </svg>
);
export const Moon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <path d="M 10 -36 A 38 38 0 1 0 30 26 A 30 30 0 1 1 10 -36 Z" fill="#DCE6FF" stroke="#9FB3E6" strokeWidth={3} />
  </svg>
);

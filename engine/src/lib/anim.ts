import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {createContext, useContext} from 'react';

export const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const EOUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EIN = Easing.bezier(0.7, 0, 0.84, 0);
export const EIO = Easing.bezier(0.65, 0, 0.35, 1);

/** Story-local seconds offset (stories start their visual a little before the voice). */
export const LeadCtx = createContext(0);

/** Current time in seconds, relative to the story voice start (can be negative during lead-in). */
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lead = useContext(LeadCtx);
  return f / fps - lead;
};

/** 0→1 between a and b with ease-out. */
export const io = (t: number, a: number, b: number, e = EOUT) => interpolate(t, [a, b], [0, 1], {...CL, easing: e});
/** Range map with clamp. */
export const lerp = (t: number, a: number, b: number, from: number, to: number, e = EOUT) =>
  interpolate(t, [a, b], [from, to], {...CL, easing: e});

/** Springy 0→1(+overshoot) starting at `at` seconds. */
export const pop = (t: number, at: number, fps = 30, damping = 13, stiffness = 140) =>
  spring({frame: Math.max(0, (t - at) * fps), fps, config: {damping, stiffness, mass: 0.9}});

/** in at `a`, out at `b` (fade/slide window). Returns 0..1 visibility. */
export const win = (t: number, a: number, b: number, fin = 0.45, fout = 0.35) =>
  Math.min(io(t, a, a + fin), 1 - io(t, b - fout, b, EIN));

export const fmtIN = (n: number, digits = 0) =>
  n.toLocaleString('en-IN', {minimumFractionDigits: digits, maximumFractionDigits: digits});

/** Deterministic pseudo-random */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

import {LEAD, OPENER_SEC, STORIES} from '../content';
export type TLItem = {i: number; visStart: number; voStart: number; visEnd: number};
export const TL: TLItem[] = (() => {
  let s = OPENER_SEC;
  return STORIES.map((st, i) => {
    const visStart = s;
    const voStart = s + LEAD;
    const visEnd = voStart + st.dur + 0.5 + (st.tail ?? 0);
    s = visEnd;
    return {i, visStart, voStart, visEnd};
  });
})();
export const TOTAL_SEC = TL[TL.length - 1].visEnd;
export const END_CARD_AT = TL[TL.length - 1].voStart + STORIES[STORIES.length - 1].dur + 0.3;
export const storyAt = (g: number) => {
  for (let i = TL.length - 1; i >= 0; i--) if (g >= TL[i].visStart) return i;
  return -1;
};

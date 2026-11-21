// Prints YouTube chapters for the main bulletin as JSON (same maths as src/lib/timeline.ts).
// Run from video/: node scripts/chapters.mjs > ../chapters.json
import {LEAD, OPENER_SEC, STORIES} from '../src/content.ts';
let s = OPENER_SEC;
const out = [{at: 0, id: 'intro', title: 'शुरुआत'}];
for (const st of STORIES) {
  out.push({at: s, id: st.id, title: st.headline, tag: st.tag});
  s = s + LEAD + st.dur + 0.5 + (st.tail ?? 0);
}
console.log(JSON.stringify({total: s, chapters: out}, null, 1));

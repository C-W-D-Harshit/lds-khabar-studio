// Mood-board stills of the main bulletin. Run from video/: node scripts/stills.mjs 3 12.5 40 ...  (seconds)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const secs = process.argv.slice(2).map(Number);
const out = path.resolve('../moodboard/stills');
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'NewsBulletin'});
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * 30));
  const file = path.join(out, `f_${String(s.toFixed(1)).padStart(6, '0')}.png`);
  await renderStill({composition, serveUrl, frame, output: file});
  console.log('ok', s);
}

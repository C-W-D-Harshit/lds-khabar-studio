import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
// usage: node stills.mjs s02:3,12 s11:5
const out = path.resolve('../shorts/_preview');
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const arg of process.argv.slice(2)) {
  const [id, list] = arg.split(':');
  const composition = await selectComposition({serveUrl, id: `Short-${id}`});
  for (const s of list.split(',').map(Number)) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * 30));
    await renderStill({composition, serveUrl, frame, output: path.join(out, `${id}_${s}.png`)});
    console.log('ok', id, s);
  }
}

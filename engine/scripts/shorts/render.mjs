import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {SHORTS} from '../../src/shorts/config.ts';
const outDir = path.resolve('../shorts');
fs.mkdirSync(path.join(outDir, 'covers'), {recursive: true});
const ids = process.argv.slice(2).length ? process.argv.slice(2) : SHORTS.map((x) => x.id); // no ids = render all
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const id of ids) {
  const c = SHORTS.find((x) => x.id === id);
  const composition = await selectComposition({serveUrl, id: `Short-${id}`});
  const out = path.join(outDir, `${c.slug}.mp4`);
  let last = -1;
  const t = Date.now();
  await renderMedia({composition, serveUrl, codec: 'h264', outputLocation: out, crf: 18, audioBitrate: '192k', concurrency: 6, pixelFormat: 'yuv420p',
    onProgress: ({progress}) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(id, `${p * 10}%`); } }});
  await renderStill({composition, serveUrl, frame: 90, output: path.join(outDir, 'covers', `${c.slug}.jpg`), imageFormat: 'jpeg', jpegQuality: 92});
  console.log('DONE', id, out, Math.round((Date.now() - t) / 1000) + 's');
}
console.log('ALL DONE');

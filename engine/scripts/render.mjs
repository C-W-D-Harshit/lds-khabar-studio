// Full bulletin render. Run from the video/ folder: node scripts/render.mjs
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {OUTPUT_FILE} from '../src/content.ts';
const out = path.resolve('..', process.argv[2] ?? OUTPUT_FILE);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'NewsBulletin'});
let last = -1;
const t = Date.now();
await renderMedia({
  composition, serveUrl, codec: 'h264', outputLocation: out, crf: 18, audioBitrate: '192k', concurrency: 6, pixelFormat: 'yuv420p',
  onProgress: ({progress}) => { const p = Math.floor(progress * 100); if (p !== last && p % 5 === 0) { last = p; console.log(`progress ${p}%`); } },
});
console.log('DONE', out, Math.round((Date.now() - t) / 1000) + 's');

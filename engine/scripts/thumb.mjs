// YouTube thumbnail (1280x720 jpg) from one frame of the bulletin. Run from video/: node scripts/thumb.mjs <second> [out.jpg]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const sec = Number(process.argv[2] ?? 3);
const out = path.resolve('..', process.argv[3] ?? 'thumbnail.jpg');
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'NewsBulletin'});
await renderStill({composition, serveUrl, frame: Math.round(sec * 30), output: out, imageFormat: 'jpeg', jpegQuality: 92, scale: 2 / 3});
console.log('DONE', out);

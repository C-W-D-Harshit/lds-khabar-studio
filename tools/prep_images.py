#!/usr/bin/env python3
"""Prepare every photo for Remotion. Run after sourcing (and again whenever photos change).
sourced/sNN_name/*.jpg -> video/public/img/sNN_name/ (max 2400 px)
images/*.jpg (family's photos) -> video/public/img/wa/
plus public/sm/ (400 px thumbs), public/bg/ (blurred backgrounds) and src/data/dims.json (sizes).
In code refer to photos as 'sNN_name/file.jpg' or 'wa/image_01.jpg'."""
import sys, os, glob, json, subprocess, shutil
ed = sys.argv[1]; P = os.path.join(ed, 'video/public')
for d in ['img', 'sm', 'bg']: os.makedirs(os.path.join(P, d), exist_ok=True)
def sips(args): subprocess.run(['sips'] + args, capture_output=True)
pairs = []
for d in sorted(glob.glob(os.path.join(ed, 'sourced', 's[0-9]*_*'))):
    for f in sorted(glob.glob(os.path.join(d, '*'))):
        if os.path.splitext(f)[1].lower() in {'.jpg', '.jpeg', '.png', '.webp', '.heic'}: pairs.append((f, os.path.basename(d)))
for f in sorted(glob.glob(os.path.join(ed, 'images', '*.jpg'))): pairs.append((f, 'wa'))
dims = {}
for f, sub in pairs:
    os.makedirs(os.path.join(P, 'img', sub), exist_ok=True)
    name = os.path.splitext(os.path.basename(f))[0] + '.jpg'
    o = os.path.join(P, 'img', sub, name)
    sips(['-s', 'format', 'jpeg', '-Z', '2400', f, '--out', o])
    flat = f'{sub}_{name}'
    sips(['-Z', '400', o, '--out', os.path.join(P, 'sm', flat)])
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', os.path.join(P, 'sm', flat), '-vf', 'scale=480:-2,gblur=sigma=14,eq=saturation=1.15', '-q:v', '4', os.path.join(P, 'bg', flat)])
    out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', o], capture_output=True, text=True).stdout.split()
    w, h = int(out[out.index('pixelWidth:') + 1]), int(out[out.index('pixelHeight:') + 1])
    dims[f'{sub}/{name}'] = [w, h]
    print(f'{sub}/{name}  {w}x{h}' + ('  PORTRAIT' if h > w * 0.9 else '') + ('  SMALL' if max(w, h) < 900 else ''))
json.dump(dims, open(os.path.join(ed, 'video/src/data/dims.json'), 'w'), indent=0)
print(len(dims), 'images ready')

#!/usr/bin/env python3
"""Trim and loudness-normalise the anchor's clips into video/public/vo/vo_NN.wav (48 kHz stereo, -16 LUFS).
usage: prep_voice.py "<edition>"                      auto-trim leading/trailing silence for every audio_NN
       prep_voice.py "<edition>" 01:0.6:55.6 12:0:44.3 set exact start:end (seconds) for some clips
Skip a duplicate clip with  15:skip . Prints each vo duration: put it in content.ts as the story's dur."""
import sys, os, re, subprocess
ed = sys.argv[1]; manual = {}
for a in sys.argv[2:]:
    n, rest = a.split(':', 1); manual[n] = rest
adir = os.path.join(ed, 'audio'); out = os.path.join(ed, 'video/public/vo'); os.makedirs(out, exist_ok=True)
def probe(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
def auto(p):
    total = probe(p)
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'silencedetect=n=-38dB:d=0.35', '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    s, e = 0.0, total
    if starts and starts[0] < 0.05 and ends: s = max(0, ends[0] - 0.12)
    if starts and (len(ends) < len(starts) or ends[-1] >= total - 0.05): e = min(total, starts[-1] + 0.3)
    return s, e
for f in sorted(os.listdir(adir)):
    m = re.match(r'audio_(\d+)\.', f)
    if not m: continue
    n = m.group(1); p = os.path.join(adir, f)
    if manual.get(n) == 'skip': print(f'vo_{n} skipped'); continue
    s, e = map(float, manual[n].split(':')) if n in manual else auto(p)
    o = os.path.join(out, f'vo_{n}.wav')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(s), '-to', str(e), '-i', p, '-af',
                    'afade=t=in:d=0.05,areverse,afade=t=in:d=0.25,areverse,loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '2', o], check=True)
    print(f'vo_{n}  trim {s:.2f}-{e:.2f}  dur {probe(o):.2f}s')

#!/usr/bin/env python3
"""Write upload_details.md for the main YouTube video and for every short.
usage: upload_details.py "<edition>"
Needs video/src/upload.json (written by the bot for each edition), shaped like:
{ "main":   {"title": "...", "desc": "...", "tags": "#... #..."},
  "shorts": {"s01": {"title": "...", "desc": "...", "tags": "#...", "credits": ["फ़ोटो: PIB", "संगीत: Mixkit / ..."]}, ...},
  "channel_line": "पूरा बुलेटिन देखें LDS खबर YouTube चैनल पर। ऐसी ही ताज़ा खबरों के लिए फॉलो करें।" }
Chapters come from video/scripts/chapters.mjs; short file names come from src/shorts/config.ts."""
import sys, os, re, json, subprocess
ed = sys.argv[1]; V = os.path.join(ed, 'video')
up = json.load(open(os.path.join(V, 'src/upload.json')))
env = os.environ  # run after: source tools/env.sh (puts node 22 on PATH)
ch = json.loads(subprocess.run(['node', 'scripts/chapters.mjs'], cwd=V, capture_output=True, text=True, env=env).stdout)
# YouTube chapters: first at 0:00, each at least 10 s long, so fold the short opener into the first story
chs = [dict(c) for c in ch['chapters']]
if len(chs) > 1 and chs[1]['at'] < 10: chs = chs[1:]; chs[0]['at'] = 0
keep = []
for i, c in enumerate(chs):
    nxt = chs[i + 1]['at'] if i + 1 < len(chs) else ch['total']
    if keep and nxt - c['at'] < 10: continue  # too short to be its own chapter: stays inside the previous one
    keep.append(c)
ch['chapters'] = keep
mm = lambda s: f'{int(s // 60)}:{int(s % 60):02d}'
cfg = open(os.path.join(V, 'src/shorts/config.ts')).read()
slugs = dict(re.findall(r"id: '(s\d+)', slug: '([^']+)'", cfg))
out = ['# LDS खबर: upload details', '', '## Main video (YouTube, landscape)', '']
m = up['main']
out += [f"**Title:** {m['title']}", '', '**Description:**', '', m['desc'], '', '**Chapters (paste into the description):**', '']
out += [f"{mm(c['at'])} {c['title']}" for c in ch['chapters']]
out += ['', m['tags'], '', '---', '', '## Shorts / Reels (portrait 1080x1920)', '',
        'YouTube Shorts: up to 3 min. Instagram Reels: up to 20 min, but over 3 min is not shown to non-followers. Ours are 30-60 s.',
        'Cover images are in shorts/covers/.', '']
line = up.get('channel_line', 'पूरा बुलेटिन देखें LDS खबर YouTube चैनल पर। ऐसी ही ताज़ा खबरों के लिए फॉलो करें।')
for sid, s in up['shorts'].items():
    out += [f"### {slugs.get(sid, sid)}.mp4", '', f"**Title:** {s['title']}", '', '**Caption / description:**', '', s['desc'], '', line, '']
    if s.get('credits'): out += ['साभार: ' + ' | '.join(s['credits']), '']
    out += [s['tags'] + ' #LDSKhabar #HindiNews #Shorts #Reels', '']
open(os.path.join(ed, 'upload_details.md'), 'w').write('\n'.join(out))
print('written', os.path.join(ed, 'upload_details.md'))

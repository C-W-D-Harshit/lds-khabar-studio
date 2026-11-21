# Align corrected caption text (texts.json) to Whisper word timings, then group into caption chunks.
# Run from anywhere: python3 video/scripts/shorts/align.py [s01 s02 ...]
# Trim windows (t0, t1) are read from src/shorts/config.ts, so keep them in one place only.
# Word timings come from transcripts/audio_NN.json, or from transcripts/fix_NN.json when a story
# needed a cleaner re-transcription (a list of {"w": word, "s": start, "e": end} in voice-clip seconds).
import json, re, difflib, sys, os
VIDEO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ROOT = os.path.dirname(VIDEO)
texts = json.load(open(os.path.join(VIDEO, 'scripts/shorts/texts.json')))
cfg_src = open(os.path.join(VIDEO, 'src/shorts/config.ts')).read()
cfg = {m[0]: (float(m[1]), float(m[2])) for m in re.findall(r"id: '(s\d+)'.*?t0: ([\d.]+), t1: ([\d.]+)", cfg_src)}
out_path = os.path.join(VIDEO, 'src/shorts/captions.json')
out = json.load(open(out_path)) if os.path.exists(out_path) else {}
norm = lambda s: re.sub(r'[^\wऀ-ॿ]', '', s)

def words_for(sid):
    n = sid[1:]
    alt = os.path.join(ROOT, f'transcripts/fix_{n}.json')
    if os.path.exists(alt):
        return [(w['w'], w['s'], w['e']) for w in json.load(open(alt))]
    d = json.load(open(os.path.join(ROOT, f'transcripts/audio_{n}.json')))
    return [(w['word'].strip(), w['start'], w['end']) for s in d['segments'] for w in s['words']]

for sid in (sys.argv[1:] or texts.keys()):
    t0, t1 = cfg[sid]
    ws = [w for w in words_for(sid) if w[1] >= t0 - 0.15 and w[1] < t1]
    # whisper char stream with times
    wchars, wtimes = [], []
    for w, s, e in ws:
        nw = norm(w)
        for i, ch in enumerate(nw):
            wchars.append(ch); wtimes.append(s + (e - s) * i / max(1, len(nw)))
    toks = texts[sid].split()
    cchars, cown = [], []
    for ti, tk in enumerate(toks):
        for ch in norm(tk):
            cchars.append(ch); cown.append(ti)
    sm = difflib.SequenceMatcher(None, wchars, cchars, autojunk=False)
    tstart = [None] * len(toks)
    for a, b, size in sm.get_matching_blocks():
        for k in range(size):
            ti = cown[b + k]
            if tstart[ti] is None: tstart[ti] = wtimes[a + k]
    # interpolate gaps
    known = [(i, t) for i, t in enumerate(tstart) if t is not None]
    for i in range(len(toks)):
        if tstart[i] is None:
            prev = max([k for k in known if k[0] < i], default=(-1, t0), key=lambda k: k[0])
            nxt = min([k for k in known if k[0] > i], default=(len(toks), t1), key=lambda k: k[0])
            tstart[i] = prev[1] + (nxt[1] - prev[1]) * (i - prev[0]) / (nxt[0] - prev[0])
    for i in range(1, len(toks)):  # monotonic
        tstart[i] = max(tstart[i], tstart[i - 1] + 0.05)
    words = [{'w': tk, 's': round(tstart[i], 2), 'e': round(tstart[i + 1] if i + 1 < len(toks) else t1, 2)} for i, tk in enumerate(toks)]
    # chunks
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        L = sum(len(x['w']) + 1 for x in cur)
        gap = (words[i + 1]['s'] - w['s']) if i + 1 < len(words) else 9
        nxt = words[i + 1]['w'] if i + 1 < len(words) else ''
        # keep a short sentence-ending word with its phrase instead of flashing it alone
        absorb = nxt and re.search(r'[।,?!]$', nxt) and len(norm(nxt)) <= 6 and len(cur) < 5 and L + len(nxt) <= 28 and gap < 0.9
        if re.search(r'[।,?!]$', w['w']) or gap > 1.1 or ((len(cur) >= 4 or L > 20) and not absorb):
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    # merge tiny trailing chunks
    res = []
    for c in chunks:
        if res and len(c) == 1 and len(res[-1]) <= 4 and sum(len(x['w']) for x in res[-1]) + len(c[0]['w']) < 26 and c[0]['s'] - res[-1][-1]['s'] < 1.0 and not re.search(r'[।?!]$', res[-1][-1]['w']):
            res[-1] += c
        else:
            res.append(c)
    out[sid] = [{'s': c[0]['s'], 'e': min(c[-1]['e'], c[-1]['s'] + 1.2), 'words': c} for c in res]
    print(sid, len(words), 'words', len(res), 'chunks; matched', sum(1 for t in known), '/', len(toks))
json.dump(out, open(out_path, 'w'), ensure_ascii=False)

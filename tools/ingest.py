#!/usr/bin/env python3
"""Copy the files the family sent into an edition folder, in the order given.
usage: ingest.py "<edition folder>" file1 file2 ...   (pass files in the order they were sent)
Audio -> audio/audio_NN.<ext>, images -> images/image_NN.jpg, videos -> clips/clip_NN.mp4,
.txt notes are appended to messages.txt. Duplicates (same file, or the same voice note forwarded twice) are skipped and reported."""
import sys, os, shutil, subprocess, hashlib
ed = sys.argv[1]; files = sys.argv[2:]
A = {'.m4a', '.mp3', '.ogg', '.opus', '.wav', '.aac', '.amr', '.flac', '.caf'}
I = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.gif', '.avif'}
V = {'.mp4', '.mov', '.m4v', '.3gp', '.webm', '.mkv'}
for d in ['audio', 'images', 'clips']: os.makedirs(os.path.join(ed, d), exist_ok=True)
def nxt(d, prefix):
    return len([f for f in os.listdir(os.path.join(ed, d)) if f.startswith(prefix)]) + 1
def dur(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip()
    try: return f'{float(r):.0f}s'
    except: return '?'
def env(p):
    """Loudness envelope (20 ms steps) to spot the same voice note forwarded twice (bytes differ, sound is the same)."""
    import array
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', '1000', '-f', 's16le', '-'], capture_output=True).stdout
    a = array.array('h'); a.frombytes(raw[:len(raw) // 2 * 2])
    return [sum(abs(x) for x in a[i:i + 20]) / 20 for i in range(0, len(a) - 20, 20)]
def same_sound(x, y):
    if not x or not y or abs(len(x) - len(y)) > 25: return False
    n = min(len(x), len(y)); x, y = x[:n], y[:n]
    mx, my = sum(x) / n, sum(y) / n
    num = sum((a - mx) * (b - my) for a, b in zip(x, y))
    den = (sum((a - mx) ** 2 for a in x) * sum((b - my) ** 2 for b in y)) ** 0.5
    return den > 0 and num / den > 0.9
envs = {f: env(os.path.join(ed, 'audio', f)) for f in sorted(os.listdir(os.path.join(ed, 'audio')))}
seen = {}
for d in ['audio', 'images', 'clips']:
    for f in os.listdir(os.path.join(ed, d)):
        seen[hashlib.md5(open(os.path.join(ed, d, f), 'rb').read()).hexdigest()] = f
log = open(os.path.join(ed, 'messages.txt'), 'a')
for f in files:
    ext = os.path.splitext(f)[1].lower()
    h = hashlib.md5(open(f, 'rb').read()).hexdigest()
    if h in seen:
        print(f'DUPLICATE skipped: {os.path.basename(f)} (same as {seen[h]})'); continue
    if ext in A:
        e = env(f); twin = next((k for k, v in envs.items() if same_sound(e, v)), None)
        if twin:
            print(f'DUPLICATE skipped: {os.path.basename(f)} (sounds the same as {twin})'); continue
        n = nxt('audio', 'audio_'); out = os.path.join(ed, 'audio', f'audio_{n:02d}{ext}'); shutil.copy2(f, out)
        line = f'{os.path.basename(out)} ({dur(out)})  from {os.path.basename(f)}'; envs[os.path.basename(out)] = e
    elif ext in I:
        n = nxt('images', 'image_'); out = os.path.join(ed, 'images', f'image_{n:02d}.jpg')
        if ext in {'.jpg', '.jpeg'}: shutil.copy2(f, out)
        else: subprocess.run(['sips', '-s', 'format', 'jpeg', f, '--out', out], capture_output=True)
        line = f'{os.path.basename(out)}  from {os.path.basename(f)}  caption: '
    elif ext in V:
        n = nxt('clips', 'clip_'); out = os.path.join(ed, 'clips', f'clip_{n:02d}{ext}'); shutil.copy2(f, out)
        line = f'{os.path.basename(out)} ({dur(out)})  from {os.path.basename(f)}'
    elif ext in {'.txt', '.md'}:
        line = 'NOTE: ' + open(f, encoding='utf-8', errors='ignore').read().strip(); out = f
    else:
        print(f'SKIPPED (unknown type): {f}'); continue
    seen[h] = os.path.basename(out); log.write(line + '\n'); print(line)
log.close()

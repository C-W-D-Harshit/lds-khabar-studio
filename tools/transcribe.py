"""Hindi transcription with word timings (mlx-whisper large-v3-turbo, runs locally, no internet).
Run with the studio's whisper python:  "$WHISPER_PY" -I transcribe.py "<edition folder>"
  -> transcripts/audio_NN.json (+ .txt) for every audio file that has no transcript yet.
Fix one messy stretch (Whisper sometimes loops or drops words):
  "$WHISPER_PY" -I transcribe.py "<edition folder>" --fix 06 16.5 29.5
  -> re-transcribes 16.5-29.5 s of audio_06 on its own and writes transcripts/fix_06.json
     (all words of the clip, with that stretch replaced), which the shorts caption tool prefers."""
import sys, os, json, subprocess, tempfile, mlx_whisper
MODEL = os.environ.get('WHISPER_MODEL') or os.path.join(os.path.dirname(os.path.abspath(__file__)), 'whisper/model')
if not os.path.exists(os.path.join(MODEL, 'weights.safetensors')): MODEL = 'mlx-community/whisper-large-v3-turbo'  # downloads once
ed = sys.argv[1]
adir, tdir = os.path.join(ed, 'audio'), os.path.join(ed, 'transcripts')
os.makedirs(tdir, exist_ok=True)
def tx(path):
    return mlx_whisper.transcribe(path, path_or_hf_repo=MODEL, language='hi', word_timestamps=True, condition_on_previous_text=False)
def words(r, off=0.0):
    return [{'w': w['word'].strip(), 's': round(w['start'] + off, 2), 'e': round(w['end'] + off, 2)} for s in r['segments'] for w in s.get('words', [])]
if len(sys.argv) > 2 and sys.argv[2] == '--fix':
    n, a, b = sys.argv[3], float(sys.argv[4]), float(sys.argv[5])
    src = [f for f in os.listdir(adir) if f.startswith(f'audio_{n}.')][0]
    fixp = os.path.join(tdir, f'fix_{n}.json')
    base = json.load(open(fixp)) if os.path.exists(fixp) else words(json.load(open(os.path.join(tdir, f'audio_{n}.json'))))
    with tempfile.TemporaryDirectory() as td:
        seg = os.path.join(td, 'seg.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(a), '-to', str(b), '-i', os.path.join(adir, src), '-ar', '16000', '-ac', '1', seg], check=True)
        new = words(tx(seg), a)
    merged = [w for w in base if w['s'] < a] + new + [w for w in base if w['s'] >= b]
    json.dump(merged, open(fixp, 'w'), ensure_ascii=False)
    print('fix written', fixp); print(' '.join(w['w'] for w in new)); sys.exit()
for f in sorted(os.listdir(adir)):
    stem, ext = os.path.splitext(f)
    if ext.lower() not in {'.m4a', '.mp3', '.ogg', '.opus', '.wav', '.aac', '.amr', '.flac', '.caf'}: continue
    if os.path.exists(os.path.join(tdir, stem + '.json')): continue
    r = tx(os.path.join(adir, f))
    json.dump(r, open(os.path.join(tdir, stem + '.json'), 'w'), ensure_ascii=False)
    open(os.path.join(tdir, stem + '.txt'), 'w').write(r['text'].strip() + '\n')
    print(f, '|', r['text'].strip()[:100], flush=True)
print('ALL TRANSCRIBED')

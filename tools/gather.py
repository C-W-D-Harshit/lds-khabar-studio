#!/usr/bin/env python3
"""Collect the day's files from wherever they were dropped, put them in send order, and bring them
into an edition.

Accepts any mix of:
  - files dragged into Claude (voice notes, photos, videos, .txt notes)
  - folders (searched inside)
  - WhatsApp "Export chat" .zip files or their unzipped folders (uses _chat.txt / WhatsApp Chat*.txt
    for the exact send order, and keeps the typed messages as notes)
  - --inbox      everything in <studio>/inbox/ (moved out afterwards)
  - --recent [H] WhatsApp files saved in ~/Downloads or ~/Desktop in the last H hours (default 36)

usage:
  gather.py --list  [sources...]            show what was found, in order, plus the likely date
  gather.py --into "<edition>" [sources...]  ingest into the edition (see ingest.py), write chat notes
                                             to messages.txt, move inbox files to <edition>/received/

Order: a chat export's own order wins. Otherwise the send time in WhatsApp file names
("WhatsApp Audio 2026-11-20 at 10.15.32.ogg", "00000012-AUDIO-2026-11-20-10-15-32.opus",
"PTT-20261120-WA0003.opus"), then the order given, then modified time."""
import sys, os, re, subprocess, shutil, zipfile, tempfile, time, collections

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.dirname(HERE)
INBOX = os.path.join(STUDIO, 'inbox')
A = {'.m4a', '.mp3', '.ogg', '.opus', '.wav', '.aac', '.amr', '.flac', '.caf'}
I = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.gif', '.avif'}
V = {'.mp4', '.mov', '.m4v', '.3gp', '.webm', '.mkv'}
T = {'.txt', '.md'}
MEDIA = A | I | V

DESK = re.compile(r'(\d{4})-(\d{2})-(\d{2}) at (\d{1,2})\.(\d{2})\.(\d{2})(?: \((\d+)\))?')   # Mac/Win desktop app
IOS = re.compile(r'^(\d{6,})-\w+-(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})')             # iOS export
AND = re.compile(r'^[A-Z]{3}-(\d{4})(\d{2})(\d{2})-WA(\d{4})')                                    # Android
CHAT_NAME = re.compile(r'^(_chat|WhatsApp Chat.*)\.txt$', re.I)


def stamp(p):
    """(sortable time string or None, tie-breaker)"""
    b = os.path.basename(p)
    m = DESK.search(b)
    if m:
        y, mo, d, h, mi, s, n = m.groups()
        return f'{y}{mo}{d}{int(h):02d}{mi}{s}', int(n or 0)
    m = IOS.match(b)
    if m:
        n, y, mo, d, h, mi, s = m.groups()
        return f'{y}{mo}{d}{h}{mi}{s}', int(n)
    m = AND.match(b)
    if m:
        y, mo, d, n = m.groups()
        return f'{y}{mo}{d}', int(n)   # day only; the WA counter orders within a day per type
    return None, 0


def expand(src, tmp):
    """-> (media files, chat txt files, note txt files)"""
    media, chats, notes = [], [], []
    src = os.path.expanduser(src.replace('\\ ', ' ').strip().strip('"').strip("'"))
    if not os.path.exists(src):
        print(f'NOT FOUND: {src}'); return media, chats, notes
    if os.path.isfile(src) and src.lower().endswith('.zip'):
        d = os.path.join(tmp, os.path.splitext(os.path.basename(src))[0])
        with zipfile.ZipFile(src) as z: z.extractall(d)
        src = d
    paths = []
    if os.path.isdir(src):
        for root, dirs, files in os.walk(src):
            dirs[:] = [x for x in dirs if not x.startswith('.') and x != '__MACOSX']
            paths += [os.path.join(root, f) for f in sorted(files) if not f.startswith('.')]
    else:
        paths = [src]
    for p in paths:
        ext = os.path.splitext(p)[1].lower()
        if CHAT_NAME.match(os.path.basename(p)): chats.append(p)
        elif ext in MEDIA: media.append(p)
        elif ext in T: notes.append(p)
    return media, chats, notes


def chat_order(chats, media):
    """Use the export's text: attachment order + typed messages (captions, notes)."""
    names = {os.path.basename(m): m for m in media}
    order, lines = [], []
    for c in chats:
        for raw in open(c, encoding='utf-8', errors='ignore'):
            raw = raw.replace('‎', '').strip()
            if not raw: continue
            hit = next((n for n in names if n in raw), None)
            if hit:
                if names[hit] not in order: order.append(names[hit])
                lines.append(f'[file] {hit}')
            else:
                # drop the "date, time - sender:" prefix, keep the words
                txt = re.sub(r'^\[?[\d/.,\-: ]+(?:[ap]\.?m\.?)?\]?\s*(?:-\s*)?[^:]{1,40}:\s*', '', raw, flags=re.I)
                if txt and 'omitted' not in txt.lower() and 'end-to-end' not in txt.lower():
                    lines.append(txt)
    return order, lines


def recent(hours):
    out, cut = [], time.time() - hours * 3600
    for d in ['~/Downloads', '~/Desktop']:
        d = os.path.expanduser(d)
        if not os.path.isdir(d): continue
        for f in os.listdir(d):
            p = os.path.join(d, f)
            if os.path.isfile(p) and 'whatsapp' in f.lower() and os.path.getmtime(p) > cut:
                if os.path.splitext(f)[1].lower() in MEDIA or f.lower().endswith('.zip'): out.append(p)
    return out


def main():
    args = sys.argv[1:]
    mode = 'list'; ed = None; srcs = []; use_inbox = False; hrs = None
    i = 0
    while i < len(args):
        a = args[i]
        if a == '--list': mode = 'list'
        elif a == '--into': mode = 'into'; ed = args[i + 1]; i += 1
        elif a == '--inbox': use_inbox = True
        elif a == '--recent':
            hrs = 36
            if i + 1 < len(args) and re.fullmatch(r'\d+', args[i + 1]): hrs = int(args[i + 1]); i += 1
        else: srcs.append(a)
        i += 1
    if use_inbox and os.path.isdir(INBOX):
        srcs += [os.path.join(INBOX, f) for f in sorted(os.listdir(INBOX)) if not f.startswith('.')]
    if hrs: srcs += recent(hrs)

    tmp = tempfile.mkdtemp(prefix='lds_gather_')
    media, chats, notes, given = [], [], [], {}
    for s in srcs:
        m, c, n = expand(s, tmp)
        for x in m:
            if x not in given: given[x] = len(given); media.append(x)
        chats += c; notes += n

    corder, clines = chat_order(chats, media) if chats else ([], [])
    def key(p):
        if p in corder: return (0, corder.index(p), '', 0)
        st, n = stamp(p)
        if st: return (1, 0, st, n)
        return (2, given[p], time.strftime('%Y%m%d%H%M%S', time.localtime(os.path.getmtime(p))), 0)
    media.sort(key=key)

    kinds = collections.Counter('audio' if os.path.splitext(m)[1].lower() in A else
                                'photo' if os.path.splitext(m)[1].lower() in I else 'video' for m in media)
    days = collections.Counter((stamp(m)[0] or time.strftime('%Y%m%d', time.localtime(os.path.getmtime(m))))[:8]
                               for m in media if os.path.splitext(m)[1].lower() in A)
    for m in media: print(os.path.basename(m))
    print(f'FOUND: {kinds["audio"]} voice note(s), {kinds["photo"]} photo(s), {kinds["video"]} video(s), '
          f'{len(notes)} note file(s), {len(clines)} chat line(s)')
    if days:
        d = time.strptime(days.most_common(1)[0][0], '%Y%m%d')
        print('CLIP DATE: ' + time.strftime('%-d %b %Y', d))
    if mode == 'list':
        shutil.rmtree(tmp, ignore_errors=True); return
    if not media and not notes:
        sys.exit('nothing to bring in')

    subprocess.run([sys.executable, os.path.join(HERE, 'ingest.py'), ed] + media + notes, check=True)
    if clines:
        with open(os.path.join(ed, 'messages.txt'), 'a') as f:
            f.write('\nCHAT (WhatsApp export, in order):\n' + '\n'.join(clines) + '\n')
        print(f'wrote {len(clines)} chat line(s) to messages.txt')
    rec = os.path.join(ed, 'received'); os.makedirs(rec, exist_ok=True)
    moved = 0
    for s in srcs:
        s2 = os.path.expanduser(s.replace('\\ ', ' ').strip().strip('"').strip("'"))
        if os.path.realpath(s2).startswith(os.path.realpath(INBOX) + os.sep) and os.path.exists(s2):
            dst = os.path.join(rec, os.path.basename(s2)); base, ext = os.path.splitext(dst); k = 2
            while os.path.exists(dst): dst = f'{base} ({k}){ext}'; k += 1
            shutil.move(s2, dst); moved += 1
    if moved: print(f'moved {moved} inbox item(s) to {rec}')
    shutil.rmtree(tmp, ignore_errors=True)


main()

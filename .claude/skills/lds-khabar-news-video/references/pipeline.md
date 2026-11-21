# Pipeline: exact commands

Rules for every shell call:
- Start it with `source "<repo root>/tools/env.sh"` (absolute path; the repo root is where `CLAUDE.md` is). It sets PATH (node 22), `$STUDIO`, `$LDS_EDITIONS`, `$WHISPER_PY` and `$WHISPER_MODEL`.
- Use absolute paths or `cd` inside the same call. Edition paths contain spaces, so always quote them.
- Run anything longer than a minute with `nohup ... > /tmp/<job>.log 2>&1 &` (or the Bash tool's background option) and check the log in a later call. Never sit in a sleep loop.

Variables used below:
```
E="$LDS_EDITIONS/News Video - 22 Nov 2026"     # the edition folder (date of the clips), inside videos/
T="$STUDIO/tools"
```

## 1. Edition folder
```
zsh "$T/new_edition.sh" "22 Nov 2026"
```
This creates `$E` with these folders:
- audio, images, clips, sourced, transcripts
- moodboard/stills
- shorts/covers
- video/, a clone of the engine with public img, sm, bg, vo and vid emptied

If the folder already exists it does nothing, which is safe to re-run.

## 2. Bring in the family's files
Files dragged into the window arrive as paths in the message (spaces may show as `\ `; quote each path). Pass every path they dropped, in the order given; folders and WhatsApp export `.zip` files work too:
```
python3 "$T/gather.py" --list <path1> <path2> ...           # order + counts + CLIP DATE, changes nothing
python3 "$T/gather.py" --into "$E" <path1> <path2> ...      # bring it all in
```
Other places to look when nothing was dropped: `--inbox` (the repo's inbox/, moved to `$E/received/` afterwards) and `--recent [hours]` (WhatsApp files in Downloads/Desktop, default last 36 h). The originals they dropped are copied, never moved or deleted.

Order rules: a chat export's own order wins; then the send time in WhatsApp file names (desktop app, iPhone export and Android names are all understood); then the order given. `ingest.py "$E" <files...>` is the lower-level tool if you need to add one file by hand.
If the order looks wrong (the goodbye clip early, the welcome late), listen to the first seconds of each clip's transcript and renumber before going on.
What it does:
- Audio goes to `audio/audio_NN.<ext>`.
- Photos go to `images/image_NN.jpg`; HEIC, PNG and WEBP are converted.
- Videos go to `clips/clip_NN.<ext>`.
- `.txt` files are appended to `messages.txt`.
- It skips exact duplicates and the same voice note forwarded twice, and prints what it did.

Then edit `messages.txt` by hand and add each photo's caption and any typed notes from this conversation next to the right line.

**Story numbering:**
- Story `sNN` is voice clip `audio_NN` and becomes `vo_NN.wav`. Keep that mapping; the caption aligner relies on it.
- If one clip holds two stories, keep one story id per clip and show both topics inside it with beats.

## 3. Transcribe (offline, about 1 minute per 5 minutes of audio)
```
cd "$E" && nohup "$WHISPER_PY" -I "$T/transcribe.py" "$E" > /tmp/tx.log 2>&1 &
```
This writes `transcripts/audio_NN.json` (with word timings) and `.txt` for every clip that has no transcript yet.

Read every `.txt` and watch for:
- repeated phrase loops (Whisper hallucination)
- missing chunks
- English words mangled into Hindi

To fix one stretch:
```
"$WHISPER_PY" -I "$T/transcribe.py" "$E" --fix 06 16.5 29.5     # clip 06, 16.5 s to 29.5 s
```
This writes `transcripts/fix_06.json`, which the caption aligner prefers.

## 4. Script and rundown
Write two files:
- **`$E/script.md`**: for each story, the clean Hindi text Lata actually says, with Whisper spelling fixed (प्रमुख, not प्रमुक). This is also the source of the short captions.
- **`$E/rundown.md`**: for each story, the id, tag, headline, sub line, key facts and numbers, mood, the visuals and graphics planned, and the sources to find.

Then write `video/scripts/shorts/texts.json`, which maps `{"s01": "<clean text of clip 01>", ...}`.

## 5. Research and sourcing
Use 3 parallel subagents with the briefs in [sourcing-and-review](sourcing-and-review.md). Their output goes to:
- **Photos:** `$E/sourced/sNN_<word>/sNN_01.jpg ...`. Folder names use a short English word, e.g. `s02_cyclone`.
- **Credits:** `$E/sourced/credits_A.json`, `credits_B.json` and `credits_C.json`.
- **Viral or source videos:** `$E/sourced/sNN_<word>/viral_clip_*_source.mp4`.

## 6. Prepare media
```
python3 "$T/prep_voice.py" "$E"                         # auto-trim silence for all clips
python3 "$T/prep_voice.py" "$E" 01:0.6:55.6 15:skip      # exact trims / skip a clip
python3 "$T/prep_images.py" "$E"                         # sourced + family photos -> public img/sm/bg + dims.json
```
- `prep_voice` prints `dur` for each clip. Put that number in `content.ts` as the story's `dur`.
- Listen-check the trims. A trim must never cut a word, and the end of one clip must not repeat the start of the next.
- `prep_images` flags PORTRAIT and SMALL images. Use portrait images in split or phone layouts, never stretched full-screen.

In code, refer to images as `'s02_cyclone/s02_01.jpg'` or `'wa/image_01.jpg'` for the family's photos.

**Viral or family video clips** go into `video/public/vid/<name>.mp4`. Keep the natural audio:
```
ffmpeg -y -i in.mp4 -vf "scale=-2:'min(1280,ih)'" -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -ar 48000 "$E/video/public/vid/<name>.mp4"
```

**Maps:**
- Map views live in `video/scripts/geo.mjs` (bbox, states, district, pins) and are written to `src/data/geo.json`.
- To add a district, regenerate `scripts/geodata/districts.json` first:
```
cd "$E/video" && npx mapshaper -i scripts/geodata/india.geojson -filter '["Bulandshahr","Pauri Garhwal","<New>"].indexOf(district)>-1' -simplify 40% keep-shapes -o scripts/geodata/districts.json format=geojson
node scripts/geo.mjs
```

## 7. Code the edition
See [engine-guide](engine-guide.md). After editing:
```
cd "$E/video" && npx tsc --noEmit
```

## 8. Stills and mood board
```
cd "$E/video" && node scripts/stills.mjs 3 6 12 30 ... > /tmp/stills.log 2>&1     # seconds on the main timeline
zsh "$T/contact_sheet.sh" "$E"                                                 # moodboard/sheet_*.jpg
```
- `node scripts/chapters.mjs` prints where each story starts. Pick 1 or 2 stills per beat, plus the opener, bumpers and outro.
- Look at every still yourself with Read, using a downsized copy via `sips -Z 900`, before the reviewers do.

## 9. Render the main video (about 15 to 25 min)
```
cd "$E/video" && nohup node scripts/render.mjs > /tmp/render.log 2>&1 &
```
- Progress is logged every 5%. Output is `$E/<OUTPUT_FILE from content.ts>`.
- Use the Node API scripts only. `npx remotion render` fails here with "Target closed".
- Then run:
```
zsh "$T/check_media.sh" "$E"/LDS_Khabar_*.mp4
```
- **Expect:** 1920×1080, 30 fps, AAC audio, mean volume around -18 to -22 dB, max at or below -1 dB.
- Pull frames to check with `ffmpeg -ss <sec> -i file -frames:v 1 /tmp/f.png`.

## 10. Shorts
```
cd "$E/video" && python3 scripts/shorts/align.py                       # captions.json from texts.json + word timings
node scripts/shorts/stills.mjs s02:3,15,30 s11:5 > /tmp/ss.log 2>&1    # preview frames (sec in the short) -> $E/shorts/_preview
nohup node scripts/shorts/render.mjs > /tmp/shorts.log 2>&1 &          # all shorts + covers (or list ids)
```
Delete `shorts/_preview` before delivery.

## 11. Thumbnail and upload text
```
cd "$E/video" && node scripts/thumb.mjs <sec> "$E/thumbnail.jpg"        # 1280x720
python3 "$T/upload_details.py" "$E"                                      # needs video/src/upload.json
```

## 12. Show it to the family
```
open "$E"                                  # Finder window with everything
open "$E"/LDS_Khabar_*.mp4                 # plays in QuickTime
open "$E"/moodboard/stills/<3 or 4 best>.png
```
`chat_preview.sh in.mp4 out.mp4` makes a small 540p copy (under 22 MB) if they want one to send on WhatsApp.

## Finished edition layout (what the family gets)
```
News Video - 22 Nov 2026/
  LDS_Khabar_22Nov2026.mp4     main YouTube video
  thumbnail.jpg
  upload_details.md            titles, descriptions, chapters, hashtags
  shorts/NN_slug.mp4           one per story, portrait
  shorts/covers/NN_slug.jpg
  audio/ images/ clips/ sourced/ transcripts/ moodboard/ video/   (working files)
```

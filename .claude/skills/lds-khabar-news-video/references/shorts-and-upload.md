# Shorts, Reels, thumbnail and upload text

## Platform limits (checked Nov 2026)
- **YouTube Shorts:** vertical 9:16, up to 3 minutes.
- **Instagram Reels:** up to 20 minutes, but Reels over 3 minutes are not recommended to non-followers.
- **What gets watched:** 30 to 60 s. LDS खबर shorts are always **under 60 s**, at 1080×1920 and 30 fps, encoded h264 yuv420p with AAC audio.

The same file works for both platforms.

## Which stories become shorts
Normally every news story and every viral clip becomes a short; 21 Nov had 12. Usually skip:
- the generic outro
- the viral "wrap"

The day intro (panchang or festival) makes a good short if it has real content.

**Somber story:** keep it respectful.
- `panel` mode.
- No music. `Short.tsx` follows the story's mood.
- No emoji in the title.

## Steps
1. Add one `SHORTS` entry per story in `src/shorts/config.ts`:
   - `slug`: `NN_english_words`, e.g. `02_cyclone_akvan`.
   - `title`: two short lines. Line 1 is white, line 2 is yellow and is the hook.
   - `sub`: the key number or fact.
   - `t0` / `t1`: from the word timings. Start on the first real word of the story and end after the last sentence; drop "पहली खबर..." and "अब चलते हैं..." links.
   - `mode`: `panel`, or `vertical` plus `video` and `credit` for vertical source clips.
   - Optional `callouts`.
2. Put the clean spoken text for each story in `scripts/shorts/texts.json`.
3. Run `python3 scripts/shorts/align.py`.
   - It maps the clean text onto Whisper's word timings and writes caption chunks to `src/shorts/captions.json`.
   - If a story's captions drift, fix that clip's transcript with `transcribe.py --fix` and re-align.
4. Preview stills with `node scripts/shorts/stills.mjs sNN:2,15,30`. Check:
   - caption breaks: no lone "है।" or single word
   - title fit, credit and logo
5. Render with `node scripts/shorts/render.mjs`. Output goes to `shorts/<slug>.mp4` and `shorts/covers/<slug>.jpg`.
6. Run `check_media.sh shorts/*.mp4`: every file 1080×1920, under 60 s, with audio.

## Thumbnail (main video)
- Run `node scripts/thumb.mjs <sec> <edition>/thumbnail.jpg` (1280×720). Pick the frame with:
  - the strongest single image
  - a big readable headline
  - the brand chrome visible
- Usually this is the biggest story's first beat, or a market or data graphic with big numbers.
- **To beat 21 Nov**, add a dedicated `Thumbnail` composition (1280×720) in `Root.tsx`. Use:
  - a huge 2 to 4 word Hindi headline in Khand 700 with a yellow or white stroke
  - one cut-out-style photo
  - the logo
  - a red "आज की बड़ी खबरें" tag

  Render it with `renderStill`. Keep it honest: no fake shock faces or misleading claims.

## upload.json, then upload_details.md
Write `video/src/upload.json`. The 21 Nov version in the engine is the example.

```json
{
 "main": {"title": "...", "desc": "...", "tags": "#LDSKhabar #HindiNews ..."},
 "shorts": {"s02": {"title": "...", "desc": "...", "tags": "#...", "credits": ["फ़ोटो: PTI, NOAA / VIIRS", "संगीत: Mixkit / Grigoriy Nuzhny"]}},
 "channel_line": "पूरा बुलेटिन देखें LDS खबर YouTube चैनल पर। ऐसी ही ताज़ा खबरों के लिए फॉलो करें।"
}
```

**Main title:**
- Hindi, under 100 characters.
- 3 or 4 biggest stories separated by " | ", then "LDS खबर <date>".

**Main description:**
- One paragraph listing every story, plus the viral disclaimer.
- "साभार (फ़ोटो/वीडियो):" followed by every credit.
- "संगीत: Mixkit (...)".

**Short titles:**
- Under about 70 characters, with at most one emoji.
- Somber: no emoji except 🙏.

**Short descriptions:**
- The key facts and caveats ("पुष्टि नहीं", "आंशिक", "यह निवेश सलाह नहीं है").

**Hashtags:**
- 5 or 6 specific ones per short; the tool adds `#LDSKhabar #HindiNews #Shorts #Reels`.
- 8 to 10 for the main video.

Then run `python3 "$T/upload_details.py" "$E"`. It writes `<edition>/upload_details.md` with:
- chapters for the main video, YouTube-valid: the first at 0:00 and each at least 10 s
- every short's text, in order

Read it back once.

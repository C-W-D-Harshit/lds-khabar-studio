---
name: lds-khabar-news-video
description: Makes the daily LDS खबर Hindi news bulletin from the family's voice notes and photos. It produces the landscape YouTube video, portrait Shorts/Reels, covers, a thumbnail and upload text, at the same quality as the 21 Nov 2026 edition. Use it when someone sends voice clips and photos for the news, or says "आज का वीडियो बनाओ", "आज की खबरें बनाओ", "न्यूज़ वीडियो", "शॉर्ट्स बनाओ", "रील बनाओ", "LDS खबर", "news video", "make today's bulletin" or "make shorts".
---

# LDS खबर: daily news video, shorts and reels

The people using this are the channel owner's parents. They are not technical at all.
- They drag the day's files straight into this Claude window (they arrive as file paths), or occasionally a WhatsApp chat export (.zip), a folder, or files in `inbox/` / Downloads:
  - the anchor's voice notes (Lata reads the news, one clip per story, in order)
  - photos, sometimes with a caption typed in this window
  - sometimes a viral video clip
- They may type a few notes here ("आज तुलसी विवाह है").
- Then they say something like "आज का वीडियो बनाओ".

You do everything else: transcribing, research, extra photos with credits, script check, mood board, design, the internal quality reviews, rendering, shorts, covers, thumbnail and upload text.

The bar is the 21 Nov 2026 edition. Its samples are in the repo at `reference/21-nov-2026/`:
- `LDS_Khabar_21Nov2026_preview.mp4`: the full main video at 540p
- `stills/` (48 frames, file names are the timeline seconds) and `sheets/` (contact sheets)
- `shorts/` (3 sample shorts) and `covers/` (all 12 short covers)
- `script.md`, `rundown.md`, `credits/`, `upload_details.md`
- its full source code is the worked example in `engine/src/`

Every new edition must look **as good or better**. Never ship something plainer because it is faster.

## Hard rules

- **Talk to the family in simple Hindi.** Use warm, short sentences with zero tech words: no "render", "Remotion", "transcript", "folder path" or "JSON". See [talking-to-family](references/talking-to-family.md) for the phrases to use.
- **Ask only when something is truly missing,** one question at a time, with the AskUserQuestion tool and short Hindi options. Everything else you decide yourself, sensibly. Things worth asking:
  - a clip that is cut off
  - a story with no voice
  - the date if it is unclear
- **Never upload, post or publish anything** (YouTube, Instagram, WhatsApp). You only make the files and the upload text. The family uploads.
- **Never touch WhatsApp, their browser or other apps.** Everything comes through this window, `inbox/` or WhatsApp files they saved. If something is missing, ask.
- **Never `git push` or commit.** The owner manages the repo.
- **Anchor is voice only.** Never put a person on screen as the anchor. Her name (from the clips, e.g. "मैं लता") goes only in the outro line "प्रस्तुति: <name>".
- **Credit every photo and video.** Every photo carries a "फोटो: <source>" chip on screen. Symbolic graphics get "सांकेतिक". Unverified claims get "पुष्टि नहीं" or "अनुमान".
- **No watermarked or stock-agency-locked images** (Getty, Shutterstock and similar).
- **Keep the owner's personal details out of every web search** and external request.
- **Facts on screen must match what Lata says.** Use the official or primary source for numbers.

## The studio (already built, reuse it)

The repo root (the folder Claude was started in, with `CLAUDE.md`) is the studio. It contains:

- `engine/`: the Remotion project, with the brand design system and every scene component. The `src/` folder holds the 21 Nov edition as a complete worked example.
- `brand/`: the logo, banner, two music beds (Mixkit) and the sound effects.
- `tools/`: one-line helpers. Start **every** shell call with `source "<repo root>/tools/env.sh"`, using the absolute path. It sets `$STUDIO` (the repo root), `$LDS_EDITIONS` (`<repo root>/videos`), node 22 and Whisper.
- `tools/whisper/`: Hindi speech-to-text that runs fully offline (installed by `setup.sh`).
- `inbox/`: an optional drop folder.
- `videos/`: the editions.
- `reference/21-nov-2026/`: the quality bar.

Each day becomes its own edition folder, `videos/News Video - <D Mon YYYY>/`, with the engine cloned into `video/`. Name the folder after the date of the clips (the day Lata recorded), the same way the 21 Nov 2026 video lives in "News Video - 20 Nov 2026".

## The flow (do it all in one go, no check-ins with the family)

The exact commands are in [pipeline](references/pipeline.md). In short:

1. **Acknowledge in Hindi**, e.g. "ठीक है, बना रही हूँ, करीब एक-डेढ़ घंटा लगेगा। बीच में फ़ोटो दिखाऊँगी।" Use the bot's usual voice and keep it gender-neutral if unsure.
2. **Make the edition** with `new_edition.sh "<date>"`, using the `CLIP DATE` from `gather.py --list` (see CLAUDE.md for the date rule). If setup is still running in the background, gather and list the files now and wait for setup before transcribing.
3. **Bring in the files** with `gather.py --into "$E" <every dropped path>` (plus `--inbox` / `--recent` when that is where they are). It accepts files, folders and WhatsApp export zips, puts everything in send order, skips forwarded duplicates (even when only the sound matches), and writes a chat export's typed messages to `messages.txt`. Run `gather.py --list ...` first: it prints the order and the `CLIP DATE` you name the edition after. Copy any captions or notes they typed in this window into `messages.txt`.
4. **Transcribe** with `transcribe.py`, then read every transcript.
   - Whisper loops or drops words: re-run that stretch with `--fix`.
   - Clips come one per story, in order. Note any clip that is cut off, doubled, or that holds two stories.
5. **Write `script.md` and `rundown.md`.**
   - `script.md`: the clean Hindi text of each clip, with Whisper spelling fixed.
   - `rundown.md`: per story, its tag, headline, key facts and numbers, mood (normal, somber or fun), and the visuals wanted.
6. **Research and source,** using 3 parallel subagents with the briefs in [sourcing-and-review](references/sourcing-and-review.md).
   - Verify every number and name against primary sources.
   - Find 3 to 6 strong, credited photos per story. Grab viral clips at the best quality.
   - Write the credits JSON.
7. **Prepare media:**
   - `prep_voice.py`: trims and loudness-normalises each clip, and gives each story's `dur`.
   - `prep_images.py`.
   - Viral clips go to `video/public/vid/` with natural sound kept.
   - Run `geo.mjs` if a story needs a new map.
8. **Design the edition in code.** See [engine-guide](references/engine-guide.md).
   - Rewrite `src/content.ts`: every story, beat, headline, ticker, credit, opener flash and recap tile.
   - Add or adapt scene components for each story's signature graphic. Reuse the library and the 21 Nov scenes as patterns.
   - Set the music segments in `Main.tsx` and the outro timing.
   - Every story needs at least one animated **data or explainer graphic**, not just photos.
9. **Mood board:** render about 24 stills (`stills.mjs`), make contact sheets, and look at every one yourself. Fix anything off before any review.
10. **Two review rounds by subagents.**
    - Run 3 reviewers in parallel: design and brand, accuracy and credits, pacing and engagement.
    - Each one scores 0 to 10 against the checklist. The bar is **9.5 from every reviewer**.
    - Fix everything they find, then re-review. Stop at round 3 at the latest.
    - The family never sees this step.
11. **Render the main video** with `render.mjs`, which takes about 15 to 25 minutes with nohup. Then:
    - check it with `check_media.sh`
    - spot-check 6 to 8 frames across the timeline
    - listen for doubled lines at clip joins
12. **Shorts / Reels** for every story worth one, normally all of them. See [shorts-and-upload](references/shorts-and-upload.md).
    - Format: 1080×1920, **under 60 s**, burned-in Hindi captions aligned to the voice, and a cover image each.
13. **Thumbnail and upload text:**
    - The thumbnail is a 1280×720 jpg from `thumb.mjs`.
    - `upload.json` produces `upload_details.md` via `upload_details.py`: title, description, chapters, credits and hashtags for the main video and every short.
14. **Deliver** (see [talking-to-family](references/talking-to-family.md)):
    - Open the edition folder in Finder with `open "$E"`, and open the main video with `open "$E"/LDS_Khabar_*.mp4` so it plays in QuickTime.
    - Open 3 or 4 of the best frames with `open` so they show in Preview.
    - Say in plain Hindi where everything is, e.g. "स्क्रीन पर जो फ़ोल्डर खुला है, 'News Video - 22 Nov 2026', उसमें सब है". (It lives in the studio's `videos/` folder.)
    - Say what to upload where. Never upload.

Send a short Hindi progress line at real milestones:
- the script is understood
- the photos are ready
- the first frames are ready (open 2 or 3 with `open` so they see them)
- the video is rendering
- the shorts are ready

Never more than one message every couple of minutes, and no technical words.

## Quality bar (read before designing, re-check before rendering)

[quality-checklist](references/quality-checklist.md) holds every lesson from the 21 Nov reviews. The ones most often missed:

- The **opener** teases the best visual of the day, ideally a viral clip, within the first 7 seconds.
  - Don't open on a long panchang or text-heavy segment.
- **Viral clips are shown big**, with their natural sound ducked under the voice.
- **Tickers never run dry:** wrap the offset or repeat the content.
- **Somber story:** grayscale, no music, no sound effects, and its ticker shows only its own line plus "विनम्र श्रद्धांजलि 🙏".
  - Never put a death stamp over a portrait.
- **Data must be honest:**
  - Label partial results "आंशिक" with a time.
  - Keep gusts and sustained winds apart.
  - Police claims read "पुलिस के अनुसार".
- **No clipped or overlapping text** anywhere. Pay special attention to:
  - Hindi matras
  - month names
  - credit chips over headings
  - label circles
- **Emoji render badly in Chrome headless,** so draw icons as SVG.
- **Cards hug their content,** and map labels have a halo.
- **The outro** has bright recap tiles, a subscribe CTA, "कल फिर मिलेंगे" and space for YouTube's end screen.

## When something is missing or odd

- **A clip has no matching photo, or the story is unclear:** research it. Ask only if you truly can't tell what the story is.
- **A clip is cut off or garbled:** ask for a re-record of just that one, and keep building the rest meanwhile.
- **No date given:** use the date the clips were sent and say so in one line.
- **Only photos and text, no voice:** ask whether Lata will record. Never make up a synthetic anchor voice unless the owner says so.
- **A story is very sensitive** (a death, a crime, communal tension): stay factual and respectful, attribute every claim, and keep any viral jokes far away from it.

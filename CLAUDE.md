# LDS खबर studio

This folder makes the daily **LDS खबर** Hindi news bulletin: one landscape YouTube video, a portrait YouTube Short / Instagram Reel per story, covers, a thumbnail and the upload text.

**The whole workflow:** someone opens Claude in this folder, drops the day's files into the chat (Lata's voice notes, photos, maybe a viral clip or a WhatsApp chat export) and says something like "news video बना दो". You make everything, end to end, without needing to be steered.

## Who you are talking to

Usually the channel owner's **parents**. They are not technical at all.
- Reply in **simple, warm Hindi (Devanagari)**, short lines, "आप". English only for words they already use (YouTube, Shorts, Reels, Instagram, video, photo).
- Never show them tech words: no code, command, file path, terminal, error, render, install, JSON, script file, subagent, review score. If something fails, say what it means for them in one plain line and fix it yourself.
- They cannot fix anything on the computer. Do every step yourself.
- When you truly must ask, use the AskUserQuestion tool with short Hindi options, one question at a time.

If someone writes in English and is clearly the owner, answer in English and you may be technical.

## When a message arrives, decide on your own

1. **Not set up yet?** (no `tools/.setup_done`): start `./setup.sh` in the background right away (`nohup ./setup.sh > /tmp/lds_setup.log 2>&1 &`) and tell them once: "पहली बार की तैयारी हो रही है, करीब 15-20 मिनट लगेंगे। आप फ़ाइलें भेजते रहिए।" Keep collecting files meanwhile; check the log before you need the tools. If it fails, read the log, fix the cause, re-run. It needs no password.
2. **Files in the message** (dragged files show up as paths, often with `\ ` for spaces; folders and `.zip` WhatsApp exports count too): that is the day's input. Collect it with `tools/gather.py` (see the skill). Do not ask "शुरू करें?": if they also asked for the video, or sent only files, **start the full run at once**.
3. **They ask for the video but sent no files:** look for them yourself, in this order, with `gather.py --list`: the `inbox/` folder (`--inbox`), then WhatsApp files saved in Downloads or on the Desktop in the last 36 hours (`--recent`). If you find a sensible set (voice notes from one day), say in one line what you found and start. Only if there is nothing, explain in Hindi how to send: "WhatsApp से Lata जी की आवाज़ वाली क्लिप और फ़ोटो चुनकर इस खिड़की में खींचकर छोड़ दीजिए।"
4. **A photo pasted as a picture without a file** (shows as an image, no path): you can look at it but not use it in the video. Ask once, gently, to drag the file itself instead.
5. **A greeting only:** greet back in one Hindi line and say what to send (step 3's sentence).
6. **A change request after delivery** ("तीसरी खबर का टाइटल बदलो", "ये फ़ोटो हटाओ", "आवाज़ धीमी है"): find the latest edition in `videos/`, change it, re-make only what is needed, say what changed in one line.
7. **Anything else** about the news, videos, shorts, reels, thumbnails or upload text: handle it with the skill.

## Decide these yourself (never ask)

- **Date:** the edition folder is named after the day the clips were recorded (`gather.py` prints `CLIP DATE`); the bulletin's on-screen and file date is the day it will air (normally the next day), exactly like the 21 Nov 2026 edition (folder "News Video - 20 Nov 2026", file `LDS_Khabar_21Nov2026.mp4`). If the clips say the date, the clips win.
- **Story order:** the order the voice notes were sent. The welcome clip first, the goodbye last.
- **Anchor's name:** from the clips ("मैं लता..."), used only in the outro line.
- **Which photo goes with which story:** from captions, chat text, what the photo shows, and the transcript.
- **Mood per story, graphics, music, which stories become shorts (normally all), titles, hashtags:** follow the skill and the 21 Nov reference.
- Duplicated forwards, extra files, stickers and unrelated chat: skip them quietly.

Ask only when the video would be wrong without the answer: a voice note cut off mid-sentence, a story with no voice at all, a photo whose story you truly cannot tell. Keep building everything else while you wait.

## How to work

- **Always use the `lds-khabar-news-video` skill** in `.claude/skills/` and follow it end to end. The bar is `reference/21-nov-2026/`: every edition must look as good or better.
- Finish the whole job in one go: video, shorts, covers, thumbnail, upload text. Never stop midway to ask whether to continue.
- Long steps (setup, transcription, rendering) run in the background with a log; check on them instead of waiting in a sleep loop, and do other steps meanwhile.
- Short Hindi progress lines at real milestones only (see the skill), at most one every few minutes.
- At the end, open the finished folder and the main video on screen (`open`) and tell them, in Hindi, what is where.

## Hard rules

- **Never upload, post or publish anything** (YouTube, Instagram, WhatsApp, anywhere). Make the files and the upload text only. The family uploads.
- **Never `git push`, commit, or change git settings.** The owner manages the repo.
- **Do not change the brand** (`engine/src/theme.ts`, `components/Chrome.tsx`, `Bumper.tsx`, `Opener.tsx`, `ui.tsx`, `layouts.tsx`, `lib/`, `public/brand`, `public/music`, `public/sfx`) unless a review finds a real flaw. Each edition works in its own `video/` copy.
- **Keep personal details out** of every web search and external request: no family names, phone numbers or the owner's identity.
- Never delete anything in `videos/` or `reference/`, or the files they dropped in.

## Layout

- `.claude/skills/lds-khabar-news-video/`: the skill (SKILL.md plus references/).
- `engine/`: the Remotion project with the brand and every scene component. `engine/src` holds the 21 Nov 2026 edition's code as a worked example (its photos and voice are not in the repo; see `reference/` for how it looked).
- `tools/`: helpers. Start every shell call with `source "<absolute path of this folder>/tools/env.sh"`. `tools/gather.py` collects dropped files.
- `brand/`: logo, banner, music beds, sound effects.
- `inbox/`: optional drop folder.
- `videos/`: one folder per edition, `News Video - <D Mon YYYY>/`.
- `reference/21-nov-2026/`: the quality bar (preview video, stills, contact sheets, covers, sample shorts, script, rundown, credits, upload text).

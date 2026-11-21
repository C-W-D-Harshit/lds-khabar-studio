# Sourcing, fact-check and review subagents

Use the Agent tool with `general-purpose` subagents, 3 in parallel (all three calls in one message). Split the stories into three groups (A, B and C) of similar size and put the viral clips in one group.

Every brief must stand alone. Paste in:
- the story's clean script text from `script.md`
- the edition date
- the exact output folder

**Never** include the channel owner's or the family's names, phone numbers or any personal detail in a search.

## Sourcing brief (template)

> You are the photo and fact desk for a Hindi YouTube news bulletin dated **<D Month YYYY>**. For each story below:
>
> **1. Verify the facts.** Find 2 or more reliable sources. Prefer primary ones:
> - PIB and ministry sites
> - IMD and RBI
> - BSE/NSE
> - the State Election Commission
> - sports federations
> - Reuters, PTI, ANI, The Hindu, Indian Express, Hindustan Times, NDTV, Amar Ujala, Dainik Bhaskar
>
> List every number, name and time with its source URL. Flag anything where the anchor's script disagrees with the sources, and anything still developing or partial.
>
> **2. Find 3 to 6 strong photos for the story.**
> - Size: at least 1600 px on the long side where possible.
> - Priority:
>   1. photos of the actual event, from news agencies via the article's og:image or the official handle on X
>   2. official sources (PIB, ministries, police handles, team or federation)
>   3. Wikimedia Commons or other CC images of the place, person or topic
>   4. NASA/NOAA and other public-domain imagery
> - **No** Getty, Shutterstock, Alamy, iStock or stock watermarks.
> - **No** images whose main subject is a TV channel's logo or lower-third.
> - **No** AI-generated images presented as real.
> - Skip blurry or tiny images and memes.
>
> Download them with curl, using a normal browser User-Agent string and no personal details, into:
> `<edition>/sourced/sNN_<word>/sNN_01.jpg`, `sNN_02.jpg`, ... in order of usefulness.
>
> Confirm each file opens and note its pixel size (`sips -g pixelWidth -g pixelHeight`).
>
> **3. Viral clips.** Find the original post and download the best quality with `yt-dlp -f "bv*+ba/b" -o "<edition>/sourced/sNN_<word>/viral_clip_<name>_source.%(ext)s" <url>`. Note:
> - the handle, for the credit
> - whether the place, date or authenticity is verified (usually not)
> - one frame saved as a jpg, e.g. `viral_frame_<name>_720x1280.jpg`, using `ffmpeg -ss 3 -i <clip> -frames:v 1 <jpg>`
>
> **4. Write `<edition>/sourced/credits_<A|B|C>.json`.** It is a list of:
> `{"file": "sNN_word/sNN_01.jpg", "story": NN, "what": "<what the photo shows>", "credit": "<Agency / photographer as it should appear on screen>", "license_note": "CC BY-SA 4.0 | agency handout | official X post | file photo | PD", "url": "<page url>", "width": W, "height": H, "is_this_event": true|false}`
>
> - Mark old photos `"(फाइल)"` in the credit when `is_this_event` is false and they show a person or place from an earlier date.
>
> **5. Return** a short report covering:
> - the verified facts per story, with sources
> - disagreements with the script
> - the photos and what each shows
> - suggested on-screen graphics, e.g. "a wind gauge: sustained 70-80, gusts 90", "a seat tally with 'partial as of 4:45 pm'"
>
> Stories:
> **sNN: <headline guess>.** Script: "<clean Hindi text>". Family photo(s): <what they show, if any>. Notes from the family: <...>

After the subagents return:
1. Open a few downloaded images yourself to check they are the right subject and not watermarked.
2. Check the totals: every story has enough images, and the day intro has festival or puja images if needed.
3. Re-source anything weak yourself.

## Fact disagreements
If the script contradicts verified sources:
- **Small slip** (a number or a name): show the correct fact on screen. Keep the voice, since we can't re-record without the family. Tell the owner in the final message in one line, e.g. "Lata ने 898 कहा, स्क्रीन पर 897.96 लिखा है". Address the owner, not the parents.
- **Big error** (the wrong person or a wrong death): stop and ask the family in simple Hindi whether to drop the story or re-record it.

## Review round brief (template)

Run 3 reviewers in parallel, each with **only** its own lens. Give each one:
- the paths to `moodboard/sheet_*.jpg` and about 24 full-size stills in `moodboard/stills/` (file names are the timeline seconds)
- `video/src/content.ts`, `script.md`, the `sourced/credits_*.json` files and `rundown.md`
- `reference/21-nov-2026/stills/` and `sheets/` (absolute paths) as the reference bar for "as good or better"
- the full quality checklist (paste it in from quality-checklist.md)

> You are a senior producer at a top Hindi news channel (Aaj Tak, ABP, Zee level), reviewing tomorrow's YouTube bulletin before it airs. Your lens: **<Design & brand | Accuracy, credits & ethics | Pacing & engagement>**.
>
> Score it 0 to 10, where 9.5 means "ready for a premium channel". List every issue as: `[severity: blocker/major/minor] <timestamp or file> — <what is wrong> — <exact fix>`. Check every item of the checklist that belongs to your lens.
>
> Then name the 3 changes that would most raise the score. Be strict: a single clipped word, a missing credit or a wrong number is at least "major".
>
> Do not edit any files.

After each round:
1. Fix every blocker, major and minor issue.
2. Re-render the affected stills.
3. Look at them yourself.
4. Run the next round with the list of what changed.

Stop when all three reviewers score 9.5 or more, or after round 3.

The family never hears about rounds or scores. If the owner asks, share the scores.

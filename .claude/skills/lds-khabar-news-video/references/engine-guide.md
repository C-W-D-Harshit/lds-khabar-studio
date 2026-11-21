# Engine guide: what to change per edition and what never to change

The engine is a Remotion 4 project. The video is 1920×1080 at 30 fps; the shorts are 1080×1920.

The 21 Nov 2026 edition inside `video/src/` is the worked example:
- Read `content.ts` and two or three scenes before writing new ones.
- A 540p copy of the finished result is `reference/21-nov-2026/LDS_Khabar_21Nov2026_preview.mp4`.
- Its frames are in `reference/21-nov-2026/stills/` (named by timeline second) and `sheets/`.

## Never change (the brand)
- `theme.ts`: fonts and colours.
  - Khand is for headlines, Mukta for body text, Teko for numbers.
  - Navy #0B1F4D, red #E0141E, yellow #FFC915, green #16C76A.
- `components/Chrome.tsx`: the on-air frame.
  - Date block, navy headline strip, red tag chip, yellow sub strip.
  - Logo with a rotating ring.
  - "एक नज़र में" yellow ticker and "ताज़ा ख़बरें" red ticker.
- `components/Bumper.tsx`: the 1.3 s story transitions, with variants normal, somber and fun.
- `components/Opener.tsx`: the 7.5 s cold open. Only the flashes change, through `OPENER_FLASHES`.
- `components/ui.tsx`, `components/layouts.tsx`, `lib/anim.ts`, `lib/timeline.ts`: shared building blocks.
- `public/brand`, `public/music`, `public/sfx`.

Improve these only if a review finds a real flaw. Then also copy the fix back into the repo's `engine/` so every later edition gets it, and tell the owner in one line (in English) so they can commit it. Never commit or push yourself.

## Change every edition
| File | What |
|---|---|
| `src/content.ts` | Everything listed in the next section |
| `src/scenes/*.tsx` | Story-specific signature graphics (new or adapted) |
| `src/Story.tsx` | Register new beat kinds in `MAP`; update `FALLBACK_BG` |
| `src/Main.tsx` | Music segments: which stories get which bed, silence for somber |
| `src/scenes/viral.tsx` | `ViralIntro` and `Wrap` reference today's viral clips and frames |
| `src/scenes/outro.tsx` | The `t < 13.4` switch from "प्रस्तुति" to "नमस्कार" must match when the anchor says नमस्कार in the last clip |
| `src/shorts/config.ts` | One entry per short |
| `scripts/shorts/texts.json` | Clean spoken text per story |
| `scripts/geo.mjs` | Map views, if any story needs a map |
| `src/upload.json` | Titles, descriptions, tags, credits |

## content.ts, field by field
- **`CREDIT`**: maps every image path used to the credit shown on its chip. Every `src` used anywhere needs an entry. Add "(फाइल)" for file photos.
- **`DATE_HI`, `DAY_EN`, `DAY_HI`**: the date of the edition, e.g. '22 नवंबर 2026', 'SUNDAY', 'रविवार'.
- **`ANCHOR_HI`**: the anchor's name as she says it.
- **`OUTPUT_FILE`**: e.g. `LDS_Khabar_22Nov2026.mp4`.
- **`OPENER_FLASHES`**: five 1-second flashes of {src, tag, text}. Use the biggest stories and end on the most eye-catching visual (the viral tease). Text stays under about 28 characters.
- **`OUTRO_RECAP`**: about 8 tiles of {src, t}. Use bright, recognisable photos with short labels. Leave out the somber story.
- **`GLANCE`**: 6 to 10 yellow-ticker facts with numbers (markets, dates, scores, prices). Check every number.
- **`STORIES`**: one entry per voice clip, in order.
  - `id: 'sNN'` and `vo: 'vo_NN'`, where NN is the clip number.
  - `dur`: from `prep_voice`.
  - `label`: the number chip ('01', '02'...; 'आज' for the day intro; 'V1'/'V2' for viral; '✓' for the outro).
  - `tag`: a red chip such as मौसम, क्राइम, बाज़ार, आपका पैसा, खेल, वायरल or श्रद्धांजलि.
  - `headline`: under about 38 characters. `sub`: under about 55.
  - `ticker`: one red-ticker line.
  - `mood`: 'normal', 'somber' or 'fun'.
  - `bumper`: {title, variant, kicker:'खबर 01'}, or null for the intro, the wrap and the outro.
  - `tail`: extra hold at the end. The outro uses 8 for the YouTube end screen.
  - `beats`: the list described below.
- **`OPENER_SEC`** = 7.5, **`LEAD`** = 0.5, **`GAP_TAIL`**: leave these alone.

### Beats
A beat is `{at, until, kind, ...props}`.
- `at` and `until` are seconds in the **voice clip**, so read them off the word timings in `transcripts/audio_NN.json`.
- The first beat starts at -0.5. Beats tile the clip with no gaps. The last `until` is about `dur` + 0.5.
- Change beats on sentence boundaries. Make on-screen points appear (`at`) when Lata says them.
- Aim for a beat every 4 to 12 s. Never let a frame sit still for more than about 12 s.
- The photo background changes with each beat's `src`.

**Generic kinds (just pass props):**
- **`photo`**: `layout: 'full'` (`kicker`, `caption`) or `'split'` (`title`, `points: [{at, text}]`).
  - `src`
  - `kb`: in, out, left, right or up (Ken Burns)
  - optional `stamp: {at, text}`, `rain: true`, `arrow: true`, `somber: true`
- **`mapPin`**: `view` (a key in geo.json), `highlight` (state name), `title`, `sub`, `pins: [{key, label, at, main?}]`, `chip: {at, text}`, `inset: {at, src, label}`, `somber`.
- **`steps`**: `title`, `src`, `steps: [{at, text}]`. Use it for a timeline or sequence of events.
- **`crimeBoard`**: `src`, `links: [{at, text}]`, an investigation board.
- **`tribute`**: `src`, `line1`, `line2`, `foot`, `wide`. Only for somber stories; no death stamp on the face.
- **`slam`**: `text`, `sub`. A full-screen slam, like "आज की बड़ी खबरें".
- **`phone`**: `video`, `credit`, `loop`, `callouts: [{at, text, style: 'tag'|'bubble'|'stamp'}]`. A vertical viral video in a phone frame.
- **`cctv`**: `video`, `credit`. A CCTV-style big video.
- **`welcome`**, **`greeting`**, **`outro`**, **`wrap`**: frame pieces that read edition data.

**Story-specific kinds from 21 Nov (data inside the component; copy and adapt):**
- `panchang` and `tithi`: the date and tithi card and the tithi timeline.
- `tulsi`: festival card.
- `cycloneMap` and `wind`: a storm-track map and a wind gauge with gust vs sustained speeds.
- `market` and `gainers`: an index board with counting numbers, and top gainers bars.
- `epfo`: before/after rule cards. `vaccine`: a vial and how-it-works graphic. `price`: a big price tag. `warning`: a caution card.
- `twoPlus` and `missile`: a diplomacy meeting board with flags, and a defence item card.
- `seats`: an election seat tally with a "partial" label. `score`: badminton set scores.
- `viralIntro`, `round2`, `chat`: fun viral segment pieces.

To make a new signature graphic:
1. Copy the closest component into a new export in a scene file.
2. Make its data come from beat props (`b.whatever`) rather than hardcoding.
3. Add it to `MAP` in `Story.tsx`.

Good patterns to reuse:
- Count-up numbers.
- Bars that grow on the spoken word.
- Cards that slide in on `at`.
- A pulsing "LIVE"-style tag.
- Particles and grain from `ui.tsx`.
- `Sfx` for whooshes and dings, used sparingly.

### Story order (like an Indian news channel)
1. Day intro (`s01`): welcome, the date and tithi or festival if Lata mentions it, then the "आज की बड़ी खबरें" slam. **Keep it short.**
2. The biggest hard news first: weather or disaster, national, crime.
3. Money and "आपका पैसा", health and science, international.
4. The somber story, if any, set apart with a somber bumper.
5. Politics and results, then sports.
6. Viral segment: "सोशल मीडिया" bumper, the clips big, then a fun wrap asking "कौन सा मज़ेदार लगा?".
7. Outro.

Follow the order of Lata's clips. She records in rundown order, so don't reorder her clips, because the narration links them.

### Music (Main.tsx)
- `music_1` (news bed) plays under normal stories. It is low under the voice and swells in the gaps.
- **Silence** for the somber story: end the segment before it starts, and start the next one after it.
- `music_2` (fun bed) plays under the viral segment and the wrap.
- `music_1` comes back for the outro.

Rewrite the `segA..segD` story ids to today's ids. If there is no somber story, merge the segments.

## Shorts (src/shorts/Short.tsx, config.ts)
- **`mode: 'panel'`**: the landscape story is scaled into the upper panel. Below it go the big two-line title (white plus yellow), the sub line, burned-in captions, the logo and the credit.
- **`mode: 'vertical'`**: for vertical source video (viral clips). The video goes full height with callouts.
- **`t0` / `t1`**: the trim inside the voice clip.
  - Start on the first real word of the story. Skip "पहली खबर है..." style links.
  - End after the last sentence. Skip any "अब चलते हैं..." link line.
  - Total must be **under 60 s**, including `S_LEAD` 0.55 and `S_END` 2.8.
- Callouts: `{at, until, text, side, y, kind}`. Emoji is fine in callouts only if they render; check a still and use SVG if they don't.

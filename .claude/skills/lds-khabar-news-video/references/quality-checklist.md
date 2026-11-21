# Quality checklist (the 9.5 bar)

Every item below came from a real finding in the 21 Nov 2026 reviews. Run through all of it:
- before the review rounds
- again on the rendered video

The reviewers score against this list.

## Hook and pacing
- [ ] The opener hits within 7.5 s: logo sting, five headline flashes, and the best visual of the day (viral clip or most dramatic photo) as the last flash.
- [ ] The day intro (panchang or festival) is short and visual, not a wall of text. The first hard news arrives by about 1:00.
- [ ] A new beat, graphic or photo change every 4 to 12 s. No static stretch longer than about 12 s.
- [ ] Every story has at least one animated graphic: map, numbers, timeline, cards or a comparison. Photos alone are not enough.
- [ ] Viral clips are shown **big**, with their natural sound ducked under the voice. No tiny video in a corner.
- [ ] Mid-video teasers, such as "आगे देखिए: वायरल वीडियो" before a story break, keep people watching. Add one around the middle when there is a viral segment.
- [ ] The total runs about 6 to 10 minutes. Never pad.

## Accuracy and honesty
- [ ] On-screen text matches what Lata says: same numbers, names and spelling.
- [ ] Every number is verified against a primary source (PIB, IMD, BSE/NSE, the official result site, the federation site), and the subagent notes the source.
- [ ] Partial or early data is labelled "आंशिक" with the time, e.g. "शाम 4:45 तक".
- [ ] Wind: sustained speed and gusts are stated separately and correctly ("हवाएं 70-80, झोंके 90 तक").
- [ ] Police or agency claims are attributed: "पुलिस के अनुसार".
- [ ] Viral videos say "पुष्टि नहीं" for place, date or authenticity. Jokes go in callouts, never in facts.
- [ ] Symbolic or illustrative images are marked "सांकेतिक". File photos get "(फाइल)".
- [ ] Market numbers have a "यह निवेश सलाह नहीं है" line where advice could be implied.

## Credits
- [ ] Every photo and video on screen carries a "फोटो: <source>" chip, including:
  - opener flash thumbnails
  - recap tiles
  - the viral wrap
  - map insets
  - short covers
- [ ] Credit chips never overlap headings, the ticker or the logo.
- [ ] `upload.json` credits list every source used in that short or video, including the music (Mixkit artists).
- [ ] No watermarks from Getty, Shutterstock, Alamy or TV channel logos as the main subject.

## Somber story
- [ ] Grayscale, somber bumper, no music, no sound effects.
- [ ] The red ticker shows **only** that story's line and "विनम्र श्रद्धांजलि 🙏", never other stories' lines.
- [ ] No death stamp or cross mark over the person's portrait. The tone is respectful, e.g. "विनम्र श्रद्धांजलि, LDS खबर परिवार की ओर से".
- [ ] No upbeat transition right after it. Use a gentle bumper into the next story.

## Text and layout (check every still at full size)
- [ ] No clipped text anywhere, especially:
  - Hindi matras (ि ी ु ू ं ँ) cut by the line box
  - month names in dates
  - labels inside circles (non-digit labels need wider pills)
  - long headlines in the strip
- [ ] Nothing overlaps: credits vs headings, map labels vs borders (labels need a dark halo or stroke), callouts vs captions.
- [ ] Cards hug their content: no big empty card areas, and no text crammed to the edge.
- [ ] Phone or device mockups stay fully on screen, and the notch doesn't cover the video's header.
- [ ] No emoji in rendered graphics. They render badly in headless Chrome, so draw icons as SVG (see `scenes/common.tsx`: Diya, flags, Sun, Moon). Emoji are okay only in the tickers and short callouts after a still check.
- [ ] Numbers use Indian formatting (83,919.71; ₹1-2) and ▲/▼ colours (green up, red down).

## Tickers
- [ ] The yellow "एक नज़र में" and red tickers never run out of text before the video ends. Check a frame in the last minute. With fewer items, raise `repeats` in `Chrome.tsx`.
- [ ] Ticker lines are short and factual, with no typos.

## Audio
- [ ] Voice is loudness-normalised to -16 LUFS. Music sits clearly under it, never fighting the words.
- [ ] Clip joins: no doubled sentence (the end of clip N repeating the start of clip N+1), no cut words, no long dead air.
- [ ] SFX are sparing: bumpers, slams, number reveals.
- [ ] Viral natural sound comes through when Lata is silent.

## Outro
- [ ] Bright recap tiles with labels and credits.
- [ ] Subscribe CTA, bell, "कल फिर मिलेंगे", and "प्रस्तुति: <anchor>" switching to "नमस्कार 🙏" when she says it.
- [ ] The last 8 s keep YouTube's end-screen safe areas free: the center and the right side need room for 2 video cards and a subscribe button.

## Shorts
- [ ] Each one is under 60 s and 1080×1920, h264 yuv420p with AAC audio.
- [ ] It starts on a strong first line. No "पहली खबर है" lead-in or link line at the end.
- [ ] Burned-in captions match the clean script.
  - No lone "है।" or one-word flash; absorb it into the phrase.
  - Captions never cover the title or the credit.
- [ ] The cover (frame 90) is readable at thumbnail size, with the title and photo visible.

## Review rubric for subagents
Each reviewer gets the stills, the contact sheets, `content.ts`, `script.md`, the credits JSON and this checklist. Each returns:
- a score from 0 to 10
- a numbered list of issues, each with the timestamp, what's wrong, and the exact fix
- the top 3 things that would make it feel more like a premium Indian news channel

There are 3 reviewers:
1. **Design and brand:** layout, typography, motion, clipping, overlaps, colour, visual variety.
2. **Accuracy, credits and ethics:** every fact, number, label and credit, plus the somber and viral handling.
3. **Pacing and engagement:** the hook, beat rhythm, graphics per story, the teasers, the outro, and whether people would watch to the end.

Fix everything at or above "minor", re-render the affected stills, and re-review. A round passes when **every** reviewer gives 9.5 or more. Stop after round 3 and ship with the best fixes.

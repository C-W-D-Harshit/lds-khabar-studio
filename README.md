# LDS खबर Studio

Makes the daily **LDS खबर** Hindi news bulletin with Claude Code:
- the landscape YouTube video (1920×1080)
- one portrait Short / Reel per story (1080×1920, under 60 s), each with a cover
- the thumbnail
- the titles, descriptions, chapters and hashtags

The input is just Lata's voice notes (one per story) and a few photos, the same things the family already sends on WhatsApp. Claude does the rest: transcribing, fact-checking, finding credited photos, designing every graphic, internal review rounds, rendering. Quality target: the 21 Nov 2026 edition in [`reference/21-nov-2026/`](reference/21-nov-2026/).

Nothing is ever uploaded or posted. The family uploads the finished files themselves.

---

## How to use it

Needs an **Apple Silicon Mac** (M1 or newer, for offline Hindi speech-to-text), about **6 GB** free disk, internet, and [Claude Code](https://claude.com/claude-code) signed in with a Claude Pro or Max account.

**Once:**
```bash
git clone https://github.com/C-W-D-Harshit/lds-khabar-studio.git
```

**Every day:**
```bash
cd lds-khabar-studio
claude
```
Drag the day's voice notes and photos into the Claude window (straight from WhatsApp, Downloads, a folder, or a WhatsApp "Export chat" zip) and say **"news video बना दो"**. That's it.

Claude works out the rest on its own: send order, date, anchor, which photo belongs to which story, mood, graphics, music, shorts. It only asks when the video would be wrong otherwise. Answer yes to "trust this folder" the first time so its permissions apply.

The very first time, Claude sets the studio up by itself in the background (about 15 to 20 minutes, no password, no Homebrew needed: anything missing is downloaded into this folder). You can also run `./setup.sh` yourself beforehand. `./setup.sh --shortcuts` adds two Desktop shortcuts, one to open the studio and one to the finished videos.

Finished editions land in `videos/News Video - <date>/`, and Claude opens the folder and the main video when it's done.

**Updating:** `git pull`. Claude in this folder is not allowed to commit or push.

---

## रोज़ का तरीका (मम्मी-पापा के लिए)

1. **खोलिए:** Terminal में `cd lds-khabar-studio` लिखकर `claude` लिखिए (या Desktop पर **"LDS खबर - शुरू करें"** पर दो बार क्लिक कीजिए)।
2. **फ़ाइलें डालिए:** Mac पर WhatsApp खोलिए। Lata जी की सारी आवाज़ वाली क्लिप और खबरों की फ़ोटो चुनकर Claude की खिड़की में खींचकर छोड़ दीजिए।
3. **लिखिए:** `news video बना दो` और Enter दबाइए। कोई खास बात हो तो वो भी लिख दीजिए, जैसे "आज तुलसी विवाह है"।
4. **इंतज़ार कीजिए:** करीब 1 से 1.5 घंटा लगता है। कुछ पूछा जाए तो जवाब चुन लीजिए।
5. **तैयार:** आख़िर में फ़ोल्डर अपने आप खुल जाएगा:
   - `LDS_Khabar_<तारीख़>.mp4`: YouTube वाला मुख्य वीडियो
   - `thumbnail.jpg`: YouTube की फ़ोटो
   - `shorts` फ़ोल्डर: YouTube Shorts और Instagram Reels
   - `upload_details.md`: हर वीडियो का टाइटल, विवरण और हैशटैग, बस कॉपी करके डालिए

कुछ बदलवाना हो तो बस लिख दीजिए, जैसे "तीसरी खबर का टाइटल बदलो" या "ये फ़ोटो हटाओ"।

Mac चालू रखिए और ढक्कन बंद मत कीजिए जब तक वीडियो बन रहा है।

---

## What's inside

```
CLAUDE.md                      house rules for Claude (Hindi replies, never upload, never push)
.claude/settings.json          model + permissions (no prompts for normal work; git push/commit blocked)
.claude/skills/lds-khabar-news-video/
  SKILL.md                     the full flow
  references/                  pipeline commands, engine guide, sourcing & review briefs,
                               quality checklist, shorts & upload text, how to talk to the family
engine/                        Remotion 4 project: brand design system, scenes, render scripts.
                               src/ holds the 21 Nov 2026 edition's code as the worked example
                               (its raw voice notes and photos are not published).
tools/                         env.sh, gather.py, new_edition.sh, ingest.py, transcribe.py,
                               prep_voice.py, prep_images.py, upload_details.py, check_media.sh,
                               contact_sheet.sh, chat_preview.sh
brand/                         logo, banner, Mixkit music beds, sound effects
reference/21-nov-2026/         the quality bar: 540p preview, 48 stills, contact sheets,
                               short covers, 3 sample shorts, script, rundown, credits, upload text
inbox/                         (optional) a drop folder
videos/                        (local) one folder per edition
```

Rendering uses the Node API scripts in `engine/scripts/` (`npx remotion render` is not used). Fonts load from Google Fonts at render time, so rendering needs internet.

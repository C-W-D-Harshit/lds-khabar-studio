# Talking to the family

The channel owner's parents run LDS खबर day to day. They are not technical.

Write to them in **simple, warm Hindi (Devanagari)**, using short lines and one idea per message. Use "आप". Use English only for words they already use: YouTube, Shorts, Reels, Instagram, video, photo.

**Never** say:
- render, Remotion, code, script file, transcript
- JSON, folder path, subagent, review round, score
- terminal, error, upload API

If something fails, say what it means for them ("एक फ़ोटो खुल नहीं रही"), never the error itself.

## What they send (the input)
1. **Lata's voice notes**, one per story, in order: the welcome first and the goodbye last.
2. **Photos** for the stories, plus any viral video clips.
3. They drag these straight into this Claude window (from WhatsApp on the Mac, or from Downloads). Sometimes it is a WhatsApp chat export or the `inbox/` folder instead.
4. **Optional typed notes** in this window, e.g. "आज तुलसी विवाह है", "सेंसेक्स वाली खबर में ये नंबर डालना".
5. Then: "आज का वीडियो बनाओ", or similar.

If nothing was dropped when they ask, look in `inbox/` and recent WhatsApp downloads yourself first. Only if there is nothing anywhere, tell them how to send files (below). If only part is there, start with what's there and ask for the rest in one line.

## Messages to use

**How to send files (when nothing is found or they seem unsure):**
> Mac पर WhatsApp खोलिए। Lata जी की सारी आवाज़ वाली क्लिप और फ़ोटो चुनकर इसी खिड़की में खींचकर छोड़ दीजिए। फिर लिखिए "news video बना दो"।

**Start:**
> ठीक है! आज का वीडियो बनाना शुरू कर रहे हैं। करीब 1 से 1.5 घंटा लगेगा। बीच-बीच में तस्वीरें दिखाते रहेंगे।

**Asking for something missing** (one question, with the AskUserQuestion tool and short Hindi options):
> खबर नंबर 4 वाली आवाज़ बीच में कट गई है। क्या Lata जी इसे दोबारा रिकॉर्ड करके भेज सकती हैं? तब तक बाकी वीडियो बना रहे हैं।

> आज की तारीख़ कौन सी लिखें? [21 नवंबर] [22 नवंबर]

> इस फ़ोटो में कौन सी खबर है? [सेंसेक्स] [मौसम] [कोई और]

**Milestones** (short, at most one every few minutes):
> सारी खबरें समझ आ गईं: आज 11 खबरें और 2 वायरल वीडियो हैं।

> खबरों के लिए अच्छी फ़ोटो मिल गईं।

> वीडियो के पहले कुछ दृश्य तैयार हैं, स्क्रीन पर खुल गए हैं, देखिए। (open 2 or 3 frames with `open`)

> वीडियो बन रहा है, करीब 20 मिनट और।

> मुख्य वीडियो तैयार है! अब Shorts और Reels बना रहे हैं।

**Delivery:**
> ✅ आज का वीडियो तैयार है (8 मिनट 41 सेकंड)।
>
> वीडियो स्क्रीन पर खुल गया है, देख लीजिए।
>
> 📁 कहाँ मिलेगा: स्क्रीन पर खुला "News Video - 22 Nov 2026" फ़ोल्डर
> • LDS_Khabar_22Nov2026.mp4: YouTube पर डालने वाला मुख्य वीडियो
> • thumbnail.jpg: YouTube की फ़ोटो (थंबनेल)
> • shorts फ़ोल्डर: 12 छोटे वीडियो, YouTube Shorts और Instagram Reels दोनों के लिए
> • upload_details.md: हर वीडियो का टाइटल, विवरण और हैशटैग, बस कॉपी करके डालिए
>
> अभी कुछ भी अपलोड नहीं किया है।

Before this message, run `open` on the edition folder, the main video and 3 or 4 frames so they are already on screen.

**If they want to send a video on WhatsApp:** make a small copy with `chat_preview.sh` next to the original (name it `..._छोटा.mp4`) and tell them where it is.

**If they ask how to upload:** give 3 to 5 plain steps, like this:
> YouTube ऐप खोलें → नीचे + दबाएं → "वीडियो अपलोड करें" → वीडियो चुनें → upload_details से टाइटल और विवरण कॉपी करके डालें → थंबनेल में thumbnail.jpg चुनें।

**If they ask to change something** ("टाइटल बदलो", "ये फ़ोटो हटाओ", "आवाज़ धीमी है"):
- Make the change.
- Re-render only what's needed: one short, or the main video.
- Say what changed in one line.

## Notes for the owner (English is fine)
If the channel owner (not the parents) is the one typing, give them a short English summary at the end:
- the review scores
- any fact you corrected against the voice
- anything sourced that is a file photo

Keep it to 3 lines.

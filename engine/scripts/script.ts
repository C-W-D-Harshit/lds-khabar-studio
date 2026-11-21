import fs from 'node:fs';
import {STORIES, CREDIT, GLANCE, DATE_HI} from '../src/content';
import {TL, TOTAL_SEC} from '../src/lib/timeline';
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const txt = (n: number) => {
  try { return fs.readFileSync(`../transcripts/audio_${String(n).padStart(2, '0')}.txt`, 'utf8').trim(); } catch { return ''; }
};
let md = `# LDS खबर • ${DATE_HI} • Full script and shot plan\n\nLength ${mmss(TOTAL_SEC)} • 1920×1080 • 30 fps • Anchor (Lata) is voice-only, never on screen.\n\n`;
md += `## Design system\n- Frame: date block (top-left), navy headline strip, red category tag, yellow sub-strip, round LDS logo with rotating ring (top-right), content area 1840×750, yellow "एक नज़र में" ticker + red "ताज़ा ख़बरें" ticker at the bottom.\n- Fonts: Khand (headlines), Mukta (body), Teko (numbers). Colours: navy #0B1F4D, red #E0141E, yellow #FFC915, green #16C76A.\n- Every story background is its own blurred photo with a navy-red gradient, slow drifting light and grid. Film grain over everything.\n- Story transitions: 1.3 s skewed-panel "bumper" wipes with category title (normal red/navy/yellow, fun yellow/red/purple with 🔥, somber grey with no sound).\n- Somber story (S08) goes grayscale with no music and no SFX.\n- Music: bed under voice at about 6–7% and swells in gaps; separate playful bed for the viral segment; music fades out for the tribute.\n- Credits: every photo carries a "फोटो: source" chip; viral clips carry "वीडियो: X / handle".\n\n`;
md += `## Opener (0:00–0:07.5)\nLogo ring draws, logo impact, "LDS खबर" + date, then five 1-second headline flashes with glitch (cyclone, Sensex +898, PF rules, Durrani encounter, Lakshya Sen), white flash into the first story. SFX: news intro sting, impact, glitch per flash.\n\nYellow ticker items: ${GLANCE.join(' • ')}\n\n`;
STORIES.forEach((s, i) => {
  const tl = TL[i];
  md += `## S${String(i + 1).padStart(2, '0')} • ${s.tag} • ${mmss(tl.visStart)}–${mmss(tl.visEnd)} (${s.mood})\n`;
  md += `**Headline strip:** ${s.headline}  \n**Sub strip:** ${s.sub}  \n**Red ticker:** ${s.ticker}  \n`;
  if (s.bumper) md += `**Bumper:** ${s.bumper.title} (${s.bumper.variant})  \n`;
  md += `\n**Voice-over:** ${txt(i + 1)}\n\n| Time (story s) | Visual | On-screen text | Image / source |\n|---|---|---|---|\n`;
  for (const b of s.beats) {
    const bits: string[] = [];
    for (const k of ['title', 'caption', 'kicker', 'line1', 'line2', 'foot', 'sub', 'text']) if (b[k]) bits.push(String(b[k]));
    if (b.points) bits.push(...b.points.map((p: any) => `[${p.at}s] ${p.text}`));
    if (b.callouts) bits.push(...b.callouts.map((p: any) => `[${p.at}s] ${p.text}`));
    if (b.pins) bits.push('Pins: ' + b.pins.map((p: any) => `${p.label}@${p.at}s`).join(', '));
    const src = b.src ? `${b.src} (${CREDIT[b.src] ?? '?'})` : b.video ? `${b.video} (${b.credit})` : 'graphic';
    md += `| ${b.at}–${b.until} | ${b.kind}${b.layout ? ' / ' + b.layout : ''} | ${bits.join('<br>') || '(see notes)'} | ${src} |\n`;
  }
  md += '\n';
});
md += `## Custom graphics notes\n- S01: tear-off calendar flips 20→21, panchang chips (मास, पक्ष, तिथि), 33-hour tithi timeline (एकादशी until 6:31, द्वादशी until 22 Nov 4:56) with sun/moon, gold arched Tulsi frame with diyas, "आज की बड़ी खबरें" slam.\n- S02: real-geography map zooms to Gopalpur, animated cyclone swirl following an indicative track ("सांकेतिक मार्ग"), landfall pulse, weather alert card; wind speedometer 70–80 km/h with gust to 90; rain overlay on flood photos.\n- S03: UP map with Bulandshahr district highlight and pins (Delhi, Noida); crime board with red strings and pinned cards, "मुठभेड़ में मौत" stamp; 3-step timeline; disclaimer that links are police claims.\n- S04: Sensex/Nifty counting tiles with percent bars; top gainers list.\n- S05: three-decision checklist; donut 25%→10%; 12 month blocks collapsing to 2; SWP coins vs lump sum.\n- S06: vaccine vial with fill, drifting virus particles bouncing off a shield; ₹1–2 swinging price tag; hazard-stripe warning "मुर्गियों के लिए ✓ / इंसानों के लिए नहीं ✗".\n- S07: 2+2 slam with flags, 4 minister cards; radar sweep with indicative surface-to-ship missile arc ("सांकेतिक ग्राफ़िक").\n- S08: grayscale arched portrait with diya, Panchur map pin, "विनम्र श्रद्धांजलि" card.\n- S09: Rajasthan map + bar board (Congress 3436 vs BJP 2054 [अनुमान], ZP 321 vs 125), party colours only.\n- S10: flip-in scoreboard 21-17, 10-21, 21-13 with WIN chip.\n- S11: phone mockup playing the viral clip, meme bubbles, "पुष्टि नहीं" stamp, floating emoji.\n- S12: CCTV monitor with REC/timestamp, slow-motion replay with circle; "मोहल्ले की कुश्ती ROUND 2"; WhatsApp-style insurance chat (labelled as a humorous dramatisation).\n- S13: both clips side by side as A/B, comment box typing.\n- S14: recap grid of 8 stories, subscribe button click + bell, end card with YouTube end-screen safe areas.\n\n## Sources and caveats\n- Photo credits as listed per beat; viral videos from X (@AadyaTales, @iNikhilsaini), shown with credit and "पुष्टि नहीं".\n- Rajasthan panchayat figures are as read in the voice-over; not independently verified.\n- Market closing figures: Friday 20 Nov 2026 close as per the voice-over.\n`;
fs.writeFileSync('../script.md', md);
console.log('written', md.length);

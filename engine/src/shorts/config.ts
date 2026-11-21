// Portrait shorts (1080x1920) cut from the main bulletin. Times are seconds in each voice clip.
export type ShortCfg = {
  id: string; // story id in content.ts
  slug: string; // output file name
  t0: number; // voice trim start
  t1: number; // voice trim end
  title: [string, string]; // line 1 white, line 2 yellow
  sub: string;
  mode: 'panel' | 'vertical';
  video?: string;
  credit?: string;
  callouts?: {at: number; until: number; text: string; side: 'left' | 'right'; y: number; kind: 'bubble' | 'stamp' | 'tag'}[];
};

export const SHORTS: ShortCfg[] = [
  {id: 's01', slug: '01_tulsi_vivah_panchang', t0: 9.4, t1: 52.4, title: ['आज तुलसी विवाह', 'जानिए तिथि और समय'], sub: 'कार्तिक शुक्ल द्वादशी • 21 नवंबर 2026', mode: 'panel'},
  {id: 's02', slug: '02_cyclone_akvan', t0: 1.85, t1: 40.4, title: ["चक्रवात 'अकवान'", 'ने तट पार किया'], sub: 'ओडिशा-आंध्र में 90 किमी/घंटा तक के झोंके', mode: 'panel'},
  {id: 's03', slug: '03_bulandshahr_encounter', t0: 3.1, t1: 37.6, title: ['बुलंदशहर मुठभेड़ में', 'नसीम दुर्रानी की मौत'], sub: 'दिल्ली पुलिस और नोएडा STF का संयुक्त ऑपरेशन', mode: 'panel'},
  {id: 's04', slug: '04_sensex_surge', t0: 3.35, t1: 34.75, title: ['शेयर बाज़ार में तेज़ी', 'सेंसेक्स +897.96'], sub: 'सेंसेक्स 83,919.71 • निफ्टी 25,800.60', mode: 'panel'},
  {id: 's05', slug: '05_epfo_pf_rules', t0: 0, t1: 31.4, title: ['PF के नियम बदले', 'आपके लिए क्या नया?'], sub: 'मिनिमम बैलेंस 25% से घटकर 10%', mode: 'panel'},
  {id: 's06', slug: '06_h5n1_bird_flu_vaccine', t0: 3.85, t1: 42.6, title: ['बर्ड फ्लू से बचाएगी', 'स्वदेशी वैक्सीन'], sub: 'मुर्गियों के लिए H5N1 वैक्सीन • ₹1–2 प्रति डोज़', mode: 'panel'},
  {id: 's07', slug: '07_india_japan_2plus2', t0: 3.35, t1: 37.3, title: ['भारत-जापान', '2+2 वार्ता, टोक्यो'], sub: 'विदेश और रक्षा मंत्रियों की चौथी बैठक', mode: 'panel'},
  {id: 's08', slug: '08_savitri_devi_tribute', t0: 0.28, t1: 39.4, title: ['सीएम योगी की माता', 'सावित्री देवी का निधन'], sub: '91 वर्ष की उम्र में ली अंतिम सांस', mode: 'panel'},
  {id: 's09', slug: '09_rajasthan_panchayat_results', t0: 0, t1: 23.2, title: ['राजस्थान पंचायत चुनाव', 'कांग्रेस आगे'], sub: 'शाम 4:45 तक के आंशिक नतीजे', mode: 'panel'},
  {id: 's10', slug: '10_lakshya_sen_hong_kong_open', t0: 0, t1: 34.5, title: ['लक्ष्य सेन', 'सेमीफाइनल में'], sub: 'हांगकांग ओपन • सात्विक-चिराग भी अंतिम चार में', mode: 'panel'},
  {id: 's11', slug: '11_viral_notes_burning', t0: 1.25, t1: 41.7, title: ['नोटों जैसे बंडल', 'धुएं में उड़ा दिए!'], sub: 'वायरल वीडियो • नोट असली या नकली, पुष्टि नहीं', mode: 'vertical', video: 'vid/notes.mp4', credit: 'X / @AadyaTales',
    callouts: [
      {at: 15.8, until: 20.5, text: 'महीने के आख़िर में हम: पैसे गए कहाँ? 🤔', side: 'left', y: 700, kind: 'bubble'},
      {at: 21.1, until: 25.4, text: 'और भाई साहब: पूरे पैसे धुएं में! 💨', side: 'right', y: 860, kind: 'bubble'},
      {at: 25.7, until: 41.7, text: 'पुष्टि नहीं', side: 'right', y: 560, kind: 'stamp'},
    ]},
  {id: 's12', slug: '12_viral_bulls_on_car', t0: 2.45, t1: 44.2, title: ['सांडों की कुश्ती', 'शामत आई कार की!'], sub: 'वायरल वीडियो • जगह और तारीख़ की पुष्टि नहीं', mode: 'vertical', video: 'vid/bulls.mp4', credit: 'X / @iNikhilsaini',
    callouts: [
      {at: 13.3, until: 19.0, text: 'मालिक: यहां गाड़ी सुरक्षित रहेगी 😌', side: 'left', y: 700, kind: 'bubble'},
      {at: 19.0, until: 22.5, text: 'सांड: राउंड 2 यहीं होगा 🐂', side: 'right', y: 860, kind: 'bubble'},
      {at: 27.3, until: 30.0, text: 'बीमा कंपनी: नुकसान कैसे हुआ? 🧐', side: 'left', y: 700, kind: 'bubble'},
      {at: 30.0, until: 33.0, text: 'जी, ऊपर से सांड आ गया! 😅', side: 'right', y: 860, kind: 'bubble'},
      {at: 39.6, until: 44.2, text: 'पुष्टि नहीं', side: 'right', y: 560, kind: 'stamp'},
    ]},
];

export const S_LEAD = 0.55; // voice starts this many seconds into the short
export const S_END = 2.8; // end card length
export const S_FPS = 30;
export const shortDur = (c: ShortCfg) => S_LEAD + (c.t1 - c.t0) + 0.35 + S_END;

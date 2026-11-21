// Single source of truth for the bulletin: text, timing (seconds from each voice clip's start), images and credits.
export type Beat = {at: number; until: number; kind: string; [k: string]: any};
export type Story = {
  id: string;
  vo: string;
  dur: number;
  label: string; // number chip text
  tag: string;
  headline: string;
  sub: string;
  ticker: string;
  bumper?: {title: string; variant: 'normal' | 'somber' | 'fun'; kicker: string} | null;
  mood: 'normal' | 'somber' | 'fun';
  tail?: number;
  beats: Beat[];
};

export const CREDIT: Record<string, string> = {
  's01_tulsi/s01_01.jpg': 'Wikimedia Commons / Antrabhardwaj2',
  's01_tulsi/s01_02.jpg': 'Wikimedia Commons / Arya Joshi',
  's01_tulsi/s01_03.jpg': 'Wikimedia Commons / Suyash Dwivedi',
  's01_tulsi/s01_04.jpg': 'Wikimedia Commons / Arya Joshi',
  's01_tulsi/s01_05.jpg': 'Wikimedia Commons / Aditya Bendre',
  's02_cyclone/s02_01.jpg': 'NOAA / VIIRS',
  's02_cyclone/s02_03.jpg': 'PTI',
  's02_cyclone/s02_04.jpg': '@03NDRF / PTI',
  's02_cyclone/s02_05.jpg': 'PTI',
  's02_cyclone/s02_06.jpg': 'SRC Odisha / Down To Earth',
  's03_durrani/s03_01.jpg': 'Delhi Police / ANI',
  's03_durrani/s03_02.jpg': 'Telangana Today',
  's03_durrani/s03_03.jpg': 'Wikimedia Commons / KCVelaga',
  's03_durrani/s03_04.jpg': 'Wikimedia Commons / ArmouredCyborg',
  's04_market/s04_01.jpg': 'Wikimedia Commons / BSEINDIA',
  's04_market/s04_02.jpg': 'Wikimedia Commons / Niyantha Shekhar',
  's04_market/s04_03.jpg': 'PTI (फाइल)',
  's04_market/s04_05.jpg': 'Wikimedia Commons / Pradeep717',
  's05_epfo/s05_01.jpg': 'PIB',
  's05_epfo/s05_02.jpg': 'PIB',
  's05_epfo/s05_03.jpg': 'PIB',
  's06_vaccine/s06_01.jpg': 'The Federal',
  's06_vaccine/s06_02.jpg': 'Reuters (फाइल)',
  's06_vaccine/s06_03.jpg': 'Wikimedia Commons / Matthew T Rader',
  's07_japan/s07_01.jpg': 'Organiser',
  's07_japan/s07_02.jpg': 'ANI',
  's07_japan/s07_03.jpg': 'ANI',
  's07_japan/s07_04.jpg': 'Rajnath Singh / X',
  's07_japan/s07_05.jpg': 'ANI',
  's08_savitri/s08_01.jpg': 'Newsdrum (फाइल)',
  's08_savitri/s08_02.jpg': 'Amar Ujala (फाइल)',
  's08_savitri/s08_03.jpg': 'ANI (फाइल)',
  's08_savitri/s08_04.jpg': 'ANI',
  's08_savitri/s08_06.jpg': 'PMO / Wikimedia Commons',
  's09_rajasthan/s09_01.jpg': 'Deccan Herald',
  's09_rajasthan/s09_02.jpg': 'Punjab Kesari',
  's09_rajasthan/s09_04.jpg': 'Dainik Jagran (फाइल)',
  's10_badminton/s10_01.jpg': 'Asianet Newsable (फाइल)',
  's10_badminton/s10_02.jpg': 'Sunday Guardian (फाइल)',
  's10_badminton/s10_03.jpg': 'DT Next (फाइल)',
  's10_badminton/s10_04.jpg': 'Wikimedia Commons / Wongpong (फाइल)',
  's11_notes/viral_frame_burning_720x1280.jpg': 'X / @AadyaTales',
  's12_bulls/stock_bulls_fighting_street_india.jpg': 'Wikimedia Commons / Bhaskaranaidu',
  's12_bulls/stock_cattle_street_car_delhi.jpg': 'Wikimedia Commons / McKay Savage',
  's12_bulls/viral_frame_bull_on_car_720x1280.jpg': 'X / @iNikhilsaini',
};

export const DATE_HI = '21 नवंबर 2026';
export const DAY_EN = 'SATURDAY';
export const DAY_HI = 'शनिवार';


// ---- Edition-wide settings used by the opener, the outro and the render scripts ----
export const ANCHOR_HI = 'लता'; // anchor's name as said in the outro (voice only, never on screen)
export const OUTPUT_FILE = 'LDS_Khabar_21Nov2026.mp4'; // written next to the video/ folder

// Five 1-second headline flashes in the opener: the biggest stories, plus the best visual tease.
export const OPENER_FLASHES: {src: string; tag: string; text: string}[] = [
  {src: 's02_cyclone/s02_03.jpg', tag: 'मौसम', text: "ओडिशा तट पर चक्रवात 'अकवान'"},
  {src: 's04_market/s04_01.jpg', tag: 'बाज़ार', text: 'सेंसेक्स करीब 900 अंक उछला'},
  {src: 's05_epfo/s05_02.jpg', tag: 'आपका पैसा', text: 'PF निकासी के नियम बदले'},
  {src: 's03_durrani/s03_01.jpg', tag: 'क्राइम', text: 'बुलंदशहर में मुठभेड़'},
  {src: 's10_badminton/s10_02.jpg', tag: 'खेल', text: 'सेमीफाइनल में लक्ष्य सेन'},
];

// Up to 8 recap tiles in the outro (S14).
export const OUTRO_RECAP: {src: string; t: string}[] = [
  {src: 's02_cyclone/s02_03.jpg', t: 'चक्रवात अकवान'},
  {src: 's03_durrani/s03_01.jpg', t: 'बुलंदशहर मुठभेड़'},
  {src: 's04_market/s04_01.jpg', t: 'सेंसेक्स +897.96'},
  {src: 's05_epfo/s05_02.jpg', t: 'PF नियम बदले'},
  {src: 's06_vaccine/s06_03.jpg', t: 'बर्ड फ्लू वैक्सीन'},
  {src: 's07_japan/s07_05.jpg', t: 'भारत-जापान 2+2'},
  {src: 's09_rajasthan/s09_02.jpg', t: 'पंचायत चुनाव'},
  {src: 's10_badminton/s10_02.jpg', t: 'लक्ष्य सेन सेमीफाइनल'},
];

export const GLANCE = [
  'सेंसेक्स 83,919.71 ▲ 897.96 (1.08%)',
  'निफ्टी 25,800.60 ▲ 286.30 (1.12%)',
  'आज तुलसी विवाह',
  'द्वादशी तिथि: 22 नवंबर सुबह 4:56 तक',
  'चक्रवात अकवान: हवाएं 70–80 किमी/घंटा, झोंके 90 तक',
  'EPFO: PF मिनिमम बैलेंस 25% से घटकर 10%',
  'H5N1 पोल्ट्री वैक्सीन: ₹1–2 प्रति डोज़',
  'हांगकांग ओपन: लक्ष्य सेन 21-17, 10-21, 21-13 से जीते',
];

export const STORIES: Story[] = [
  {
    id: 's01', vo: 'vo_01', dur: 55.0, label: 'आज', tag: 'आज का दिन', mood: 'normal', bumper: null,
    headline: 'आज का पंचांग • तुलसी विवाह', sub: 'कार्तिक मास, शुक्ल पक्ष • द्वादशी तिथि',
    ticker: 'आज तुलसी विवाह, द्वादशी तिथि 22 नवंबर सुबह 4:56 तक',
    beats: [
      {at: -0.5, until: 4.6, kind: 'welcome'},
      {at: 4.6, until: 15.5, kind: 'panchang'},
      {at: 15.5, until: 27.9, kind: 'tithi'},
      {at: 27.9, until: 35.0, kind: 'tulsi', src: 's01_tulsi/s01_02.jpg'},
      {at: 35.0, until: 49.1, kind: 'photo', layout: 'split', src: 's01_tulsi/s01_03.jpg', kb: 'up', title: 'पूजा से पहले ध्यान दें',
        points: [
          {at: 35.0, text: 'पंचांग में आज वैष्णव और गौण देवउठनी एकादशी भी दर्ज'},
          {at: 40.7, text: 'परंपराओं के अनुसार व्रत और पारण का दिन अलग हो सकता है'},
          {at: 44.9, text: 'पूजा का समय अपने स्थानीय पंचांग के अनुसार रखें'},
        ]},
      {at: 49.1, until: 52.1, kind: 'greeting', src: 's01_tulsi/s01_04.jpg'},
      {at: 52.0, until: 55.5, kind: 'slam', text: 'आज की बड़ी खबरें', sub: 'LATEST NEWS'},
    ],
  },
  {
    id: 's02', vo: 'vo_02', dur: 40.6, label: '01', tag: 'मौसम', mood: 'normal',
    bumper: {title: 'मौसम', variant: 'normal', kicker: 'खबर 01'},
    headline: "चक्रवात 'अकवान' ने तट पार किया", sub: 'ओडिशा-आंध्र प्रदेश में तेज़ हवाएं और भारी बारिश',
    ticker: 'चक्रवात अकवान: ओडिशा-आंध्र में 70-80 किमी/घंटा की हवाएं, झोंके 90 तक',
    beats: [
      {at: -0.5, until: 10.9, kind: 'cycloneMap'},
      {at: 10.9, until: 25.2, kind: 'wind'},
      {at: 25.2, until: 31.1, kind: 'photo', layout: 'full', src: 's02_cyclone/s02_04.jpg', kb: 'right', kicker: 'एहतियात', caption: 'बड़ी संख्या में लोगों को सुरक्षित स्थानों पर पहुंचाया गया'},
      {at: 31.1, until: 35.1, kind: 'photo', layout: 'full', src: 's02_cyclone/s02_03.jpg', kb: 'in', kicker: 'गोपालपुर तट', caption: 'रिपोर्ट के समय बड़े नुकसान की कोई सूचना नहीं'},
      {at: 35.1, until: 41.1, kind: 'photo', layout: 'full', src: 's02_cyclone/s02_05.jpg', kb: 'left', rain: true, kicker: 'निगरानी जारी', caption: 'प्रभावित इलाकों में बारिश और जलभराव पर नज़र'},
    ],
  },
  {
    id: 's03', vo: 'vo_03', dur: 37.8, label: '02', tag: 'क्राइम', mood: 'normal',
    bumper: {title: 'क्राइम', variant: 'normal', kicker: 'खबर 02'},
    headline: 'बुलंदशहर मुठभेड़ में नसीम दुर्रानी की मौत', sub: 'दिल्ली पुलिस और नोएडा STF का संयुक्त ऑपरेशन',
    ticker: 'बुलंदशहर मुठभेड़ में वांछित नसीम दुर्रानी की मौत',
    beats: [
      {at: -0.5, until: 10.0, kind: 'mapPin', view: 'up', highlight: 'Uttar Pradesh', title: 'बुलंदशहर', sub: 'उत्तर प्रदेश',
        pins: [{key: 'bulandshahr', label: 'बुलंदशहर', at: 2.3, main: true}, {key: 'delhi', label: 'दिल्ली', at: 3.2}, {key: 'noida', label: 'नोएडा', at: 4.7}],
        chip: {at: 5.9, text: 'दिल्ली पुलिस + नोएडा STF'}, inset: {at: 7.2, src: 's03_durrani/s03_01.jpg', label: 'मुठभेड़ स्थल'}},
      {at: 10.0, until: 21.8, kind: 'crimeBoard', src: 's03_durrani/s03_02.jpg',
        links: [
          {at: 12.0, text: 'खजूरी खास (दिल्ली) हत्याकांड में वांछित'},
          {at: 17.0, text: "दाऊद इब्राहिम का 'D-कंपनी' नेटवर्क"},
          {at: 19.6, text: 'छोटा शकील से संबंध'},
        ]},
      {at: 21.8, until: 30.7, kind: 'steps', src: 's03_durrani/s03_03.jpg', title: 'पुलिस के अनुसार घटनाक्रम',
        steps: [{at: 23.5, text: 'कार्रवाई के दौरान गोलीबारी'}, {at: 26.7, text: 'दुर्रानी घायल'}, {at: 27.9, text: 'अस्पताल में मृत घोषित'}]},
      {at: 30.7, until: 38.3, kind: 'photo', layout: 'full', src: 's03_durrani/s03_04.jpg', kb: 'left', kicker: 'ध्यान दें', caption: 'आपराधिक संबंधों और मुठभेड़ का ब्योरा पुलिस के बयान पर आधारित'},
    ],
  },
  {
    id: 's04', vo: 'vo_04', dur: 34.8, label: '03', tag: 'बाज़ार', mood: 'normal',
    bumper: {title: 'शेयर बाज़ार', variant: 'normal', kicker: 'खबर 03'},
    headline: 'शेयर बाज़ार में ज़ोरदार तेज़ी', sub: 'सेंसेक्स 897.96 अंक चढ़ा, निफ्टी 25,800 पर',
    ticker: 'सेंसेक्स 897.96 अंक चढ़कर 83,919.71 पर बंद, निफ्टी 25,800.60 पर',
    beats: [
      {at: -0.5, until: 7.2, kind: 'photo', layout: 'full', src: 's04_market/s04_01.jpg', kb: 'up', arrow: true, kicker: 'शुक्रवार का कारोबार', caption: 'भारतीय शेयर बाज़ार बढ़त के साथ बंद'},
      {at: 7.2, until: 24.0, kind: 'market'},
      {at: 24.0, until: 31.7, kind: 'gainers', src: 's04_market/s04_05.jpg'},
      {at: 31.7, until: 35.3, kind: 'photo', layout: 'full', src: 's04_market/s04_03.jpg', kb: 'in', kicker: 'हालांकि', caption: 'सभी शेयरों में एक जैसी तेज़ी नहीं रही'},
    ],
  },
  {
    id: 's05', vo: 'vo_05', dur: 31.6, label: '04', tag: 'आपका पैसा', mood: 'normal',
    bumper: {title: 'आपका पैसा', variant: 'normal', kicker: 'खबर 04'},
    headline: 'PF निकासी के नियमों में बड़ा बदलाव', sub: 'EPFO के केंद्रीय न्यासी बोर्ड की मंज़ूरी',
    ticker: 'EPFO: अंतिम निकासी की प्रतीक्षा अवधि 12 से घटकर 2 महीने',
    beats: [
      {at: -0.5, until: 3.4, kind: 'photo', layout: 'full', src: 's05_epfo/s05_02.jpg', kb: 'in', kicker: 'EPFO', caption: 'नौकरीपेशा लोगों के लिए अहम खबर'},
      {at: 3.4, until: 32.1, kind: 'epfo', src: 's05_epfo/s05_01.jpg'},
    ],
  },
  {
    id: 's06', vo: 'vo_06', dur: 42.8, label: '05', tag: 'कृषि-विज्ञान', mood: 'normal',
    bumper: {title: 'कृषि-विज्ञान', variant: 'normal', kicker: 'खबर 05'},
    headline: 'बर्ड फ्लू से बचाव: स्वदेशी H5N1 वैक्सीन', sub: 'शिवराज सिंह चौहान ने भोपाल में राष्ट्र को समर्पित की',
    ticker: 'मुर्गियों के लिए स्वदेशी H5N1 वैक्सीन, कीमत ₹1-2 प्रति डोज़',
    beats: [
      {at: -0.5, until: 3.9, kind: 'photo', layout: 'full', src: 's06_vaccine/s06_03.jpg', kb: 'right', kicker: 'कृषि और विज्ञान', caption: 'पोल्ट्री सेक्टर के लिए बड़ी राहत'},
      {at: 3.9, until: 13.9, kind: 'photo', layout: 'split', src: 's06_vaccine/s06_01.jpg', kb: 'in', title: 'भोपाल से बड़ी खबर', stamp: {at: 10.5, text: 'स्वदेशी'},
        points: [
          {at: 5.5, text: 'केंद्रीय कृषि मंत्री शिवराज सिंह चौहान'},
          {at: 7.4, text: 'मुर्गियों को बर्ड फ्लू से बचाने वाली H5N1 वैक्सीन'},
          {at: 12.7, text: 'वैक्सीन राष्ट्र को समर्पित'},
        ]},
      {at: 13.9, until: 25.6, kind: 'vaccine'},
      {at: 25.6, until: 37.7, kind: 'price', src: 's06_vaccine/s06_02.jpg'},
      {at: 37.7, until: 43.3, kind: 'warning'},
    ],
  },
  {
    id: 's07', vo: 'vo_07', dur: 37.5, label: '06', tag: 'विदेश', mood: 'normal',
    bumper: {title: 'विदेश', variant: 'normal', kicker: 'खबर 06'},
    headline: 'भारत-जापान 2+2 वार्ता, टोक्यो', sub: 'रक्षा सहयोग आगे बढ़ाने पर सहमति',
    ticker: 'भारत-जापान चौथी 2+2 वार्ता टोक्यो में, रक्षा सहयोग बढ़ाने पर सहमति',
    beats: [
      {at: -0.5, until: 12.9, kind: 'twoPlus', src: 's07_japan/s07_05.jpg'},
      {at: 12.9, until: 23.3, kind: 'photo', layout: 'split', src: 's07_japan/s07_02.jpg', kb: 'in', title: 'बैठक की अहम बातें',
        points: [
          {at: 14.0, text: 'भारत की फायरिंग रेंज में जापान के आत्मरक्षा बलों का प्रशिक्षण'},
          {at: 20.3, text: 'इस पर हस्ताक्षरित आशय-पत्र का स्वागत'},
        ]},
      {at: 23.3, until: 31.5, kind: 'missile', src: 's07_japan/s07_04.jpg'},
      {at: 31.5, until: 38.0, kind: 'photo', layout: 'full', src: 's07_japan/s07_01.jpg', kb: 'out', kicker: 'सहमति', caption: 'व्यवस्था को आगे बढ़ाने के लिए समन्वय तेज़ होगा'},
    ],
  },
  {
    id: 's08', vo: 'vo_08', dur: 39.6, label: '07', tag: 'दुखद समाचार', mood: 'somber',
    bumper: {title: 'दुखद समाचार', variant: 'somber', kicker: 'खबर 07'},
    headline: 'सीएम योगी की माता सावित्री देवी का निधन', sub: '91 वर्ष की आयु में पैतृक गांव पंचूर में ली अंतिम सांस',
    ticker: 'मुख्यमंत्री योगी आदित्यनाथ की माता सावित्री देवी का 91 वर्ष की आयु में निधन',
    beats: [
      {at: -0.5, until: 9.3, kind: 'tribute', src: 's08_savitri/s08_03.jpg', line1: 'सावित्री देवी', line2: '91 वर्ष', foot: 'मुख्यमंत्री योगी आदित्यनाथ की माता'},
      {at: 9.3, until: 17.5, kind: 'mapPin', view: 'uk', highlight: 'Uttarakhand', title: 'पंचूर', sub: 'पौड़ी गढ़वाल, उत्तराखंड', somber: true,
        pins: [{key: 'panchur', label: 'पंचूर (पैतृक गांव)', at: 12.4, main: true}, {key: 'dehradun', label: 'देहरादून', at: 11.2}]},
      {at: 17.5, until: 25.8, kind: 'photo', layout: 'split', src: 's08_savitri/s08_06.jpg', kb: 'in', title: 'शोक संवेदनाएं', somber: true,
        points: [
          {at: 17.5, text: 'मुख्यमंत्री पुष्कर सिंह धामी समेत कई जनप्रतिनिधियों ने शोक जताया'},
          {at: 23.3, text: 'परिवार के प्रति संवेदना व्यक्त की'},
        ]},
      {at: 25.8, until: 31.7, kind: 'photo', layout: 'full', src: 's08_savitri/s08_04.jpg', kb: 'in', somber: true, kicker: 'पंचूर पहुंचे मुख्यमंत्री', caption: 'रिपोर्ट: अंतिम संस्कार आज हरिद्वार के चंडी घाट पर'},
      {at: 31.7, until: 40.1, kind: 'tribute', src: 's08_savitri/s08_01.jpg', line1: 'विनम्र श्रद्धांजलि', line2: '', foot: 'LDS खबर परिवार की ओर से', wide: true},
    ],
  },
  {
    id: 's09', vo: 'vo_09', dur: 23.3, label: '08', tag: 'चुनाव', mood: 'normal',
    bumper: {title: 'चुनाव', variant: 'normal', kicker: 'खबर 08'},
    headline: 'राजस्थान पंचायत चुनाव: कांग्रेस आगे', sub: '20 नवंबर, शाम 4:45 बजे तक घोषित नतीजे',
    ticker: 'राजस्थान पंचायत चुनाव मतगणना में कांग्रेस आगे',
    beats: [{at: -0.5, until: 23.8, kind: 'seats', src: 's09_rajasthan/s09_02.jpg'}],
  },
  {
    id: 's10', vo: 'vo_10', dur: 34.6, label: '09', tag: 'खेल', mood: 'normal',
    bumper: {title: 'खेल', variant: 'normal', kicker: 'खबर 09'},
    headline: 'हांगकांग ओपन: सेमीफाइनल में लक्ष्य सेन', sub: 'सात्विक-चिराग की जोड़ी भी अंतिम चार में',
    ticker: 'लक्ष्य सेन और सात्विक-चिराग हांगकांग ओपन के सेमीफाइनल में',
    beats: [
      {at: -0.5, until: 6.4, kind: 'photo', layout: 'full', src: 's10_badminton/s10_02.jpg', kb: 'right', kicker: 'बैडमिंटन', caption: 'खेल जगत से भारत के लिए अच्छी खबर'},
      {at: 6.4, until: 14.6, kind: 'photo', layout: 'split', src: 's10_badminton/s10_01.jpg', kb: 'in', title: 'हांगकांग ओपन',
        points: [{at: 7.8, text: 'लक्ष्य सेन सेमीफाइनल में पहुंचे'}, {at: 11.4, text: 'सिंगापुर के पूर्व विश्व चैंपियन लोह कीन यू को हराया'}]},
      {at: 14.6, until: 20.6, kind: 'score'},
      {at: 20.6, until: 26.2, kind: 'photo', layout: 'split', src: 's10_badminton/s10_03.jpg', kb: 'left', title: 'पुरुष युगल',
        points: [{at: 21.1, text: 'सात्विकसाईराज रंकीरेड्डी और चिराग शेट्टी'}, {at: 24.6, text: 'जोड़ी ने भी सेमीफाइनल में जगह बनाई'}]},
      {at: 26.2, until: 35.1, kind: 'photo', layout: 'full', src: 's10_badminton/s10_04.jpg', kb: 'out', kicker: 'पदक की उम्मीद', caption: 'अब नज़रें अगले मुकाबलों पर'},
    ],
  },
  {
    id: 's11', vo: 'vo_11', dur: 41.9, label: 'V1', tag: 'वायरल', mood: 'fun',
    bumper: {title: 'वायरल', variant: 'fun', kicker: 'सोशल मीडिया'},
    headline: 'वायरल: नोटों के बंडल जलाता शख्स', sub: 'नोट असली या नकली, पुष्टि नहीं',
    ticker: 'वायरल वीडियो: नोटों के बंडल जलाता दिखा शख्स, पुष्टि नहीं',
    beats: [
      {at: -0.5, until: 9.3, kind: 'viralIntro'},
      {at: 9.3, until: 42.4, kind: 'phone', video: 'vid/notes.mp4', credit: 'X / @AadyaTales', loop: true,
        callouts: [
          {at: 9.8, text: 'वीडियो चर्चा में', style: 'tag'},
          {at: 15.8, text: 'महीने के आख़िर में हम: पैसे गए कहाँ? 🤔', style: 'bubble'},
          {at: 21.1, text: 'और भाई साहब: पूरे पैसे धुएं में! 💨', style: 'bubble'},
          {at: 25.7, text: 'नोट असली या नकली? पुष्टि नहीं', style: 'stamp'},
          {at: 38.9, text: 'एक ज़रूरी बात', style: 'tag'},
        ]},
    ],
  },
  {
    id: 's12', vo: 'vo_12', dur: 44.3, label: 'V2', tag: 'वायरल', mood: 'fun',
    bumper: {title: 'अगला वायरल', variant: 'fun', kicker: 'सोशल मीडिया'},
    headline: 'वायरल: सांडों की कुश्ती, निशाने पर कार', sub: 'खड़ी लाल कार पर चढ़ा सांड, CCTV में कैद',
    ticker: 'दो सांडों की लड़ाई में खड़ी कार पर चढ़ा सांड, वीडियो वायरल',
    beats: [
      {at: -0.5, until: 13.3, kind: 'cctv', video: 'vid/bulls.mp4', credit: 'X / @iNikhilsaini'},
      {at: 13.3, until: 22.5, kind: 'round2', src: 's12_bulls/stock_bulls_fighting_street_india.jpg'},
      {at: 22.5, until: 33.0, kind: 'chat', src: 's12_bulls/viral_frame_bull_on_car_720x1280.jpg'},
      {at: 33.0, until: 44.8, kind: 'photo', layout: 'split', src: 's12_bulls/stock_cattle_street_car_delhi.jpg', kb: 'in', title: 'हंसी अपनी जगह, लेकिन...',
        points: [{at: 34.4, text: 'लड़ते जानवरों के इतने पास जाना ख़तरनाक'}, {at: 39.6, text: 'वीडियो की जगह और तारीख़ की स्वतंत्र पुष्टि नहीं'}]},
    ],
  },
  {
    id: 's13', vo: 'vo_13', dur: 13.8, label: 'V', tag: 'वायरल', mood: 'fun', bumper: null,
    headline: 'तो ये था सोशल मीडिया का हाल', sub: 'आपको कौन सा वीडियो सबसे मज़ेदार लगा?',
    ticker: 'कमेंट में बताइए: आज का कौन सा वायरल वीडियो सबसे मज़ेदार लगा?',
    beats: [{at: -0.5, until: 14.3, kind: 'wrap'}],
  },
  {
    id: 's14', vo: 'vo_14', dur: 14.2, label: '✓', tag: 'धन्यवाद', mood: 'normal', bumper: null, tail: 8,
    headline: 'LDS खबर • आज की प्रमुख खबरें', sub: 'सब्सक्राइब करें और बेल आइकन दबाएं',
    ticker: 'LDS खबर: हर खबर आपके साथ',
    beats: [{at: -0.5, until: 22.7, kind: 'outro'}],
  },
];

export const OPENER_SEC = 7.5;
export const LEAD = 0.5;
export const GAP_TAIL = 0.5; // visual hold after voice ends (when followed by bumper)

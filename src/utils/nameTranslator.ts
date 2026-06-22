const nameDict: Record<string, Record<string, string>> = {
  nithin: {
    en: "Nithin",
    hi: "नितिन",
    bn: "নিতিন",
    te: "నితిన్",
    mr: "नितीन",
    ta: "நிதின்",
    gu: "નિતિન",
    kn: "ನಿತಿನ್",
    ml: "നിതിൻ",
    pa: "ਨਿਤਿਨ",
    ur: "نتن",
    or: "ନିତିନ",
    as: "নিতিন"
  },
  amit: {
    en: "Amit",
    hi: "अमित",
    bn: "অমিত",
    te: "అమిత్",
    mr: "अमित",
    ta: "அமித்",
    gu: "અમિત",
    kn: "ಅಮಿತ್",
    ml: "അമിത്",
    pa: "ਅਮਿਤ",
    ur: "امیت",
    or: "ଅମିତ",
    as: "অমিত"
  },
  sharma: {
    en: "Sharma",
    hi: "शर्मा",
    bn: "শর্মা",
    te: "శర్మ",
    mr: "शर्मा",
    ta: "சர்மா",
    gu: "શર્મા",
    kn: "ಶರ್ಮಾ",
    ml: "ശർമ",
    pa: "ਸ਼ਰਮਾ",
    ur: "شرما",
    or: "ଶର୍ମା",
    as: "শৰ্মা"
  },
  priya: {
    en: "Priya",
    hi: "प्रिया",
    bn: "প্রিয়া",
    te: "ప్రియా",
    mr: "प्रिया",
    ta: "பிரியா",
    gu: "પ્રિયા",
    kn: "ಪ್ರಿಯಾ",
    ml: "പ്രിയ",
    pa: "ਪ੍ਰਿਆ",
    ur: "پریہ",
    or: "ପ୍ରିୟା",
    as: "প্ৰিয়া"
  },
  patel: {
    en: "Patel",
    hi: "पटेल",
    bn: "প্যাটেল",
    te: "పటేల్",
    mr: "पटेल",
    ta: "படேல்",
    gu: "પટેલ",
    kn: "ಪಟೇಲ್",
    ml: "പട്ടേൽ",
    pa: "ਪਟੇਲ",
    ur: "پٹیل",
    or: "ପଟେଲ",
    as: "পেটেল"
  },
  vinay: {
    en: "Vinay",
    hi: "विनय",
    bn: "বিনয়",
    te: "వినయ్",
    mr: "विनय",
    ta: "வினய்",
    gu: "વિનય",
    kn: "ವಿನಯ್",
    ml: "വിനയ്",
    pa: "ਵਿਨੈ",
    ur: "ونے",
    or: "ବିନୟ",
    as: "বিনয়"
  },
  "g.": {
    en: "G.",
    hi: "जी.",
    bn: "জি.",
    te: "జి.",
    mr: "जी.",
    ta: "ஜி.",
    gu: "જી.",
    kn: "ಜಿ.",
    ml: "ജി.",
    pa: "ਜੀ.",
    ur: "جی",
    or: "ଜି.",
    as: "জি"
  },
  swamy: {
    en: "Swamy",
    hi: "स्वामी",
    bn: "স্বামী",
    te: "స్వామి",
    mr: "स्वामी",
    ta: "ஸ்வாมิ",
    gu: "સ્વામી",
    kn: "ಸ್ವಾಮಿ",
    ml: "സ്വാമി",
    pa: "ਸਵਾਮੀ",
    ur: "سوامی",
    or: "ସ୍ୱାମୀ",
    as: "স্বামী"
  },
  rajesh: {
    en: "Rajesh",
    hi: "राजेश",
    bn: "রাজেশ",
    te: "ರಾజేష్",
    mr: "राजेश",
    ta: "ராஜேஷ்",
    gu: "રાજેશ",
    kn: "ರಾಜೇಶ್",
    ml: "രാജേഷ്",
    pa: "ਰਾਜੇਸ਼",
    ur: "راجیش",
    or: "ରାଜେଶ",
    as: "ৰাজেশ"
  },
  kumar: {
    en: "Kumar",
    hi: "कुमार",
    bn: "কুমার",
    te: "కుమార్",
    mr: "कुमार",
    ta: "குமார்",
    gu: "કુમાર",
    kn: "ಕುಮಾರ್",
    ml: "കുമാർ",
    pa: "ਕੁਮਾਰ",
    ur: "کمار",
    or: "କୁମାର",
    as: "କୁମାଡ଼"
  },
  mehta: {
    en: "Mehta",
    hi: "मेहता",
    bn: "মেহতা",
    te: "మెహతా",
    mr: "मेहता",
    ta: "மேத்தா",
    gu: "મહેતા",
    kn: "ಮೆಹತಾ",
    ml: "മേത്ത",
    pa: "ਮਹਿਤਾ",
    ur: "مہتا",
    or: "ମେହେତା",
    as: "মেহতা"
  }
};

export function translatePatientName(name: string, lang: string): string {
  if (!name || lang === 'en') return name;

  const words = name.split(/\s+/);
  const translatedWords = words.map(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z.]/g, '');
    const matched = nameDict[cleanWord];
    if (matched && matched[lang]) {
      // Keep punctuation or original casing style from mapped item if needed
      return matched[lang];
    }
    // Return original word if not found
    return word;
  });

  return translatedWords.join(' ');
}

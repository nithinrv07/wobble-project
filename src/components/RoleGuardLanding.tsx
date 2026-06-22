import React, { useState, useEffect } from 'react';
import { Shield, User, Key, ArrowRight, Eye, EyeOff, Activity, Bell, Flame, CheckCircle2, ChevronRight, Search, Globe } from 'lucide-react';
import { Patient, SmsMessage } from '../types';
import PhoneMockup from './PhoneMockup';
import { getReceptionistTranslation } from '../utils/receptionistTranslations';
import { translatePatientName } from '../utils/nameTranslator';

const translations = {
  en: {
    portalTitle: "Patient Self-Care & Status Portal",
    subtitle: "Real-time ClinicQ Waiting Statistics",
    changeRole: "← Change Role",
    nowServing: "Now in OPD Cabin",
    noPatientCalled: "No patient currently called",
    token: "Token",
    currentQueue: "Current OPD Waitlist Queue",
    candidates: "Candidates",
    waitRank: "Wait #",
    mins: "mins",
    emptyQueue: "The OPD queue is temporarily empty. Enjoy zero wait time!",
    lookupTitle: "Lookup your Token Slot",
    placeholderLookup: "Enter Token #, Phone or Name...",
    find: "Find",
    visitType: "Visit Type",
    patientNameDisplay: "Patient Name",
    queueStatusAhead: "Patients Ahead",
    patientNotFound: "Token or Patient not found in active wait queue.",
    generateToken: "Generate OPD Entrance Token",
    tokenRegistered: "TOKEN REGISTERED!",
    successInfo: "Your ClinicQ queue ID was added successfully. You will receive simulated SMS alert status as your clinical slot nears.",
    bookAnother: "Book Another",
    labelFullName: "Full Patient Name",
    labelMobile: "Mobile Telephone",
    labelOpdUnit: "OPD Unit",
    labelPriority: "Priority Special",
    btnProcessToken: "Process & Print OPD Token",
    unitConsultation: "General Consultation",
    unitCheckup: "OPD Checkup",
    unitDiagnostics: "Diagnostics",
    unitVaccination: "Vaccination",
    unitPediatric: "Pediatric Consultant",
    priorityRegular: "Regular",
    priorityChild: "Child/Infant",
    prioritySenior: "Senior Citizen",
    announcementsTitle: "Announcements",
    announcementTicker: "📢 INSTRUCTIONS: Please proceed to the designated OPD room immediately when your token is called • Senior citizens, infants, and emergency triage are prioritized automatically in the waitlist • Keep your digital token ready for check-in verification • Thank you for your cooperation and patience."
  },
  hi: {
    portalTitle: "मरीज स्वयं-सेवा और स्थिति पोर्टल",
    subtitle: "वास्तविक समय स्वास्थ्य प्रतीक्षा आंकड़े",
    changeRole: "← भूमिका बदलें",
    nowServing: "अभी ओपीडी केबिन में",
    noPatientCalled: "वर्तमान में किसी मरीज को नहीं बुलाया गया",
    token: "टोकन",
    currentQueue: "वर्तमान ओपीडी प्रतीक्षा सूची",
    candidates: "उम्मीदवार",
    waitRank: "प्रतीक्षा #",
    mins: "मिनट",
    emptyQueue: "ओपीडी कतार अस्थायी रूप से खाली है। शून्य प्रतीक्षा समय का आनंद लें!",
    lookupTitle: "अपने टोकन स्लॉट की खोज करें",
    placeholderLookup: "टोकन नंबर, फोन या नाम दर्ज करें...",
    find: "खोजें",
    visitType: "यात्रा का प्रकार",
    patientNameDisplay: "मरीज का नाम",
    queueStatusAhead: "मरीज आगे हैं",
    patientNotFound: "सक्रिय प्रतीक्षा सूची में टोकन या मरीज नहीं मिला।",
    generateToken: "ओपीडी प्रवेश टोकन उत्पन्न करें",
    tokenRegistered: "टोकन पंजीकृत हुआ!",
    successInfo: "आपका स्वास्थ्य कतार आईडी सफलतापूर्वक जोड़ दिया गया है। जैसे-जैसे आपका समय निकट आएगा, आपको संदेश प्राप्त होगा।",
    bookAnother: "दूसरा बुक करें",
    labelFullName: "मरीज का पूरा नाम",
    labelMobile: "मोबाइल टेलीफोन",
    labelOpdUnit: "ओपीडी विभाग",
    labelPriority: "विशेष प्राथमिकता",
    btnProcessToken: "प्रक्रिया करें और ओपीडी टोकन प्रिंट करें",
    unitConsultation: "सामान्य परामर्श",
    unitCheckup: "ओपीडी जांच",
    unitDiagnostics: "डायग्नोस्टिक्स",
    unitVaccination: "टीकाकरण",
    unitPediatric: "बाल रोग विशेषज्ञ",
    priorityRegular: "सामान्य",
    priorityChild: "बच्चा/शिशु",
    prioritySenior: "वरिष्ठ नागरिक",
    announcementsTitle: "सूचनाएं",
    announcementTicker: "📢 निर्देश: जब आपका टोकन बुलाया जाए, तो कृपया तुरंत निर्दिष्ट ओपीडी कमरे में जाएं • वरिष्ठ नागरिकों, शिशुओं और आपातकालीन मामलों को प्रतीक्षा सूची में स्वतः प्राथमिकता दी जाती है • सत्यापन के लिए अपना डिजिटल टोकन तैयार रखें • आपके सहयोग और धैर्य के लिए धन्यवाद।"
  },
  bn: {
    portalTitle: "রোগী স্ব-পরিষেবা ও স্ট্যাটাস পোর্টাল",
    subtitle: "রিয়েল-টাইম স্বাস্থ্য অপেক্ষার পরিসংখ্যান",
    changeRole: "← ভূমিকা পরিবর্তন",
    nowServing: "এখন ওপিডি কেবিনে আছেন",
    noPatientCalled: "বর্তমানে কোন রোগীকে ডাকা হয়নি",
    token: "টোকেন",
    currentQueue: "বর্তমান ওপিডি অপেক্ষমাণ তালিকা",
    candidates: "জন রোগী",
    waitRank: "অপেক্ষা #",
    mins: "মিনিট",
    emptyQueue: "ওপিডি লাইন সাময়িকভাবে খালি রয়েছে। জিরো ওয়েটিং উপভোগ করুন!",
    lookupTitle: "আপনার টোকেন স্লট খুঁজুন",
    placeholderLookup: "টোকেন নং, ফোন বা নাম লিখুন...",
    find: "খুঁজুন",
    visitType: "পরিদর্শনের ধরণ",
    patientNameDisplay: "রোগীর নাম",
    queueStatusAhead: "জন রোগী সামনে আছেন",
    patientNotFound: "সক্রিয় অপেক্ষমাণ তালিকায় টোকেন বা রোগী পাওয়া যায়নি।",
    generateToken: "ওপিডি প্রবেশ টোকেন তৈরি করুন",
    tokenRegistered: "টোকেন নিবন্ধিত হয়েছে!",
    successInfo: "আপনার স্বাস্থ্য সারিবদ্ধ আইডি সফলভাবে যোগ করা হয়েছে। আপনার সময় এলে আপনি এসএমএস পাবেন।",
    bookAnother: "আরেকটি বুক করুন",
    labelFullName: "রোগীর সম্পূর্ণ নাম",
    labelMobile: "মোবাইল ফোন নম্বর",
    labelOpdUnit: "ওপিডি বিভাগ",
    labelPriority: "বিশেষ অগ্রাধিকার",
    btnProcessToken: "ওপিডি টোকেন প্রিন্ট করুন",
    unitConsultation: "সাধারণ পরামর্শ",
    unitCheckup: "ওপিডি পরীক্ষা",
    unitDiagnostics: "ডায়াগনস্টিকস",
    unitVaccination: "টিকা",
    unitPediatric: "শিশু বিশেষজ্ঞ পরামর্শ",
    priorityRegular: "সাধারণ",
    priorityChild: "শিশু/নবজাতক",
    prioritySenior: "প্রবীণ নাগরিক",
    announcementsTitle: "ঘোষণা",
    announcementTicker: "📢 নির্দেশাবলী: আপনার টোকেন নম্বর ডাকার সাথে সাথে অনুগ্রহ করে নির্ধারিত ওপিডি রুমে যান • প্রবীণ নাগরিক, শিশু এবং জরুরি রোগীদের অগ্রাধিকার দেওয়া হয় • যাচাইকরণের জন্য আপনার ডিজিটাল টোকেনটি প্রস্তুত রাখুন • আপনার সহযোগিতা এবং ধৈর্যের জন্য ধন্যবাদ।"
  },
  te: {
    portalTitle: "రోగి స్వయం సహాయక & స్థితి పోర్టల్",
    subtitle: "నిజ-సమయ స్వాస్థ్య నిరీక్షణ గణాంకాలు",
    changeRole: "← పాత్ర మార్చండి",
    nowServing: "ప్రస్తుతం OPD క్యాబిన్‌లో ఉన్నారు",
    noPatientCalled: "ప్రస్తుతానికి రోగులెవరూ పిలవబడలేదు",
    token: "టోకెన్",
    currentQueue: "ప్రస్తుత OPD నిరీక్షణ జాబితా",
    candidates: "రోగులు",
    waitRank: "క్యూ #",
    mins: "నిమిషాలు",
    emptyQueue: "OPD క్యూ తాత్కాలికంగా ఖాళీగా ఉంది. నిరీక్షణ సమయం లేదు!",
    lookupTitle: "మీ టోకెన్ స్లాట్ తనిఖీ చేయండి",
    placeholderLookup: "టోకెన్ నంబర్, ఫోన్ లేదా పేరు నమోదు చేయండి...",
    find: "వెతకండి",
    visitType: "సందర్శన రకం",
    patientNameDisplay: "రోగి పేరు",
    queueStatusAhead: "రోగులు మీ కంటే ముందు ఉన్నారు",
    patientNotFound: "క్యూలో మీ టోకెన్ లేదా రోగి వివరాలు లభించలేదు.",
    generateToken: "OPD ప్రవేశ టోకెన్ సృష్టించండి",
    tokenRegistered: "టోకెన్ విజయవంతంగా నమోదైంది!",
    successInfo: "మీ స్వాస్థ్య క్యూ ఐడి నమోదు చేయబడింది. మీ స్లాట్ దగ్గరపడినప్పుడు మీకు అలర్ట్ మెసేజ్ వస్తుంది.",
    bookAnother: "మరొకటి బుక్ చేయండి",
    labelFullName: "రోగి పూర్తి పేరు",
    labelMobile: "మొబైల్ ఫోన్",
    labelOpdUnit: "OPD విభాగం",
    labelPriority: "ప్రత్యేక ప్రాధాన్యత",
    btnProcessToken: "OPD టోకెన్ ప్రింట్ చేయండి",
    unitConsultation: "సాధారణ సంప్రదింపులు",
    unitCheckup: "OPD చెకప్",
    unitDiagnostics: "డయాగ్నోస్టిక్స్",
    unitVaccination: "టీకాలు",
    unitPediatric: "పిల్లల వైద్య నిపుణుడు",
    priorityRegular: "సాధారణ",
    priorityChild: "బిడ్డ/శిశువు",
    prioritySenior: "సీనియర్ సిటిజెన్",
    announcementsTitle: "ప్రకటనలు",
    announcementTicker: "📢 సూచనలు: మీ టోకెన్ పిలిచిన వెంటనే దయచేసి కేటాయించిన OPD గదికి వెళ్లండి • సీనియర్ సిటిజన్లు, శిశువులు మరియు అత్యవసర కేసులకు క్యూలో ప్రాಧాన్యత ఇవ్వబడుతుంది • ధృవీకరణ కోసం మీ డిజిటల్ టోకెన్ సిద్ధంగా ఉంచుకోండి • మీ సహకారానికి మరియు ఓపికకు ధన్యవాదాలు."
  },
  mr: {
    portalTitle: "रुग्ण स्वयं-सेवा आणि स्थिती पोर्टल",
    subtitle: "रिअल-टाइम स्वास्थ्य प्रतीक्षा आकडेवारी",
    changeRole: "← भूमिका बदला",
    nowServing: "आता ओपीडी केबिनमध्ये",
    noPatientCalled: "सध्या कोणत्याही रुग्णाला बोलावले नाही",
    token: "टोकन",
    currentQueue: "सध्याची ओपीडी प्रतीक्षा सूची",
    candidates: "रुग्ण",
    waitRank: "प्रतीक्षा #",
    mins: "मिनिटे",
    emptyQueue: "ओपीडी रांग तात्पुरती रिकामी आहे. शून्य प्रतीक्षा वेळेचा आनंद घ्या!",
    lookupTitle: "तुमचा टोकन स्लॉट शोधा",
    placeholderLookup: "टोकन नंबर, फोन किंवा नाव प्रविष्ट करा...",
    find: "शोधा",
    visitType: "भेटीचा प्रकार",
    patientNameDisplay: "रुग्णाचे नाव",
    queueStatusAhead: "रुग्ण पुढे आहेत",
    patientNotFound: "सक्रिय प्रतीक्षा रांगेत टोकन किंवा रुग्ण आढळला नाही.",
    generateToken: "ओपीडी प्रवेश टोकन तयार करा",
    tokenRegistered: "टोकन नोंदणीकृत!",
    successInfo: "तुमचा स्वास्थ्य रांग आयडी यशस्वीरित्या जोडला गेला आहे. तुमची वेळ जवळ आल्यावर तुम्हाला संदेश प्राप्त होईल.",
    bookAnother: "दुसरे बुक करा",
    labelFullName: "रुग्णाचे पूर्ण नाव",
    labelMobile: "मोबाईल फोन",
    labelOpdUnit: "ओपीडी विभाग",
    labelPriority: "विशेष प्राधान्य",
    btnProcessToken: "ओपीडी टोकन प्रिंट करा",
    unitConsultation: "सामान्य सल्लामसलत",
    unitCheckup: "ओपीडी तपासणी",
    unitDiagnostics: "निदान चाचणी",
    unitVaccination: "लसीकरण",
    unitPediatric: "बालरोग तज्ज्ञ",
    priorityRegular: "सामान्य",
    priorityChild: "लहान मूल/शिशू",
    prioritySenior: "ज्येष्ठ नागरिक",
    announcementsTitle: "सूचना",
    announcementTicker: "📢 मार्गदर्शक तत्त्वे: तुमचा टोकन नंबर पुकारल्यावर कृपया लगेच संबंधित ओपीडी खोलीत जा • ज्येष्ठ नागरिक, लहान मुले आणि आपत्कालीन रुग्णांना प्रतीक्षा यादीत आपोआप प्राधान्य दिले जाते • पडताळणीसाठी तुमचा डिजिटल टोकन तयार ठेवा • आपल्या सहकार्याबद्दल आणि संयमाबद्दल धन्यवाद।"
  },
  ta: {
    portalTitle: "நோயாளி சுய சேவை & நிலை போர்டல்",
    subtitle: "நேரடி சுவஸ்தியா காத்திருப்பு புள்ளிவிவரங்கள்",
    changeRole: "← பாத்திரத்தை மாற்றவும்",
    nowServing: "தற்போது ஓபிடி கேபினில்",
    noPatientCalled: "தற்போது நோயாளிகள் யாரும் அழைக்கப்படவில்லை",
    token: "டோக்கன்",
    currentQueue: "தற்போதைய ஓபிடி காத்திருப்பு பட்டியல்",
    candidates: "நபர்கள்",
    waitRank: "காத்திருப்பு #",
    mins: "நிமிடங்கள்",
    emptyQueue: "ஓபிடி வரிசை தற்காலிகமாக காலியாக உள்ளது. காத்திருப்பு நேரம் இல்லை!",
    lookupTitle: "உங்கள் டோக்கன் இடத்தை தேடுங்கள்",
    placeholderLookup: "டோக்கன் எண், தொலைபேசி அல்லது பெயரை உள்ளிடவும்...",
    find: "கண்டுபிடி",
    visitType: "வருகை வகை",
    patientNameDisplay: "நோயாளி பெயர்",
    queueStatusAhead: "நோயாளிகள் உங்களுக்கு முன்னால் உள்ளனர்",
    patientNotFound: "செயலில் உள்ள காத்திருப்பு வரிசையில் டோக்கன் அல்லது நோயாளி கிடைக்கவில்லை.",
    generateToken: "ஓபிடி நுழைவு டோக்கனை உருவாக்குங்கள்",
    tokenRegistered: "டோக்கன் பதிவு செய்யப்பட்டது!",
    successInfo: "உங்கள் சுவஸ்தியா வரிசை ஐடி வெற்றிகரமாக சேர்க்கப்பட்டது. உங்கள் சிகிச்சை நேரம் நெருங்கும்போது எஸ்பிஎம்எஸ் மூலம் எச்சரிக்கை அறிவிக்கப்படும்.",
    bookAnother: "மற்றொன்றை பதிவு செய்",
    labelFullName: "நோயாளியின் முழு பெயர்",
    labelMobile: "மொபைல் தொலைபேசி",
    labelOpdUnit: "ஓபிடி பிரிவு",
    labelPriority: "சிறப்பு முன்னுரிமை",
    btnProcessToken: "ஓபிடி டோக்கன் அச்சிடுக",
    unitConsultation: "பொது ஆலோசனை",
    unitCheckup: "ஓபிடி பரிசோதனை",
    unitDiagnostics: "பரிசோதனைகள்",
    unitVaccination: "தடுப்பூசி",
    unitPediatric: "குழந்தை நல மருத்துவர்",
    priorityRegular: "சாதாரண",
    priorityChild: "குழந்தை/குழந்தை",
    prioritySenior: "மூத்த குடிமகன்",
    announcementsTitle: "அறிவிப்புகள்",
    announcementTicker: "📢 வழிமுறைகள்: உங்கள் டோக்கன் எண் அழைக்கப்பட்டவுடன் உடனடியாக ஒதுக்கப்பட்ட ஓபிடி அறைக்கு செல்லவும் • முதியவர்கள், குழந்தைகள் மற்றும் அவசர சிகிச்சை நோயாளிகளுக்கு முன்னுரிமை வழங்கப்படும் • சரிபார்ப்புக்கு உங்கள் டிஜிட்டல் டோக்கனை தயாராக வைத்திருக்கவும் • உங்கள் ஒத்துழைப்புக்கும் பொறுமைக்கும் நன்றி."
  },
  gu: {
    portalTitle: "દર્દી સ્વ-સેવા અને સ્થિતિ પોર્ટલ",
    subtitle: "રીયલ-ટાઇમ સ્વાસ્થ્ય પ્રતીક્ષા આંકડા",
    changeRole: "← ભૂમિકા બદલો",
    nowServing: "હાલમાં ઓપીડી કેબિનમાં",
    noPatientCalled: "હાલમાં કોઈ દર્દીને બોલાવવામાં આવ્યા નથી",
    token: "ટોકન",
    currentQueue: "હાલની ઓપીડી પ્રતીક્ષા સૂચિ",
    candidates: "દર્દીઓ",
    waitRank: "પ્રતીક્ષા #",
    mins: "મિનિટ",
    emptyQueue: "ઓપીડી કતાર અસ્થાયી રૂપે ખાલી છે. શૂન્ય પ્રતીક્ષા સમયનો આનંદ માણો!",
    lookupTitle: "તમારો ટોકન સ્લોટ શોધો",
    placeholderLookup: "ટોકન નંબર, ફોન અથવા નામ દાખલ કરો...",
    find: "શોધો",
    visitType: "મુલાકાતનો પ્રકાર",
    patientNameDisplay: "દર્દીનું નામ",
    queueStatusAhead: "દર્દીઓ આગળ છે",
    patientNotFound: "સક્રિય પ્રતીક્ષા યોજનામાં ટોકન અથવા દર્દી મળ્યા નથી.",
    generateToken: "ઓપીડી પ્રવેશ ટોકન બનાવો",
    tokenRegistered: "ટોકન રજીસ્ટર થયું!",
    successInfo: "તમારો સ્વાસ્થ્ય કતાર આઈડી સફળતાપૂર્વક ઉમેરવામાં આવ્યો છે. સમય નજીક આવતા જ તમને એસએમએસ ચેતવણી મળશે.",
    bookAnother: "બીજું બુક કરો",
    labelFullName: "દર્દીનું પૂરું નામ",
    labelMobile: "મોબાઈલ ફોન",
    labelOpdUnit: "ઓપીડી વિભાગ",
    labelPriority: "વિશેષ પ્રાધાન્યતા",
    btnProcessToken: "ઓપીડી ટોકન પ્રિન્ટ કરો",
    unitConsultation: "સામાન્ય પરામર્શ",
    unitCheckup: "ઓપીડી તપાસ",
    unitDiagnostics: "નિદાન પરીક્ષણ",
    unitVaccination: "રસીકરણ",
    unitPediatric: "બાળ રોગ નિષ્ણાત",
    priorityRegular: "સામાન્ય",
    priorityChild: "બાળક/શિશુ",
    prioritySenior: "વરિષ્ઠ નાગરિક",
    announcementsTitle: "જાહેરાતો",
    announcementTicker: "📢 સૂચનાઓ: જ્યારે તમારો ટોકન બોલાવવામાં આવે ત્યારે કૃપા કરીને નિયુક્ત ઓપીડી રૂમમાં તરત જ જાઓ • વરિષ્ઠ નાગરિકો, બાળકો અને ઇમરજન્સી દર્દીઓને આપમેળે પ્રાધાન્ય આપવામાં આવે છે • વેરિફિકેશન માટે તમારો ડિજિટલ ટોકન તૈયાર રાખો • તમારા સહકાર અને ધીરજ બદલ આભાર."
  },
  kn: {
    portalTitle: "ರೋಗಿಗಳ ಸ್ವಯಂ ಸೇವೆ ಮತ್ತು ಸ್ಥಿತಿ ಪೋರ್ಟಲ್",
    subtitle: "ರಿಯಲ್-ಟೈಮ್ ಸ್ವಾಸ್ಥ್ಯ ಕಾಯುವಿಕೆ ಅಂಕಿಅಂಶಗಳು",
    changeRole: "← ಪಾತ್ರ ಬದಲಾಯಿಸಿ",
    nowServing: "ಈಗ ಒಪಿಡಿ ಕ್ಯಾಬಿನ್‌ನಲ್ಲಿದ್ದಾರೆ",
    noPatientCalled: "ಪ್ರಸ್ತುತ ಯಾವ ರೋಗಿಯನ್ನೂ ಕರೆಯಲಾಗಿಲ್ಲ",
    token: "ಟೋಕನ್",
    currentQueue: "ಪ್ರಸ್ತುತ ಒಪಿಡಿ ಕಾಯುವಿಕೆ ಪಟ್ಟಿ",
    candidates: "ರೋಗಿಗಳು",
    waitRank: "ಕಾಯುವಿಕೆ #",
    mins: "ನಿಮಿಷಗಳು",
    emptyQueue: "ಒಪಿಡಿ ಸರತಿ ಸಾಲು ತಾತ್ಕಾಲಿಕವಾಗಿ ಖಾಲಿಯಾಗಿದೆ. ಶೂನ್ಯ ಕಾಯುವ ಸಮಯವನ್ನು ಆನಂದಿಸಿ!",
    lookupTitle: "ನಿಮ್ಮ ಟೋಕನ್ Slot ಅನ್ನು ಹುಡುಕಿ",
    placeholderLookup: "ಟೋಕನ್ ಸಂಖ್ಯೆ, ಫೋನ್ ಅಥವಾ ಹೆಸರನ್ನು ನಮೂದಿಸಿ...",
    find: "ಹುಡುಕು",
    visitType: "ಭೇಟಿಯ ವಿಧ",
    patientNameDisplay: "ರೋಗಿಯ ಹೆಸರು",
    queueStatusAhead: "ರೋಗಿಗಳು ನಿಮ್ಮ ಮುಂದೆ ಇದ್ದಾರೆ",
    patientNotFound: "ಸಕ್ರಿಯ ಕಾಯುವ ಪಟ್ಟಿಯಲ್ಲಿ ಟೋಕನ್ ಅಥವಾ ರೋಗಿ ಪತ್ತೆಯಾಗಿಲ್ಲ.",
    generateToken: "ಒಪಿಡಿ ಪ್ರವೇಶ ಟೋಕನ್ ರಚಿಸಿ",
    tokenRegistered: "ಟೋಕನ್ ನೋಂದಾಯಿಸಲಾಗಿದೆ!",
    successInfo: "ನಿಮ್ಮ ಸ್ವಾಸ್ಥ್ಯ ಸರತಿ ಐಡಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಸಮಯ ಹತ್ತಿರವಾಗುತ್ತಿದ್ದಂತೆ ಅಪ್ ಡೇಟ್ ಗಳ ಎಚ್ಚರಿಕೆ ಸಂದೇಶಗಳು ದೊರೆಯುತ್ತವೆ.",
    bookAnother: "ಮತ್ತೊಂದನ್ನು ಬುಕ್ ಮಾಡಿ",
    labelFullName: "ರೋಗಿಯ ಪೂರ್ಣ ಹೆಸರು",
    labelMobile: "ಮೊಬೈಲ್ ಫೋನ್",
    labelOpdUnit: "OPD ವಿಭಾಗ",
    labelPriority: "ವಿಶೇಷ ಆದ್ಯತೆ",
    btnProcessToken: "OPD ಟೋಕನ್ ಪ್ರಿಂಟ್ ಮಾಡಿ",
    unitConsultation: "ಸಾಮಾನ್ಯ ಸಮಾಲೋಚನೆ",
    unitCheckup: "OPD ತಪಾಸಣೆ",
    unitDiagnostics: "ರೋಗನಿರ್ಣಯ ಪರೀಕ್ಷೆಗಳು",
    unitVaccination: "ಲಸಿಕಾಕರಣ",
    unitPediatric: "ಮಕ್ಕಳ ತಜ್ಞರ ಸಮಾಲೋಚನೆ",
    priorityRegular: "ಸಾಮಾನ್ಯ ಕ್ಯೂ",
    priorityChild: "ಶಿಶು/ಮಗು",
    prioritySenior: "ಹಿರಿಯ ನಾಗರಿಕರು",
    announcementsTitle: "ಪ್ರಕಟಣೆಗಳು",
    announcementTicker: "📢 ಸೂಚನೆಗಳು: ನಿಮ್ಮ ಟೋಕನ್ ಕರೆದ ತಕ್ಷಣ ದಯವಿಟ್ಟು ನಿಗದಿಪಡಿಸಿದ ಒಪಿಡಿ ಕೋಣೆಗೆ ಹೋಗಿ • ಹಿರಿಯ ನಾಗರಿಕರು, ಮಕ್ಕಳು ಮತ್ತು ತುರ್ತು ಚಿಕಿತ್ಸೆ ರೋಗಿಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡಲಾಗುತ್ತದೆ • ಪರಿಶೀಲನೆಗಾಗಿ ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಟೋಕನ್ ಸಿದ್ಧವಾಗಿಡಿ • ನಿಮ್ಮ ಸಹಕಾರ ಮತ್ತು ತಾಳ್ಮೆಗೆ ಧನ್ಯವಾದಗಳು."
  },
  ml: {
    portalTitle: "രോഗികളുടെ സ്വയം സേവന പോർട്ടൽ",
    subtitle: "തത്സമയ സ്വാസ്ഥ്യ കാത്തിരിപ്പ് വിവരങ്ങൾ",
    changeRole: "← റോൾ മാറ്റുക",
    nowServing: "ഇപ്പോൾ ഒപിഡി ക്യാബിനിൽ ഉള്ളവർ",
    noPatientCalled: "നിലവിൽ രോഗികളെ ആരെയും വിളിച്ചിട്ടില്ല",
    token: "ടോക്കൺ",
    currentQueue: "നിലവിലെ ഒപിഡി വെയ്റ്റ് ലിസ്റ്റ്",
    candidates: "പേർ",
    waitRank: "കാത്തിരിപ്പ് സ്ഥാനം #",
    mins: "മിനിറ്റ്",
    emptyQueue: "ഒപിഡി ക്യൂ താൽക്കാലികമായി ഒഴിവാണ്. കാത്തിരിപ്പില്ലാതെ പരിശോധിക്കാം!",
    lookupTitle: "നിങ്ങളുടെ ടോക്കൺ പരിശോധിക്കുക",
    placeholderLookup: "ടോക്കൺ നമ്പർ, ഫോൺ അല്ലെങ്കിൽ പേര് നൽകുക...",
    find: "തിരയുക",
    visitType: "സന്ദർശന തരം",
    patientNameDisplay: "രോഗിയുടെ പേര്",
    queueStatusAhead: "പേർ നിങ്ങൾക്ക് മുൻപിലുണ്ട്",
    patientNotFound: "സജീവ വെയ്റ്റിംഗ് ലിസ്റ്റിൽ ഈ ടോക്കൺ അല്ലെങ്കിൽ രോഗിയെ കണ്ടെത്താനായില്ല.",
    generateToken: "ഒപിഡി പ്രവേശന ടോക്കൺ നിർമ്മിക്കുക",
    tokenRegistered: "ടോക്കൺ രജിസ്റ്റർ ചെയ്തു!",
    successInfo: "നിങ്ങളുടെ സ്വാസ്ഥ്യ ക്യൂ ഐഡി വിജയകരമായി ചേർത്തു. നിങ്ങളുടെ ഒപിഡി സമയം അടുക്കുമ്പോൾ എസ്എംഎസ് വിവരം ലഭിക്കുന്നതാണ്.",
    bookAnother: "മറ്റൊന്ന് ബുക്ക് ചെയ്യുക",
    labelFullName: "രോഗിയുടെ മുഴുവൻ പേര്",
    labelMobile: "മൊബൈൽ നമ്പർ",
    labelOpdUnit: "ഒപിഡി വിഭാഗം",
    labelPriority: "പ്രത്യേക മുൻഗണന",
    btnProcessToken: "ഒപിഡി ടോക്കൺ പ്രിന്റ് ചെയ്യുക",
    unitConsultation: "ജനറൽ ഒപിഡി",
    unitCheckup: "ഒപിഡി പരിശോധന",
    unitDiagnostics: "രോഗനിർണയ പരിശോധനകൾ",
    unitVaccination: "പ്രതിരോധ കുത്തിവയ്പ്പ്",
    unitPediatric: "ശിശുരോഗ വിദഗ്ദ്ധൻ",
    priorityRegular: "സാധാരണ",
    priorityChild: "ശിശു/കുട്ടി",
    prioritySenior: "മുതിർന്ന പൗരന്മാർ",
    announcementsTitle: "അറിയിപ്പുകൾ",
    announcementTicker: "📢 നിർദ്ദേശങ്ങൾ: നിങ്ങളുടെ ടോക്കൺ നമ്പർ വിളിക്കുമ്പോൾ ദയവായി നിശ്ചിത ഒപിഡി മുറിയിലേക്ക് ഉടൻ പോവുക • മുതിർന്ന പൗരന്മാർ, കുട്ടികൾ, അടിയന്തിര വിഭാഗക്കാർ എന്നിവർക്ക് മുൻഗണന നൽകുന്നതാണ് • പരിശോധനയ്ക്കായി ഡിജിറ്റൽ ടോക്കൺ കരുതുക • നിങ്ങളുടെ സഹകരണത്തിനും ക്ഷമയ്ക്കും നന്ദി."
  },
  pa: {
    portalTitle: "ਮਰੀਜ਼ ਸਵੈ-ਸੇਵਾ ਅਤੇ ਸਥਿਤੀ ਪੋਰਟਲ",
    subtitle: "ਰੀਅਲ-ਟਾਈਮ ਸਵਾਸਥਿਆ ਉਡੀਕ ਅੰਕੜੇ",
    changeRole: "← ਭੂਮਿਕਾ ਬਦਲੋ",
    nowServing: "ਹੁਣ ਓਪੀਡੀ ਕੇਬਿਨ ਵਿੱਚ",
    noPatientCalled: "ਫਿਲਹਾਲ ਕਿਸੇ ਮਰੀਜ਼ ਨੂੰ ਨਹੀਂ ਬੁਲਾਇਆ ਗਿਆ",
    token: "ਟੋਕਨ",
    currentQueue: "ਮੌਜੂਦਾ ਓਪੀਡੀ ਉਡੀਕ ਸੂਚੀ",
    candidates: "ਮਰੀਜ਼",
    waitRank: "ਉਡੀਕ ਸਥਾਨ #",
    mins: "ਮਿੰਟ",
    emptyQueue: "ਓਪੀਡੀ ਕਤਾਰ ਅਸਥਾਈ ਤੌਰ 'ਤੇ ਖਾਲੀ ਹੈ। ਜ਼ੀਰੋ ਉਡੀਕ ਸਮੇਂ ਦਾ ਆਨੰਦ ਲਓ!",
    lookupTitle: "ਆਪਣਾ ਟੋਕਨ ਸਲਾਟ ਲੱਭੋ",
    placeholderLookup: "ਟੋਕਨ ਨੰਬਰ, ਫ਼ੋਨ ਜਾਂ ਨਾਮ ਦਰਜ ਕਰੋ...",
    find: "ਲੱਭੋ",
    visitType: "ਮੁਲਾਕਾਤ ਦੀ ਕਿਸਮ",
    patientNameDisplay: "ਮਰੀਜ਼ ਦਾ ਨਾਮ",
    queueStatusAhead: "ਮਰੀਜ਼ ਤੁਹਾਡੇ ਤੋਂ ਅੱਗੇ ਹਨ",
    patientNotFound: "ਸਰਗਰਮ ਉਡੀਕ ਕਤਾਰ ਵਿੱਚ ਟੋਕਨ ਜਾਂ ਮਰੀਜ਼ ਨਹੀਂ ਮਿਲਿਆ।",
    generateToken: "ਓਪੀਡੀ ਪ੍ਰਵੇਸ਼ ਟੋਕਨ ਬਣਾਓ",
    tokenRegistered: "ਟੋਕਨ ਰਜਿਸਟਰਡ!",
    successInfo: "ਤੁਹਾਡੀ ਸਵਾਸਥਿਆ ਕਤਾਰ ਆਈਡੀ ਸਫਲਤਾਪੂਰਵਕ ਜੋੜ ਦਿੱਤੀ ਗਈ ਹੈ। ਸਮਾਂ ਨੇੜੇ ਆਉਣ 'ਤੇ ਤੁਹਾਨੂੰ ਐਸਐਮਐਸ ਅਲਰਟ ਪ੍ਰਾਪਤ ਹੋਵੇਗਾ।",
    bookAnother: "ਦੂਜਾ ਬੁੱਕ ਕਰੋ",
    labelFullName: "ਮਰੀਜ਼ ਦਾ ਪੂਰਾ ਨਾਮ",
    labelMobile: "ਮੋਬਾਈਲ ਫ਼ੋਨ",
    labelOpdUnit: "ਓਪੀਡੀ ਵਿਭਾਗ",
    labelPriority: "ਵਿਸ਼ੇশ ਤਰਜੀਹ",
    btnProcessToken: "ਓਪੀਡੀ ਟੋਕਨ ਪ੍ਰਿੰਟ ਕਰੋ",
    unitConsultation: "ਆਮ ਸਲਾਹ",
    unitCheckup: "ਓਪੀਡੀ ਜਾਂਚ",
    unitDiagnostics: "ਟੈਸਟ ਅਤੇ ਲੈਬ",
    unitVaccination: "ਟੀਕਾਕਰਨ",
    unitPediatric: "ਬੱਚਿਆਂ ਦੇ ਮਾਹਰ",
    priorityRegular: "ਸਧਾਰਨ",
    priorityChild: "ਬੱਚਾ/ਸ਼ਿਸ਼ੂ",
    prioritySenior: "ਬਜ਼ੁਰਗ / ਦਿਵਯਾਂਗ",
    announcementsTitle: "ਘੋਸ਼ਣਾਵਾਂ",
    announcementTicker: "📢 ਨਿਰਦੇਸ਼: ਜਦੋਂ ਤੁਹਾਡਾ ਟੋਕਨ ਬੁਲਾਇਆ ਜਾਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਨਿਰਧਾਰਤ ਓਪੀਡੀ ਕਮਰੇ ਵਿੱਚ ਜਾਓ • ਬਜ਼ੁਰਗ ਨਾਗਰਿਕਾਂ, ਬੱਚਿਆਂ ਅਤੇ ਐਮਰਜੈਂਸੀ ਮਰੀਜ਼ਾਂ ਨੂੰ ਪਹਿਲ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ • ਵੈਰੀਫਿਕੇਸ਼ਨ ਲਈ ਆਪਣਾ ਡਿਜੀਟਲ ਟੋਕਨ ਤਿਆਰ ਰੱਖੋ • ਤੁਹਾਡੇ ਸਹਿਯੋਗ ਅਤੇ ਸਬਰ ਲਈ ਧੰਨਵਾਦ।"
  },
  ur: {
    portalTitle: "مریض سیلف سروس اور اسٹیٹس پورٹل",
    subtitle: "ریئل ٹائم صحت انتظار کے اعداد و شمار",
    changeRole: "← کردار تبدیل کریں",
    nowServing: "ابھی او پی ڈی کیبن میں",
    noPatientCalled: "فی الحال کسی مریض کو نہیں بلایا گیا",
    token: "ٹوکن",
    currentQueue: "موجودہ او پی ڈی ویٹنگ لسٹ",
    candidates: "امیدوار",
    waitRank: "انتظار نمبر #",
    mins: "منٹ",
    emptyQueue: "او پی ڈی قطار عارضی طور پر خالی ہے۔ صفر انتظار کے وقت سے لطف اندوز ہوں!",
    lookupTitle: "اپنا ٹوکن سلاٹ تلاش کریں",
    placeholderLookup: "ٹوکن نمبر، فون یا نام درج کریں...",
    find: "تلاش کریں",
    visitType: "ملاقات کی قسم",
    patientNameDisplay: "مریض کا نام",
    queueStatusAhead: "مریض آپ سے آگے ہیں",
    patientNotFound: "سرگرم انتظار کی فہرست میں ٹوکن یا مریض نہیں ملا۔",
    generateToken: "او پی ڈی داخلہ ٹوکن تیار کریں",
    tokenRegistered: "ٹوکن رجسٹرڈ ہو گیا!",
    successInfo: "صحت قطار آئی ڈی کامیابی کے ساتھ شامل کر دی گئی ہے۔ آپ کا وقت قریب آنے پر آپ کو ایس ایم ایس الرٹ موصول ہوگا۔",
    bookAnother: "دوسرا بک کریں",
    labelFullName: "مریض کا پورا نام",
    labelMobile: "موبائل فون",
    labelOpdUnit: "او پی ڈی یونٹ",
    labelPriority: "خصوصی ترجیح",
    btnProcessToken: "او پی ڈی ٹوکن پرنٹ کریں",
    unitConsultation: "عام معائنہ",
    unitCheckup: "او پی ڈی چیک اپ",
    unitDiagnostics: "لیبارٹری ٹیسٹ",
    unitVaccination: "ویکسینیشن",
    unitPediatric: "بچوں کا ماہر معالج",
    priorityRegular: "عام",
    priorityChild: "بچہ/شیر خوار",
    prioritySenior: "بزرگ شہری / معذور افراد",
    announcementsTitle: "اعلانات",
    announcementTicker: "📢 ہدایات: براہ کرم ٹوکن نمبر پکارے جانے پر فوری طور پر نامزد او پی ڈی کمرے میں جائیں • بزرگ شہریوں، بچوں اور ہنگامی مریضوں کو خود بخود ترجیح دی جاتی ہے • تصدیق کے لیے اپنا ڈیجیറ്റل ٹوکن تیار رکھیں • آپ کے تعاون اور صبر کا شکریہ۔"
  },
  or: {
    portalTitle: "ରୋଗୀ ସ୍ୱୟଂ ସେବା ଏବଂ ସ୍ଥିତି ପୋର୍ଟାଲ",
    subtitle: "ନିଜ ସମୟର ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରତୀକ୍ଷା ପରିସଂଖ୍ୟାନ",
    changeRole: "← ଭୂମିକା ପରିବର୍ତ୍ତନ",
    nowServing: "ବର୍ତ୍ତମାନ OPD କ୍ୟାବିନରେ",
    noPatientCalled: "ସର୍ବଶେଷରେ କୌଣସି ରୋଗୀଙ୍କୁ ଡକାଯାଇନାହିଁ",
    token: "ଟୋକନ୍",
    currentQueue: "ସମ୍ପ୍ରତି OPD ପ୍ରତୀକ୍ଷା ତାଲିକา",
    candidates: "ରୋଗୀ",
    waitRank: "ପ୍ରତୀକ୍ଷା #",
    mins: "ମିନିଟ୍",
    emptyQueue: "OPD ଲାଇନ୍ ସାମୟିକ ଭାବେ ଖାଲି ଅଛି। ଶୂନ୍ୟ ପ୍ରତୀକ୍ଷା ସମୟର ଆନନ୍ଦ ନିଅନ୍ତុ!",
    lookupTitle: "ଆପଣଙ୍କର ଟୋକନ୍ ସ୍ଲଟ୍ ଖୋଜନ୍ତୁ",
    placeholderLookup: "ଟୋକନ୍ ନମ୍ବର, ଫୋନ୍ କିମ୍ବା ନାମ ଦିଅନ୍ତು...",
    find: "ଖୋଜନ୍ତୁ",
    visitType: "ପରିଦର୍ଶନ ପ୍ରକାର",
    patientNameDisplay: "ରୋଗୀଙ୍କ ନାମ",
    queueStatusAhead: "ରୋଗୀ ଆପଣଙ୍କ ଆଗରେ ଅଛନ୍ତି",
    patientNotFound: "ସକ୍ରିୟ ପ୍ରତୀକ୍ଷା ଲାଇନରେ ଟୋକନ୍ କିମ୍ବା ରୋଗୀ ମିଳିଲେ ନାହିଁ।",
    generateToken: "OPD ପ୍ରବେଶ ଟୋକନ୍ ପ୍ରସ୍ତուত କରନ୍ତು",
    tokenRegistered: "ଟୋକନ୍ ପଞ୍ಜିକୃତ ହେଲା!",
    successInfo: "ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ଧାଡ଼ି ଆଇଡି ସଫଳତାର ସହ ଯୋଡ଼ାଯାଇଛି। ଆପଣଙ୍କ ସମୟ ପାଖେଇ ଆସିଲେ ଏସଏମଏସ ଆଲର୍ଟ ପାଇବେ।",
    bookAnother: "ଅନ୍ୟ ଏկ ବୁକ୍ କରନ୍ତು",
    labelFullName: "ରୋଗୀଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ନାମ",
    labelMobile: "ମୋବାଇଲ୍ ଫୋନ୍",
    labelOpdUnit: "OPD ବିଭାଗ",
    labelPriority: "ବିଶେଷ ପ୍ରାଥମିକତା",
    btnProcessToken: "OPD ଟୋକନ୍ ପ୍ରିଣ୍ଟ କରନ୍ତು",
    unitConsultation: "ସାଧାରଣ ପରାമર્ଶ",
    unitCheckup: "OPD ଚେକଅପ୍",
    unitDiagnostics: "ଡାଇଗ୍ନୋଷ୍ଟିକ୍ସ",
    unitVaccination: "ଟୀକାକରଣ",
    unitPediatric: "ଶିଶୁରୋଗ ବିଶେषଜ୍ଞ",
    priorityRegular: "ସାଧାରଣ",
    priorityChild: "ଶିଶୁ/ଛୋଟ ପିଲା",
    prioritySenior: "ବରିଷ୍ଠ ନାਗରିକ / ଦିବ୍ୟାଙ୍ଗ",
    announcementsTitle: "ଘୋଷଣା",
    announcementTicker: "📢 ନିର୍ଦ୍ଦେଶାବଳୀ: ଆପଣଙ୍କର ଟୋକନ ନମ୍ବର ଡକାଯିବା ମାତ୍ରେ ଦୟାକରି ନିର୍ଦ୍ଧାରିତ ଓପିଡି ରୁମକୁ ଯାଆନ୍ତୁ • ବରିଷ୍ଠ ନାଗରିକ, ଶିଶୁ ଏବଂ ଜରୁରୀକାଳୀନ ରୋଗୀଙ୍କୁ ପ୍ରାଥମିକତା ଦିଆଯାଏ • ଯାଞ୍ଚ ପାଇଁ ଆପଣଙ୍କର ଡିଜିଟାଲ ଟୋକନ ପ୍ରସ୍ତୁତ ରଖନ୍ତୁ • ସହଯୋગ ଏବଂ ଧର୍ଯ୍ୟ ପାଇଁ ଧନ୍ୟବାଦ।"
  },
  as: {
    portalTitle: "ৰোগী স্ব-সেৱা আৰু স্থিতি প’ৰ্টেল",
    subtitle: "ৰিয়েল-টাইম স্বাস্থ্য অপেক্ষাৰ পৰিসংখ্যা",
    changeRole: "← ভূমিকা সলনি কৰক",
    nowServing: "এতিয়া ওপিডি কেবিনত আছে",
    noPatientCalled: "বৰ্তমান কোনো ৰোগীক মতা হোৱা নাই",
    token: "টোকেন",
    currentQueue: "বৰ্তমান ওপিডি অপেক্ষাৰ তালিকা",
    candidates: "জন ৰোগী",
    waitRank: "অপেক্ষা #",
    mins: "মিনিট",
    emptyQueue: "ওপিডি লাইন সাময়িকভাৱে খালী হৈ আছে। শূণ্য অপেক্ষা সময়ৰ আনন্দ লওক!",
    lookupTitle: "আপোনাৰ টোকেন স্লট সন্ধান কৰক",
    placeholderLookup: "টোকেন নং, ফোন নম্বৰ বা নাম লিখক...",
    find: "সন্ধান কৰক",
    visitType: "পৰিদৰ্শনৰ প্ৰকাৰ",
    patientNameDisplay: "ৰোগীৰ নাম",
    queueStatusAhead: "জন ৰোগী আগত আছে",
    patientNotFound: "সক্ৰিয় অপেক্ষা তালিকাত টোকেন বা ৰোগী পোৱা নগ’ল।",
    generateToken: "ওপিডি প্ৰৱেশ টোকেন প্ৰস্তুত কৰক",
    tokenRegistered: "টোকেন পঞ্জীয়ন হ’ল!",
    successInfo: "আপোনাৰ স্বাস্থ্যশাৰী আইডি সফলতাৰে যোগ কৰা হৈছে। আপোনাৰ সময় সনিহিত হ’লে এছএমএছ পাব।",
    bookAnother: "আন এটা বুক কৰক",
    labelFullName: "ৰোগীৰ সম্পূৰ্ণ নাম",
    labelMobile: "মোবাইল ফোন",
    labelOpdUnit: "ওপিডি বিভাগ",
    labelPriority: "বিশেষ অগ্ৰাধিকাৰ",
    btnProcessToken: "ওপিডি টোকেন প্ৰিণ্ট কৰক",
    unitConsultation: "সাধাৰণ পৰামৰ্শ",
    unitCheckup: "ওপিডি পৰীক্ষা",
    unitDiagnostics: "ডায়াগনষ্টিক টেষ্ট",
    unitVaccination: "টীকাকৰণ",
    unitPediatric: "শিশু ৰোগ বিশেষজ্ঞ",
    priorityRegular: "সাধাৰণ",
    priorityChild: "শিশু/কেঁচুৱা",
    prioritySenior: "জ্যেষ্ঠ নাগৰিক / দিব্যাংগ",
    announcementsTitle: "ঘোষণাসমূহ",
    announcementTicker: "📢 নিৰ্দেশনাৱলী: আপোনাৰ টোকেন নম্বৰ মতাৰ লগে লগে অনুগ্ৰহ কৰি নিৰ্ধাৰিত ওপিডি কোঠালৈ যাওক • জ্যেষ্ঠ নাগৰিক, শিশু আৰু জৰুৰীকালীন ৰোগীক অগ্ৰাধিকাৰ দিয়া হয় • পৰীক্ষণৰ বাবে আপোনাৰ ডিজিটেল টোকেন সাজু ৰাখক • আপোনাৰ সহযোগিতা আৰু ধৈৰ্য্যৰ বাবে ধন্যবাদ।"
  }
};

interface RoleGuardLandingProps {
  queue: Patient[];
  serving: Patient | null;
  onEnterReceptionist: () => void;
  onRegisterPatientToken: (name: string, phone: string, visitType: any, priority: any) => void;
  tokenCounter: number;
  avgWaitTimePerPatient: number;
  smsMessages: SmsMessage[];
}

export default function RoleGuardLanding({
  queue,
  serving,
  onEnterReceptionist,
  onRegisterPatientToken,
  tokenCounter,
  avgWaitTimePerPatient,
  smsMessages,
}: RoleGuardLandingProps) {
  const [role, setRole] = useState<'selection' | 'receptionist_login' | 'patient_portal'>(() => {
    const cached = sessionStorage.getItem('clinic_selected_role');
    if (cached === 'receptionist_login' || cached === 'patient_portal') {
      return cached;
    }
    return 'selection';
  });

  const [lang, setLang] = useState<'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'ur' | 'or' | 'as'>(() => {
    const cached = localStorage.getItem('clinic_patient_lang');
    const validLangs = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'ur', 'or', 'as'];
    if (validLangs.includes(cached || '')) {
      return cached as any;
    }
    return 'en';
  });

  useEffect(() => {
    sessionStorage.setItem('clinic_selected_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('clinic_patient_lang', lang);
  }, [lang]);

  const t = translations[lang];

  // TV Digital Clock State
  const [tvTime, setTvTime] = useState(new Date());

  useEffect(() => {
    if (role === 'patient_portal') {
      const timer = setInterval(() => {
        setTvTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [role]);
  
  // Login states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Patient registration states
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientVisit, setPatientVisit] = useState<'Consultation' | 'Follow-up' | 'Diagnostic Test' | 'Vaccination' | 'Emergency'>('Consultation');
  const [patientPriority, setPatientPriority] = useState<'Regular' | 'Priority (Child/Infant)' | 'Priority (Senior/Disabled)' | 'Emergency'>('Regular');
  const [patientRegSuccess, setPatientRegSuccess] = useState<number | null>(null);

  // Patient query lookup states
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState<Patient | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const correctPassword = 'Admin123'; // clear and simple credential

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onEnterReceptionist();
    } else {
      setLoginError('Invalid Passcode. Hint: Use "Admin123" as the official passcode.');
    }
  };

  const handlePatientRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    
    // Clean phone number format
    const digits = patientPhone.replace(/\D/g, '');
    let formattedPhone = patientPhone;
    if (digits.length === 10) {
      formattedPhone = `${digits.slice(0, 5)}-${digits.slice(5, 10)}`;
    }

    onRegisterPatientToken(patientName, formattedPhone, patientVisit, patientPriority);
    setPatientRegSuccess(tokenCounter);
    
    // Clear inputs
    setPatientName('');
    setPatientPhone('');
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupSearched(true);
    const trimmed = lookupPhone.trim();
    if (!trimmed) {
      setLookupResult(null);
      return;
    }
    const found = queue.find(
      p => p.phone.replace(/\D/g, '').includes(trimmed.replace(/\D/g, '')) || 
           p.name.toLowerCase().includes(trimmed.toLowerCase()) ||
           p.tokenNumber.toString() === trimmed
    );
    setLookupResult(found || null);
  };

  const getTranslatedVisitType = (type: string) => {
    switch (type) {
      case 'Consultation': return t.unitConsultation;
      case 'Follow-up': return t.unitCheckup;
      case 'Diagnostic Test': return t.unitDiagnostics;
      case 'Vaccination': return t.unitVaccination;
      case 'pediatric': return t.unitPediatric;
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F0A1A] flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-350">
      
      {/* Upper Brand Badge */}
      <div className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
          CLINICQ <span className="text-teal-600 dark:text-teal-400 font-normal">OPD INTEGRITY</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-slate-500 dark:text-slate-400 mt-1">
          Ministry of Health • National Clinic Gateway
        </p>
      </div>

      {role === 'selection' && (
        <div className="w-full max-w-2xl bg-white dark:bg-[#1A1426] rounded-3xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
          <div className="text-center pb-2">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white uppercase tracking-tight">
              Select Portal Entrance ID
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please declare your role to proceed to the designated clinical desk interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            
            {/* Card A: Receptionist */}
            <button
              onClick={() => {
                setRole('receptionist_login');
                setLoginError('');
              }}
              className="group p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50 hover:bg-teal-500/5 dark:bg-white/5 dark:hover:bg-teal-500/5 text-left transition-all duration-200 hover:border-teal-500/30 flex flex-col justify-between h-56 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="h-11 w-11 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-805 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">
                    OPD Desk Operator
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                    Verify tokens, announce patient check-ups via voice, resolve wait queues, and dispatch sms alerts.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                <span>Access Protected</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card B: Patient */}
            <button
              onClick={() => {
                setRole('patient_portal');
                setPatientRegSuccess(null);
                setLookupSearched(false);
                setLookupResult(null);
              }}
              className="group p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50 hover:bg-indigo-500/5 dark:bg-white/5 dark:hover:bg-indigo-500/5 text-left transition-all duration-200 hover:border-indigo-500/30 flex flex-col justify-between h-56 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-805 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                    Patient Waiting Room View
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                    Wall-mounted clinic display screen showing active cabin calls, current queue waitlist, and estimated wait times.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <span>Waiting Room TV Monitor View</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>

          <div className="border-t border-slate-150 dark:border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium font-mono">
            <span>Server: AIIMS_DELHI_HEALTH_CLOUD</span>
            <span>Handshake Protocol: HTTPS_TLS_1.3</span>
          </div>

        </div>
      )}

      {/* RECEPTIONIST LOGIN FORM PAGE */}
      {role === 'receptionist_login' && (
        <div className="w-full max-w-md bg-white dark:bg-[#1A1426] rounded-3xl border border-slate-200/80 dark:border-white/5 p-6 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={16} className="text-teal-500" />
              <span>Officer Passcode Gate</span>
            </h2>
            <button
              onClick={() => setRole('selection')}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ← Back
            </button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            To view confidential healthcare analytics, queue controls and SMS dispatch systems, verify your clinic PIN below.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
                Staff Access Key / Passcode
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Key size={14} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="passcode-field"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff security password..."
                  className="w-full pl-9 pr-10 py-2.5 text-xs text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-hidden focus:border-teal-500 dark:focus:border-teal-500/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-[10px] font-semibold text-rose-500 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 p-2 rounded-lg">
                {loginError}
              </p>
            )}

            {/* Display the Hint Clearly as instructed so users can log in easily */}
            <div className="p-3 bg-teal-500/5 dark:bg-teal-500/10 rounded-xl border border-teal-500/10">
              <span className="text-[9px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Official Hint:
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                The password is <strong className="text-teal-600 dark:text-teal-400 font-extrabold bg-teal-500/10 border border-teal-500/20 px-1 py-0.5 rounded">Admin123</strong>. Staff can proceed directly using it.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-[#0F0A1A] font-extrabold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/10 active:scale-98 cursor-pointer"
            >
              <span>Unlock Admin Dashboard</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>
      )}

      {/* PATIENT PORTAL INTERFACE — CLINIC WAITING ROOM TV MONITOR VIEW */}
      {role === 'patient_portal' && (
        <div className="w-full max-w-7xl bg-white/70 dark:bg-[#1A1426]/80 text-slate-850 dark:text-white rounded-3xl border border-slate-200 dark:border-white/5 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 font-sans relative overflow-hidden backdrop-blur-md animate-fade-in">
          
          {/* Header Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-white/5 pb-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center animate-pulse">
                <Activity size={22} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
                  <span>CLINICQ Live Waiting Lounge Monitor</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>LIVE TV BOARD</span>
                  </span>
                </h2>
                <p className="text-[9px] uppercase font-bold tracking-widest text-slate-505 dark:text-slate-400 mt-0.5">
                  WAITING ROOM VIEW • REAL-TIME DISPATCH DISPLAY
                </p>
              </div>
            </div>

            {/* Time and Utilities */}
            <div className="flex items-center gap-4.5 flex-wrap">
              {/* Digital Clock */}
              <div className="bg-slate-100/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-1.5 rounded-xl text-center shadow-inner">
                <span className="text-lg font-black font-mono text-teal-655 dark:text-teal-400 tracking-wider">
                  {tvTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                  {tvTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative bg-slate-100/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 flex items-center">
                  <Globe size={11} className="text-teal-600 dark:text-teal-400 shrink-0 mr-1" />
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className="text-[10px] font-bold uppercase tracking-wider bg-transparent text-slate-705 dark:text-slate-300 focus:outline-hidden border-none cursor-pointer pr-1"
                  >
                    <option value="en" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">EN (English)</option>
                    <option value="hi" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">HI (हिन्दी)</option>
                    <option value="bn" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">BN (বাংলা)</option>
                    <option value="te" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">TE (తెలుగు)</option>
                    <option value="mr" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">MR (मराठी)</option>
                    <option value="ta" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">TA (தமிழ்)</option>
                    <option value="gu" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">GU (ગુજરાતી)</option>
                    <option value="kn" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">KN (ಕನ್ನಡ)</option>
                    <option value="ml" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">ML (മലയാളം)</option>
                    <option value="pa" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">PA (ਪੰਜਾਬੀ)</option>
                    <option value="ur" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">UR (اردو)</option>
                    <option value="or" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">OR (ଓଡ଼ିଆ)</option>
                    <option value="as" className="bg-white dark:bg-[#1A1426] text-slate-855 dark:text-slate-200">AS (অসমীয়া)</option>
                  </select>
                </div>

                <span className="text-slate-300 dark:text-slate-700 mx-1">|</span>
                
                <button
                  onClick={() => setRole('selection')}
                  className="text-[10px] font-bold uppercase tracking-wider bg-slate-105 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer align-middle transition-colors active:scale-95 animate-fade-in"
                >
                  {t.changeRole}
                </button>
              </div>
            </div>
          </div>

          {/* Grid Layout inside TV Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Panel: Currently Serving Board */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1A1426]/60 border border-slate-200 dark:border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative min-h-[380px] active-serving-glow">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span>{t.nowServing}</span>
                </span>
                
                {serving ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-5">
                      <div className="h-28 w-28 rounded-2xl bg-emerald-500 text-slate-950 flex flex-col items-center justify-center border border-emerald-600 dark:border-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-80">{t.token}</span>
                        <span className="text-5xl font-black font-mono">#{serving.tokenNumber}</span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight truncate max-w-[220px]">
                          {translatePatientName(serving.name, lang)}
                        </h3>
                        <div className="inline-block text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-500/20">
                          {serving.priority}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Proceed immediately to</span>
                        <h4 className="text-lg font-bold text-teal-650 dark:text-teal-400 uppercase font-mono mt-0.5">
                          {serving.roomNumber || 'Consulting Room'}
                        </h4>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
                        <Globe size={18} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-56 flex flex-col items-center justify-center text-center">
                    <Bell size={40} className="text-slate-450 dark:text-slate-650 animate-bounce mb-3" />
                    <h3 className="text-lg font-extrabold text-slate-500 dark:text-slate-400">
                      {t.noPatientCalled}
                    </h3>
                    <p className="text-[10px] uppercase text-slate-400 dark:text-slate-505 mt-1.5 tracking-wider font-bold">
                      Please wait for the next announcements
                    </p>
                  </div>
                )}
              </div>

              {/* Triage Info Summary Footer */}
              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-6 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider">
                <span>System Gate: Active</span>
                <span className="text-teal-600 dark:text-teal-400">Ayushman Live</span>
              </div>
            </div>

            {/* Right Panel: Waitlist Queue Table */}
            <div className="lg:col-span-7 bg-white/70 dark:bg-[#1A1426]/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Activity size={12} className="text-teal-600 dark:text-teal-400" />
                    <span>{t.currentQueue}</span>
                  </h3>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] font-bold text-teal-600 dark:text-teal-400">
                    {queue.length} {t.candidates} Waiting
                  </span>
                </div>

                <div className="overflow-x-auto custom-scrollbar max-h-80 overflow-y-auto pr-1">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                        <th className="py-2.5 font-bold">Token</th>
                        <th className="py-2.5 font-bold">Patient Name</th>
                        <th className="py-2.5 font-bold">Wait Position</th>
                        <th className="py-2.5 font-bold text-right">Est. Wait Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-600 dark:text-slate-350">
                      {queue.length > 0 ? (
                        queue.map((p, index) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-slate-850">
                            <td className="py-3 font-bold font-mono text-teal-600 dark:text-teal-400">#{p.tokenNumber}</td>
                            <td className="py-3">
                              <span className="font-bold text-slate-800 dark:text-white">
                                {translatePatientName(p.name, lang).replace(/(?<=.{3})./g, '*')}
                              </span>
                              <span className="block text-[8px] text-slate-500 dark:text-slate-450 uppercase mt-0.5">
                                {p.visitType}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-605 dark:text-slate-400 font-mono font-bold text-[9px]">
                                {t.waitRank}{index + 1}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30 font-bold text-[9px]">
                                ~{index * avgWaitTimePerPatient} {t.mins}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-10 text-center text-slate-500">
                            <Globe size={24} className="mx-auto mb-2 opacity-30 stroke-[1.5]" />
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.emptyQueue}</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick stats at bottom of table */}
              <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-4">
                <span>Queue Flow Speed</span>
                <span className="text-teal-600 dark:text-teal-400">~{avgWaitTimePerPatient} mins / patient</span>
              </div>
            </div>

          </div>

          {/* Scrolling Announcement Marquee Ticker */}
          <div className="w-full bg-slate-100 dark:bg-[#050309] border border-slate-200 dark:border-slate-800/60 rounded-2xl py-3 px-4.5 overflow-hidden mt-2 flex items-center gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white dark:text-[#0b0813] bg-teal-600 dark:bg-teal-400 px-2 py-0.5 rounded shrink-0 z-10 shadow-sm">
              {t.announcementsTitle}
            </span>
            <div className="relative w-full overflow-hidden h-4 flex items-center">
              <div className="absolute whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono animate-marquee">
                {t.announcementTicker}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

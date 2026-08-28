import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from './types';

// Storage key
const LANG_STORAGE_KEY = 'wm_lang';

export const TRANSLATIONS = {
  en: {
    // Brand & Common
    brandName: 'SwachhApp',
    tagline: 'Clean Green Future Mission',
    sihBadge: 'Smart India Hackathon 2026',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back',
    submit: 'Submit',
    viewAll: 'View All',
    search: 'Search...',
    status: 'Status',
    date: 'Date',
    category: 'Category',
    severity: 'Severity',
    action: 'Action',
    verified: 'Verified',
    pending: 'Pending Assignment',
    inProgress: 'In Progress',
    awaitingAdmin: 'Awaiting Admin Verification',
    resolved: 'Resolved & Rewarded',

    // Multi-Role Login Portals
    loginTitle: 'Select Your Access Portal',
    loginSubtitle: 'Unified Civic, Sanitation Dispatch, and Municipal Administration Gateway',
    tabCitizen: '👤 Citizen (Aadhaar)',
    tabOfficer: '🚛 Sanitation Officer (Emp ID)',
    tabAdmin: '🛡️ Municipal Admin (Passkey)',
    
    // Citizen Aadhaar Login
    citizenAadharLabel: '12-Digit Aadhaar Number',
    citizenAadharPlaceholder: '5432-9876-1234',
    citizenOtpLabel: 'One-Time Password (OTP)',
    citizenOtpPlaceholder: 'Enter 6-digit OTP (e.g. 123456)',
    citizenNameLabel: 'Full Name (as per Aadhaar)',
    citizenNamePlaceholder: 'Aarav Sharma',
    citizenLoginBtn: 'Verify Aadhaar & Enter Citizen Portal',
    citizenDemoBtn: '1-Click Demo Citizen Login',

    // Officer Login
    officerEmpIdLabel: 'Government Employer ID',
    officerEmpIdPlaceholder: 'EMP-KA33-902',
    officerPassLabel: 'Password',
    officerPassPlaceholder: '••••••••',
    officerLoginBtn: 'Login to Sanitation Dispatch Hub',
    officerDemoBtn: '1-Click Demo Officer Login (EMP-KA33-902)',

    // Admin Passkey Login
    adminPasskeyLabel: 'Admin Security Passkey',
    adminPasskeyPlaceholder: 'SWACHH-ADMIN-2026',
    adminLoginBtn: 'Verify Passkey & Open Admin Desk',
    adminDemoBtn: '1-Click Master Admin Passkey',

    // Navigation
    navDashboard: 'Dashboard',
    navReport: 'Report Dump',
    navOfficerRadar: 'Dispatch Radar',
    navFacilities: 'Facilities',
    navAdmin: 'Admin Desk',
    navLogin: 'Login',
    navLogout: 'Logout',
    controlCenter: 'Control Center',
    welcomeBack: 'Welcome back',

    // Officer Rapido Driver Portal
    officerRadarTitle: 'Sanitation Dispatch & Task Radar',
    officerRadarSubtitle: 'Rapido-style blackspot allocation, real-time navigation, and proof-of-work submission.',
    dutyOnline: '🟢 ON DUTY — Scanning for Nearby Incidents',
    dutyOffline: '⚪ OFF DUTY — Radar Paused',
    radarNearbyTitle: 'Nearby Dump Pickup Requests',
    radarNoTasks: 'No pending blackspots in your immediate radius. You are all caught up!',
    acceptTaskBtn: '⚡ Accept Task (Claim Bounty)',
    taskAcceptedToast: 'Task accepted! Navigate to blackspot and begin remediation.',
    activeTaskTitle: 'Active Sanitation Mission in Progress',
    taskStep1: '1. Navigate to Blackspot Location',
    taskStep2: '2. Perform Remediation & Segregation',
    taskStep3: '3. Upload "After-Cleanup" Photo Proof',
    arrivedBtn: '📍 Mark Arrived at Location',
    uploadProofPhotoBtn: '📸 Upload After-Cleanup Photo Proof',
    reuploadProofPhotoBtn: 'Change Proof Photo',
    officerNotesPlaceholder: 'Add cleanup notes (e.g. 120kg wet waste loaded into Tipper KA-33, bleaching powder applied)...',
    completeMissionBtn: '✅ Complete Mission & Submit for Admin Review',
    officerEarningsTitle: 'Officer Earnings & Cleanliness Bounties',
    officerBountiesCount: 'Remediated Blackspots',
    officerTotalEarned: 'Total Bounty Wallet',
    officerRewardsTitle: 'Sanitation Worker Rewards & Benefits',
    officerRewardsSubtitle: 'Redeem earned bounties for cash transfers, PPE equipment, and fuel tokens.',

    // Landing Page
    heroBadge: 'Smart Municipal Cleanliness Network',
    heroTitlePart1: 'Empowering Citizens,',
    heroTitlePart2: 'Transforming Cities with',
    heroTitleHighlight: 'Spatial AI & Clean Energy',
    heroDesc:
      'A human-centric spatial platform empowering citizens, sanitation workers, and municipal councils to achieve 100% source segregation, live GPS geo-tagged reporting, and closed-loop bio-energy conversion.',
    heroCtaDashboard: 'Enter Control Center',
    heroCtaGetStarted: 'Get Started',
    heroCtaFacilities: 'Explore 3D Facilities',

    // Report Page
    reportPageTitle: 'Report Illegal Dump Site',
    reportPageSubtitle: 'AI-validated geo-tagged reporting with instant nearby sanitation officer dispatch.',
    step1Photo: '1. Dump Site Photo *',
    takePhoto: 'Take / Upload Photo',
    reuploadPhoto: 'Retake / Change Photo',
    aiAnalyzing: '🔍 AI Waste Validator Analyzing...',
    aiAnalyzingDesc: 'Running MobileNetV2 vision model to verify this is actual waste',
    aiRejectedTitle: '⚠️ Image Rejected — Not Waste',
    aiRejectedDesc: 'Our AI vision model determined this image does not contain waste material. Only photos of actual waste, garbage dumps, or illegal dumping sites are accepted.',
    aiRejectedBtn: 'Upload Different Photo',
    step2Category: '2. Auto-Detected Waste Category *',
    step3Severity: '3. Severity & Estimated Volume *',
    step4Location: '4. Live High-Accuracy Location Grasper *',
    step5VoiceNote: '5. Audio Landmark Voice Note (Optional)',
    step6Description: '6. Site Description & Landmarks *',
    descPlaceholder: 'Provide exact landmark (e.g. behind Metro Pillar 42, near park boundary wall)...',
    submittingReport: 'Transmitting geo-tagged incident to nearest officer...',
    submitReportBtn: 'Submit Report & Dispatch Sanitation Team',

    // Location Grasper
    locationGrasperTitle: 'Live Satellite Location Grasper',
    graspLocationBtn: 'Grasp Live GPS Location',
    graspingGps: 'Acquiring high-accuracy satellite lock...',
    gpsAccuracy: 'GPS Accuracy',
    gpsCoords: 'Coordinates',
    geocodedAddress: 'Geocoded Address',
    reGraspBtn: 'Re-Grasp Location',
    gpsLocked: 'High-Precision GPS Lock Acquired',
    gpsSimulated: 'Using simulated coordinates (Allow GPS permission for exact lock).',
    continuousTracking: 'Continuous GPS Tracking',

    // Admin Verification & Dual Rewards Desk
    adminTitle: 'Municipal Admin Verification & Dual Rewards Desk',
    adminSubtitle: 'Review side-by-side Before/After cleanup evidence, audit SLA response times, and award citizen points + officer cash bounties.',
    exportCsvBtn: 'Download Swachh Bharat Audit CSV',
    totalIncidents: 'Total Incidents',
    awaitingReview: 'Awaiting Admin Review',
    resolvedVerified: 'Resolved & Rewarded',
    avgTurnaround: 'Average Turnaround (SLA)',
    beforeCleanup: 'Before Cleanup (Citizen Report)',
    afterCleanup: 'After Cleanup Proof (Officer Submission)',
    approveDualRewardsBtn: '🏆 Approve Cleanup & Award Dual Rewards',
    adminApprovalSuccess: 'Cleanup approved! +50 Civic Points awarded to Citizen, +₹250 Bounty credited to Officer.',
    adminNotesLabel: 'Zonal Commissioner Inspection Remarks',
    citizenRewardText: 'Citizen Award: +50 Civic Points',
    officerBountyText: 'Officer Award: +₹250 Cash Bounty',
  },

  hi: {
    // Brand & Common
    brandName: 'SwachhApp',
    tagline: 'स्वच्छ हरित भविष्य मिशन',
    sihBadge: 'स्मार्ट इंडिया हैकाथॉन 2026',
    loading: 'लोड हो रहा है...',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    back: 'वापस जाएं',
    submit: 'जमा करें',
    viewAll: 'सभी देखें',
    search: 'खोजें...',
    status: 'स्थिति',
    date: 'दिनांक',
    category: 'श्रेणी',
    severity: 'गंभीरता',
    action: 'कार्रवाई',
    verified: 'सत्यापित',
    pending: 'अधिकारी आवंटन हेतु लंबित',
    inProgress: 'सफाई कार्य जारी है',
    awaitingAdmin: 'प्रशासन सत्यापन हेतु प्रतीक्षारत',
    resolved: 'सत्यापित एवं पुरस्कृत',

    // Multi-Role Login Portals
    loginTitle: 'अपना एक्सेस पोर्टल चुनें',
    loginSubtitle: 'एकीकृत नागरिक, स्वच्छता प्रेषण एवं नगरपालिका प्रशासन प्रवेश द्वार',
    tabCitizen: '👤 नागरिक (आधार)',
    tabOfficer: '🚛 स्वच्छता अधिकारी (कर्मचारी ID)',
    tabAdmin: '🛡️ नगरपालिका प्रशासन (पासकी)',

    // Citizen Aadhaar Login
    citizenAadharLabel: '12-अंकीय आधार संख्या',
    citizenAadharPlaceholder: '5432-9876-1234',
    citizenOtpLabel: 'वन-टाइम पासवर्ड (OTP)',
    citizenOtpPlaceholder: '6-अंकीय OTP दर्ज करें (उदा. 123456)',
    citizenNameLabel: 'पूरा नाम (आधार अनुसार)',
    citizenNamePlaceholder: 'आरव शर्मा',
    citizenLoginBtn: 'आधार सत्यापित करें और नागरिक पोर्टल में प्रवेश करें',
    citizenDemoBtn: '1-क्लिक डेमो नागरिक लॉगिन',

    // Officer Login
    officerEmpIdLabel: 'सरकारी कर्मचारी ID (Employer ID)',
    officerEmpIdPlaceholder: 'EMP-KA33-902',
    officerPassLabel: 'पासवर्ड',
    officerPassPlaceholder: '••••••••',
    officerLoginBtn: 'स्वच्छता प्रेषण हब में प्रवेश करें',
    officerDemoBtn: '1-क्लिक डेमो अधिकारी लॉगिन (EMP-KA33-902)',

    // Admin Passkey Login
    adminPasskeyLabel: 'प्रशासक सुरक्षा पासकी',
    adminPasskeyPlaceholder: 'SWACHH-ADMIN-2026',
    adminLoginBtn: 'पासकी सत्यापित करें और एडमिन डेस्क खोलें',
    adminDemoBtn: '1-क्लिक मास्टर एडमिन पासकी',

    // Navigation
    navDashboard: 'डैशबोर्ड',
    navReport: 'डंप रिपोर्ट करें',
    navOfficerRadar: 'प्रेषण रडार',
    navFacilities: 'संयंत्र',
    navAdmin: 'एडमिन डेस्क',
    navLogin: 'लॉगिन',
    navLogout: 'लॉगआउट',
    controlCenter: 'नियंत्रण कक्ष',
    welcomeBack: 'स्वागत है',

    // Officer Rapido Driver Portal
    officerRadarTitle: 'स्वच्छता प्रेषण एवं टास्क रडार',
    officerRadarSubtitle: 'रैपिडो-शैली डंप स्थल आवंटन, लाइव नेविगेशन और सफाई प्रमाण अपलोड।',
    dutyOnline: '🟢 ड्यूटी पर सक्रिय — नजदीकी घटनाओं की स्कैनिंग जारी',
    dutyOffline: '⚪ ड्यूटी बंद — रडार रुका हुआ है',
    radarNearbyTitle: 'आस-पास कचरा उठाने के अनुरोध',
    radarNoTasks: 'आपके नजदीकी क्षेत्र में कोई लंबित डंप नहीं है। सब साफ है!',
    acceptTaskBtn: '⚡ कार्य स्वीकार करें (बाउंटी प्राप्त करें)',
    taskAcceptedToast: 'कार्य स्वीकार कर लिया गया! स्थान पर पहुंचें और सफाई शुरू करें।',
    activeTaskTitle: 'सक्रिय स्वच्छता मिशन जारी',
    taskStep1: '1. डंप स्थल के स्थान पर पहुंचें',
    taskStep2: '2. कचरा एकत्र एवं पृथक्करण करें',
    taskStep3: '3. सफाई के बाद का फोटो प्रमाण अपलोड करें',
    arrivedBtn: '📍 स्थान पर आगमन दर्ज करें',
    uploadProofPhotoBtn: '📸 सफाई के बाद का फोटो प्रमाण अपलोड करें',
    reuploadProofPhotoBtn: 'फोटो बदलें',
    officerNotesPlaceholder: 'सफाई विवरण जोड़ें (उदा. 120 किग्रा गीला कचरा टिपर में भरा, ब्लीचिंग पाउडर छिड़का)...',
    completeMissionBtn: '✅ मिशन पूरा करें और प्रशासन समीक्षा हेतु भेजें',
    officerEarningsTitle: 'अधिकारी कमाई एवं स्वच्छता बाउंटी',
    officerBountiesCount: 'साफ किए गए डंप स्थल',
    officerTotalEarned: 'कुल अर्जित बाउंटी वॉलेट',
    officerRewardsTitle: 'स्वच्छता कर्मी पुरस्कार एवं लाभ',
    officerRewardsSubtitle: 'अर्जित बाउंटी को नकद बैंक ट्रांसफर, सुरक्षा किट और ईंधन टोकन में बदलें।',

    // Landing Page
    heroBadge: 'स्मार्ट नगरपालिका स्वच्छता नेटवर्क',
    heroTitlePart1: 'नागरिकों को सशक्त बनाना,',
    heroTitlePart2: 'शहरों का कायाकल्प',
    heroTitleHighlight: 'स्थानिक AI और स्वच्छ ऊर्जा के साथ',
    heroDesc:
      'एक मानव-केंद्रित स्थानिक मंच जो नागरिकों, स्वच्छता कर्मियों और नगर परिषदों को 100% स्रोत पृथक्करण, लाइव जीपीएस जियो-टैग्ड रिपोर्टिंग और नवीकरणीय ऊर्जा रूपांतरण प्राप्त करने में सक्षम बनाता है।',
    heroCtaDashboard: 'कंट्रोल सेंटर में प्रवेश करें',
    heroCtaGetStarted: 'शुरू करें',
    heroCtaFacilities: '3D सुविधाएं देखें',

    // Report Page
    reportPageTitle: 'अवैध कचरा डंप की रिपोर्ट करें',
    reportPageSubtitle: 'AI-सत्यापित भू-टैग्ड रिपोर्टिंग और निकटतम स्वच्छता अधिकारी रवानगी।',
    step1Photo: '1. डंप स्थल की फोटो *',
    takePhoto: 'फोटो खींचें / अपलोड करें',
    reuploadPhoto: 'फोटो बदलें / पुनः खींचें',
    aiAnalyzing: '🔍 AI कचरा सत्यापनकर्ता विश्लेषण कर रहा है...',
    aiAnalyzingDesc: 'यह सुनिश्चित करने के लिए MobileNetV2 मॉडल चल रहा है कि यह वास्तविक कचरा है',
    aiRejectedTitle: '⚠️ फोटो अस्वीकृत — कचरा नहीं पाया गया',
    aiRejectedDesc: 'हमारे AI विज़न मॉडल ने निर्धारित किया है कि इस छवि में कचरा सामग्री नहीं है। केवल वास्तविक कचरे की तस्वीरें ही स्वीकार की जाती हैं।',
    aiRejectedBtn: 'दूसरी फोटो अपलोड करें',
    step2Category: '2. AI द्वारा स्वचालित कचरा श्रेणी *',
    step3Severity: '3. गंभीरता एवं अनुमानित मात्रा *',
    step4Location: '4. लाइव सटीक लोकेशन ग्रैस्पर *',
    step5VoiceNote: '5. ऑडियो लैंडमार्क वॉयस नोट (वैकल्पिक)',
    step6Description: '6. स्थल विवरण एवं पहचान चिन्ह *',
    descPlaceholder: 'सटीक पहचान चिन्ह बताएं (उदा. मेट्रो पिलर 42 के पीछे)...',
    submittingReport: 'निकटतम स्वच्छता अधिकारी को प्रेषित किया जा रहा है...',
    submitReportBtn: 'रिपोर्ट दर्ज करें और टीम रवाना करें',

    // Location Grasper
    locationGrasperTitle: 'लाइव उपग्रह लोकेशन ग्रैस्पर',
    graspLocationBtn: 'लाइव जीपीएस लोकेशन प्राप्त करें',
    graspingGps: 'सटीक उपग्रह निर्देशांक प्राप्त किए जा रहे हैं...',
    gpsAccuracy: 'जीपीएस सटीकता',
    gpsCoords: 'निर्देशांक',
    geocodedAddress: 'खोजा गया पता',
    reGraspBtn: 'पुनः लोकेशन प्राप्त करें',
    gpsLocked: 'सटीक जीपीएस लॉक प्राप्त हुआ',
    gpsSimulated: 'अनुकरण निर्देशांक का उपयोग हो रहा है।',
    continuousTracking: 'निरंतर जीपीएस ट्रैकिंग',

    // Admin Verification & Dual Rewards Desk
    adminTitle: 'नगरपालिका प्रशासन सत्यापन एवं दोहरे पुरस्कार डेस्क',
    adminSubtitle: 'सफाई से पहले और बाद के फोटो प्रमाणों की तुलना करें, समयबद्धता जांचें और नागरिक अंक + अधिकारी नकद बाउंटी प्रदान करें।',
    exportCsvBtn: 'स्वच्छ भारत ऑडिट CSV डाउनलोड करें',
    totalIncidents: 'कुल घटनाएं',
    awaitingReview: 'प्रशासन समीक्षा हेतु लंबित',
    resolvedVerified: 'सत्यापित एवं पुरस्कृत',
    avgTurnaround: 'औसत समाधान समय (SLA)',
    beforeCleanup: 'सफाई से पहले (नागरिक रिपोर्ट)',
    afterCleanup: 'सफाई के बाद का प्रमाण (अधिकारी रिपोर्ट)',
    approveDualRewardsBtn: '🏆 सफाई सत्यापित करें और दोनों को पुरस्कृत करें',
    adminApprovalSuccess: 'सफाई स्वीकृत! नागरिक को +50 अंक और अधिकारी को +₹250 नकद बाउंटी प्रदान की गई।',
    adminNotesLabel: 'ज़ोनल कमिश्नर निरीक्षण टिप्पणी',
    citizenRewardText: 'नागरिक पुरस्कार: +50 नागरिक अंक',
    officerBountyText: 'अधिकारी पुरस्कार: +₹250 नकद बाउंटी',
  },
};

type Translations = typeof TRANSLATIONS.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (saved === 'en' || saved === 'hi') {
        setLangState(saved);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    }
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: 'AgroAI',
    appTagline: 'Intelligent Agricultural Intelligence',
    dashboard: 'Dashboard',
    cropRecommendation: 'Crop Advisory',
    soilAnalysis: 'Soil Health',
    fertilizerAdvisory: 'Fertilizer Guide',
    irrigationAdvisory: 'Irrigation Planner',
    diseaseDetection: 'Disease Scanner',
    cultivationCalendar: 'Crop Calendar',
    aiAssistant: 'AI Agronomist',
    history: 'Advisory History',
    profile: 'Farmer Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    getStarted: 'Get Started',
    exploreFeatures: 'Explore Features',
    state: 'State',
    district: 'District',
    soilType: 'Soil Type',
    season: 'Season',
    landArea: 'Land Area',
    submit: 'Generate Advisory',
    loading: 'Analyzing agricultural parameters with AI...',
    success: 'Advisory generated successfully',
    error: 'An error occurred',
    retry: 'Retry',
    downloadPdf: 'Print / Save PDF',
    safetyNotice: 'Advisory Notice: This guidance is AI-assisted. Always consult local agricultural extension officers or soil testing labs for critical issues.',
  },
  kn: {
    appName: 'ಅಗ್ರೋAI (AgroAI)',
    appTagline: 'ಬುದ್ಧಿವಂತ ಕೃಷಿ ಸಲಹಾ ಸಹಾಯಕ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    cropRecommendation: 'ಬೆಳೆ ಶಿಫಾರಸು',
    soilAnalysis: 'ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಆರೋಗ್ಯ',
    fertilizerAdvisory: 'ರಸಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ',
    irrigationAdvisory: 'ನೀರಾವರಿ ಯೋಜನೆ',
    diseaseDetection: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ',
    cultivationCalendar: 'ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್',
    aiAssistant: 'ಕೃಷಿ AI ಸಹಾಯಕ',
    history: 'ಹಿಂದಿನ ವರದಿಗಳು',
    profile: 'ರೈತರ ಪ್ರೊಫೈಲ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    logout: 'ಲಾಗ್‌ಔಟ್',
    login: 'ಲಾಗಿನ್',
    register: 'ನೋಂದಣಿ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    exploreFeatures: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    state: 'ರಾಜ್ಯ',
    district: 'ಜಿಲ್ಲೆ',
    soilType: 'ಮಣ್ಣಿನ ವಿಧ',
    season: 'ಋತು (ಸೀಸನ್)',
    landArea: 'ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ',
    submit: 'ಸಲಹೆ ಪಡೆಯಿರಿ',
    loading: 'AI ಮೂಲಕ ಕೃಷಿ ಮಾಹಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    success: 'ಸಲಹೆ ಯಶಸ್ವಿಯಾಗಿ ಸಿದ್ಧವಾಗಿದೆ',
    error: 'ದೋಷ ಕಂಡುಬಂದಿದೆ',
    retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    downloadPdf: 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ / ಮುದ್ರಿಸಿ',
    safetyNotice: 'ಎಚ್ಚರಿಕೆ: ಈ ಸಲಹೆಯು ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಆಧಾರಿತವಾಗಿದೆ. ಕಡ್ಡಾಯವಾಗಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಗಳ ಅಥವಾ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕೇಂದ್ರದ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.',
  },
  hi: {
    appName: 'एग्रोAI (AgroAI)',
    appTagline: 'बुद्धिमान कृषि फसल सलाहकार सहायक',
    dashboard: 'डैशबोर्ड',
    cropRecommendation: 'फसल सिफारिश',
    soilAnalysis: 'मृदा स्वास्थ्य विश्लेषण',
    fertilizerAdvisory: 'उर्वरक सलाह',
    irrigationAdvisory: 'सिंचाई योजना',
    diseaseDetection: 'रोग पहचान',
    cultivationCalendar: 'कृषि कैलेंडर',
    aiAssistant: 'कृषि एआई सहायक',
    history: 'परामर्श इतिहास',
    profile: 'किसान प्रोफाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    getStarted: 'शुरू करें',
    exploreFeatures: 'सुविधाएं देखें',
    state: 'राज्य',
    district: 'जिला',
    soilType: 'मिट्टी का प्रकार',
    season: 'मौसम / ऋतु',
    landArea: 'भूमि क्षेत्र',
    submit: 'सलाह प्राप्त करें',
    loading: 'एआई द्वारा कृषि डेटा का विश्लेषण किया जा रहा है...',
    success: 'सलाह सफलतापूर्वक तैयार की गई',
    error: 'त्रुटि उत्पन्न हुई',
    retry: 'पुनः प्रयास करें',
    downloadPdf: 'प्रिंट / पीडीएफ सहेजें',
    safetyNotice: 'सलाह सूचना: यह मार्गदर्शन एआई-सहायता प्राप्त है। महत्वपूर्ण कृषि निर्णयों के लिए हमेशा स्थानीय कृषि विज्ञान केंद्र या प्रयोगशाला से परामर्श लें।',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('agroai_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agroai_language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


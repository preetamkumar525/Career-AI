import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    brand: "CareerPath AI",
    tagline: "Your Career Navigator",
    nav_home: "Home",
    nav_quiz: "Career Quiz",
    nav_explore: "Explore Paths",
    nav_govt: "Govt Exams Hub",
    nav_trending: "Trending & Vacancies",
    nav_scanner: "Skill Scanner",
    nav_roadmap: "Roadmap Generator",
    nav_skills: "Skill Gap",
    nav_resume: "Resume Builder",
    nav_scholarships: "Scholarships & Loans",
    nav_calendar: "Exam Calendar",
    nav_future: "Future Scope",
    parent_view_btn: "Parent View",
    parent_view_active: "Parent View ON",

    // Home
    hero_title: "Apna Sahi Career Chuno, AI Ke Saath",
    hero_subtitle: "Bridging the career guidance gap for students after 10th & 12th. Empowering rural, semi-urban, and first-generation youth with AI roadmaps, government exam blueprints, and verified free learning paths.",
    hero_cta_quiz: "Take Career Quiz",
    hero_cta_govt: "Explore Govt Jobs",
    hero_cta_ai: "Ask AI Counselor",
    stat_students: "50,000+",
    stat_students_label: "Students Guided",
    stat_careers: "100+",
    stat_careers_label: "Career Paths Mapped",
    stat_exams: "35+",
    stat_exams_label: "Govt Exams Blueprinted",
    stat_scholarships: "₹15+ Cr",
    stat_scholarships_label: "Scholarships Listed",

    how_it_works_title: "How It Works in 3 Simple Steps",
    how_step1_title: "1. Take 3-Min AI Quiz",
    how_step1_desc: "Answer 12 simple questions about your interests, strengths, and family timelines. No technical knowledge required.",
    how_step2_title: "2. Get Matched & Compare",
    how_step2_desc: "Discover your top 3 career paths with match scores, salary ranges, exam difficulty, and parent ROI breakdown.",
    how_step3_title: "3. Download Your Action Roadmap",
    how_step3_desc: "Generate a month-by-month preparation plan with free YouTube, NPTEL, and SWAYAM resources, downloadable as PDF.",

    features_title: "Everything You Need for Career Readiness",
    testimonials_title: "Voices from Students Across India",
    footer_text: "CareerPath AI - Empowering India's Youth with AI Guidance & Open Educational Resources.",
    demo_disclaimer: "Note: Sample data for demo. Verify details on official websites.",

    // Quiz
    quiz_heading: "Discover Your Ideal Career Path",
    quiz_question_counter: "Question",
    quiz_back: "Back",
    quiz_next: "Next",
    quiz_submit: "Calculate My Matches",
    quiz_results_title: "Your Top 3 AI Career Matches",
    quiz_match_score: "Match Score",
    quiz_why_fit: "Why This Fits You",
    quiz_salary: "Salary Potential",
    quiz_duration: "Preparation & Duration",
    quiz_get_roadmap: "Generate Roadmap",
    quiz_analyze_gap: "Analyze Skill Gap",
    quiz_retake: "Retake Quiz",

    // Common
    loading: "Loading...",
    download_pdf: "Download PDF",
    search_placeholder: "Search careers, exams, or skills...",
    filter_all: "All",
    free_resource: "100% Free Resources",
    eligibility: "Eligibility",
    salary_perks: "Salary & Perks",
    deadline: "Deadline"
  },
  hi: {
    // Navbar
    brand: "करियरपाथ AI",
    tagline: "आपका करियर मार्गदर्शक",
    nav_home: "होम",
    nav_quiz: "करियर क्विज़",
    nav_explore: "करियर एक्सप्लोरर",
    nav_govt: "सरकारी नौकरी हब",
    nav_trending: "ट्रेंडिंग व रिक्तियां",
    nav_scanner: "स्किल स्कैनर",
    nav_roadmap: "रोडमैप जनरेटर",
    nav_skills: "स्किल गैप",
    nav_resume: "रिज्यूमे बिल्डर",
    nav_scholarships: "छात्रवृत्ति एवं लोन",
    nav_calendar: "परीक्षा कैलेंडर",
    nav_future: "भविष्य की योजनाएं",
    parent_view_btn: "अभिभावक व्यू",
    parent_view_active: "अभिभावक व्यू सक्रिय",

    // Home
    hero_title: "अपना सही करियर चुनो, AI के साथ",
    hero_subtitle: "10वीं और 12वीं के बाद सही राह चुनने का भरोसेमंद साथी। ग्रामीण, अर्ध-शहरी और प्रथम-पीढ़ी के छात्रों के लिए AI रोडमैप, सरकारी परीक्षा ब्लूप्रिंट और मुफ्त पढ़ाई के साधन।",
    hero_cta_quiz: "करियर क्विज़ दें",
    hero_cta_govt: "सरकारी नौकरियां देखें",
    hero_cta_ai: "AI काउंसलर से पूछें",
    stat_students: "50,000+",
    stat_students_label: "छात्रों का मार्गदर्शन",
    stat_careers: "100+",
    stat_careers_label: "करियर विकल्प",
    stat_exams: "35+",
    stat_exams_label: "सरकारी परीक्षाएं",
    stat_scholarships: "₹15+ करोड़",
    stat_scholarships_label: "छात्रवृत्तियां सूचीबद्ध",

    how_it_works_title: "3 आसान चरणों में समझें",
    how_step1_title: "1. 3 मिनट का AI क्विज़ दें",
    how_step1_desc: "अपनी रुचियों, ताकत और पारिवारिक प्राथमिकताओं पर 12 सीधे सवालों के जवाब दें। किसी तकनीकी ज्ञान की ज़रूरत नहीं।",
    how_step2_title: "2. अपनी टॉप 3 राहें जानें",
    how_step2_desc: "मैच पर्सेंटेज, सैलरी रेंज, परीक्षा की कठिनाई और माता-पिता के लिए बजट विश्लेषण के साथ सही विकल्प देखें।",
    how_step3_title: "3. अपना रोडमैप डाउनलोड करें",
    how_step3_desc: "महीने-दर-महीने का प्लान और NPTEL, SWAYAM और यूट्यूब के फ्री लेक्चर्स की सूची PDF में प्राप्त करें।",

    features_title: "करियर सफलता के लिए संपूर्ण टूल्स",
    testimonials_title: "भारत भर के छात्रों के अनुभव",
    footer_text: "करियरपाथ AI - भारत के युवाओं को सशक्त बनाने के लिए समर्पित AI मार्गदर्शक।",
    demo_disclaimer: "सूचना: डेमो के लिए सांकेतिक डेटा। आधिकारिक वेबसाइटों से विवरण सत्यापित करें।",

    // Quiz
    quiz_heading: "अपने लिए सर्वश्रेष्ठ करियर खोजें",
    quiz_question_counter: "प्रश्न",
    quiz_back: "पीछे जाएं",
    quiz_next: "आगे बढ़ें",
    quiz_submit: "मेरा करियर रिजल्ट देखें",
    quiz_results_title: "आपके टॉप 3 AI करियर सुझाव",
    quiz_match_score: "मैच स्कोर",
    quiz_why_fit: "यह आपके अनुकूल क्यों है",
    quiz_salary: "संभावित सैलरी",
    quiz_duration: "तैयारी एवं कोर्स अवधि",
    quiz_get_roadmap: "रोडमैप बनाएं",
    quiz_analyze_gap: "स्किल गैप जांचें",
    quiz_retake: "दोबारा क्विज़ दें",

    // Common
    loading: "लोड हो रहा है...",
    download_pdf: "पीडीएफ डाउनलोड करें",
    search_placeholder: "करियर, परीक्षा या स्किल खोजें...",
    filter_all: "सभी",
    free_resource: "100% मुफ्त अध्ययन सामग्री",
    eligibility: "पात्रता एवं योग्यता",
    salary_perks: "वेतन एवं सुविधाएं",
    deadline: "अंतिम तिथि"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('careerpath_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('careerpath_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

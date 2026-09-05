"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

const translations = {
  en: {
    // Navbar
    login: "Log in",
    get_started: "Sign up",
    find_doctor: "Find a Doctor",
    how_it_works: "How it works",
    testimonials: "Testimonials",
    faq: "FAQ",
    // Hero
    hero_badge: "India's #1 Healthcare Platform",
    hero_title: "Find & Book the Best Doctors Near You",
    hero_subtitle: "Connect with top-rated specialists, book appointments instantly, and manage your health seamlessly.",
    search_placeholder: "Search doctors, specialties...",
    search_location: "Location",
    search_btn: "Search",
    trusted_by: "Trusted by 10,000+ patients",
    // How it Works
    hiw_title: "How it works",
    hiw_step1: "Find a Doctor",
    hiw_step1_desc: "Search by specialty, name, or condition.",
    hiw_step2: "Book Appointment",
    hiw_step2_desc: "Choose a time slot that works for you.",
    hiw_step3: "Get Consulted",
    hiw_step3_desc: "Visit the clinic to consult your doctor.",
    // Doctors Grid
    doctors_title: "Top-Rated Specialists",
    doctors_subtitle: "Book guaranteed appointments with our best doctors.",
    view_all: "View All",
    book_appointment: "Book Appointment",
    location: "Location",
    available: "Available",
    // Testimonials
    testi_title: "What our patients say",
    // FAQ
    faq_title: "Frequently Asked Questions",
    faq_q1: "How do I book an appointment?",
    faq_a1: "Simply search for a doctor, click 'Book Appointment', choose a time slot, and confirm your details. It takes less than 2 minutes.",
    faq_q2: "Are the doctors verified?",
    faq_a2: "Yes, every doctor on MediBook goes through a strict verification process checking their medical license, qualifications, and experience.",
    faq_q3: "Can I cancel my appointment?",
    faq_a3: "Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time for a full refund.",
    // Footer
    footer_desc: "Making healthcare accessible, transparent, and seamless for everyone.",
    footer_patients: "Patients",
    footer_doctors: "Doctors",
    footer_join: "Join MediBook",
    footer_provider: "Provider Dashboard",
    footer_company: "Company",
    footer_about: "About Us",
    footer_contact: "Contact",
    footer_privacy: "Privacy Policy",
    footer_rights: "MediBook Platform. All rights reserved.",
  },
  hi: {
    // Navbar
    login: "लॉग इन करें",
    get_started: "साइन अप करें",
    find_doctor: "डॉक्टर खोजें",
    how_it_works: "यह कैसे काम करता है",
    testimonials: "प्रशंसापत्र",
    faq: "सामान्य प्रश्न",
    // Hero
    hero_badge: "भारत का नंबर 1 हेल्थकेयर प्लेटफॉर्म",
    hero_title: "अपने आस-पास के सर्वश्रेष्ठ डॉक्टर खोजें और बुक करें",
    hero_subtitle: "शीर्ष विशेषज्ञों से जुड़ें, तुरंत अपॉइंटमेंट बुक करें और अपने स्वास्थ्य को सहजता से प्रबंधित करें।",
    search_placeholder: "डॉक्टर, विशेषज्ञता खोजें...",
    search_location: "स्थान",
    search_btn: "खोजें",
    trusted_by: "10,000+ मरीजों द्वारा भरोसेमंद",
    // How it Works
    hiw_title: "यह कैसे काम करता है",
    hiw_step1: "डॉक्टर खोजें",
    hiw_step1_desc: "विशेषज्ञता, नाम या बीमारी के अनुसार खोजें।",
    hiw_step2: "अपॉइंटमेंट बुक करें",
    hiw_step2_desc: "वह समय चुनें जो आपके लिए उपयुक्त हो।",
    hiw_step3: "परामर्श लें",
    hiw_step3_desc: "क्लीनिक जाएं और अपने डॉक्टर से परामर्श लें।",
    // Doctors Grid
    doctors_title: "शीर्ष विशेषज्ञ",
    doctors_subtitle: "हमारे सर्वश्रेष्ठ डॉक्टरों के साथ गारंटीकृत अपॉइंटमेंट बुक करें।",
    view_all: "सभी देखें",
    book_appointment: "अपॉइंटमेंट बुक करें",
    location: "स्थान",
    available: "उपलब्ध",
    // Testimonials
    testi_title: "हमारे मरीज क्या कहते हैं",
    // FAQ
    faq_title: "अक्सर पूछे जाने वाले प्रश्न",
    faq_q1: "मैं अपॉइंटमेंट कैसे बुक करूं?",
    faq_a1: "बस डॉक्टर खोजें, 'अपॉइंटमेंट बुक करें' पर क्लिक करें, समय चुनें और अपने विवरण की पुष्टि करें। इसमें 2 मिनट से भी कम समय लगता है।",
    faq_q2: "क्या डॉक्टर सत्यापित हैं?",
    faq_a2: "हां, MediBook पर हर डॉक्टर एक सख्त सत्यापन प्रक्रिया से गुजरता है जिसमें उनके मेडिकल लाइसेंस, योग्यता और अनुभव की जांच की जाती है।",
    faq_q3: "क्या मैं अपना अपॉइंटमेंट रद्द कर सकता हूँ?",
    faq_a3: "हां, आप पूरे रिफंड के लिए निर्धारित समय से 2 घंटे पहले तक अपना अपॉइंटमेंट रद्द या पुनर्निर्धारित कर सकते हैं।",
    // Footer
    footer_desc: "सभी के लिए स्वास्थ्य सेवा को सुलभ, पारदर्शी और सहज बनाना।",
    footer_patients: "मरीज",
    footer_doctors: "डॉक्टर",
    footer_join: "MediBook से जुड़ें",
    footer_provider: "प्रदाता डैशबोर्ड",
    footer_company: "कंपनी",
    footer_about: "हमारे बारे में",
    footer_contact: "संपर्क करें",
    footer_privacy: "गोपनीयता नीति",
    footer_rights: "MediBook प्लेटफॉर्म। सर्वाधिकार सुरक्षित।",
  }
};

type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: keyof Translations) => {
    return translations[language][key] || translations.en[key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

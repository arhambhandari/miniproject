"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

    // Dashboard Navigation & Shell
    dashboard: "Dashboard",
    appointments: "Appointments",
    consultations: "Consultations",
    medical_records: "Medical Records",
    find_doctors: "Find Doctors",
    notifications: "Notifications",
    settings: "Settings",
    logout: "Logout",
    back_to_home: "Back to Home",
    search_dash_placeholder: "Search for events, doctors, appointments...",
    clear: "Clear",
    example_dashboard_note: "(this dashboard is for example)",
    verified_patient: "Verified Patient",
    book_specialist: "+ Book Specialist",

    // Welcome Banner
    good_day: "Good Day",
    have_a_nice: "Have a nice",
    you_have: "You have",
    upcoming_single: "upcoming consultation today.",
    upcoming_multiple: "upcoming consultations today.",
    records_synced_badge: "UHID: MB-98412 • All Vital Records Synced",
    opd_queue_active_badge: "OPD Queue Active",

    // OPD Queue Tracker
    live_queue_title: "Live Hospital OPD Queue Tracker",
    live_queue_subtitle: "Real-time token & chamber tracking for your ongoing visit",
    your_token: "Your Token",
    now_serving: "Now Serving",
    est_wait: "Est. Wait Time",
    digital_opd_pass: "Digital E-Pass",
    view_opd_pass: "View OPD E-Pass",
    chamber: "Chamber",
    mins: "mins",
    ahead_of_you: "patient(s) ahead of you in chamber line",

    // Stat Cards
    in_clinic_opd: "In-Clinic OPD",
    completed_hospital_visits: "completed hospital visits",
    prescriptions_and_meds: "Prescriptions & Meds",
    active_daily_doses: "active daily doses",
    diagnostics_and_labs: "Diagnostics & Labs",
    reports_verified_and_synced: "reports verified & synced",

    // Vitals Card
    vitals_title: "Clinical Health Vitals",
    vitals_subtitle: "Live synced biometric telemetry with doctor chamber",
    blood_pressure: "Blood Pressure",
    heart_rate: "Heart Rate",
    blood_glucose: "Blood Glucose",
    spo2_oxygen: "SpO2 Oxygen",
    body_mass_index: "Body Mass Index",
    status_optimal: "Normal / Optimal",

    // Daily Medication Tracker
    med_tracker_title: "Medications & Daily Adherence",
    med_tracker_subtitle: "Prescribed dosages linked directly from doctor consultations",
    dose_morning: "Morning",
    dose_afternoon: "Afternoon",
    dose_night: "Night",
    take_dose: "Take Now",
    taken: "Taken",

    // Appointments List
    my_consultations_title: "My Consultations & Visits",
    my_consultations_subtitle: "Manage your verified hospital OPD bookings and specialist visits",
    status_upcoming: "Upcoming",
    status_completed: "Completed",
    status_cancelled: "Cancelled",
    consultation_fee: "Consultation Fee",
    cancel_and_refund: "Cancel & Refund",
    write_review: "Write Review",
    reviewed: "Reviewed",
    view_on_doctor_page: "View on Doctor Page",
    no_appointments_match: "No appointments match your search.",
    clear_search_filters: "Clear search filters",

    // Right Panel & Profile
    medical_profile: "Medical Profile",
    abha_health_id: "ABHA Health ID",
    blood_group: "Blood Group",
    upcoming_schedule: "Upcoming Schedule",
    emergency_support: "Emergency Support",
    emergency_desc: "24x7 Ambulance & Hospital Desk",

    // Doctor Topbar & Portal
    doctor_practice_portal: "Doctor Practice Portal",
    doctor_search_placeholder: "Search patients, prescriptions, clinical records...",
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

    // Dashboard Navigation & Shell
    dashboard: "डैशबोर्ड",
    appointments: "अपॉइंटमेंट",
    consultations: "परामर्श",
    medical_records: "मेडिकल रिकॉर्ड",
    find_doctors: "डॉक्टर खोजें",
    notifications: "सूचनाएं",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    back_to_home: "होम पर वापस जाएं",
    search_dash_placeholder: "इवेंट, डॉक्टर, अपॉइंटमेंट खोजें...",
    clear: "साफ़ करें",
    example_dashboard_note: "(यह डैशबोर्ड उदाहरण के लिए है)",
    verified_patient: "सत्यापित मरीज",
    book_specialist: "+ विशेषज्ञ बुक करें",

    // Welcome Banner
    good_day: "नमस्ते",
    have_a_nice: "आपका",
    you_have: "आपके पास",
    upcoming_single: "आज 1 आगामी परामर्श है।",
    upcoming_multiple: "आज आगामी परामर्श हैं।",
    records_synced_badge: "UHID: MB-98412 • सभी स्वास्थ्य रिकॉर्ड सिंक किए गए",
    opd_queue_active_badge: "ओपीडी कतार सक्रिय",

    // OPD Queue Tracker
    live_queue_title: "लाइव अस्पताल ओपीडी कतार ट्रैकर",
    live_queue_subtitle: "आपकी वर्तमान यात्रा के लिए रीयल-टाइम टोकन और कक्ष ट्रैकिंग",
    your_token: "आपका टोकन",
    now_serving: "वर्तमान टोकन",
    est_wait: "अनुमानित प्रतीक्षा",
    digital_opd_pass: "डिजिटल ओपीडी पास",
    view_opd_pass: "ओपीडी ई-पास देखें",
    chamber: "कक्ष",
    mins: "मिनट",
    ahead_of_you: "मरीज कतार में आपके आगे हैं",

    // Stat Cards
    in_clinic_opd: "इन-क्लीनिक ओपीडी",
    completed_hospital_visits: "पूर्ण अस्पताल यात्राएं",
    prescriptions_and_meds: "प्रिस्क्रिप्शन और दवाएं",
    active_daily_doses: "सक्रिय दैनिक खुराक",
    diagnostics_and_labs: "जांच और लैब टेस्ट",
    reports_verified_and_synced: "रिपोर्ट्स सत्यापित और सिंक",

    // Vitals Card
    vitals_title: "मरीज के स्वास्थ्य आंकड़े",
    vitals_subtitle: "डॉक्टर कक्ष के साथ लाइव सिंक बायोमेट्रिक आंकड़े",
    blood_pressure: "रक्तचाप (बीपी)",
    heart_rate: "हृदय गति",
    blood_glucose: "रक्त शर्करा",
    spo2_oxygen: "ऑक्सीजन स्तर (SpO2)",
    body_mass_index: "बॉडी मास इंडेक्स (BMI)",
    status_optimal: "सामान्य / उत्तम",

    // Daily Medication Tracker
    med_tracker_title: "दैनिक दवा और खुराक ट्रैकर",
    med_tracker_subtitle: "डॉक्टर परामर्श से सीधे जुड़ी निर्धारित खुराक",
    dose_morning: "सुबह",
    dose_afternoon: "दोपहर",
    dose_night: "रात",
    take_dose: "खुराक लें",
    taken: "ले ली",

    // Appointments List
    my_consultations_title: "मेरे परामर्श और यात्राएं",
    my_consultations_subtitle: "अपनी सत्यापित ओपीडी बुकिंग और विशेषज्ञ यात्राओं को प्रबंधित करें",
    status_upcoming: "आगामी",
    status_completed: "पूर्ण",
    status_cancelled: "रद्द",
    consultation_fee: "परामर्श शुल्क",
    cancel_and_refund: "रद्द और रिफंड करें",
    write_review: "समीक्षा लिखें",
    reviewed: "समीक्षित",
    view_on_doctor_page: "डॉक्टर पेज पर देखें",
    no_appointments_match: "आपकी खोज से कोई अपॉइंटमेंट मेल नहीं खाता।",
    clear_search_filters: "फ़िल्टर साफ़ करें",

    // Right Panel & Profile
    medical_profile: "मेडिकल प्रोफ़ाइल",
    abha_health_id: "ABHA स्वास्थ्य आईडी",
    blood_group: "रक्त समूह",
    upcoming_schedule: "आगामी कार्यक्रम",
    emergency_support: "आपातकालीन सहायता",
    emergency_desc: "24x7 एम्बुलेंस और अस्पताल सहायता",

    // Doctor Topbar & Portal
    doctor_practice_portal: "डॉक्टर प्रैक्टिस पोर्टल",
    doctor_search_placeholder: "मरीज, नुस्खे, मेडिकल रिकॉर्ड खोजें...",
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
  const [language, setLanguageState] = useState<Language>("en");

  // Load persisted language from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("medibook_lang");
      if (saved === "en" || saved === "hi") {
        setLanguageState(saved);
      }
    } catch (e) {
      // ignore in SSR or restricted environments
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("medibook_lang", lang);
    } catch (e) {
      // ignore
    }
  };

  const t = (key: keyof Translations) => {
    return translations[language]?.[key] || translations.en[key] || (key as string);
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


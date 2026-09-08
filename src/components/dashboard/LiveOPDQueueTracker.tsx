"use client";

import React from "react";
import { 
  Activity, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Users,
  Navigation,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageContext";
import type { Appointment } from "@/types";

interface LiveOPDQueueTrackerProps {
  upcomingAppointment?: Appointment;
  onOpenPass: (appointment: Appointment) => void;
}

export function LiveOPDQueueTracker({
  upcomingAppointment,
  onOpenPass,
}: LiveOPDQueueTrackerProps) {
  const { language, t } = useLanguage();

  const activeApp: Appointment = upcomingAppointment || {
    id: "app_opd_demo",
    patientName: "Rahul Sharma",
    doctorId: "doc_1",
    doctorName: "Dr. Aarav Mehta",
    specialty: "Neuro-Oncology",
    date: "Today",
    time: "10:00 AM",
    status: "Upcoming",
    fee: "₹2,000",
    hospitalName: "AIIMS Super Specialty Hospital, New Delhi",
    roomNumber: "OPD Chamber 304",
    tokenNumber: "Token #A-08",
  };

  const handleDirections = () => {
    toast.info(
      language === "hi"
        ? "अस्पताल निर्देश: एम्स सुपर स्पेशियलिटी विंग बी, तीसरी मंजिल, कक्ष 304 के लिए लिफ्ट 2 लें।"
        : "Hospital Directions: AIIMS Super Specialty Wing B, 3rd Floor, take Elevator 2 to Chamber 304.",
      { duration: 6000 }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-[28px] p-6 shadow-xl border border-slate-700/80"
    >
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/70">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Activity className="size-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {t("live_queue_title")}
              </h3>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                {language === "hi" ? "कतार सक्रिय" : "Queue Active"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeApp.hospitalName || "Apollo Specialty Hospital, Mumbai"} • {activeApp.roomNumber || "OPD Chamber 304"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDirections}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="size-3.5 text-blue-400" />
            <span>{language === "hi" ? "दिशा-निर्देश" : "Directions"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onOpenPass(activeApp)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="size-3.5" />
            <span>{t("digital_opd_pass")}</span>
          </motion.button>
        </div>
      </div>

      {/* Main Live Queue Metrics */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 py-5">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            {t("now_serving")}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
            #A-06
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Inside Chamber 304
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/30">
          <span className="text-[10px] font-bold uppercase text-blue-300 block mb-1">
            {t("your_token")}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight">
            {activeApp.tokenNumber || "#A-08"}
          </div>
          <span className="text-[10px] text-blue-200 font-medium block mt-0.5">
            {language === "hi" ? "लॉबी में प्रतीक्षारत" : "Waiting in Sub-Lobby"}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            {language === "hi" ? "कतार में आगे" : "Patients Ahead"}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
            <span>2</span>
            <span className="text-xs text-slate-400 font-normal">
              {language === "hi" ? "मरीज" : "patients"}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">
            {language === "hi" ? "तेज़ गति वाली कतार" : "Fast moving queue"}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            {t("est_wait")}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            ~12 {t("mins")}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {language === "hi" ? "लगभग 10:12 AM" : "Approx. 10:12 AM"}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative z-10 pt-2">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="flex flex-col items-center">
            <div className="size-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] mb-1.5 shadow-sm shadow-emerald-500/50">
              ✓
            </div>
            <span className="text-[11px] font-bold text-slate-200">
              {language === "hi" ? "कियोस्क स्कैन" : "Kiosk Scan"}
            </span>
            <span className="text-[9px] text-emerald-400 font-medium">
              {language === "hi" ? "पूर्ण 9:15 AM" : "Done 9:15 AM"}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] mb-1.5 shadow-sm shadow-emerald-500/50">
              ✓
            </div>
            <span className="text-[11px] font-bold text-slate-200">
              {language === "hi" ? "नर्स जांच" : "Nurse Triage"}
            </span>
            <span className="text-[9px] text-emerald-400 font-medium">BP: 120/80</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="size-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] mb-1.5 ring-4 ring-blue-500/30 animate-pulse">
              3
            </div>
            <span className="text-[11px] font-bold text-blue-300">
              {language === "hi" ? "ओपीडी लॉबी" : "OPD Lobby"}
            </span>
            <span className="text-[9px] text-blue-200 font-medium">
              {language === "hi" ? "वर्तमान चरण" : "Current Step"}
            </span>
          </div>

          <div className="flex flex-col items-center opacity-40">
            <div className="size-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center font-bold text-[10px] mb-1.5">
              4
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {language === "hi" ? "डॉक्टर कक्ष" : "Doctor Desk"}
            </span>
            <span className="text-[9px] text-slate-500">Chamber 304</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

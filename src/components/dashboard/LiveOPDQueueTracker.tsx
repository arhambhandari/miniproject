"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ArrowRight,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  Radio
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageContext";
import type { Appointment, QueueState } from "@/types";

interface LiveOPDQueueTrackerProps {
  upcomingAppointment?: Appointment;
  onOpenPass: (appointment: Appointment) => void;
}

export function LiveOPDQueueTracker({
  upcomingAppointment,
  onOpenPass,
}: LiveOPDQueueTrackerProps) {
  const { language, t } = useLanguage();
  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const lastTokenRef = useRef<string | null>(null);

  const activeApp: Appointment = upcomingAppointment || {
    id: "app_opd_demo",
    patientName: "Rahul Sharma",
    doctorId: "doc_1",
    doctorName: "Dr. Vikramaditya Rathore",
    specialty: "Neuro-Oncology",
    date: "Today",
    time: "10:30 AM",
    status: "Upcoming",
    fee: "₹2,000",
    hospitalName: "Apollo Specialty Hospital, Mumbai",
    roomNumber: "OPD Chamber 304",
    tokenNumber: "Token #A-08",
  };

  const myToken = activeApp.tokenNumber || "Token #A-08";

  // Play synthetic 2-tone hospital chime (G5 -> C6)
  const playHospitalChime = () => {
    if (isMuted || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(784, 0, 0.4);
      playTone(1046.5, 0.22, 0.6);
    } catch {
      // Audio playback prevented by browser user-interaction policy
    }
  };

  // Connect to SSE Stream
  useEffect(() => {
    // 1. Initial status fetch
    fetch("/api/queue/status")
      .then((res) => res.json())
      .then((data) => {
        if (data?.state) {
          setQueueState(data.state);
          lastTokenRef.current = data.state.currentServingToken;
        }
      })
      .catch((err) => console.warn("Failed to fetch initial queue status:", err));

    // 2. Open SSE stream
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/queue/stream");

      eventSource.onopen = () => {
        setConnected(true);
      };

      const handleIncomingState = (stateData: QueueState) => {
        setQueueState((prev) => {
          if (prev && prev.currentServingToken !== stateData.currentServingToken) {
            // New token announced!
            playHospitalChime();
            if (stateData.currentServingToken === myToken) {
              toast.success(`🎉 YOUR TOKEN IS CALLED! Please enter Chamber 304 now.`);
            } else {
              toast.info(`OPD Queue Update: Now serving ${stateData.currentServingToken}`);
            }
          }
          return stateData;
        });
        setConnected(true);
      };

      eventSource.addEventListener("queue_state", (e) => {
        try {
          const parsed = JSON.parse(e.data);
          handleIncomingState(parsed);
        } catch (err) {
          console.error("Failed to parse queue_state SSE data:", err);
        }
      });

      eventSource.addEventListener("queue_update", (e) => {
        try {
          const parsed = JSON.parse(e.data);
          handleIncomingState(parsed);
        } catch (err) {
          console.error("Failed to parse queue_update SSE data:", err);
        }
      });

      eventSource.onerror = () => {
        setConnected(false);
      };
    } catch (err) {
      console.warn("EventSource failed:", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [myToken, isMuted]);

  const handleDirections = () => {
    toast.info(
      language === "hi"
        ? "अस्पताल निर्देश: अपोलो स्पेशियलिटी विंग बी, तीसरी मंजिल, कक्ष 304 के लिए लिफ्ट 2 लें।"
        : "Hospital Directions: Apollo Specialty Wing B, 3rd Floor, take Elevator 2 to Chamber 304.",
      { duration: 6000 }
    );
  };

  // Calculate live dynamic metrics
  const currentServing = queueState?.currentServingToken || "Token #A-06";
  const isEmergency = queueState?.status === "EMERGENCY_DELAY";
  const delayMins = queueState?.delayMinutes || 0;

  // Calculate tokens ahead
  const tokensList = queueState?.tokens || [];
  const myTokenIdx = tokensList.findIndex((t) => t.tokenNumber === myToken);
  const currentIdx = tokensList.findIndex((t) => t.tokenNumber === currentServing);

  let patientsAhead = 2;
  if (myTokenIdx !== -1 && currentIdx !== -1) {
    patientsAhead = Math.max(0, myTokenIdx - currentIdx);
  }

  const isMyTurn = currentServing === myToken;
  const estimatedWait = isMyTurn ? 0 : Math.max(2, patientsAhead * 10 + delayMins);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-[28px] p-6 shadow-xl border transition-all ${
        isMyTurn
          ? "bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/80 ring-4 ring-emerald-500/30 text-white"
          : isEmergency
          ? "bg-gradient-to-br from-amber-950/90 via-slate-900 to-blue-950 border-amber-500/60 text-white"
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 border-slate-700/80 text-white"
      }`}
    >
      {/* Decorative ambient background glow */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isMyTurn ? "bg-emerald-500/20" : "bg-blue-500/10"
        }`}
      />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/70">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isMyTurn
                ? "bg-emerald-500/30 text-emerald-300 border-emerald-500/40 animate-bounce"
                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
            }`}
          >
            <Activity className="size-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {t("live_queue_title")}
              </h3>
              <span
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                  connected
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    connected ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                  }`}
                />
                {connected ? (language === "hi" ? "लाइव कतार" : "Live Sync Active") : "Connecting..."}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeApp.hospitalName || "Apollo Specialty Hospital, Mumbai"} •{" "}
              {activeApp.roomNumber || "OPD Chamber 304"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mute/Unmute Audio Chime */}
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              toast.info(isMuted ? "Hospital audio chime unmuted" : "Hospital audio chime muted");
            }}
            title={isMuted ? "Unmute Hospital Chime" : "Mute Hospital Chime"}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-all cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="size-3.5 text-rose-400" />
            ) : (
              <Volume2 className="size-3.5 text-emerald-400" />
            )}
          </button>

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

      {/* Emergency Notice Banner */}
      {isEmergency && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mt-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center gap-3 text-xs text-amber-200"
        >
          <AlertTriangle className="size-5 text-amber-400 shrink-0 animate-pulse" />
          <div>
            <strong className="block text-amber-300">OPD Chamber Schedule Delay (+15 mins)</strong>
            <span>
              {queueState?.delayReason || "Dr. Vikramaditya is attending an urgent trauma case."} Estimated wait times have been updated.
            </span>
          </div>
        </motion.div>
      )}

      {/* CALLING PATIENT BANNER (WHEN IT'S YOUR TURN) */}
      <AnimatePresence>
        {isMyTurn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative z-10 mt-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/60 shadow-lg shadow-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-lg animate-bounce">
                🔔
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-emerald-300">
                  YOUR TOKEN IS NOW BEING CALLED!
                </h4>
                <p className="text-xs text-slate-200">
                  Please proceed immediately to <strong>OPD Chamber 304, 3rd Floor</strong>. Dr. Vikramaditya is ready for you.
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenPass(activeApp)}
              className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs shadow-md shrink-0 cursor-pointer"
            >
              Show Entry Pass
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Live Queue Metrics */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 py-5">
        {/* Metric 1: Now Serving */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            {t("now_serving")}
          </span>
          <div
            data-testid="now-serving-token"
            className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight"
          >
            {currentServing}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {queueState?.currentPatientName
              ? `Patient: ${queueState.currentPatientName}`
              : "Inside Chamber 304"}
          </span>
        </div>

        {/* Metric 2: Your Token */}
        <div
          className={`p-3.5 rounded-2xl border ${
            isMyTurn
              ? "bg-emerald-500/20 border-emerald-500/50"
              : "bg-blue-500/15 border-blue-500/30"
          }`}
        >
          <span
            className={`text-[10px] font-bold uppercase block mb-1 ${
              isMyTurn ? "text-emerald-300" : "text-blue-300"
            }`}
          >
            {t("your_token")}
          </span>
          <div
            data-testid="patient-your-token"
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isMyTurn ? "text-emerald-400" : "text-blue-400"
            }`}
          >
            {myToken}
          </div>
          <span
            className={`text-[10px] font-medium block mt-0.5 ${
              isMyTurn ? "text-emerald-300 font-bold" : "text-blue-200"
            }`}
          >
            {isMyTurn
              ? "Inside Chamber Now"
              : language === "hi"
              ? "लॉबी में प्रतीक्षारत"
              : "Waiting in Sub-Lobby"}
          </span>
        </div>

        {/* Metric 3: Patients Ahead */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            {language === "hi" ? "कतार में आगे" : "Patients Ahead"}
          </span>
          <div
            data-testid="patients-ahead-count"
            className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1"
          >
            <span>{isMyTurn ? 0 : patientsAhead}</span>
            <span className="text-xs text-slate-400 font-normal">
              {language === "hi" ? "मरीज" : "patients"}
            </span>
          </div>
          <span
            className={`text-[10px] block mt-0.5 font-medium ${
              isMyTurn
                ? "text-emerald-400 font-bold"
                : patientsAhead <= 1
                ? "text-emerald-400"
                : "text-blue-300"
            }`}
          >
            {isMyTurn
              ? "You are next in room"
              : patientsAhead <= 1
              ? "Prepare to enter room"
              : language === "hi"
              ? "तेज़ गति वाली कतार"
              : "Fast moving queue"}
          </span>
        </div>

        {/* Metric 4: Estimated Wait */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            {t("est_wait")}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            {isMyTurn ? "0 mins" : `~${estimatedWait} ${t("mins")}`}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isMyTurn
              ? "In Consultation"
              : isEmergency
              ? "+15m delay added"
              : language === "hi"
              ? "लगभग 10:30 AM"
              : "Approx. 10:30 AM"}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative z-10 pt-2">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {/* Step 1: Kiosk Scan */}
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

          {/* Step 2: Nurse Triage */}
          <div className="flex flex-col items-center">
            <div className="size-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px] mb-1.5 shadow-sm shadow-emerald-500/50">
              ✓
            </div>
            <span className="text-[11px] font-bold text-slate-200">
              {language === "hi" ? "नर्स जांच" : "Nurse Triage"}
            </span>
            <span className="text-[9px] text-emerald-400 font-medium">BP: 120/80</span>
          </div>

          {/* Step 3: OPD Lobby */}
          <div className="flex flex-col items-center">
            <div
              className={`size-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1.5 ${
                isMyTurn
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-blue-500 text-white ring-4 ring-blue-500/30 animate-pulse"
              }`}
            >
              {isMyTurn ? "✓" : "3"}
            </div>
            <span
              className={`text-[11px] font-bold ${
                isMyTurn ? "text-slate-200" : "text-blue-300"
              }`}
            >
              {language === "hi" ? "ओपीडी लॉबी" : "OPD Lobby"}
            </span>
            <span
              className={`text-[9px] font-medium ${
                isMyTurn ? "text-emerald-400" : "text-blue-200"
              }`}
            >
              {isMyTurn ? "Complete" : language === "hi" ? "वर्तमान चरण" : "Current Step"}
            </span>
          </div>

          {/* Step 4: Doctor Desk */}
          <div className={`flex flex-col items-center ${isMyTurn ? "opacity-100" : "opacity-40"}`}>
            <div
              className={`size-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-1.5 ${
                isMyTurn
                  ? "bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/40 animate-ping"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              4
            </div>
            <span
              className={`text-[11px] font-bold ${
                isMyTurn ? "text-emerald-300" : "text-slate-400"
              }`}
            >
              {language === "hi" ? "डॉक्टर कक्ष" : "Doctor Desk"}
            </span>
            <span className={`text-[9px] ${isMyTurn ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              {isMyTurn ? "Enter Chamber 304" : "Chamber 304"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

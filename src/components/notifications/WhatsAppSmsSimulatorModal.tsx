"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  MessageSquare,
  Smartphone,
  CheckCheck,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Pill,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface WhatsAppSmsSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTemplate?: "APPOINTMENT_PASS" | "MEDICATION_REMINDER" | "DOCTOR_DELAY" | "LAB_READY";
  initialAppointment?: any;
}

export function WhatsAppSmsSimulatorModal({
  isOpen,
  onClose,
  defaultTemplate = "APPOINTMENT_PASS",
  initialAppointment,
}: WhatsAppSmsSimulatorModalProps) {
  const [channel, setChannel] = useState<"WHATSAPP" | "SMS">("WHATSAPP");
  const [template, setTemplate] = useState<"APPOINTMENT_PASS" | "MEDICATION_REMINDER" | "DOCTOR_DELAY" | "LAB_READY">(defaultTemplate);
  const [phone, setPhone] = useState("+91 98200 00000");
  const [isSending, setIsSending] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [currentTime, setCurrentTime] = useState("09:41");
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, []);

  useEffect(() => {
    if (defaultTemplate) {
      setTemplate(defaultTemplate);
    }
  }, [defaultTemplate]);

  // Audio effect using Web Audio API
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const handleSimulateSend = async () => {
    setIsSending(true);
    try {
      const res = await fetch("/api/notifications/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          template,
          recipientPhone: phone,
          patientName: "Rahul Sharma",
          doctorName: initialAppointment?.doctorName || "Dr. Vikramaditya",
          hospitalName: initialAppointment?.hospitalName || "Apollo Specialty Hospital, Mumbai",
          tokenNumber: initialAppointment?.tokenNumber || "Token #A-08",
          appointmentTime: initialAppointment?.date ? `${initialAppointment.date}, ${initialAppointment.time || "10:30 AM"}` : "Today, 10:30 AM",
          roomNumber: initialAppointment?.roomNumber || "OPD Chamber 304",
          medicationName: "Telmisartan (40 mg)",
          medicationTime: "09:00 PM (Night)",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Simulation failed");

      // Play chime
      playNotificationSound();

      // Trigger animated push banner
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 5500);

      // Append message
      setReceivedMessages((prev) => [data, ...prev]);

      toast.success(
        channel === "WHATSAPP"
          ? `Simulated WhatsApp dispatch sent to ${phone}!`
          : `Simulated SMS alert sent to ${phone}!`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to dispatch message");
    } finally {
      setIsSending(false);
    }
  };

  // Pre-seed an initial message if empty
  useEffect(() => {
    if (isOpen && receivedMessages.length === 0) {
      setReceivedMessages([
        {
          channel: "WHATSAPP",
          template: "APPOINTMENT_PASS",
          timestamp: "Just now",
          previewTitle: "🏥 Apollo Specialty Hospital",
          previewBody: "OPD Confirmed: Token #A-08 with Dr. Vikramaditya at Today, 10:30 AM.",
          messageContent: `*Digital OPD Entry & Token Pass* 🏥\n\nNamaste Rahul Sharma,\nYour consultation at *Apollo Specialty Hospital, Mumbai* is confirmed.\n\n🎟️ *Queue Token:* Token #A-08\n👨‍⚕️ *Physician:* Dr. Vikramaditya\n⏰ *Slot:* Today, 10:30 AM\n🚪 *Location:* OPD Chamber 304, 3rd Floor Wing B\n🆔 *UHID / ABHA:* MB-98412\n\n*Important Instructions:*\n• Please arrive 10 minutes prior to your slot.\n• Show this digital WhatsApp message at the OPD reception desk for immediate priority entry.`,
        },
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[36px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row my-auto max-h-[92vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close simulator"
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>

          {/* LEFT: Dispatch Controller & Controls */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="size-3" /> Live Dispatch Simulator
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  ABHA Gateway Synced
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                WhatsApp & SMS Dispatch Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Preview real-time outbound healthcare alerts, appointment entry passes, and automated medication reminders on a simulated smartphone.
              </p>

              {/* Channel Selector */}
              <div className="mt-6">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Delivery Channel
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setChannel("WHATSAPP")}
                    data-testid="select-channel-whatsapp"
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      channel === "WHATSAPP"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <MessageSquare className="size-4" />
                    <span>WhatsApp Official</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("SMS")}
                    data-testid="select-channel-sms"
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      channel === "SMS"
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <Smartphone className="size-4" />
                    <span>SMS / RCS Priority</span>
                  </button>
                </div>
              </div>

              {/* Notification Template Choices */}
              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Notification Template
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: "APPOINTMENT_PASS" as const,
                      label: "OPD Booking & Entry Pass",
                      desc: "Includes queue token, doctor chamber, and Google Maps link",
                      icon: Calendar,
                      badge: "High Priority",
                    },
                    {
                      id: "MEDICATION_REMINDER" as const,
                      label: "Daily Medication Adherence",
                      desc: "Automated dose intake prompt with 1-tap adherence logging",
                      icon: Pill,
                      badge: "Clinical Alert",
                    },
                    {
                      id: "DOCTOR_DELAY" as const,
                      label: "OPD Queue Delay / Emergency Alert",
                      desc: "Real-time notice when doctor is delayed by emergency surgery",
                      icon: Clock,
                      badge: "Live Queue",
                    },
                    {
                      id: "LAB_READY" as const,
                      label: "Pathology Lab Report Ready",
                      desc: "Instant download link for verified diagnostic investigations",
                      icon: FileText,
                      badge: "EHR Sync",
                    },
                  ].map((tpl) => {
                    const Icon = tpl.icon;
                    const isSelected = template === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setTemplate(tpl.id)}
                        data-testid={`template-${tpl.id}`}
                        className={`p-3 rounded-2xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-200 shadow-2xs"
                            : "bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <div className="font-bold flex items-center gap-2">
                              <span>{tpl.label}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                {tpl.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {tpl.desc}
                            </p>
                          </div>
                        </div>

                        <ChevronRight
                          className={`size-4 transition-transform ${
                            isSelected ? "text-blue-600 dark:text-blue-400 translate-x-1" : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Phone Input */}
              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Simulated Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    data-testid="simulator-phone-input"
                    className="w-full h-11 pl-10 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Smartphone className="size-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Bottom Dispatch Action */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSimulateSend}
                disabled={isSending}
                data-testid="trigger-simulation-btn"
                className={`w-full h-12 rounded-2xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  channel === "WHATSAPP"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                }`}
              >
                {isSending ? (
                  <span>Transmitting Simulated Dispatch...</span>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Send Simulated {channel === "WHATSAPP" ? "WhatsApp" : "SMS"} Dispatch</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* RIGHT: SMARTPHONE FRAME PREVIEW */}
          <div className="w-full lg:w-[410px] bg-slate-100 dark:bg-slate-950 p-6 flex flex-col items-center justify-center select-none overflow-hidden relative">
            {/* Ambient Back Glow */}
            <div className="absolute size-72 rounded-full bg-emerald-500/10 blur-3xl -top-10 -right-10 pointer-events-none" />

            {/* Simulated Phone Chassis */}
            <div className="w-[340px] h-[640px] bg-black rounded-[46px] p-3 shadow-2xl border-4 border-slate-700/40 relative flex flex-col overflow-hidden">
              {/* Dynamic Island / Speaker Pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
                <div className="size-2.5 rounded-full bg-slate-900 border border-slate-800" />
                <div className="size-2.5 rounded-full bg-slate-900 border border-slate-800" />
              </div>

              {/* Phone Display Screen */}
              <div className="flex-1 rounded-[38px] bg-[#efeae2] dark:bg-[#0b141a] overflow-hidden flex flex-col relative text-slate-900 dark:text-slate-100">
                {/* Status Bar */}
                <div className="h-9 px-6 flex items-center justify-between text-[11px] font-bold z-30 pt-1">
                  <span>{currentTime}</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="size-3" />
                    <Wifi className="size-3" />
                    <Battery className="size-3.5" />
                  </div>
                </div>

                {/* ANIMATED PUSH NOTIFICATION POP-DOWN BANNER */}
                <AnimatePresence>
                  {showBanner && (
                    <motion.div
                      initial={{ y: -80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -80, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      data-testid="simulated-push-banner"
                      className="absolute top-11 left-3 right-3 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200/80 dark:border-slate-700/80"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`size-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                            channel === "WHATSAPP" ? "bg-emerald-500" : "bg-blue-500"
                          }`}
                        >
                          {channel === "WHATSAPP" ? <MessageSquare className="size-4" /> : <Smartphone className="size-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold truncate">
                              {channel === "WHATSAPP" ? "Apollo Hospitals • WhatsApp" : "VK-APOLLO"}
                            </span>
                            <span className="text-[9px] text-slate-400">now</span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                            {receivedMessages[0]?.previewBody || "New official healthcare notification received."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* APP HEADER */}
                {channel === "WHATSAPP" ? (
                  /* WhatsApp Header */
                  <div className="bg-[#008069] text-white px-3.5 py-2.5 flex items-center justify-between shadow-sm z-20">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs border border-white/30">
                        AH
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold">Apollo Hospitals</span>
                          <span className="size-3 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center text-[7px] font-black">
                            ✓
                          </span>
                        </div>
                        <span className="text-[9px] text-emerald-100 block">
                          Official Business Account
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Video className="size-4" />
                      <PhoneCall className="size-3.5" />
                    </div>
                  </div>
                ) : (
                  /* SMS / Messages Header */
                  <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        VK
                      </div>
                      <div>
                        <span className="text-xs font-bold">VK-APOLLO</span>
                        <span className="text-[9px] text-slate-400 block">Verified SMS Sender</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600">Details</span>
                  </div>
                )}

                {/* CHAT MESSAGES THREAD */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 relative text-xs">
                  {/* Encryption Notice */}
                  <div className="text-center my-1">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[9px] font-medium inline-block shadow-2xs">
                      🔒 End-to-end encrypted hospital communication
                    </span>
                  </div>

                  {/* Messages Bubble */}
                  {receivedMessages.map((msg, idx) => (
                    <motion.div
                      key={msg.messageId || idx}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`max-w-[92%] rounded-2xl p-3 shadow-md relative ${
                        channel === "WHATSAPP"
                          ? "bg-white dark:bg-[#1f2c34] text-slate-900 dark:text-slate-100 self-start rounded-tl-sm border border-slate-200/60 dark:border-slate-700/40"
                          : "bg-blue-600 text-white self-end rounded-tr-sm"
                      }`}
                    >
                      {/* WhatsApp Business Verified Header Inside Bubble */}
                      {channel === "WHATSAPP" && (
                        <div className="pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="size-3" /> Apollo Health ABHA
                          </span>
                          <span className="text-[9px] text-slate-400">{msg.timestamp || "Today"}</span>
                        </div>
                      )}

                      {/* Content */}
                      <p className="whitespace-pre-line text-[11px] leading-relaxed">
                        {msg.messageContent}
                      </p>

                      {/* WhatsApp Interactive Action Buttons */}
                      {channel === "WHATSAPP" && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
                          {msg.template === "APPOINTMENT_PASS" && (
                            <>
                              <button
                                type="button"
                                onClick={() => toast.success("Opening Apollo Hospital Mumbai in Google Maps...")}
                                className="w-full py-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700"
                              >
                                <MapPin className="size-3" />
                                <span>Hospital Navigation (Maps)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toast.success("Appointment added to Google Calendar!")}
                                className="w-full py-1.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700"
                              >
                                <Calendar className="size-3" />
                                <span>Add to Calendar</span>
                              </button>
                            </>
                          )}

                          {msg.template === "MEDICATION_REMINDER" && (
                            <button
                              type="button"
                              onClick={() => toast.success("Dose intake recorded via WhatsApp response! Adherence synced.")}
                              className="w-full py-1.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200 dark:border-emerald-800"
                            >
                              <CheckCircle2 className="size-3" />
                              <span>✓ Mark Dose as Taken</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Read status */}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] text-slate-400">
                          {msg.timestamp || currentTime}
                        </span>
                        {channel === "WHATSAPP" && (
                          <CheckCheck className="size-3 text-blue-500" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chat Input Bar Footer */}
                <div className="p-2 bg-white dark:bg-[#1f2c34] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <div className="flex-1 h-8 px-3 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400 flex items-center">
                    Type a reply...
                  </div>
                  <div
                    className={`size-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                      channel === "WHATSAPP" ? "bg-[#008069]" : "bg-blue-600"
                    }`}
                  >
                    <Send className="size-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

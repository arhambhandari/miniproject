"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Send, 
  CalendarCheck, 
  Clock, 
  MapPin, 
  CheckCircle, 
  User, 
  Sparkles,
  Phone,
  FileText,
  ShieldCheck,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Appointment } from "@/types";

interface ConsultationsViewProps {
  appointments: Appointment[];
  userName?: string;
  onReturnToOverview: () => void;
  onOpenBooking: () => void;
}

export function ConsultationsView({
  appointments,
  userName = "Rahul Sharma",
  onReturnToOverview,
  onOpenBooking,
}: ConsultationsViewProps) {
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ sender: "doctor" | "patient"; text: string; time: string }[]>([
    {
      sender: "doctor",
      text: "Hello Rahul, welcome to your MediBook consultation thread. Please review your recent lab reports before our appointment.",
      time: "10:15 AM",
    },
    {
      sender: "patient",
      text: "Thank you Doctor! I've uploaded the latest CBC analysis and vitals to my records vault.",
      time: "10:18 AM",
    },
    {
      sender: "doctor",
      text: "Excellent. I've noted your medical history and will prepare the personalized treatment plan.",
      time: "10:20 AM",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);

  const activeConsultations = appointments.filter(
    (a) => a.status === "Upcoming" || (a.status as string) === "CONFIRMED" || (a.status as string) === "SCHEDULED"
  );

  const currentAppointment = activeConsultations[selectedDoctorIndex] || appointments[0] || {
    id: "app_default",
    doctorName: "Dr. Aarav Mehta",
    specialty: "Neuro-Oncology",
    date: "Today",
    time: "10:00 AM",
    fee: "₹2,000",
    status: "Upcoming",
    patientName: userName,
  };

  // Fetch real chat messages between patient and doctor
  const fetchMessages = async () => {
    try {
      const partnerQuery = currentAppointment.doctorUserId
        ? `?partnerId=${currentAppointment.doctorUserId}`
        : currentAppointment.id && !currentAppointment.id.startsWith("app_")
        ? `?appointmentId=${currentAppointment.id}`
        : "";

      const res = await fetch(`/api/messages${partnerQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
          const formatted = data.messages.map((m: any) => ({
            sender: m.senderRole === "DOCTOR" ? ("doctor" as const) : ("patient" as const),
            text: m.content,
            time: m.time || "Just now",
          }));
          setChatMessages(formatted);
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  React.useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [currentAppointment.doctorUserId, currentAppointment.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const trimmed = inputMessage.trim();
    const newMsg = {
      sender: "patient" as const,
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setSending(true);

    try {
      if (currentAppointment.doctorUserId) {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            receiverId: currentAppointment.doctorUserId,
            appointmentId: currentAppointment.id,
            content: trimmed,
          }),
        });

        if (res.ok) {
          toast.success("Message sent to doctor");
          fetchMessages();
        }
      } else {
        // Mock fallback simulation
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev,
            {
              sender: "doctor",
              text: `Thank you for your message, ${userName}. Your doctor has received this note in their clinical portal.`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          toast.success("Message delivered to provider portal");
        }, 1200);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to deliver message");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 mt-2"
    >
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-blue-600" /> In-Clinic Specialist Follow-ups & Notes
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
            Clinical Consultations & OPD Desk
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            In-person hospital appointment records, OPD chamber tokens, prescriptions, and direct clinical follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
          >
            <CalendarCheck className="size-4" /> Book Consultation
          </button>
          <button
            onClick={onReturnToOverview}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Grid: Sessions List on Left, Live Chat & Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Consultations List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Active & Upcoming Sessions ({activeConsultations.length || appointments.length})
          </h3>

          <div className="space-y-3">
            {(activeConsultations.length > 0 ? activeConsultations : appointments).map((appt, i) => {
              const isSelected = selectedDoctorIndex === i;
              return (
                <div
                  key={appt.id || i}
                  onClick={() => setSelectedDoctorIndex(i)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                      : "bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {appt.specialty}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 text-emerald-700">
                      {appt.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {appt.doctorName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                    <Building2 className="size-3 text-blue-500 shrink-0" />
                    <span>{appt.hospitalName || "Apollo Hospital, Mumbai"} • {appt.roomNumber || "OPD Chamber 304"}</span>
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <CalendarCheck className="size-3.5 text-blue-500" /> {appt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-amber-500" /> {appt.time}
                    </span>
                    {appt.tokenNumber && (
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded text-[10px]">
                        {appt.tokenNumber}
                      </span>
                    )}
                    <span className="font-bold text-slate-700 dark:text-slate-300 ml-auto">
                      {appt.fee}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Direct Messaging & Clinical Session Box */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800/90 rounded-[28px] border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col h-[600px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-base">
                {currentAppointment.doctorName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                  {currentAppointment.doctorName}
                  <span className="size-2 rounded-full bg-emerald-500" title="Online" />
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentAppointment.specialty} • {currentAppointment.hospitalName || "Apollo Specialty Hospital"} • {currentAppointment.roomNumber || "OPD Chamber 304"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 hidden sm:inline-block">
                Secure Channel
              </span>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
            {chatMessages.map((msg, i) => {
              const isPatient = msg.sender === "patient";
              return (
                <div
                  key={i}
                  className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isPatient
                        ? "bg-blue-600 text-white rounded-br-xs"
                        : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-600 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-700/80 bg-white dark:bg-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Send message or note to ${currentAppointment.doctorName}...`}
              className="flex-1 h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center cursor-pointer"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

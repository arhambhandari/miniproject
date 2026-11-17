"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Building2, CalendarCheck, Clock, MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Appointment } from "@/types";

interface ConsultationsViewProps {
  appointments: Appointment[];
  userName?: string;
  onReturnToOverview: () => void;
  onOpenBooking: () => void;
}

interface ConsultationMessage {
  sender: "doctor" | "patient";
  text: string;
  time: string;
}

export function ConsultationsView({
  appointments,
  userName = "Patient",
  onReturnToOverview,
  onOpenBooking,
}: ConsultationsViewProps) {
  const [selectedAppointmentIndex, setSelectedAppointmentIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<ConsultationMessage[]>([]);
  const [messagesAppointmentId, setMessagesAppointmentId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageErrorAppointmentId, setMessageErrorAppointmentId] = useState<string | null>(null);

  const activeConsultations = appointments.filter(
    (appointment) =>
      appointment.status === "Upcoming" ||
      ["CONFIRMED", "SCHEDULED"].includes(String(appointment.status))
  );
  const consultationList = activeConsultations.length > 0 ? activeConsultations : appointments;
  const currentAppointment = consultationList[selectedAppointmentIndex] || consultationList[0] || null;
  const currentAppointmentId = currentAppointment?.id;
  const currentDoctorUserId = currentAppointment?.doctorUserId;
  const visibleMessages = messagesAppointmentId === currentAppointmentId ? chatMessages : [];
  const visibleMessageError = messageErrorAppointmentId === currentAppointmentId ? messageError : null;

  const fetchMessages = useCallback(async (signal?: AbortSignal) => {
    if (!currentAppointmentId) {
      setChatMessages([]);
      setLoadingMessages(false);
      return;
    }

    setLoadingMessages(true);
    setMessageError(null);

    const params = new URLSearchParams();
    if (currentDoctorUserId) {
      params.set("partnerId", currentDoctorUserId);
    } else {
      params.set("appointmentId", currentAppointmentId);
    }

    try {
      const res = await fetch(`/api/messages?${params.toString()}`, { signal });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch messages");

      const formatted = Array.isArray(data.messages)
        ? data.messages.flatMap((message: unknown): ConsultationMessage[] => {
            if (typeof message !== "object" || message === null || !("content" in message) || typeof message.content !== "string") {
              return [];
            }
            const time =
              "time" in message && typeof message.time === "string"
                ? message.time
                : "createdAt" in message && typeof message.createdAt === "string"
                  ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "";
            return [{
              sender: "senderRole" in message && message.senderRole === "DOCTOR" ? "doctor" : "patient",
              text: message.content,
              time,
            }];
          })
        : [];
      setChatMessages(formatted);
      setMessagesAppointmentId(currentAppointmentId);
      setMessageError(null);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("Could not load consultation messages:", err);
      setMessageError(err instanceof Error ? err.message : "Failed to fetch messages");
      setMessageErrorAppointmentId(currentAppointmentId);
    } finally {
      if (!signal?.aborted) setLoadingMessages(false);
    }
  }, [currentAppointmentId, currentDoctorUserId]);

  useEffect(() => {
    if (!currentAppointmentId) return;

    const controller = new AbortController();
    const initialFetch = window.setTimeout(() => void fetchMessages(controller.signal), 0);
    const interval = window.setInterval(() => void fetchMessages(controller.signal), 5000);
    return () => {
      controller.abort();
      window.clearTimeout(initialFetch);
      window.clearInterval(interval);
    };
  }, [currentAppointmentId, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAppointment || !inputMessage.trim() || sending) return;
    if (!currentAppointment.doctorUserId) {
      toast.error("This appointment is not linked to a doctor messaging account.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: currentAppointment.doctorUserId,
          appointmentId: currentAppointment.id,
          content: inputMessage.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setInputMessage("");
      toast.success("Message sent to doctor");
      void fetchMessages();
    } catch (err) {
      console.error("Could not send consultation message:", err);
      toast.error(err instanceof Error ? err.message : "Failed to send message");
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
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
            Clinical Consultations
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Appointments and messages associated with {userName}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
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

      {consultationList.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-10 border border-slate-200/80 dark:border-slate-700/80 text-center">
          <CalendarCheck className="size-10 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">You have no appointments to show.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Appointments ({consultationList.length})
            </h3>
            {consultationList.map((appointment, index) => (
              <button
                key={appointment.id}
                type="button"
                onClick={() => setSelectedAppointmentIndex(index)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  currentAppointment?.id === appointment.id
                    ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20"
                    : "bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80"
                }`}
              >
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{appointment.specialty}</span>
                <h4 className="mt-1 font-extrabold text-slate-900 dark:text-white">{appointment.doctorName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Building2 className="size-3" />
                  {appointment.hospitalName || "Hospital not specified"}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><CalendarCheck className="size-3.5" />{appointment.date}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3.5" />{appointment.time}</span>
                </div>
              </button>
            ))}
          </section>

          <section className="lg:col-span-7 bg-white dark:bg-slate-800/90 rounded-[28px] border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col h-[600px] overflow-hidden">
            <header className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{currentAppointment?.doctorName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{currentAppointment?.specialty}</p>
              </div>
            </header>

            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {visibleMessageError && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{visibleMessageError}</p>}
              {loadingMessages && visibleMessages.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading messages…</p>
              )}
              {!loadingMessages && visibleMessages.length === 0 && !visibleMessageError && (
                <p className="text-sm text-slate-500 dark:text-slate-400">No messages in this conversation yet.</p>
              )}
              {visibleMessages.map((message, index) => {
                const isPatient = message.sender === "patient";
                return (
                  <div key={`${index}-${message.time}`} className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}>
                    <p className={`max-w-md p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isPatient
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm"
                    }`}>
                      {message.text}
                    </p>
                    {message.time && <span className="text-[10px] text-slate-400 mt-1 px-1">{message.time}</span>}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${currentAppointment?.doctorName}...`}
                disabled={!currentAppointment?.doctorUserId || sending}
                className="flex-1 h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!currentAppointment?.doctorUserId || !inputMessage.trim() || sending}
                className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </form>
          </section>
        </div>
      )}
    </motion.div>
  );
}

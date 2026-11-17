"use client";

import React, { useState } from "react";
import { 
  X, 
  PhoneCall, 
  Siren, 
  MapPin, 
  ShieldAlert, 
  User, 
  Phone, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Building2,
  HeartPulse
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Doctor } from "@/types";
import type { Appointment } from "@/types";

interface EmergencyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor?: Doctor | null;
  patientName?: string;
  initialReason?: string;
  onBookingSuccess?: (appointment: Appointment, emergencyToken: string) => void;
}

export function EmergencyBookingModal({
  isOpen,
  onClose,
  doctor,
  patientName: initialPatientName = "Patient",
  initialReason,
  onBookingSuccess,
}: EmergencyBookingModalProps) {
  const [patientName, setPatientName] = useState(initialPatientName);
  const [patientContact, setPatientContact] = useState("");
  const [reasonOverride, setReasonOverride] = useState<string | null>(null);
  const reason = reasonOverride ?? initialReason ?? "";
  const [loading, setLoading] = useState(false);
  const [confirmedToken, setConfirmedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const assignedDoctorId = doctor?.id || "";
  const doctorDisplayName = doctor?.user?.name || "Doctor not selected";
  const hospitalName = doctor?.hospitalName || "Hospital not specified";

  const handleConfirmEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedDoctorId) {
      toast.error("Select an available doctor before submitting this request.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: assignedDoctorId,
          date: "Today",
          startTime: "Immediate",
          disease: reason,
          patientContact,
          isEmergency: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const token = data.emergencyToken || data.appointment?.tokenNumber;
        if (typeof token !== "string" || !token) {
          throw new Error("Emergency request was saved without a queue token. Please contact the clinic.");
        }
        setConfirmedToken(token);
        toast.success(`🚨 Emergency priority token ${token} confirmed!`, {
          duration: 6000,
        });
        if (onBookingSuccess) {
          onBookingSuccess(data.appointment, token);
        }
      } else {
        toast.error(data.error || "Failed to confirm emergency admission.");
      }
    } catch (err) {
      console.error("Emergency booking failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit emergency booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialHotline = (number: string, label: string) => {
    toast.info(`Calling ${label}: ${number}`, { duration: 4000 });
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[32px] border border-rose-200/80 dark:border-rose-900/50 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header with Emergency Red Styling */}
        <div className="px-6 pt-6 pb-4 border-b border-rose-100 dark:border-rose-900/40 flex items-center justify-between shrink-0 bg-rose-50/70 dark:bg-rose-950/30">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-rose-100 dark:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Siren className="size-5 animate-pulse text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-[10px] font-extrabold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                  <HeartPulse className="size-3" /> EMERGENCY FAST-TRACK
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Priority Queue Jump
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                Emergency Priority Admission
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immediate OPD chamber slot with real-time doctor alert
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Life-threatening Warning Disclaimer */}
        <div className="bg-rose-500/10 dark:bg-rose-950/40 px-6 py-2.5 border-b border-rose-200/80 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300 font-medium shrink-0">
          <ShieldAlert className="size-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>
            Critical condition? If unresponsive, having stroke signs, or severe trauma, call <strong>108 / 112</strong> immediately.
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!confirmedToken ? (
            <form onSubmit={handleConfirmEmergency} className="space-y-5">
              {/* Direct ER Hotlines Quick Dial */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <PhoneCall className="size-3.5 text-rose-600" /> Direct Hotlines:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDialHotline("108", "Ambulance")}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                  >
                    <span>🚑 108 Ambulance</span>
                  </button>
                </div>
              </div>

              {/* Assigned Doctor & Chamber Details */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 via-slate-50 to-white dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-800/50 border border-blue-100 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Assigned On-Duty Specialist
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                    Doctor selected
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {doctorDisplayName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {doctorDisplayName}
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      {doctor?.specialization || "Emergency consultation"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3.5 text-slate-400" />
                    {hospitalName}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                    <MapPin className="size-3.5" />
                    Emergency booking request
                  </span>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Patient Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      required
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      required
                      type="tel"
                      value={patientContact}
                      onChange={(e) => setPatientContact(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Acute Symptoms / Reason for Emergency Visit
                  </label>
                  <textarea
                    required
                    rows={2}
                    data-testid="emergency-reason-input"
                    value={reason}
                    onChange={(e) => setReasonOverride(e.target.value)}
                    placeholder="Describe sudden symptoms, severe pain location, or duration..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Zero-Payment Barrier Callout */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Payment: <strong>Pay on Arrival (₹2,000)</strong>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                  Zero Upfront Friction
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  data-testid="emergency-cancel-btn"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  data-testid="confirm-emergency-booking-btn"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer transition-colors"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Siren className="size-4" />
                  )}
                  <span>Confirm Fast-Track Emergency Admission</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation & Live Radar Success Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 text-center space-y-5"
            >
              <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <CheckCircle2 className="size-9" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Priority Queue Assigned
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">
                  Emergency Admission Confirmed!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
                  Your emergency appointment request has been recorded. Follow the clinic&apos;s instructions for your next steps.
                </p>
              </div>

              {/* Generated Emergency Token Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-rose-50/40 dark:from-slate-800 dark:via-slate-800 dark:to-rose-950/30 border-2 border-rose-500 text-slate-900 dark:text-white shadow-sm space-y-2">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  Your Emergency Priority Token
                </span>
                <div
                  data-testid="emergency-confirmed-token-badge"
                  className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 tracking-tight"
                >
                  {confirmedToken}
                </div>
                <div className="flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <span>Room and waiting time will be confirmed by the clinic.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  data-testid="emergency-close-btn"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-colors"
                >
                  <Activity className="size-4" />
                  <span>View Live Queue Radar</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

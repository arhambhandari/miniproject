"use client";

import React from "react";
import { 
  X, 
  Printer, 
  Download, 
  QrCode, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Calendar, 
  User, 
  Heart,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Appointment } from "@/types";

interface DigitalOPDPassModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export function DigitalOPDPassModal({ appointment, onClose }: DigitalOPDPassModalProps) {
  const handlePrint = () => {
    toast.success("Sending OPD Pass to printer...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownload = () => {
    toast.success("OPD E-Pass downloaded to your device as PDF.");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Top Decorative Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 relative">
            <button
              onClick={onClose}
              aria-label="Close pass"
              className="absolute top-5 right-5 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-widest">
                Official E-Pass
              </span>
              <span className="text-[10px] font-semibold text-blue-200">
                UHID: MB-98412
              </span>
            </div>

            <h3 className="text-xl font-black tracking-tight">
              Hospital OPD Entry & Token Pass
            </h3>
            <p className="text-xs text-blue-100/90 mt-0.5">
              {appointment.hospitalName || "Apollo Specialty Hospital, Mumbai"}
            </p>
          </div>

          {/* Token & Room Highlight Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Queue Token Number
              </span>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-0.5 tracking-tight">
                {appointment.tokenNumber || "Token #A-08"}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Chamber / Room
              </span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {appointment.roomNumber || "OPD Chamber 304"}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                3rd Floor, Wing B
              </span>
            </div>
          </div>

          {/* Body Pass Details */}
          <div className="p-6 space-y-5">
            {/* Patient & Doctor Matrix */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Patient Name
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                  {appointment.patientName || "Rahul Sharma"}
                </span>
                <span className="text-slate-500 text-[11px]">
                  Age 38 • Male • Blood A+
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Consulting Doctor
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">
                  {appointment.doctorName}
                </span>
                <span className="text-blue-600 dark:text-blue-400 text-[11px] font-medium">
                  {appointment.specialty}
                </span>
              </div>
            </div>

            {/* Date, Time & Fee */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {appointment.date}
                  </span>
                  <span className="text-slate-500 block text-[11px]">
                    Reporting: 15 mins prior
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="size-4 text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {appointment.time}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 block text-[11px] font-bold">
                    Paid: {appointment.fee || "₹1,500"}
                  </span>
                </div>
              </div>
            </div>

            {/* High-Res QR Code / Kiosk Scanner Mockup */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-center">
              <div className="flex justify-center mb-2">
                {/* Simulated SVG QR Matrix */}
                <div className="p-2.5 bg-white rounded-xl shadow-sm inline-block border border-slate-200">
                  <svg className="size-24 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="10" y="10" width="25" height="25" rx="3" />
                    <rect x="15" y="15" width="15" height="15" fill="white" />
                    <rect x="18" y="18" width="9" height="9" />
                    <rect x="65" y="10" width="25" height="25" rx="3" />
                    <rect x="70" y="15" width="15" height="15" fill="white" />
                    <rect x="73" y="73" width="9" height="9" />
                    <rect x="10" y="65" width="25" height="25" rx="3" />
                    <rect x="15" y="70" width="15" height="15" fill="white" />
                    <rect x="18" y="73" width="9" height="9" />
                    <rect x="42" y="15" width="8" height="8" />
                    <rect x="42" y="30" width="14" height="8" />
                    <rect x="15" y="42" width="12" height="12" />
                    <rect x="35" y="45" width="10" height="10" />
                    <rect x="52" y="45" width="8" height="18" />
                    <rect x="65" y="45" width="12" height="12" />
                    <rect x="42" y="70" width="14" height="8" />
                    <rect x="65" y="65" width="25" height="25" rx="3" />
                    <rect x="70" y="70" width="15" height="15" fill="white" />
                    <rect x="73" y="18" width="9" height="9" />
                  </svg>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Scan at Hospital Kiosk Counter 4
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Present this barcode on arrival for express check-in and queue activation
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="size-3.5 text-slate-500" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Download className="size-3.5" />
              <span>Save Pass</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

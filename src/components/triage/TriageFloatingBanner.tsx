"use client";

import React from "react";
import { Sparkles, ArrowRight, Stethoscope, ShieldCheck, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

interface TriageFloatingBannerProps {
  onOpenTriage: () => void;
}

export function TriageFloatingBanner({ onOpenTriage }: TriageFloatingBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-950/90 text-white p-5 sm:p-6 border border-blue-500/30 shadow-xl"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 shrink-0">
            <HeartPulse className="size-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-300" /> AI Clinical Pre-Triage
              </span>
              <span className="text-[10px] font-semibold text-slate-300 hidden sm:inline">
                Instant OPD Matching
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Feeling unwell? Identify the right specialist before booking
            </h3>
            <p className="text-xs text-blue-200/80 max-w-xl">
              Answer 3 quick questions about your symptoms. Our clinical engine determines urgency, recommends the ideal department (Cardiology, Neuro, Oncology, etc.), and pre-fills your appointment.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <motion.button
            data-testid="open-triage-modal-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenTriage}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Stethoscope className="size-4 text-blue-100" />
            <span>Start Symptom Pre-Triage</span>
            <ArrowRight className="size-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

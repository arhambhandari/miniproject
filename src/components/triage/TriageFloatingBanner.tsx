"use client";

import React from "react";
import { Sparkles, ArrowRight, Stethoscope, HeartPulse, Siren, Bot } from "lucide-react";
import { motion } from "framer-motion";

interface TriageFloatingBannerProps {
  onOpenTriage: () => void;
  onOpenEmergency?: () => void;
  onOpenAIChat?: () => void;
}

export function TriageFloatingBanner({ onOpenTriage, onOpenEmergency, onOpenAIChat }: TriageFloatingBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-white dark:from-slate-800/95 dark:via-slate-800 dark:to-blue-950/30 p-5 sm:p-6 border border-blue-200/70 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Ambient background glow matching dashboard theme */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-600/10 dark:bg-blue-900/30 border border-blue-200/80 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
            <HeartPulse className="size-6 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" /> AI Clinical Pre-Triage
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                Instant OPD Matching
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
              Feeling unwell? Identify the right specialist before booking
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Answer 3 quick questions about your symptoms. Our clinical engine determines urgency, recommends the ideal department (Cardiology, Neuro, Oncology, etc.), and pre-fills your appointment.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2.5">
          {onOpenAIChat && (
            <motion.button
              data-testid="banner-ai-chat-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAIChat}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Bot className="size-4 text-indigo-600 dark:text-indigo-400" />
              <span>Ask AI Guide</span>
            </motion.button>
          )}

          {onOpenEmergency && (
            <motion.button
              data-testid="open-emergency-modal-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenEmergency}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Siren className="size-4 text-rose-600 dark:text-rose-400 animate-pulse" />
              <span>Emergency SOS</span>
            </motion.button>
          )}

          <motion.button
            data-testid="open-triage-modal-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenTriage}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Stethoscope className="size-4 text-white" />
            <span>Start Symptom Pre-Triage</span>
            <ArrowRight className="size-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

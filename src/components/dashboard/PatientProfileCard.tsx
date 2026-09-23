"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Edit3,
  Share2,
  AlertTriangle,
  ShieldCheck,
  HeartHandshake,
  Check,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageContext";

interface PatientProfileCardProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onOpenSettings?: () => void;
}

export function PatientProfileCard({
  userName = "Rahul Sharma",
  userEmail = "rahul.sharma@example.com",
  userImage,
  onOpenSettings,
}: PatientProfileCardProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const abhaId = "91-4820-9841-2026";
  const uhid = "MB-98412";

  const handleCopyHealthID = () => {
    const text = `PATIENT PROFILE:\nName: ${userName}\nEmail: ${userEmail}\nABHA Health ID: ${abhaId}\nUHID: ${uhid}\nBlood Group: A(II) Rh+\nDate of Birth: 17.07.1986\nKnown Allergies: Penicillin, Sulfa\nCaregiver Contact: Priya Sharma (Wife) (+91 98765 00000)\nInsurance: Star Health Optima (TPA Synced)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(
        language === "hi"
          ? "मरीज स्वास्थ्य प्रोफ़ाइल और ABHA आईडी कॉपी की गई।"
          : "Patient Health Profile & ABHA ID copied to clipboard."
      );
    } else {
      toast.success(language === "hi" ? "प्रोफ़ाइल कॉपी की गई।" : "Patient Health Profile copied.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-[28px] bg-white dark:bg-slate-800/90 p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <UserCheck className="size-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t("medical_profile")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="size-3 text-emerald-600" />
            {language === "hi" ? "ABHA सिंक" : "ABHA Synced"}
          </span>
          {onOpenSettings && (
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={onOpenSettings}
              title={t("settings")}
              className="size-7 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ml-1"
            >
              <Edit3 className="size-3.5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Patient Avatar & Name */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-700/70">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative size-14 rounded-2xl overflow-hidden ring-4 ring-blue-50 dark:ring-blue-900/40 shadow-sm shrink-0"
        >
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-0.5 right-0.5 size-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
            {userName}
          </h3>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {t("verified_patient")}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            UHID: <span className="font-mono font-medium text-slate-600 dark:text-slate-300">{uhid}</span> • Mumbai
          </p>
        </div>
      </div>

      {/* Health Vitals Summary Pills */}
      <div className="grid grid-cols-3 gap-2 my-3.5 text-center">
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">
            Date Birth
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            17.07.86
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">
            Blood
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            A(II) Rh+
          </span>
        </div>
        <div
          className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2 relative group cursor-pointer"
          title="Blood Pressure is doctor-controlled and can only be updated by your physician"
          onClick={() => toast.info("🔒 Blood Pressure can only be measured and updated by your attending doctor.")}
        >
          <span className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center justify-center gap-0.5 font-medium">
            <Lock className="size-2.5 text-blue-500" /> BP (Doctor)
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            120/80
          </span>
        </div>
      </div>

      {/* Clinical & Caregiver Profile Details */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <AlertTriangle className="size-3 text-amber-500" /> Drug Allergies:
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md text-[11px]">
            Penicillin, Sulfa
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <HeartHandshake className="size-3 text-blue-500" /> Caregiver Contact:
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate max-w-[130px]" title="Priya Sharma (Wife)">
            Priya Sharma (Wife)
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Insurance Coverage:
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
            Star Health (Active)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenSettings}
          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Edit3 className="size-3.5" />
          <span>Edit Profile</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyHealthID}
          className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="size-3.5 text-slate-500" />
              <span>Share Health ID</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

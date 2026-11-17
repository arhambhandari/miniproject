"use client";

import React from "react";
import { Edit3, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

interface PatientProfileCardProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onOpenSettings?: () => void;
}

export function PatientProfileCard({
  userName = "Patient",
  userEmail = "",
  userImage,
  onOpenSettings,
}: PatientProfileCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-[28px] bg-white dark:bg-slate-800/90 p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
    >
      <div className="flex items-center gap-1.5 mb-4">
        <UserCheck className="size-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t("medical_profile")}
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="size-14 rounded-2xl overflow-hidden ring-4 ring-blue-50 dark:ring-blue-900/40 shadow-sm shrink-0">
          {userImage ? (
            <img src={userImage} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{userName}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail || "Email not available"}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Personal and clinical details appear here when they are saved to your account.
      </p>

      {onOpenSettings && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenSettings}
          className="w-full mt-4 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Edit3 className="size-3.5" />
          <span>{t("settings")}</span>
        </motion.button>
      )}
    </motion.div>
  );
}

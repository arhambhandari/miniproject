"use client";

import React from "react";
import { Search, Bell, MessageSquare, Menu, Stethoscope, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageContext";
import { motion } from "framer-motion";

interface DoctorTopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  doctorName?: string;
  specialization?: string;
  onOpenMobileMenu?: () => void;
  onOpenChat?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  activeTab?: string;
}

export function DoctorTopBar({
  searchQuery,
  setSearchQuery,
  doctorName = "Doctor",
  specialization = "Specialist Physician",
  onOpenMobileMenu,
  onOpenChat,
  onOpenNotifications,
  onOpenProfile,
}: DoctorTopBarProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      {/* Mobile Menu Button & Title */}
      <div className="flex items-center gap-3 md:hidden">
        {onOpenMobileMenu && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-sm"
          >
            <Menu className="size-5" />
          </motion.button>
        )}
        <span className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
          <Stethoscope className="size-5 text-blue-600" />
          MediBook
        </span>
      </div>

      {/* Search Input matching patient dashboard design */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <div className="relative flex-1 transition-transform duration-200 focus-within:scale-[1.01]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("doctor_search_placeholder")}
            className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {t("clear")}
            </motion.button>
          )}
        </div>
        <span className="hidden sm:inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full shrink-0">
          {t("doctor_practice_portal")}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <LanguageSwitcher />
        <ThemeToggle />

        {/* Message Bubble Shortcut */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenChat}
          className="size-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm relative cursor-pointer"
          title="Patient Consultations & Chat"
        >
          <MessageSquare className="size-4" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-amber-400 rounded-full animate-ping" />
        </motion.button>

        {/* Notification Bell with Badge */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpenNotifications}
          className="size-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm relative cursor-pointer"
          title="Activity Center"
        >
          <Bell className="size-4" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
        </motion.button>

        {/* Doctor Identity Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenProfile}
          className="hidden md:flex items-center gap-2.5 pl-2 cursor-pointer group"
          title="Click to view and edit Practice Profile"
        >
          <div className="size-11 rounded-2xl bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 transition-colors">
            {doctorName.replace(/^Dr\.\s*/, "").charAt(0) || "D"}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}
              </span>
              <ShieldCheck className="size-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400">
              {specialization}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

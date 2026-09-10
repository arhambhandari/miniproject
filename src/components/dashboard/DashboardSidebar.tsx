"use client";

import React from "react";
import Link from "next/link";
import {
  HeartPulse,
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Activity,
  PlusCircle,
  Bell,
  Settings,
  LogOut,
  Stethoscope
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking?: () => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  onOpenBooking,
}: DashboardSidebarProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: "overview", label: t("dashboard"), icon: LayoutDashboard },
    { id: "appointments", label: t("appointments"), icon: CalendarCheck },
    { id: "consultations", label: t("consultations"), icon: MessageSquare },
    { id: "records", label: t("medical_records"), icon: Activity },
    { id: "doctors", label: t("find_doctors"), icon: Stethoscope },
  ];

  return (
    <aside className="w-20 lg:w-24 bg-blue-600 dark:bg-blue-700 text-white rounded-[32px] p-3.5 sm:p-4 flex flex-col items-center shadow-xl shadow-blue-500/10 shrink-0 transition-all">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <motion.div whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className="size-11 sm:size-12 rounded-2xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all group backdrop-blur-sm"
            title="MediBook Home"
          >
            <HeartPulse className="size-6 text-white group-hover:scale-110 transition-transform" />
          </Link>
        </motion.div>
        <span className="text-[10px] font-bold tracking-wider text-blue-100 uppercase text-center hidden lg:block">
          MediBook
        </span>
      </div>

      {/* Main Navigation Icons */}
      <nav className="flex flex-col items-center gap-2.5 my-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative size-11 sm:size-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer group ${
                isActive
                  ? "text-blue-600 shadow-md shadow-black/10"
                  : "text-blue-100/80 hover:text-white hover:bg-white/15"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarNav"
                  className="absolute inset-0 bg-white rounded-2xl"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <Icon className="size-5 relative z-10 transition-transform group-hover:scale-110" />
              {isActive && (
                <span className="absolute -right-1 w-1.5 h-4 bg-white rounded-l-full z-10" />
              )}
            </motion.button>
          );
        })}

        {/* Quick Book Appointment Action */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (onOpenBooking) onOpenBooking();
            else setActiveTab("doctors");
          }}
          title={t("book_appointment")}
          className="size-11 sm:size-12 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-blue-600 flex items-center justify-center transition-colors cursor-pointer mt-1 group border border-white/20"
        >
          <PlusCircle className="size-5" />
        </motion.button>
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-2 pt-3 border-t border-blue-500/40 w-full mt-1">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab("notifications")}
          title={t("notifications")}
          className={`size-10 sm:size-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer relative ${
            activeTab === "notifications"
              ? "bg-white text-blue-600"
              : "text-blue-100 hover:text-white hover:bg-white/15"
          }`}
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-emerald-400 rounded-full ring-2 ring-blue-600 animate-pulse" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab("settings")}
          title={t("settings")}
          className={`size-10 sm:size-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === "settings"
              ? "bg-white text-blue-600"
              : "text-blue-100 hover:text-white hover:bg-white/15"
          }`}
        >
          <Settings className="size-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => signOut({ callbackUrl: "/" })}
          title={t("logout")}
          className="size-10 sm:size-11 rounded-xl flex items-center justify-center text-blue-200 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer"
        >
          <LogOut className="size-5" />
        </motion.button>
      </div>
    </aside>
  );
}

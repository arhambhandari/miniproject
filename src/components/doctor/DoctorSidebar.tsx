"use client";

import React from "react";
import Link from "next/link";
import {
  HeartPulse,
  CalendarCheck,
  Pill,
  MessageSquare,
  Building2,
  LogOut,
  Stethoscope,
  PlusCircle,
  Bell
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

interface DoctorSidebarProps {
  activeTab: string;
  setActiveTab: (tab: "appointments" | "patients" | "chat" | "profile") => void;
  onQuickPrescribe?: () => void;
  doctorName?: string;
  patientCount?: number;
}

export function DoctorSidebar({
  activeTab,
  setActiveTab,
  onQuickPrescribe,
  doctorName = "Doctor",
  patientCount = 0,
}: DoctorSidebarProps) {
  const navItems = [
    { id: "appointments" as const, label: "Appointments & Queue", icon: CalendarCheck },
    { id: "patients" as const, label: "Patient Care & Prescriptions", icon: Pill, badge: patientCount > 0 ? patientCount : undefined },
    { id: "chat" as const, label: "Patient Consultations & Chat", icon: MessageSquare, isLive: true },
    { id: "profile" as const, label: "OPD Clinic & Profile", icon: Building2 },
  ];

  return (
    <aside className="w-20 lg:w-24 bg-blue-600 dark:bg-blue-700 text-white rounded-[32px] p-4 flex flex-col items-center justify-between shadow-xl shadow-blue-500/10 shrink-0 transition-all">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <motion.div whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className="size-12 rounded-2xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all group backdrop-blur-sm"
            title="MediBook Home"
          >
            <Stethoscope className="size-6 text-white group-hover:scale-110 transition-transform" />
          </Link>
        </motion.div>
        <span className="text-[10px] font-bold tracking-wider text-blue-100 uppercase text-center hidden lg:block">
          MediBook
        </span>
      </div>

      {/* Main Navigation Icons */}
      <nav className="flex flex-col items-center gap-3 my-auto py-6">
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
              aria-label={item.label}
              className={`relative size-12 rounded-2xl flex items-center justify-center transition-colors cursor-pointer group ${
                isActive
                  ? "text-blue-600 shadow-md shadow-black/10"
                  : "text-blue-100/80 hover:text-white hover:bg-white/15"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDoctorSidebarNav"
                  className="absolute inset-0 bg-white rounded-2xl"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <Icon className="size-5 relative z-10 transition-transform group-hover:scale-110" />

              {/* Active Tab Right Indicator Line */}
              {isActive && (
                <span className="absolute -right-1 w-1.5 h-4 bg-white rounded-l-full z-10" />
              )}

              {/* Badge for Chat/Patients */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 size-4 bg-emerald-400 text-slate-900 rounded-full text-[9px] font-extrabold flex items-center justify-center z-20 shadow-sm">
                  {item.badge}
                </span>
              )}
              {item.isLive && (
                <span className="absolute top-1.5 right-1.5 size-2 bg-amber-400 rounded-full z-20 animate-ping" />
              )}
            </motion.button>
          );
        })}

        {/* Quick Prescribe Action Button */}
        {onQuickPrescribe && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onQuickPrescribe}
            title="Prescribe Patient Care"
            className="size-12 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-blue-600 flex items-center justify-center transition-colors cursor-pointer mt-2 group border border-white/20"
          >
            <PlusCircle className="size-5" />
          </motion.button>
        )}
      </nav>

      {/* Bottom Actions: Doctor Avatar and Sign Out */}
      <div className="flex flex-col items-center gap-3 pb-2 pt-4 border-t border-blue-500/40 w-full">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setActiveTab("profile")}
          className="size-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-sm text-white relative shadow-sm cursor-pointer transition-all"
          title={`Dr. ${doctorName} - View & Edit Practice Profile`}
        >
          {doctorName.replace(/^Dr\.\s*/, "").charAt(0) || "D"}
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-400 rounded-full ring-2 ring-blue-600 animate-pulse" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign Out of Doctor Portal"
          className="size-10 rounded-xl flex items-center justify-center text-blue-100 hover:text-white hover:bg-rose-500/30 transition-colors cursor-pointer"
        >
          <LogOut className="size-4" />
        </motion.button>
      </div>
    </aside>
  );
}

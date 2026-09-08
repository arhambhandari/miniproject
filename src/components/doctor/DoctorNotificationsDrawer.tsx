"use client";

import React, { useState } from "react";
import {
  Bell,
  X,
  CheckCheck,
  CalendarCheck,
  MessageSquare,
  Pill,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface DoctorNotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: "appointments" | "patients" | "chat" | "profile") => void;
  patientCount?: number;
  upcomingCount?: number;
}

export function DoctorNotificationsDrawer({
  isOpen,
  onClose,
  onNavigateTab,
  patientCount = 1,
  upcomingCount = 1,
}: DoctorNotificationsDrawerProps) {
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      type: "appointment",
      title: "New Confirmed Consultation",
      description: "Rahul Sharma booked OPD Chamber 304 appointment for Neurological Checkup.",
      time: "10 mins ago",
      read: false,
      tab: "appointments" as const,
    },
    {
      id: "n2",
      type: "message",
      title: "New Patient Consultation Message",
      description: "Rahul Sharma replied in the active clinical thread regarding medication instructions.",
      time: "25 mins ago",
      read: false,
      tab: "chat" as const,
    },
    {
      id: "n3",
      type: "prescription",
      title: "Prescription Sync Confirmed",
      description: "Daily Medication Tracker on patient dashboard was synchronized successfully.",
      time: "1 hour ago",
      read: true,
      tab: "patients" as const,
    },
    {
      id: "n4",
      type: "queue",
      title: "OPD Token #A-08 Ready",
      description: "Nurse triage completed; vital signs recorded for today's OPD session.",
      time: "2 hours ago",
      read: true,
      tab: "appointments" as const,
    },
  ]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All doctor notifications marked as read.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ x: 380, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 380, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Bell className="size-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                Activity Center
                {unreadCount > 0 && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">Clinical updates and OPD notifications</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline p-1 cursor-pointer"
                title="Mark all read"
              >
                <CheckCheck className="size-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => {
            const Icon =
              n.type === "appointment"
                ? CalendarCheck
                : n.type === "message"
                ? MessageSquare
                : n.type === "prescription"
                ? Pill
                : Sparkles;

            const iconColor =
              n.type === "appointment"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                : n.type === "message"
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300"
                : n.type === "prescription"
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
                : "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300";

            return (
              <div
                key={n.id}
                onClick={() => {
                  onNavigateTab(n.tab);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                  n.read
                    ? "bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                    : "bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900 shadow-sm hover:border-blue-300 text-slate-900 dark:text-white"
                }`}
              >
                <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                  <Icon className="size-4.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-xs truncate group-hover:text-blue-600 transition-colors">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {n.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    View in {n.tab.charAt(0).toUpperCase() + n.tab.slice(1)} <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Encrypted Hospital OPD Alerts</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Activity Center"
            className="font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Close Activity Center
          </button>
        </div>
      </motion.div>
    </div>
  );
}

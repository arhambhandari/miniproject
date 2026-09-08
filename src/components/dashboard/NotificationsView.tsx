"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  Pill,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "appointment" | "report" | "billing" | "message" | "medication";
  read: boolean;
  actionText?: string;
  actionHref?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Upcoming In-Clinic Consultation in 2 Hours",
    description: "Dr. Aarav Mehta is ready for your scheduled Neuro-Oncology follow-up at OPD Chamber 304, AIIMS Super Specialty Hospital, New Delhi.",
    timestamp: "10 minutes ago",
    type: "appointment",
    read: false,
    actionText: "View Details",
  },
  {
    id: "notif_2",
    title: "Complete Blood Count (CBC) Report Ready",
    description: "Metropolis Pathology Lab uploaded your CBC and Lipid profile results. Normal range verified.",
    timestamp: "2 hours ago",
    type: "report",
    read: false,
    actionText: "View Report",
  },
  {
    id: "notif_3",
    title: "Prescription Refill Reminder",
    description: "Your Atorvastatin 20mg supply has approximately 5 days remaining. Renew or consult your physician.",
    timestamp: "Yesterday, 4:15 PM",
    type: "medication",
    read: true,
    actionText: "Request Refill",
  },
  {
    id: "notif_4",
    title: "Consultation Payment Confirmed",
    description: "Payment of ₹2,000 via UPI (Razorpay) for consultation with Dr. Aarav Mehta was successful.",
    timestamp: "2 days ago",
    type: "billing",
    read: true,
    actionText: "Receipt #MB-8291",
  },
  {
    id: "notif_5",
    title: "New Note from Dr. Rajesh Iyer",
    description: "'Patient should continue 30 mins brisk walking daily and log BP readings once per morning.'",
    timestamp: "3 days ago",
    type: "message",
    read: true,
    actionText: "Open Chat",
  },
];

interface NotificationsViewProps {
  onReturnToOverview: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export function NotificationsView({
  onReturnToOverview,
  onNavigateToTab,
}: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "appointment" | "report">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "appointment") return item.type === "appointment";
    if (filter === "report") return item.type === "report";
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
      toast.success("Notification inbox cleared");
    }
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteItem = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "appointment":
        return <Calendar className="size-5 text-blue-600 dark:text-blue-400" />;
      case "report":
        return <FileText className="size-5 text-indigo-600 dark:text-indigo-400" />;
      case "billing":
        return <CreditCard className="size-5 text-emerald-600 dark:text-emerald-400" />;
      case "medication":
        return <Pill className="size-5 text-amber-600 dark:text-amber-400" />;
      case "message":
        return <MessageSquare className="size-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Bell className="size-5 text-blue-600" />;
    }
  };

  const handleAction = (item: NotificationItem) => {
    markItemAsRead(item.id);
    if (item.type === "appointment" && onNavigateToTab) {
      onNavigateToTab("appointments");
    } else if (item.type === "report" && onNavigateToTab) {
      onNavigateToTab("records");
    } else if (item.type === "message" && onNavigateToTab) {
      onNavigateToTab("consultations");
    } else {
      toast.info(`Opened: ${item.title}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 mt-4"
    >
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Bell className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
                    Notifications & Activity Center
                  </h2>
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white animate-pulse">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Stay updated on appointments, lab reports, doctor messages, and prescriptions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <motion.button
              whileHover={{ x: -2 }}
              onClick={onReturnToOverview}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer mr-3"
            >
              ← Back to Dashboard
            </motion.button>
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                <CheckCheck className="size-3.5 text-blue-600" />
                Mark all read
              </motion.button>
            )}
            {notifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                Clear
              </motion.button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="size-3.5" /> Filter:
          </span>
          {[
            { id: "all", label: `All (${notifications.length})` },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "appointment", label: "Appointments" },
            { id: "report", label: "Lab Reports" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="mt-6 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700"
              >
                <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 className="size-6" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">
                  You are all caught up!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  No new notifications matching this filter. We will notify you when a doctor responds or a report is ready.
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    item.read
                      ? "bg-white dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60"
                      : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/90 dark:border-blue-900/50 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="size-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-medium">
                        <Clock className="size-3" />
                        <span>{item.timestamp}</span>
                        <span>•</span>
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {item.actionText && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <span>{item.actionText}</span>
                        <ArrowRight className="size-3" />
                      </motion.button>
                    )}
                    {!item.read && (
                      <button
                        onClick={() => markItemAsRead(item.id)}
                        title="Mark as read"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <CheckCheck className="size-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteItem(item.id)}
                      title="Dismiss notification"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Live Notification Channels Quick Banner */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 border border-blue-200/60 dark:border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                Multi-Channel Real-time Alerts Active
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You receive instant WhatsApp, SMS, and Push notifications for all doctor appointments.
              </p>
            </div>
          </div>
          {onNavigateToTab && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigateToTab("settings")}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Configure in Settings →
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

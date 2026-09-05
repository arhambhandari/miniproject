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
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments", icon: CalendarCheck },
    { id: "consultations", label: "Consultations", icon: MessageSquare },
    { id: "records", label: "Medical Records", icon: Activity },
    { id: "doctors", label: "Find Doctors", icon: Stethoscope },
  ];

  return (
    <aside className="w-20 lg:w-24 bg-blue-600 dark:bg-blue-700 text-white rounded-[32px] p-4 flex flex-col items-center justify-between shadow-xl shadow-blue-500/10 shrink-0 transition-all">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <Link
          href="/"
          className="size-12 rounded-2xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all group backdrop-blur-sm"
          title="MediBook Home"
        >
          <HeartPulse className="size-6 text-white group-hover:scale-110 transition-transform" />
        </Link>
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
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative size-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer group ${
                isActive
                  ? "bg-white text-blue-600 shadow-md shadow-black/10 scale-105"
                  : "text-blue-100/80 hover:text-white hover:bg-white/15"
              }`}
            >
              <Icon className="size-5 transition-transform group-hover:scale-110" />
              {isActive && (
                <span className="absolute -right-1 w-1.5 h-4 bg-white rounded-l-full" />
              )}
            </button>
          );
        })}

        {/* Quick Book Appointment Action */}
        <button
          onClick={() => {
            if (onOpenBooking) onOpenBooking();
            else setActiveTab("doctors");
          }}
          title="Book Appointment"
          className="size-12 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-blue-600 flex items-center justify-center transition-all cursor-pointer mt-2 group border border-white/20"
        >
          <PlusCircle className="size-5 group-hover:rotate-90 transition-transform" />
        </button>
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3 pb-2 pt-4 border-t border-blue-500/40 w-full">
        <button
          onClick={() => setActiveTab("notifications")}
          title="Notifications"
          className={`size-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer relative ${
            activeTab === "notifications"
              ? "bg-white text-blue-600"
              : "text-blue-100 hover:text-white hover:bg-white/15"
          }`}
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-emerald-400 rounded-full ring-2 ring-blue-600" />
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          title="Settings"
          className={`size-11 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === "settings"
              ? "bg-white text-blue-600"
              : "text-blue-100 hover:text-white hover:bg-white/15"
          }`}
        >
          <Settings className="size-5" />
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Log Out"
          className="size-11 rounded-xl flex items-center justify-center text-blue-200 hover:text-red-200 hover:bg-red-500/20 transition-all cursor-pointer mt-1"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </aside>
  );
}

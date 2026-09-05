"use client";

import React from "react";
import { Search, Bell, MessageSquare, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardTopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userName?: string;
  userImage?: string;
  onOpenMobileMenu?: () => void;
}

export function DashboardTopBar({
  searchQuery,
  setSearchQuery,
  userName = "Patient",
  userImage,
  onOpenMobileMenu,
}: DashboardTopBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      {/* Mobile Menu Button & Title */}
      <div className="flex items-center gap-3 md:hidden">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-sm"
          >
            <Menu className="size-5" />
          </button>
        )}
        <span className="font-bold text-lg text-slate-900 dark:text-white">
          MediBook
        </span>
      </div>

      {/* Search Input matching reference image */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for events, doctors, appointments..."
          className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <ThemeToggle />

        {/* Message Bubble Icon */}
        <button
          className="size-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm cursor-pointer"
          title="Direct Consultations"
        >
          <MessageSquare className="size-4" />
        </button>

        {/* Notification Bell with Badge */}
        <button
          className="size-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
        </button>

        {/* Profile Pill / Avatar */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2">
          <div className="relative size-10 rounded-xl overflow-hidden bg-blue-100 dark:bg-blue-900/40 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-sm">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
            <span className="absolute bottom-0.5 right-0.5 size-2 bg-emerald-500 rounded-full ring-1.5 ring-white dark:ring-slate-800" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {userName}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Verified Patient
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

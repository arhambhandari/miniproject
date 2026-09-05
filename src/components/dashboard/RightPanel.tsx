"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Clock,
  Video,
  UserCheck,
  CalendarCheck,
  XCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import type { Appointment } from "@/types";

interface RightPanelProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  appointments: Appointment[];
  onCancelAppointment?: (id: string) => void;
  onBookDoctor?: () => void;
}

export function RightPanel({
  userName = "Rahul Sharma",
  userEmail = "rahul@example.com",
  userImage,
  appointments = [],
  onCancelAppointment,
  onBookDoctor,
}: RightPanelProps) {
  // Days of the week strip
  const [selectedDay, setSelectedDay] = useState(13); // Default Monday 13th

  const weekDays = [
    { day: "Sun", date: 12 },
    { day: "Mon", date: 13 },
    { day: "Tue", date: 14 },
    { day: "Wed", date: 15 },
    { day: "Thu", date: 16 },
    { day: "Fri", date: 17 },
    { day: "Sat", date: 18 },
  ];

  return (
    <div className="w-full xl:w-80 2xl:w-88 flex flex-col gap-5 shrink-0">
      {/* 1. MY PROFILE Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            My Profile
          </span>
          <button
            title="Edit Profile"
            className="size-7 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <Edit2 className="size-3.5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center text-center">
          <div className="relative size-18 rounded-2xl overflow-hidden ring-4 ring-blue-50 dark:ring-blue-900/40 shadow-md">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-1 right-1 size-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
          </div>

          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-3">
            {userName}
          </h3>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Verified Patient
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Mumbai, India
          </p>

          {/* 3 Quick Details Pills (Date of Birth, Blood, Hours) */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/70 w-full text-center">
            <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block font-medium">
                Date Birth
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                17.07.86
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block font-medium">
                Blood
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                A(II) Rh+
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block font-medium">
                Hours
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                9am - 5pm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MY CALENDAR Strip */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            My Calendar
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mr-2">
              October 2026
            </span>
            <button className="size-6 rounded-md bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
              <ChevronLeft className="size-3.5" />
            </button>
            <button className="size-6 rounded-md bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Days Strip */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((item) => {
            const isSelected = selectedDay === item.date;
            return (
              <button
                key={item.date}
                onClick={() => setSelectedDay(item.date)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold scale-105"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
                <span className="text-[10px] uppercase font-semibold opacity-75">
                  {item.day}
                </span>
                <span className="text-xs font-extrabold">{item.date}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TODAY'S SCHEDULE / TIMELINE */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Schedule • Oct {selectedDay}
            </span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              {appointments.filter(a => a.status === "Upcoming").length} upcoming
            </span>
          </div>

          {/* Timeline List matching the inspiration screenshot */}
          <div className="space-y-3.5">
            {appointments.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                <CalendarCheck className="size-8 text-slate-300 mx-auto mb-2" />
                No appointments for this date.
              </div>
            ) : (
              appointments.slice(0, 4).map((app, idx) => (
                <div
                  key={app.id}
                  className="relative pl-4 border-l-2 border-blue-500/60 dark:border-blue-400/60 group hover:border-blue-600 transition-colors"
                >
                  <span
                    className={`absolute -left-[5px] top-1 size-2 rounded-full ring-2 ring-white dark:ring-slate-800 ${
                      app.status === "Upcoming"
                        ? "bg-blue-600"
                        : app.status === "Completed"
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {app.time || "10:00 AM"}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        app.status === "Upcoming"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : app.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
                    Consultation with {app.doctorName}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400">
                    {app.specialty}
                  </p>

                  {/* Actions */}
                  {app.status === "Upcoming" && (
                    <div className="flex items-center gap-2 mt-2">
                      <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                        <Video className="size-3" /> Join Call
                      </button>
                      {onCancelAppointment && (
                        <button
                          onClick={() => onCancelAppointment(app.id)}
                          className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-md"
                        >
                          <XCircle className="size-3" /> Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Button at bottom */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/70 mt-4">
          <button
            onClick={onBookDoctor}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Book New Appointment</span>
            <ExternalLink className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

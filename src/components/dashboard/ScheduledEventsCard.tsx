"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ScheduledEventsCardProps {
  consultationsCount?: number;
  labCount?: number;
  meetingsCount?: number;
  completionRate?: number;
}

export function ScheduledEventsCard({
  consultationsCount = 25,
  labCount = 10,
  meetingsCount = 3,
  completionRate = 95,
}: ScheduledEventsCardProps) {
  const [timeRange, setTimeRange] = useState("Today");

  // Circular progress calculations for SVG donut
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-[26px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          My Scheduled Events
        </h2>
        <div className="relative">
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-100 transition-colors">
            <span>{timeRange}</span>
            <ChevronDown className="size-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Content: Ring & Legend */}
      <div className="flex items-center justify-around gap-4 py-2">
        {/* SVG Circular Progress Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="size-28 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100 dark:text-slate-700/60"
              strokeWidth="9"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Ring with soft gradient */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="60%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text in Ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {completionRate}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
              Completed
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="size-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
            <div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                {consultationsCount}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                Consultations
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="size-2.5 rounded-full bg-cyan-500 mt-1 shrink-0" />
            <div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                {labCount}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                Laboratory analyzes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="size-2.5 rounded-full bg-purple-500 mt-1 shrink-0" />
            <div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                {meetingsCount}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
                Follow-up meetings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

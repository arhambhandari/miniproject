"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

interface PlansCardProps {
  onAddPlan?: () => void;
}

export function PlansCard({ onAddPlan }: PlansCardProps) {
  const [timeRange, setTimeRange] = useState("Today");

  const plans = [
    {
      title: "Consultations",
      percent: 64,
      barColor: "bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Analysis & Diagnostics",
      percent: 50,
      barColor: "bg-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Follow-up Meetings",
      percent: 33,
      barColor: "bg-rose-500",
      textColor: "text-rose-500 dark:text-rose-400",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-[26px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          My Plans Done
        </h2>
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-100 transition-colors">
          <span>{timeRange}</span>
          <ChevronDown className="size-3 text-slate-400" />
        </button>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-4 py-1">
        {plans.map((plan) => (
          <div key={plan.title} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">
                {plan.title}
              </span>
              <span className={plan.textColor}>{plan.percent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/70 rounded-full overflow-hidden">
              <div
                className={`h-full ${plan.barColor} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${plan.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan Action Button */}
      <div className="pt-3 text-center">
        <button
          onClick={onAddPlan}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors py-1 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add plan</span>
        </button>
      </div>
    </div>
  );
}

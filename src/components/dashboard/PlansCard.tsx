"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Check, Calendar, X, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PlanItem {
  id: string;
  title: string;
  percent: number;
  completedText: string;
  barColor: string;
  textColor: string;
}

const PLANS_BY_RANGE: Record<string, PlanItem[]> = {
  Today: [
    {
      id: "consultations",
      title: "Consultations",
      percent: 64,
      completedText: "2 of 3 completed",
      barColor: "bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "diagnostics",
      title: "Analysis & Diagnostics",
      percent: 50,
      completedText: "1 of 2 tests done",
      barColor: "bg-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "followups",
      title: "Follow-up Meetings",
      percent: 33,
      completedText: "1 of 3 reviewed",
      barColor: "bg-rose-500",
      textColor: "text-rose-500 dark:text-rose-400",
    },
  ],
  "This Week": [
    {
      id: "consultations",
      title: "Consultations",
      percent: 82,
      completedText: "9 of 11 completed",
      barColor: "bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "diagnostics",
      title: "Analysis & Diagnostics",
      percent: 75,
      completedText: "6 of 8 tests done",
      barColor: "bg-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "followups",
      title: "Follow-up Meetings",
      percent: 60,
      completedText: "3 of 5 reviewed",
      barColor: "bg-rose-500",
      textColor: "text-rose-500 dark:text-rose-400",
    },
  ],
  "This Month": [
    {
      id: "consultations",
      title: "Consultations",
      percent: 91,
      completedText: "20 of 22 completed",
      barColor: "bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "diagnostics",
      title: "Analysis & Diagnostics",
      percent: 88,
      completedText: "15 of 17 tests done",
      barColor: "bg-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "followups",
      title: "Follow-up Meetings",
      percent: 80,
      completedText: "8 of 10 reviewed",
      barColor: "bg-rose-500",
      textColor: "text-rose-500 dark:text-rose-400",
    },
  ],
  "This Year": [
    {
      id: "consultations",
      title: "Consultations",
      percent: 96,
      completedText: "48 of 50 completed",
      barColor: "bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "diagnostics",
      title: "Analysis & Diagnostics",
      percent: 94,
      completedText: "32 of 34 tests done",
      barColor: "bg-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "followups",
      title: "Follow-up Meetings",
      percent: 90,
      completedText: "18 of 20 reviewed",
      barColor: "bg-rose-500",
      textColor: "text-rose-500 dark:text-rose-400",
    },
  ],
};

const TIME_RANGES = ["Today", "This Week", "This Month", "This Year"] as const;

interface PlansCardProps {
  onAddPlan?: () => void;
}

export function PlansCard({ onAddPlan }: PlansCardProps) {
  const [timeRange, setTimeRange] = useState<string>("Today");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customPlans, setCustomPlans] = useState<Record<string, PlanItem[]>>(PLANS_BY_RANGE);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New plan form state
  const [newTitle, setNewTitle] = useState("");
  const [newPercent, setNewPercent] = useState("50");
  const [newColor, setNewColor] = useState("blue");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activePlans = customPlans[timeRange] || customPlans["Today"];

  const handleSelectRange = (range: string) => {
    setTimeRange(range);
    setIsDropdownOpen(false);
    toast.info(`Showing plans for ${range}`);
  };

  const handleIncrementProgress = (planId: string) => {
    setCustomPlans((prev) => {
      const currentList = prev[timeRange] || [];
      const updated = currentList.map((p) => {
        if (p.id === planId) {
          const nextVal = Math.min(100, p.percent + 10);
          return { ...p, percent: nextVal };
        }
        return p;
      });
      return { ...prev, [timeRange]: updated };
    });
    toast.success("Progress updated (+10%)!");
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a plan or goal title");
      return;
    }

    const colorConfig = {
      blue: { bar: "bg-blue-600", text: "text-blue-600 dark:text-blue-400" },
      purple: { bar: "bg-purple-600", text: "text-purple-600 dark:text-purple-400" },
      rose: { bar: "bg-rose-500", text: "text-rose-500 dark:text-rose-400" },
      emerald: { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
      amber: { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
    }[newColor] || { bar: "bg-blue-600", text: "text-blue-600 dark:text-blue-400" };

    const newItem: PlanItem = {
      id: `plan_${Date.now()}`,
      title: newTitle.trim(),
      percent: Math.min(100, Math.max(0, parseInt(newPercent) || 50)),
      completedText: "Custom health target",
      barColor: colorConfig.bar,
      textColor: colorConfig.text,
    };

    setCustomPlans((prev) => ({
      ...prev,
      [timeRange]: [...(prev[timeRange] || []), newItem],
    }));

    setNewTitle("");
    setNewPercent("50");
    setIsAddModalOpen(false);
    toast.success(`Plan "${newItem.title}" added to ${timeRange}!`);
  };

  const quickSuggestions = [
    "Daily Vitals Check",
    "Physiotherapy Exercises",
    "Medication Adherence",
    "Blood Glucose Log",
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all relative"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                My Plans Done
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {timeRange}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Routine checkups, diagnostic goals, and medical plan progress
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Add plan button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors py-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add plan</span>
            </motion.button>

            {/* Time range interactive dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <Calendar className="size-3 text-blue-600 dark:text-blue-400" />
                <span>{timeRange}</span>
                <ChevronDown
                  className={`size-3 text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700 py-1.5 z-30"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700 mb-1">
                      Select Period
                    </div>
                    {TIME_RANGES.map((range) => {
                      const isSelected = range === timeRange;
                      return (
                        <button
                          key={range}
                          onClick={() => handleSelectRange(range)}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          }`}
                        >
                          <span>{range}</span>
                          {isSelected && <Check className="size-3.5 text-blue-600 dark:text-blue-400" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Progress Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1 pb-2">
          {activePlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 transition-all hover:bg-white dark:hover:bg-slate-700/60 hover:shadow-md group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 dark:text-slate-200 font-bold">
                  {plan.title}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-extrabold text-sm ${plan.textColor}`}>
                    {plan.percent}%
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleIncrementProgress(plan.id)}
                    title="Increment progress (+10%)"
                    className="size-5 rounded-full bg-slate-200/70 dark:bg-slate-600/60 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Progress Track with smooth animated bar */}
              <div className="h-2.5 w-full bg-slate-200/80 dark:bg-slate-600/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${plan.percent}%` }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                  className={`h-full ${plan.barColor} rounded-full`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 pt-0.5">
                <span>{plan.completedText}</span>
                {plan.percent >= 100 ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                    <Check className="size-3" /> Completed
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">
                    Click + to advance
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Plan Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Add Health Plan Goal
                    </h3>
                    <p className="text-xs text-slate-400">
                      Track for {timeRange}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="size-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Plan or Goal Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Daily Blood Pressure Log"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                {/* Quick suggestions */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                    Quick Suggestions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setNewTitle(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-blue-50 hover:text-blue-600 text-slate-600 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Initial Completion % */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Initial Progress: {newPercent}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newPercent}
                    onChange={(e) => setNewPercent(e.target.value)}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Color Theme Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-3">
                    {[
                      { id: "blue", class: "bg-blue-600" },
                      { id: "purple", class: "bg-purple-600" },
                      { id: "rose", class: "bg-rose-500" },
                      { id: "emerald", class: "bg-emerald-500" },
                      { id: "amber", class: "bg-amber-500" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setNewColor(c.id)}
                        className={`size-7 rounded-full ${c.class} flex items-center justify-center transition-all cursor-pointer ${
                          newColor === c.id ? "ring-4 ring-blue-200 dark:ring-blue-900/60 scale-110" : "opacity-80"
                        }`}
                      >
                        {newColor === c.id && <Check className="size-3.5 text-white stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Save Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

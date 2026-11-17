"use client";

import React from "react";
import { CalendarCheck, FileText, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface StatCardsProps {
  completedVisits: number | null;
  upcomingConsultations: number | null;
  clinicalRecords: number | null;
}

export function StatCards({
  completedVisits,
  upcomingConsultations,
  clinicalRecords,
}: StatCardsProps) {
  const cards = [
    {
      label: "Completed visits",
      description: "Completed appointments",
      value: completedVisits,
      icon: Stethoscope,
      iconClass: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Upcoming consultations",
      description: "Scheduled appointments",
      value: upcomingConsultations,
      icon: CalendarCheck,
      iconClass: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Medical records",
      description: "Clinical records on file",
      value: clinicalRecords,
      icon: FileText,
      iconClass: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
      {cards.map(({ label, description, value, icon: Icon, iconClass }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          transition={{ duration: 0.45, delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800/90 rounded-[24px] p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className={`size-8 rounded-xl ${iconClass} flex items-center justify-center`}>
              <Icon className="size-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {label}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value === null ? "—" : <AnimatedCounter value={value} />}
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

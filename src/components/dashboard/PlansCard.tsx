"use client";

import React, { useEffect, useState } from "react";
import { ClipboardList, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

export interface TreatmentPlan {
  id: string;
  diagnosis: string | null;
  treatmentPlan: string | null;
  createdAt: string;
  doctor?: { user?: { name: string | null } | null } | null;
}

export interface PlansCardData {
  records: TreatmentPlan[];
  loading: boolean;
  error: string | null;
}

interface PlansCardProps {
  dashboardData?: PlansCardData;
}

export function PlansCard({ dashboardData }: PlansCardProps = {}) {
  const [fetchedPlans, setFetchedPlans] = useState<TreatmentPlan[]>([]);
  const [fetchedLoading, setFetchedLoading] = useState(true);
  const [fetchedError, setFetchedError] = useState<string | null>(null);
  const hasDashboardData = dashboardData !== undefined;
  const plans = hasDashboardData
    ? dashboardData.records.filter((record) => Boolean(record.treatmentPlan))
    : fetchedPlans;
  const loading = hasDashboardData ? dashboardData.loading : fetchedLoading;
  const loadError = hasDashboardData ? dashboardData.error : fetchedError;

  useEffect(() => {
    if (hasDashboardData) return;

    const controller = new AbortController();
    fetch("/api/clinical-records", { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch treatment plans");
        const records = Array.isArray(data.records) ? data.records : [];
        setFetchedPlans(records.filter((record: TreatmentPlan) => Boolean(record.treatmentPlan)));
        setFetchedError(null);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Could not load treatment plans:", err);
        setFetchedError(err instanceof Error ? err.message : "Failed to fetch treatment plans");
      })
      .finally(() => {
        if (!controller.signal.aborted) setFetchedLoading(false);
      });

    return () => controller.abort();
  }, [hasDashboardData]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="size-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Treatment Plans</h2>
      </div>

      {loadError ? (
        <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{loadError}</p>
      ) : loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading treatment plans…</p>
      ) : plans.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No treatment plans have been added to your clinical records.
        </p>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/30 p-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {plan.diagnosis || "Treatment plan"}
              </h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{plan.treatmentPlan}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Stethoscope className="size-3.5" />
                {plan.doctor?.user?.name || "Doctor"} · {new Date(plan.createdAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </motion.section>
  );
}

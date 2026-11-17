"use client";

import React, { useEffect, useState } from "react";
import { Activity, Calendar, FileText, Heart, ShieldCheck, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

interface ClinicalRecord {
  id: string;
  diagnosis: string | null;
  treatmentPlan: string | null;
  notes: string | null;
  createdAt: string;
  doctor?: { user?: { name: string | null } | null } | null;
}

interface ClinicalVitals {
  bloodPressure: string | null;
  heartRate: string | null;
  bloodSugar: string | null;
  spo2: string | null;
  weight: string | null;
  temperature: string | null;
}

interface MedicalRecordsViewProps {
  userName?: string;
  onReturnToOverview: () => void;
}

const VITAL_FIELDS: Array<{ label: string; field: keyof ClinicalVitals; unit: string; icon: React.ElementType }> = [
  { label: "Blood Pressure", field: "bloodPressure", unit: "mmHg", icon: Heart },
  { label: "Heart Rate", field: "heartRate", unit: "bpm", icon: Activity },
  { label: "Blood Glucose", field: "bloodSugar", unit: "mg/dL", icon: Activity },
  { label: "Oxygen (SpO2)", field: "spo2", unit: "%", icon: Activity },
  { label: "Weight", field: "weight", unit: "", icon: Activity },
  { label: "Temperature", field: "temperature", unit: "°F", icon: Activity },
];

export function MedicalRecordsView({ userName = "Patient", onReturnToOverview }: MedicalRecordsViewProps) {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [latestVitals, setLatestVitals] = useState<ClinicalVitals | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/clinical-records", { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch medical records");
        setRecords(Array.isArray(data.records) ? data.records : []);
        setLatestVitals(data.latestVitals ?? null);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error("Could not load medical records:", err);
        setLoadError(err instanceof Error ? err.message : "Failed to fetch medical records");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 mt-2"
    >
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Doctor-recorded clinical data
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
            Medical Records
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Clinical records and measurements saved for {userName}.
          </p>
        </div>

        <button
          onClick={onReturnToOverview}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>

      {loadError && (
        <p role="alert" className="rounded-xl bg-rose-50 dark:bg-rose-950/30 p-4 text-sm text-rose-700 dark:text-rose-300">
          {loadError}
        </p>
      )}

      <section className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Latest Recorded Vitals</h3>
        {latestVitals ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {VITAL_FIELDS.filter(({ field }) => latestVitals[field]).map(({ label, field, unit, icon: Icon }) => (
              <div key={field} className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-700/70">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <Icon className="size-4 text-blue-500" />
                  {label}
                </div>
                <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                  {latestVitals[field]} {unit}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? "Loading recorded vitals…" : "No clinical vitals have been recorded yet."}
          </p>
        )}
      </section>

      <section className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clinical History</h3>
        </div>

        {loading && records.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading clinical records…</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No clinical records have been added to your account yet.
          </p>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/30 p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {record.diagnosis || "Clinical visit"}
                  </h4>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="size-3.5" />
                    {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {record.doctor?.user?.name && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Stethoscope className="size-3.5" />
                    Recorded by {record.doctor.user.name}
                  </p>
                )}
                {record.treatmentPlan && (
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                    <strong>Treatment plan:</strong> {record.treatmentPlan}
                  </p>
                )}
                {record.notes && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{record.notes}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}

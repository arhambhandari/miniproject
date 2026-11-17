"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Activity, 
  Droplet, 
  Wind, 
  Scale, 
  Thermometer, 
  ShieldCheck,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageContext";

interface VitalMetric {
  id: string;
  field: "bloodPressure" | "heartRate" | "bloodSugar" | "spo2" | "weight" | "temperature";
  name: string;
  unit: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export interface LatestVitals {
  bloodPressure: string | null;
  heartRate: string | null;
  bloodSugar: string | null;
  spo2: string | null;
  weight: string | null;
  temperature: string | null;
  recordedAt: string | null;
  doctorName: string | null;
  diagnosis?: string | null;
}

export interface PatientVitalsCardData {
  vitals: LatestVitals | null;
  loading: boolean;
  error: string | null;
}

interface PatientVitalsCardProps {
  dashboardData?: PatientVitalsCardData;
}

const VITAL_METRICS: VitalMetric[] = [
  {
    id: "bp",
    field: "bloodPressure",
    name: "Blood Pressure",
    unit: "mmHg",
    icon: HeartPulse,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/30",
  },
  {
    id: "pulse",
    field: "heartRate",
    name: "Heart Rate",
    unit: "bpm",
    icon: Activity,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    id: "glucose",
    field: "bloodSugar",
    name: "Blood Sugar (Fasting)",
    unit: "mg/dL",
    icon: Droplet,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
  },
  {
    id: "spo2",
    field: "spo2",
    name: "Oxygen (SpO2)",
    unit: "%",
    icon: Wind,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    id: "bmi",
    field: "weight",
    name: "Body Weight",
    unit: "",
    icon: Scale,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
  },
  {
    id: "temp",
    field: "temperature",
    name: "Body Temperature",
    unit: "°F",
    icon: Thermometer,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-900/30",
  },
];

export function PatientVitalsCard({ dashboardData }: PatientVitalsCardProps = {}) {
  const { language, t } = useLanguage();
  const [fetchedVitals, setFetchedVitals] = useState<LatestVitals | null>(null);
  const [fetchedLoading, setFetchedLoading] = useState(true);
  const [fetchedError, setFetchedError] = useState<string | null>(null);
  const hasDashboardData = dashboardData !== undefined;
  const vitals = hasDashboardData ? dashboardData.vitals : fetchedVitals;
  const loading = hasDashboardData ? dashboardData.loading : fetchedLoading;
  const loadError = hasDashboardData ? dashboardData.error : fetchedError;

  const getVitalLabel = (id: string, defaultName: string) => {
    switch (id) {
      case "bp": return t("blood_pressure");
      case "pulse": return t("heart_rate");
      case "glucose": return t("blood_glucose");
      case "spo2": return t("spo2_oxygen");
      case "bmi": return t("body_mass_index");
      case "temp": return language === "hi" ? "शरीर का तापमान" : defaultName;
      default: return defaultName;
    }
  };

  useEffect(() => {
    if (hasDashboardData) return;

    const controller = new AbortController();
    fetch("/api/clinical-records", { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch clinical vitals");
        }
        setFetchedVitals(data.latestVitals ?? null);
        setFetchedError(null);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error("Could not fetch patient vitals:", err);
        setFetchedError(err instanceof Error ? err.message : "Failed to fetch clinical vitals");
      })
      .finally(() => {
        if (!controller.signal.aborted) setFetchedLoading(false);
      });

    return () => controller.abort();
  }, [hasDashboardData]);

  const handleVitalTileClick = (vitalId: string, vitalName: string) => {
    if (vitalId === "bp") {
      toast.info(
        language === "hi"
          ? "🔒 रक्तचाप (BP) केवल आपके डॉक्टर द्वारा क्लीनिकल जांच में अपडेट किया जा सकता है।"
          : "🔒 Blood Pressure is a physician-verified clinical vital. Only your consulting doctor can record or modify it.",
        { duration: 4500 }
      );
    } else {
      toast.info(
        language === "hi"
          ? `🔒 ${getVitalLabel(vitalId, vitalName)} अस्पताल क्लीनिकल रिकॉर्ड से प्रमाणित है। रोगी केवल अपनी दवाएं (Medications) लॉग कर सकते हैं; स्वास्थ्य आंकड़े केवल डॉक्टर दर्ज करते हैं।`
          : `🔒 ${vitalName} is a certified clinical health vital. Patients can only log their medications; health vitals are recorded and updated exclusively by your attending physician.`,
        { duration: 4500 }
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="size-3" /> {language === "hi" ? "डॉक्टर द्वारा दर्ज" : "Doctor-recorded measurements"}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("vitals_title")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("vitals_subtitle")}
          </p>
          {loadError && (
            <p role="alert" className="mt-2 text-xs text-rose-600 dark:text-rose-400">
              {loadError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            data-testid="vitals-doctor-recorded-badge"
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            title="Clinical health vitals are recorded exclusively by your attending physician"
          >
            <Lock className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>{language === "hi" ? "क्लीनिकल आंकड़े (केवल डॉक्टर द्वारा दर्ज)" : "Clinical Vitals (Doctor Recorded Only)"}</span>
          </span>
        </div>
      </div>

      {/* Grid of 6 Vitals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {VITAL_METRICS.map((v, i) => {
          const Icon = v.icon;
          const isBp = v.id === "bp";
          const value = vitals?.[v.field];
          const hasValue = typeof value === "string" && value.length > 0;
          const recordedAt = vitals?.recordedAt
            ? new Date(vitals.recordedAt).toLocaleString(language === "hi" ? "hi-IN" : "en-US")
            : null;
          return (
            <motion.div
              key={v.id}
              data-testid={`vital-card-${v.id}`}
              onClick={() => handleVitalTileClick(v.id, v.name)}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              title={
                isBp
                  ? "Blood pressure can only be recorded by certified doctors"
                  : "Clinical vital recorded by doctor. Click for details."
              }
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${v.bgColor} ${v.color}`}>
                  <Icon className="size-4" />
                </div>

                {isBp ? (
                  <span
                    data-testid="bp-doctor-only-badge"
                    title="Blood pressure can only be recorded by certified doctors"
                    className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs"
                  >
                    <Lock className="size-2.5 text-blue-600 dark:text-blue-400" />
                    <span>{language === "hi" ? "केवल डॉक्टर" : "Doctor Only"}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    <Lock className="size-2 text-slate-500 dark:text-slate-400" />
                    <span>{hasValue ? (language === "hi" ? "दर्ज" : "Recorded") : (language === "hi" ? "कोई रिकॉर्ड नहीं" : "No record")}</span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                    {getVitalLabel(v.id, v.name)}
                  </span>
                  <Lock className="size-2.5 text-slate-400 inline shrink-0" />
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {loading ? "…" : hasValue ? value : "—"}
                  </span>
                  {v.unit && <span className="text-[10px] font-medium text-slate-400">{v.unit}</span>}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block truncate">
                  {recordedAt || (loading ? (language === "hi" ? "लोड हो रहा है" : "Loading") : (language === "hi" ? "कोई रिकॉर्ड नहीं" : "No record"))}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {vitals?.diagnosis && (
        <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-700 dark:text-slate-200">
            <strong className="text-blue-700 dark:text-blue-400">Attending Doctor Assessment:</strong>{" "}
            {vitals.diagnosis}
          </span>
          {vitals.doctorName && (
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0 ml-2">
              — {vitals.doctorName}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

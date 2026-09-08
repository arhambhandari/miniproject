"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Activity, 
  Droplet, 
  Wind, 
  Scale, 
  Thermometer, 
  Plus, 
  CheckCircle2,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageContext";

interface VitalMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: "Normal" | "Optimal" | "Attention";
  icon: React.ElementType;
  color: string;
  bgColor: string;
  lastChecked: string;
}

const INITIAL_VITALS: VitalMetric[] = [
  {
    id: "bp",
    name: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "Normal",
    icon: HeartPulse,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/30",
    lastChecked: "Today, 9:30 AM",
  },
  {
    id: "pulse",
    name: "Heart Rate",
    value: "72",
    unit: "bpm",
    status: "Optimal",
    icon: Activity,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
    lastChecked: "Today, 9:30 AM",
  },
  {
    id: "glucose",
    name: "Blood Sugar (Fasting)",
    value: "94",
    unit: "mg/dL",
    status: "Normal",
    icon: Droplet,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
    lastChecked: "Yesterday",
  },
  {
    id: "spo2",
    name: "Oxygen (SpO2)",
    value: "99",
    unit: "%",
    status: "Optimal",
    icon: Wind,
    color: "text-blue-600 dark:blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
    lastChecked: "Today, 9:30 AM",
  },
  {
    id: "bmi",
    name: "Body Weight & BMI",
    value: "68 kg",
    unit: "22.5 BMI",
    status: "Normal",
    icon: Scale,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
    lastChecked: "Last week",
  },
  {
    id: "temp",
    name: "Body Temperature",
    value: "98.4",
    unit: "°F",
    status: "Normal",
    icon: Thermometer,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-900/30",
    lastChecked: "Today, 9:30 AM",
  },
];

export function PatientVitalsCard() {
  const { language, t } = useLanguage();
  const [vitals, setVitals] = useState<VitalMetric[]>(INITIAL_VITALS);
  const [latestDoctorInfo, setLatestDoctorInfo] = useState<{ doctorName?: string; diagnosis?: string } | null>(null);

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
    fetch("/api/clinical-records")
      .then((res) => res.json())
      .then((data) => {
        if (data?.latestVitals) {
          const lv = data.latestVitals;
          setLatestDoctorInfo({
            doctorName: lv.doctorName,
            diagnosis: lv.diagnosis,
          });

          setVitals((prev) =>
            prev.map((v) => {
              if (v.id === "bp" && lv.bloodPressure) {
                return { ...v, value: lv.bloodPressure, lastChecked: lv.doctorName ? `By ${lv.doctorName}` : "Recorded today" };
              }
              if (v.id === "pulse" && lv.heartRate) {
                return { ...v, value: lv.heartRate, lastChecked: lv.doctorName ? `By ${lv.doctorName}` : "Recorded today" };
              }
              if (v.id === "glucose" && lv.bloodSugar) {
                return { ...v, value: lv.bloodSugar, lastChecked: lv.doctorName ? `By ${lv.doctorName}` : "Recorded today" };
              }
              if (v.id === "spo2" && lv.oxygenLevel) {
                return { ...v, value: lv.oxygenLevel, lastChecked: lv.doctorName ? `By ${lv.doctorName}` : "Recorded today" };
              }
              if (v.id === "bmi" && lv.weight) {
                return { ...v, value: lv.weight, lastChecked: lv.doctorName ? `By ${lv.doctorName}` : "Recorded today" };
              }
              if (v.id === "temp" && lv.temperature) {
                return { ...v, value: lv.temperature, lastChecked: lv.doctorName ? `By ${lv.doctorName}` : "Recorded today" };
              }
              return v;
            })
          );
        }
      })
      .catch((err) => console.error("Error fetching patient vitals:", err));
  }, []);

  const handleLogVital = () => {
    toast.success(
      language === "hi"
        ? "स्वास्थ्य आंकड़े दर्ज किए गए। अस्पताल ओपीडी रिकॉर्ड के साथ सिंक किए गए।"
        : "Vitals entry recorded. Synced with hospital OPD records."
    );
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
              <ShieldCheck className="size-3" /> {language === "hi" ? "ABHA / अस्पताल रिकॉर्ड सिंक" : "ABHA / Hospital EHR Synced"}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("vitals_title")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("vitals_subtitle")}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogVital}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-3.5 text-blue-600 dark:text-blue-400" />
          <span>{language === "hi" ? "आंकड़े दर्ज करें" : "Log Vitals"}</span>
        </motion.button>
      </div>

      {/* Grid of 6 Vitals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {vitals.map((v, i) => {
          const Icon = v.icon;
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${v.bgColor} ${v.color}`}>
                  <Icon className="size-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                  {v.status === "Optimal" || v.status === "Normal" ? (language === "hi" ? "सामान्य" : v.status) : v.status}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                  {getVitalLabel(v.id, v.name)}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {v.value}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {v.unit}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">
                  {v.lastChecked}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {latestDoctorInfo?.diagnosis && (
        <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-700 dark:text-slate-200">
            <strong className="text-blue-700 dark:text-blue-400">Attending Doctor Assessment:</strong>{" "}
            {latestDoctorInfo.diagnosis}
          </span>
          {latestDoctorInfo.doctorName && (
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0 ml-2">
              — {latestDoctorInfo.doctorName}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

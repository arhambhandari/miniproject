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
  ShieldCheck,
  Lock,
  AlertCircle,
  X,
  Stethoscope,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  isDoctorOnly?: boolean;
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
    lastChecked: "Doctor Verified (OPD Exam)",
    isDoctorOnly: true,
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

  // Patient Log Vitals Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editHeartRate, setEditHeartRate] = useState("72");
  const [editBloodSugar, setEditBloodSugar] = useState("94");
  const [editSpo2, setEditSpo2] = useState("99");
  const [editWeight, setEditWeight] = useState("68");
  const [editTemp, setEditTemp] = useState("98.4");

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
    const controller = new AbortController();
    fetch("/api/clinical-records", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return { records: [], latestVitals: null };
        return res.json();
      })
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
                return { 
                  ...v, 
                  value: lv.bloodPressure, 
                  lastChecked: lv.doctorName ? `By ${lv.doctorName}` : "Doctor Verified" 
                };
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
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Could not fetch patient vitals, using defaults:", err?.message || err);
      });

    return () => controller.abort();
  }, []);

  const handleOpenLogModal = () => {
    const hr = vitals.find((v) => v.id === "pulse")?.value || "72";
    const sugar = vitals.find((v) => v.id === "glucose")?.value || "94";
    const spo2 = vitals.find((v) => v.id === "spo2")?.value || "99";
    const weight = vitals.find((v) => v.id === "bmi")?.value.replace(/[^0-9.]/g, "") || "68";
    const temp = vitals.find((v) => v.id === "temp")?.value || "98.4";
    setEditHeartRate(hr);
    setEditBloodSugar(sugar);
    setEditSpo2(spo2);
    setEditWeight(weight);
    setEditTemp(temp);
    setIsLogModalOpen(true);
  };

  const handleBpTileClick = () => {
    toast.info(
      language === "hi"
        ? "🔒 रक्तचाप (BP) केवल आपके डॉक्टर द्वारा क्लीनिकल जांच में अपडेट किया जा सकता है।"
        : "🔒 Blood Pressure is a physician-verified clinical vital. Only your consulting doctor can record or modify it.",
      { duration: 4500 }
    );
  };

  const handleSavePatientVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Intentionally omit bloodPressure to enforce doctor-only modification
      const res = await fetch("/api/patient/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heartRate: editHeartRate.trim() || "72",
          bloodSugar: editBloodSugar.trim() || "94",
          spo2: editSpo2.trim() || "99",
          weight: `${editWeight.trim()} kg`,
          temperature: editTemp.trim() || "98.4",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update vitals");
      }

      // Update patient-editable vitals in local state
      setVitals((prev) =>
        prev.map((v) => {
          if (v.id === "pulse") return { ...v, value: editHeartRate.trim() || "72", lastChecked: "Self-logged just now" };
          if (v.id === "glucose") return { ...v, value: editBloodSugar.trim() || "94", lastChecked: "Self-logged just now" };
          if (v.id === "spo2") return { ...v, value: editSpo2.trim() || "99", lastChecked: "Self-logged just now" };
          if (v.id === "bmi") return { ...v, value: `${editWeight.trim()} kg`, lastChecked: "Self-logged just now" };
          if (v.id === "temp") return { ...v, value: editTemp.trim() || "98.4", lastChecked: "Self-logged just now" };
          return v; // Blood pressure remains unchanged
        })
      );

      toast.success(
        language === "hi"
          ? "दैनिक स्वास्थ्य आंकड़े दर्ज किए गए! रक्तचाप डॉक्टर द्वारा प्रमाणित रहेगा।"
          : "Daily vitals recorded successfully! Blood pressure remains certified by your doctor."
      );
      setIsLogModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Could not save vitals");
    } finally {
      setIsSaving(false);
    }
  };

  const currentBp = vitals.find((v) => v.id === "bp")?.value || "120/80";

  return (
    <>
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
            data-testid="log-vitals-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenLogModal}
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
            const isBp = v.id === "bp";
            return (
              <motion.div
                key={v.id}
                data-testid={`vital-card-${v.id}`}
                onClick={isBp ? handleBpTileClick : undefined}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between ${
                  isBp ? "cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors" : ""
                }`}
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
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                      {v.status === "Optimal" || v.status === "Normal" ? (language === "hi" ? "सामान्य" : v.status) : v.status}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                      {getVitalLabel(v.id, v.name)}
                    </span>
                    {isBp && <Lock className="size-2.5 text-slate-400 inline shrink-0" />}
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {v.value}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {v.unit}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 block truncate">
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

      {/* PATIENT LOG VITALS MODAL */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Activity className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {language === "hi" ? "दैनिक स्वास्थ्य आंकड़े दर्ज करें" : "Log Daily Wellness Vitals"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === "hi"
                        ? "घरेलू स्वास्थ्य आंकड़े रिकॉर्ड करें। रक्तचाप केवल डॉक्टर द्वारा दर्ज होता है।"
                        : "Track your home parameters. Blood pressure is managed by your doctor."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLogModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSavePatientVitals} className="p-5 space-y-4">
                {/* DOCTOR-ONLY BP NOTICE CALLOUT */}
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shrink-0">
                    <Lock className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      {language === "hi" ? "रक्तचाप संशोधन केवल डॉक्टर द्वारा मान्य" : "Blood Pressure is Doctor-Controlled Only"}
                    </h4>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                      {language === "hi"
                        ? "अस्पताल क्लीनिकल दिशानिर्देशों के अनुसार, रक्तचाप केवल डॉक्टर द्वारा ओपीडी परामर्श के दौरान ही मापा और दर्ज किया जा सकता है।"
                        : "In accordance with clinical standards, blood pressure must be measured and entered exclusively by your certified doctor during consultations. Patients cannot alter this record."}
                    </p>
                  </div>
                </div>

                {/* FIELDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 1. Blood Pressure: LOCKED / DISABLED */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <span>Blood Pressure (mmHg)</span>
                      </label>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="size-2.5 text-amber-600" /> Locked (Doctor Only)
                      </span>
                    </div>

                    <div 
                      className="relative cursor-not-allowed group"
                      onClick={() => toast.info("🔒 Blood pressure can only be measured and recorded by your attending doctor.")}
                    >
                      <input
                        type="text"
                        value={currentBp}
                        disabled
                        readOnly
                        data-testid="patient-bp-input-locked"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed select-none"
                      />
                      <Lock className="size-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      Current clinical reading: {currentBp} mmHg • Verified by {latestDoctorInfo?.doctorName || "Attending Physician"}
                    </span>
                  </div>

                  {/* 2. Heart Rate (Patient Editable) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Heart Rate (bpm)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        data-testid="patient-hr-input"
                        value={editHeartRate}
                        onChange={(e) => setEditHeartRate(e.target.value)}
                        placeholder="72"
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <Activity className="size-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* 3. Fasting Glucose (Patient Editable) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Blood Sugar (mg/dL)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        data-testid="patient-glucose-input"
                        value={editBloodSugar}
                        onChange={(e) => setEditBloodSugar(e.target.value)}
                        placeholder="94"
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <Droplet className="size-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* 4. Oxygen SpO2 (Patient Editable) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Oxygen SpO2 (%)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        data-testid="patient-spo2-input"
                        value={editSpo2}
                        onChange={(e) => setEditSpo2(e.target.value)}
                        placeholder="99"
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <Wind className="size-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* 5. Body Weight (Patient Editable) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Body Weight (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        data-testid="patient-weight-input"
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                        placeholder="68"
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <Scale className="size-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* 6. Body Temperature (Patient Editable) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Body Temperature (°F)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        data-testid="patient-temp-input"
                        value={editTemp}
                        onChange={(e) => setEditTemp(e.target.value)}
                        placeholder="98.4"
                        className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <Thermometer className="size-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    data-testid="patient-save-vitals-btn"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span>Saving Vitals...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        <span>Save Daily Vitals</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

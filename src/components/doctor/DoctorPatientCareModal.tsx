"use client";

import React, { useState } from "react";
import {
  X,
  Pill,
  Activity,
  HeartPulse,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  User,
  Clock,
  Sparkles,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface MedicationInput {
  name: string;
  dosage: string;
  instruction: string;
  timeSlot: "Morning" | "Afternoon" | "Night";
  scheduledTime: string;
  daysRemaining: number;
}

interface DoctorPatientCareModalProps {
  patient: {
    patientId: string;
    userId?: string;
    name: string;
    email: string;
    contactNumber?: string;
    latestCondition?: string;
    appointments?: any[];
    medications?: any[];
    clinicalRecords?: any[];
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export function DoctorPatientCareModal({
  patient,
  onClose,
  onSuccess,
}: DoctorPatientCareModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"medications" | "vitals">("medications");
  const [saving, setSaving] = useState(false);

  // Medication form state
  const [medList, setMedList] = useState<MedicationInput[]>([
    {
      name: "",
      dosage: "",
      instruction: "1 tablet after meals",
      timeSlot: "Morning",
      scheduledTime: "08:00 AM",
      daysRemaining: 14,
    },
  ]);

  // Vitals & Clinical notes state
  const latestRecord = patient.clinicalRecords?.[0] || {};
  const [diagnosis, setDiagnosis] = useState(latestRecord.diagnosis || "");
  const [treatmentPlan, setTreatmentPlan] = useState(latestRecord.treatmentPlan || "");
  const [notes, setNotes] = useState(latestRecord.notes || "");
  const [bloodPressure, setBloodPressure] = useState(latestRecord.bloodPressure || "120/80");
  const [heartRate, setHeartRate] = useState(latestRecord.heartRate || "72");
  const [bloodSugar, setBloodSugar] = useState(latestRecord.bloodSugar || "94");
  const [spo2, setSpo2] = useState(latestRecord.spo2 || "99");
  const [weight, setWeight] = useState(latestRecord.weight || "68 kg");
  const [temperature, setTemperature] = useState(latestRecord.temperature || "98.4");

  const handleAddMedicationRow = () => {
    setMedList((prev) => [
      ...prev,
      {
        name: "",
        dosage: "",
        instruction: "Take as directed",
        timeSlot: "Morning",
        scheduledTime: "08:00 AM",
        daysRemaining: 14,
      },
    ]);
  };

  const handleRemoveMedRow = (idx: number) => {
    setMedList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const validMeds = medList.filter((m) => m.name.trim() && m.dosage.trim());

      // 1. Save valid medications
      for (const med of validMeds) {
        await fetch("/api/medications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: patient.patientId,
            name: med.name,
            dosage: med.dosage,
            instruction: med.instruction,
            timeSlot: med.timeSlot,
            scheduledTime: med.scheduledTime,
            daysRemaining: med.daysRemaining,
          }),
        });
      }

      // 2. Save clinical records and vitals
      await fetch("/api/clinical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.patientId,
          diagnosis,
          treatmentPlan,
          notes,
          bloodPressure,
          heartRate,
          bloodSugar,
          spo2,
          weight,
          temperature,
        }),
      });

      toast.success(
        `Clinical care plan and ${validMeds.length} prescription(s) updated for ${patient.name}!`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving patient clinical care:", err);
      toast.error("Failed to save clinical care data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Stethoscope className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Clinical Care & Prescriptions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Patient: <span className="font-bold text-slate-800 dark:text-slate-200">{patient.name}</span> • {patient.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-2 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveSubTab("medications")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 cursor-pointer transition-colors ${
              activeSubTab === "medications"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Pill className="size-4" />
            <span>Prescribe Medications</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("vitals")}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 cursor-pointer transition-colors ${
              activeSubTab === "vitals"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Activity className="size-4" />
            <span>Diagnosis & Clinical Vitals</span>
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: MEDICATIONS */}
          {activeSubTab === "medications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Active Prescriptions for Patient Dashboard
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    These medications appear in the patient&apos;s Daily Medication Tracker.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicationRow}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>

              {medList.map((med, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Pill className="size-3.5 text-blue-600" />
                      Medication #{idx + 1}
                    </span>
                    {medList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedRow(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Remove row"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMedList((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                          );
                        }}
                        placeholder="e.g. Atorvastatin"
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMedList((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, dosage: val } : item))
                          );
                        }}
                        placeholder="e.g. 20 mg / 1 tablet"
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Time Slot
                      </label>
                      <select
                        value={med.timeSlot}
                        onChange={(e) => {
                          const val = e.target.value as "Morning" | "Afternoon" | "Night";
                          const defaultTimes = {
                            Morning: "08:00 AM",
                            Afternoon: "01:30 PM",
                            Night: "09:00 PM",
                          };
                          setMedList((prev) =>
                            prev.map((item, i) =>
                              i === idx
                                ? { ...item, timeSlot: val, scheduledTime: defaultTimes[val] }
                                : item
                            )
                          );
                        }}
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Morning">Morning (8:00 AM)</option>
                        <option value="Afternoon">Afternoon (1:30 PM)</option>
                        <option value="Night">Night (9:00 PM)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Instructions / Intake advice
                      </label>
                      <input
                        type="text"
                        value={med.instruction}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMedList((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, instruction: val } : item
                            )
                          );
                        }}
                        placeholder="e.g. 1 tablet after breakfast for cholesterol control"
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Days Supply
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={med.daysRemaining}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 14;
                          setMedList((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, daysRemaining: val } : item
                            )
                          );
                        }}
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: DIAGNOSIS & VITALS */}
          {activeSubTab === "vitals" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Clinical Diagnosis & Examination Notes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Synchronizes with the patient&apos;s Clinical Health Vitals card and medical records.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Clinical Diagnosis
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Stage 1 Essential Hypertension, Mild Hyperlipidemia"
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Treatment Plan & Doctor Advice
                  </label>
                  <textarea
                    rows={2}
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    placeholder="e.g. Low sodium DASH diet, 30 min daily brisk walking, avoid high-fat meals."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Activity className="size-3.5 text-emerald-500" />
                  Recorded Biometric Vitals
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Blood Pressure (mmHg)
                      </label>
                      <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        Doctor Only
                      </span>
                    </div>
                    <input
                      type="text"
                      data-testid="doctor-bp-input"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      placeholder="120/80"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="text"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="72"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Fasting Glucose (mg/dL)
                    </label>
                    <input
                      type="text"
                      value={bloodSugar}
                      onChange={(e) => setBloodSugar(e.target.value)}
                      placeholder="94"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Oxygen SpO2 (%)
                    </label>
                    <input
                      type="text"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      placeholder="99"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Body Weight (kg)
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="68 kg"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Body Temp (°F)
                    </label>
                    <input
                      type="text"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="98.4"
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="size-4" />
              <span>{saving ? "Updating Patient Care..." : "Save to Patient Dashboard"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

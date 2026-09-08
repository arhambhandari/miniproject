"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Activity, 
  Heart, 
  Droplet, 
  ShieldCheck, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  Pill
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface MedicalRecordsViewProps {
  userName?: string;
  onReturnToOverview: () => void;
}

export function MedicalRecordsView({ userName = "Rahul Sharma", onReturnToOverview }: MedicalRecordsViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "lab" | "prescription">("all");

  const vitals = [
    { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: Activity, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/30", status: "Optimal" },
    { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/30", status: "Normal" },
    { label: "Blood Group", value: "A(II) Rh+", unit: "", icon: Droplet, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/30", status: "Verified" },
    { label: "Blood Glucose", value: "94", unit: "mg/dL", icon: Activity, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30", status: "Fasting Normal" },
  ];

  const records = [
    {
      id: "rec_1",
      type: "lab",
      title: "Comprehensive Metabolic & CBC Panel",
      category: "Laboratory Analysis",
      doctor: "Dr. Aarav Mehta",
      hospital: "AIIMS Super Specialty Hospital, New Delhi",
      date: "Oct 08, 2026",
      status: "Completed",
      result: "Hemoglobin 14.5 g/dL • Normal electrolyte balance",
      size: "1.4 MB PDF",
    },
    {
      id: "rec_2",
      type: "prescription",
      title: "Neurological Care Prescription & Therapy Plan",
      category: "Prescription",
      doctor: "Dr. Aarav Mehta",
      hospital: "AIIMS Super Specialty Hospital, New Delhi",
      date: "Sep 25, 2026",
      status: "Active",
      result: "Oral Neuro-protective supplement (Daily morning)",
      size: "820 KB PDF",
    },
    {
      id: "rec_3",
      type: "lab",
      title: "Lipid Profile & Cardiovascular Biomarkers",
      category: "Laboratory Analysis",
      doctor: "Dr. Rajesh Iyer",
      hospital: "Fortis Escorts Heart Institute, New Delhi",
      date: "Sep 12, 2026",
      status: "Completed",
      result: "Total Cholesterol: 172 mg/dL • HDL: 56 mg/dL • Normal",
      size: "2.1 MB PDF",
    },
    {
      id: "rec_4",
      type: "lab",
      title: "Diagnostic Cranial MRI Scan Summary",
      category: "Radiology & Imaging",
      doctor: "Dr. Vikramaditya Rathore",
      hospital: "Tata Memorial Centre, Mumbai",
      date: "Sep 01, 2026",
      status: "Verified",
      result: "No structural acute abnormalities detected",
      size: "4.8 MB PDF",
    },
  ];

  const filteredRecords = records.filter(r => selectedFilter === "all" || r.type === selectedFilter);

  const handleDownload = (recordTitle: string) => {
    toast.success(`Downloading encrypted record: ${recordTitle}`);
  };

  const handleUploadNew = () => {
    toast.info("Upload portal ready. You can attach PDFs or lab scans from your doctor.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 mt-2"
    >
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> 256-bit Encrypted Health Vault
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
            Medical Health Records
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Patient history, verified laboratory analyses, and active prescriptions for {userName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUploadNew}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Upload className="size-4" /> Upload Record
          </button>
          <button
            onClick={onReturnToOverview}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Vital Metrics Grid (Matching Main Dashboard Vitals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((vital, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{vital.label}</span>
              <div className={`p-2 rounded-xl ${vital.bg} ${vital.color}`}>
                <vital.icon className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{vital.value}</span>
              {vital.unit && <span className="text-xs font-medium text-slate-400">{vital.unit}</span>}
            </div>
            <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              ✓ {vital.status}
            </span>
          </div>
        ))}
      </div>

      {/* Records Filter & List */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Diagnostic Reports & Documents</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">19 total laboratory analyses synchronized with your health profile</p>
          </div>
          
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {[
              { id: "all", label: "All Documents" },
              { id: "lab", label: "Lab Reports" },
              { id: "prescription", label: "Prescriptions" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Record Cards */}
        <div className="space-y-3.5">
          {filteredRecords.map((r) => (
            <div
              key={r.id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                  {r.type === "lab" ? <FileText className="size-5" /> : <Pill className="size-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{r.category}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="size-3" /> {r.date}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      {r.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{r.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    Verified by <span className="font-bold text-slate-700 dark:text-slate-300">{r.doctor}</span> ({r.hospital})
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 shrink-0" /> {r.result}
                  </p>
                </div>
              </div>

              <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">{r.size}</span>
                <button
                  onClick={() => handleDownload(r.title)}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-3.5" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

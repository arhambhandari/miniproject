"use client";

import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  Clock, 
  ShieldAlert, 
  Stethoscope, 
  Search, 
  CalendarCheck, 
  Building2, 
  Star, 
  HelpCircle,
  Loader2,
  Check,
  Siren
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { AVAILABLE_SYMPTOMS, type SymptomDefinition, type TriageEvaluationResult } from "@/lib/triageRules";
import type { Doctor } from "@/types";

interface SymptomTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookDoctor: (doctor: Doctor, triageSummary: string) => void;
  onBookEmergency?: (triageSummary: string) => void;
}

export function SymptomTriageModal({
  isOpen,
  onClose,
  onBookDoctor,
  onBookEmergency,
}: SymptomTriageModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [duration, setDuration] = useState<string>("1-3days");
  const [severity, setSeverity] = useState<string>("MODERATE");
  const [customNotes, setCustomNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageEvaluationResult | null>(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);

  if (!isOpen) return null;

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const filteredSymptoms = AVAILABLE_SYMPTOMS.filter((sym) => {
    const matchesCategory = activeCategory === "ALL" || sym.category === activeCategory;
    const matchesSearch =
      !searchQuery || sym.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAnalyzeTriage = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom to analyze.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          duration,
          severity,
          notes: customNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.triage) {
        setTriageResult(data.triage);
        setRecommendedDoctors(data.recommendedDoctors || []);
        setStep(3);
      } else {
        toast.error(data.error || "Failed to analyze symptoms.");
      }
    } catch (err) {
      console.error("Triage analysis error:", err);
      toast.error("Network error analyzing symptoms.");
    } finally {
      setLoading(false);
    }
  };

  const resetTriage = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setCustomNotes("");
    setTriageResult(null);
    setRecommendedDoctors([]);
  };

  const getTriageSummaryText = () => {
    if (!triageResult) return "Clinical Pre-Triage Assessment";
    const symptomsLabels = selectedSymptoms
      .map((id) => AVAILABLE_SYMPTOMS.find((s) => s.id === id)?.label || id)
      .join(", ");
    return `Triage: ${triageResult.department} (${triageResult.urgency}) - Symptoms: ${symptomsLabels} (${duration})`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh]"
      >
        {/* Modal Header matching MediBook design system */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  <Stethoscope className="size-3" /> Clinical Pre-Triage
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Step {step} of 3
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                AI Clinical Symptom Pre-Triage
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Intelligent department mapping & specialist triage recommendations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Clinical Disclaimer */}
        <div className="bg-amber-50/80 dark:bg-amber-950/30 px-6 py-2.5 border-b border-amber-100 dark:border-amber-900/40 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-medium shrink-0">
          <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            For triage guidance only. In acute life-threatening emergencies, dial 108 / 112 immediately.
          </span>
        </div>

        {/* Modal Body with Step Wizard */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SYMPTOMS SELECTION */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  What primary symptoms are you experiencing?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select all that apply. Our clinical engine will determine the relevant hospital department.
                </p>
              </div>

              {/* Search Symptoms */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search symptoms (e.g., chest, headache, cough, joint)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {["ALL", "CARDIAC", "NEURO", "RESPIRATORY", "ORTHO", "ONCO", "GENERAL"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeCategory === cat
                          ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms Chip Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {filteredSymptoms.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym.id);
                  return (
                    <button
                      key={sym.id}
                      data-testid={`symptom-chip-${sym.id}`}
                      onClick={() => toggleSymptom(sym.id)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-100 shadow-xs ring-1 ring-blue-500/30 font-bold"
                          : "bg-slate-50/50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                          }`}
                        >
                          {isSelected && <Check className="size-3" />}
                        </span>
                        <span className="text-xs font-bold">{sym.label}</span>
                      </div>

                      {sym.isRedFlag && (
                        <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                          Priority
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom notes input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Additional Notes / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Describe when symptoms occur, associated discomfort, or any prior history..."
                  className="w-full p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Step 1 Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {selectedSymptoms.length} symptoms selected
                </span>
                <button
                  data-testid="triage-next-step-btn"
                  onClick={() => {
                    if (selectedSymptoms.length === 0) {
                      toast.error("Please select at least one symptom.");
                      return;
                    }
                    setStep(2);
                  }}
                  disabled={selectedSymptoms.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer transition-colors"
                >
                  <span>Next: Severity & Duration</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DURATION & SEVERITY */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  How long have these symptoms persisted and how severe are they?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Helps differentiate acute urgent needs from routine clinical appointments.
                </p>
              </div>

              {/* Duration Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Symptom Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "<24h", label: "Under 24 Hours", sub: "Acute onset" },
                    { id: "1-3days", label: "1 to 3 Days", sub: "Recent onset" },
                    { id: "1-2weeks", label: "1 to 2 Weeks", sub: "Subacute" },
                    { id: "chronic", label: "Over 1 Month", sub: "Chronic condition" },
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      data-testid={`duration-btn-${dur.id}`}
                      onClick={() => setDuration(dur.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        duration === dur.id
                          ? "bg-blue-50/90 dark:bg-blue-950/40 border-blue-600 text-blue-950 dark:text-blue-100 shadow-xs ring-1 ring-blue-500"
                          : "bg-slate-50/60 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-blue-300"
                      }`}
                    >
                      <div className="font-bold text-xs">{dur.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {dur.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Severity Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "MILD",
                      label: "Mild Discomfort",
                      desc: "Able to perform routine daily activities normally.",
                      badge: "Routine",
                      color: "text-emerald-600 dark:text-emerald-400",
                    },
                    {
                      id: "MODERATE",
                      label: "Moderate Impact",
                      desc: "Disrupts work or sleep, requiring medical review.",
                      badge: "Specialist OPD",
                      color: "text-amber-600 dark:text-amber-400",
                    },
                    {
                      id: "SEVERE",
                      label: "Severe / Acute",
                      desc: "Incapacitating, severe pain, or rapidly worsening.",
                      badge: "Priority Review",
                      color: "text-rose-600 dark:text-rose-400",
                    },
                  ].map((sev) => (
                    <button
                      key={sev.id}
                      data-testid={`severity-btn-${sev.id}`}
                      onClick={() => setSeverity(sev.id)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                        severity === sev.id
                          ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 shadow-xs ring-2 ring-blue-500/20"
                          : "bg-slate-50/50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-black text-sm ${sev.color}`}>{sev.label}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {sev.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {sev.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="size-4" /> Back to Symptoms
                </button>

                <button
                  data-testid="analyze-symptoms-btn"
                  onClick={handleAnalyzeTriage}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-colors"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4 text-amber-300" />
                  )}
                  <span>Analyze Clinical Symptoms</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CLINICAL TRIAGE REPORT & MATCHING DOCTORS */}
          {step === 3 && triageResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Emergency Banner if applicable */}
              {triageResult.emergencyWarning && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900 dark:text-rose-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <strong className="block text-rose-700 dark:text-rose-300 font-extrabold text-sm mb-0.5">
                        Emergency Clinical Warning
                      </strong>
                      <span className="text-rose-800 dark:text-rose-200 font-medium leading-relaxed">
                        {triageResult.emergencyWarning}
                      </span>
                    </div>
                  </div>

                  {onBookEmergency && (
                    <button
                      data-testid="triage-emergency-booking-btn"
                      onClick={() => {
                        onBookEmergency(getTriageSummaryText());
                        onClose();
                      }}
                      className="shrink-0 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 cursor-pointer transition-colors"
                    >
                      <Siren className="size-3.5 animate-pulse" />
                      <span>Book Emergency Priority Token</span>
                      <ArrowRight className="size-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Department Recommendation Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white dark:from-slate-800/90 dark:via-slate-800 dark:to-blue-950/40 border border-blue-200/80 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Recommended Department
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      triageResult.urgency === "EMERGENCY"
                        ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse"
                        : triageResult.urgency === "URGENT_OPD"
                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    }`}
                  >
                    {triageResult.urgencyLabel}
                  </span>
                </div>

                <div
                  data-testid="triage-recommended-department"
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                >
                  {triageResult.department}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {triageResult.clinicalRationale}
                </p>
              </div>

              {/* Suggested Questions for OPD */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="size-3.5 text-blue-600 dark:text-blue-400" /> Suggested Questions for your Doctor
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {triageResult.suggestedQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Specialists List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Stethoscope className="size-4 text-blue-600 dark:text-blue-400" />
                    Available Specialists in {triageResult.department}
                  </h5>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {recommendedDoctors.length} available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendedDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center text-sm ring-1 ring-blue-100 dark:ring-blue-800 shrink-0">
                              {doc.user?.name ? doc.user.name.replace(/^Dr\.\s*/i, "").charAt(0).toUpperCase() : "D"}
                            </div>
                            <div>
                              <h6 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                                {doc.user?.name || "Dr. Specialist"}
                              </h6>
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold block">
                                {doc.specialization}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                            ₹{doc.fee || 1500}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pl-1">
                          <Building2 className="size-3 text-slate-400" />
                          <span>{doc.hospitalName || "Apollo Specialty Hospital"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 pl-1">
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="size-3 fill-amber-500 text-amber-500" /> {doc.satisfaction || 98}%
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-blue-500" /> {doc.nextAvailable || "Today"}
                          </span>
                        </div>
                      </div>

                      <button
                        data-testid="triage-book-doctor-btn"
                        onClick={() => {
                          onBookDoctor(doc, getTriageSummaryText());
                          onClose();
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        <CalendarCheck className="size-3.5" />
                        <span>Book with Pre-Filled Triage</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3 Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={resetTriage}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Start New Triage
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors border border-slate-200/80 dark:border-slate-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

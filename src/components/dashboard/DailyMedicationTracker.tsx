"use client";

import React, { useState, useEffect } from "react";
import { 
  Pill, 
  Check, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Sparkles, 
  CalendarCheck2,
  X,
  CheckCircle2,
  Utensils,
  NotebookPen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageContext";

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  instruction: string;
  timeSlot: "Morning" | "Afternoon" | "Night";
  scheduledTime: string;
  taken: boolean;
  takenAt?: string;
  daysRemaining: number;
  note?: string;
}

const INITIAL_MEDICATIONS: MedicationItem[] = [
  {
    id: "med_1",
    name: "Atorvastatin",
    dosage: "20 mg",
    instruction: "1 tablet after breakfast for cholesterol control",
    timeSlot: "Morning",
    scheduledTime: "08:00 AM",
    taken: true,
    takenAt: "08:15 AM",
    daysRemaining: 5,
  },
  {
    id: "med_2",
    name: "Vitamin D3",
    dosage: "60,000 IU",
    instruction: "1 softgel post-lunch for bone & immune health",
    timeSlot: "Afternoon",
    scheduledTime: "01:30 PM",
    taken: true,
    takenAt: "01:45 PM",
    daysRemaining: 24,
  },
  {
    id: "med_3",
    name: "Telmisartan",
    dosage: "40 mg",
    instruction: "1 tablet at bedtime for blood pressure maintenance",
    timeSlot: "Night",
    scheduledTime: "09:00 PM",
    taken: false,
    daysRemaining: 18,
  },
];

export function DailyMedicationTracker() {
  const { language, t } = useLanguage();
  const [medications, setMedications] = useState<MedicationItem[]>(INITIAL_MEDICATIONS);
  const [loading, setLoading] = useState(true);

  // Patient Log Medication Dose Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState<string>(INITIAL_MEDICATIONS[2]?.id || INITIAL_MEDICATIONS[0]?.id || "");
  const [logTime, setLogTime] = useState<string>("");
  const [mealTiming, setMealTiming] = useState<string>("After Meal");
  const [patientNote, setPatientNote] = useState<string>("");
  const [isSavingDose, setIsSavingDose] = useState(false);

  const getTimeSlotLabel = (slot: string) => {
    if (slot === "Morning") return t("dose_morning");
    if (slot === "Afternoon") return t("dose_afternoon");
    if (slot === "Night") return t("dose_night");
    return slot;
  };

  // Fetch live doctor-prescribed medications from DB
  const loadMedications = (signal?: AbortSignal) => {
    fetch("/api/medications", { signal })
      .then((res) => {
        if (!res.ok) return { medications: [] };
        return res.json();
      })
      .then((data) => {
        if (data?.medications && Array.isArray(data.medications) && data.medications.length > 0) {
          setMedications(data.medications);
          const firstUntaken = data.medications.find((m: any) => !m.taken);
          if (firstUntaken) {
            setSelectedMedId(firstUntaken.id);
          } else {
            setSelectedMedId(data.medications[0].id);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Could not load medications, using offline/cached data:", err?.message || err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    loadMedications(controller.signal);
    return () => controller.abort();
  }, []);

  const openLogModalForMed = (id?: string) => {
    if (id) {
      setSelectedMedId(id);
    } else {
      const untaken = medications.find((m) => !m.taken);
      if (untaken) setSelectedMedId(untaken.id);
      else if (medications[0]) setSelectedMedId(medications[0].id);
    }
    setLogTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setMealTiming("After Meal");
    setPatientNote("");
    setIsLogModalOpen(true);
  };

  const handleToggleTaken = async (id: string) => {
    const currentMed = medications.find((m) => m.id === id);
    const nowTaken = currentMed ? !currentMed.taken : true;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMedications((prev) =>
      prev.map((med) => {
        if (med.id !== id) return med;
        if (nowTaken) {
          toast.success(
            language === "hi"
              ? `${med.name} ${med.dosage} ली गई चिह्नित!`
              : `Marked ${med.name} ${med.dosage} as taken at ${timeNow}`
          );
          return {
            ...med,
            taken: true,
            takenAt: timeNow,
          };
        } else {
          toast.info(
            language === "hi"
              ? `${med.name} की खुराक रद्द की गई`
              : `Undid dose for ${med.name}`
          );
          return {
            ...med,
            taken: false,
            takenAt: undefined,
          };
        }
      })
    );

    // Persist to database
    try {
      await fetch("/api/medications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, taken: nowTaken, takenAt: nowTaken ? timeNow : null }),
      });
    } catch (err) {
      console.error("Failed to persist medication state:", err);
    }
  };

  const handleSaveModalDose = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetMed = medications.find((m) => m.id === selectedMedId);
    if (!targetMed) return;

    setIsSavingDose(true);
    const timeToRecord = logTime.trim() || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      // Persist to DB
      await fetch("/api/medications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMedId,
          taken: true,
          takenAt: timeToRecord,
        }),
      });

      // Update state
      setMedications((prev) =>
        prev.map((med) => {
          if (med.id !== selectedMedId) return med;
          return {
            ...med,
            taken: true,
            takenAt: timeToRecord,
            note: patientNote.trim() || undefined,
          };
        })
      );

      const nextTakenCount = medications.filter((m) => m.id === selectedMedId || m.taken).length;
      const nextAdherence = Math.round((nextTakenCount / medications.length) * 100);

      toast.success(
        language === "hi"
          ? `${targetMed.name} की खुराक ${timeToRecord} पर दर्ज की गई! अनुपालन ${nextAdherence}% है।`
          : `Logged dose for ${targetMed.name} at ${timeToRecord}! Adherence updated to ${nextAdherence}%.`
      );

      setIsLogModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to record medication dose");
    } finally {
      setIsSavingDose(false);
    }
  };

  const handleRefill = (medName: string) => {
    toast.success(`Refill order placed for ${medName} via Apollo Hospital Pharmacy delivery.`);
  };

  const takenCount = medications.filter((m) => m.taken).length;
  const adherencePercent = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 100;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1">
                <CalendarCheck2 className="size-3" /> {language === "hi" ? "रोगी दैनिक खुराक लॉग" : "Patient Daily Medication Log"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t("med_tracker_title")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("med_tracker_subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{adherencePercent}% {language === "hi" ? "आज पूर्ण" : "Completed Today"}</span>
            </div>

            {/* Patient Primary Log Button */}
            <motion.button
              data-testid="log-medication-dose-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openLogModalForMed()}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>{language === "hi" ? "खुराक दर्ज करें" : "Log Medication Dose"}</span>
            </motion.button>
          </div>
        </div>

        {/* Medication Doses List */}
        <div className="space-y-2.5">
          {medications.map((med) => (
            <div
              key={med.id}
              data-testid={`medication-item-${med.id}`}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                med.taken
                  ? "bg-slate-50/80 dark:bg-slate-900/30 border-slate-200/70 dark:border-slate-700/60"
                  : "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/50 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    med.taken
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  }`}
                >
                  <Pill className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {med.name}{" "}
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        ({med.dosage})
                      </span>
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {getTimeSlotLabel(med.timeSlot)} • {med.scheduledTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {med.instruction}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                    {med.taken ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="size-3" /> {language === "hi" ? `लिया गया: ${med.takenAt}` : `Taken at ${med.takenAt}`}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <Clock className="size-3" /> {language === "hi" ? "आज निर्धारित" : "Due today"}
                      </span>
                    )}
                    {med.daysRemaining <= 7 && (
                      <button
                        onClick={() => handleRefill(med.name)}
                        className="text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <AlertTriangle className="size-3" /> {med.daysRemaining} {language === "hi" ? "दिन शेष • रीफ़िल" : "days left • Refill"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {!med.taken && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openLogModalForMed(med.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer hidden md:flex items-center gap-1"
                    title="Log detailed dose with notes"
                  >
                    <NotebookPen className="size-3 text-slate-500" />
                    <span>Details</span>
                  </motion.button>
                )}

                <motion.button
                  data-testid={`toggle-med-taken-${med.id}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggleTaken(med.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    med.taken
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20"
                  }`}
                >
                  {med.taken ? (
                    <>
                      <Check className="size-3.5 text-emerald-600" />
                      <span>{t("taken")}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="size-3.5" />
                      <span>{t("take_dose")}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* PATIENT LOG MEDICATION DOSE MODAL */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Pill className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {language === "hi" ? "दवा खुराक रिकॉर्ड करें" : "Log Medication Intake"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === "hi"
                        ? "अपनी निर्धारित दवा का सेवन समय दर्ज करें"
                        : "Record your daily dose for adherence tracking"}
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
              <form onSubmit={handleSaveModalDose} className="p-5 space-y-4">
                {/* Select Medicine */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === "hi" ? "दवा चुनें" : "Select Prescribed Medication"}
                  </label>
                  <div className="space-y-1.5">
                    {medications.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMedId(m.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                          selectedMedId === m.id
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 shadow-2xs"
                            : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Pill className={`size-3.5 ${selectedMedId === m.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                          <span className="font-bold">{m.name} ({m.dosage})</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {m.timeSlot} • {m.scheduledTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intake Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === "hi" ? "खुराक लेने का समय" : "Time Taken"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      data-testid="log-med-time-input"
                      value={logTime}
                      onChange={(e) => setLogTime(e.target.value)}
                      placeholder="e.g. 09:15 PM"
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <Clock className="size-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Meal Context Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                    <Utensils className="size-3 text-slate-500" />
                    <span>{language === "hi" ? "भोजन संदर्भ" : "Meal Timing Context"}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["After Meal", "Before Meal", "With Water"].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setMealTiming(opt)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          mealTiming === opt
                            ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Patient Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === "hi" ? "टिप्पणी (वैकल्पिक)" : "Personal Notes (Optional)"}
                  </label>
                  <input
                    type="text"
                    data-testid="log-med-note-input"
                    value={patientNote}
                    onChange={(e) => setPatientNote(e.target.value)}
                    placeholder="e.g. Taken post dinner with warm water"
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingDose}
                    data-testid="confirm-log-med-btn"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingDose ? (
                      <span>Recording...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        <span>Confirm & Log Dose</span>
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

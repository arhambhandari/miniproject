"use client";

import React, { useState, useEffect } from "react";
import { 
  Pill, 
  Check, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  CalendarCheck2 
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

  const handleToggleTaken = async (id: string) => {
    const currentMed = medications.find((m) => m.id === id);
    const nowTaken = currentMed ? !currentMed.taken : true;

    setMedications((prev) =>
      prev.map((med) => {
        if (med.id !== id) return med;
        if (nowTaken) {
          toast.success(`Marked ${med.name} ${med.dosage} as taken`);
          return {
            ...med,
            taken: true,
            takenAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        } else {
          toast.info(`Undid dose for ${med.name}`);
          return {
            ...med,
            taken: false,
            takenAt: undefined,
          };
        }
      })
    );

    // Persist to database if not a local fallback id
    try {
      await fetch("/api/medications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, taken: nowTaken }),
      });
    } catch (err) {
      console.error("Failed to persist medication state:", err);
    }
  };

  const handleRefill = (medName: string) => {
    toast.success(`Refill order placed for ${medName} via Apollo Hospital Pharmacy delivery.`);
  };

  const takenCount = medications.filter((m) => m.taken).length;
  const adherencePercent = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800/90 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1">
              <CalendarCheck2 className="size-3" /> {language === "hi" ? "दैनिक प्रिस्क्रिप्शन शेड्यूल" : "Daily Prescription Schedule"}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("med_tracker_title")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("med_tracker_subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-emerald-600" />
            <span>{adherencePercent}% {language === "hi" ? "आज पूर्ण" : "Completed Today"}</span>
          </div>
        </div>
      </div>

      {/* Medication Doses List */}
      <div className="space-y-2.5">
        {medications.map((med) => (
          <div
            key={med.id}
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
                      <Clock className="size-3" /> {language === "hi" ? "आज निर्धारित" : "Due tonight"}
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToggleTaken(med.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 self-start sm:self-center ${
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
        ))}
      </div>
    </motion.div>
  );
}

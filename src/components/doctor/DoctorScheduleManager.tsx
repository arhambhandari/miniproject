"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  IndianRupee,
  Save,
  Building2,
  CalendarCheck2,
  Eye,
  Sliders,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ShiftConfig {
  enabled: boolean;
  start: string;
  end: string;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function DoctorScheduleManager() {
  const [workingDays, setWorkingDays] = useState<string[]>([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ]);
  const [morningShift, setMorningShift] = useState<ShiftConfig>({
    enabled: true,
    start: "09:00 AM",
    end: "01:00 PM",
  });
  const [eveningShift, setEveningShift] = useState<ShiftConfig>({
    enabled: true,
    start: "05:00 PM",
    end: "08:30 PM",
  });
  const [slotDuration, setSlotDuration] = useState<number>(20);
  const [maxTokensPerHour, setMaxTokensPerHour] = useState<number>(3);
  const [emergencyBufferSlots, setEmergencyBufferSlots] = useState<number>(2);

  // Fee Tiers
  const [consultationFee, setConsultationFee] = useState<number>(2000);
  const [teleconsultFee, setTeleconsultFee] = useState<number>(1500);
  const [followUpFee, setFollowUpFee] = useState<number>(1000);

  // Blocked Dates / Leave
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([
    { id: "leave_1", date: "2026-10-24", reason: "National Medical Conference" },
    { id: "leave_2", date: "2026-11-01", reason: "Diwali Hospital OPD Holiday" },
  ]);
  const [newLeaveDate, setNewLeaveDate] = useState("");
  const [newLeaveReason, setNewLeaveReason] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial schedule from API
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/doctor/schedule", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.schedule) {
          const s = data.schedule;
          if (Array.isArray(s.workingDays)) setWorkingDays(s.workingDays);
          if (s.morningShift) setMorningShift(s.morningShift);
          if (s.eveningShift) setEveningShift(s.eveningShift);
          if (s.slotDuration) setSlotDuration(s.slotDuration);
          if (s.maxTokensPerHour) setMaxTokensPerHour(s.maxTokensPerHour);
          if (s.emergencyBufferSlots !== undefined) setEmergencyBufferSlots(s.emergencyBufferSlots);
          if (s.consultationFee) setConsultationFee(s.consultationFee);
          if (s.teleconsultFee) setTeleconsultFee(s.teleconsultFee);
          if (s.followUpFee) setFollowUpFee(s.followUpFee);
          if (Array.isArray(s.blockedDates)) setBlockedDates(s.blockedDates);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Could not load schedule from API:", err?.message || err);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const toggleDay = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveDate) {
      toast.error("Please select a date to block");
      return;
    }
    const newEntry: BlockedDate = {
      id: `leave_${Date.now()}`,
      date: newLeaveDate,
      reason: newLeaveReason.trim() || "Doctor Leave / Off-Duty",
    };
    setBlockedDates((prev) => [...prev, newEntry]);
    setNewLeaveDate("");
    setNewLeaveReason("");
    toast.success(`Blocked ${newEntry.date} from OPD availability.`);
  };

  const handleRemoveBlockedDate = (id: string) => {
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    toast.info("Leave date removed.");
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      const payload = {
        workingDays,
        morningShift,
        eveningShift,
        slotDuration,
        maxTokensPerHour,
        emergencyBufferSlots,
        consultationFee,
        teleconsultFee,
        followUpFee,
        blockedDates,
      };

      const res = await fetch("/api/doctor/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update schedule");

      toast.success("OPD Schedule and Slot Availability successfully synced!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate real preview slots based on current configuration
  const generatePreviewSlots = () => {
    const slots: { time: string; shift: string; isEmergency?: boolean }[] = [];

    if (morningShift.enabled) {
      // 09:00 AM to 11:40 AM preview sample
      slots.push(
        { time: "09:00 AM", shift: "Morning" },
        { time: "09:20 AM", shift: "Morning" },
        { time: "09:40 AM", shift: "Morning" },
        { time: "10:00 AM", shift: "Morning" },
        { time: "10:20 AM", shift: "Morning" },
        { time: "10:40 AM", shift: "Morning", isEmergency: emergencyBufferSlots > 0 },
        { time: "11:00 AM", shift: "Morning" },
        { time: "11:20 AM", shift: "Morning" }
      );
    }

    if (eveningShift.enabled) {
      slots.push(
        { time: "05:00 PM", shift: "Evening" },
        { time: "05:20 PM", shift: "Evening" },
        { time: "05:40 PM", shift: "Evening" },
        { time: "06:00 PM", shift: "Evening", isEmergency: emergencyBufferSlots > 1 },
        { time: "06:20 PM", shift: "Evening" },
        { time: "06:40 PM", shift: "Evening" }
      );
    }

    return slots;
  };

  const previewSlots = generatePreviewSlots();

  return (
    <div className="space-y-6">
      {/* Top Header & Save Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center gap-1">
              <CalendarCheck2 className="size-3" /> OPD Operations
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              Live Patient Booking Synced
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Doctor Availability & Custom Slot Scheduler
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Set your weekly hospital OPD shifts, consultation duration, emergency reserve tokens, and consultation fee tiers.
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSaveSchedule}
          disabled={isSaving}
          data-testid="save-schedule-btn"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          {isSaving ? (
            <span>Saving & Syncing...</span>
          ) : (
            <>
              <Save className="size-4" />
              <span>Save & Sync Schedule</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: CONFIGURATION FORMS */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Working Days Selector */}
          <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="size-4 text-blue-600" />
                  <span>Weekly OPD Working Days</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select which days your clinic chamber is open for patient consultations
                </p>
              </div>

              <button
                type="button"
                onClick={() => setWorkingDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Mon–Fri Only
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {ALL_DAYS.map((day) => {
                const isActive = workingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    data-testid={`day-toggle-${day.toLowerCase()}`}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold">{day.slice(0, 3)}</span>
                    <span
                      className={`size-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                        isActive ? "bg-white text-blue-600" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      }`}
                    >
                      {isActive ? "✓" : "–"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Morning & Evening Shifts */}
          <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Clock className="size-4 text-blue-600" />
              <span>Shift Timings & Hospital Chambers</span>
            </h3>

            <div className="space-y-4">
              {/* Morning Shift */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="morningShiftToggle"
                    checked={morningShift.enabled}
                    onChange={(e) => setMorningShift({ ...morningShift, enabled: e.target.checked })}
                    className="size-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="morningShiftToggle" className="cursor-pointer">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Morning OPD Shift
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Standard morning clinic hours
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={morningShift.start}
                    onChange={(e) => setMorningShift({ ...morningShift, start: e.target.value })}
                    data-testid="morning-shift-start"
                    disabled={!morningShift.enabled}
                    className="w-24 h-9 px-2.5 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="text"
                    value={morningShift.end}
                    onChange={(e) => setMorningShift({ ...morningShift, end: e.target.value })}
                    data-testid="morning-shift-end"
                    disabled={!morningShift.enabled}
                    className="w-24 h-9 px-2.5 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Evening Shift */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="eveningShiftToggle"
                    checked={eveningShift.enabled}
                    onChange={(e) => setEveningShift({ ...eveningShift, enabled: e.target.checked })}
                    className="size-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="eveningShiftToggle" className="cursor-pointer">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Evening OPD Shift
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Late afternoon / evening consultations
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={eveningShift.start}
                    onChange={(e) => setEveningShift({ ...eveningShift, start: e.target.value })}
                    data-testid="evening-shift-start"
                    disabled={!eveningShift.enabled}
                    className="w-24 h-9 px-2.5 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="text"
                    value={eveningShift.end}
                    onChange={(e) => setEveningShift({ ...eveningShift, end: e.target.value })}
                    data-testid="evening-shift-end"
                    disabled={!eveningShift.enabled}
                    className="w-24 h-9 px-2.5 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Slot Duration & Emergency Buffer */}
          <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Sliders className="size-4 text-blue-600" />
              <span>Consultation Cadence & Capacity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Slot Duration per Patient
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSlotDuration(mins)}
                      data-testid={`slot-duration-${mins}`}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        slotDuration === mins
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Reserve Tokens */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Emergency / Trauma Walk-in Buffer
                </label>
                <select
                  value={emergencyBufferSlots}
                  onChange={(e) => setEmergencyBufferSlots(Number(e.target.value))}
                  data-testid="emergency-buffer-select"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value={0}>No buffer (100% pre-booked)</option>
                  <option value={1}>1 token reserved per shift</option>
                  <option value={2}>2 tokens reserved per shift (Recommended)</option>
                  <option value={3}>3 tokens reserved per shift</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Consultation Fee Tiers */}
          <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <IndianRupee className="size-4 text-emerald-600" />
              <span>Consultation Pricing & Fee Structure</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  In-Person OPD Fee (₹)
                </label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  data-testid="consultation-fee-input"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teleconsultation Fee (₹)
                </label>
                <input
                  type="number"
                  value={teleconsultFee}
                  onChange={(e) => setTeleconsultFee(Number(e.target.value))}
                  data-testid="teleconsult-fee-input"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Follow-up Review Fee (₹)
                </label>
                <input
                  type="number"
                  value={followUpFee}
                  onChange={(e) => setFollowUpFee(Number(e.target.value))}
                  data-testid="followup-fee-input"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BLOCKED DATES & LIVE PREVIEW */}
        <div className="space-y-6">
          {/* Live Patient Slot Generator Preview */}
          <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="size-4 text-blue-600" />
                <span>Patient Slot Preview</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <Sparkles className="size-2.5" /> Generated Live
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Slots generated for a typical working day based on your current configuration:
            </p>

            <div className="max-h-64 overflow-y-auto pr-1 space-y-1.5">
              {previewSlots.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    s.isEmergency
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-900 dark:text-rose-200"
                      : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span className="font-bold">{s.time}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">{s.shift}</span>
                    {s.isEmergency ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                        Emergency Reserve
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Available
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blocked Dates / Leave Calendar */}
          <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <AlertTriangle className="size-4 text-amber-500" />
              <span>Blocked Dates & Leave</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Mark specific dates when you are off-duty or attending conferences.
            </p>

            {/* Add Leave Form */}
            <form onSubmit={handleAddBlockedDate} className="space-y-2.5 mb-4">
              <input
                type="date"
                value={newLeaveDate}
                onChange={(e) => setNewLeaveDate(e.target.value)}
                data-testid="leave-date-input"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none"
              />
              <input
                type="text"
                value={newLeaveReason}
                onChange={(e) => setNewLeaveReason(e.target.value)}
                placeholder="Reason (e.g. Cardiology Summit)"
                data-testid="leave-reason-input"
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
              />
              <button
                type="submit"
                data-testid="add-leave-btn"
                className="w-full h-9 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add Blocked Date</span>
              </button>
            </form>

            {/* Blocked dates list */}
            <div className="space-y-2">
              {blockedDates.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">
                      {b.date}
                    </span>
                    <span className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                      {b.reason}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(b.id)}
                    title="Remove leave"
                    className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

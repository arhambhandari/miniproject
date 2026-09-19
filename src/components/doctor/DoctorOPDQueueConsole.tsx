"use client";

import React, { useState, useEffect } from "react";
import { 
  Radio, 
  Volume2, 
  Users, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  UserCheck, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { QueueState } from "@/types";

export function DoctorOPDQueueConsole() {
  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Fetch initial queue state & subscribe to SSE
  useEffect(() => {
    // 1. Initial status fetch
    fetch("/api/queue/status")
      .then((res) => res.json())
      .then((data) => {
        if (data?.state) {
          setQueueState(data.state);
        }
      })
      .catch((err) => console.warn("Failed to load initial queue status:", err));

    // 2. Open SSE stream
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/queue/stream");

      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.addEventListener("queue_state", (e) => {
        try {
          const parsed = JSON.parse(e.data);
          setQueueState(parsed);
          setConnected(true);
        } catch (err) {
          console.error("Failed to parse queue_state event:", err);
        }
      });

      eventSource.addEventListener("queue_update", (e) => {
        try {
          const parsed = JSON.parse(e.data);
          setQueueState(parsed);
          setConnected(true);
        } catch (err) {
          console.error("Failed to parse queue_update event:", err);
        }
      });

      eventSource.onerror = () => {
        setConnected(false);
      };
    } catch (err) {
      console.warn("EventSource not supported or failed:", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const executeAction = async (
    action: "CALL_NEXT" | "CALL_DIRECT" | "EMERGENCY_DELAY" | "RESOLVE_DELAY" | "RESET",
    tokenNumber?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/queue/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          tokenNumber,
          delayMinutes: 15,
          delayReason: "Doctor attending to urgent trauma case in Emergency Ward.",
          demo: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.state) {
        setQueueState(data.state);
        if (action === "CALL_NEXT") {
          toast.success(`Called next patient: ${data.state.currentServingToken} (${data.state.currentPatientName})`);
        } else if (action === "CALL_DIRECT") {
          toast.success(`Priority called: ${tokenNumber}`);
        } else if (action === "EMERGENCY_DELAY") {
          toast.warning("Emergency delay of 15 mins broadcast to all waiting patients");
        } else if (action === "RESOLVE_DELAY") {
          toast.success("Emergency delay cleared. Consultations resumed.");
        } else if (action === "RESET") {
          toast.info("Queue reset to initial shift sequence");
        }
      } else {
        toast.error(data.error || "Failed to update queue");
      }
    } catch (err) {
      console.error("Queue action failed:", err);
      toast.error("Network error modifying queue");
    } finally {
      setLoading(false);
    }
  };

  const currentServing = queueState?.currentServingToken || "Token #A-06";
  const currentPatient = queueState?.currentPatientName || "Ramesh Verma";
  const waitingTokens = queueState?.tokens.filter((t) => t.status === "WAITING") || [];
  const nextToken = waitingTokens[0];
  const isEmergency = queueState?.status === "EMERGENCY_DELAY";
  const emergencyWaitingToken = queueState?.tokens.find(
    (t) => t.tokenNumber.startsWith("Token #EM-") && t.status === "WAITING"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-[28px] bg-white dark:bg-slate-800/90 p-5 md:p-6 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40">
            <Radio className="size-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white">
                Chamber 304 Live OPD Console
              </h3>
              <span
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  connected
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
                    : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    connected ? "bg-emerald-500 dark:bg-emerald-400 animate-ping" : "bg-amber-500 dark:bg-amber-400"
                  }`}
                />
                {connected ? "SSE Stream Live" : "Connecting..."}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Apollo Specialty Hospital • Dr. Vikramaditya Rathore (Neuro-Oncology)
            </p>
          </div>
        </div>

        {/* Emergency & Reset Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isEmergency ? (
            <button
              onClick={() => executeAction("RESOLVE_DELAY")}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <CheckCircle2 className="size-3.5" /> Resume Consultations
            </button>
          ) : (
            <button
              onClick={() => executeAction("EMERGENCY_DELAY")}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldAlert className="size-3.5 text-rose-500" /> +15m Emergency
            </button>
          )}

          <button
            onClick={() => executeAction("RESET")}
            disabled={loading}
            title="Reset Queue"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600 text-xs transition-all cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Emergency Fast-Track Patient Alert Banner */}
      {emergencyWaitingToken && (
        <motion.div
          data-testid="doctor-emergency-alert-banner"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mt-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-200 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="size-5 text-rose-600 dark:text-rose-400 animate-pulse shrink-0" />
            <div>
              <strong className="block text-rose-800 dark:text-rose-200 font-extrabold text-sm">
                🚨 Emergency Fast-Track Patient Waiting: {emergencyWaitingToken.patientName} ({emergencyWaitingToken.tokenNumber})
              </strong>
              <span className="text-rose-600 dark:text-rose-300">Priority patient inserted at head of queue. Requires immediate clinical attention.</span>
            </div>
          </div>
          <button
            data-testid="doctor-call-emergency-btn"
            onClick={() => executeAction("CALL_DIRECT", emergencyWaitingToken.tokenNumber)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shrink-0 flex items-center gap-1 shadow-md shadow-rose-600/25 cursor-pointer transition-all"
          >
            <span>Call Emergency Now</span>
          </button>
        </motion.div>
      )}

      {/* Emergency Notice if active */}
      {isEmergency && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="relative z-10 mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-200"
        >
          <AlertTriangle className="size-4 text-amber-500 shrink-0" />
          <span>
            <strong>Queue on 15-Minute Emergency Hold:</strong>{" "}
            {queueState?.delayReason || "Attending urgent ICU trauma case."} Patients see delayed ETA.
          </span>
        </motion.div>
      )}

      {/* Main Console Action Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4">
        {/* Left: Inside Chamber Card */}
        <div className="lg:col-span-4 p-4.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
              Currently Inside Chamber
            </span>
            <div
              data-testid="doctor-now-serving"
              className="text-3xl font-black text-amber-500 dark:text-amber-400 tracking-tight"
            >
              {currentServing}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
              <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" /> {currentPatient}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              In consultation • Room 304
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Waiting in queue:</span>
            <strong className="text-slate-900 dark:text-white font-bold">{waitingTokens.length} patients</strong>
          </div>
        </div>

        {/* Center: Primary "Call Next Patient" Action */}
        <div className="lg:col-span-5 p-4.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/50 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Next In Line
            </span>
            {nextToken ? (
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {nextToken.tokenNumber}{" "}
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    ({nextToken.patientName})
                  </span>
                </div>
                <span className="text-xs text-blue-700 dark:text-blue-300 mt-0.5 block">
                  Scheduled slot: {nextToken.time}
                </span>
              </div>
            ) : (
              <div className="text-sm text-slate-400 font-medium py-1">
                No more waiting patients in this shift.
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <motion.button
              data-testid="doctor-call-next-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !nextToken}
              onClick={() => executeAction("CALL_NEXT")}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Volume2 className="size-4" />
              )}
              <span>
                Call Next Patient {nextToken ? `(${nextToken.tokenNumber})` : ""}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Right: Direct Priority Patient Call */}
        <div className="lg:col-span-3 p-4.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-800/50 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
              Priority Patient Call
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Rahul Sharma
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300">
              Token #A-08 (UHID: MB-98412)
            </div>
          </div>

          <div className="mt-3">
            <motion.button
              data-testid="doctor-call-rahul-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || currentServing === "Token #A-08"}
              onClick={() => executeAction("CALL_DIRECT", "Token #A-08")}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className="size-3.5 text-purple-200" />
              <span>
                {currentServing === "Token #A-08"
                  ? "Inside Chamber Now"
                  : "Call Rahul Sharma (#A-08)"}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Live Queue Ribbon / Tokens sequence */}
      <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mb-2">
          Real-Time Shift Token Sequence:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {queueState?.tokens.map((token) => {
            const isCurrent = token.tokenNumber === currentServing;
            const isCompleted = token.status === "COMPLETED";
            const isEmergencyToken = token.tokenNumber.startsWith("Token #EM-");
            const isRahul = token.tokenNumber === "Token #A-08";

            return (
              <button
                key={token.tokenNumber}
                onClick={() => {
                  if (token.status === "WAITING") {
                    executeAction("CALL_DIRECT", token.tokenNumber);
                  }
                }}
                disabled={isCurrent || isCompleted || loading}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? "bg-amber-400 text-slate-950 shadow-xs ring-2 ring-amber-400/50 font-black"
                    : isCompleted
                    ? "bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 line-through opacity-70 cursor-not-allowed"
                    : isEmergencyToken
                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-2 border-rose-500 animate-pulse hover:bg-rose-100 dark:hover:bg-rose-900/50 shadow-xs"
                    : isRahul
                    ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/60 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                    : "bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/80 shadow-2xs"
                }`}
              >
                <span>{token.tokenNumber}</span>
                <span className="text-[10px] font-normal opacity-80">
                  {token.patientName.split(" ")[0]}
                </span>
                {isCurrent && <span className="size-1.5 rounded-full bg-slate-950 animate-ping" />}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

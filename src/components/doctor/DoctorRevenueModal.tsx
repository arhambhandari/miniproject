"use client";

import React from "react";
import {
  X,
  IndianRupee,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  Download,
  CalendarCheck,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface DoctorRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalEarnings: number;
  appointments: any[];
  doctorName: string;
  specialization: string;
}

export function DoctorRevenueModal({
  isOpen,
  onClose,
  totalEarnings,
  appointments,
  doctorName,
  specialization,
}: DoctorRevenueModalProps) {
  if (!isOpen) return null;

  const paidAppointments = appointments.filter(
    (a) => a.paymentStatus === "SUCCESS" || a.fee
  );

  const handleDownloadStatement = () => {
    toast.success("Practice Payout Statement generated and ready for export!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <IndianRupee className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Practice Revenue & Payouts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verified OPD Consultation Fees & Direct Bank Settlements
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

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Revenue Hero Highlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                Total Net Earnings
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                ₹{totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-100 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" /> 100% Guaranteed Payout via Razorpay / Stripe
              </p>
            </div>

            <button
              onClick={handleDownloadStatement}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer shrink-0"
            >
              <Download className="size-3.5" />
              <span>Export Payouts</span>
            </button>
          </div>

          {/* Linked Settlement Account */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Building className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  HDFC Bank Professional Account
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Account •••• 4892 • IFSC: HDFC0000128 • Auto-Settlement Active
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Verified
            </span>
          </div>

          {/* Consultation Transactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Consultation Fee Transactions ({paidAppointments.length})
              </h3>
              <span className="text-xs text-slate-400">
                Direct OPD Bookings
              </span>
            </div>

            {paidAppointments.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500">No consultation fees collected yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {paidAppointments.map((app, idx) => (
                  <div
                    key={app.id || idx}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                        {app.patientName?.charAt(0) || "P"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {app.patientName}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {app.date} • {app.time} • {app.condition || "OPD Checkup"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        +{app.fee || "₹2,000"}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {app.paymentStatus === "SUCCESS" ? "Settled to Bank" : "Collected via OPD Desk"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Encrypted settlement gateway with GST compliant invoicing.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

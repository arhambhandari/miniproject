"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto w-full max-w-6xl px-4 grid md:grid-cols-3 gap-8 text-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600 dark:text-blue-500">
            <HeartPulse className="size-6 text-blue-600 dark:text-blue-500" />
            <span>MediBook</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Making healthcare accessible, transparent, and seamless for everyone.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Patients</h4>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link href="/doctors" className="hover:text-blue-600 transition-colors">Find a Doctor</Link></li>
            <li><Link href="/login" className="hover:text-blue-600 transition-colors">Book Appointment</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Doctors</h4>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link href="/register?role=doctor" className="hover:text-blue-600 transition-colors">Join MediBook</Link></li>
            <li><Link href="/login" className="hover:text-blue-600 transition-colors">Provider Dashboard</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

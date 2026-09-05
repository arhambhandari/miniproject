"use client";

import React from "react";
import { useLanguage } from "../LanguageContext";
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto w-full max-w-6xl px-4 grid md:grid-cols-4 gap-8 mb-8 text-sm">
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

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
          <ul className="space-y-2 text-slate-500 dark:text-slate-400">
            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} MediBook Platform. All rights reserved.</p>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

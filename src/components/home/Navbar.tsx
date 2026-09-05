"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HeartPulse, Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur dark:bg-slate-900/85 dark:border-slate-800">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600 dark:text-blue-500">
          <HeartPulse className="size-6 text-blue-600 dark:text-blue-500" />
          <span>MediBook</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/doctors" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('find_doctor')}</Link>
          <Link href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{"How it Works"}</Link>
          <Link href="#testimonials" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Testimonials</Link>
          <Link href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            {t('login')}
          </Link>
          <Link href="/register" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 dark:shadow-none">
            {t('get_started')}
          </Link>
        </div>

        <button 
          className="md:hidden p-2 -mr-2 text-slate-600 dark:text-slate-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/doctors" onClick={() => setMobileMenuOpen(false)}>{t('find_doctor')}</Link>
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>{"How it Works"}</Link>
          </nav>
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" className="flex justify-center rounded-xl bg-slate-100 dark:bg-slate-800 py-3 text-sm font-medium text-slate-900 dark:text-white">
              {t('login')}
            </Link>
            <Link href="/register" className="flex justify-center rounded-xl bg-blue-600 py-3 text-sm font-medium text-white">
              {t('get_started')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

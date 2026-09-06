"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HeartPulse, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600 dark:text-blue-500 group">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 group-hover:scale-110 transition-transform">
            <HeartPulse className="size-5 text-blue-600 dark:text-blue-400 group-hover:animate-pulse-subtle" />
          </div>
          <span className="font-extrabold tracking-tight">MediBook</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {[
            { href: "/doctors", label: t('find_doctor') },
            { href: "#how-it-works", label: "How it Works" },
            { href: "#testimonials", label: "Testimonials" },
            { href: "#faq", label: "FAQ" },
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="relative py-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link 
            href="/login" 
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {t('login')}
          </Link>
          <Link 
            href="/register" 
            className="rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-medium text-white transition-all duration-200 shadow-sm shadow-blue-500/25 hover:shadow-md hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('get_started')}
          </Link>
        </div>

        <button 
          className="md:hidden p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 px-4 py-4 space-y-4 shadow-xl"
          >
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link href="/doctors" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1">{t('find_doctor')}</Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1">{"How it Works"}</Link>
              <Link href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1">Testimonials</Link>
              <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1">FAQ</Link>
            </nav>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" className="flex justify-center rounded-xl bg-slate-100 dark:bg-slate-800 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-200 transition-colors">
                {t('login')}
              </Link>
              <Link href="/register" className="flex justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all">
                {t('get_started')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import React from "react";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { Footer } from "@/components/home/Footer";
import { HomePageClient } from "@/components/home/HomePageClient";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <HowItWorks />
      <HomePageClient />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

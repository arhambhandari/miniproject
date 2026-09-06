"use client";

import React, { useState } from "react";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { DoctorGrid } from "./DoctorGrid";
import { BookingModal } from "./BookingModal";
import type { Doctor } from "@/types";

export function HomePageClient() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Hero
        onBook={(doctor) => setSelectedDoctor(doctor)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <HowItWorks />
      <DoctorGrid
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        onBook={(doctor) => setSelectedDoctor(doctor)}
      />
      <BookingModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
    </>
  );
}

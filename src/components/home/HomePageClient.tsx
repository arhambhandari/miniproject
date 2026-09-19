"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { DoctorGrid } from "./DoctorGrid";
import type { Doctor } from "@/types";

const BookingModal = dynamic(
  () => import("./BookingModal").then((mod) => mod.BookingModal),
  { ssr: false }
);

interface HomePageClientProps {
  initialDoctors?: Doctor[];
}

export function HomePageClient({ initialDoctors = [] }: HomePageClientProps) {
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
        initialDoctors={initialDoctors}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        onBook={(doctor) => setSelectedDoctor(doctor)}
      />
      {selectedDoctor && (
        <BookingModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      )}
    </>
  );
}

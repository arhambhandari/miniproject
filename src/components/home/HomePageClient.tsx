"use client";

import React, { useState } from "react";
import { DoctorGrid } from "./DoctorGrid";
import { BookingModal } from "./BookingModal";
import type { Doctor } from "@/types";

export function HomePageClient() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <>
      <DoctorGrid onBook={(doctor) => setSelectedDoctor(doctor)} />
      <BookingModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
    </>
  );
}

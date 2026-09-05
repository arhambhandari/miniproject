"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeartPulse, Star, MapPin } from "lucide-react";

type Doctor = {
  id: string;
  specialization: string;
  experience: number;
  satisfaction: number;
  fee?: number;
  nextAvailable: string;
  user: {
    name: string;
    image: string;
  }
};

export default function DoctorsDirectory() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors")
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link className="flex items-center gap-2" href="/">
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <HeartPulse className="size-4" />
            </span>
            <span className="font-bold tracking-tight text-slate-900">MediBook</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Browse All Doctors</h1>
          <p className="mt-2 text-slate-500 text-lg">Find and book the best specialists for your needs.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading doctors...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all">
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={doctor.user.image}
                    alt={doctor.user.name}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {doctor.specialization}
                    </span>
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      {doctor.satisfaction}%
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{doctor.user.name}</h3>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 shrink-0" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <span className="font-bold text-slate-900">{doctor.fee ? `₹${doctor.fee.toLocaleString()}` : "₹1,500"}</span>
                  </div>
                  <div className="mt-6">
                    <Link href={`/?book=${doctor.id}#doctors`} className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

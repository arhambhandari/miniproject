"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HeartPulse, CalendarCheck, Clock, User, LogOut, XCircle } from "lucide-react";
import { toast } from "sonner";

// Mock data for the dashboard to demonstrate the UI
const MOCK_APPOINTMENTS = [
  {
    id: "app_1",
    doctorName: "Dr. Elena Rostova",
    specialty: "Neuro-Oncology",
    date: "Oct 12, 2026",
    time: "10:00 AM",
    status: "Upcoming",
    fee: "₹1,500"
  },
  {
    id: "app_2",
    doctorName: "Dr. Marcus Vance",
    specialty: "Surgical Oncology",
    date: "Sep 01, 2026",
    time: "2:30 PM",
    status: "Completed",
    fee: "₹2,000"
  }
];

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then(res => res.json())
      .then(data => {
        setAppointments(data.appointments);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCancel = (id: string) => {
    // In a real app, this would call a DELETE or PATCH API
    if (confirm("Are you sure you want to cancel this appointment? Your refund will be processed to your original payment method.")) {
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: "Cancelled" } : app
      ));
      toast.success("Appointment cancelled successfully. Refund initiated.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link className="flex items-center gap-2" href="/">
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <HeartPulse className="size-4" />
            </span>
            <span className="font-bold tracking-tight text-slate-900">MediBook</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <User className="size-4" />
              Patient Dashboard
            </div>
            <Link href="/" className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="size-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Appointments</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Sidebar / Quick Stats */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Visits</h2>
              <p className="text-4xl font-extrabold text-slate-900">{appointments.filter(a => a.status === "Completed").length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Upcoming</h2>
              <p className="text-4xl font-extrabold text-blue-600">{appointments.filter(a => a.status === "Upcoming").length}</p>
            </div>
          </div>

          {/* Appointments List */}
          <div className="md:col-span-2 space-y-4">
            {appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <CalendarCheck className="size-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No appointments yet</h3>
                <p className="text-slate-500 mt-1 mb-6">Find a doctor and book your first consultation.</p>
                <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Find a Doctor
                </Link>
              </div>
            ) : (
              appointments.map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        app.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{app.doctorName}</h3>
                    <p className="text-sm text-slate-500">{app.specialty}</p>
                    
                    <div className="flex items-center gap-4 mt-4 text-sm font-medium text-slate-700">
                      <span className="flex items-center gap-1.5"><CalendarCheck className="size-4 text-slate-400" /> {app.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="size-4 text-slate-400" /> {app.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <div className="text-lg font-bold text-slate-900">{app.fee}</div>
                    
                    {app.status === "Upcoming" && (
                      <button 
                        onClick={() => handleCancel(app.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <XCircle className="size-4" /> Cancel & Refund
                      </button>
                    )}
                    
                    {app.status === "Completed" && (
                      <Link href="/doctors/doc_1" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                        Write a Review
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

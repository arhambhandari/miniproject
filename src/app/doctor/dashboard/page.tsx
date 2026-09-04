"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartPulse, CalendarCheck, Clock, User, LogOut, CheckCircle, XCircle, IndianRupee } from "lucide-react";

// Mock data for the doctor dashboard
const MOCK_APPOINTMENTS = [
  {
    id: "app_1",
    patientName: "Rahul Sharma",
    condition: "Post-surgery checkup",
    date: "Today",
    time: "10:00 AM",
    status: "Upcoming",
    fee: "₹1,500"
  },
  {
    id: "app_2",
    patientName: "Anita Desai",
    condition: "Arrhythmia consultation",
    date: "Today",
    time: "11:30 AM",
    status: "Completed",
    fee: "₹1,500"
  },
  {
    id: "app_3",
    patientName: "Vikram Singh",
    condition: "Preventive screening",
    date: "Tomorrow",
    time: "09:00 AM",
    status: "Upcoming",
    fee: "₹1,500"
  }
];

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

  const handleStatusChange = (id: string, newStatus: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
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
              Doctor Dashboard
            </div>
            <Link href="/" className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="size-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Welcome, Dr. Osei</h1>
        
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-1">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <IndianRupee className="size-4 text-emerald-500" /> Earnings (Today)
            </h2>
            <p className="text-4xl font-extrabold text-slate-900">₹3,000</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-1">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <User className="size-4 text-blue-500" /> Patients (Today)
            </h2>
            <p className="text-4xl font-extrabold text-slate-900">2</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-1">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CalendarCheck className="size-4 text-amber-500" /> Upcoming
            </h2>
            <p className="text-4xl font-extrabold text-slate-900">
              {appointments.filter(a => a.status === "Upcoming").length}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Patient Appointments</h2>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    app.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' :
                    app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{app.patientName}</h3>
                <p className="text-sm text-slate-500 font-medium">{app.condition}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm font-medium text-slate-600 bg-slate-50 p-2 rounded-lg inline-flex border border-slate-100">
                  <span className="flex items-center gap-1.5"><CalendarCheck className="size-4 text-blue-500" /> {app.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="size-4 text-amber-500" /> {app.time}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                <div className="text-lg font-bold text-slate-900">{app.fee}</div>
                
                {app.status === "Upcoming" && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(app.id, "Completed")}
                      className="text-sm font-medium text-emerald-700 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors border border-emerald-200"
                    >
                      <CheckCircle className="size-4" /> Mark Complete
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, "Cancelled")}
                      className="text-sm font-medium text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-200"
                    >
                      <XCircle className="size-4" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

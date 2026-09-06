"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarCheck,
  Clock,
  XCircle,
  Stethoscope,
  Filter,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatCards } from "@/components/dashboard/StatCards";
import { PlansCard } from "@/components/dashboard/PlansCard";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { BookingModal } from "@/components/home/BookingModal";
import { MOCK_DOCTORS } from "@/lib/data";
import type { Appointment, Doctor } from "@/types";

// Initial default appointments matching landing page doctors with dynamic dates
const getInitialAppointments = (): Appointment[] => {
  const formatDate = (daysOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return [
    {
      id: "app_1",
      patientName: "Rahul Sharma",
      doctorId: "doc_1",
      doctorName: "Dr. Elena Rostova",
      specialty: "Neuro-Oncology",
      date: formatDate(0), // Today
      time: "10:00 AM",
      status: "Upcoming",
      fee: "₹1,500",
    },
    {
      id: "app_2",
      patientName: "Rahul Sharma",
      doctorId: "doc_2",
      doctorName: "Dr. Marcus Vance",
      specialty: "Surgical Oncology",
      date: formatDate(0), // Today
      time: "02:30 PM",
      status: "Upcoming",
      fee: "₹2,000",
    },
    {
      id: "app_3",
      patientName: "Rahul Sharma",
      doctorId: "doc_3",
      doctorName: "Dr. Sophia Chen",
      specialty: "Pediatric Care",
      date: formatDate(2), // 2 days from now
      time: "09:30 AM",
      status: "Upcoming",
      fee: "₹1,200",
    },
    {
      id: "app_4",
      patientName: "Rahul Sharma",
      doctorId: "doc_4",
      doctorName: "Dr. James Wilson",
      specialty: "Cardiology",
      date: formatDate(-3), // 3 days ago
      time: "11:00 AM",
      status: "Completed",
      fee: "₹2,500",
    },
  ];
};

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(getInitialAppointments);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User session state
  const [userName, setUserName] = useState("Rahul Sharma");
  const [userEmail, setUserEmail] = useState("rahul.sharma@example.com");
  const [userImage, setUserImage] = useState<string | undefined>(undefined);

  // Doctor booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingInitialDate, setBookingInitialDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch logged in session if available
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.name) {
          setUserName(data.user.name);
        } else if (data?.user?.email) {
          setUserName(data.user.email.split("@")[0]);
        }
        if (data?.user?.email) setUserEmail(data.user.email);
        if (data?.user?.image) setUserImage(data.user.image);
      })
      .catch(() => {
        // Fallback to default user
      });

    // Fetch live user appointments
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        if (data?.appointments && Array.isArray(data.appointments) && data.appointments.length > 0) {
          setAppointments(data.appointments);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      });
  }, []);

  // Cancel appointment with refund
  const handleCancel = (id: string) => {
    const targetApp = appointments.find((a) => a.id === id);
    if (!targetApp) return;

    if (
      confirm(
        `Are you sure you want to cancel your consultation with ${targetApp.doctorName}? Your refund of ${targetApp.fee || "₹1,500"} will be credited back.`
      )
    ) {
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "Cancelled" as const } : app
        )
      );
      toast.success(
        `Appointment cancelled successfully. Refund of ${targetApp.fee || "₹1,500"} initiated.`
      );
    }
  };

  // Filtered appointments by search query
  const filteredAppointments = appointments.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.doctorName.toLowerCase().includes(q) ||
      app.specialty.toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q) ||
      app.date.toLowerCase().includes(q)
    );
  });

  const upcomingAppointments = appointments.filter((a) => a.status === "Upcoming");
  const completedAppointments = appointments.filter((a) => a.status === "Completed");

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <div className="flex-1 flex p-2.5 sm:p-4 lg:p-6 gap-4 lg:gap-6 max-w-[1750px] mx-auto w-full">
        {/* Desktop Left Navigation Rail */}
        <div className="hidden md:flex shrink-0">
          <DashboardSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenBooking={() => setSelectedDoctor(MOCK_DOCTORS[0])}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden flex">
            <div className="bg-blue-600 w-72 h-full p-6 flex flex-col justify-between text-white relative">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X className="size-6" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <span className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Stethoscope className="size-5 text-white" />
                  </span>
                  <span className="font-bold text-xl">MediBook</span>
                </div>
                <nav className="space-y-2">
                  {[
                    { id: "overview", label: "Dashboard" },
                    { id: "appointments", label: "Appointments" },
                    { id: "doctors", label: "Find Doctors" },
                    { id: "records", label: "Medical Records" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        activeTab === tab.id
                          ? "bg-white text-blue-600 font-bold"
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="pt-4 border-t border-blue-500/40">
                <Link
                  href="/"
                  className="text-xs text-blue-200 hover:text-white block mb-2"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
            <div
              className="flex-1"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar with Search & Notifications */}
          <DashboardTopBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            userName={userName}
            userImage={userImage}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          {/* Tab Content with Smooth AnimatePresence Switching */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col xl:flex-row gap-5 lg:gap-6 mt-1"
              >
                {/* Center Main Column */}
                <div className="flex-1 flex flex-col gap-5 lg:gap-6 min-w-0">
                  {/* 1. Hero Welcome Banner */}
                  <WelcomeBanner
                    userName={userName}
                    upcomingCount={upcomingAppointments.length}
                  />

                  {/* 2. 3 Metrics Cards Row */}
                  <StatCards
                    completedVisits={completedAppointments.length || 4}
                    upcomingConsultations={upcomingAppointments.length || 9}
                    labAnalyses={19}
                  />

                  {/* 3. Plans Done */}
                  <PlansCard
                    onAddPlan={() => {
                      setBookingInitialDate(undefined);
                      setSelectedDoctor(MOCK_DOCTORS[0]);
                    }}
                  />

                  {/* 4. Active Appointments Management Table/Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          My Consultations & Visits
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Manage your verified medical bookings with specialists
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab("doctors")}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          + Book Specialist
                        </motion.button>
                      </div>
                    </div>

                    {/* Appointments List */}
                    {filteredAppointments.length === 0 ? (
                      <div className="py-12 text-center">
                        <CalendarCheck className="size-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          No appointments match your search.
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-2 hover:underline"
                        >
                          Clear search filters
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredAppointments.map((app, idx) => (
                          <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.35, delay: idx * 0.05 }}
                            whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-700/60 transition-all hover:shadow-md"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="size-11 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0 font-bold text-sm">
                                {app.doctorName.replace("Dr. ", "").charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                    {app.doctorName}
                                  </h4>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      app.status === "Upcoming"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                        : app.status === "Completed"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                                    }`}
                                  >
                                    {app.status}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {app.specialty}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="size-3.5 text-slate-400" />
                                    {app.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="size-3.5 text-slate-400" />
                                    {app.time}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-700">
                              <div className="text-right">
                                <span className="text-xs text-slate-400 block font-medium">
                                  Consultation Fee
                                </span>
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  {app.fee || "₹1,500"}
                                </span>
                              </div>

                              {app.status === "Upcoming" && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleCancel(app.id)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                >
                                  <XCircle className="size-3.5" />
                                  <span>Cancel & Refund</span>
                                </motion.button>
                              )}

                              {app.status === "Completed" && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Link
                                    href="/doctors"
                                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors text-xs font-bold flex items-center gap-1"
                                  >
                                    Write Review
                                  </Link>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Right Panel Widget (Profile, Calendar, Timeline Schedule) */}
                <RightPanel
                  userName={userName}
                  userEmail={userEmail}
                  userImage={userImage}
                  appointments={appointments}
                  onCancelAppointment={handleCancel}
                  onBookDoctor={(dateIso) => {
                    setBookingInitialDate(dateIso);
                    setSelectedDoctor(MOCK_DOCTORS[0]);
                  }}
                />
              </motion.div>
            )}

            {/* Find Doctors Tab */}
            {activeTab === "doctors" && (
              <motion.div
                key="doctors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 mt-4"
              >
                <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Verified Doctors Directory
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Choose a specialist from the landing page to book a consultation
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ x: -2 }}
                      onClick={() => setActiveTab("overview")}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      ← Back to Dashboard
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {MOCK_DOCTORS.map((doc, idx) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-700/30 border border-slate-200/70 dark:border-slate-700/70 flex flex-col justify-between hover:shadow-lg transition-all group"
                      >
                        <div className="flex gap-3.5 items-start">
                          <img
                            src={doc.user.image}
                            alt={doc.user.name}
                            className="size-16 rounded-2xl object-cover ring-2 ring-blue-100 dark:ring-blue-900/40 group-hover:scale-105 transition-transform duration-300"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                              {doc.specialization}
                            </span>
                            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                              {doc.user.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {doc.hospitalName}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <span>{doc.experience} yrs exp</span>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {doc.satisfaction}% score
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            ₹{doc.fee?.toLocaleString() || "1,500"}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDoctor(doc)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                          >
                            Book Visit
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 mt-4"
              >
                <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        All Appointments
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Detailed log of upcoming, completed, and cancelled visits
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ x: -2 }}
                      onClick={() => setActiveTab("overview")}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      ← Back to Dashboard
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {appointments.map((app, idx) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-700/30 border border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                app.status === "Upcoming"
                                  ? "bg-blue-100 text-blue-700"
                                  : app.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            {app.doctorName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {app.specialty}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                            {app.date} at {app.time}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {app.fee || "₹1,500"}
                          </span>
                          {app.status === "Upcoming" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancel(app.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                            >
                              Cancel & Refund
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Medical Records / Consultations Placeholders */}
            {(activeTab === "records" || activeTab === "consultations") && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-slate-800/90 rounded-[28px] p-10 border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-center mt-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                >
                  <ShieldCheck className="size-14 text-blue-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeTab === "records"
                    ? "Medical Health Records"
                    : "Direct Consultations & Telehealth"}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 mb-6">
                  All patient records, laboratory test reports, and telehealth summaries are securely encrypted and linked to your MediBook account.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("overview")}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
                >
                  Return to Dashboard
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          initialDate={bookingInitialDate}
          onClose={() => {
            setSelectedDoctor(null);
            setBookingInitialDate(undefined);
          }}
        />
      )}
    </div>
  );
}

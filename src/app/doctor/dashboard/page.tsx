"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  CalendarCheck,
  Clock,
  User,
  LogOut,
  CheckCircle,
  XCircle,
  IndianRupee,
  Loader2,
  Pill,
  Activity,
  MessageSquare,
  Send,
  Building2,
  ShieldCheck,
  Stethoscope,
  Search,
  Plus,
  Phone,
  Mail,
  FileText,
  Sparkles,
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { DoctorTopBar } from "@/components/doctor/DoctorTopBar";
import { DoctorWelcomeBanner } from "@/components/doctor/DoctorWelcomeBanner";
import { DoctorStatCards } from "@/components/doctor/DoctorStatCards";
import { DoctorPatientCareModal } from "@/components/doctor/DoctorPatientCareModal";
import { DoctorRevenueModal } from "@/components/doctor/DoctorRevenueModal";
import { DoctorNotificationsDrawer } from "@/components/doctor/DoctorNotificationsDrawer";
import { DoctorProfileEditor } from "@/components/doctor/DoctorProfileEditor";
import { DoctorOPDQueueConsole } from "@/components/doctor/DoctorOPDQueueConsole";

export default function DoctorDashboardPage() {
  const router = useRouter();

  // Active navigation tab: "appointments" | "patients" | "chat" | "profile"
  const [activeTab, setActiveTab] = useState<"appointments" | "patients" | "chat" | "profile">("appointments");
  const [appointmentFilter, setAppointmentFilter] = useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("ALL");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals & Drawers
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // User session & Doctor profile state
  const [doctorName, setDoctorName] = useState<string>("Doctor");
  const [doctorEmail, setDoctorEmail] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("Specialist Physician");
  const [hospitalName, setHospitalName] = useState<string>("Apollo Specialty Hospital, Mumbai");
  const [consultationFee, setConsultationFee] = useState<number>(2000);
  const [doctorProfile, setDoctorProfile] = useState<any>({
    name: "Doctor",
    specialization: "Specialist Physician",
    qualifications: "MBBS, MD",
    experience: 10,
    hospitalName: "Apollo Specialty Hospital, Mumbai",
    roomNumber: "OPD Chamber 304",
    contactNumber: "+91 98200 00000",
    fee: 2000,
    bio: "",
    nextAvailable: "Today",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Appointments & Patients state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [patientsLoading, setPatientsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Patient Care Modal State
  const [selectedCarePatient, setSelectedCarePatient] = useState<any | null>(null);

  // Chat Tab State
  const [selectedChatPatientId, setSelectedChatPatientId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatSending, setChatSending] = useState<boolean>(false);

  // Load Session and verify DOCTOR role
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetch("/api/auth/session", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (!data?.user) {
          router.replace("/login");
          return;
        }
        if (data.user.role === "PATIENT") {
          router.replace("/dashboard");
          return;
        }
        if (data.user.name) setDoctorName(data.user.name);
        if (data.user.email) setDoctorEmail(data.user.email);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Session verification warning:", err?.message || err);
      });

    loadDoctorProfile(controller.signal);
    loadAppointments(controller.signal);
    loadPatients(controller.signal);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [router]);

  const loadDoctorProfile = (signal?: AbortSignal) => {
    fetch("/api/doctor/profile", { signal })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.profile) {
          setDoctorProfile(data.profile);
          if (data.profile.name) setDoctorName(data.profile.name);
          if (data.profile.email) setDoctorEmail(data.profile.email);
          if (data.profile.specialization) setSpecialization(data.profile.specialization);
          if (data.profile.hospitalName) setHospitalName(data.profile.hospitalName);
          if (data.profile.fee) setConsultationFee(data.profile.fee);
        }
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Could not fetch doctor profile:", err?.message || err);
      });
  };

  const loadAppointments = (signal?: AbortSignal) => {
    fetch("/api/appointments", { signal })
      .then((res) => {
        if (!res.ok) return { appointments: [] };
        return res.json();
      })
      .then((data) => {
        if (data?.appointments && Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
          if (data.appointments[0]?.specialty) {
            setSpecialization(data.appointments[0].specialty);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Could not fetch doctor appointments:", err?.message || err);
        setLoading(false);
      });
  };

  const loadPatients = (signal?: AbortSignal) => {
    setPatientsLoading(true);
    fetch("/api/doctor/patients", { signal })
      .then((res) => {
        if (!res.ok) return { patients: [] };
        return res.json();
      })
      .then((data) => {
        if (data?.patients && Array.isArray(data.patients)) {
          setPatients(data.patients);
          if (data.patients.length > 0 && !selectedChatPatientId) {
            setSelectedChatPatientId(data.patients[0].patientId);
          }
        }
        setPatientsLoading(false);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.warn("Could not fetch patients:", err?.message || err);
        setPatientsLoading(false);
      });
  };

  // Appointment status handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
        toast.success(`Appointment marked as ${newStatus}`);
        loadAppointments();
      } else {
        toast.error("Failed to update appointment status");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      toast.error("Network error while updating appointment");
    }
  };

  // Chat functionality
  const activeChatPatient = patients.find((p) => p.patientId === selectedChatPatientId) || patients[0];

  const fetchChatMessages = async () => {
    if (!activeChatPatient?.userId) return;
    try {
      const res = await fetch(`/api/messages?partnerId=${activeChatPatient.userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setChatMessages(data.messages);
        }
      }
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "chat" && activeChatPatient?.userId) {
      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 3500);
      return () => clearInterval(interval);
    }
  }, [activeTab, activeChatPatient?.userId]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatPatient?.userId || chatSending) return;

    const trimmed = chatInput.trim();
    setChatSending(true);

    const optimisticMsg = {
      id: "temp-" + Date.now(),
      senderRole: "DOCTOR",
      isMe: true,
      content: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, optimisticMsg]);
    setChatInput("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: activeChatPatient.userId,
          content: trimmed,
        }),
      });

      if (res.ok) {
        toast.success("Message sent to patient");
        fetchChatMessages();
      } else {
        toast.error("Failed to deliver message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Network error while sending message");
    } finally {
      setChatSending(false);
    }
  };

  // Computed metrics
  const totalEarnings = appointments.reduce((sum, app) => {
    const numericFee = parseInt(String(app.fee).replace(/[^0-9]/g, "")) || 0;
    return sum + numericFee;
  }, 0);

  const upcomingCount = appointments.filter(
    (a) => a.status === "Upcoming" || a.status === "SCHEDULED" || a.status === "CONFIRMED"
  ).length;

  const completedCount = appointments.filter(
    (a) => a.status === "Completed" || a.status === "COMPLETED"
  ).length;

  // Filtered appointments by search & tab
  const filteredAppointments = appointments.filter((app) => {
    if (appointmentFilter === "UPCOMING") {
      const isUp = app.status === "Upcoming" || app.status === "SCHEDULED" || app.status === "CONFIRMED";
      if (!isUp) return false;
    } else if (appointmentFilter === "COMPLETED") {
      const isComp = app.status === "Completed" || app.status === "COMPLETED";
      if (!isComp) return false;
    } else if (appointmentFilter === "CANCELLED") {
      const isCanc = app.status === "Cancelled" || app.status === "CANCELLED";
      if (!isCanc) return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.patientName?.toLowerCase().includes(q) ||
      app.condition?.toLowerCase().includes(q) ||
      app.specialty?.toLowerCase().includes(q)
    );
  });

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.latestCondition?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors p-3 sm:p-4 lg:p-6 flex flex-col">
      {/* Main App Container matching Patient Dashboard */}
      <div className="flex flex-1 gap-4 lg:gap-6 max-w-[1600px] mx-auto w-full">
        {/* Left Floating Blue Pill Sidebar */}
        <div className="hidden md:flex flex-col">
          <DoctorSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onQuickPrescribe={() => {
              if (patients.length > 0) {
                setSelectedCarePatient(patients[0]);
              } else {
                setActiveTab("patients");
              }
            }}
            doctorName={doctorName}
            patientCount={patients.length}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                className="w-64 bg-white dark:bg-slate-800 p-6 flex flex-col justify-between h-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <Stethoscope className="size-5 text-blue-600" /> MediBook
                    </span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab("appointments");
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === "appointments"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <CalendarCheck className="size-4" /> Appointments
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("patients");
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === "patients"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Pill className="size-4" /> Patient Care & Prescriptions
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("chat");
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === "chat"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <MessageSquare className="size-4" /> Live Chat
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("profile");
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === "profile"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Building2 className="size-4" /> Practice Profile
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold cursor-pointer"
                >
                  <LogOut className="size-4" /> Sign Out
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center / Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <DoctorTopBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            doctorName={doctorName}
            specialization={specialization}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onOpenChat={() => setActiveTab("chat")}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenProfile={() => setActiveTab("profile")}
            activeTab={activeTab}
          />

          {/* Main Body */}
          <div className="space-y-5 lg:space-y-6 flex-1">
            {/* 1. Hero Banner with matching gradient and animated vector artwork */}
            <DoctorWelcomeBanner
              doctorName={doctorName}
              specialization={specialization}
              upcomingCount={upcomingCount}
              totalPatients={patients.length}
            />

            {/* 2. Interactive Animated Metric Cards with drawing SVG sparklines */}
            <DoctorStatCards
              totalEarnings={totalEarnings}
              appointmentCount={appointments.length}
              upcomingCount={upcomingCount}
              patientCount={patients.length}
              completedCount={completedCount}
              onCardClick={(target) => {
                if (target === "revenue") {
                  setIsRevenueModalOpen(true);
                } else if (target === "appointments") {
                  setActiveTab("appointments");
                  setAppointmentFilter("ALL");
                } else if (target === "patients") {
                  setActiveTab("patients");
                } else if (target === "completed") {
                  setActiveTab("appointments");
                  setAppointmentFilter("COMPLETED");
                }
              }}
            />

            {/* TAB NAVIGATION PILLS */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === "appointments"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <CalendarCheck className="size-4" />
                <span>Appointments & Schedule</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === "appointments"
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {appointments.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("patients")}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === "patients"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <Pill className="size-4" />
                <span>Patient Care & Prescriptions</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === "patients"
                      ? "bg-white/20 text-white"
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {patients.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <MessageSquare className="size-4" />
                <span>Patient Consultations & Chat</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
                  Live
                </span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                <Building2 className="size-4" />
                <span>OPD Clinic & Fee Profile</span>
              </button>
            </div>

            {/* TAB 1: APPOINTMENTS & SCHEDULE */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <DoctorOPDQueueConsole />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
                >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <Sparkles className="size-3" /> Live OPD Queue Tracker
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Scheduled Patient Consultations & Queue
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Update status or click &quot;Prescribe & Vitals&quot; to push medications & vitals directly to the patient&apos;s dashboard.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700 text-xs">
                    {(["ALL", "UPCOMING", "COMPLETED", "CANCELLED"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setAppointmentFilter(filter)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          appointmentFilter === filter
                            ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        {filter.charAt(0) + filter.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-8 text-blue-600 animate-spin" />
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-16">
                    <CalendarCheck className="size-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No Consultations Found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      No appointments match the selected filter criteria.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredAppointments.map((app) => {
                      const isUpcoming =
                        app.status === "Upcoming" || app.status === "SCHEDULED" || app.status === "CONFIRMED";
                      const isCompleted = app.status === "Completed" || app.status === "COMPLETED";

                      const matchedPatient = patients.find((p) => p.patientId === app.patientId) || {
                        patientId: app.patientId,
                        userId: app.patientUserId,
                        name: app.patientName,
                        email: app.patientEmail,
                        latestCondition: app.condition,
                      };

                      return (
                        <motion.div
                          key={app.id}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          className="p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
                        >
                          <div className="flex items-start gap-3.5 flex-1">
                            <div className="size-11 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-base shrink-0">
                              {app.patientName.charAt(0)}
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span
                                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                    isUpcoming
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                                      : isCompleted
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                      : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                                  }`}
                                >
                                  {app.status}
                                </span>
                                {app.paymentStatus === "SUCCESS" && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    Paid
                                  </span>
                                )}
                                {app.tokenNumber && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                    {app.tokenNumber}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                {app.patientName}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Chief Complaint:{" "}
                                <strong className="text-slate-800 dark:text-slate-200">
                                  {app.condition || "General Consultation"}
                                </strong>
                              </p>

                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <CalendarCheck className="size-3.5 text-blue-500" /> {app.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="size-3.5 text-amber-500" /> {app.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building2 className="size-3.5 text-purple-500" /> {app.roomNumber || "OPD Chamber 304"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-700">
                            <div className="text-base font-black text-slate-900 dark:text-white">
                              {app.fee}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCarePatient(matchedPatient)}
                                className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 px-3.5 py-1.5 rounded-xl transition-colors border border-blue-200 dark:border-blue-800 cursor-pointer"
                              >
                                <Pill className="size-3.5 text-blue-600" /> Prescribe & Vitals
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedChatPatientId(matchedPatient.patientId);
                                  setActiveTab("chat");
                                }}
                                className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                              >
                                <MessageSquare className="size-3.5 text-blue-600" /> Chat
                              </motion.button>

                              {isUpcoming && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleStatusChange(app.id, "COMPLETED")}
                                    className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                                  >
                                    <CheckCircle className="size-3.5" /> Done
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleStatusChange(app.id, "CANCELLED")}
                                    className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 px-3 py-1.5 rounded-xl transition-colors border border-rose-200 dark:border-rose-800 cursor-pointer"
                                  >
                                    <XCircle className="size-3.5" /> Cancel
                                  </motion.button>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
            )}

            {/* TAB 2: PATIENT CARE & PRESCRIPTIONS */}
            {activeTab === "patients" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="size-3" /> EHR & Prescription Vault
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Patients Under Your Direct Clinical Care
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Select any patient to prescribe daily medications, enter clinical vitals, and write medical notes that appear on their dashboard.
                    </p>
                  </div>
                </div>

                {patientsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-8 text-blue-600 animate-spin" />
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-16">
                    <User className="size-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No Patients Found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Patients who book an appointment with you will appear in this roster.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredPatients.map((patient) => {
                      const activeMedsCount = patient.medications?.length || 0;
                      const recordsCount = patient.clinicalRecords?.length || 0;
                      const latestRec = patient.clinicalRecords?.[0];

                      return (
                        <motion.div
                          key={patient.patientId}
                          whileHover={{ y: -3, transition: { duration: 0.2 } }}
                          className="bg-white dark:bg-slate-800/90 p-5 sm:p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="size-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                                  {patient.name.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                    {patient.name}
                                  </h3>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <Mail className="size-3 text-slate-400" /> {patient.email}
                                  </p>
                                </div>
                              </div>

                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Active Patient
                              </span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2 mt-4 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Condition:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {patient.latestCondition}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Active Prescriptions:</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                  {activeMedsCount} medicine(s) prescribed
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Clinical Vitals:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  {recordsCount > 0
                                    ? `BP ${latestRec?.bloodPressure || "120/80"} • Pulse ${latestRec?.heartRate || "72"}`
                                    : "Pending examination"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 mt-4 flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setSelectedCarePatient(patient)}
                              className="flex-1 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Pill className="size-3.5" />
                              <span>Prescribe & Record Vitals</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedChatPatientId(patient.patientId);
                                setActiveTab("chat");
                              }}
                              className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <MessageSquare className="size-3.5 text-blue-600" />
                              <span>Chat</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: LIVE PATIENT CHAT & CONSULTATIONS */}
            {activeTab === "chat" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800/90 rounded-[28px] border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden flex flex-col h-[650px]"
              >
                {patients.length === 0 ? (
                  <div className="text-center py-20">
                    <MessageSquare className="size-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No Patients In Consultation Thread
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Once a patient books an appointment, you can chat with them right here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                    {/* Left: Patient List */}
                    <div className="lg:col-span-4 border-r border-slate-200/80 dark:border-slate-700 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
                        Appointed Patients ({filteredPatients.length})
                      </h3>

                      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                        {filteredPatients.map((p) => {
                          const isSelected = p.patientId === selectedChatPatientId;
                          return (
                            <div
                              key={p.patientId}
                              onClick={() => setSelectedChatPatientId(p.patientId)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                                  : "bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:border-slate-300 text-slate-900 dark:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                  }`}
                                >
                                  {p.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold leading-tight">{p.name}</h4>
                                  <p
                                    className={`text-[11px] mt-0.5 line-clamp-1 ${
                                      isSelected ? "text-blue-100" : "text-slate-400"
                                    }`}
                                  >
                                    {p.latestCondition || "Patient Consultation"}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight
                                className={`size-4 ${
                                  isSelected ? "text-white" : "text-slate-400"
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Message Stream */}
                    <div className="lg:col-span-8 flex flex-col justify-between h-full">
                      {/* Chat Header */}
                      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {activeChatPatient?.name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                              {activeChatPatient?.name || "Select a Patient"}
                              <span className="size-2 rounded-full bg-emerald-500" title="Connected" />
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {activeChatPatient?.email} • Chief Complaint: {activeChatPatient?.latestCondition}
                            </p>
                          </div>
                        </div>

                        {activeChatPatient && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCarePatient(activeChatPatient)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Pill className="size-3.5" /> Prescribe Meds
                          </motion.button>
                        )}
                      </div>

                      {/* Message Thread */}
                      <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-950/20">
                        {chatMessages.length === 0 ? (
                          <div className="text-center py-16">
                            <MessageSquare className="size-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              No messages yet in this consultation thread. Send medical instructions or advice below.
                            </p>
                          </div>
                        ) : (
                          chatMessages.map((msg, i) => {
                            const isDoctor = msg.senderRole === "DOCTOR" || msg.isMe;
                            return (
                              <div
                                key={msg.id || i}
                                className={`flex flex-col ${isDoctor ? "items-end" : "items-start"}`}
                              >
                                <div
                                  className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                                    isDoctor
                                      ? "bg-blue-600 text-white rounded-br-xs"
                                      : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-600 rounded-bl-xs"
                                  }`}
                                >
                                  {msg.content}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                  {isDoctor ? `Dr. ${doctorName} • ` : "Patient • "}
                                  {msg.time}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Chat Input Bar */}
                      <form
                        onSubmit={handleSendChatMessage}
                        className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-700/80 bg-white dark:bg-slate-800 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={`Send clinical advice or instructions to ${activeChatPatient?.name || "patient"}...`}
                          className="flex-1 h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={chatSending || !chatInput.trim()}
                          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="size-4" />
                          <span className="hidden sm:inline">Send</span>
                        </motion.button>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: CLINIC PROFILE & SETTINGS */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl space-y-6"
              >
                <DoctorProfileEditor
                  initialProfile={doctorProfile}
                  onProfileUpdated={(updated) => {
                    setDoctorProfile(updated);
                    if (updated.name) setDoctorName(updated.name);
                    if (updated.specialization) setSpecialization(updated.specialization);
                    if (updated.hospitalName) setHospitalName(updated.hospitalName);
                    if (updated.fee) setConsultationFee(updated.fee);
                    loadDoctorProfile();
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Care Modal for Prescriptions and Clinical Vitals */}
      <AnimatePresence>
        {selectedCarePatient && (
          <DoctorPatientCareModal
            patient={selectedCarePatient}
            onClose={() => setSelectedCarePatient(null)}
            onSuccess={() => {
              loadPatients();
              loadAppointments();
            }}
          />
        )}
      </AnimatePresence>

      {/* Practice Revenue & Bank Settlement Modal */}
      <AnimatePresence>
        {isRevenueModalOpen && (
          <DoctorRevenueModal
            isOpen={isRevenueModalOpen}
            onClose={() => setIsRevenueModalOpen(false)}
            totalEarnings={totalEarnings}
            appointments={appointments}
            doctorName={doctorName}
            specialization={specialization}
          />
        )}
      </AnimatePresence>

      {/* Activity Center & Clinical Notifications Drawer */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <DoctorNotificationsDrawer
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            patientCount={patients.length}
            upcomingCount={upcomingCount}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { DoctorTopBar } from "@/components/doctor/DoctorTopBar";
import { DoctorScheduleManager } from "@/components/doctor/DoctorScheduleManager";
import { DoctorNotificationsDrawer } from "@/components/doctor/DoctorNotificationsDrawer";
import { SimulatorFloatingButton } from "@/components/notifications/SimulatorFloatingButton";

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"appointments" | "patients" | "chat" | "profile">("appointments");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Vikramaditya");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data?.user) {
          router.replace("/login");
          return;
        }
        if (data.user.role === "PATIENT") {
          router.replace("/dashboard");
          return;
        }
        if (data.user.name) setDoctorName(data.user.name);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const handleTabChange = (tab: "appointments" | "patients" | "chat" | "profile") => {
    setActiveTab(tab);
    router.push("/doctor/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-3 sm:p-6 lg:p-8 flex gap-6">
      {/* Doctor Sidebar */}
      <DoctorSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        doctorName={doctorName}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Top bar */}
        <DoctorTopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          doctorName={doctorName}
          specialization="Senior Cardiologist"
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => router.push("/doctor/dashboard")}
        />

        {/* Schedule Manager Component */}
        <DoctorScheduleManager />
      </main>

      {/* Notifications Drawer */}
      <DoctorNotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={handleTabChange}
      />

      {/* WhatsApp / SMS Health Dispatch Simulator Quick Launch */}
      <SimulatorFloatingButton />
    </div>
  );
}

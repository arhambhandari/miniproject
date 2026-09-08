"use client";

import React, { useState } from "react";
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Lock, 
  CheckCircle2,
  AlertTriangle,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface SettingsViewProps {
  userName?: string;
  userEmail?: string;
  onReturnToOverview: () => void;
}

export function SettingsView({
  userName = "Rahul Sharma",
  userEmail = "rahul.sharma@example.com",
  onReturnToOverview,
}: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<"profile" | "notifications" | "security" | "billing">("profile");

  // Form states
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState("+91 98765 43210");
  const [dob, setDob] = useState("1986-07-17");
  const [bloodGroup, setBloodGroup] = useState("A(II) Rh+");
  const [city, setCity] = useState("Mumbai, Maharashtra");
  const [emergencyContact, setEmergencyContact] = useState("Priya Sharma (+91 98765 00000)");

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [labAlerts, setLabAlerts] = useState(true);
  const [doctorMessages, setDoctorMessages] = useState(true);

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings and patient profile successfully saved!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 mt-2"
    >
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            Account & Preferences
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Account Settings
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your personal profile, medical emergency details, security, and notification alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToOverview}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-[28px] border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/80 p-4 space-y-1 shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
          {[
            { id: "profile", label: "Patient Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security & Login", icon: Shield },
            { id: "billing", label: "Payments & Billing", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Body */}
        <div className="flex-1 p-6 lg:p-8">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            {/* 1. Patient Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Health Details</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Used by doctors during clinical consultations and emergency care.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Blood Group</label>
                    <input
                      type="text"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">City & Region</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Emergency Contact (Name & Phone)
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Designated relative or caregiver contacted in emergency situations.</p>
                </div>
              </div>
            )}

            {/* 2. Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Alerts & Reminders</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Choose how and when MediBook notifies you about your healthcare.</p>
                </div>

                <div className="space-y-3.5">
                  {[
                    { label: "Appointment Email Confirmations", desc: "Receive email receipts and booking confirmations.", state: emailAlerts, setState: setEmailAlerts },
                    { label: "SMS / WhatsApp Reminders", desc: "Receive a text reminder 1 hour prior to your scheduled consultation.", state: smsReminders, setState: setSmsReminders },
                    { label: "Diagnostic Lab Reports", desc: "Immediate notification when a doctor verifies your lab analysis.", state: labAlerts, setState: setLabAlerts },
                    { label: "Direct Doctor Messages", desc: "Notify when a specialist replies to your clinical consultation thread.", state: doctorMessages, setState: setDoctorMessages },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{item.label}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => item.setState(!item.state)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          item.state ? "bg-blue-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                        }`}
                      >
                        <motion.div layout className="size-4 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Security Section */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security & Encryption</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage account credentials and two-factor authentication.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 flex items-start gap-3">
                  <Shield className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">HIPAA & GDPR Compliant Security</h4>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                      Your clinical health data and appointment history are stored with end-to-end 256-bit encryption.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Two-Factor Authentication (2FA)</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Require an SMS OTP when logging into new devices.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        twoFactor ? "bg-blue-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                      }`}
                    >
                      <motion.div layout className="size-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">Account Password</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Last updated recently.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Password reset link sent to your registered email.")}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Billing & Payments Section */}
            {activeSection === "billing" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Methods & Invoices</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage payment channels for doctor appointments.</p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      UPI
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Razorpay Instant UPI & Cards</h4>
                      <p className="text-[11px] text-slate-500">Google Pay, PhonePe, BHIM, RuPay, Visa, Mastercard</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Default Currency</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Indian Rupee (INR ₹)</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Save className="size-4" /> Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

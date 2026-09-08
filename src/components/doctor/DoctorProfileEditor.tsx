"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Building2,
  Stethoscope,
  IndianRupee,
  Phone,
  Mail,
  GraduationCap,
  Clock,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface DoctorProfileData {
  name: string;
  specialization: string;
  qualifications: string;
  experience: number;
  hospitalName: string;
  roomNumber?: string;
  contactNumber: string;
  fee: number;
  bio: string;
  nextAvailable: string;
  email?: string;
}

interface DoctorProfileEditorProps {
  initialProfile: DoctorProfileData;
  onProfileUpdated: (updated: DoctorProfileData) => void;
}

export function DoctorProfileEditor({
  initialProfile,
  onProfileUpdated,
}: DoctorProfileEditorProps) {
  const [formData, setFormData] = useState<DoctorProfileData>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!hasChanges) {
      setFormData(initialProfile);
    }
  }, [initialProfile, hasChanges]);

  const handleChange = (field: keyof DoctorProfileData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      setHasChanges(true);
      return updated;
    });
  };

  const handleReset = () => {
    setFormData(initialProfile);
    setHasChanges(false);
    toast.info("Profile changes reset to current saved state.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Practice Profile & Clinic Details updated successfully!");
        setHasChanges(false);
        onProfileUpdated(data.profile);
      } else {
        toast.error(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Network error while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-800/90 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20">
              {formData.name.replace(/^Dr\.\s*/, "").charAt(0) || "D"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {formData.name.startsWith("Dr.") ? formData.name : `Dr. ${formData.name}`}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="size-3" /> NMC & ABHA Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {formData.specialization} • {formData.experience} Years Clinical Experience
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                {formData.hospitalName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {hasChanges && (
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="size-3.5" />
              <span>{saving ? "Saving Changes..." : "Save Practice Profile"}</span>
            </button>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
          {/* Doctor Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="size-3.5 text-blue-600" /> Full Practitioner Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Dr. Aarav Mehta"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Stethoscope className="size-3.5 text-blue-600" /> Medical Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => handleChange("specialization", e.target.value)}
              placeholder="e.g. NEURO-ONCOLOGY, CARDIOLOGY"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-blue-600" /> Academic Qualifications & Fellowships
            </label>
            <input
              type="text"
              value={formData.qualifications}
              onChange={(e) => handleChange("qualifications", e.target.value)}
              placeholder="e.g. MBBS, MS, MCh (AIIMS New Delhi)"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="size-3.5 text-blue-600" /> Years of Clinical Experience
            </label>
            <input
              type="number"
              value={formData.experience}
              onChange={(e) => handleChange("experience", Number(e.target.value))}
              placeholder="e.g. 15"
              min="1"
              max="60"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Hospital Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-blue-600" /> Hospital / Healthcare Center
            </label>
            <input
              type="text"
              value={formData.hospitalName}
              onChange={(e) => handleChange("hospitalName", e.target.value)}
              placeholder="e.g. AIIMS Super Specialty Hospital, New Delhi"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* OPD Chamber / Room */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="size-3.5 text-blue-600" /> OPD Chamber / Consultation Suite
            </label>
            <input
              type="text"
              value={formData.roomNumber || "OPD Chamber 304"}
              onChange={(e) => handleChange("roomNumber", e.target.value)}
              placeholder="e.g. OPD Chamber 304, Specialist Wing"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Consultation Fee */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <IndianRupee className="size-3.5 text-emerald-600" /> In-Clinic Consultation Fee (₹)
            </label>
            <input
              type="number"
              value={formData.fee}
              onChange={(e) => handleChange("fee", Number(e.target.value))}
              placeholder="e.g. 2000"
              min="100"
              step="50"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="size-3.5 text-blue-600" /> Official OPD Contact Number
            </label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
              placeholder="e.g. +91 98201 44521"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Next Available Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-blue-600" /> Next Available OPD Slot
            </label>
            <input
              type="text"
              value={formData.nextAvailable}
              onChange={(e) => handleChange("nextAvailable", e.target.value)}
              placeholder="e.g. OCT 12 or Today"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Registered Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="size-3.5 text-blue-600" /> Verified Login Email
            </label>
            <input
              type="email"
              value={formData.email || ""}
              disabled
              className="w-full h-11 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
          </div>

          {/* Bio / About */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="size-3.5 text-blue-600" /> Clinical Background & Expertise Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              placeholder="Describe clinical specializations, patient care approach, hospital affiliations..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

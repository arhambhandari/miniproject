"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Heart, ShieldCheck, AlertTriangle, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { FamilyMember, FamilyRelationship } from "@/types";

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: FamilyMember) => void;
}

const RELATIONSHIPS: FamilyRelationship[] = [
  "Father",
  "Mother",
  "Spouse",
  "Son",
  "Daughter",
  "Sibling",
  "Other",
];

const BLOOD_GROUPS = ["A(II) Rh+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function AddFamilyMemberModal({
  isOpen,
  onClose,
  onAddMember,
}: AddFamilyMemberModalProps) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<FamilyRelationship>("Father");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [bloodGroup, setBloodGroup] = useState("B+ Rh+");
  const [uhid, setUhid] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronicConditions, setChronicConditions] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter the family member's full name");
      return;
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 125) {
      toast.error("Please enter a valid age (1-120)");
      return;
    }

    setSubmitting(true);

    const generatedUhid = uhid.trim() || `MB-${Math.floor(10000 + Math.random() * 90000)}`;
    const parsedAllergies = allergies.trim()
      ? allergies.split(",").map((s) => s.trim()).filter(Boolean)
      : ["None"];
    const parsedConditions = chronicConditions.trim()
      ? chronicConditions.split(",").map((s) => s.trim()).filter(Boolean)
      : ["None"];

    const avatarUrl =
      gender === "Female"
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400";

    const newMember: FamilyMember = {
      id: `fm_${Date.now()}`,
      name: name.trim(),
      relationship,
      age: parsedAge,
      gender,
      bloodGroup,
      uhid: generatedUhid,
      abhaId: `91-4820-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      allergies: parsedAllergies,
      chronicConditions: parsedConditions,
      avatar: avatarUrl,
      isPrimary: false,
    };

    setTimeout(() => {
      onAddMember(newMember);
      setSubmitting(false);
      toast.success(`${newMember.name} (${relationship}) added to your Family Health Vault!`);
      setName("");
      setAge("");
      setAllergies("");
      setChronicConditions("");
      onClose();
    }, 250);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-slate-50/50 to-purple-50/50 dark:from-slate-800 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-700/60">
                <Users className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Family Member
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage medical records, appointments, & vitals for dependents
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              data-testid="close-add-family-modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                data-testid="input-family-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Relationship & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Relationship *
                </label>
                <select
                  value={relationship}
                  data-testid="select-family-relationship"
                  onChange={(e) => setRelationship(e.target.value as FamilyRelationship)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  data-testid="input-family-age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 68"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Gender & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Gender *
                </label>
                <select
                  value={gender}
                  data-testid="select-family-gender"
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  data-testid="select-family-blood-group"
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Known Allergies */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Known Drug / Food Allergies (Optional)
              </label>
              <input
                type="text"
                data-testid="input-family-allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Aspirin, Penicillin (or leave blank for None)"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Chronic Conditions */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Pre-Existing / Chronic Conditions (Optional)
              </label>
              <input
                type="text"
                data-testid="input-family-conditions"
                value={chronicConditions}
                onChange={(e) => setChronicConditions(e.target.value)}
                placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                data-testid="submit-add-family-btn"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <UserPlus className="size-4" />
                {submitting ? "Adding Dependent..." : "Save Family Member"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Edit3,
  Share2,
  AlertTriangle,
  ShieldCheck,
  HeartHandshake,
  Check,
  Lock,
  Users,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageContext";
import type { FamilyMember } from "@/types";

interface PatientProfileCardProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  activeMember?: FamilyMember;
  familyMembers?: FamilyMember[];
  onSelectMember?: (memberId: string) => void;
  onOpenAddFamilyModal?: () => void;
  onOpenSettings?: () => void;
}

export function PatientProfileCard({
  userName = "Rahul Sharma",
  userEmail = "rahul.sharma@example.com",
  userImage,
  activeMember,
  familyMembers = [],
  onSelectMember,
  onOpenAddFamilyModal,
  onOpenSettings,
}: PatientProfileCardProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const displayName = activeMember?.name || userName;
  const uhid = activeMember?.uhid || "MB-98412";
  const abhaId = activeMember?.abhaId || "91-4820-9841-2026";
  const bloodGroup = activeMember?.bloodGroup || "A(II) Rh+";
  const relationship = activeMember?.relationship || "Self";
  const age = activeMember?.age || 38;
  const allergies = activeMember?.allergies?.join(", ") || "Penicillin, Sulfa";
  const conditions = activeMember?.chronicConditions?.join(", ") || "None";
  const avatar = activeMember?.avatar || userImage;

  const handleCopyHealthID = () => {
    const text = `PATIENT HEALTH PROFILE:\nName: ${displayName} (${relationship})\nEmail: ${userEmail}\nABHA Health ID: ${abhaId}\nUHID: ${uhid}\nBlood Group: ${bloodGroup}\nAge: ${age} Years\nKnown Allergies: ${allergies}\nChronic Conditions: ${conditions}\nCaregiver Contact: Priya Sharma (Wife) (+91 98765 00000)\nInsurance: Star Health Optima (TPA Synced)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(
        language === "hi"
          ? `${displayName} का स्वास्थ्य प्रोफ़ाइल और ABHA आईडी कॉपी की गई।`
          : `${displayName}'s Health Profile & ABHA ID copied to clipboard.`
      );
    } else {
      toast.success(language === "hi" ? "प्रोफ़ाइल कॉपी की गई।" : "Patient Health Profile copied.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-[28px] bg-white dark:bg-slate-800/90 p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4"
    >
      {/* Top Header & Family Switcher Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Users className="size-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Family Health Vault
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {familyMembers.length > 0 ? `${familyMembers.length} Profiles Synced` : "Primary Account"}
            </span>
          </div>
        </div>

        {onOpenAddFamilyModal && (
          <button
            onClick={onOpenAddFamilyModal}
            data-testid="profile-card-add-family-btn"
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-xl border border-blue-200/60 dark:border-blue-800 flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
          >
            <UserPlus className="size-3" />
            + Add
          </button>
        )}
      </div>

      {/* Family Member Quick Selector Pills */}
      {familyMembers.length > 0 && onSelectMember && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none" data-testid="family-member-pills-row">
          {familyMembers.map((member) => {
            const isSelected = activeMember?.id === member.id;
            return (
              <button
                key={member.id}
                data-testid={`profile-family-pill-${member.id}`}
                onClick={() => onSelectMember(member.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{member.name.split(" ")[0]}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-normal ${isSelected ? "bg-blue-700 text-blue-100" : "bg-slate-200/70 dark:bg-slate-600 text-slate-500 dark:text-slate-300"}`}>
                  {member.relationship}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Patient Avatar & Name */}
      <div className="flex items-center gap-3.5 pb-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative size-14 rounded-2xl overflow-hidden ring-4 ring-blue-50 dark:ring-blue-900/40 shadow-sm shrink-0"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-0.5 right-0.5 size-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate" data-testid="profile-card-patient-name">
              {displayName}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
              {relationship}
            </span>
          </div>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {t("verified_patient")} • {age} yrs
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            UHID: <span className="font-mono font-medium text-slate-600 dark:text-slate-300" data-testid="profile-card-uhid">{uhid}</span>
          </p>
        </div>
      </div>

      {/* Health Vitals Summary Pills */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">
            Age & Gender
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {age}y • {activeMember?.gender?.charAt(0) || "M"}
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">
            Blood Group
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200" data-testid="profile-card-blood-group">
            {bloodGroup}
          </span>
        </div>
        <div
          className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-2 relative group cursor-pointer"
          title="Blood Pressure is doctor-controlled"
          onClick={() => toast.info("🔒 Clinical vitals are verified during hospital OPD examinations.")}
        >
          <span className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center justify-center gap-0.5 font-medium">
            <ShieldCheck className="size-2.5 text-emerald-500" /> ABHA ID
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block">
            Synced
          </span>
        </div>
      </div>

      {/* Clinical & Caregiver Profile Details */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <AlertTriangle className="size-3 text-amber-500" /> Drug Allergies:
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md text-[11px] truncate max-w-[150px]" title={allergies}>
            {allergies}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <HeartHandshake className="size-3 text-blue-500" /> Chronic Conditions:
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate max-w-[140px]" title={conditions}>
            {conditions}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Insurance / TPA:
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
            Star Health (Linked)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {onOpenSettings && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSettings}
            className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Edit3 className="size-3.5" />
            <span>Edit Profile</span>
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyHealthID}
          className={`py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            !onOpenSettings ? "col-span-2" : ""
          }`}
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="size-3.5 text-slate-500" />
              <span>Share Health ID</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

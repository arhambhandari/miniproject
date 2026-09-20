"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronDown, Check, UserPlus, Shield, Heart } from "lucide-react";
import type { FamilyMember } from "@/types";

interface FamilyProfileSwitcherProps {
  members: FamilyMember[];
  activeMemberId: string;
  onSelectMember: (memberId: string) => void;
  onOpenAddModal: () => void;
  compact?: boolean;
}

export function FamilyProfileSwitcher({
  members,
  activeMemberId,
  onSelectMember,
  onOpenAddModal,
  compact = false,
}: FamilyProfileSwitcherProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeMember = members.find((m) => m.id === activeMemberId) || members[0];

  const getRelationshipBadgeColor = (rel: string) => {
    switch (rel) {
      case "Self":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Father":
      case "Mother":
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Spouse":
        return "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "Son":
      case "Daughter":
        return "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      default:
        return "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          data-testid="family-switcher-compact-btn"
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
        >
          <div className="size-6 rounded-lg overflow-hidden bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300">
            {activeMember?.avatar ? (
              <img src={activeMember.avatar} alt={activeMember.name} className="w-full h-full object-cover" />
            ) : (
              activeMember?.name?.charAt(0) || "U"
            )}
          </div>
          <span className="max-w-[90px] sm:max-w-[120px] truncate">{activeMember?.name}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-md border font-bold ${getRelationshipBadgeColor(activeMember?.relationship || "Self")}`}>
            {activeMember?.relationship}
          </span>
          <ChevronDown className="size-3 text-slate-400" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xl z-40 p-2 overflow-hidden"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span>Family Health Vault</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{members.length} Members</span>
                </div>

                <div className="py-1 max-h-56 overflow-y-auto space-y-1">
                  {members.map((member) => {
                    const isSelected = member.id === activeMemberId;
                    return (
                      <button
                        key={member.id}
                        data-testid={`family-member-option-${member.id}`}
                        onClick={() => {
                          onSelectMember(member.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-semibold"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="size-8 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              member.name.charAt(0)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate leading-tight">{member.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              {member.relationship} • {member.age}y • {member.bloodGroup}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check className="size-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAddModal();
                    }}
                    data-testid="add-family-member-btn"
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <UserPlus className="size-3.5" />
                    + Add Family Member
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Expanded View (Full horizontal pill carousel / tabs)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Patient Profile
          </span>
        </div>
        <button
          onClick={onOpenAddModal}
          data-testid="add-family-member-pill-btn"
          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          <UserPlus className="size-3" />
          + Add Dependent
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {members.map((member) => {
          const isSelected = member.id === activeMemberId;
          return (
            <button
              key={member.id}
              data-testid={`family-pill-${member.id}`}
              onClick={() => onSelectMember(member.id)}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-sm ring-2 ring-blue-500/20"
                  : "bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/70 hover:bg-white dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="size-7 rounded-xl overflow-hidden bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 shadow-2xs">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold flex items-center justify-center h-full">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${getRelationshipBadgeColor(
                    member.relationship
                  )}`}
                >
                  {member.relationship}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {member.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {member.age} yrs • {member.bloodGroup}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

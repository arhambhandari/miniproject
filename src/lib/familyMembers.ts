import type { FamilyMember } from "@/types";

export const DEFAULT_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: "fm_self",
    name: "Rahul Sharma",
    relationship: "Self",
    age: 38,
    gender: "Male",
    bloodGroup: "A(II) Rh+",
    uhid: "MB-98412",
    abhaId: "91-4820-9841-2026",
    allergies: ["Penicillin", "Sulfa"],
    chronicConditions: ["None"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    isPrimary: true,
  },
  {
    id: "fm_father",
    name: "Ramesh Sharma",
    relationship: "Father",
    age: 68,
    gender: "Male",
    bloodGroup: "B+ Rh+",
    uhid: "MB-77102",
    abhaId: "91-4820-1122-3344",
    allergies: ["Aspirin"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    isPrimary: false,
  },
  {
    id: "fm_spouse",
    name: "Priya Sharma",
    relationship: "Spouse",
    age: 35,
    gender: "Female",
    bloodGroup: "O+ Rh+",
    uhid: "MB-88231",
    abhaId: "91-4820-5566-7788",
    allergies: ["None"],
    chronicConditions: ["None"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    isPrimary: false,
  },
  {
    id: "fm_daughter",
    name: "Aanya Sharma",
    relationship: "Daughter",
    age: 6,
    gender: "Female",
    bloodGroup: "A+ Rh+",
    uhid: "MB-99304",
    abhaId: "91-4820-9900-1122",
    allergies: ["Dust Mites"],
    chronicConditions: ["Pediatric Asthma (Mild)"],
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    isPrimary: false,
  },
];

export const MEMBER_MEDICATIONS_MAP: Record<string, any[]> = {
  fm_self: [
    {
      id: "med_1",
      name: "Atorvastatin",
      dosage: "20 mg",
      instruction: "1 tablet after breakfast for cholesterol control",
      timeSlot: "Morning",
      scheduledTime: "08:00 AM",
      taken: true,
      takenAt: "08:15 AM",
      daysRemaining: 5,
    },
    {
      id: "med_2",
      name: "Vitamin D3",
      dosage: "60,000 IU",
      instruction: "1 softgel post-lunch for bone & immune health",
      timeSlot: "Afternoon",
      scheduledTime: "01:30 PM",
      taken: true,
      takenAt: "01:45 PM",
      daysRemaining: 24,
    },
    {
      id: "med_3",
      name: "Telmisartan",
      dosage: "40 mg",
      instruction: "1 tablet at bedtime for blood pressure maintenance",
      timeSlot: "Night",
      scheduledTime: "09:00 PM",
      taken: false,
      daysRemaining: 18,
    },
  ],
  fm_father: [
    {
      id: "med_f1",
      name: "Telmisartan",
      dosage: "40 mg",
      instruction: "1 tablet at night for blood pressure control",
      timeSlot: "Night",
      scheduledTime: "09:00 PM",
      taken: false,
      daysRemaining: 14,
    },
    {
      id: "med_f2",
      name: "Metformin ER",
      dosage: "500 mg",
      instruction: "1 tablet with evening meal for blood sugar control",
      timeSlot: "Night",
      scheduledTime: "08:30 PM",
      taken: true,
      takenAt: "08:40 PM",
      daysRemaining: 21,
    },
    {
      id: "med_f3",
      name: "Amlodipine",
      dosage: "5 mg",
      instruction: "1 tablet after breakfast for cardiovascular stability",
      timeSlot: "Morning",
      scheduledTime: "08:30 AM",
      taken: true,
      takenAt: "08:35 AM",
      daysRemaining: 12,
    },
  ],
  fm_spouse: [
    {
      id: "med_s1",
      name: "Calcium + Vit D3",
      dosage: "500 mg",
      instruction: "1 tablet daily after breakfast",
      timeSlot: "Morning",
      scheduledTime: "09:00 AM",
      taken: true,
      takenAt: "09:10 AM",
      daysRemaining: 28,
    },
    {
      id: "med_s2",
      name: "Iron & Folic Acid",
      dosage: "100 mg",
      instruction: "1 capsule after dinner with citrus juice",
      timeSlot: "Night",
      scheduledTime: "09:30 PM",
      taken: false,
      daysRemaining: 15,
    },
  ],
  fm_daughter: [
    {
      id: "med_d1",
      name: "Pediatric Multivitamin Drops",
      dosage: "5 ml",
      instruction: "5 ml daily post-breakfast with milk",
      timeSlot: "Morning",
      scheduledTime: "08:00 AM",
      taken: true,
      takenAt: "08:20 AM",
      daysRemaining: 30,
    },
    {
      id: "med_d2",
      name: "Levolin Inhaler (Puff)",
      dosage: "50 mcg",
      instruction: "1 puff as needed during wheezing or allergen trigger",
      timeSlot: "Night",
      scheduledTime: "08:30 PM",
      taken: false,
      daysRemaining: 45,
    },
  ],
};

export const MEMBER_VITALS_MAP: Record<string, any[]> = {
  fm_self: [
    {
      id: "bp",
      name: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "Normal",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-900/30",
      lastChecked: "Doctor Verified (OPD Exam)",
      isDoctorOnly: true,
    },
    {
      id: "pulse",
      name: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "Optimal",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
      lastChecked: "Today, 9:30 AM",
    },
    {
      id: "glucose",
      name: "Blood Sugar (Fasting)",
      value: "94",
      unit: "mg/dL",
      status: "Normal",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      lastChecked: "Yesterday",
    },
    {
      id: "spo2",
      name: "Oxygen (SpO2)",
      value: "99",
      unit: "%",
      status: "Optimal",
      color: "text-blue-600 dark:blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      lastChecked: "Today, 9:30 AM",
    },
    {
      id: "bmi",
      name: "Body Weight & BMI",
      value: "68 kg",
      unit: "22.5 BMI",
      status: "Normal",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
      lastChecked: "Last week",
    },
    {
      id: "temp",
      name: "Body Temperature",
      value: "98.4",
      unit: "°F",
      status: "Normal",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/30",
      lastChecked: "Today, 9:30 AM",
    },
  ],
  fm_father: [
    {
      id: "bp",
      name: "Blood Pressure",
      value: "138/88",
      unit: "mmHg",
      status: "Attention",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-900/30",
      lastChecked: "Doctor Verified (Cardiology Review)",
      isDoctorOnly: true,
    },
    {
      id: "pulse",
      name: "Heart Rate",
      value: "68",
      unit: "bpm",
      status: "Optimal",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
      lastChecked: "Today, 8:00 AM",
    },
    {
      id: "glucose",
      name: "Blood Sugar (Fasting)",
      value: "136",
      unit: "mg/dL",
      status: "Attention",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      lastChecked: "Today, Fasting",
    },
    {
      id: "spo2",
      name: "Oxygen (SpO2)",
      value: "96",
      unit: "%",
      status: "Normal",
      color: "text-blue-600 dark:blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      lastChecked: "Today, 8:00 AM",
    },
    {
      id: "bmi",
      name: "Body Weight & BMI",
      value: "74 kg",
      unit: "25.1 BMI",
      status: "Attention",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
      lastChecked: "Sep 15, 2026",
    },
    {
      id: "temp",
      name: "Body Temperature",
      value: "98.6",
      unit: "°F",
      status: "Normal",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/30",
      lastChecked: "Today, 8:00 AM",
    },
  ],
  fm_spouse: [
    {
      id: "bp",
      name: "Blood Pressure",
      value: "114/76",
      unit: "mmHg",
      status: "Optimal",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-900/30",
      lastChecked: "OPD Wellness Check",
      isDoctorOnly: true,
    },
    {
      id: "pulse",
      name: "Heart Rate",
      value: "76",
      unit: "bpm",
      status: "Optimal",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
      lastChecked: "Yesterday, 6:00 PM",
    },
    {
      id: "glucose",
      name: "Blood Sugar (Fasting)",
      value: "88",
      unit: "mg/dL",
      status: "Optimal",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      lastChecked: "Sep 18, 2026",
    },
    {
      id: "spo2",
      name: "Oxygen (SpO2)",
      value: "99",
      unit: "%",
      status: "Optimal",
      color: "text-blue-600 dark:blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      lastChecked: "Yesterday, 6:00 PM",
    },
    {
      id: "bmi",
      name: "Body Weight & BMI",
      value: "56 kg",
      unit: "21.0 BMI",
      status: "Optimal",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
      lastChecked: "Sep 10, 2026",
    },
    {
      id: "temp",
      name: "Body Temperature",
      value: "98.2",
      unit: "°F",
      status: "Normal",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/30",
      lastChecked: "Yesterday, 6:00 PM",
    },
  ],
  fm_daughter: [
    {
      id: "bp",
      name: "Blood Pressure",
      value: "100/65",
      unit: "mmHg",
      status: "Normal",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-900/30",
      lastChecked: "Pediatric Wellness Check",
      isDoctorOnly: true,
    },
    {
      id: "pulse",
      name: "Heart Rate",
      value: "92",
      unit: "bpm",
      status: "Optimal",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
      lastChecked: "Today, 9:00 AM",
    },
    {
      id: "glucose",
      name: "Blood Sugar (Random)",
      value: "84",
      unit: "mg/dL",
      status: "Normal",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
      lastChecked: "Aug 20, 2026",
    },
    {
      id: "spo2",
      name: "Oxygen (SpO2)",
      value: "100",
      unit: "%",
      status: "Optimal",
      color: "text-blue-600 dark:blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      lastChecked: "Today, 9:00 AM",
    },
    {
      id: "bmi",
      name: "Body Weight & Growth",
      value: "20.5 kg",
      unit: "50th Percentile",
      status: "Optimal",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
      lastChecked: "Sep 01, 2026",
    },
    {
      id: "temp",
      name: "Body Temperature",
      value: "98.4",
      unit: "°F",
      status: "Normal",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/30",
      lastChecked: "Today, 9:00 AM",
    },
  ],
};

const STORAGE_KEY = "medibook_family_members";
const ACTIVE_MEMBER_KEY = "medibook_active_family_member_id";

export function getStoredFamilyMembers(): FamilyMember[] {
  if (typeof window === "undefined") return DEFAULT_FAMILY_MEMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FAMILY_MEMBERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FAMILY_MEMBERS;
  } catch {
    return DEFAULT_FAMILY_MEMBERS;
  }
}

export function saveStoredFamilyMembers(members: FamilyMember[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (err) {
    console.error("Failed to save family members to localStorage:", err);
  }
}

export function getStoredActiveMemberId(): string {
  if (typeof window === "undefined") return "fm_self";
  try {
    return localStorage.getItem(ACTIVE_MEMBER_KEY) || "fm_self";
  } catch {
    return "fm_self";
  }
}

export function saveStoredActiveMemberId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_MEMBER_KEY, id);
  } catch (err) {
    console.error("Failed to save active member ID to localStorage:", err);
  }
}

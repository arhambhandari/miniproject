export interface SymptomDefinition {
  id: string;
  label: string;
  category: "CARDIAC" | "NEURO" | "RESPIRATORY" | "ORTHO" | "ONCO" | "GENERAL";
  isRedFlag?: boolean;
}

export const AVAILABLE_SYMPTOMS: SymptomDefinition[] = [
  // Cardiac / Vascular
  { id: "chest_pain", label: "Chest Pain / Tightness", category: "CARDIAC", isRedFlag: true },
  { id: "palpitations", label: "Heart Palpitations / Racing Pulse", category: "CARDIAC" },
  { id: "breathlessness_exertion", label: "Shortness of Breath on Exertion", category: "CARDIAC" },
  { id: "swollen_ankles", label: "Swollen Ankles / Feet Edema", category: "CARDIAC" },

  // Neurology
  { id: "severe_headache", label: "Severe / Throbbing Headache", category: "NEURO" },
  { id: "dizziness_vertigo", label: "Dizziness & Loss of Balance", category: "NEURO" },
  { id: "facial_numbness", label: "Sudden Facial / Arm Numbness", category: "NEURO", isRedFlag: true },
  { id: "memory_fog", label: "Confusion or Memory Fog", category: "NEURO" },

  // Respiratory / Pulmonology
  { id: "chronic_cough", label: "Persistent Cough (> 2 Weeks)", category: "RESPIRATORY" },
  { id: "wheezing", label: "Wheezing / Chest Congestion", category: "RESPIRATORY" },
  { id: "coughing_blood", label: "Coughing up Blood (Hemoptysis)", category: "RESPIRATORY", isRedFlag: true },

  // Orthopedics
  { id: "joint_pain", label: "Joint Pain & Morning Stiffness", category: "ORTHO" },
  { id: "knee_instability", label: "Knee Swelling or Locking", category: "ORTHO" },
  { id: "back_spasm", label: "Lower Back Pain Radiating to Leg", category: "ORTHO" },

  // Oncology
  { id: "unexplained_lump", label: "Unexplained Palpable Lump or Swelling", category: "ONCO", isRedFlag: true },
  { id: "rapid_weight_loss", label: "Unintentional Rapid Weight Loss", category: "ONCO" },
  { id: "night_sweats", label: "Severe Night Sweats & Fatigue", category: "ONCO" },

  // General Medicine
  { id: "high_fever", label: "High Fever & Chills (> 101°F)", category: "GENERAL" },
  { id: "stomach_pain", label: "Acute Abdominal Pain or Acidity", category: "GENERAL" },
  { id: "extreme_fatigue", label: "Chronic Lethargy & Dehydration", category: "GENERAL" },
];

export interface TriageEvaluationInput {
  symptoms: string[]; // symptom ids or labels
  duration: string; // "<24h" | "1-3days" | "1-2weeks" | "chronic"
  severity: string; // "MILD" | "MODERATE" | "SEVERE"
  notes?: string;
}

export interface TriageEvaluationResult {
  urgency: "EMERGENCY" | "URGENT_OPD" | "ROUTINE_OPD";
  urgencyLabel: string;
  department: string;
  departmentKey: string;
  clinicalRationale: string;
  emergencyWarning?: string;
  suggestedQuestions: string[];
}

export function evaluateClinicalTriage(input: TriageEvaluationInput): TriageEvaluationResult {
  const { symptoms, severity, duration, notes = "" } = input;
  const symptomIds = new Set(symptoms.map((s) => s.toLowerCase()));
  const combinedNotes = notes.toLowerCase();

  // 1. Check for Emergency Red Flags
  const hasCardiacChestPain =
    symptomIds.has("chest_pain") ||
    symptoms.some((s) => s.toLowerCase().includes("chest")) ||
    combinedNotes.includes("chest");
  const hasBreathlessness =
    symptomIds.has("breathlessness_exertion") ||
    symptoms.some((s) => s.toLowerCase().includes("breath"));
  const hasStrokeSign =
    symptomIds.has("facial_numbness") ||
    combinedNotes.includes("slur") ||
    combinedNotes.includes("droop");
  const hasHemoptysis = symptomIds.has("coughing_blood");

  if ((hasCardiacChestPain && severity === "SEVERE") || (hasCardiacChestPain && hasBreathlessness) || hasStrokeSign || hasHemoptysis) {
    return {
      urgency: "EMERGENCY",
      urgencyLabel: "Emergency / Immediate Medical Evaluation Advised",
      department: "Cardiology & Emergency Medicine",
      departmentKey: "CARDIOLOGY",
      clinicalRationale:
        "The combination of acute chest pain, shortness of breath, or sudden focal neurological symptoms constitutes a high-risk clinical triad that requires immediate emergency department evaluation and ECG screening.",
      emergencyWarning:
        "🚨 If you are experiencing crushing chest tightness, pain radiating to left arm/jaw, or sudden speech difficulty, please contact emergency ambulance services (108 / 112) or visit the nearest ER immediately.",
      suggestedQuestions: [
        "What does an emergency 12-lead ECG and Troponin blood panel indicate?",
        "Is immediate coronary angiography or echocardiography warranted?",
        "Should I be monitored under observation in the cardiac critical care unit?",
      ],
    };
  }

  // Count category weights
  const categoryCounts: Record<string, number> = {
    CARDIAC: 0,
    NEURO: 0,
    RESPIRATORY: 0,
    ORTHO: 0,
    ONCO: 0,
    GENERAL: 0,
  };

  symptoms.forEach((s) => {
    const found = AVAILABLE_SYMPTOMS.find(
      (def) => def.id === s || def.label.toLowerCase() === s.toLowerCase()
    );
    if (found) {
      categoryCounts[found.category] += found.isRedFlag ? 2.5 : 1;
    }
  });

  // Check notes for keywords
  if (combinedNotes.includes("heart") || combinedNotes.includes("bp") || combinedNotes.includes("pulse")) {
    categoryCounts.CARDIAC += 1.5;
  }
  if (combinedNotes.includes("head") || combinedNotes.includes("brain") || combinedNotes.includes("nerve")) {
    categoryCounts.NEURO += 1.5;
  }
  if (combinedNotes.includes("lung") || combinedNotes.includes("cough") || combinedNotes.includes("breathe")) {
    categoryCounts.RESPIRATORY += 1.5;
  }
  if (combinedNotes.includes("bone") || combinedNotes.includes("joint") || combinedNotes.includes("knee")) {
    categoryCounts.ORTHO += 1.5;
  }
  if (combinedNotes.includes("cancer") || combinedNotes.includes("tumor") || combinedNotes.includes("lump")) {
    categoryCounts.ONCO += 1.5;
  }

  // Determine top category
  let topCategory = "GENERAL";
  let maxWeight = 0;
  for (const [cat, weight] of Object.entries(categoryCounts)) {
    if (weight > maxWeight) {
      maxWeight = weight;
      topCategory = cat;
    }
  }

  const isUrgent = severity === "SEVERE" || duration === "<24h" || maxWeight >= 2.5;

  switch (topCategory) {
    case "CARDIAC":
      return {
        urgency: isUrgent ? "URGENT_OPD" : "ROUTINE_OPD",
        urgencyLabel: isUrgent ? "Priority Cardiology Consultation (Within 24 Hours)" : "Elective Cardiology Consultation",
        department: "Cardiology",
        departmentKey: "CARDIOLOGY",
        clinicalRationale:
          "Symptoms point towards cardiovascular exertion or arrhythmia. A clinical consultation with baseline ECG, lipid panel, and blood pressure review is recommended.",
        suggestedQuestions: [
          "Do you recommend a 2D Echocardiogram or Treadmill Stress Test (TMT)?",
          "Could my blood pressure fluctuations or cholesterol be contributing to these symptoms?",
          "Are there dietary or lifestyle modifications needed before taking cardiovascular medications?",
        ],
      };

    case "NEURO":
      return {
        urgency: isUrgent ? "URGENT_OPD" : "ROUTINE_OPD",
        urgencyLabel: isUrgent ? "Urgent Neurological Review" : "Neurology OPD Consultation",
        department: "Neuro-Oncology",
        departmentKey: "NEURO-ONCOLOGY",
        clinicalRationale:
          "Reported symptoms involve central nervous system pathways, persistent cephalalgia, or vestibular balance disturbance. A dedicated neuro-clinical exam is recommended.",
        suggestedQuestions: [
          "Is a brain MRI or CT neuro-scan indicated for this pattern of symptoms?",
          "Could these symptoms be related to cervical spine compression or migraine variants?",
          "What red flag symptoms should prompt emergency readmission?",
        ],
      };

    case "ONCO":
      return {
        urgency: "URGENT_OPD",
        urgencyLabel: "Specialist Oncology Evaluation Recommended",
        department: "Surgical Oncology",
        departmentKey: "SURGICAL ONCOLOGY",
        clinicalRationale:
          "Palpable lumps, constitutional weight loss, or unexplained lymphadenopathy warrant thorough oncological screening and tissue biopsy or radiological evaluation.",
        suggestedQuestions: [
          "Would you recommend high-resolution ultrasound, CT, or PET screening?",
          "Is a core-needle or fine-needle aspiration (FNAC) biopsy advised?",
          "Are tumor markers indicated in my initial blood workup?",
        ],
      };

    case "ORTHO":
      return {
        urgency: severity === "SEVERE" ? "URGENT_OPD" : "ROUTINE_OPD",
        urgencyLabel: "Orthopedic & Musculoskeletal Consultation",
        department: "Orthopedics",
        departmentKey: "ORTHOPEDICS",
        clinicalRationale:
          "Articular stiffness, weight-bearing discomfort, or structural spinal pain suggest musculoskeletal inflammation or ligamentous strain.",
        suggestedQuestions: [
          "Do I need dynamic X-rays or an MRI of the affected joint?",
          "Will physiotherapy, braces, or targeted anti-inflammatory injections help?",
          "What ergonomic modifications should I make to avoid worsening the joint?",
        ],
      };

    case "RESPIRATORY":
      return {
        urgency: isUrgent ? "URGENT_OPD" : "ROUTINE_OPD",
        urgencyLabel: "Pulmonology & Respiratory OPD Review",
        department: "Pulmonology",
        departmentKey: "PULMONOLOGY",
        clinicalRationale:
          "Subacute cough and bronchial wheeze indicate possible airway hyperreactivity, bronchial infection, or chronic pulmonary involvement.",
        suggestedQuestions: [
          "Is a Spirometry / Pulmonary Function Test (PFT) recommended?",
          "Should we perform a high-resolution chest radiograph (Chest X-ray)?",
          "Could environmental allergens or post-viral bronchial inflammation be the trigger?",
        ],
      };

    default:
      return {
        urgency: severity === "SEVERE" ? "URGENT_OPD" : "ROUTINE_OPD",
        urgencyLabel: "Internal Medicine & General Physician Review",
        department: "General Medicine",
        departmentKey: "MEDICINE",
        clinicalRationale:
          "The reported symptoms are best addressed through a comprehensive comprehensive General Physician intake, comprehensive metabolic panel, and vital signs assessment.",
        suggestedQuestions: [
          "Which initial blood tests (CBC, ESR, Metabolic Panel) should we complete first?",
          "Are any empirical medications or hydration protocols recommended?",
          "If symptoms persist, to which sub-specialty should I be referred?",
        ],
      };
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { queueManager } from "@/lib/queueManager";
import { MOCK_DOCTORS } from "@/lib/data";
import type { ChatAction, Doctor } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Helper to fetch a doctor from PostgreSQL or fallback mock data
 */
async function fetchDoctorBySpecialty(keyword: string): Promise<Doctor> {
  try {
    const dbDoctor = await prisma.doctorProfile.findFirst({
      where: {
        specialization: { contains: keyword, mode: "insensitive" },
      },
      include: {
        user: { select: { name: true, image: true, email: true } },
      },
    });

    if (dbDoctor) {
      return {
        id: dbDoctor.id,
        specialization: dbDoctor.specialization,
        experience: dbDoctor.experience,
        satisfaction: dbDoctor.satisfaction || 98,
        fee: dbDoctor.fee,
        hospitalName: dbDoctor.hospitalName || "Apollo Specialty Hospital, Mumbai",
        nextAvailable: dbDoctor.nextAvailable || "Today, 10:30 AM",
        bio: dbDoctor.bio || undefined,
        user: {
          name: dbDoctor.user.name || "Dr. Specialist",
          image: dbDoctor.user.image,
        },
      };
    }
  } catch (err) {
    console.warn("Chat doctor search fallback:", err);
  }

  const fallback = MOCK_DOCTORS.find((d) =>
    d.specialization.toLowerCase().includes(keyword.toLowerCase())
  );
  return fallback || MOCK_DOCTORS[0];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. Messages array required." },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1];
    const rawQuery = (lastUserMessage?.text || lastUserMessage?.content || "").trim();
    const query = rawQuery.toLowerCase();

    // 0. Detect Educational / Symptom Inquiry Intent
    // e.g., "What are the symptom of cancer", "What are the symptoms of diabetes", "symptoms of stroke", "cancer symptoms"
    const isEducationalQuery =
      /\b(what\s+are\s+(the\s+)?symptoms?|what\s+is\s+(the\s+)?symptoms?|symptoms?\s+of|signs?\s+of|warning\s+signs?|early\s+signs?|how\s+to\s+(detect|know|tell)|what\s+causes?|causes?\s+of|stages?\s+of|tell\s+me\s+about\s+(the\s+)?symptoms?|explain\s+(the\s+)?symptoms?)\b/i.test(query) ||
      (/\b(symptoms?|warning signs?)\b/i.test(query) && !/\b(i have|i'm having|i am having|i feel|i am feeling|my |suffering from|experienced)\b/i.test(query)) ||
      (/\b(what is|what causes|causes of|stages of)\s+(cancer|diabetes|stroke|asthma|migraine|arthritis|tumor)\b/i.test(query));

    // 1. Emergency Red-Flag Intent (Only if patient is actively presenting symptoms, not just asking educational info)
    const emergencyKeywords = [
      "chest pain", "heart attack", "stroke", "can't breathe", "cannot breathe",
      "difficulty breathing", "unconscious", "severe bleeding", "emergency", "sos",
      "ambulance", "choking", "paralysis", "seizure", "collapsed", "cyanosis", "coughing blood"
    ];

    const isEmergency = !isEducationalQuery && emergencyKeywords.some((kw) => query.includes(kw));

    if (isEmergency) {
      const emergencyActions: ChatAction[] = [
        {
          type: "BOOK_EMERGENCY",
          label: "🚨 Book Emergency Priority Token (#EM-01)",
          emergencyReason: rawQuery,
        },
      ];

      return NextResponse.json({
        reply: `⚠️ **CRITICAL CLINICAL ALERT**\n\nYour symptoms may indicate an acute medical emergency. **If you or someone else is unresponsive, having severe chest tightness radiating to the arm, sudden facial numbness, or severe respiratory failure, call 108 or 112 immediately.**\n\nFor urgent hospital admission, MediBook provides a **Fast-Track Priority Queue Jump** that immediately injects your admission token at the head of the OPD queue with zero upfront payment friction.`,
        isEmergency: true,
        actions: emergencyActions,
        suggestedReplies: [
          "🚨 Book Emergency Token",
          "🚑 Direct Dial 108 Ambulance",
          "🏥 Contact Apollo ER Desk"
        ],
      });
    }

    // 2. OPD Live Queue & Chamber Status Intent
    const queueKeywords = [
      "queue", "token", "chamber", "wait time", "waiting time", "opd status", 
      "how long", "my turn", "delay", "live queue", "now serving"
    ];

    if (queueKeywords.some((kw) => query.includes(kw))) {
      const currentQueue = queueManager.getQueueState();
      const actions: ChatAction[] = [
        {
          type: "VIEW_QUEUE",
          label: "📡 View Live OPD Queue Radar",
        },
      ];

      return NextResponse.json({
        reply: `📍 **Hospital Live OPD Queue Status**\n\n• **Chamber**: ${currentQueue.roomNumber} (${currentQueue.hospitalName})\n• **Consulting Physician**: ${currentQueue.doctorName}\n• **Now Serving**: **${currentQueue.currentServingToken}** (${currentQueue.currentPatientName})\n• **Queue Status**: ${currentQueue.status === "EMERGENCY_DELAY" ? "⚠️ Emergency delay in progress (+15m)" : "Active & Fast Moving"}\n\nOur system broadcasts live token advances via Server-Sent Events (SSE). You can step into the cafeteria or pharmacy and monitor your queue position in real-time.`,
        actions,
        suggestedReplies: [
          "📡 View Live Queue Radar",
          "Where is Chamber 304?",
          "Can I delay my token?"
        ],
      });
    }

    // 3. Medication & Vitals Guidance Intent
    const medsKeywords = [
      "medicine", "medication", "dose", "pills", "prescription", 
      "vitals", "blood pressure", "glucose", "spo2", "sugar", "heart rate"
    ];

    if (!isEducationalQuery && medsKeywords.some((kw) => query.includes(kw))) {
      const actions: ChatAction[] = [
        {
          type: "VIEW_MEDICATIONS",
          label: "💊 Open Daily Medication Log",
        },
      ];

      return NextResponse.json({
        reply: `🩺 **Clinical Health Records & Medication Tracking**\n\n• **Clinical Vitals (Doctor-Verified Only)**: Health vitals like Blood Pressure, Glucose, SpO2, and Heart Rate are strictly locked to physician-verified entry during chamber consultations to preserve clinical accuracy.\n• **Daily Medication Adherence**: You can track and log daily medication doses, mark pills as taken, and record intake times anytime directly in your dashboard.\n• **EHR Synchronization**: All prescribed medications are linked to your ABHA digital health record.`,
        actions,
        suggestedReplies: [
          "💊 Open Daily Medication Log",
          "Why are vitals doctor-only?",
          "How to request prescription refill?"
        ],
      });
    }

    // 4. Digital Hospital OPD Pass (E-Pass) & Directions
    const passKeywords = [
      "pass", "e-pass", "digital pass", "ticket", "barcode", "qr code", 
      "parking", "direction", "address", "location", "reach hospital"
    ];

    if (passKeywords.some((kw) => query.includes(kw))) {
      const actions: ChatAction[] = [
        {
          type: "VIEW_PASS",
          label: "📄 Open Digital Hospital E-Pass",
        },
      ];

      return NextResponse.json({
        reply: `📄 **Hospital Digital OPD Pass & Facility Access**\n\n• **Instant E-Pass**: Every confirmed consultation includes a downloadable Digital Hospital Pass with a dynamic QR code and authorized hospital seal.\n• **Kiosk Fast-Track**: Present your E-Pass at Hospital Kiosk entrance or Security Desk for priority sub-lobby clearance.\n• **Hospital Location**: Apollo Specialty Hospital / AIIMS Super Specialty Center, Gate 3, OPD Block B.\n• **Parking**: Free designated patient parking in Basements B2 & B3.`,
        actions,
        suggestedReplies: [
          "📄 Open Digital Hospital E-Pass",
          "What time does OPD open?",
          "Book new appointment"
        ],
      });
    }

    // 5. EDUCATIONAL / CLINICAL SYMPTOM KNOWLEDGE HANDLER
    // Answers questions like "What are the symptom of cancer", "symptoms of heart attack", "what causes cancer", etc.
    if (isEducationalQuery) {
      // 5A. Cancer / Oncology Knowledge
      if (
        query.includes("cancer") ||
        query.includes("tumor") ||
        query.includes("tumour") ||
        query.includes("carcinoma") ||
        query.includes("malignan") ||
        query.includes("oncol") ||
        query.includes("leukemia") ||
        query.includes("lymphoma") ||
        query.includes("melanoma")
      ) {
        const oncologyDoctor = await fetchDoctorBySpecialty("Oncology");

        // Sub-case: What causes cancer?
        if (query.includes("cause")) {
          return NextResponse.json({
            reply: `🧬 **Understanding the Causes of Cancer**\n\nCancer occurs when cellular DNA undergoes genetic mutations that cause cells to divide uncontrollably and escape normal immune destruction. The principal causal factors include:\n\n• **Genetic Alterations**: Inherited germline mutations (e.g., *BRCA1/2*, Lynch syndrome) or acquired somatic mutations in tumor-suppressor genes (e.g., *TP53*).\n• **Carcinogen Exposure**: Tobacco smoke (the leading cause of lung and bladder cancer), industrial chemicals (asbestos, benzene, arsenic), and radon gas.\n• **Radiation**: Prolonged UV radiation from sunlight (melanoma) and ionizing medical/cosmic radiation.\n• **Oncogenic Pathogens**: Chronic viral and bacterial infections, such as Human Papillomavirus (HPV), Hepatitis B & C (liver cancer), and *Helicobacter pylori* (gastric cancer).\n• **Lifestyle & Metabolic Factors**: Chronic obesity, diets high in ultra-processed or red meats, sedentary lifestyle, and high alcohol intake.\n• **Chronic Inflammation**: Long-standing inflammatory diseases that trigger cellular turnover and oxidative stress.\n\nRegular clinical screenings and early detection can reduce cancer mortality by up to 40%.`,
            actions: [
              {
                type: "BOOK_DOCTOR",
                label: `Book Consultation with ${oncologyDoctor.user.name} (${oncologyDoctor.specialization})`,
                doctor: oncologyDoctor,
                triageDisease: "Oncology Preventive Consultation & Cancer Screening",
              },
              {
                type: "START_TRIAGE",
                label: "🔍 Run Clinical Pre-Triage",
                triageDisease: "Cancer Risk Assessment",
              },
            ],
            suggestedReplies: [
              "What are the symptoms of cancer?",
              "What are the stages of cancer?",
              `Book with ${oncologyDoctor.user.name}`,
              "🔍 Run Clinical Pre-Triage",
            ],
          });
        }

        // Sub-case: What are the stages of cancer?
        if (query.includes("stage")) {
          return NextResponse.json({
            reply: `📊 **Clinical Staging of Cancer (TNM Classification)**\n\nCancer staging defines the tumor's anatomical extent and determines the optimal oncological treatment protocol (surgery, chemotherapy, immunotherapy, or radiation):\n\n• **Stage 0 (Carcinoma in Situ)**: Abnormal precancerous cells are localized strictly to the original tissue layer and have not invaded deeper basement membranes.\n• **Stage I (Early Localized)**: Small tumor confined completely to the primary organ with no spread to lymph nodes.\n• **Stage II & III (Locally Advanced)**: The tumor has grown deeper into surrounding tissues and may have spread to regional lymph nodes, requiring multimodality therapy.\n• **Stage IV (Metastatic / Advanced)**: Cancer cells have traveled through blood vessels or lymphatic channels to distant organs (such as the liver, lungs, brain, or bones).\n\n• **TNM System**: Oncologists grade cancers using **T** (Tumor size), **N** (Regional lymph node involvement), and **M** (Distant metastasis).`,
            actions: [
              {
                type: "BOOK_DOCTOR",
                label: `Book Consultation with ${oncologyDoctor.user.name} (${oncologyDoctor.specialization})`,
                doctor: oncologyDoctor,
                triageDisease: "Oncology Review - Staging & Diagnostic Protocol",
              },
              {
                type: "START_TRIAGE",
                label: "🔍 Run Clinical Pre-Triage",
                triageDisease: "Oncology Second Opinion",
              },
            ],
            suggestedReplies: [
              "What are the symptoms of cancer?",
              "What causes cancer?",
              `Book with ${oncologyDoctor.user.name}`,
              "🔍 Run Clinical Pre-Triage",
            ],
          });
        }

        // Default Cancer: Symptoms & Warning Signs
        return NextResponse.json({
          reply: `🎗️ **Common Symptoms & Warning Signs of Cancer**\n\nCancer symptoms vary widely depending on the organ, size, and whether it has spread. Oncologists and clinical screening guidelines (such as the **CAUTION** criteria) identify the following major warning signs:\n\n1. **Unexplained Weight Loss**:\n• Sudden, unintentional loss of 5 kg (10 lbs) or more without dieting or routine modifications. Common in lung, stomach, esophageal, and pancreatic malignancies.\n\n2. **Persistent Fatigue & Exhaustion**:\n• Severe, debilitating tiredness and lethargy that does not improve after sleep or rest, often linked to microscopic blood loss or altered metabolic demands.\n\n3. **Lumps, Thickening, or Palpable Masses**:\n• Firm, typically painless or growing lumps under the skin, especially in the **breast**, **lymph nodes** (neck, underarms, groin), or **testicles**.\n\n4. **Changes in Skin & Moles (ABCDE Protocol)**:\n• Changing moles: **A**symmetry, irregular **B**orders, **C**olor variation, **D**iameter >6mm, or **E**volving over time; non-healing skin ulcers or unexplained jaundice (yellow skin/eyes).\n\n5. **Persistent Cough or Voice Hoarseness**:\n• A chronic cough lasting more than 3–4 weeks resistant to standard treatments, progressive hoarseness, or coughing up streaks of blood (*hemoptysis*).\n\n6. **Changes in Bowel or Bladder Habits**:\n• Long-standing constipation or diarrhea, narrowed pencil-thin stools, dark tarry stools (*melena*), visible rectal bleeding, or hematuria (blood in urine).\n\n7. **Unexplained Bleeding or Unusual Discharge**:\n• Abnormal vaginal bleeding between cycles or post-menopause, hematuria, or abnormal nipple discharge.\n\n8. **Difficulty Swallowing (Dysphagia) & Early Fullness**:\n• Feeling food stuck in the throat/retrosternal area, chronic indigestion unresponsive to antacids, or feeling uncomfortably full after small bites.\n\n9. **Persistent, Unexplained Pain**:\n• Deep bone aches that worsen at night, localized persistent abdominal tenderness, or new intractable headaches.\n\n---\n\n🩺 **Clinical Reassurance & Screening Guidance**:\n• **Important Reassurance**: Experiencing one or more of these symptoms does **not** mean you have cancer — benign conditions (cysts, infections, inflammation, polyps) share many of these symptoms.\n• **When to Consult**: If any of these signs persist for **longer than 2 to 3 weeks** without clear explanation, you should undergo diagnostic evaluation (blood panels, ultrasound, imaging, or biopsy).\n\nWould you like to schedule an oncology consultation or run our 30-second Clinical Pre-Triage?`,
          actions: [
            {
              type: "BOOK_DOCTOR",
              label: `Book Consultation with ${oncologyDoctor.user.name} (${oncologyDoctor.specialization})`,
              doctor: oncologyDoctor,
              triageDisease: "Cancer Symptom Review & Oncology Screening",
            },
            {
              type: "START_TRIAGE",
              label: "🔍 Run 30-Second Clinical Pre-Triage",
              triageDisease: "Cancer Warning Signs Assessment",
            },
            {
              type: "VIEW_QUEUE",
              label: "📡 Track Chamber 304 Live Queue",
            },
          ],
          suggestedReplies: [
            `Book with ${oncologyDoctor.user.name}`,
            "What causes cancer?",
            "What are the stages of cancer?",
            "🔍 Run Clinical Pre-Triage",
          ],
        });
      }

      // 5B. Heart Attack & Cardiovascular Disease Knowledge
      if (
        query.includes("heart") ||
        query.includes("cardio") ||
        query.includes("chest") ||
        query.includes("angina") ||
        query.includes("palpitation") ||
        query.includes("coronary")
      ) {
        const cardioDoctor = await fetchDoctorBySpecialty("Cardiology");

        return NextResponse.json({
          reply: `❤️ **Warning Signs & Symptoms of Heart Attack & Heart Disease**\n\nCardiovascular conditions require rapid recognition. Key clinical warning signs include:\n\n1. **Central Chest Discomfort or Angina**:\n• Sensation of crushing pressure, squeezing, fullness, or burning in the center of the chest lasting more than a few minutes or resolving and returning.\n\n2. **Radiating Pain**:\n• Pain or dull aching spreading to the **left arm, shoulder, neck, jaw, upper back**, or stomach area.\n\n3. **Shortness of Breath (Dyspnea)**:\n• Labored breathing that occurs with or without chest discomfort, even during minimal physical exertion or when lying flat.\n\n4. **Cold Sweats & Clammy Skin**:\n• Sudden onset of profuse perspiration without physical exertion.\n\n5. **Dizziness, Lightheadedness, or Presyncope**:\n• Feeling faint, unsteady, or experiencing sudden blackouts.\n\n6. **Nausea, Indigestion, or Heartburn**:\n• Gastrointestinal-type distress often reported more frequently by women during acute coronary episodes.\n\n⚠️ **Emergency Protocol**: If you or someone with you is having acute crushing chest pain, jaw radiation, or severe breathlessness right now, **call 108 immediately** for emergency ambulance transit.`,
          actions: [
            {
              type: "BOOK_DOCTOR",
              label: `Book Consultation with ${cardioDoctor.user.name} (Cardiology)`,
              doctor: cardioDoctor,
              triageDisease: "Cardiovascular Evaluation & ECG Review",
            },
            {
              type: "START_TRIAGE",
              label: "🔍 Run Clinical Pre-Triage",
              triageDisease: "Cardiac Symptom Triage",
            },
            {
              type: "BOOK_EMERGENCY",
              label: "🚨 Emergency Fast-Track SOS",
              emergencyReason: "Suspected Acute Cardiac Symptoms",
            },
          ],
          suggestedReplies: [
            `Book with ${cardioDoctor.user.name}`,
            "🚨 Emergency Fast-Track SOS",
            "What causes high blood pressure?",
            "🔍 Run Clinical Pre-Triage",
          ],
        });
      }

      // 5C. Stroke & Neurological Symptoms
      if (
        query.includes("stroke") ||
        query.includes("brain attack") ||
        query.includes("paralysis") ||
        query.includes("facial droop") ||
        query.includes("aneurysm")
      ) {
        const neuroDoctor = await fetchDoctorBySpecialty("Neuro");

        return NextResponse.json({
          reply: `🧠 **Clinical Warning Signs of Stroke (BE-FAST Protocol)**\n\nA stroke occurs when blood supply to part of the brain is interrupted (ischemic) or when a blood vessel bursts (hemorrhagic). Remember the clinical **BE-FAST** acronym:\n\n• **B - Balance Loss**: Sudden loss of balance, dizziness, or difficulty walking.\n• **E - Eyes**: Sudden blurred vision, diplopia (double vision), or complete loss of sight in one or both eyes.\n• **F - Face Drooping**: One side of the face sags, droops, or feels numb when smiling.\n• **A - Arm Weakness**: Sudden weakness or numbness in one arm; inability to keep both arms raised evenly.\n• **S - Speech Difficulty**: Slurred speech, garbled words, or inability to comprehend speech.\n• **T - Time to Call 108**: A medical emergency where every minute preserves brain cells. Immediate hospital admission within the "golden hour" allows clot-busting tPA or thrombectomy.\n\nFor non-acute preventative neurological evaluation, you can consult our Neurology department.`,
          actions: [
            {
              type: "BOOK_DOCTOR",
              label: `Book Consultation with ${neuroDoctor.user.name} (Neurology)`,
              doctor: neuroDoctor,
              triageDisease: "Neurological & Stroke Risk Evaluation",
            },
            {
              type: "BOOK_EMERGENCY",
              label: "🚨 Emergency Priority Fast-Track",
              emergencyReason: "Suspected Acute Stroke Symptoms",
            },
            {
              type: "START_TRIAGE",
              label: "🔍 Run Clinical Pre-Triage",
              triageDisease: "Neurology Symptom Review",
            },
          ],
          suggestedReplies: [
            `Book with ${neuroDoctor.user.name}`,
            "🚨 Emergency Priority Fast-Track",
            "What are migraine symptoms?",
            "🔍 Run Clinical Pre-Triage",
          ],
        });
      }

      // 5D. Diabetes & Endocrine Symptoms
      if (
        query.includes("diabet") ||
        query.includes("sugar") ||
        query.includes("insulin") ||
        query.includes("glucose") ||
        query.includes("endocrine")
      ) {
        const genDoctor = await fetchDoctorBySpecialty("General");

        return NextResponse.json({
          reply: `🩸 **Symptoms & Warning Signs of Diabetes (Type 1 & Type 2)**\n\nDiabetes mellitus occurs when blood glucose levels remain chronically elevated. Common symptoms include:\n\n1. **The Classic Triad (3 Ps)**:\n• **Polyuria**: Abnormally frequent urination, especially during the night.\n• **Polydipsia**: Insatiable, unquenchable thirst regardless of water intake.\n• **Polyphagia**: Persistent extreme hunger even after full meals.\n\n2. **Unexplained Weight Loss**:\n• Inability of cells to absorb glucose forces the body to burn fat and muscle for energy.\n\n3. **Profound Fatigue & Weakness**:\n• Cellular energy starvation leading to chronic exhaustion.\n\n4. **Blurred Vision**:\n• Fluid balance shifts causing swelling in the eye's crystalline lens.\n\n5. **Slow-Healing Wounds & Frequent Infections**:\n• Impaired peripheral circulation and reduced leukocyte response delay wound healing.\n\n6. **Diabetic Neuropathy**:\n• Tingling, burning, or numbness ("pins and needles") starting in the toes and fingers.\n\n• **Screening Tests**: Fasting Plasma Glucose (FPG), HbA1c (≥6.5% diagnostic), and Oral Glucose Tolerance Test (OGTT).`,
          actions: [
            {
              type: "BOOK_DOCTOR",
              label: `Book Consultation with ${genDoctor.user.name} (Internal Medicine)`,
              doctor: genDoctor,
              triageDisease: "Diabetes Screening & HbA1c Review",
            },
            {
              type: "START_TRIAGE",
              label: "🔍 Run Clinical Pre-Triage",
              triageDisease: "Endocrine & Metabolic Health",
            },
          ],
          suggestedReplies: [
            `Book with ${genDoctor.user.name}`,
            "What is a normal HbA1c level?",
            "What are the symptoms of heart attack?",
            "🔍 Run Clinical Pre-Triage",
          ],
        });
      }

      // 5E. Migraine & Neurological Headaches
      if (
        query.includes("migraine") ||
        query.includes("headache") ||
        query.includes("cluster")
      ) {
        const neuroDoctor = await fetchDoctorBySpecialty("Neuro");

        return NextResponse.json({
          reply: `⚡ **Symptoms & Characteristics of Migraines & Chronic Headaches**\n\nMigraines are neurovascular disorders that differ from ordinary tension headaches:\n\n1. **Throbbing or Pulsating Pain**:\n• Typically moderate to severe, often localized to one side of the head (unilateral), and worsening with physical exertion.\n\n2. **Sensory Aura (in ~25-30% of patients)**:\n• Visual disturbances such as flickering lights, zigzag patterns (scintillating scotoma), blind spots, or numbness in the fingers and face preceding the headache by 20–60 minutes.\n\n3. **Photophobia & Phonophobia**:\n• Heightened sensitivity to bright lights, computer screens, and loud noises, often requiring rest in a dark, quiet room.\n\n4. **Nausea & Gastric Distress**:\n• Queasiness, stomach cramps, or vomiting during the attack.\n\n5. **Allodynia & Neck Stiffness**:\n• Scalp sensitivity to light brushing, and stiffness in the posterior neck and shoulders.\n\n⚠️ **When to Seek Immediate Care (SNOOP Criteria)**: A sudden "thunderclap" headache reaching maximum intensity within seconds, headache accompanied by high fever and stiff neck, or new headaches starting after age 50.`,
          actions: [
            {
              type: "BOOK_DOCTOR",
              label: `Book Consultation with ${neuroDoctor.user.name} (Neurology)`,
              doctor: neuroDoctor,
              triageDisease: "Chronic Migraine & Cephalgia Protocol",
            },
            {
              type: "START_TRIAGE",
              label: "🔍 Run Clinical Pre-Triage",
              triageDisease: "Headache Severity Assessment",
            },
          ],
          suggestedReplies: [
            `Book with ${neuroDoctor.user.name}`,
            "What triggers a migraine?",
            "What are stroke symptoms?",
            "🔍 Run Clinical Pre-Triage",
          ],
        });
      }

      // 5F. Asthma & Respiratory Conditions
      if (
        query.includes("asthma") ||
        query.includes("pneumonia") ||
        query.includes("copd") ||
        query.includes("bronchitis") ||
        query.includes("respiratory") ||
        query.includes("lung")
      ) {
        const genDoctor = await fetchDoctorBySpecialty("General");

        return NextResponse.json({
          reply: `🫁 **Symptoms & Warning Signs of Respiratory Illness & Asthma**\n\nRespiratory symptoms reflect inflammation, bronchoconstriction, or infection within the airways:\n\n1. **Expiratory Wheezing**:\n• A distinctive musical or whistling sound produced when breathing out through narrowed bronchioles.\n\n2. **Shortness of Breath (Dyspnea)**:\n• Feeling an inability to draw a full breath, especially during exercise, cold weather exposure, or nocturnal sleep.\n\n3. **Chest Tightness**:\n• A sensation of heavy pressure, squeezing, or band-like constriction around the thoracic cage.\n\n4. **Chronic or Nocturnal Coughing**:\n• Dry or productive cough with sputum that disrupts sleep or triggers gagging.\n\n5. **Tachypnea & Retractions**:\n• Rapid shallow breathing and visible sinking of skin between ribs during acute respiratory distress.\n\n• **Red Flag**: Inability to speak in full sentences, blue-tinted lips/nails (cyanosis), or SpO2 dropping below 92% requires immediate ER clearance.`,
          actions: [
            {
              type: "BOOK_DOCTOR",
              label: `Book Consultation with ${genDoctor.user.name} (Pulmonology & Medicine)`,
              doctor: genDoctor,
              triageDisease: "Respiratory Evaluation & Spirometry",
            },
            {
              type: "START_TRIAGE",
              label: "🔍 Run Clinical Pre-Triage",
              triageDisease: "Respiratory Health Check",
            },
          ],
          suggestedReplies: [
            `Book with ${genDoctor.user.name}`,
            "How to use an inhaler properly?",
            "What are the symptoms of pneumonia?",
            "🔍 Run Clinical Pre-Triage",
          ],
        });
      }

      // 5G. Arthritis & Orthopedic Conditions
      if (
        query.includes("arthrit") ||
        query.includes("joint") ||
        query.includes("knee") ||
        query.includes("bone") ||
        query.includes("gout") ||
        query.includes("ortho")
      ) {
        const orthoDoctor = await fetchDoctorBySpecialty("Ortho");

        return NextResponse.json({
          reply: `🦴 **Symptoms & Signs of Arthritis & Orthopedic Conditions**\n\nMusculoskeletal disorders affect articular cartilage, synovial membranes, ligaments, and bones:\n\n1. **Morning Joint Stiffness**:\n• Lasting >30 minutes in inflammatory conditions (Rheumatoid Arthritis, Ankylosing Spondylitis) or <15 minutes in degenerative conditions (Osteoarthritis).\n\n2. **Joint Swelling & Effusion**:\n• Accumulation of synovial fluid leading to visible puffiness, warmth, and tenderness around the knee, wrist, or finger joints.\n\n3. **Crepitus & Grinding Sensation**:\n• Palpable or audible crunching, cracking, or grating sounds during joint articulation due to cartilage erosion.\n\n4. **Reduced Range of Motion**:\n• Difficulty climbing stairs, gripping items, bending the knee, or standing from low chairs.\n\n5. **Aching Joint Pain**:\n• Deep, dull pain in weight-bearing joints aggravated by physical movement and relieved by rest.\n\n• **Diagnostic Workup**: Weight-bearing X-rays, MRI joint imaging, Erythrocyte Sedimentation Rate (ESR), C-Reactive Protein (CRP), and Serum Uric Acid.`,
          actions: [
            {
              type: "BOOK_DOCTOR",
              label: `Book Consultation with ${orthoDoctor.user.name} (Orthopedics)`,
              doctor: orthoDoctor,
              triageDisease: "Orthopedic Evaluation & Joint Assessment",
            },
            {
              type: "START_TRIAGE",
              label: "🔍 Run Clinical Pre-Triage",
              triageDisease: "Joint & Mobility Screening",
            },
          ],
          suggestedReplies: [
            `Book with ${orthoDoctor.user.name}`,
            "What is the difference between OA and RA?",
            "What is gout?",
            "🔍 Run Clinical Pre-Triage",
          ],
        });
      }

      // 5H. Dermatology & Skin Lesions
      if (
        query.includes("skin") ||
        query.includes("derma") ||
        query.includes("rash") ||
        query.includes("mole") ||
        query.includes("eczema") ||
        query.includes("psoriasis")
      ) {
        const dermaDoctor = await fetchDoctorBySpecialty("Dermatology");

        return NextResponse.json({
          reply: `🩺 **Clinical Symptoms & Signs of Dermatological Conditions**\n\nSkin conditions provide vital clues to localized and systemic health:\n\n1. **ABCDE Criteria for Moles & Lesions**:\n• **A**symmetry (halves don't match)\n• **B**order irregularity (notched or blurred edges)\n• **C**olor variation (multiple shades of brown, black, red, or blue)\n• **D**iameter (>6mm, roughly pencil eraser size)\n• **E**volving (changes in size, shape, surface bleeding, or elevation)\n\n2. **Pruritus (Itching) & Erythema**:\n• Persistent, severe itching with redness, typical of eczema, contact dermatitis, or hives.\n\n3. **Silvery Plaques & Scaling**:\n• Well-demarcated erythematous plaques covered with silvery scales, characteristic of psoriasis.\n\n4. **Non-Healing Sores or Ulcerations**:\n• Lesions that crust, bleed easily, or fail to heal after 3–4 weeks should be evaluated by a dermatologist.\n\nEarly examination using digital dermoscopy allows rapid diagnosis of benign vs. malignant lesions.`,
          actions: [
            {
              type: "BOOK_DOCTOR",
              label: `Book Consultation with ${dermaDoctor.user.name} (Dermatology)`,
              doctor: dermaDoctor,
              triageDisease: "Dermatological Review & Skin Lesion Check",
            },
            {
              type: "START_TRIAGE",
              label: "🔍 Run Clinical Pre-Triage",
              triageDisease: "Skin Rash & Mole Assessment",
            },
          ],
          suggestedReplies: [
            `Book with ${dermaDoctor.user.name}`,
            "How to identify a suspicious mole?",
            "What are cancer symptoms?",
            "🔍 Run Clinical Pre-Triage",
          ],
        });
      }

      // 5I. Generic Disease Educational Fallback
      const conditionMatch = rawQuery
        .replace(/(what\s+are\s+(the\s+)?symptoms?\s+of|what\s+is\s+(the\s+)?symptoms?\s+of|symptoms?\s+of|signs?\s+of|warning\s+signs?\s+of|tell\s+me\s+about\s+symptoms?\s+of|explain\s+symptoms?\s+of)/gi, "")
        .replace(/\?/g, "")
        .trim();

      const generalDoctor = await fetchDoctorBySpecialty("General");

      return NextResponse.json({
        reply: `🩺 **Clinical Symptoms & Warning Signs Overview: ${conditionMatch || "General Health Inquiry"}**\n\nWhen evaluating medical conditions, physicians classify symptoms into primary localized manifestations and systemic constitutional indicators:\n\n• **Primary Localized Signs**: Pain, inflammation, functional limitation, or abnormal discharge in the affected anatomical region.\n• **Systemic Constitutional Indicators**: Unexplained weight loss, recurring fevers, chronic nocturnal sweats, or severe generalized fatigue.\n• **Clinical Red Flags**: Symptoms that intensify rapidly, fail to resolve within 2 to 3 weeks, or cause disruptions in breathing, vision, speech, or mobility.\n\n• **Diagnostic Recommendations**: Standard clinical workups include targeted blood panels, ultrasound or cross-sectional imaging (CT/MRI), and specialized biomarker testing.\n\nWould you like to speak directly with an internal medicine specialist or run our interactive symptom pre-triage?`,
        actions: [
          {
            type: "BOOK_DOCTOR",
            label: `Book Consultation with ${generalDoctor.user.name} (Internal Medicine)`,
            doctor: generalDoctor,
            triageDisease: `${conditionMatch || "Clinical"} Review & Assessment`,
          },
          {
            type: "START_TRIAGE",
            label: "🔍 Run Clinical Pre-Triage",
            triageDisease: conditionMatch || "General Symptom Evaluation",
          },
        ],
        suggestedReplies: [
          `Book with ${generalDoctor.user.name}`,
          "What are the symptoms of cancer?",
          "What are the symptoms of diabetes?",
          "🔍 Run Clinical Pre-Triage",
        ],
      });
    }

    // 6. PATIENT ACTIVELY PRESENTING SYMPTOMS (Consultation & Doctor Matching)
    let targetSpecialty = "";
    let specialtyLabel = "";

    if (query.includes("headache") || query.includes("migraine") || query.includes("brain") || query.includes("neuro") || query.includes("dizz")) {
      targetSpecialty = "Neuro";
      specialtyLabel = "Neurology & Neuro-Oncology";
    } else if (query.includes("heart") || query.includes("cardio") || query.includes("chest") || query.includes("palpitation") || query.includes("bp")) {
      targetSpecialty = "Cardio";
      specialtyLabel = "Cardiology";
    } else if (query.includes("bone") || query.includes("joint") || query.includes("fracture") || query.includes("knee") || query.includes("back pain") || query.includes("ortho")) {
      targetSpecialty = "Ortho";
      specialtyLabel = "Orthopedics & Spine Surgery";
    } else if (query.includes("child") || query.includes("baby") || query.includes("kid") || query.includes("pediatric")) {
      targetSpecialty = "Pedia";
      specialtyLabel = "Pediatrics";
    } else if (query.includes("cancer") || query.includes("tumor") || query.includes("oncol")) {
      targetSpecialty = "Oncol";
      specialtyLabel = "Medical & Surgical Oncology";
    } else if (query.includes("skin") || query.includes("rash") || query.includes("mole") || query.includes("itching") || query.includes("derma")) {
      targetSpecialty = "Dermatology";
      specialtyLabel = "Dermatology & Skin Care";
    } else if (query.includes("fever") || query.includes("cough") || query.includes("cold") || query.includes("stomach") || query.includes("infection")) {
      targetSpecialty = "General";
      specialtyLabel = "General Medicine & Internal Health";
    }

    if (targetSpecialty) {
      const matchedDoctor = await fetchDoctorBySpecialty(targetSpecialty);

      const actions: ChatAction[] = [
        {
          type: "BOOK_DOCTOR",
          label: `Book with ${matchedDoctor.user.name}`,
          doctor: matchedDoctor,
          triageDisease: rawQuery,
        },
        {
          type: "START_TRIAGE",
          label: "🔍 Run Full Clinical Pre-Triage",
          triageDisease: rawQuery,
        },
      ];

      return NextResponse.json({
        reply: `🩺 **Specialist Recommendation: ${specialtyLabel}**\n\nBased on your symptoms (*"${rawQuery}"*), we recommend consulting our verified specialist in **${specialtyLabel}**.\n\n• **Recommended Specialist**: **${matchedDoctor.user.name}**\n• **Experience**: ${matchedDoctor.experience} Years • ${matchedDoctor.satisfaction}% Patient Satisfaction\n• **Hospital / Chamber**: ${matchedDoctor.hospitalName} (OPD Chamber 304)\n• **Consultation Fee**: ₹${matchedDoctor.fee?.toLocaleString() || "1,800"}\n• **Next Available Slot**: ${matchedDoctor.nextAvailable}\n\nYou can book a consultation immediately or run a quick 30-second Clinical Pre-Triage to identify any secondary symptoms.`,
        actions,
        suggestedReplies: [
          `Book with ${matchedDoctor.user.name}`,
          "🔍 Run Full Clinical Pre-Triage",
          "What is the consultation fee?",
        ],
      });
    }

    // 7. Default Helpful Navigator Greeting
    const defaultActions: ChatAction[] = [
      {
        type: "START_TRIAGE",
        label: "🔍 Start Symptom Pre-Triage",
      },
      {
        type: "VIEW_QUEUE",
        label: "📡 Track Live OPD Queue",
      },
      {
        type: "BOOK_EMERGENCY",
        label: "🚨 Emergency Fast-Track SOS",
        emergencyReason: "Urgent Medical Assistance",
      },
    ];

    return NextResponse.json({
      reply: `👋 Hello! I am **MediGuide AI**, your intelligent 24/7 clinical navigator and hospital assistant.\n\nI can help you with:\n1. **Symptom & Disease Guidance**: Ask me about symptoms, warning signs, causes, or stages of any condition (cancer, diabetes, heart disease, stroke, etc.).\n2. **Specialist Doctor Matching**: Tell me what you're feeling, and I'll connect you directly with verified hospital doctors.\n3. **Live OPD Queue Tracking**: Check token advances, room numbers, and live wait times for Chamber 304.\n4. **Hospital Fast-Track & Emergency**: Priority admission tokens for acute red-flag symptoms.\n\nHow can I help you today?`,
      actions: defaultActions,
      suggestedReplies: [
        "What are the symptoms of cancer?",
        "What are the symptoms of diabetes?",
        "How does the Live OPD Queue work?",
        "Which specialist should I see?",
      ],
    });
  } catch (error) {
    console.error("MediGuide chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat consultation." },
      { status: 500 }
    );
  }
}


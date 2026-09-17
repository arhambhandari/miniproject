import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { queueManager } from "@/lib/queueManager";
import { MOCK_DOCTORS } from "@/lib/data";
import type { ChatAction, Doctor } from "@/types";

export const dynamic = "force-dynamic";

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
    const query = (lastUserMessage?.text || lastUserMessage?.content || "").trim().toLowerCase();

    // 1. Emergency Red-Flag Intent
    const emergencyKeywords = [
      "chest pain", "heart attack", "stroke", "can't breathe", "cannot breathe",
      "difficulty breathing", "unconscious", "severe bleeding", "emergency", "sos",
      "ambulance", "choking", "paralysis", "seizure", "collapsed", "cyanosis", "coughing blood"
    ];

    const isEmergency = emergencyKeywords.some((kw) => query.includes(kw));

    if (isEmergency) {
      const emergencyActions: ChatAction[] = [
        {
          type: "BOOK_EMERGENCY",
          label: "🚨 Book Emergency Priority Token (#EM-01)",
          emergencyReason: lastUserMessage.text,
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

    if (medsKeywords.some((kw) => query.includes(kw))) {
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

    // 5. Specialist & Symptom Clinical Inquiry
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
    } else if (query.includes("fever") || query.includes("cough") || query.includes("cold") || query.includes("stomach") || query.includes("infection")) {
      targetSpecialty = "General";
      specialtyLabel = "General Medicine & Internal Health";
    }

    if (targetSpecialty) {
      // Find matching doctor from DB or fallback
      let matchedDoctor: Doctor | null = null;
      try {
        const dbDoctor = await prisma.doctorProfile.findFirst({
          where: {
            specialization: { contains: targetSpecialty, mode: "insensitive" },
          },
          include: {
            user: { select: { name: true, image: true, email: true } },
          },
        });

        if (dbDoctor) {
          matchedDoctor = {
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

      if (!matchedDoctor) {
        const fallback = MOCK_DOCTORS.find((d) =>
          d.specialization.toLowerCase().includes(targetSpecialty.toLowerCase())
        );
        matchedDoctor = fallback || MOCK_DOCTORS[0];
      }

      const actions: ChatAction[] = [
        {
          type: "BOOK_DOCTOR",
          label: `Book with ${matchedDoctor.user.name}`,
          doctor: matchedDoctor,
          triageDisease: lastUserMessage.text,
        },
        {
          type: "START_TRIAGE",
          label: "🔍 Run Full Clinical Pre-Triage",
          triageDisease: lastUserMessage.text,
        },
      ];

      return NextResponse.json({
        reply: `🩺 **Specialist Recommendation: ${specialtyLabel}**\n\nBased on your symptoms (*"${lastUserMessage.text}"*), we recommend consulting our verified specialist in **${specialtyLabel}**.\n\n• **Recommended Specialist**: **${matchedDoctor.user.name}**\n• **Experience**: ${matchedDoctor.experience} Years • ${matchedDoctor.satisfaction}% Patient Satisfaction\n• **Hospital / Chamber**: ${matchedDoctor.hospitalName} (OPD Chamber 304)\n• **Consultation Fee**: ₹${matchedDoctor.fee?.toLocaleString() || "1,800"}\n• **Next Available Slot**: ${matchedDoctor.nextAvailable}\n\nYou can book a consultation immediately or run a quick 30-second Clinical Pre-Triage to identify any secondary symptoms.`,
        actions,
        suggestedReplies: [
          `Book with ${matchedDoctor.user.name}`,
          "🔍 Run Full Clinical Pre-Triage",
          "What is the consultation fee?"
        ],
      });
    }

    // 6. Default Helpful Navigator Greeting
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
      reply: `👋 Hello! I am **MediGuide AI**, your intelligent 24/7 clinical navigator and hospital assistant.\n\nI can help you with:\n1. **Symptom Guidance**: Tell me what you're experiencing, and I'll match you with the right specialist department.\n2. **Live OPD Queue Tracking**: Check token numbers, chamber locations, and real-time wait times.\n3. **Hospital Fast-Track & Emergency**: Instant priority queue access for acute or life-threatening symptoms.\n4. **Medications & Vitals**: Access prescription logs and adherence tracking.\n\nHow can I help you today?`,
      actions: defaultActions,
      suggestedReplies: [
        "Which specialist should I see?",
        "How does the Live OPD Queue work?",
        "I need an emergency appointment",
        "Where do I find my digital pass?"
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

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    const {
      channel = "WHATSAPP", // "WHATSAPP" | "SMS"
      template = "APPOINTMENT_PASS", // "APPOINTMENT_PASS" | "MEDICATION_REMINDER" | "DOCTOR_DELAY" | "LAB_READY"
      recipientPhone = "+91 98200 00000",
      patientName = session?.user?.name || "Rahul Sharma",
      doctorName = "Dr. Vikramaditya",
      hospitalName = "Apollo Specialty Hospital, Mumbai",
      tokenNumber = "Token #A-08",
      appointmentTime = "Today, 10:30 AM",
      roomNumber = "OPD Chamber 304",
      medicationName = "Telmisartan (40 mg)",
      medicationTime = "09:00 PM (Night)",
    } = body;

    const messageId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let messageContent = "";
    let previewTitle = "";
    let previewBody = "";

    if (channel === "WHATSAPP") {
      switch (template) {
        case "MEDICATION_REMINDER":
          previewTitle = "⏰ Apollo Pharmacy & MediBook";
          previewBody = `Dose Reminder: Time to take your ${medicationName} scheduled for ${medicationTime}.`;
          messageContent = `*MediBook Daily Medication Alert* 💊\n\nHello ${patientName},\nThis is a clinical reminder from *Apollo Hospital Pharmacy*.\n\n🔔 *Dose Due:* ${medicationName}\n⏰ *Scheduled:* ${medicationTime}\n📋 *Instructions:* Take 1 tablet with warm water post-dinner.\n\n_Please log your intake in the MediBook portal to keep your adherence score optimal._`;
          break;

        case "DOCTOR_DELAY":
          previewTitle = "⚠️ OPD Schedule Update";
          previewBody = `${doctorName}'s clinic is delayed by 15 mins. Revised time: 10:45 AM.`;
          messageContent = `*Hospital OPD Live Update* 🏥\n\nDear ${patientName},\n${doctorName} is currently attending to an urgent trauma consultation. Your OPD slot is delayed by approximately 15 minutes.\n\n*Updated Consultation Time:* ~10:45 AM\n*Token Number:* ${tokenNumber} (Chamber ${roomNumber})\n\nWe appreciate your patience.`;
          break;

        case "LAB_READY":
          previewTitle = "📄 Apollo Diagnostics";
          previewBody = "Your Complete Blood Count (CBC) report is ready for download.";
          messageContent = `*Diagnostic Report Ready* 🔬\n\nDear ${patientName},\nYour pathology lab results (*CBC & Lipid Profile*) have been verified by the Chief Pathologist.\n\nView or download your digital report directly in your MediBook Medical Records.`;
          break;

        case "APPOINTMENT_PASS":
        default:
          previewTitle = "🏥 Apollo Specialty Hospital";
          previewBody = `OPD Confirmed: ${tokenNumber} with ${doctorName} at ${appointmentTime}.`;
          messageContent = `*Digital OPD Entry & Token Pass* 🏥\n\nNamaste ${patientName},\nYour consultation at *${hospitalName}* is confirmed.\n\n🎟️ *Queue Token:* ${tokenNumber}\n👨‍⚕️ *Physician:* ${doctorName}\n⏰ *Slot:* ${appointmentTime}\n🚪 *Location:* ${roomNumber}, 3rd Floor Wing B\n🆔 *UHID / ABHA:* MB-98412\n\n*Important Instructions:*\n• Please arrive 10 minutes prior to your slot.\n• Show this digital WhatsApp message at the OPD reception desk for immediate priority entry.`;
          break;
      }
    } else {
      // SMS / RCS Mode
      switch (template) {
        case "MEDICATION_REMINDER":
          previewTitle = "VK-APOLLO";
          previewBody = `MediBook Alert: Take ${medicationName} at ${medicationTime}. Reply 1 if taken.`;
          messageContent = `[Apollo MediBook] Reminder: Take ${medicationName} at ${medicationTime}. Post-dinner with water. Track adherence: https://medibook.in/m/adh`;
          break;

        case "DOCTOR_DELAY":
          previewTitle = "VK-APOLLO";
          previewBody = `OPD Update: Slot with ${doctorName} delayed by 15 mins. Token ${tokenNumber}.`;
          messageContent = `[Apollo OPD] Dear ${patientName}, ${doctorName}'s OPD is running 15 mins behind schedule due to emergency. Revised slot: 10:45 AM. Token ${tokenNumber}.`;
          break;

        case "APPOINTMENT_PASS":
        default:
          previewTitle = "VM-MEDIBK";
          previewBody = `Booking Confirmed: Token ${tokenNumber} with ${doctorName} at ${hospitalName}.`;
          messageContent = `[MediBook] Confirmed: Token ${tokenNumber} with ${doctorName} on ${appointmentTime} at ${hospitalName}, ${roomNumber}. E-Pass: https://medibook.in/p/98412`;
          break;
      }
    }

    return NextResponse.json({
      success: true,
      messageId,
      timestamp,
      channel,
      template,
      recipientPhone,
      previewTitle,
      previewBody,
      messageContent,
      deliveryStatus: "DELIVERED",
    });
  } catch (err: any) {
    console.error("Simulation dispatch error:", err);
    return NextResponse.json({ error: err?.message || "Failed to simulate message" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 403 });
    }

    // Fetch all appointments for this doctor with patient details
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctorProfile.id },
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            medications: {
              where: { doctorId: doctorProfile.id },
              orderBy: { createdAt: "desc" },
            },
            clinicalRecords: {
              where: { doctorId: doctorProfile.id },
              orderBy: { createdAt: "desc" },
            },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by unique patient
    const patientMap = new Map<string, any>();

    for (const appt of appointments) {
      const p = appt.patient;
      if (!p) continue;

      if (!patientMap.has(p.id)) {
        patientMap.set(p.id, {
          patientId: p.id,
          userId: p.user?.id,
          name: p.user?.name || "Patient",
          email: p.user?.email || "",
          image: p.user?.image,
          contactNumber: p.contactNumber || "+91 98765 00000",
          latestCondition: appt.disease || "General Consultation",
          appointments: [],
          medications: p.medications || [],
          clinicalRecords: p.clinicalRecords || [],
        });
      }

      const existing = patientMap.get(p.id);
      existing.appointments.push({
        id: appt.id,
        date: appt.date,
        time: appt.startTime,
        status: appt.status,
        disease: appt.disease,
        fee: appt.payment?.amount || doctorProfile.fee,
        paymentStatus: appt.payment?.status || "PENDING",
      });
    }

    const patients = Array.from(patientMap.values());

    return NextResponse.json(
      { patients, totalPatients: patients.length },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    console.error("GET /api/doctor/patients error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch doctor patients" }, { status: 500 });
  }
}

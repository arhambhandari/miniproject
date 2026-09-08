import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch clinical records & recorded vitals
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedPatientId = searchParams.get("patientId");
    const userRole = session.user.role || "PATIENT";

    let records;

    if (userRole === "DOCTOR") {
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!doctorProfile) {
        return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
      }

      if (requestedPatientId) {
        records = await prisma.clinicalRecord.findMany({
          where: { patientId: requestedPatientId },
          include: {
            doctor: { include: { user: { select: { name: true } } } },
            patient: { include: { user: { select: { name: true } } } },
          },
          orderBy: { createdAt: "desc" },
        });
      } else {
        records = await prisma.clinicalRecord.findMany({
          where: { doctorId: doctorProfile.id },
          include: {
            doctor: { include: { user: { select: { name: true } } } },
            patient: { include: { user: { select: { name: true, email: true } } } },
          },
          orderBy: { createdAt: "desc" },
        });
      }
    } else {
      // Patient view
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!patientProfile) {
        return NextResponse.json({ records: [], latestVitals: null });
      }

      records = await prisma.clinicalRecord.findMany({
        where: { patientId: patientProfile.id },
        include: {
          doctor: {
            include: {
              user: { select: { name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    const latest = records[0] || null;

    return NextResponse.json(
      {
        records,
        latestVitals: latest
          ? {
              bloodPressure: latest.bloodPressure || "120/80",
              heartRate: latest.heartRate || "72",
              bloodSugar: latest.bloodSugar || "94",
              spo2: latest.spo2 || "99",
              weight: latest.weight || "68 kg",
              temperature: latest.temperature || "98.4",
              diagnosis: latest.diagnosis,
              treatmentPlan: latest.treatmentPlan,
              recordedAt: latest.createdAt,
              doctorName: latest.doctor?.user?.name || "Attending Physician",
            }
          : null,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    console.error("GET /api/clinical-records error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch records" }, { status: 500 });
  }
}

// POST: Record new diagnosis, vitals, or clinical notes (Doctor only)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctorProfile) {
      return NextResponse.json({ error: "Only verified doctors can record clinical data" }, { status: 403 });
    }

    const body = await req.json();
    const {
      patientId,
      appointmentId,
      diagnosis,
      treatmentPlan,
      notes,
      bloodPressure,
      heartRate,
      bloodSugar,
      spo2,
      weight,
      temperature,
    } = body;

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
    }

    const record = await prisma.clinicalRecord.create({
      data: {
        patientId,
        doctorId: doctorProfile.id,
        appointmentId: appointmentId || null,
        diagnosis: diagnosis ? diagnosis.trim() : null,
        treatmentPlan: treatmentPlan ? treatmentPlan.trim() : null,
        notes: notes ? notes.trim() : null,
        bloodPressure: bloodPressure ? bloodPressure.trim() : null,
        heartRate: heartRate ? heartRate.trim() : null,
        bloodSugar: bloodSugar ? bloodSugar.trim() : null,
        spo2: spo2 ? spo2.trim() : null,
        weight: weight ? weight.trim() : null,
        temperature: temperature ? temperature.trim() : null,
      },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/clinical-records error:", err);
    return NextResponse.json({ error: err.message || "Failed to record clinical data" }, { status: 500 });
  }
}

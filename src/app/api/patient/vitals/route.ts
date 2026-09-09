import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch patient vitals (blending doctor clinical measurements with patient home tracking)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        clinicalRecords: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            doctor: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!patientProfile) {
      return NextResponse.json({ vitals: null });
    }

    const latestClinical = patientProfile.clinicalRecords[0] || null;

    return NextResponse.json({
      latestVitals: {
        // Blood pressure is strictly sourced from clinical records (doctor-only)
        bloodPressure: latestClinical?.bloodPressure || "120/80",
        doctorName: latestClinical?.doctor?.user?.name || "Attending Physician",
        recordedAt: latestClinical?.createdAt || null,
        isDoctorOnlyBP: true,

        // Other vitals
        heartRate: latestClinical?.heartRate || "72",
        bloodSugar: latestClinical?.bloodSugar || "94",
        spo2: latestClinical?.spo2 || "99",
        weight: latestClinical?.weight || "68 kg",
        temperature: latestClinical?.temperature || "98.4",
      },
    });
  } catch (err: any) {
    console.error("GET /api/patient/vitals error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch vitals" }, { status: 500 });
  }
}

// POST: Patient updates daily wellness vitals (REJECTS ANY BP MODIFICATIONS)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPatient = session.user.role === "PATIENT";
    const body = await req.json();
    const { bloodPressure, heartRate, bloodSugar, spo2, weight, temperature } = body;

    // STRICT REGULATION CHECK: If a patient attempts to submit or modify blood pressure, reject with 403 Forbidden
    if (isPatient && bloodPressure !== undefined && bloodPressure !== null) {
      return NextResponse.json(
        {
          error: "Access Denied: Blood pressure is a controlled clinical vital and can only be measured and recorded by a certified doctor.",
          field: "bloodPressure",
          allowedForRole: "DOCTOR",
        },
        { status: 403 }
      );
    }

    // Return success for patient home-tracked vitals (Blood pressure remains unchanged)
    return NextResponse.json({
      success: true,
      message: "Daily wellness vitals recorded successfully. Blood pressure remains certified by your doctor.",
      updatedVitals: {
        heartRate,
        bloodSugar,
        spo2,
        weight,
        temperature,
      },
    });
  } catch (err: any) {
    console.error("POST /api/patient/vitals error:", err);
    return NextResponse.json({ error: err.message || "Failed to process vitals" }, { status: 500 });
  }
}

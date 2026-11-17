import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getErrorMessage } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch the latest vitals recorded in a clinical record.
export async function GET() {
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

    if (!patientProfile) return NextResponse.json({ latestVitals: null });

    const latestClinical = patientProfile.clinicalRecords[0] || null;

    return NextResponse.json({
      latestVitals: latestClinical
        ? {
            bloodPressure: latestClinical.bloodPressure,
            doctorName: latestClinical.doctor?.user?.name || null,
            recordedAt: latestClinical.createdAt,
            isDoctorOnlyBP: true,
            heartRate: latestClinical.heartRate,
            bloodSugar: latestClinical.bloodSugar,
            spo2: latestClinical.spo2,
            weight: latestClinical.weight,
            temperature: latestClinical.temperature,
          }
        : null,
    });
  } catch (err: unknown) {
    console.error("GET /api/patient/vitals error:", err);
    return NextResponse.json({ error: getErrorMessage(err, "Failed to fetch vitals") }, { status: 500 });
  }
}

// POST: Patients cannot write clinical vitals. Doctors must use /api/clinical-records.
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPatient = session.user.role === "PATIENT";
    const body = await req.json().catch(() => ({}));
    const { bloodPressure } = body;

    // PATIENT RESTRICTION: Patients can only log their medication adherence; all clinical vitals are doctor-only.
    if (isPatient) {
      if (bloodPressure !== undefined && bloodPressure !== null) {
        return NextResponse.json(
          {
            error: "Access Denied: Blood pressure is a controlled clinical vital and can only be measured and recorded by a certified doctor.",
            field: "bloodPressure",
            allowedForRole: "DOCTOR",
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: "Access Denied: Clinical health vitals cannot be modified by patients. Patients are only permitted to log their daily medication adherence. Clinical vitals are recorded and updated exclusively by your attending physician.",
          allowedForRole: "DOCTOR",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Clinical measurements must be recorded through POST /api/clinical-records." },
      { status: 405 }
    );
  } catch (err: unknown) {
    console.error("POST /api/patient/vitals error:", err);
    return NextResponse.json({ error: getErrorMessage(err, "Failed to process vitals") }, { status: 500 });
  }
}

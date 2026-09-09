import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: Fetch medications
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedPatientId = searchParams.get("patientId");
    const userRole = session.user.role || "PATIENT";

    let medications;

    if (userRole === "DOCTOR") {
      // Find doctor profile
      const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!doctorProfile) {
        return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
      }

      if (requestedPatientId) {
        medications = await prisma.medication.findMany({
          where: { patientId: requestedPatientId },
          include: {
            doctor: {
              include: { user: { select: { name: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      } else {
        medications = await prisma.medication.findMany({
          where: { doctorId: doctorProfile.id },
          include: {
            doctor: {
              include: { user: { select: { name: true } } },
            },
            patient: {
              include: { user: { select: { name: true, email: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      }
    } else {
      // Current user is patient
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!patientProfile) {
        return NextResponse.json({ medications: [] });
      }

      medications = await prisma.medication.findMany({
        where: { patientId: patientProfile.id },
        include: {
          doctor: {
            include: { user: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    const formatted = medications.map((m) => ({
      id: m.id,
      name: m.name,
      dosage: m.dosage,
      instruction: m.instruction,
      timeSlot: m.timeSlot,
      scheduledTime: m.scheduledTime,
      daysRemaining: m.daysRemaining,
      taken: m.taken,
      takenAt: m.takenAt,
      doctorName: m.doctor?.user?.name || "Attending Physician",
      patientId: m.patientId,
      createdAt: m.createdAt,
    }));

    return NextResponse.json(
      { medications: formatted },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    console.error("GET /api/medications error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch medications" }, { status: 500 });
  }
}

// POST: Prescribe medication (Doctor only)
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
      return NextResponse.json({ error: "Only verified doctors can prescribe medication." }, { status: 403 });
    }

    const body = await req.json();
    const {
      patientId,
      appointmentId,
      name,
      dosage,
      instruction,
      timeSlot = "Morning",
      scheduledTime = "08:00 AM",
      daysRemaining = 14,
    } = body;

    if (!patientId || !name || !dosage) {
      return NextResponse.json({ error: "Missing required prescription details: patientId, name, dosage" }, { status: 400 });
    }

    const medication = await prisma.medication.create({
      data: {
        patientId,
        doctorId: doctorProfile.id,
        appointmentId: appointmentId || null,
        name: name.trim(),
        dosage: dosage.trim(),
        instruction: (instruction || "Take as directed by doctor").trim(),
        timeSlot: ["Morning", "Afternoon", "Night"].includes(timeSlot) ? timeSlot : "Morning",
        scheduledTime: scheduledTime || "08:00 AM",
        daysRemaining: Number(daysRemaining) || 14,
        taken: false,
      },
      include: {
        doctor: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        medication: {
          id: medication.id,
          name: medication.name,
          dosage: medication.dosage,
          instruction: medication.instruction,
          timeSlot: medication.timeSlot,
          scheduledTime: medication.scheduledTime,
          daysRemaining: medication.daysRemaining,
          taken: medication.taken,
          doctorName: medication.doctor?.user?.name || "Dr. Specialist",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/medications error:", err);
    return NextResponse.json({ error: err.message || "Failed to prescribe medication" }, { status: 500 });
  }
}

// PATCH: Update taken status or medication details
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, taken, daysRemaining, instruction, dosage } = body;

    if (!id) {
      return NextResponse.json({ error: "Medication ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof taken === "boolean") {
      updateData.taken = taken;
      updateData.takenAt = taken
        ? (body.takenAt || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        : null;
    }
    if (daysRemaining !== undefined) updateData.daysRemaining = Number(daysRemaining);
    if (instruction) updateData.instruction = instruction.trim();
    if (dosage) updateData.dosage = dosage.trim();

    const updated = await prisma.medication.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, medication: updated });
  } catch (err: any) {
    console.error("PATCH /api/medications error:", err);
    return NextResponse.json({ error: err.message || "Failed to update medication" }, { status: 500 });
  }
}

// DELETE: Remove medication (Doctor only)
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Medication ID required" }, { status: 400 });
    }

    await prisma.medication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/medications error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete medication" }, { status: 500 });
  }
}

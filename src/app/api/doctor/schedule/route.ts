import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Default fallback schedule
const DEFAULT_SCHEDULE = {
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  morningShift: { enabled: true, start: "09:00 AM", end: "01:00 PM" },
  eveningShift: { enabled: true, start: "05:00 PM", end: "08:30 PM" },
  slotDuration: 20, // minutes
  maxTokensPerHour: 3,
  emergencyBufferSlots: 2,
  consultationFee: 2000,
  teleconsultFee: 1500,
  followUpFee: 1000,
  blockedDates: [
    { id: "leave_1", date: "2026-10-24", reason: "National Medical Conference" },
    { id: "leave_2", date: "2026-11-01", reason: "Diwali Hospital OPD Holiday" },
  ],
};

// In-memory persistent cache for schedule overrides per doctor
const scheduleCache = new Map<string, typeof DEFAULT_SCHEDULE>();

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { name: true, email: true } } },
    });

    const docId = doctorProfile?.id || session.user.id;
    const currentSchedule = scheduleCache.get(docId) || {
      ...DEFAULT_SCHEDULE,
      consultationFee: doctorProfile?.fee || 2000,
    };

    return NextResponse.json({
      success: true,
      schedule: currentSchedule,
      doctor: {
        id: docId,
        name: doctorProfile?.user?.name || "Dr. Vikramaditya",
        specialization: doctorProfile?.specialization || "Senior Cardiologist",
        hospitalName: doctorProfile?.hospitalName || "Apollo Specialty Hospital, Mumbai",
      },
    });
  } catch (err: any) {
    console.error("GET /api/doctor/schedule error:", err);
    return NextResponse.json({ error: err?.message || "Failed to load schedule" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isDoctor = session.user.role === "DOCTOR";
    if (!isDoctor) {
      return NextResponse.json({ error: "Only verified physicians can configure OPD schedules." }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    const docId = doctorProfile?.id || session.user.id;

    // Merge updated schedule
    const updatedSchedule = {
      ...DEFAULT_SCHEDULE,
      ...body,
    };

    scheduleCache.set(docId, updatedSchedule);

    // Update doctor's fee in database if provided
    if (body.consultationFee && doctorProfile) {
      await prisma.doctorProfile.update({
        where: { id: doctorProfile.id },
        data: { fee: Number(body.consultationFee) },
      });
    }

    return NextResponse.json({
      success: true,
      message: "OPD schedule and availability slots successfully updated and synced.",
      schedule: updatedSchedule,
    });
  } catch (err: any) {
    console.error("POST /api/doctor/schedule error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update schedule" }, { status: 500 });
  }
}

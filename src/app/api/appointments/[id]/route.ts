import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH: Update appointment status (Doctor confirms/completes, or Patient cancels)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, meetingNotes } = body;

    const validStatuses = ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "Upcoming", "Completed", "Cancelled"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Verify ownership: must be the doctor or patient associated with this appointment
    const isDoctor = appointment.doctor.userId === session.user.id;
    const isPatient = appointment.patient.userId === session.user.id;

    if (!isDoctor && !isPatient) {
      return NextResponse.json({ error: "Forbidden: Not authorized to modify this appointment" }, { status: 403 });
    }

    // Normalize status string
    const normalizedStatus = status?.toUpperCase() === "UPCOMING" ? "CONFIRMED" : status?.toUpperCase();

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(normalizedStatus && { status: normalizedStatus }),
        ...(meetingNotes !== undefined && { meetingNotes }),
      },
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

// DELETE: Cancel appointment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const isAuthorized = appointment.doctor.userId === session.user.id || appointment.patient.userId === session.user.id;
    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Mark as CANCELLED instead of hard deleting to preserve audit history
    const cancelled = await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, appointment: cancelled });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch appointments for current logged-in user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role || "PATIENT";

    let appointments;

    if (userRole === "DOCTOR") {
      // Fetch appointments where current user is the doctor
      appointments = await prisma.appointment.findMany({
        where: {
          doctor: {
            userId: userId,
          },
        },
        include: {
          patient: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Default: Fetch appointments where current user is the patient
      appointments = await prisma.appointment.findMany({
        where: {
          patient: {
            userId: userId,
          },
        },
        include: {
          doctor: {
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          patient: {
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    const formattedAppointments = appointments.map((appt) => {
      const isDocView = userRole === "DOCTOR";
      const statusNormalized =
        appt.status === "COMPLETED"
          ? "Completed"
          : appt.status === "CANCELLED"
          ? "Cancelled"
          : "Upcoming";

      return {
        id: appt.id,
        patientId: appt.patientId,
        patientUserId: appt.patient?.user?.id,
        patientName: appt.patient?.user?.name || "Patient",
        patientEmail: appt.patient?.user?.email || "",
        patientImage: appt.patient?.user?.image,
        doctorId: appt.doctorId,
        doctorUserId: appt.doctor?.user?.id,
        doctorName: appt.doctor?.user?.name || "Dr. Specialist",
        specialty: appt.doctor?.specialization || "Medicine",
        condition: appt.disease || "General Consultation",
        date: appt.date,
        time: appt.startTime,
        status: statusNormalized,
        fee: `₹${(appt.payment?.amount || appt.doctor?.fee || 1500).toLocaleString()}`,
        paymentStatus: appt.payment?.status || "PENDING",
        hospitalName: appt.doctor?.hospitalName || "Apollo Specialty Hospital",
        roomNumber: "OPD Chamber 304",
        tokenNumber: "Token #A-08",
      };
    });

    return NextResponse.json({ appointments: formattedAppointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST: Book a new appointment with Anti-Double-Booking Protection
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please log in to book an appointment" }, { status: 401 });
    }

    const body = await req.json();
    const { doctorId, date, startTime, disease, patientContact, email, paymentId } = body;

    if (!doctorId || !date || !startTime) {
      return NextResponse.json({ error: "Missing required fields: doctorId, date, and startTime" }, { status: 400 });
    }

    const normalizedDate = String(date).trim();
    const normalizedStartTime = String(startTime).trim();

    // 1. Verify doctor exists and fetch fee
    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Selected doctor profile was not found." }, { status: 404 });
    }

    // Prevent practitioner from booking appointments with themselves
    if (doctor.userId === session.user.id) {
      return NextResponse.json(
        { error: "Doctors cannot book consultations with their own profile." },
        { status: 400 }
      );
    }

    // 2. Ensure patient profile exists for the user
    let patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!patientProfile) {
      patientProfile = await prisma.patientProfile.create({
        data: {
          userId: session.user.id,
          contactNumber: patientContact || null,
        },
      });
    }

    // 3. Anti-Double-Booking Engine with Database Transaction
    let newAppointment;
    try {
      newAppointment = await prisma.$transaction(
        async (tx) => {
          // A. Single atomic check for doctor or patient conflicts at the exact same date & time
          const conflictingSlot = await tx.appointment.findFirst({
            where: {
              date: normalizedDate,
              startTime: normalizedStartTime,
              status: { notIn: ["CANCELLED"] },
              OR: [
                { doctorId },
                { patientId: patientProfile.id },
              ],
            },
          });

          if (conflictingSlot) {
            if (conflictingSlot.doctorId === doctorId) {
              throw new Error("SLOT_ALREADY_BOOKED");
            }
            throw new Error("PATIENT_ALREADY_BOOKED");
          }

          return await tx.appointment.create({
            data: {
              patientId: patientProfile.id,
              doctorId,
              date: normalizedDate,
              startTime: normalizedStartTime,
              disease: disease || "General Consultation",
              status: paymentId ? "CONFIRMED" : "SCHEDULED",
              payment: {
                create: {
                  amount: doctor.fee,
                  currency: "INR",
                  status: paymentId ? "SUCCESS" : "PENDING",
                  razorpayPaymentId: paymentId || null,
                },
              },
            },
            include: {
              doctor: { include: { user: true } },
              patient: { include: { user: true } },
              payment: true,
            },
          });
        },
        {
          maxWait: 15000,
          timeout: 30000,
        }
      );
    } catch (txError: any) {
      if (txError?.message === "SLOT_ALREADY_BOOKED") {
        return NextResponse.json(
          { error: `Dr. ${doctor.user.name} is already booked on ${normalizedDate} at ${normalizedStartTime}. Please select another time slot.` },
          { status: 409 }
        );
      }
      if (txError?.message === "PATIENT_ALREADY_BOOKED") {
        return NextResponse.json(
          { error: `You already have an active consultation booked on ${normalizedDate} at ${normalizedStartTime}.` },
          { status: 409 }
        );
      }
      throw txError;
    }

    const patientDisplayName = session.user.name || "Patient";
    const doctorDisplayName = doctor.user.name || "Doctor";
    const apptFee = `₹${doctor.fee.toLocaleString()}`;

    // 4. Send Confirmation Email asynchronously
    let emailPreviewUrl = "";
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: '"MediBook" <no-reply@medibook.com>',
        to: email || session.user.email || "patient@example.com",
        subject: "Appointment Confirmed - MediBook",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
            <h2 style="color: #2563eb;">Your Appointment is Confirmed! 🎉</h2>
            <p>Hi ${patientDisplayName},</p>
            <p>You have successfully scheduled an appointment with <strong>${doctorDisplayName}</strong> (${doctor.specialization}).</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Doctor:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${doctorDisplayName}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Hospital/Clinic:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${doctor.hospitalName}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${date}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${startTime}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Consultation Fee:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${apptFee}</td></tr>
            </table>
            <p style="margin-top: 30px; color: #64748b; font-size: 14px;">Please arrive 10 minutes prior to your scheduled time.</p>
          </div>
        `,
      });
      emailPreviewUrl = nodemailer.getTestMessageUrl(info) || "";
    } catch (emailErr) {
      console.warn("Notice: Email confirmation could not be dispatched:", emailErr);
    }

    const formattedResponse = {
      id: newAppointment.id,
      patientName: patientDisplayName,
      doctorId: doctor.id,
      doctorName: doctorDisplayName,
      specialty: doctor.specialization,
      date,
      time: startTime,
      status: newAppointment.status,
      fee: apptFee,
      paymentId: paymentId || undefined,
    };

    return NextResponse.json(
      {
        success: true,
        appointment: formattedResponse,
        emailPreviewUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking failed:", error);
    return NextResponse.json({ error: "Failed to process appointment booking." }, { status: 500 });
  }
}

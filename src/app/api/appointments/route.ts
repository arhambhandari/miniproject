import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// In-memory store for the prototype since Prisma SQLite adapter is having environment issues
const appointments: any[] = [
  {
    id: "app_1",
    patientName: "Rahul Sharma",
    doctorId: "doc_1",
    doctorName: "Dr. Elena Rostova",
    specialty: "Neuro-Oncology",
    date: "Oct 12, 2026",
    time: "10:00 AM",
    status: "Upcoming",
    fee: "₹1,500"
  },
  {
    id: "app_2",
    patientName: "Anita Desai",
    doctorId: "doc_2",
    doctorName: "Dr. Marcus Vance",
    specialty: "Surgical Oncology",
    date: "Sep 01, 2026",
    time: "2:30 PM",
    status: "Completed",
    fee: "₹2,000"
  }
];
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Filter appointments by session.user.id
  return NextResponse.json({ appointments });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { doctorId, date, startTime, disease, patientName, patientContact, email, fee } = body;

    if (!doctorId || !date || !startTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Mock doctor details for the prototype
    const doctorName = doctorId === "doc_1" ? "Dr. Elena Rostova" : "Dr. Marcus Vance";
    const specialty = doctorId === "doc_1" ? "Neuro-Oncology" : "Surgical Oncology";

    const newAppt = {
      id: "mock_appt_" + Math.floor(Math.random() * 1000),
      patientName: patientName || "Test Patient",
      doctorId,
      doctorName,
      specialty,
      date,
      time: startTime,
      status: "Upcoming",
      fee: fee || "₹1,500"
    };

    appointments.push(newAppt);

    // Simulated Email Sending via Ethereal
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
        to: email || "patient@example.com",
        subject: "Appointment Confirmed - MediBook",
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h2>Your Appointment is Confirmed! 🎉</h2>
            <p>Hi ${newAppt.patientName},</p>
            <p>You are scheduled to see <strong>${doctorName}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${date}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${startTime}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Fee:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">₹1,500</td></tr>
            </table>
            <p style="margin-top: 30px; color: #666;">Thank you for using MediBook.</p>
          </div>
        `,
      });
      emailPreviewUrl = nodemailer.getTestMessageUrl(info) || "";
      console.log("Preview URL: %s", emailPreviewUrl);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    return NextResponse.json({ success: true, appointment: newAppt, emailPreviewUrl }, { status: 201 });
  } catch (error) {
    console.error("Booking failed:", error);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  }
}

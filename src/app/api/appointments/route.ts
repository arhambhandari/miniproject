import { NextResponse } from "next/server";

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

export async function GET() {
  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { doctorId, date, startTime, disease } = body;

    if (!doctorId || !date || !startTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Mock doctor details for the prototype
    const doctorName = doctorId === "doc_1" ? "Dr. Elena Rostova" : "Dr. Marcus Vance";
    const specialty = doctorId === "doc_1" ? "Neuro-Oncology" : "Surgical Oncology";

    const newAppt = {
      id: "mock_appt_" + Math.floor(Math.random() * 1000),
      patientName: "Test Patient",
      doctorId,
      doctorName,
      specialty,
      date,
      time: startTime,
      disease,
      status: "Upcoming",
      fee: "₹1,500"
    };

    appointments.push(newAppt);

    return NextResponse.json({ 
      message: "Appointment booked successfully!",
      appointment: newAppt
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}

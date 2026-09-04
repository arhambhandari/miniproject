import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Clear existing
    await prisma.appointment.deleteMany();
    await prisma.doctorProfile.deleteMany();
    await prisma.patientProfile.deleteMany();
    await prisma.user.deleteMany();

    const docUser1 = await prisma.user.create({
      data: {
        name: "Dr. Elena Rostova",
        email: "elena@example.com",
        role: "DOCTOR",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
        doctorProfile: {
          create: {
            specialization: "Neuro-Oncology",
            qualifications: "MD, PhD",
            experience: 14,
            hospitalName: "Aerial Central Medical",
            contactNumber: "+1-555-0101",
          }
        }
      }
    });

    const docUser2 = await prisma.user.create({
      data: {
        name: "Dr. Marcus Vance",
        email: "marcus@example.com",
        role: "DOCTOR",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
        doctorProfile: {
          create: {
            specialization: "Surgical Oncology",
            qualifications: "MD, FACS",
            experience: 22,
            hospitalName: "Aerial West Hospital",
            contactNumber: "+1-555-0102",
          }
        }
      }
    });

    const patient = await prisma.user.create({
      data: {
        name: "Test Patient",
        email: "patient@example.com",
        role: "PATIENT",
        patientProfile: {
          create: {}
        }
      }
    });

    return NextResponse.json({ success: true, message: "Database seeded!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

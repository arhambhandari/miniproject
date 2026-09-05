import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, name, role, specialization, hospitalName, location } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === "doctor" ? "DOCTOR" : "PATIENT",
      }
    });

    // Create specific profile
    if (role === "doctor") {
      await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          specialization: data.specialty || "General Practice",
          hospitalName: hospitalName || "Independent Clinic",
          contactNumber: "Pending", 
          qualifications: "MD",
          experience: 5
        }
      });
    } else {
      await prisma.patientProfile.create({
        data: {
          userId: user.id,
        }
      });
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}

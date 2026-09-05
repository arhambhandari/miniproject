import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Input validation helpers
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string): boolean {
  // Minimum 8 characters, at least one letter and one number
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, name, role, specialization, hospitalName } = data;

    // --- Input Validation ---
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json({ error: "Password must be at least 8 characters with letters and numbers." }, { status: 400 });
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Name must be between 2 and 100 characters." }, { status: 400 });
    }

    const validRoles = ["doctor", "patient"];
    if (role && !validRoles.includes(role.toLowerCase())) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // --- Check for existing user ---
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // --- Hash password with strong salt rounds ---
    const hashedPassword = await bcrypt.hash(password, 12);

    // --- Create User ---
    const user = await prisma.user.create({
      data: {
        name: sanitize(name),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role === "doctor" ? "DOCTOR" : "PATIENT",
      }
    });

    // --- Create specific profile ---
    if (role === "doctor") {
      await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          specialization: sanitize(data.specialty || specialization || "General Practice"),
          hospitalName: sanitize(hospitalName || "Independent Clinic"),
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

    // Return safe user (no password hash!)
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });

  } catch (error) {
    console.error("Registration error:", error);
    // Never leak internal error details to the client
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}

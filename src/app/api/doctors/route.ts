import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDoctorsData, invalidateDoctorsCache } from "@/lib/doctors";

// GET: Fetch list of doctors from Database with high-speed in-memory cache
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const sort = searchParams.get("sort");
    const q = searchParams.get("q");

    const formattedDoctors = await getDoctorsData({ specialty, sort, q });

    return NextResponse.json(formattedDoctors, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching doctors from database:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

// POST: Create Doctor Profile (Admin / Registered Doctor)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, specialization, qualifications, experience, hospitalName, contactNumber, fee } = body;

    if (!userId || !specialization || !hospitalName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const doctor = await prisma.doctorProfile.create({
      data: {
        userId,
        specialization: specialization.toUpperCase(),
        qualifications: qualifications || "MD",
        experience: experience ? parseInt(experience) : 5,
        hospitalName,
        contactNumber: contactNumber || "+91-555-0100",
        fee: fee ? parseFloat(fee) : 1500,
      },
      include: {
        user: true,
      },
    });

    invalidateDoctorsCache();

    return NextResponse.json({ success: true, doctor }, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}

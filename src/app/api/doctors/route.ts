import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch list of doctors from Database
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const sort = searchParams.get("sort");
    const q = searchParams.get("q");

    const where: any = {};

    // Apply Specialty Filter
    if (specialty && specialty !== "ALL SPECIALTIES") {
      where.specialization = {
        equals: specialty.toUpperCase(),
      };
    }

    // Apply Search Query Filter
    if (q) {
      where.OR = [
        { hospitalName: { contains: q } },
        { specialization: { contains: q } },
        { user: { name: { contains: q } } },
      ];
    }

    let orderBy: any = { experience: "desc" };
    if (sort === "HIGHEST RATED") {
      orderBy = { satisfaction: "desc" };
    } else if (sort === "MOST REVIEWED") {
      orderBy = { reviews: { _count: "desc" } };
    }

    const doctors = await prisma.doctorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        reviews: true,
      },
      orderBy,
    });

    // Format safe response matching Doctor type
    const formattedDoctors = doctors.map((doc) => {
      const realSatisfaction = doc.reviews && doc.reviews.length > 0
        ? Math.round((doc.reviews.reduce((acc, r) => acc + r.rating, 0) / (doc.reviews.length * 5)) * 100)
        : (doc.satisfaction && doc.reviews?.length ? doc.satisfaction : 0);

      return {
        id: doc.id,
        specialization: doc.specialization,
        qualifications: doc.qualifications,
        experience: doc.experience,
        hospitalName: doc.hospitalName,
        contactNumber: doc.contactNumber,
        satisfaction: realSatisfaction,
        nextAvailable: doc.nextAvailable,
        fee: doc.fee,
        reviews: doc.reviews || [],
        user: {
          name: doc.user.name || "Doctor",
          image: doc.user.image || null,
        },
      };
    });

    return NextResponse.json(formattedDoctors);
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

    return NextResponse.json({ success: true, doctor }, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let doctor = await prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        reviews: {
          include: {
            patient: {
              include: {
                user: {
                  select: { name: true, image: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!doctor) {
      doctor = await prisma.doctorProfile.findFirst({
        where: {
          OR: [
            { id },
            { userId: id },
            { user: { name: { contains: id.replace("Dr. ", "") } } },
          ],
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          reviews: {
            include: {
              patient: {
                include: {
                  user: {
                    select: { name: true, image: true },
                  },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    const realSatisfaction = doctor.reviews.length > 0
      ? Math.round((doctor.reviews.reduce((acc, r) => acc + r.rating, 0) / (doctor.reviews.length * 5)) * 100)
      : 0;

    const formattedDoctor = {
      id: doctor.id,
      specialization: doctor.specialization,
      qualifications: doctor.qualifications,
      experience: doctor.experience,
      hospitalName: doctor.hospitalName,
      contactNumber: doctor.contactNumber,
      satisfaction: realSatisfaction,
      nextAvailable: doctor.nextAvailable,
      fee: doctor.fee,
      bio: doctor.bio,
      user: {
        name: doctor.user.name || "Doctor",
        image: doctor.user.image || null,
      },
      reviews: doctor.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        patientName: r.patient?.user?.name || "Verified Patient",
        createdAt: r.createdAt,
      })),
    };

    return NextResponse.json(formattedDoctor, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}

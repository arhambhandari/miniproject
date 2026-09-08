import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: Retrieve authenticated doctor's full profile details
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    if (!doctorProfile) {
      // Fallback if logged in as DOCTOR without DoctorProfile yet
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      return NextResponse.json({
        profile: {
          id: "",
          userId: session.user.id,
          name: user?.name || "Doctor",
          email: user?.email || "",
          specialization: "Specialist Physician",
          qualifications: "MBBS, MD",
          experience: 10,
          hospitalName: "Apollo Specialty Hospital, Mumbai",
          contactNumber: "+91 98200 00000",
          fee: 2000,
          satisfaction: 98,
          nextAvailable: "Today",
          bio: "Specialist medical practitioner dedicated to exceptional clinical patient care and OPD consultations.",
          roomNumber: "OPD Chamber 304",
        },
      });
    }

    return NextResponse.json({
      profile: {
        id: doctorProfile.id,
        userId: doctorProfile.userId,
        name: doctorProfile.user.name || "Doctor",
        email: doctorProfile.user.email,
        image: doctorProfile.user.image,
        specialization: doctorProfile.specialization,
        qualifications: doctorProfile.qualifications,
        experience: doctorProfile.experience,
        hospitalName: doctorProfile.hospitalName,
        contactNumber: doctorProfile.contactNumber,
        fee: doctorProfile.fee,
        satisfaction: doctorProfile.satisfaction,
        nextAvailable: doctorProfile.nextAvailable,
        bio: doctorProfile.bio || "",
        roomNumber: "OPD Chamber 304",
      },
    });
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor profile" },
      { status: 500 }
    );
  }
}

// PATCH: Update authenticated doctor's profile details
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      specialization,
      qualifications,
      experience,
      hospitalName,
      contactNumber,
      fee,
      bio,
      nextAvailable,
    } = body;

    // 1. Update user name if provided
    if (name && typeof name === "string") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: name.trim() },
      });
    }

    // 2. Update or create DoctorProfile
    const existingProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
    });

    let updatedProfile;
    if (existingProfile) {
      updatedProfile = await prisma.doctorProfile.update({
        where: { userId: session.user.id },
        data: {
          ...(specialization && { specialization: specialization.trim() }),
          ...(qualifications && { qualifications: qualifications.trim() }),
          ...(experience !== undefined && { experience: Number(experience) }),
          ...(hospitalName && { hospitalName: hospitalName.trim() }),
          ...(contactNumber && { contactNumber: contactNumber.trim() }),
          ...(fee !== undefined && { fee: Number(fee) }),
          ...(bio !== undefined && { bio: bio.trim() }),
          ...(nextAvailable && { nextAvailable: nextAvailable.trim() }),
        },
        include: { user: true },
      });
    } else {
      updatedProfile = await prisma.doctorProfile.create({
        data: {
          userId: session.user.id,
          specialization: specialization || "General Medicine",
          qualifications: qualifications || "MBBS, MD",
          experience: Number(experience) || 5,
          hospitalName: hospitalName || "MediBook Partner Clinic",
          contactNumber: contactNumber || "+91 98000 00000",
          fee: Number(fee) || 1500,
          bio: bio || "Experienced specialist doctor providing compassionate clinical consultations.",
          nextAvailable: nextAvailable || "Today",
        },
        include: { user: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Doctor practice profile updated successfully",
      profile: {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        name: updatedProfile.user.name,
        email: updatedProfile.user.email,
        specialization: updatedProfile.specialization,
        qualifications: updatedProfile.qualifications,
        experience: updatedProfile.experience,
        hospitalName: updatedProfile.hospitalName,
        contactNumber: updatedProfile.contactNumber,
        fee: updatedProfile.fee,
        satisfaction: updatedProfile.satisfaction,
        nextAvailable: updatedProfile.nextAvailable,
        bio: updatedProfile.bio,
        roomNumber: "OPD Chamber 304",
      },
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return NextResponse.json(
      { error: "Failed to update doctor profile" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateClinicalTriage, type TriageEvaluationInput } from "@/lib/triageRules";
import { MOCK_DOCTORS } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body: TriageEvaluationInput = await req.json();

    if (!body.symptoms || !Array.isArray(body.symptoms) || body.symptoms.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one primary symptom for triage analysis." },
        { status: 400 }
      );
    }

    // 1. Evaluate clinical triage algorithm
    const triageResult = evaluateClinicalTriage(body);

    // 2. Query matching specialist doctors from Database
    let matchingDoctors: any[] = [];

    try {
      const dbDoctors = await prisma.doctorProfile.findMany({
        where: {
          OR: [
            { specialization: { contains: triageResult.department, mode: "insensitive" } },
            { specialization: { contains: triageResult.departmentKey, mode: "insensitive" } },
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
          reviews: true,
        },
        take: 3,
      });

      if (dbDoctors && dbDoctors.length > 0) {
        matchingDoctors = dbDoctors.map((doc) => {
          const realSatisfaction =
            doc.reviews && doc.reviews.length > 0
              ? Math.round(
                  (doc.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
                    (doc.reviews.length * 5)) *
                    100
                )
              : doc.satisfaction || 98;

          return {
            id: doc.id,
            specialization: doc.specialization,
            experience: doc.experience,
            satisfaction: realSatisfaction,
            fee: doc.fee,
            hospitalName: doc.hospitalName,
            nextAvailable: doc.nextAvailable || "Today, 10:30 AM",
            bio: doc.bio,
            qualifications: doc.qualifications,
            user: {
              name: doc.user.name || "Dr. Specialist",
              image: doc.user.image,
            },
          };
        });
      }
    } catch (dbErr) {
      console.warn("Database doctor query fallback in triage:", dbErr);
    }

    // Fallback to MOCK_DOCTORS if no database doctor matched exact sub-specialty
    if (matchingDoctors.length === 0) {
      const mockMatches = MOCK_DOCTORS.filter(
        (d) =>
          d.specialization.toLowerCase().includes(triageResult.department.toLowerCase()) ||
          d.specialization.toLowerCase().includes(triageResult.departmentKey.toLowerCase())
      );
      matchingDoctors = mockMatches.length > 0 ? mockMatches : MOCK_DOCTORS.slice(0, 2);
    }

    return NextResponse.json({
      success: true,
      triage: triageResult,
      recommendedDoctors: matchingDoctors,
    });
  } catch (error) {
    console.error("Error executing clinical triage:", error);
    return NextResponse.json(
      { error: "Failed to evaluate clinical symptoms." },
      { status: 500 }
    );
  }
}

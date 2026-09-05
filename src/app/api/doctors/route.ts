import { NextResponse } from "next/server";
import { MOCK_DOCTORS } from "@/lib/data";

// Mock Data for Prototyping (No Database Required)

// GET: Fetch list of doctors (Mocked)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const sort = searchParams.get("sort");
    const q = searchParams.get("q");

    let filteredDoctors = [...MOCK_DOCTORS];

    // Apply Specialty Filter
    if (specialty && specialty !== "ALL SPECIALTIES") {
      filteredDoctors = filteredDoctors.filter(
        (doc) => doc.specialization.toLowerCase() === specialty.toLowerCase()
      );
    }
    
    // Apply Text Query Filter (Name or Clinic)
    if (q) {
      const qLower = q.toLowerCase();
      filteredDoctors = filteredDoctors.filter(
        (doc) => doc.user.name.toLowerCase().includes(qLower) || doc.hospitalName.toLowerCase().includes(qLower)
      );
    }

    // Apply Sorting
    if (sort === "HIGHEST RATED") {
      filteredDoctors.sort((a, b) => b.satisfaction - a.satisfaction);
    } else if (sort === "MOST REVIEWED") {
      // Mock sorting for most reviewed (just experience as a proxy for now)
      filteredDoctors.sort((a, b) => b.experience - a.experience);
    }

    // Add a tiny artificial delay to simulate a real network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(filteredDoctors);
  } catch (error) {
    console.error("Error fetching mock doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

// POST: Mock Create Doctor Profile
export async function POST(request: Request) {
  return NextResponse.json({ message: "Mock profile created successfully (DB Disabled)" }, { status: 201 });
}

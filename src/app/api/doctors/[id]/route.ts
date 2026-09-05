import { NextResponse } from "next/server";
import { MOCK_DOCTORS } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const doctor = MOCK_DOCTORS.find((d) => d.id === id);

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}

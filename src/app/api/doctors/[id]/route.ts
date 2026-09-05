import { NextResponse } from "next/server";

const MOCK_DOCTORS = [
  {
    id: "doc_1",
    specialization: "NEURO-ONCOLOGY",
    qualifications: "MD, PhD",
    experience: 14,
    hospitalName: "Aerial Central Medical",
    contactNumber: "+1-555-0101",
    satisfaction: 99,
    nextAvailable: "OCT 12", fee: 2000,
    user: {
      name: "Dr. Elena Rostova",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
    }
  },
  {
    id: "doc_2",
    specialization: "SURGICAL ONCOLOGY",
    qualifications: "MD, FACS",
    experience: 22,
    hospitalName: "Aerial West Hospital",
    contactNumber: "+1-555-0102",
    satisfaction: 98,
    nextAvailable: "OCT 14", fee: 3500,
    user: {
      name: "Dr. Marcus Vance",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
    }
  },
  {
    id: "doc_3",
    specialization: "RADIATION ONCOLOGY",
    qualifications: "MD",
    experience: 9,
    hospitalName: "Aerial East Clinic",
    contactNumber: "+1-555-0103",
    satisfaction: 100,
    nextAvailable: "OCT 15", fee: 1500,
    user: {
      name: "Dr. Sarah Chen",
      image: "https://images.unsplash.com/photo-1594824436998-058b233a0ec2?auto=format&fit=crop&q=80&w=400"
    }
  },
  {
    id: "doc_4",
    specialization: "CARDIOLOGY",
    qualifications: "MD, FACC",
    experience: 18,
    hospitalName: "HeartCare Center",
    contactNumber: "+1-555-0104",
    satisfaction: 97,
    nextAvailable: "OCT 11", fee: 2500,
    user: {
      name: "Dr. James Wilson",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
    }
  },
  {
    id: "doc_5",
    specialization: "DERMATOLOGY",
    qualifications: "MD",
    experience: 7,
    hospitalName: "Skin & Laser Institute",
    contactNumber: "+1-555-0105",
    satisfaction: 99,
    nextAvailable: "OCT 16", fee: 1200,
    user: {
      name: "Dr. Priya Patel",
      image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400"
    }
  },
  {
    id: "doc_6",
    specialization: "PEDIATRICS",
    qualifications: "MD, FAAP",
    experience: 12,
    hospitalName: "Children's Health Clinic",
    contactNumber: "+1-555-0106",
    satisfaction: 96,
    nextAvailable: "OCT 10", fee: 1800,
    user: {
      name: "Dr. Michael Chang",
      image: "https://images.unsplash.com/photo-1537368910025-702800a95136?auto=format&fit=crop&q=80&w=400"
    }
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doctor = MOCK_DOCTORS.find(d => d.id === id);
  
  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }
  
  return NextResponse.json(doctor);
}

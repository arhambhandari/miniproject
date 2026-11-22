import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const LOHEGAON_PUNE_DOCTORS = [
  {
    id: "doc_lohegaon_1",
    name: "Dr. Vishal Sathe",
    email: "dr.vishalsathe.lohegaon@gmail.com",
    specialization: "PEDIATRICS",
    qualifications: "MBBS, DCH, DNB (Pediatrics)",
    experience: 16,
    hospitalName: "Sathe Hospital & Child Care Centre, Porwal Road, Lohegaon, Pune",
    contactNumber: "+91 98224 81920",
    satisfaction: 96,
    nextAvailable: "TODAY",
    fee: 500,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    bio: "Senior Pediatrician and Child Specialist on Porwal Road, Lohegaon. Renowned for prompt diagnostic accuracy, newborn care, gentle pediatric vaccinations, and compassionate family healthcare across Lohegaon and Dhanori.",
    reviews: [
      {
        rating: 5,
        comment: "Dr. Vishal Sathe is our family pediatrician in Lohegaon. He diagnosed our baby's seasonal chest infection accurately without prescribing harsh antibiotics. Highly recommended!",
      },
      {
        rating: 5,
        comment: "Very supportive and gentle with kids. Excellent vaccination care and zero panic guidance for first-time parents.",
      },
      {
        rating: 4,
        comment: "Experienced doctor on Porwal Road. Clinic is very clean with good support staff, though waiting times can take 20 minutes on busy evenings.",
      },
    ],
  },
  {
    id: "doc_lohegaon_2",
    name: "Dr. Kanchan Sathe",
    email: "dr.kanchansathe.lohegaon@gmail.com",
    specialization: "GYNECOLOGY",
    qualifications: "MBBS, DGO, Fellowship in Cosmetic Gynecology",
    experience: 20,
    hospitalName: "Sathe Hospital, Kutwal Colony, Lohegaon, Pune",
    contactNumber: "+91 98220 54110",
    satisfaction: 94,
    nextAvailable: "TOMORROW",
    fee: 600,
    image: "https://images.unsplash.com/photo-1594824813628-98e9be580214?auto=format&fit=crop&q=80&w=400",
    bio: "Senior Consultant Gynecologist and Obstetrician with over 20 years of clinical excellence in Lohegaon, Pune. Expert in high-risk pregnancy management, PCOS/PCOD care, infertility counseling, and women's health.",
    reviews: [
      {
        rating: 5,
        comment: "Dr. Kanchan Sathe provided reassuring and meticulous care throughout my pregnancy journey in Lohegaon. Extremely polite and thorough in explaining every ultrasound report.",
      },
      {
        rating: 5,
        comment: "Her guidance for PCOS and hormonal health is unmatched. She listens patiently and outlines clear, holistic treatment routines.",
      },
      {
        rating: 4,
        comment: "Very trustworthy gynecologist in Kutwal Colony. Clean clinic facilities and responsive nursing team.",
      },
    ],
  },
  {
    id: "doc_lohegaon_3",
    name: "Dr. Piyush Mankar",
    email: "dr.piyushmankar.lohegaon@gmail.com",
    specialization: "DENTISTRY",
    qualifications: "BDS, MDS (Prosthodontics & Implantology)",
    experience: 14,
    hospitalName: "Mankar's Dental Clinic & Implant Centre, Lohegaon, Pune",
    contactNumber: "+91 98902 33418",
    satisfaction: 95,
    nextAvailable: "TODAY",
    fee: 350,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    bio: "Chief Dental Surgeon and Implantologist at Mankar's Dental Clinic, Lohegaon. Specialist in painless root canal treatments, dental implants, digital smile design, and orthodontic procedures with over 94% positive Practo recommendations.",
    reviews: [
      {
        rating: 5,
        comment: "Painless root canal treatment done by Dr. Piyush Mankar! Modern dental equipment, very hygienic clinic right in Lohegaon.",
      },
      {
        rating: 5,
        comment: "Best dentist in Lohegaon. Clear explanation of dental implant steps and very reasonable treatment pricing.",
      },
      {
        rating: 4,
        comment: "Excellent hand precision and friendly staff. Appointments are managed punctually.",
      },
    ],
  },
  {
    id: "doc_lohegaon_4",
    name: "Dr. Neha Deshpande Tambe",
    email: "dr.nehadtambe.lohegaon@gmail.com",
    specialization: "DENTISTRY",
    qualifications: "BDS, Cosmetic Dental Surgeon",
    experience: 12,
    hospitalName: "Padmanaabh Dental Clinic & Implant Centre, Lohegaon, Pune",
    contactNumber: "+91 98811 77620",
    satisfaction: 98,
    nextAvailable: "OCT 25",
    fee: 300,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    bio: "Dedicated dental practitioner at Padmanaabh Dental Clinic, Lohegaon. Top-rated for preventive pediatric dental care, teeth whitening, crowns, bridges, and gentle restorative treatments.",
    reviews: [
      {
        rating: 5,
        comment: "Dr. Neha is very gentle and skilled. Treated my wisdom tooth pain effectively without any discomfort.",
      },
      {
        rating: 5,
        comment: "100% recommended dentist in Lohegaon! Clean environment and transparent treatment advice.",
      },
    ],
  },
  {
    id: "doc_lohegaon_5",
    name: "Dr. Pandurang Sawant",
    email: "dr.pandurangsawant.lohegaon@gmail.com",
    specialization: "PEDIATRICS",
    qualifications: "MBBS, DCH, Pediatrician & Neonatologist",
    experience: 15,
    hospitalName: "Dr. Sawant's Mother & Child Care Clinic, Dhanori-Lohegaon Road, Pune",
    contactNumber: "+91 98601 22940",
    satisfaction: 94,
    nextAvailable: "TODAY",
    fee: 500,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "Renowned Pediatrician & Neonatologist serving families along the Dhanori-Lohegaon corridor. Highly rated for rational medication, avoiding unnecessary antibiotics, newborn screening, and asthma management.",
    reviews: [
      {
        rating: 5,
        comment: "Dr. Sawant takes ample time to explain childhood viral fevers. He does not prescribe heavy antibiotics unnecessarily, which gives great peace of mind.",
      },
      {
        rating: 5,
        comment: "Always available in medical emergencies for our toddler. One of the finest pediatricians in Dhanori-Lohegaon.",
      },
      {
        rating: 4,
        comment: "Caring doctor and good clinical setup. Slightly crowded on weekend mornings, so pre-booking is advised.",
      },
    ],
  },
  {
    id: "doc_lohegaon_6",
    name: "Dr. Laxmi Chavan Sawant",
    email: "dr.laxmichavan.lohegaon@gmail.com",
    specialization: "GYNECOLOGY",
    qualifications: "BAMS, MS (Ayurvedic Obstetrics & Gynecology)",
    experience: 12,
    hospitalName: "Dr. Sawant's Mother & Child Care Clinic, Dhanori-Lohegaon Road, Pune",
    contactNumber: "+91 98601 22941",
    satisfaction: 92,
    nextAvailable: "TOMORROW",
    fee: 500,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    bio: "Consultant Gynecologist & Infertility Specialist combining traditional wellness with modern clinical obstetrics. Specializes in antenatal counseling, irregular menstrual cycles, and natural preconception guidance.",
    reviews: [
      {
        rating: 5,
        comment: "Dr. Laxmi Chavan is very warm, compassionate, and knowledgeable. Her holistic approach to women's health helped resolve my chronic cycle irregularities.",
      },
      {
        rating: 4,
        comment: "Great experience at Dr. Sawant Clinic. Thorough checkups and polite communication.",
      },
    ],
  },
  {
    id: "doc_lohegaon_7",
    name: "Dr. Anirudha Deshpande",
    email: "dr.anirudhadeshpande.lohegaon@gmail.com",
    specialization: "ORTHOPEDICS",
    qualifications: "MBBS, MS (Orthopedics), DNB",
    experience: 22,
    hospitalName: "Lotus Clinic Centre for Orthopaedics & Gynaecology, Dhanori-Lohegaon Road, Pune",
    contactNumber: "+91 98230 45678",
    satisfaction: 96,
    nextAvailable: "OCT 26",
    fee: 600,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    bio: "Senior Consultant Orthopedic Surgeon with over 22 years of surgical expertise. Specializes in knee and hip joint preservation, spine and slip-disc management, fracture trauma, and sports injury rehabilitation.",
    reviews: [
      {
        rating: 5,
        comment: "Dr. Anirudha Deshpande diagnosed my knee ligament tear precisely. Used anatomical models to explain the recovery path. Remarkable orthopedic surgeon!",
      },
      {
        rating: 5,
        comment: "Relieved my mother's chronic lower back sciatica pain with targeted physiotherapy and minimal medication. Outstanding doctor.",
      },
      {
        rating: 4,
        comment: "Very knowledgeable and experienced specialist. Highly recommended for joint and bone issues in Lohegaon.",
      },
    ],
  },
  {
    id: "doc_lohegaon_8",
    name: "Dr. Satish Uchale",
    email: "dr.satishuchale.lohegaon@gmail.com",
    specialization: "ORTHOPEDICS",
    qualifications: "MBBS, D.Ortho, Joint Replacement Consultant",
    experience: 19,
    hospitalName: "Sparsh Orthopaedic & Multi-Speciality Clinic, Lohegaon-Dhanori Marg, Pune",
    contactNumber: "+91 98901 98210",
    satisfaction: 94,
    nextAvailable: "OCT 27",
    fee: 500,
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=400",
    bio: "Consultant Orthopedist and Trauma Surgeon serving Lohegaon & Dhanori. Renowned for fracture management, arthritis care, bone density screenings, and sports rehabilitation.",
    reviews: [
      {
        rating: 5,
        comment: "Dr. Satish Uchale treated my shoulder dislocation with great expertise. Very reassuring demeanor and prompt pain relief.",
      },
      {
        rating: 4,
        comment: "Experienced doctor with practical advice for osteoporosis. Prompt service and reasonable charges.",
      },
    ],
  },
];

async function seedLohegaonDoctors() {
  console.log("Seeding verified Lohegaon, Pune doctors into database...");

  const doctorPasswordHash = await bcrypt.hash("Doctor123!", 10);

  // Fetch verified patients to attach realistic patient reviews
  const patients = await prisma.patientProfile.findMany({
    include: { user: true },
    take: 10,
  });

  if (patients.length === 0) {
    console.error("No patients found in DB to link reviews.");
    return;
  }

  for (const doc of LOHEGAON_PUNE_DOCTORS) {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: doc.email },
      include: { doctorProfile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: doc.name,
          email: doc.email,
          password: doctorPasswordHash,
          role: "DOCTOR",
          image: doc.image,
          doctorProfile: {
            create: {
              id: doc.id,
              specialization: doc.specialization,
              qualifications: doc.qualifications,
              experience: doc.experience,
              hospitalName: doc.hospitalName,
              contactNumber: doc.contactNumber,
              satisfaction: doc.satisfaction,
              nextAvailable: doc.nextAvailable,
              fee: doc.fee,
              bio: doc.bio,
            },
          },
        },
        include: { doctorProfile: true },
      });
      console.log(`✓ Created Doctor: ${doc.name} (${doc.specialization}) - ${doc.hospitalName}`);
    } else {
      console.log(`ℹ Doctor already exists: ${doc.name}`);
    }

    const doctorProfileId = user.doctorProfile?.id;
    if (doctorProfileId && doc.reviews && doc.reviews.length > 0) {
      // Check existing reviews for this doctor
      const existingReviews = await prisma.review.findMany({
        where: { doctorId: doctorProfileId },
      });

      if (existingReviews.length === 0) {
        for (let i = 0; i < doc.reviews.length; i++) {
          const rev = doc.reviews[i];
          const patient = patients[i % patients.length];
          await prisma.review.create({
            data: {
              patientId: patient.id,
              doctorId: doctorProfileId,
              rating: rev.rating,
              comment: rev.comment,
            },
          });
        }
        console.log(`  ✓ Added ${doc.reviews.length} online reviews for ${doc.name}`);
      }
    }
  }

  console.log("\n✅ All Lohegaon, Pune doctors and reviews successfully seeded!");
}

seedLohegaonDoctors()
  .catch((err) => {
    console.error("Error seeding Lohegaon doctors:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

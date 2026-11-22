import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const MOCK_DOCTORS_SEED = [
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
    image: "/images/doctors/dr-vishal-sathe.png",
    bio: "Senior Pediatrician and Child Specialist on Porwal Road, Lohegaon. Renowned for prompt diagnostic accuracy, newborn care, gentle pediatric vaccinations, and compassionate family healthcare across Lohegaon and Dhanori."
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
    image: "/images/doctors/dr-kanchan-sathe.png",
    bio: "Senior Consultant Gynecologist and Obstetrician with over 20 years of clinical excellence in Lohegaon, Pune. Expert in high-risk pregnancy management, PCOS/PCOD care, infertility counseling, and women's health."
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
    image: "/images/doctors/dr-piyush-mankar.jpg",
    bio: "Chief Dental Surgeon and Implantologist at Mankar's Dental Clinic, Lohegaon. Specialist in painless root canal treatments, dental implants, digital smile design, and orthodontic procedures with over 94% positive Practo recommendations."
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
    image: "/images/doctors/dr-neha-deshpande-tambe.png",
    bio: "Dedicated dental practitioner at Padmanaabh Dental Clinic, Lohegaon. Top-rated for preventive pediatric dental care, teeth whitening, crowns, bridges, and gentle restorative treatments."
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
    image: "/images/doctors/dr-pandurang-sawant.png",
    bio: "Renowned Pediatrician & Neonatologist serving families along the Dhanori-Lohegaon corridor. Highly rated for rational medication, avoiding unnecessary antibiotics, newborn screening, and asthma management."
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
    image: "/images/doctors/dr-laxmi-sawant.png",
    bio: "Consultant Gynecologist & Infertility Specialist combining traditional wellness with modern clinical obstetrics. Specializes in antenatal counseling, irregular menstrual cycles, and natural preconception guidance."
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
    image: "/images/doctors/dr-anirudha-deshpande.jpg",
    bio: "Senior Consultant Orthopedic Surgeon with over 22 years of surgical expertise. Specializes in knee and hip joint preservation, spine and slip-disc management, fracture trauma, and sports injury rehabilitation."
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
    image: "/images/doctors/dr-satish-uchale.jpg",
    bio: "Consultant Orthopedist and Trauma Surgeon serving Lohegaon & Dhanori. Renowned for fracture management, arthritis care, bone density screenings, and sports rehabilitation."
  }
];

async function main() {
  console.log("Cleaning existing database records...");
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const doctorPasswordHash = await bcrypt.hash("Doctor123!", 10);
  const patientPasswordHash = await bcrypt.hash("Patient123!", 10);

  console.log("Seeding doctors...");
  const createdDoctors = [];
  for (const doc of MOCK_DOCTORS_SEED) {
    const user = await prisma.user.create({
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
          }
        }
      },
      include: {
        doctorProfile: true
      }
    });
    createdDoctors.push(user);
    console.log(`  ✓ Seeded ${doc.name} (${doc.specialization}) - ₹${doc.fee}`);
  }

  console.log("Seeding verified patient community...");
  const patientUser = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "patient@example.com",
      password: patientPasswordHash,
      role: "PATIENT",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      patientProfile: {
        create: {
          contactNumber: "+91-98765-43210",
          medicalHistory: "No prior chronic illnesses. Routine physical and preventive screenings."
        }
      }
    },
    include: {
      patientProfile: true
    }
  });
  console.log(`  ✓ Seeded demo patient: ${patientUser.name} (${patientUser.email})`);

  const otherPatientsData = [
    {
      name: "Pooja Verma",
      email: "pooja.verma@example.com",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      contactNumber: "+91-98112-23344",
    },
    {
      name: "Siddharth Malhotra",
      email: "siddharth.m@example.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      contactNumber: "+91-98223-34455",
    },
    {
      name: "Kavita Nair",
      email: "kavita.nair@example.com",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      contactNumber: "+91-98334-45566",
    },
    {
      name: "Arjun Saxena",
      email: "arjun.saxena@example.com",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      contactNumber: "+91-98445-56677",
    },
    {
      name: "Sunita Deshmukh",
      email: "sunita.d@example.com",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200",
      contactNumber: "+91-98556-67788",
    },
    {
      name: "Meera Joshi",
      email: "meera.joshi@example.com",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      contactNumber: "+91-98667-78899",
    },
  ];

  const seededPatients = [patientUser];
  for (const pat of otherPatientsData) {
    const user = await prisma.user.create({
      data: {
        name: pat.name,
        email: pat.email,
        password: patientPasswordHash,
        role: "PATIENT",
        image: pat.image,
        patientProfile: {
          create: {
            contactNumber: pat.contactNumber,
            medicalHistory: "Healthy lifestyle, no known drug allergies. Complete immunization history.",
          }
        }
      },
      include: {
        patientProfile: true
      }
    });
    seededPatients.push(user);
    console.log(`  ✓ Seeded patient: ${user.name}`);
  }

  console.log("Seeding sample appointments...");
  await prisma.appointment.create({
    data: {
      patientId: patientUser.patientProfile!.id,
      doctorId: createdDoctors[0].doctorProfile!.id,
      date: "2026-10-12",
      startTime: "10:00 AM",
      endTime: "10:30 AM",
      status: "CONFIRMED",
      disease: "Child seasonal health checkup",
      meetingNotes: "Routine pediatric growth tracking and fever review.",
      payment: {
        create: {
          amount: createdDoctors[0].doctorProfile!.fee,
          currency: "INR",
          status: "SUCCESS",
          razorpayOrderId: "order_demo_101",
          razorpayPaymentId: "pay_demo_101",
          razorpaySignature: "sig_demo_101"
        }
      }
    }
  });

  console.log("Seeding diverse, authentic patient reviews for specialists...");
  const sampleReviews = [
    // Dr. Vishal Sathe (doc_lohegaon_1)
    {
      patient: seededPatients[0],
      doctor: createdDoctors[0],
      rating: 5,
      comment: "Dr. Vishal Sathe is our family pediatrician in Lohegaon. He diagnosed our baby's seasonal chest infection accurately without prescribing harsh antibiotics. Highly recommended!",
    },
    {
      patient: seededPatients[1],
      doctor: createdDoctors[0],
      rating: 5,
      comment: "Very supportive and gentle with kids. Excellent vaccination care and zero panic guidance for first-time parents.",
    },
    {
      patient: seededPatients[2],
      doctor: createdDoctors[0],
      rating: 4,
      comment: "Experienced doctor on Porwal Road. Clinic is very clean with good support staff, though waiting times can take 20 minutes on busy evenings.",
    },

    // Dr. Kanchan Sathe (doc_lohegaon_2)
    {
      patient: seededPatients[3],
      doctor: createdDoctors[1],
      rating: 5,
      comment: "Dr. Kanchan Sathe provided reassuring and meticulous care throughout my pregnancy journey in Lohegaon. Extremely polite and thorough in explaining every ultrasound report.",
    },
    {
      patient: seededPatients[5],
      doctor: createdDoctors[1],
      rating: 5,
      comment: "Her guidance for PCOS and hormonal health is unmatched. She listens patiently and outlines clear, holistic treatment routines.",
    },

    // Dr. Piyush Mankar (doc_lohegaon_3)
    {
      patient: seededPatients[4],
      doctor: createdDoctors[2],
      rating: 5,
      comment: "Painless root canal treatment done by Dr. Piyush Mankar! Modern dental equipment, very hygienic clinic right in Lohegaon.",
    },
    {
      patient: seededPatients[6],
      doctor: createdDoctors[2],
      rating: 5,
      comment: "Best dentist in Lohegaon. Clear explanation of dental implant steps and very reasonable treatment pricing.",
    },

    // Dr. Neha Deshpande Tambe (doc_lohegaon_4)
    {
      patient: seededPatients[1],
      doctor: createdDoctors[3],
      rating: 5,
      comment: "Dr. Neha is very gentle and skilled. Treated my wisdom tooth pain effectively without any discomfort.",
    },
    {
      patient: seededPatients[3],
      doctor: createdDoctors[3],
      rating: 5,
      comment: "100% recommended dentist in Lohegaon! Clean environment and transparent treatment advice.",
    },

    // Dr. Pandurang Sawant (doc_lohegaon_5)
    {
      patient: seededPatients[2],
      doctor: createdDoctors[4],
      rating: 5,
      comment: "Dr. Sawant takes ample time to explain childhood viral fevers. He does not prescribe heavy antibiotics unnecessarily, which gives great peace of mind.",
    },
    {
      patient: seededPatients[5],
      doctor: createdDoctors[4],
      rating: 5,
      comment: "Always available in medical emergencies for our toddler. One of the finest pediatricians in Dhanori-Lohegaon.",
    },

    // Dr. Laxmi Chavan Sawant (doc_lohegaon_6)
    {
      patient: seededPatients[6],
      doctor: createdDoctors[5],
      rating: 5,
      comment: "Dr. Laxmi Chavan is very warm, compassionate, and knowledgeable. Her holistic approach to women's health helped resolve my chronic cycle irregularities.",
    },

    // Dr. Anirudha Deshpande (doc_lohegaon_7)
    {
      patient: seededPatients[0],
      doctor: createdDoctors[6],
      rating: 5,
      comment: "Dr. Anirudha Deshpande diagnosed my knee ligament tear precisely. Used anatomical models to explain the recovery path. Remarkable orthopedic surgeon!",
    },
    {
      patient: seededPatients[4],
      doctor: createdDoctors[6],
      rating: 5,
      comment: "Relieved my mother's chronic lower back sciatica pain with targeted physiotherapy and minimal medication. Outstanding doctor.",
    },

    // Dr. Satish Uchale (doc_lohegaon_8)
    {
      patient: seededPatients[3],
      doctor: createdDoctors[7],
      rating: 5,
      comment: "Dr. Satish Uchale treated my shoulder dislocation with great expertise. Very reassuring demeanor and prompt pain relief.",
    },
  ];

  for (const rev of sampleReviews) {
    await prisma.review.create({
      data: {
        patientId: rev.patient.patientProfile!.id,
        doctorId: rev.doctor.doctorProfile!.id,
        rating: rev.rating,
        comment: rev.comment,
      },
    });
  }
  console.log(`  ✓ Seeded ${sampleReviews.length} unique reviews with diverse patients across all specialists`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log("Demo Credentials:");
  console.log("  Doctor:  dr.vishalsathe.lohegaon@gmail.com / Doctor123!");
  console.log("  Patient: patient@example.com / Patient123!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

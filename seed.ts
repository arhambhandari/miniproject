import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const MOCK_DOCTORS_SEED = [
  {
    id: "doc_1",
    name: "Dr. Aarav Mehta",
    email: "aarav@example.com",
    specialization: "NEURO-ONCOLOGY",
    qualifications: "MBBS, MS, MCh (AIIMS New Delhi)",
    experience: 15,
    hospitalName: "AIIMS Super Specialty Hospital, New Delhi",
    contactNumber: "+91 98201 44521",
    satisfaction: 99,
    nextAvailable: "OCT 12",
    fee: 2000,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    bio: "Chief of Neuro-Oncology & Cranial Surgery at AIIMS with 15+ years specializing in advanced skull-base surgery, stereotactic radiosurgery, and targeted glioblastoma therapies."
  },
  {
    id: "doc_2",
    name: "Dr. Vikramaditya Rathore",
    email: "vikramaditya@example.com",
    specialization: "SURGICAL ONCOLOGY",
    qualifications: "MBBS, MS, DNB, MCh (Tata Memorial)",
    experience: 22,
    hospitalName: "Tata Memorial Centre, Mumbai",
    contactNumber: "+91 98112 55890",
    satisfaction: 98,
    nextAvailable: "OCT 14",
    fee: 2500,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "Senior Surgical Oncologist with over two decades of surgical excellence in robotic cancer resections, HIPEC procedures, and complex gastrointestinal oncological reconstructions."
  },
  {
    id: "doc_3",
    name: "Dr. Ananya Sengupta",
    email: "ananya@example.com",
    specialization: "RADIATION ONCOLOGY",
    qualifications: "MBBS, MD (PGIMER Chandigarh), FRCR",
    experience: 11,
    hospitalName: "Apollo Proton Cancer Centre, Chennai",
    contactNumber: "+91 99805 33412",
    satisfaction: 100,
    nextAvailable: "OCT 15",
    fee: 1800,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    bio: "Pioneering clinical radiation oncologist specializing in precision stereotactic body radiotherapy (SBRT), CyberKnife robotic radiosurgery, and proton beam therapy planning."
  },
  {
    id: "doc_4",
    name: "Dr. Rajesh Iyer",
    email: "rajesh@example.com",
    specialization: "CARDIOLOGY",
    qualifications: "MBBS, MD (Medicine), DM (CMC Vellore), FACC",
    experience: 19,
    hospitalName: "Fortis Escorts Heart Institute, New Delhi",
    contactNumber: "+91 97170 88234",
    satisfaction: 98,
    nextAvailable: "OCT 11",
    fee: 2200,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    bio: "Senior Interventional Cardiologist dedicated to primary angioplasty, transcatheter aortic valve implantation (TAVI/TAVR), preventative cardiology, and heart failure management."
  },
  {
    id: "doc_5",
    name: "Dr. Priya Patel",
    email: "priya@example.com",
    specialization: "DERMATOLOGY",
    qualifications: "MBBS, MD (DVL - KEM Hospital Mumbai), FAM",
    experience: 9,
    hospitalName: "Max Super Specialty Hospital, Saket",
    contactNumber: "+91 98450 77123",
    satisfaction: 99,
    nextAvailable: "OCT 16",
    fee: 1200,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    bio: "Board-certified dermatologist focusing on clinical dermatology, vitiligo surgical therapies, acne scar revision, and advanced fractional laser treatments."
  },
  {
    id: "doc_6",
    name: "Dr. Rohan Banerjee",
    email: "rohan@example.com",
    specialization: "PEDIATRICS",
    qualifications: "MBBS, DCH, MD (Pediatrics - AIIMS), FIAP",
    experience: 14,
    hospitalName: "Medanta – The Medicity, Gurugram",
    contactNumber: "+91 98310 99456",
    satisfaction: 97,
    nextAvailable: "OCT 10",
    fee: 1500,
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=400",
    bio: "Compassionate pediatrician committed to pediatric emergency medicine, newborn intensive care, developmental milestones, and routine immunization."
  },
  // Lohegaon, Pune Doctors
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
    image: "https://images.unsplash.com/photo-1594824813628-98e9be580214?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
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
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=400",
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
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
      contactNumber: "+91-98667-78899",
    },
  ];

  const seededPatients = [patientUser];
  for (const p of otherPatientsData) {
    const user = await prisma.user.create({
      data: {
        name: p.name,
        email: p.email,
        password: patientPasswordHash,
        role: "PATIENT",
        image: p.image,
        patientProfile: {
          create: {
            contactNumber: p.contactNumber,
            medicalHistory: "Verified hospital OPD patient record.",
          },
        },
      },
      include: {
        patientProfile: true,
      },
    });
    seededPatients.push(user);
    console.log(`  ✓ Seeded patient: ${user.name}`);
  }

  console.log("Seeding sample appointments...");
  const appt1 = await prisma.appointment.create({
    data: {
      patientId: patientUser.patientProfile!.id,
      doctorId: createdDoctors[0].doctorProfile!.id,
      date: "2026-10-12",
      startTime: "10:00 AM",
      endTime: "10:30 AM",
      status: "CONFIRMED",
      disease: "Neurological headache checkup",
      meetingNotes: "Initial consultation and cranial nerve examination.",
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

  const appt2 = await prisma.appointment.create({
    data: {
      patientId: patientUser.patientProfile!.id,
      doctorId: createdDoctors[1].doctorProfile!.id,
      date: "2026-09-01",
      startTime: "02:30 PM",
      endTime: "03:00 PM",
      status: "COMPLETED",
      disease: "Preventive oncology scan review",
      payment: {
        create: {
          amount: createdDoctors[1].doctorProfile!.fee,
          currency: "INR",
          status: "SUCCESS",
          razorpayOrderId: "order_demo_102",
          razorpayPaymentId: "pay_demo_102",
        }
      }
    }
  });

  console.log("Seeding diverse, authentic patient reviews for specialists...");
  const sampleReviews = [
    // Dr. Vikramaditya Rathore (doc_2)
    {
      patient: seededPatients[1], // Pooja Verma
      doctor: createdDoctors[1],  // Dr. Vikramaditya Rathore
      rating: 5,
      comment: "Dr. Vikramaditya performed my father's robotic surgical resection at Tata Memorial. His surgical precision, daily bedside visits, and calm reassurance gave our entire family great strength. Truly one of India's finest oncologists.",
    },
    {
      patient: seededPatients[4], // Arjun Saxena
      doctor: createdDoctors[1],  // Dr. Vikramaditya Rathore
      rating: 5,
      comment: "Exceptional clinical expertise. Explained the tumor staging, treatment protocol, and post-op recovery timeline clearly without causing unnecessary anxiety. Very polite and patient.",
    },
    {
      patient: seededPatients[5], // Sunita Deshmukh
      doctor: createdDoctors[1],  // Dr. Vikramaditya Rathore
      rating: 4,
      comment: "Very knowledgeable surgeon. Tata Memorial OPD was crowded as expected, but Dr. Vikramaditya gave thorough attention to all scan reports and pathology slides. Highly satisfied with the second opinion.",
    },
    {
      patient: seededPatients[0], // Rahul Sharma
      doctor: createdDoctors[1],  // Dr. Vikramaditya Rathore
      rating: 5,
      comment: "Outstanding surgical consultation. Dr. Vikramaditya explained every detail of the oncology resection clearly.",
    },

    // Dr. Aarav Mehta (doc_1)
    {
      patient: seededPatients[2], // Siddharth Malhotra
      doctor: createdDoctors[0],  // Dr. Aarav Mehta
      rating: 5,
      comment: "Dr. Aarav Mehta is a brilliant neurosurgeon at AIIMS. Diagnosed my cranial symptoms accurately where others were puzzled. Hospital OPD was very organized.",
    },
    {
      patient: seededPatients[6], // Meera Joshi
      doctor: createdDoctors[0],  // Dr. Aarav Mehta
      rating: 5,
      comment: "Compassionate and deeply skilled. He spent 25 minutes going through my brain MRI scans in detail and advised a non-invasive treatment path that worked wonders.",
    },
    {
      patient: seededPatients[0], // Rahul Sharma
      doctor: createdDoctors[0],  // Dr. Aarav Mehta
      rating: 5,
      comment: "Dr. Aarav was incredibly thorough, patient, and knowledgeable during my neuro checkup. Highly recommended!",
    },

    // Dr. Ananya Sengupta (doc_3)
    {
      patient: seededPatients[3], // Kavita Nair
      doctor: createdDoctors[2],  // Dr. Ananya Sengupta
      rating: 5,
      comment: "Dr. Sengupta is extremely empathetic and detailed. The proton therapy treatment planning was explained step-by-step with minimum side effects. Apollo Chennai staff was top tier.",
    },

    // Dr. Rajesh Iyer (doc_4)
    {
      patient: seededPatients[2], // Siddharth Malhotra
      doctor: createdDoctors[3],  // Dr. Rajesh Iyer
      rating: 5,
      comment: "Dr. Rajesh Iyer at Fortis Escorts detected an early coronary artery block during my treadmill stress test. His swift intervention and medication adjustment averted a major issue. God bless him.",
    },
    {
      patient: seededPatients[1], // Pooja Verma
      doctor: createdDoctors[3],  // Dr. Rajesh Iyer
      rating: 4,
      comment: "Very experienced cardiologist. Prompt diagnosis and excellent explanation of lipid markers and cardiac ultrasound.",
    },

    // Dr. Priya Patel (doc_5)
    {
      patient: seededPatients[6], // Meera Joshi
      doctor: createdDoctors[4],  // Dr. Priya Patel
      rating: 5,
      comment: "Dr. Priya resolved my chronic dermatological flare-up within 3 weeks of treatment. Gentle, knowledgeable, and never pushes unnecessary cosmetic procedures.",
    },

    // Dr. Rohan Banerjee (doc_6)
    {
      patient: seededPatients[4], // Arjun Saxena
      doctor: createdDoctors[5],  // Dr. Rohan Banerjee
      rating: 5,
      comment: "Outstanding pediatrician at Medanta. Examined my 4-year-old son with immense patience and gentleness. Great diagnostic clarity.",
    },

    // Dr. Vishal Sathe (doc_lohegaon_1)
    {
      patient: seededPatients[0],
      doctor: createdDoctors[6],
      rating: 5,
      comment: "Dr. Vishal Sathe is our family pediatrician in Lohegaon. He diagnosed our baby's seasonal chest infection accurately without prescribing harsh antibiotics. Highly recommended!",
    },
    {
      patient: seededPatients[1],
      doctor: createdDoctors[6],
      rating: 5,
      comment: "Very supportive and gentle with kids. Excellent vaccination care and zero panic guidance for first-time parents.",
    },
    {
      patient: seededPatients[2],
      doctor: createdDoctors[6],
      rating: 4,
      comment: "Experienced doctor on Porwal Road. Clinic is very clean with good support staff, though waiting times can take 20 minutes on busy evenings.",
    },

    // Dr. Kanchan Sathe (doc_lohegaon_2)
    {
      patient: seededPatients[3],
      doctor: createdDoctors[7],
      rating: 5,
      comment: "Dr. Kanchan Sathe provided reassuring and meticulous care throughout my pregnancy journey in Lohegaon. Extremely polite and thorough in explaining every ultrasound report.",
    },
    {
      patient: seededPatients[5],
      doctor: createdDoctors[7],
      rating: 5,
      comment: "Her guidance for PCOS and hormonal health is unmatched. She listens patiently and outlines clear, holistic treatment routines.",
    },

    // Dr. Piyush Mankar (doc_lohegaon_3)
    {
      patient: seededPatients[4],
      doctor: createdDoctors[8],
      rating: 5,
      comment: "Painless root canal treatment done by Dr. Piyush Mankar! Modern dental equipment, very hygienic clinic right in Lohegaon.",
    },
    {
      patient: seededPatients[6],
      doctor: createdDoctors[8],
      rating: 5,
      comment: "Best dentist in Lohegaon. Clear explanation of dental implant steps and very reasonable treatment pricing.",
    },

    // Dr. Neha Deshpande Tambe (doc_lohegaon_4)
    {
      patient: seededPatients[1],
      doctor: createdDoctors[9],
      rating: 5,
      comment: "Dr. Neha is very gentle and skilled. Treated my wisdom tooth pain effectively without any discomfort.",
    },
    {
      patient: seededPatients[3],
      doctor: createdDoctors[9],
      rating: 5,
      comment: "100% recommended dentist in Lohegaon! Clean environment and transparent treatment advice.",
    },

    // Dr. Pandurang Sawant (doc_lohegaon_5)
    {
      patient: seededPatients[2],
      doctor: createdDoctors[10],
      rating: 5,
      comment: "Dr. Sawant takes ample time to explain childhood viral fevers. He does not prescribe heavy antibiotics unnecessarily, which gives great peace of mind.",
    },
    {
      patient: seededPatients[5],
      doctor: createdDoctors[10],
      rating: 5,
      comment: "Always available in medical emergencies for our toddler. One of the finest pediatricians in Dhanori-Lohegaon.",
    },

    // Dr. Laxmi Chavan Sawant (doc_lohegaon_6)
    {
      patient: seededPatients[6],
      doctor: createdDoctors[11],
      rating: 5,
      comment: "Dr. Laxmi Chavan is very warm, compassionate, and knowledgeable. Her holistic approach to women's health helped resolve my chronic cycle irregularities.",
    },

    // Dr. Anirudha Deshpande (doc_lohegaon_7)
    {
      patient: seededPatients[0],
      doctor: createdDoctors[12],
      rating: 5,
      comment: "Dr. Anirudha Deshpande diagnosed my knee ligament tear precisely. Used anatomical models to explain the recovery path. Remarkable orthopedic surgeon!",
    },
    {
      patient: seededPatients[4],
      doctor: createdDoctors[12],
      rating: 5,
      comment: "Relieved my mother's chronic lower back sciatica pain with targeted physiotherapy and minimal medication. Outstanding doctor.",
    },

    // Dr. Satish Uchale (doc_lohegaon_8)
    {
      patient: seededPatients[3],
      doctor: createdDoctors[13],
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
  console.log("  Doctor:  aarav@example.com / Doctor123!");
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

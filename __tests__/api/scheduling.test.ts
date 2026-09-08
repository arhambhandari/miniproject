import { prisma } from "@/lib/prisma";

describe("Appointment Scheduling & Anti-Double-Booking Logic", () => {
  const testDoctorUserId = "test_doc_user_" + Date.now();
  const testPatientUserId = "test_pat_user_" + Date.now();
  let testDoctorProfileId: string;
  let testPatientProfileId: string;

  beforeAll(async () => {
    // Create test doctor and patient
    const docUser = await prisma.user.create({
      data: {
        id: testDoctorUserId,
        email: `doc_${Date.now()}@example.com`,
        name: "Dr. Unit Test",
        role: "DOCTOR",
        doctorProfile: {
          create: {
            specialization: "CARDIOLOGY",
            qualifications: "MD",
            experience: 10,
            hospitalName: "Test Heart Center",
            contactNumber: "+1-000-000",
            fee: 2000,
          },
        },
      },
      include: { doctorProfile: true },
    });
    testDoctorProfileId = docUser.doctorProfile!.id;

    const patUser = await prisma.user.create({
      data: {
        id: testPatientUserId,
        email: `pat_${Date.now()}@example.com`,
        name: "Test Patient",
        role: "PATIENT",
        patientProfile: {
          create: {
            contactNumber: "+1-000-111",
          },
        },
      },
      include: { patientProfile: true },
    });
    testPatientProfileId = patUser.patientProfile!.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.appointment.deleteMany({
      where: { doctorId: testDoctorProfileId },
    });
    await prisma.doctorProfile.deleteMany({
      where: { id: testDoctorProfileId },
    });
    await prisma.patientProfile.deleteMany({
      where: { id: testPatientProfileId },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [testDoctorUserId, testPatientUserId] } },
    });
    await prisma.$disconnect();
  });

  it("successfully books an available time slot", async () => {
    const appt = await prisma.appointment.create({
      data: {
        doctorId: testDoctorProfileId,
        patientId: testPatientProfileId,
        date: "2026-11-20",
        startTime: "10:00 AM",
        status: "CONFIRMED",
      },
    });

    expect(appt.id).toBeDefined();
    expect(appt.status).toBe("CONFIRMED");
  });

  it("detects conflict when attempting to book the exact same slot", async () => {
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId: testDoctorProfileId,
        date: "2026-11-20",
        startTime: "10:00 AM",
        status: { notIn: ["CANCELLED"] },
      },
    });

    expect(existing).not.toBeNull();
    expect(existing?.doctorId).toBe(testDoctorProfileId);
  });

  it("allows booking on the same date but a different time slot", async () => {
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: testDoctorProfileId,
        date: "2026-11-20",
        startTime: "11:30 AM",
        status: { notIn: ["CANCELLED"] },
      },
    });

    expect(conflict).toBeNull();

    const appt2 = await prisma.appointment.create({
      data: {
        doctorId: testDoctorProfileId,
        patientId: testPatientProfileId,
        date: "2026-11-20",
        startTime: "11:30 AM",
        status: "SCHEDULED",
      },
    });

    expect(appt2.id).toBeDefined();
  });

  it("allows re-booking if the previous appointment was CANCELLED", async () => {
    await prisma.appointment.updateMany({
      where: {
        doctorId: testDoctorProfileId,
        date: "2026-11-20",
        startTime: "10:00 AM",
      },
      data: { status: "CANCELLED" },
    });

    const activeBooking = await prisma.appointment.findFirst({
      where: {
        doctorId: testDoctorProfileId,
        date: "2026-11-20",
        startTime: "10:00 AM",
        status: { notIn: ["CANCELLED"] },
      },
    });

    expect(activeBooking).toBeNull();
  });
});

import { prisma } from "@/lib/prisma";
import { getOrSetCache, invalidateCache } from "@/lib/cache";
import { MOCK_DOCTORS } from "@/lib/data";
import type { Doctor } from "@/types";

export interface GetDoctorsParams {
  specialty?: string | null;
  sort?: string | null;
  q?: string | null;
}

export async function getDoctorsData(params: GetDoctorsParams = {}): Promise<Doctor[]> {
  const { specialty, sort, q } = params;
  const cacheKey = `doctors:${specialty || "ALL"}:${sort || "DEFAULT"}:${q || ""}`;

  return getOrSetCache(
    cacheKey,
    async () => {
      try {
        const where: any = {};

        if (specialty && specialty !== "ALL SPECIALTIES") {
          where.specialization = {
            equals: specialty.toUpperCase(),
          };
        }

        if (q) {
          where.OR = [
            { hospitalName: { contains: q } },
            { specialization: { contains: q } },
            { user: { name: { contains: q } } },
          ];
        }

        let orderBy: any = { experience: "desc" };
        if (sort === "HIGHEST RATED") {
          orderBy = { satisfaction: "desc" };
        } else if (sort === "MOST REVIEWED") {
          orderBy = { reviews: { _count: "desc" } };
        }

        const doctors = await prisma.doctorProfile.findMany({
          where,
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
            reviews: {
              select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                patient: {
                  select: {
                    user: {
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
          orderBy,
        });

        if (!doctors || doctors.length === 0) {
          return MOCK_DOCTORS;
        }

        return doctors.map((doc) => {
          const realSatisfaction =
            doc.reviews && doc.reviews.length > 0
              ? Math.round(
                  (doc.reviews.reduce((acc, r) => acc + r.rating, 0) /
                    (doc.reviews.length * 5)) *
                    100
                )
              : doc.satisfaction && doc.reviews?.length
              ? doc.satisfaction
              : 0;

          return {
            id: doc.id,
            specialization: doc.specialization,
            qualifications: doc.qualifications,
            experience: doc.experience,
            hospitalName: doc.hospitalName,
            contactNumber: doc.contactNumber,
            satisfaction: realSatisfaction,
            nextAvailable: doc.nextAvailable,
            fee: doc.fee,
            reviews: (doc.reviews || []).map((r) => ({
              id: r.id,
              patientName: r.patient?.user?.name || "Verified Patient",
              rating: r.rating,
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
              comment: r.comment || "",
            })),
            user: {
              name: doc.user.name || "Doctor",
              image: doc.user.image || null,
            },
          };
        });
      } catch (error) {
        console.error("[Doctors] Database query failed, using fallback:", error);
        return MOCK_DOCTORS;
      }
    },
    60 // 60 seconds TTL
  );
}

export async function getDoctorById(id: string) {
  const cacheKey = `doctor:${id}`;

  return getOrSetCache(
    cacheKey,
    async () => {
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
        return null;
      }

      const realSatisfaction =
        doctor.reviews.length > 0
          ? Math.round(
              (doctor.reviews.reduce((acc, r) => acc + r.rating, 0) /
                (doctor.reviews.length * 5)) *
                100
            )
          : 0;

      return {
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
    },
    60 // 60 seconds TTL
  );
}

export function invalidateDoctorsCache(id?: string) {
  invalidateCache("doctors:");
  if (id) {
    invalidateCache(`doctor:${id}`);
  }
}

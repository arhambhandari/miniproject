export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
};

export type Doctor = {
  id: string;
  specialization: string;
  experience: number;
  satisfaction: number;
  fee?: number;
  hospitalName?: string;
  nextAvailable: string;
  bio?: string;
  qualifications?: string;
  reviews?: Review[];
  user: {
    name: string;
    image?: string | null;
  };
};

export type Appointment = {
  id: string;
  patientId?: string;
  patientUserId?: string;
  patientName: string;
  patientEmail?: string;
  doctorId: string;
  doctorUserId?: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  fee: string;
  hospitalName?: string;
  roomNumber?: string;
  tokenNumber?: string;
  condition?: string;
  paymentStatus?: string;
};

export type Review = {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
};

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
  nextAvailable: string;
  user: {
    name: string;
    image: string;
  };
};

export type Appointment = {
  id: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  fee: string;
};

export type Review = {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
};

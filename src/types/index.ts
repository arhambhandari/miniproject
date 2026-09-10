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

export type QueueTokenItem = {
  tokenNumber: string;
  patientName: string;
  time: string;
  status: "SERVING" | "CALLED" | "WAITING" | "COMPLETED" | "SKIPPED";
  patientId?: string;
};

export type QueueState = {
  doctorId?: string;
  doctorName: string;
  hospitalName: string;
  roomNumber: string;
  currentServingToken: string;
  currentPatientName: string;
  status: "ACTIVE" | "EMERGENCY_DELAY" | "PAUSED" | "IDLE";
  delayMinutes: number;
  delayReason?: string;
  tokens: QueueTokenItem[];
  lastUpdated: number;
  announcement?: string;
};

export type QueueActionType = "CALL_NEXT" | "CALL_DIRECT" | "EMERGENCY_DELAY" | "RESOLVE_DELAY" | "RESET";

export type QueueActionPayload = {
  action: QueueActionType;
  doctorId?: string;
  tokenNumber?: string;
  delayMinutes?: number;
  delayReason?: string;
};

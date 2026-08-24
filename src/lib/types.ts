export type Role = "patient" | "doctor" | "admin";
export type AppointmentStatus =
  | "upcoming"
  | "completed"
  | "cancelled"
  | "in-progress";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  credentials: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  color: string;
  initials: string;
  about: string;
  languages: string[];
  nextAvailable: string;
  active: boolean;
  onLeave?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  startAt?: string;
  endAt?: string;
  type: "In-person visit";
  status: AppointmentStatus;
  symptoms: string;
  urgency: "Low" | "Medium" | "High";
  complaint: string;
  questions: string[];
  notes?: string;
  diagnosis?: string;
  summary?: string;
  prescription?: {
    medicine: string;
    dose: string;
    frequency: string;
    duration: string;
  }[];
  calendarSynced: boolean;
  emailSent: boolean;
}

export interface Notice {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  type: "success" | "info" | "warning";
}

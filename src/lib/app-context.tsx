"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appointment, Doctor, Notice, Role } from "./types";
import {
  doctors as seedDoctors,
  initialAppointments,
  initialNotices,
} from "./mock-data";
import { backendRoleToFrontendRole, checkSession, loginRequest, logoutRequest } from "./auth";
import { AppointmentApi, DoctorDirectoryApiResponse, getAdminAppointmentsRequest, getDoctorAppointmentsRequest, getDoctorsRequest, getMyAppointmentsRequest, getPatientProfileRequest, PatientProfile, updatePatientProfileRequest } from "./api";

interface AppState {
  doctors: Doctor[];
  appointments: Appointment[];
  notices: Notice[];
  role: Role | null;
  login: (email: string, password: string, expectedRole: Role) => Promise<void>;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  patientProfile: PatientProfile | null;
  patientProfileLoading: boolean;
  logout: () => Promise<void>;
  savePatientProfile: (payload: Parameters<typeof updatePatientProfileRequest>[0]) => Promise<PatientProfile>;
  addAppointment: (data: Omit<Appointment, "id"> & Partial<Pick<Appointment, "id">>) => string;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  updateDoctor: (id: string, patch: Partial<Doctor>) => void;
  addDoctor: (doctor: Doctor) => void;
  markNoticesRead: () => void;
  resetDemo: () => void;
}
const AppContext = createContext<AppState | null>(null);
const STORAGE = "carely-demo-v1";

function mapAppointment(api: AppointmentApi, doctors: Doctor[]): Appointment {
  const start = new Date(api.startAt);
  const doctor = doctors.find((item) => item.id === api.doctorId);
  const status: Appointment["status"] =
    api.status === "COMPLETED"
      ? "completed"
      : api.status === "CANCELLED" || api.status === "NO_SHOW"
        ? "cancelled"
        : "upcoming";
  const symptoms = api.symptoms || "No symptoms provided";
  const urgency = symptoms.toLowerCase().match(/severe|chest pain|faint|breath/)
    ? "High"
    : symptoms.length > 45
      ? "Medium"
      : "Low";

  return {
    id: api.id,
    doctorId: api.doctorId,
    patientName: api.patientName || "Patient",
    date: api.startAt.slice(0, 10),
    time: start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    startAt: api.startAt,
    endAt: api.endAt,
    type: "In-person visit",
    status,
    symptoms,
    urgency,
    complaint: symptoms.slice(0, 90),
    questions: [],
    calendarSynced: false,
    emailSent: false,
    ...(doctor ? {} : { notes: "Doctor profile is no longer available." }),
  };
}

function mapDoctor(api: DoctorDirectoryApiResponse): Doctor {
  const firstName = api.firstName || "Doctor";
  const lastName = api.lastName || "";
  return {
    id: api.id,
    name: `Dr. ${firstName} ${lastName}`.trim(),
    specialty: api.specialization,
    credentials: "Carely specialist",
    experience: api.yearsOfExperience,
    rating: 0,
    reviews: 0,
    fee: Number(api.consultationFee),
    color: "#DCEFE9",
    initials: `${firstName[0] || "D"}${lastName[0] || ""}`.toUpperCase(),
    about: api.biography || "",
    languages: ["English"],
    nextAvailable: "Schedule pending",
    active: api.active,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState(seedDoctors);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [notices, setNotices] = useState(initialNotices);
  const [role, setRole] = useState<Role | null>(null);
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [patientProfileLoading, setPatientProfileLoading] = useState(true);
  const [ready, setReady] = useState(false);
  // Hydrate the demo session once on the client; this mirrors the future API bootstrap.
  useEffect(() => {
    async function hydrate() {
      try {
        const raw = localStorage.getItem(STORAGE);
        if (raw) {
          const v = JSON.parse(raw);
          setDoctors(v.doctors || seedDoctors);
          setAppointments(
            (v.appointments || initialAppointments).map((a: Appointment) => ({
              ...a,
              type: "In-person visit" as const,
            })),
          );
          setNotices(v.notices || initialNotices);
          const storedRole = v.role || null;
          setRole(storedRole);
          const valid = storedRole ? await checkSession().catch(() => false) : false;
          if (valid && storedRole) {
            setAuthStatus("authenticated");
          } else {
            setRole(null);
            setAuthStatus("unauthenticated");
          }
        } else {
          setAuthStatus("unauthenticated");
        }
      } catch {
        setAuthStatus("unauthenticated");
      } finally {
        setReady(true);
      }
    }
    void hydrate();
  }, []);

  useEffect(() => {
    if (!ready || authStatus !== "authenticated" || !role) {
      return;
    }

    const loadAppointments = role === "patient"
      ? getMyAppointmentsRequest()
      : role === "doctor"
        ? getDoctorAppointmentsRequest()
        : getAdminAppointmentsRequest();

    void loadAppointments
      .then((remoteAppointments) => {
        setAppointments(remoteAppointments.map((appointment) => mapAppointment(appointment, doctors)));
      })
      .catch(() => {
        // Keep the locally cached view if the API is temporarily unavailable.
      });
  }, [authStatus, doctors, ready, role]);
  useEffect(() => {
    if (!ready || authStatus !== "authenticated" || (role !== "patient" && role !== "admin")) return;
    void getDoctorsRequest().then((remoteDoctors) => {
      setDoctors(remoteDoctors.map(mapDoctor));
    }).catch(() => {
      // Keep the locally cached/seeded directory if the API is temporarily unavailable.
    });
  }, [authStatus, ready, role]);
  useEffect(() => {
    if (!ready || authStatus !== "authenticated" || role !== "patient") return;
    void getPatientProfileRequest()
      .then(setPatientProfile)
      .catch(() => setPatientProfile(null))
      .finally(() => setPatientProfileLoading(false));
  }, [authStatus, ready, role]);
  useEffect(() => {
    if (ready)
      localStorage.setItem(
        STORAGE,
        JSON.stringify({ doctors, appointments, notices, role }),
      );
  }, [doctors, appointments, notices, role, ready]);
  const value = useMemo<AppState>(
    () => ({
      doctors,
      appointments,
      notices,
      role,
      authStatus,
      patientProfile,
      patientProfileLoading,
      login: async (email, password, expectedRole) => {
        const response = await loginRequest(email, password);
        const authenticatedRole = backendRoleToFrontendRole(response.role);
        if (!authenticatedRole || authenticatedRole !== expectedRole) {
          await logoutRequest().catch(() => undefined);
          throw new Error("This account does not have access to this portal.");
        }
        setRole(authenticatedRole);
        setAuthStatus("authenticated");
      },
      logout: async () => {
        await logoutRequest().catch(() => undefined);
        setRole(null);
        setAuthStatus("unauthenticated");
        setPatientProfile(null);
      },
      savePatientProfile: async (payload) => {
        const saved = await updatePatientProfileRequest(payload);
        setPatientProfile(saved);
        return saved;
      },
      addAppointment: (data) => {
        const id = data.id || `APT-${Math.floor(3000 + Math.random() * 6000)}`;
        setAppointments((p) => [{ ...data, id }, ...p]);
        setNotices((p) => [
          {
            id: `n${Date.now()}`,
            title: "Appointment confirmed",
            detail: "Your appointment was booked and added to Google Calendar.",
            time: "Just now",
            read: false,
            type: "success",
          },
          ...p,
        ]);
        return id;
      },
      updateAppointment: (id, patch) =>
        setAppointments((p) =>
          p.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        ),
      updateDoctor: (id, patch) =>
        setDoctors((p) => p.map((d) => (d.id === id ? { ...d, ...patch } : d))),
      addDoctor: (doctor) => setDoctors((p) => [doctor, ...p]),
      markNoticesRead: () =>
        setNotices((p) => p.map((n) => ({ ...n, read: true }))),
      resetDemo: () => {
        setDoctors(seedDoctors);
        setAppointments(initialAppointments);
        setNotices(initialNotices);
        setRole(null);
        setAuthStatus("unauthenticated");
        localStorage.removeItem(STORAGE);
      },
    }),
    [doctors, appointments, notices, role, authStatus, patientProfile, patientProfileLoading],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const v = useContext(AppContext);
  if (!v) throw new Error("useApp must be inside provider");
  return v;
}

"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appointment, Doctor, Notice, Role } from "./types";
import {
  doctors as seedDoctors,
  initialAppointments,
  initialNotices,
} from "./mock-data";

interface AppState {
  doctors: Doctor[];
  appointments: Appointment[];
  notices: Notice[];
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
  addAppointment: (data: Omit<Appointment, "id">) => string;
  updateAppointment: (id: string, patch: Partial<Appointment>) => void;
  updateDoctor: (id: string, patch: Partial<Doctor>) => void;
  addDoctor: (doctor: Doctor) => void;
  markNoticesRead: () => void;
  resetDemo: () => void;
}
const AppContext = createContext<AppState | null>(null);
const STORAGE = "carely-demo-v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState(seedDoctors);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [notices, setNotices] = useState(initialNotices);
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);
  // Hydrate the demo session once on the client; this mirrors the future API bootstrap.
  useEffect(() => {
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
        setRole(v.role || null);
      }
    } catch {}
    setReady(true);
  }, []);
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
      login: setRole,
      logout: () => setRole(null),
      addAppointment: (data) => {
        const id = `APT-${Math.floor(3000 + Math.random() * 6000)}`;
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
        localStorage.removeItem(STORAGE);
      },
    }),
    [doctors, appointments, notices, role],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const v = useContext(AppContext);
  if (!v) throw new Error("useApp must be inside provider");
  return v;
}

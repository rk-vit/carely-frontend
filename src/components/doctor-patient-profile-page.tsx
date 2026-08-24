"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { getDoctorPatientProfileRequest, PatientProfile } from "@/lib/api";
import { useApp } from "@/lib/app-context";

export function DoctorPatientProfilePage({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const { appointments } = useApp();
  const appointment = appointments.find((item) => item.id === appointmentId);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void getDoctorPatientProfileRequest(appointmentId).then(setProfile).catch((e) => setError(e instanceof Error ? e.message : "Unable to load patient profile.")); }, [appointmentId]);
  return <main className="min-h-screen bg-canvas p-5 sm:p-8"><div className="mx-auto max-w-3xl"><button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-extrabold text-muted"><ArrowLeft size={16} /> Back</button><section className="card mt-5 p-6 sm:p-8"><div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand"><UserRound size={26} /></span><div><p className="text-xl font-extrabold">{profile ? `${profile.firstName} ${profile.lastName}` : appointment?.patientName || "Patient"}</p><p className="mt-1 text-xs text-muted">Patient profile · {appointment?.id}</p></div></div>{error ? <p className="mt-6 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-700">{error}</p> : !profile ? <p className="mt-6 text-xs text-muted">Loading profile…</p> : <div className="mt-8 grid gap-6 sm:grid-cols-2"><Detail label="Date of birth" value={profile.dateOfBirth || "Not provided"} /><Detail label="Gender" value={profile.gender || "Not provided"} /><Detail label="Phone" value={profile.phoneNumber || "Not provided"} /><Detail label="Emergency contact" value={`${profile.emergencyContactName || "Not provided"} · ${profile.emergencyContactPhone || ""}`} /><Detail label="Address" value={profile.address || "Not provided"} /><Detail label="Allergies" value={profile.allergies || "None reported"} /><div className="sm:col-span-2 rounded-xl bg-canvas p-4"><p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Appointment reason</p><p className="mt-2 text-sm leading-6">{appointment?.symptoms || "Not available"}</p></div></div>}<button onClick={() => router.push(`/doctor/consultation/${appointmentId}`)} className="mt-8 flex items-center gap-2 rounded-xl bg-brand px-4 py-3 text-xs font-extrabold text-white"><CalendarDays size={15} /> Start consultation</button></section></div></main>;
}
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">{label}</p><p className="mt-1 text-sm leading-6">{value}</p></div>; }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, FileHeart, Pill, Save, UserRound } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { getDoctorPatientProfileRequest, PatientProfile, submitDoctorConsultationRequest } from "@/lib/api";

export function DoctorConsultationWorkspace({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const { appointments, updateAppointment } = useApp();
  const appointment = appointments.find((item) => item.id === appointmentId);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [summary, setSummary] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    if (!appointment) return;
    const appointmentId = appointment.id;
    void getDoctorPatientProfileRequest(appointmentId).then(setProfile).catch((e) => setError(e instanceof Error ? e.message : "Unable to load patient profile."));
  }, [appointment]);

  if (!appointment) {
    return <main className="grid min-h-screen place-items-center bg-canvas p-6"><div className="card p-8 text-center"><p className="font-extrabold">Appointment not found</p><button onClick={() => router.push("/doctor/appointments")} className="mt-4 rounded-xl bg-brand px-4 py-3 text-xs font-extrabold text-white">Back to appointments</button></div></main>;
  }
  const activeAppointment = appointment;

  async function submit() {
    if (notes.trim().length < 10) { setError("Add at least 10 characters of clinical notes."); return; }
    setSaving(true); setError("");
    try {
      await submitDoctorConsultationRequest(activeAppointment.id, { clinicalNotes: notes, diagnosis, prescription, summary, followUpDate: followUpDate || undefined });
      updateAppointment(activeAppointment.id, { status: "completed", notes, diagnosis, summary });
      router.push("/doctor/appointments");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to submit consultation."); }
    finally { setSaving(false); }
  }

  return (
    <main className="min-h-screen bg-canvas pb-12">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button onClick={() => router.push("/doctor/appointments")} className="flex items-center gap-2 text-xs font-extrabold text-muted"><ArrowLeft size={16} /> Back to appointments</button>
          <span className="rounded-full bg-brand-soft px-3 py-1.5 text-[10px] font-extrabold text-brand">Consultation workspace</span>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-5 p-5 sm:p-8 lg:grid-cols-[.75fr_1.25fr]">
        <aside className="space-y-5">
          <section className="card p-6">
            <div className="flex items-start gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand"><UserRound size={25} /></span><div><p className="text-lg font-extrabold">{appointment.patientName}</p><p className="mt-1 text-xs text-muted">Patient profile</p></div></div>
            {profile ? <div className="mt-6 space-y-4 text-xs"><Info label="Date of birth" value={profile.dateOfBirth || "Not provided"} /><Info label="Gender" value={profile.gender || "Not provided"} /><Info label="Address" value={profile.address || "Not provided"} /><Info label="Emergency contact" value={`${profile.emergencyContactName || "Not provided"} · ${profile.emergencyContactPhone || ""}`} /><Info label="Allergies" value={profile.allergies || "None reported"} /></div> : <p className="mt-6 text-xs text-muted">{error || "Loading patient profile…"}</p>}
          </section>
          <section className="card p-6"><p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Appointment brief</p><div className="mt-4 flex items-center gap-3 text-xs font-bold"><CalendarDays size={16} className="text-brand" />{new Date(appointment.startAt || `${appointment.date}T${appointment.time}`).toLocaleString()}</div><p className="mt-4 rounded-xl bg-canvas p-4 text-xs leading-6 text-muted">{appointment.symptoms}</p></section>
        </aside>
        <section className="card p-6 sm:p-8">
          <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-brand">Visit record</p><h1 className="mt-2 text-2xl font-extrabold tracking-[-.03em]">Complete consultation</h1><p className="mt-2 text-sm text-muted">Record what happened today. The patient will see the summary after submission.</p></div>
          <label className="mt-7 block text-xs font-extrabold">Clinical notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={7} placeholder="Examination findings, assessment and clinical plan…" className="mt-2 w-full resize-none rounded-xl border border-line p-4 text-sm font-normal leading-6 outline-none focus:border-brand" /></label>
          <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-xs font-extrabold">Diagnosis<input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Primary diagnosis" className="mt-2 w-full rounded-xl border border-line p-3.5 text-sm font-normal" /></label><label className="text-xs font-extrabold">Follow-up date<input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 text-sm font-normal" /></label></div>
          <label className="mt-5 block text-xs font-extrabold"><span className="flex items-center gap-2"><Pill size={15} className="text-brand" />Prescription</span><textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} rows={4} placeholder="Medicine — dose, frequency, duration" className="mt-2 w-full resize-none rounded-xl border border-line p-4 text-sm font-normal leading-6" /></label>
          <label className="mt-5 block text-xs font-extrabold"><span className="flex items-center gap-2"><FileHeart size={15} className="text-brand" />Patient summary</span><textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={5} placeholder="Explain the visit and next steps in patient-friendly language" className="mt-2 w-full resize-none rounded-xl border border-line p-4 text-sm font-normal leading-6" /></label>
          {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
          <button onClick={() => void submit()} disabled={saving} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-xs font-extrabold text-white disabled:opacity-60"><Save size={15} />{saving ? "Submitting visit…" : "Submit consultation"}</button>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">{label}</p><p className="mt-1 leading-5">{value}</p></div>; }

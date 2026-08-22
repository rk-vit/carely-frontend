"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "./brand";
import { apiUrl } from "@/lib/api";

type RegistrationForm = { firstName: string; lastName: string; email: string; phoneNumber: string; password: string };
const initialForm: RegistrationForm = { firstName: "", lastName: "", email: "", phoneNumber: "", password: "" };

export function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  function update(field: keyof RegistrationForm, value: string) { setForm((current) => ({ ...current, [field]: value })); if (error) setError(""); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!agree) { setError("Please accept the Terms of Service and Privacy Policy to continue."); return; }
    setSubmitting(true);
    try {
      const response = await fetch(apiUrl("/users"), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(form) });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("An account with this email already exists.");
        }
        throw new Error(result.message || "We could not create your account.");
      }
      router.push("/patient/login");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "We could not create your account."); }
    finally { setSubmitting(false); }
  }
  return <main className="min-h-screen bg-canvas">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8"><Logo /><Link href="/patient/login" className="flex items-center gap-2 text-sm font-bold text-muted hover:text-brand"><ArrowLeft size={16} /> Already have an account? <span className="text-brand">Sign in</span></Link></header>
    <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-14 lg:pb-20">
      <aside className="relative overflow-hidden rounded-[30px] bg-[#0d4b43] p-7 text-white sm:p-10 lg:min-h-[650px]"><div className="absolute -right-24 -top-24 size-72 rounded-full bg-[#73d8c0]/15 blur-3xl" /><div className="relative flex h-full flex-col"><div className="flex items-center gap-2 text-xs font-bold text-white/65"><Sparkles size={15} className="text-[#73d8c0]" /> Care that keeps you moving</div><div className="mt-auto pt-20"><div className="grid size-14 place-items-center rounded-2xl bg-white/10"><HeartPulse size={28} className="text-[#73d8c0]" /></div><h1 className="mt-7 max-w-sm font-display text-4xl leading-tight tracking-[-.04em] sm:text-5xl">A clearer way to stay on top of your health.</h1><p className="mt-5 max-w-sm text-sm leading-7 text-white/60">Join Carely to find the right doctors, keep your appointments organized, and make every follow-up feel simpler.</p><div className="mt-9 space-y-4">{["Book trusted specialists in minutes", "Keep visits, medicines and notes together", "Get helpful reminders when it matters"].map((item) => <div key={item} className="flex items-center gap-3 text-sm font-bold"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 text-[#73d8c0]"><Check size={14} /></span>{item}</div>)}</div></div></div></aside>
      <section className="rounded-[30px] bg-white p-6 shadow-[0_20px_60px_rgba(15,70,61,.08)] sm:p-10 lg:p-12"><div className="max-w-xl"><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand">Create your patient account</p><h2 className="mt-3 font-display text-4xl tracking-[-.04em] sm:text-5xl">Let’s get acquainted.</h2><p className="mt-3 text-sm leading-6 text-muted">Use your real details so your care team can identify you correctly.</p>
        <form onSubmit={submit} className="mt-9 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-extrabold">First name</span><input required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} autoComplete="given-name" placeholder="Revanth" className="w-full rounded-xl border border-line px-4 py-3.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" /></label><label><span className="mb-2 block text-sm font-extrabold">Last name</span><input required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} autoComplete="family-name" placeholder="Kanna" className="w-full rounded-xl border border-line px-4 py-3.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" /></label></div><label className="block"><span className="mb-2 block text-sm font-extrabold">Email address</span><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-line px-4 py-3.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" /></label><label className="block"><span className="mb-2 block text-sm font-extrabold">Phone number</span><input required type="tel" value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} autoComplete="tel" placeholder="+91 98841 46512" className="w-full rounded-xl border border-line px-4 py-3.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" /></label><label className="block"><span className="mb-2 block text-sm font-extrabold">Password</span><span className="relative block"><input required minLength={8} type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" className="w-full rounded-xl border border-line px-4 py-3.5 pr-12 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-brand">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label><label className="flex gap-3 rounded-xl bg-canvas p-4 text-xs leading-5 text-muted"><input required type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-4 accent-brand" /><span>I agree to Carely’s <a href="#terms" className="font-bold text-brand">Terms of Service</a> and acknowledge the <a href="#privacy" className="font-bold text-brand">Privacy Policy</a>.</span></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}<button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-extrabold text-white shadow-lg shadow-brand/20 hover:bg-brand-dark disabled:opacity-60">{submitting ? "Creating your account…" : "Create my account"}<ArrowRight size={17} /></button></form><p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted"><ShieldCheck size={15} className="text-brand" /> Your details are sent securely.</p></div></section>
    </div>
  </main>;
}

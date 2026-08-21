"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "./brand";
import { useApp } from "@/lib/app-context";
export function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { login } = useApp();
  function next(e: React.FormEvent) {
    e.preventDefault();
    if (step < 2) setStep(2);
    else {
      login("patient");
      router.push("/patient");
    }
  }
  return (
    <main className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <Link
          href="/patient/login"
          className="flex items-center gap-2 text-sm font-bold text-muted"
        >
          <ArrowLeft size={16} />
          Sign in
        </Link>
      </header>
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-10 lg:grid-cols-[.8fr_1.2fr]">
        <div className="hidden rounded-[28px] bg-[#0d4b43] p-10 text-white lg:block">
          <HeartPulse size={34} className="text-[#73d8c0]" />
          <h2 className="mt-8 font-display text-4xl">
            Your healthier days start here.
          </h2>
          <p className="mt-4 leading-7 text-white/60">
            One secure home for appointments, visit summaries, medicines and
            follow-ups.
          </p>
          <div className="mt-12 space-y-5">
            {[
              "Book verified specialists instantly",
              "Get clear, patient-friendly care summaries",
              "Never miss a medication or follow-up",
            ].map((x) => (
              <div className="flex gap-3 text-sm font-bold" key={x}>
                <span className="grid size-6 place-items-center rounded-full bg-white/10 text-[#73d8c0]">
                  <Check size={14} />
                </span>
                {x}
              </div>
            ))}
          </div>
        </div>
        <section className="mx-auto w-full max-w-lg py-8">
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-line"}`}
              />
            ))}
          </div>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[.14em] text-brand">
            Step {step} of 2
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-[-.04em]">
            {step === 1 ? "Let’s get acquainted." : "Keep your account secure."}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {step === 1
              ? "Tell us the basics. You can update these details anytime."
              : "Set a password and agree to our privacy-first terms."}
          </p>
          <form onSubmit={next} className="mt-9 space-y-5">
            {step === 1 ? (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-extrabold">
                    Full name
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full rounded-xl border border-line px-4 py-3.5 outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-extrabold">
                    Email address
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-line px-4 py-3.5 outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-extrabold">
                    Mobile number
                  </span>
                  <input
                    required
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-line px-4 py-3.5 outline-none focus:border-brand"
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-extrabold">
                    Create password
                  </span>
                  <input
                    required
                    type="password"
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-line px-4 py-3.5 outline-none focus:border-brand"
                  />
                </label>
                <label className="flex gap-3 rounded-xl bg-canvas p-4 text-xs leading-5 text-muted">
                  <input
                    required
                    type="checkbox"
                    className="mt-1 accent-brand"
                  />
                  <span>
                    I agree to Carely’s Terms of Service and acknowledge the
                    Privacy Policy.
                  </span>
                </label>
              </>
            )}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-extrabold text-white"
            >
              {step === 1 ? "Continue" : "Create my account"}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheck size={15} className="text-brand" />
            Your health information is encrypted and protected.
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Logo } from "./brand";
import { Role } from "@/lib/types";
import { useApp } from "@/lib/app-context";

const copy = {
  patient: {
    eyebrow: "Your health, in your hands",
    title: "Welcome back",
    subtitle: "Your care team is just a few clicks away.",
    email: "aarav@demo.com",
    icon: UserRound,
    quote:
      "Carely makes it so easy to understand what happens next. I finally feel in control of my care.",
    person: "Aarav Sharma",
    detail: "Carely patient since 2024",
  },
  doctor: {
    eyebrow: "Your practice, beautifully organized",
    title: "Doctor sign in",
    subtitle: "Your patients and schedule are ready for you.",
    email: "maya@carely.com",
    icon: Stethoscope,
    quote:
      "The pre-visit briefs help me arrive prepared and give each patient more meaningful time.",
    person: "Dr. Maya Patel",
    detail: "Cardiologist · Carely partner",
  },
  admin: {
    eyebrow: "One calm view of every operation",
    title: "Admin portal",
    subtitle: "Secure access for authorized clinic teams.",
    email: "admin@carely.com",
    icon: ShieldCheck,
    quote:
      "From staffing to notifications, our team can see what needs attention before it becomes a problem.",
    person: "Anika Rao",
    detail: "Clinic operations lead",
  },
};

export function AuthScreen({ role }: { role: Role }) {
  const router = useRouter();
  const { login } = useApp();
  const c = copy[role];
  const Icon = c.icon;
  const [email, setEmail] = useState(c.email);
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function authenticate() {
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return false;
    }
    login(role);
    return true;
  }
  function submit() {
    if (authenticate()) router.push(`/${role}`);
  }
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[.92fr_1.08fr]">
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-bold text-muted hover:text-brand"
          >
            <ArrowLeft size={15} /> Change portal
          </Link>
        </div>
        <div className="mx-auto my-auto w-full max-w-md py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.12em] text-brand">
            <Icon size={14} />
            {c.eyebrow}
          </span>
          <h1 className="mt-6 font-display text-5xl tracking-[-.045em]">
            {c.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">{c.subtitle}</p>
          <div className="mt-9 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Email address
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Password
              </span>
              <span className="relative block">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                  }}
                  type={show ? "text" : "password"}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3.5 pr-12 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
                <button
                  type="button"
                  aria-label="Show password"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 font-semibold text-muted">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-brand"
                />
                Keep me signed in
              </label>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMessage(`Password reset instructions sent to ${email}`);
                }}
                className="font-extrabold text-brand"
              >
                Forgot password?
              </button>
            </div>
            {message && (
              <p className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
                {message}
              </p>
            )}
            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">
                {error}
              </p>
            )}
            <Link
              href={`/${role}`}
              onClick={(event) => {
                if (!authenticate()) event.preventDefault();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-brand/20 hover:bg-brand-dark"
            >
              Sign in securely
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-6 rounded-xl border border-dashed border-brand/25 bg-brand-soft/50 px-4 py-3 text-xs text-muted">
            <b className="text-ink">Demo access:</b> credentials are pre-filled.
            Simply select “Sign in securely”.
          </div>
          {role === "patient" && (
            <p className="mt-7 text-center text-sm text-muted">
              New to Carely?{" "}
              <Link
                href="/patient/register"
                className="font-extrabold text-brand"
              >
                Create an account
              </Link>
            </p>
          )}
        </div>
        <div className="flex items-center justify-center gap-5 text-[11px] font-semibold text-muted">
          <span className="flex gap-1.5">
            <LockKeyhole size={13} />
            256-bit encrypted
          </span>
          <span>Privacy protected</span>
          <span>Need help?</span>
        </div>
      </section>
      <section className="relative hidden overflow-hidden bg-[#0b4a42] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 grid-pattern opacity-[.12]" />
        <div className="absolute -right-36 -top-36 size-[420px] rounded-full bg-[#40b99c]/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <Sparkles size={15} className="text-[#78d8c0]" />
            Connected care, thoughtfully designed
          </div>
          <div className="mx-auto max-w-xl">
            <div className="mb-9 grid size-14 place-items-center rounded-2xl bg-white/10">
              <HeartHandshake size={28} className="text-[#7ad9c2]" />
            </div>
            <blockquote className="font-display text-4xl leading-[1.25] tracking-[-.03em]">
              “{c.quote}”
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <span className="grid size-11 place-items-center rounded-full bg-[#d8eee8] font-extrabold text-brand-dark">
                {c.person
                  .split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(-2)}
              </span>
              <div>
                <p className="text-sm font-extrabold">{c.person}</p>
                <p className="mt-1 text-xs text-white/55">{c.detail}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["25k+", "patients"],
              ["480+", "doctors"],
              ["4.9/5", "care rating"],
            ].map((x) => (
              <div
                key={x[1]}
                className="rounded-xl border border-white/10 bg-white/[.05] p-4"
              >
                <p className="text-lg font-extrabold">{x[0]}</p>
                <p className="mt-1 text-[11px] text-white/50">{x[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function PortalPicker() {
  return (
    <main className="min-h-screen bg-[#f5f9f7] p-5 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm font-bold text-muted">
            Back home
          </Link>
        </div>
        <div className="mx-auto mt-20 max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand">
            Choose your workspace
          </p>
          <h1 className="mt-4 font-display text-5xl tracking-[-.045em]">
            How are you using Carely today?
          </h1>
          <p className="mt-4 text-muted">
            Each portal is tailored to give you exactly what you need.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {(
            [
              {
                r: "patient",
                i: UserRound,
                t: "I’m a patient",
                d: "Book visits, manage prescriptions and stay on top of your care.",
              },
              {
                r: "doctor",
                i: Stethoscope,
                t: "I’m a doctor",
                d: "Review your day, prepare for visits and create care plans.",
              },
              {
                r: "admin",
                i: UsersRound,
                t: "I’m an admin",
                d: "Manage doctors, schedules and clinic operations.",
              },
            ] as const
          ).map(({ r, i: I, t, d }) => (
            <Link
              href={`/${r}/login`}
              key={r}
              className="card group p-7 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl"
            >
              <span className="grid size-13 place-items-center rounded-2xl bg-brand-soft text-brand group-hover:bg-brand group-hover:text-white">
                <I size={25} />
              </span>
              <h2 className="mt-7 text-xl font-extrabold">{t}</h2>
              <p className="mt-3 min-h-15 text-sm leading-6 text-muted">{d}</p>
              <span className="mt-7 flex items-center gap-2 text-sm font-extrabold text-brand">
                Open portal <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-2 text-xs text-muted">
          <CheckCircle2 size={15} className="text-brand" />
          Secure demo environment · Your changes are saved on this device
        </div>
      </div>
    </main>
  );
}

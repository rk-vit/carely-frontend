import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock3,
  Heart,
  LockKeyhole,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { GmailLogo, GoogleCalendarLogo, Logo } from "@/components/brand";

const specialties = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdfc]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[.05] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#5d6d69] md:flex">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#specialists">Specialists</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-2 py-2 text-sm font-bold sm:px-4">
              Log in
            </Link>
            <Link
              href="/patient/register"
              className="rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 hover:bg-brand-dark"
            >
              <span className="sm:hidden">Sign up</span>
              <span className="hidden sm:inline">Get started</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pt-28 lg:pt-36">
        <div className="absolute -right-48 -top-24 size-[600px] rounded-full bg-[#dff4ed] blur-3xl" />
        <div className="absolute -left-48 top-72 size-96 rounded-full bg-[#f6e8d5] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 lg:grid-cols-[1.03fr_.97fr] lg:px-8 lg:pb-30">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft px-3.5 py-2 text-xs font-extrabold uppercase tracking-[.12em] text-brand-dark">
              <Sparkles size={14} /> Healthcare that feels human
            </div>
            <h1 className="max-w-3xl font-display text-[3.5rem] font-medium leading-[.98] tracking-[-.055em] text-ink sm:text-7xl lg:text-[5rem]">
              Better care begins with a{" "}
              <em className="font-normal text-brand">better connection.</em>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#63736f] sm:text-lg">
              Find trusted doctors, book without the back-and-forth, and keep
              every care plan, prescription and follow-up in one beautifully
              simple place.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/patient/register"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 font-extrabold text-white shadow-xl shadow-brand/20 hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Find a doctor{" "}
                <ArrowRight
                  className="transition group-hover:translate-x-1"
                  size={18}
                />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-6 py-4 font-bold text-ink"
              >
                <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-brand">
                  <Play size={12} fill="currentColor" />
                </span>
                See how it works
              </a>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#64736f]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-brand" />
                Secure & private
              </span>
              <span className="flex items-center gap-2">
                <Clock3 size={17} className="text-brand" />
                Book in 60 seconds
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck size={17} className="text-brand" />
                Verified doctors
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[570px]">
            <div className="absolute -inset-6 rotate-3 rounded-[40px] bg-[#d9eee8]" />
            <div className="relative overflow-hidden rounded-[32px] border-[7px] border-white bg-[#eef6f3] soft-shadow">
              <div className="relative h-[520px] bg-[linear-gradient(145deg,#d5ebe5_0%,#edf6f3_54%,#d1e5df_100%)] sm:h-[600px]">
                <div className="absolute inset-x-0 bottom-0 top-10 flex items-end justify-center">
                  <div className="relative h-[90%] w-[74%] rounded-t-[180px] bg-[#f0c9ae]">
                    <div className="absolute left-1/2 top-[9%] size-42 -translate-x-1/2 rounded-[45%] bg-[#aa694c] sm:size-48" />
                    <div className="absolute bottom-0 left-1/2 h-[64%] w-[145%] -translate-x-1/2 rounded-t-[48%] bg-[#0b7265]" />
                    <div className="absolute left-1/2 top-[24%] h-[27%] w-[65%] -translate-x-1/2 rounded-[45%] bg-[#e7b797]" />
                    <div className="absolute left-[31%] top-[34%] size-2 rounded-full bg-ink" />
                    <div className="absolute right-[31%] top-[34%] size-2 rounded-full bg-ink" />
                    <div className="absolute left-1/2 top-[42%] h-2 w-8 -translate-x-1/2 rounded-b-full border-b-2 border-[#9f5b53]" />
                    <Stethoscope
                      className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-white/80"
                      size={86}
                    />
                  </div>
                </div>
                <div className="animate-float absolute left-4 top-8 rounded-2xl bg-white p-4 shadow-xl sm:-left-7">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#e9f7f3] text-brand">
                      <CalendarCheck size={20} />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                        Next appointment
                      </p>
                      <p className="mt-1 text-sm font-extrabold">
                        Today · 4:30 PM
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="animate-float absolute -right-1 bottom-24 rounded-2xl bg-white p-4 shadow-xl sm:-right-8"
                  style={{ animationDelay: "1.2s" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-[#fff0e7] text-[#db7144]">
                      <Heart size={20} fill="currentColor" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-muted">
                        Patient satisfaction
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <b className="text-base">4.9</b>
                        <Star
                          size={14}
                          fill="#f4b740"
                          className="text-[#f4b740]"
                        />
                        <span className="text-xs text-muted">2k+ reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/60 bg-white/90 p-4 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-brand font-bold text-white">
                      MP
                    </span>
                    <div>
                      <p className="font-extrabold">Dr. Maya Patel</p>
                      <p className="text-xs text-muted">
                        Cardiologist · 12 yrs exp.
                      </p>
                    </div>
                  </div>
                  <BadgeCheck className="text-brand" size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-14 gap-y-6 px-5 text-sm font-bold text-muted lg:justify-between">
          <span className="text-xs uppercase tracking-[.18em]">
            Thoughtfully connected with
          </span>
          <span className="flex items-center gap-2">
            <GoogleCalendarLogo />
            Google Calendar
          </span>
          <span className="flex items-center gap-2">
            <GmailLogo />
            Gmail
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle className="text-[#25D366]" fill="#25D366" />
            WhatsApp
          </span>
          <span className="flex items-center gap-2">
            <LockKeyhole className="text-brand" />
            256-bit encrypted
          </span>
        </div>
      </section>

      <section
        id="how"
        className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand">
            Care made simple
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-.04em] sm:text-5xl">
            From “I don’t feel well” to feeling cared for.
          </h2>
          <p className="mt-5 leading-7 text-muted">
            No confusing systems or endless calls. Just a clear path to the care
            you need.
          </p>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              i: Users,
              t: "Find your specialist",
              d: "Search trusted, verified doctors by specialty, availability and consultation type.",
            },
            {
              n: "02",
              i: CalendarCheck,
              t: "Book your time",
              d: "Choose a convenient slot and tell your doctor what’s going on before the visit.",
            },
            {
              n: "03",
              i: Heart,
              t: "Stay on track",
              d: "Get a plain-language care summary, prescriptions and gentle medication reminders.",
            },
          ].map(({ n, i: I, t, d }) => (
            <div
              key={n}
              className="card group p-7 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-13 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <I size={24} />
                </span>
                <span className="font-display text-4xl text-[#d6e3df]">
                  {n}
                </span>
              </div>
              <h3 className="mt-7 text-xl font-extrabold">{t}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{d}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-extrabold text-brand">
                Learn more <ChevronRight size={15} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-[#0d413a] py-24 text-white lg:py-30">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#86d5c3]">
              A smarter care journey
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight tracking-[-.04em] sm:text-5xl">
              Your doctor sees the story, not just the symptoms.
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-white/65">
              Carely organizes what you share into a concise pre-visit brief,
              helping you spend more of your appointment on the conversation
              that matters.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "AI-assisted symptom brief",
                "Clear post-visit summaries",
                "Smart medication reminders",
                "Calendar & email updates",
              ].map((x) => (
                <div
                  className="flex items-center gap-3 text-sm font-bold"
                  key={x}
                >
                  <span className="grid size-6 place-items-center rounded-full bg-[#65cbb3] text-[#083d35]">
                    <Check size={14} />
                  </span>
                  {x}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[.07] p-5 backdrop-blur">
            <div className="rounded-2xl bg-white p-6 text-ink">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Pre-visit brief
                  </p>
                  <h3 className="mt-1 font-extrabold">
                    Today with Dr. Maya Patel
                  </h3>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">
                  Medium urgency
                </span>
              </div>
              <div className="my-5 h-px bg-line" />
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">
                Chief concern
              </p>
              <p className="mt-2 text-sm font-bold">
                Chest tightness after activity with mild shortness of breath
              </p>
              <p className="mt-6 text-xs font-extrabold uppercase tracking-wider text-muted">
                Helpful questions
              </p>
              <div className="mt-3 space-y-2">
                {[
                  "When did the tightness first begin?",
                  "Does it spread to your arm or jaw?",
                  "Any family history of heart disease?",
                ].map((x, i) => (
                  <div
                    key={x}
                    className="flex gap-3 rounded-xl bg-canvas p-3 text-xs font-semibold"
                  >
                    <span className="text-brand">0{i + 1}</span>
                    {x}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-brand">
                <Sparkles size={15} /> Prepared securely by Carely Assist
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="specialists"
        className="mx-auto max-w-7xl px-5 py-24 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand">
              Find the right care
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-[-.04em] sm:text-5xl">
              Specialists for every chapter.
            </h2>
          </div>
          <Link
            href="/patient/login"
            className="flex items-center gap-2 text-sm font-extrabold text-brand"
          >
            View all specialists <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {specialties.map((s, i) => (
            <Link
              href="/patient/login"
              key={s}
              className="card group p-5 text-center hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
            >
              <span className="mx-auto grid size-13 place-items-center rounded-2xl bg-brand-soft text-brand">
                <Stethoscope size={23} />
              </span>
              <p className="mt-4 text-sm font-extrabold">{s}</p>
              <p className="mt-1 text-xs text-muted">
                {[42, 18, 27, 21, 12, 16][i]} doctors
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#e3f3ee] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="absolute inset-0 grid-pattern opacity-60" />
          <div className="relative">
            <h2 className="font-display text-4xl tracking-[-.04em] sm:text-5xl">
              Good care shouldn’t feel complicated.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Join thousands of patients who manage their health with a little
              more clarity and a lot less stress.
            </p>
            <Link
              href="/patient/register"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-4 font-extrabold text-white shadow-xl shadow-brand/20"
            >
              Start your care journey <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-9 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Logo />
        <p>© 2026 Carely Health. Made for healthier tomorrows.</p>
        <div className="flex gap-5">
          <a>Privacy</a>
          <a>Terms</a>
          <a>Help</a>
        </div>
      </footer>
    </main>
  );
}

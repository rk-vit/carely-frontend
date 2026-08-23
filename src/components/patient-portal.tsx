"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlarmClock,
  ArrowRight,
  BadgeCheck,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileHeart,
  Filter,
  Home,
  ListFilter,
  MapPin,
  Pill,
  Search,
  Settings2,
  Sparkles,
  Star,
  Stethoscope,
  X,
} from "lucide-react";
import { DashboardShell, NavItem } from "./dashboard-shell";
import { useApp } from "@/lib/app-context";
import { Doctor } from "@/lib/types";
import { DoctorAvatar, SectionTitle, StatusBadge } from "./ui";
import { GoogleCalendarLogo, GmailLogo } from "./brand";
import { portalPath } from "@/lib/portal-routes";

const nav: NavItem[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "doctors", label: "Find doctors", icon: Stethoscope },
  {
    id: "appointments",
    label: "My appointments",
    icon: CalendarDays,
    badge: 1,
  },
  { id: "records", label: "Health records", icon: FileHeart },
  { id: "medications", label: "Medications", icon: Pill, badge: 1 },
];
const slots = [
  "09:00 AM",
  "09:45 AM",
  "10:30 AM",
  "11:15 AM",
  "12:00 PM",
  "03:00 PM",
  "04:30 PM",
  "06:00 PM",
];
export function PatientPortal({ section = "overview" }: { section?: string }) {
  const router = useRouter();
  const active = section;
  const navigate = (id: string) => router.push(portalPath("patient", id));
  const [booking, setBooking] = useState<Doctor | null>(null);
  const [toast, setToast] = useState("");
  const { appointments, doctors } = useApp();
  function notify(x: string) {
    setToast(x);
    setTimeout(() => setToast(""), 2600);
  }
  return (
    <DashboardShell
      role="patient"
      nav={nav}
      active={active}
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-sm font-bold text-white shadow-2xl">
          <CheckCircle2 size={19} className="text-[#7ce0c6]" />
          {toast}
        </div>
      )}
      {active === "overview" && (
        <PatientHome
          appointments={appointments}
          doctors={doctors}
          onNav={navigate}
          onBook={setBooking}
        />
      )}{" "}
      {active === "doctors" && (
        <FindDoctors doctors={doctors} onBook={setBooking} />
      )}{" "}
      {active === "appointments" && <AppointmentsView onNotify={notify} />}{" "}
      {active === "records" && <RecordsView onNotify={notify} />}{" "}
      {active === "medications" && <MedicationsView onNotify={notify} />}{" "}
      {active === "settings" && <PatientSettings onNotify={notify} />}{" "}
      {booking && (
        <BookingModal
          doctor={booking}
          onClose={() => setBooking(null)}
          onSuccess={() => {
            setBooking(null);
            navigate("appointments");
            notify("Appointment booked successfully");
          }}
        />
      )}
    </DashboardShell>
  );
}

function PageHead({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.15em] text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-extrabold tracking-[-.035em] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-xs leading-5 text-muted">{copy}</p>
      </div>
      {action}
    </div>
  );
}

function PatientHome({
  appointments,
  doctors,
  onNav,
  onBook,
}: {
  appointments: ReturnType<typeof useApp>["appointments"];
  doctors: Doctor[];
  onNav: (s: string) => void;
  onBook: (d: Doctor) => void;
}) {
  const [morningTaken, setMorningTaken] = useState(false);
  const upcoming = appointments.find(
    (a) => a.patientName === "Aarav Sharma" && a.status === "upcoming",
  );
  const doc = doctors.find((d) => d.id === upcoming?.doctorId) || doctors[0];
  return (
    <div>
      <PageHead
        eyebrow="Thursday, 20 August"
        title="Good morning, Aarav"
        copy="Here’s what’s happening with your care today."
        action={
          <button
            onClick={() => onNav("doctors")}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-xs font-extrabold text-white"
          >
            <Calendar size={16} />
            Book appointment
          </button>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
        <section className="relative overflow-hidden rounded-[24px] bg-[#0d4c43] p-6 text-white sm:p-8">
          <div className="absolute -right-10 -top-20 size-72 rounded-full bg-[#4dbaa0]/20 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#87dcc8]">
              <span className="size-2 rounded-full bg-[#6ce0c1]" />
              Next appointment
            </div>
            <div className="mt-6 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
              <div className="flex items-center gap-4">
                <DoctorAvatar doctor={doc} size="lg" />
                <div>
                  <p className="text-xl font-extrabold">{doc.name}</p>
                  <p className="mt-1 text-xs text-white/55">
                    {doc.specialty} · {doc.credentials}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#72d5bd]" />
                      Tomorrow, 21 Aug
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} className="text-[#72d5bd]" />
                      {upcoming?.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onNav("appointments")}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold"
                >
                  View details
                </button>
                <button
                  onClick={() => onNav("appointments")}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-brand-dark"
                >
                  <MapPin size={15} />
                  Manage visit
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold">Daily care</p>
              <p className="mt-1 text-[10px] text-muted">Thursday, 20 August</p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-[#fff2e8] text-[#d27645]">
              <Pill size={19} />
            </span>
          </div>
          <div className="mt-5 rounded-xl bg-canvas p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-extrabold">Paracetamol 500mg</p>
                <p className="mt-1 text-[10px] text-muted">
                  1 tablet · After breakfast
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-amber-700">
                8:30 AM
              </span>
            </div>
            <button
              disabled={morningTaken}
              onClick={() => setMorningTaken(true)}
              className="mt-4 w-full rounded-lg border border-brand/20 bg-white py-2 text-[10px] font-extrabold text-brand disabled:bg-emerald-50 disabled:text-emerald-700"
            >
              {morningTaken ? "Taken ✓" : "Mark as taken"}
            </button>
          </div>
          <button
            onClick={() => onNav("medications")}
            className="mt-4 flex w-full items-center justify-between text-[11px] font-bold text-muted"
          >
            See today’s schedule <ChevronRight size={15} />
          </button>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <section className="card p-5 sm:p-6">
          <SectionTitle
            title="Your health, at a glance"
            subtitle="A quick look at your ongoing care"
          />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [CalendarDays, "1", "Upcoming", "bg-blue-50 text-blue-600"],
              [FileHeart, "3", "Care records", "bg-violet-50 text-violet-600"],
              [Pill, "1", "Active medicine", "bg-orange-50 text-orange-600"],
              [
                Activity,
                "Good",
                "Care status",
                "bg-emerald-50 text-emerald-600",
              ],
            ].map(([I, v, l, c]) => {
              const Icon = I as typeof CalendarDays;
              return (
                <div
                  key={String(l)}
                  className="rounded-xl border border-line p-4"
                >
                  <span
                    className={`grid size-8 place-items-center rounded-lg ${c}`}
                  >
                    <Icon size={16} />
                  </span>
                  <p className="mt-4 text-xl font-extrabold">{String(v)}</p>
                  <p className="mt-1 text-[10px] font-bold text-muted">
                    {String(l)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
        <section className="card p-5 sm:p-6">
          <SectionTitle
            title="Carely Assist"
            subtitle="Your visit, made clearer"
          />
          <div className="mt-5 flex gap-3 rounded-xl bg-brand-soft p-4">
            <Sparkles size={19} className="mt-0.5 shrink-0 text-brand" />
            <div>
              <p className="text-xs font-extrabold">Prepare for tomorrow</p>
              <p className="mt-1 text-[10px] leading-5 text-muted">
                Your symptom brief is ready for Dr. Maya Patel.
              </p>
              <button
                onClick={() => onNav("appointments")}
                className="mt-3 text-[10px] font-extrabold text-brand"
              >
                Review your brief →
              </button>
            </div>
          </div>
        </section>
      </div>
      <section className="mt-5 card p-5 sm:p-6">
        <SectionTitle
          title="Doctors you may like"
          subtitle="Highly rated specialists available soon"
          action={
            <button
              onClick={() => onNav("doctors")}
              className="text-xs font-extrabold text-brand"
            >
              View all doctors
            </button>
          }
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {doctors.slice(1, 4).map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-xl border border-line p-4"
            >
              <DoctorAvatar doctor={d} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold">{d.name}</p>
                <p className="mt-1 text-[10px] text-muted">{d.specialty}</p>
                <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold">
                  <Star size={11} fill="#f3b53f" className="text-[#f3b53f]" />
                  {d.rating}
                  <span className="text-muted">· {d.nextAvailable}</span>
                </p>
              </div>
              <button
                onClick={() => onBook(d)}
                className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand"
              >
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FindDoctors({
  doctors,
  onBook,
}: {
  doctors: Doctor[];
  onBook: (d: Doctor) => void;
}) {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"recommended" | "fee">("recommended");
  const filtered = doctors
    .filter(
      (d) =>
        (specialty === "All specialties" || d.specialty === specialty) &&
        (!availableOnly || !d.onLeave) &&
        (d.name + d.specialty).toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => (sortBy === "fee" ? a.fee - b.fee : b.rating - a.rating));
  return (
    <div>
      <PageHead
        eyebrow="Care network"
        title="Find the right doctor"
        copy="Browse verified specialists and book a time that works for you."
      />
      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <label className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by doctor or specialty"
              className="w-full rounded-xl bg-canvas py-3 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded-xl border border-line bg-white px-4 py-3 text-xs font-bold outline-none"
          >
            <option>All specialties</option>
            {[...new Set(doctors.map((d) => d.specialty))].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${availableOnly ? "border-brand bg-brand-soft text-brand" : "border-line"}`}
          >
            <Filter size={15} />
            Available only
          </button>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs font-bold">
          <b>{filtered.length}</b> doctors available
        </p>
        <button
          onClick={() =>
            setSortBy(sortBy === "recommended" ? "fee" : "recommended")
          }
          className="flex items-center gap-2 text-xs font-bold text-muted"
        >
          <ListFilter size={14} />
          {sortBy === "recommended" ? "Recommended first" : "Lowest fee first"}
        </button>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {filtered.map((d) => (
          <article
            key={d.id}
            className="card p-5 hover:border-brand/25 hover:shadow-lg"
          >
            <div className="flex gap-4">
              <DoctorAvatar doctor={d} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold">
                      {d.name}
                      <BadgeCheck
                        size={14}
                        className="ml-1 inline text-brand"
                      />
                    </h3>
                    <p className="mt-1 text-xs font-bold text-brand">
                      {d.specialty}
                    </p>
                    <p className="mt-1 text-[10px] text-muted">
                      {d.credentials} · {d.experience} years experience
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold">
                  <span className="flex gap-1">
                    <Star size={12} fill="#f3b53f" className="text-[#f3b53f]" />
                    {d.rating}{" "}
                    <i className="font-normal text-muted">({d.reviews})</i>
                  </span>
                  <span className="flex gap-1 text-muted">
                    <MapPin size={12} />
                    Carely Medical Centre
                  </span>
                  <span className="flex gap-1 text-muted">
                    <Stethoscope size={12} />
                    In-person care
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-5 line-clamp-2 text-xs leading-5 text-muted">
              {d.about}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
              <div>
                <p className="text-[10px] text-muted">Next available</p>
                <p
                  className={`mt-1 text-xs font-extrabold ${d.onLeave ? "text-amber-700" : "text-brand"}`}
                >
                  {d.onLeave ? "On leave this week" : d.nextAvailable}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted">Consultation</p>
                <p className="mt-1 text-xs font-extrabold">₹{d.fee}</p>
              </div>
              <button
                disabled={d.onLeave}
                onClick={() => onBook(d)}
                className="w-full rounded-xl bg-brand px-4 py-2.5 text-xs font-extrabold text-white disabled:bg-slate-200 disabled:text-slate-500 sm:w-auto"
              >
                Book now
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AppointmentsView({ onNotify }: { onNotify: (s: string) => void }) {
  const { appointments, doctors, updateAppointment } = useApp();
  const [tab, setTab] = useState("Upcoming");
  const [expanded, setExpanded] = useState<string | null>(null);
  const mine = appointments.filter(
    (a) =>
      a.patientName === "Aarav Sharma" &&
      (tab === "All" ||
        (tab === "Upcoming" && a.status === "upcoming") ||
        (tab === "Past" && a.status === "completed") ||
        (tab === "Cancelled" && a.status === "cancelled")),
  );
  return (
    <div>
      <PageHead
        title="My appointments"
        copy="Manage upcoming visits and revisit your care history."
      />
      <div className="flex gap-2 overflow-auto border-b border-line">
        {["Upcoming", "Past", "Cancelled", "All"].map((x) => (
          <button
            onClick={() => setTab(x)}
            key={x}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-extrabold ${tab === x ? "border-brand text-brand" : "border-transparent text-muted"}`}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {mine.length === 0 ? (
          <div className="card py-20 text-center">
            <CalendarDays className="mx-auto text-muted" />
            <p className="mt-4 text-sm font-extrabold">No appointments here</p>
            <p className="mt-2 text-xs text-muted">
              Your {tab.toLowerCase()} appointments will appear here.
            </p>
          </div>
        ) : (
          mine.map((a) => {
            const d = doctors.find((x) => x.id === a.doctorId)!;
            return (
              <div key={a.id} className="card p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div className="flex gap-4">
                    <DoctorAvatar doctor={d} size="lg" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-extrabold">{d.name}</p>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="mt-1 text-xs text-brand">{d.specialty}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-muted">
                        <span className="flex gap-2">
                          <Calendar size={14} />
                          {new Date(`${a.date}T12:00:00`).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </span>
                        <span className="flex gap-2">
                          <Clock3 size={14} />
                          {a.time}
                        </span>
                        <span className="flex gap-2">
                          <MapPin size={14} />
                          {a.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:self-center">
                    {a.status === "upcoming" && (
                      <>
                        <button
                          onClick={() => {
                            updateAppointment(a.id, {
                              date: "2026-08-22",
                              time: "03:00 PM",
                              calendarSynced: true,
                            });
                            onNotify(
                              "Visit moved to 22 August at 3:00 PM; calendar updated",
                            );
                          }}
                          className="rounded-xl border border-line px-4 py-2.5 text-xs font-bold"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => {
                            updateAppointment(a.id, {
                              status: "cancelled",
                              calendarSynced: false,
                            });
                            onNotify(
                              "Appointment cancelled and calendar event removed",
                            );
                          }}
                          className="rounded-xl border border-red-100 px-4 py-2.5 text-xs font-bold text-red-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            setExpanded(expanded === a.id ? null : a.id)
                          }
                          className="rounded-xl bg-brand px-4 py-2.5 text-xs font-extrabold text-white"
                        >
                          {expanded === a.id ? "Hide details" : "View details"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {a.status === "upcoming" && (
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-[10px] font-bold text-muted">
                    <span className="flex items-center gap-1.5">
                      <GoogleCalendarLogo size={16} />
                      Added to Google Calendar
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GmailLogo size={16} />
                      Confirmation sent
                    </span>
                    <span className="ml-auto">Booking ID: {a.id}</span>
                  </div>
                )}
                {expanded === a.id && (
                  <div className="mt-5 grid gap-4 rounded-xl bg-canvas p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                        Reason for visit
                      </p>
                      <p className="mt-2 text-xs leading-6">{a.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                        Clinic location
                      </p>
                      <p className="mt-2 text-xs font-bold">
                        Carely Medical Centre, Main Wing
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Please arrive 10 minutes early.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function RecordsView({ onNotify }: { onNotify: (s: string) => void }) {
  const { appointments, doctors } = useApp();
  const [openRecord, setOpenRecord] = useState<string | null>(null);
  const visits = appointments.filter(
    (a) => a.patientName === "Aarav Sharma" && a.status === "completed",
  );
  return (
    <div>
      <PageHead
        title="Health records"
        copy="Your visit notes, care summaries and prescriptions—organized securely."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_290px]">
        <div className="space-y-4">
          {visits.map((a) => {
            const d = doctors.find((x) => x.id === a.doctorId)!;
            return (
              <article key={a.id} className="card overflow-hidden">
                <div className="flex items-center gap-4 border-b border-line p-5">
                  <DoctorAvatar doctor={d} />
                  <div className="flex-1">
                    <p className="text-sm font-extrabold">{d.name}</p>
                    <p className="mt-1 text-[10px] text-muted">
                      15 August 2026 · {d.specialty}
                    </p>
                  </div>
                  <StatusBadge status="completed" />
                </div>
                <div className="p-5">
                  <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.12em] text-brand">
                    <Sparkles size={14} />
                    Your care summary
                  </span>
                  <p className="mt-3 text-xs leading-6 text-[#50615d]">
                    {a.summary}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-canvas p-4">
                      <p className="text-[10px] font-extrabold text-muted">
                        DIAGNOSIS
                      </p>
                      <p className="mt-2 text-xs font-bold">{a.diagnosis}</p>
                    </div>
                    <div className="rounded-xl bg-canvas p-4">
                      <p className="text-[10px] font-extrabold text-muted">
                        PRESCRIPTION
                      </p>
                      <p className="mt-2 text-xs font-bold">
                        {a.prescription?.[0].medicine}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() =>
                        setOpenRecord(openRecord === a.id ? null : a.id)
                      }
                      className="rounded-xl bg-brand px-4 py-2.5 text-xs font-extrabold text-white"
                    >
                      {openRecord === a.id
                        ? "Close record"
                        : "Open full record"}
                    </button>
                    <button
                      onClick={() => {
                        const content = `CARELY VISIT RECORD\n\nDoctor: ${d.name}\nDate: 15 August 2026\nDiagnosis: ${a.diagnosis}\n\nCare summary:\n${a.summary}\n\nPrescription:\n${a.prescription?.map((p) => `${p.medicine} — ${p.frequency}, ${p.duration}`).join("\n")}`;
                        const url = URL.createObjectURL(
                          new Blob([content], { type: "text/plain" }),
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `${a.id}-care-record.txt`;
                        link.click();
                        URL.revokeObjectURL(url);
                        onNotify("Care record downloaded");
                      }}
                      className="rounded-xl border border-line px-4 py-2.5 text-xs font-bold"
                    >
                      Download record
                    </button>
                  </div>
                  {openRecord === a.id && (
                    <div className="mt-5 rounded-xl border border-line bg-canvas p-4">
                      <p className="text-xs font-extrabold">
                        Medication schedule
                      </p>
                      {a.prescription?.map((p) => (
                        <div
                          key={p.medicine}
                          className="mt-3 grid gap-2 text-xs sm:grid-cols-4"
                        >
                          <b>{p.medicine}</b>
                          <span>{p.dose}</span>
                          <span>{p.frequency}</span>
                          <span>{p.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <FileHeart className="text-brand" />
            <h3 className="mt-4 text-sm font-extrabold">Your health vault</h3>
            <p className="mt-2 text-xs leading-5 text-muted">
              Records are encrypted and only visible to you and your authorized
              care team.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-700">
              <BadgeCheck size={14} />
              Privacy protected
            </div>
          </div>
          <label className="card flex w-full cursor-pointer items-center gap-3 p-4 text-left">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.[0])
                  onNotify(`${e.target.files[0].name} added to your vault`);
              }}
            />
            <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <FileHeart size={17} />
            </span>
            <span className="flex-1 text-xs font-extrabold">
              Upload a document
            </span>
            <ChevronRight size={15} />
          </label>
        </aside>
      </div>
    </div>
  );
}

function MedicationsView({ onNotify }: { onNotify: (s: string) => void }) {
  const [taken, setTaken] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div>
      <PageHead
        title="Medications"
        copy="Simple reminders to help you stay consistent with your care plan."
        action={
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-xl border border-line px-4 py-3 text-xs font-bold"
          >
            <Settings2 size={15} className="mr-2 inline" />
            Reminder settings
          </button>
        }
      />
      {showSettings && (
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-brand/20 bg-brand-soft p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-sm font-extrabold">Reminder preferences</p>
            <p className="mt-1 text-xs text-muted">
              Choose how Carely should remind you about each dose.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold">
            <input type="checkbox" defaultChecked className="accent-brand" />{" "}
            Push
          </label>
          <label className="flex items-center gap-2 text-xs font-bold">
            <input type="checkbox" defaultChecked className="accent-brand" />{" "}
            Email
          </label>
          <button
            onClick={() => {
              setShowSettings(false);
              onNotify("Medication reminder preferences saved");
            }}
            className="rounded-xl bg-brand px-4 py-2.5 text-xs font-extrabold text-white"
          >
            Save
          </button>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <section>
          <div className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Today’s schedule</h2>
                <p className="mt-1 text-xs text-muted">Thursday, 20 August</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-brand">
                  {taken ? "100" : "50"}%
                </p>
                <p className="text-[10px] text-muted">completed</p>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: taken ? "100%" : "50%" }}
              />
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-4 opacity-60 sm:flex-nowrap sm:gap-4">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Check size={19} />
                </span>
                <div className="flex-1">
                  <p className="text-xs font-extrabold line-through">
                    Paracetamol 500mg
                  </p>
                  <p className="mt-1 text-[10px] text-muted">
                    1 tablet · After breakfast
                  </p>
                </div>
                <b className="text-[10px] text-muted">8:30 AM</b>
              </div>
              <div
                className={`flex flex-wrap items-center gap-3 rounded-xl border p-4 sm:flex-nowrap sm:gap-4 ${taken ? "border-line opacity-60" : "border-brand/20 bg-brand-soft/30"}`}
              >
                <span
                  className={`grid size-10 place-items-center rounded-xl ${taken ? "bg-emerald-50 text-emerald-600" : "bg-white text-brand"}`}
                >
                  {taken ? <Check size={19} /> : <Pill size={19} />}
                </span>
                <div className="flex-1">
                  <p
                    className={`text-xs font-extrabold ${taken ? "line-through" : ""}`}
                  >
                    Paracetamol 500mg
                  </p>
                  <p className="mt-1 text-[10px] text-muted">
                    1 tablet · After dinner
                  </p>
                </div>
                <b className="text-[10px] text-amber-700">8:30 PM</b>
                {!taken && (
                  <button
                    onClick={() => {
                      setTaken(true);
                      onNotify("Evening dose marked as taken");
                    }}
                    className="rounded-lg bg-brand px-3 py-2 text-[10px] font-extrabold text-white"
                  >
                    Mark taken
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 card p-5">
            <p className="text-xs font-extrabold">Active prescription</p>
            <div className="mt-4 flex items-center gap-4 rounded-xl bg-canvas p-4">
              <span className="grid size-11 place-items-center rounded-xl bg-orange-50 text-orange-600">
                <Pill size={21} />
              </span>
              <div className="flex-1">
                <p className="text-xs font-extrabold">Paracetamol 500mg</p>
                <p className="mt-1 text-[10px] text-muted">
                  Twice daily · 3 days · 1 day remaining
                </p>
              </div>
              <button
                onClick={() =>
                  onNotify("Take 1 tablet twice daily after food for 3 days")
                }
                className="text-xs font-extrabold text-brand"
              >
                Details
              </button>
            </div>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="card p-5">
            <AlarmClock className="text-brand" />
            <h3 className="mt-4 text-sm font-extrabold">Gentle reminders</h3>
            <p className="mt-2 text-xs leading-5 text-muted">
              We’ll remind you at the right time by push notification and email.
            </p>
            <div className="mt-4 space-y-3 text-[10px] font-bold">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand" />
                Push notifications on
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-brand" />
                Email reminders on
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-[#fff4e9] p-5">
            <CircleAlert size={19} className="text-[#c76f38]" />
            <p className="mt-3 text-xs font-extrabold">A note on medicines</p>
            <p className="mt-2 text-[10px] leading-5 text-muted">
              Never change your dose without speaking with your doctor.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PatientSettings({ onNotify }: { onNotify: (s: string) => void }) {
  const [calendar, setCalendar] = useState(true);
  const [email, setEmail] = useState(true);
  const [tab, setTab] = useState("Connected apps");
  return (
    <div>
      <PageHead
        title="Settings"
        copy="Manage your profile, integrations and notification preferences."
      />
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <div className="card h-fit p-3">
          {[
            "Personal details",
            "Notifications",
            "Connected apps",
            "Privacy & security",
          ].map((x) => (
            <button
              key={x}
              onClick={() => setTab(x)}
              className={`w-full rounded-lg px-3 py-3 text-left text-xs font-bold ${tab === x ? "bg-brand-soft text-brand" : "text-muted"}`}
            >
              {x}
            </button>
          ))}
        </div>
        <section className="card p-5 sm:p-7">
          <h2 className="text-lg font-extrabold">{tab}</h2>
          {tab === "Connected apps" && (
            <>
              <p className="mt-1 text-xs text-muted">
                Keep your appointments and messages in sync.
              </p>
              <div className="mt-6 divide-y divide-line rounded-xl border border-line">
                <Integration
                  icon={<GoogleCalendarLogo size={28} />}
                  title="Google Calendar"
                  detail="Appointments are added, updated and removed automatically."
                  enabled={calendar}
                  onChange={() => {
                    setCalendar(!calendar);
                    onNotify(
                      calendar
                        ? "Google Calendar disconnected"
                        : "Google Calendar connected",
                    );
                  }}
                />
                <Integration
                  icon={<GmailLogo size={28} />}
                  title="Gmail"
                  detail="Booking confirmations and care reminders."
                  enabled={email}
                  onChange={() => {
                    setEmail(!email);
                    onNotify(
                      email
                        ? "Email notifications paused"
                        : "Email notifications enabled",
                    );
                  }}
                />
              </div>
            </>
          )}
          {tab === "Personal details" && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-extrabold">
                Full name
                <input
                  defaultValue="Aarav Sharma"
                  className="mt-2 w-full rounded-xl border border-line p-3 font-normal"
                />
              </label>
              <label className="text-xs font-extrabold">
                Mobile number
                <input
                  defaultValue="+91 98765 43210"
                  className="mt-2 w-full rounded-xl border border-line p-3 font-normal"
                />
              </label>
              <label className="text-xs font-extrabold sm:col-span-2">
                Email address
                <input
                  defaultValue="aarav@demo.com"
                  className="mt-2 w-full rounded-xl border border-line p-3 font-normal"
                />
              </label>
            </div>
          )}
          {tab === "Notifications" && (
            <div className="mt-5 divide-y divide-line">
              {[
                "Appointment confirmations",
                "24-hour visit reminders",
                "Medication reminders",
                "Care summary ready",
              ].map((x, i) => (
                <label
                  key={x}
                  className="flex items-center justify-between py-4 text-xs font-bold"
                >
                  <span>{x}</span>
                  <input
                    type="checkbox"
                    defaultChecked={i !== 3}
                    className="size-4 accent-brand"
                  />
                </label>
              ))}
            </div>
          )}
          {tab === "Privacy & security" && (
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-line p-4">
                <p className="text-xs font-extrabold">Password</p>
                <p className="mt-1 text-xs text-muted">
                  Last changed 42 days ago
                </p>
                <button
                  onClick={() =>
                    onNotify("Password reset link sent to your email")
                  }
                  className="mt-3 text-xs font-extrabold text-brand"
                >
                  Send reset link
                </button>
              </div>
              <label className="flex items-center justify-between rounded-xl border border-line p-4 text-xs font-bold">
                Two-step verification
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-brand"
                />
              </label>
            </div>
          )}
          <button
            onClick={() => onNotify("Preferences saved")}
            className="mt-6 rounded-xl bg-brand px-5 py-3 text-xs font-extrabold text-white"
          >
            Save preferences
          </button>
        </section>
      </div>
    </div>
  );
}
function Integration({
  icon,
  title,
  detail,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <span className="grid size-12 place-items-center rounded-xl bg-canvas">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-xs font-extrabold">{title}</p>
        <p className="mt-1 text-[10px] text-muted">{detail}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full ${enabled ? "bg-brand" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow transition-all ${enabled ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}

function BookingModal({
  doctor,
  onClose,
  onSuccess,
}: {
  doctor: Doctor;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { appointments, addAppointment } = useApp();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("2026-08-22");
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const urgency = symptoms.toLowerCase().match(/severe|chest pain|faint|breath/)
    ? "High"
    : symptoms.length > 45
      ? "Medium"
      : "Low";
  const unavailable = useMemo(
    () =>
      new Set(
        appointments
          .filter(
            (a) =>
              a.doctorId === doctor.id &&
              a.date === date &&
              a.status === "upcoming",
          )
          .map((a) => a.time),
      ),
    [appointments, doctor.id, date],
  );
  function next() {
    setError("");
    if (step === 1 && !time) {
      setError("Choose an available time to continue.");
      return;
    }
    if (step === 2 && symptoms.trim().length < 20) {
      setError(
        "Please share at least a little more detail (20 characters minimum).",
      );
      return;
    }
    if (step < 3) setStep(step + 1);
    else {
      setProcessing(true);
      setTimeout(() => {
        addAppointment({
          doctorId: doctor.id,
          patientName: "Aarav Sharma",
          date,
          time,
          type: "In-person visit",
          status: "upcoming",
          symptoms,
          urgency,
          complaint: symptoms.slice(0, 90),
          questions: [
            "When did you first notice these symptoms?",
            "What makes them better or worse?",
            "Have you tried any treatment so far?",
          ],
          calendarSynced: true,
          emailSent: true,
        });
        onSuccess();
      }, 900);
    }
  }
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/45 p-3 backdrop-blur-sm">
      <div className="max-h-[94vh] w-full max-w-2xl overflow-auto rounded-[24px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white p-5">
          <div className="flex items-center gap-3">
            <DoctorAvatar doctor={doctor} />
            <div>
              <p className="text-sm font-extrabold">Book {doctor.name}</p>
              <p className="text-[10px] text-muted">
                {doctor.specialty} · ₹{doctor.fee}
              </p>
            </div>
          </div>
          <button
            aria-label="Close booking"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl bg-canvas"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-2 px-5 pt-5">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-line"}`}
            />
          ))}
        </div>
        <div className="p-5 sm:p-7">
          {step === 1 && (
            <>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand">
                Step 1 · Select a time
              </p>
              <h2 className="mt-2 text-xl font-extrabold">
                When would you like to visit?
              </h2>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  onClick={() => setDate("2026-08-21")}
                  className={`rounded-xl border p-3 text-center ${date === "2026-08-21" ? "border-brand bg-brand-soft" : "border-line"}`}
                >
                  <p className="text-[10px] text-muted">FRI</p>
                  <p className="mt-1 text-lg font-extrabold">21</p>
                  <p className="text-[10px]">Aug</p>
                </button>
                <button
                  onClick={() => setDate("2026-08-22")}
                  className={`rounded-xl border p-3 text-center ${date === "2026-08-22" ? "border-brand bg-brand-soft" : "border-line"}`}
                >
                  <p className="text-[10px] text-muted">SAT</p>
                  <p className="mt-1 text-lg font-extrabold">22</p>
                  <p className="text-[10px]">Aug</p>
                </button>
                <button
                  onClick={() => setDate("2026-08-24")}
                  className={`rounded-xl border p-3 text-center ${date === "2026-08-24" ? "border-brand bg-brand-soft" : "border-line"}`}
                >
                  <p className="text-[10px] text-muted">MON</p>
                  <p className="mt-1 text-lg font-extrabold">24</p>
                  <p className="text-[10px]">Aug</p>
                </button>
              </div>
              <p className="mt-6 text-xs font-extrabold">
                Available times{" "}
                <span className="ml-2 font-normal text-muted">
                  45 min slots
                </span>
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {slots.map((s) => (
                  <button
                    disabled={unavailable.has(s)}
                    onClick={() => setTime(s)}
                    key={s}
                    className={`rounded-xl border px-3 py-3 text-[11px] font-bold ${unavailable.has(s) ? "cursor-not-allowed bg-slate-50 text-slate-300 line-through" : time === s ? "border-brand bg-brand text-white" : "border-line hover:border-brand"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand bg-brand-soft p-4 text-xs font-bold text-brand-dark">
                <MapPin size={18} className="text-brand" />
                In-person visit · Carely Medical Centre
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand">
                Step 2 · Tell your doctor
              </p>
              <h2 className="mt-2 text-xl font-extrabold">
                What brings you in?
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted">
                Share your symptoms in your own words. Carely Assist will turn
                them into a concise brief for your doctor.
              </p>
              <textarea
                autoFocus
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={7}
                placeholder="For example: I’ve had a headache behind my eyes for three days. It gets worse in the evening…"
                className="mt-5 w-full resize-none rounded-xl border border-line p-4 text-xs leading-6 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              />
              <p className="mt-2 text-right text-[10px] text-muted">
                {symptoms.length} characters
              </p>
              <div className="mt-4 flex gap-3 rounded-xl bg-blue-50 p-4">
                <ShieldCheckIcon />
                <p className="text-[10px] leading-5 text-blue-800">
                  Your information is encrypted and only shared with your care
                  team.
                </p>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand">
                Step 3 · Review & confirm
              </p>
              <h2 className="mt-2 text-xl font-extrabold">
                Everything look right?
              </h2>
              <div className="mt-5 rounded-xl border border-line p-5">
                <div className="flex gap-3">
                  <DoctorAvatar doctor={doctor} />
                  <div>
                    <p className="text-xs font-extrabold">{doctor.name}</p>
                    <p className="mt-1 text-[10px] text-muted">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
                <div className="my-4 h-px bg-line" />
                <div className="grid gap-4 text-xs sm:grid-cols-2">
                  <p>
                    <span className="block text-[10px] text-muted">
                      DATE & TIME
                    </span>
                    <b className="mt-1 block">
                      {date.split("-").reverse().join("/")} · {time}
                    </b>
                  </p>
                  <p>
                    <span className="block text-[10px] text-muted">
                      CONSULTATION
                    </span>
                    <b className="mt-1 block">In-person visit</b>
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-brand-soft p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-extrabold">
                    <Sparkles size={15} className="text-brand" />
                    Carely symptom brief
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${urgency === "High" ? "bg-red-100 text-red-700" : urgency === "Medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}
                  >
                    {urgency} urgency
                  </span>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted">{symptoms}</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted">
                <GoogleCalendarLogo size={17} />
                Will be added to Google Calendar <span>·</span>
                <GmailLogo size={17} />
                Email confirmation enabled
              </div>
            </>
          )}
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">
              {error}
            </p>
          )}
          <div className="mt-7 flex justify-between">
            <button
              onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
              className="rounded-xl border border-line px-5 py-3 text-xs font-bold"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              disabled={processing}
              onClick={next}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-extrabold text-white disabled:opacity-60"
            >
              {processing
                ? "Securing your slot…"
                : step === 3
                  ? "Confirm appointment"
                  : "Continue"}
              <ArrowRight size={15} />
            </button>
          </div>
          {step === 1 && (
            <p className="mt-3 text-right text-[9px] text-muted">
              Your selected slot is held for 05:00 minutes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
function ShieldCheckIcon() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-blue-600">
      <BadgeCheck size={17} />
    </span>
  );
}

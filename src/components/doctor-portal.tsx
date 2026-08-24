"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileHeart,
  Grid2X2,
  Home,
  Plus,
  Search,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { DashboardShell, NavItem } from "./dashboard-shell";
import { useApp } from "@/lib/app-context";
import { Appointment } from "@/lib/types";
import { SectionTitle, StatCard, StatusBadge } from "./ui";
import { GoogleCalendarLogo } from "./brand";
import { portalPath } from "@/lib/portal-routes";
import {
  AvailabilityApi,
  AvailabilityOverrideApi,
  DayOfWeek,
  createDoctorAvailabilityOverrideRequest,
  createLeaveRequestRequest,
  deleteDoctorAvailabilityRequest,
  deleteDoctorAvailabilityOverrideRequest,
  getDoctorAvailabilityRequest,
  getDoctorAvailabilityOverridesRequest,
  getDoctorLeaveRequestsRequest,
  getDoctorProfileRequest,
  getDoctorSlotsRequest,
  saveDoctorAvailabilityRequest,
  updateDoctorProfileRequest,
  DoctorProfile,
  LeaveRequestApi,
  SlotApi,
} from "@/lib/api";
const nav: NavItem[] = [
  { id: "overview", label: "Today", icon: Home },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "slots", label: "Slots", icon: Grid2X2 },
  { id: "patients", label: "Patients", icon: Users },
  { id: "summaries", label: "Visit summaries", icon: FileHeart, badge: 2 },
  { id: "availability", label: "Availability", icon: Clock3 },
];
export function DoctorPortal({ section = "overview" }: { section?: string }) {
  const router = useRouter();
  const active = section;
  const navigate = (id: string) => router.push(portalPath("doctor", id));
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [toast, setToast] = useState("");
  function notify(s: string) {
    setToast(s);
    setTimeout(() => setToast(""), 2500);
  }
  return (
    <DashboardShell
      role="doctor"
      nav={nav}
      active={active}
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-2xl bg-ink px-5 py-4 text-xs font-bold text-white shadow-2xl">
          <CheckCircle2 size={18} className="text-[#71d5be]" />
          {toast}
        </div>
      )}
      {active === "overview" && (
        <DoctorToday onOpen={setSelected} onNav={navigate} />
      )}{" "}
      {active === "schedule" && (
        <DoctorSchedule onOpen={setSelected} onManageAvailability={() => navigate("slots")} />
      )}{" "}
      {active === "patients" && <Patients />}{" "}
      {active === "summaries" && (
        <Summaries onOpen={setSelected} notify={notify} />
      )}{" "}
      {active === "availability" && <Availability notify={notify} onOpenSlots={() => navigate("slots")} />} {" "}
      {active === "slots" && <DoctorSlots />} {" "}
      {active === "settings" && <DoctorSettings notify={notify} />}{" "}
      {selected && (
        <ConsultationPanel
          appointment={selected}
          close={() => setSelected(null)}
          notify={notify}
        />
      )}
    </DashboardShell>
  );
}
function Header({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-brand">
          Thursday, 20 August
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em]">
          {title}
        </h1>
        <p className="mt-2 text-xs text-muted">{copy}</p>
      </div>
      {action}
    </div>
  );
}
function DoctorToday({
  onOpen,
  onNav,
}: {
  onOpen: (a: Appointment) => void;
  onNav: (s: string) => void;
}) {
  const { appointments } = useApp();
  const [doctorId, setDoctorId] = useState("");
  const todayDate = scheduleDateForOffset(0);

  useEffect(() => {
    void getDoctorProfileRequest()
      .then((profile) => setDoctorId(profile.id))
      .catch(() => setDoctorId(""));
  }, []);

  const today = appointments.filter(
    (a) =>
      a.doctorId === doctorId &&
      a.status === "upcoming" &&
      a.date === todayDate,
  );
  return (
    <div>
      <Header
        title="Good morning, Dr. Maya"
        copy={`You have ${today.length} appointments and ${today.filter((a) => a.urgency === "High").length} case that needs your attention.`}
        action={
          <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[10px] font-bold text-muted">
            <GoogleCalendarLogo size={17} />
            Calendar synced
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Today’s visits"
          value={String(today.length)}
          detail="All visits at the clinic"
          icon={CalendarDays}
          tone="blue"
        />
        <StatCard
          label="Patients this week"
          value="24"
          detail="8% from last week"
          icon={Users}
          trend="up"
        />
        <StatCard
          label="Pending summaries"
          value="2"
          detail="Complete before 6:00 PM"
          icon={FileHeart}
          tone="amber"
        />
        <StatCard
          label="Avg. care rating"
          value="4.9"
          detail="From 128 patient reviews"
          icon={Activity}
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
        <section className="card min-w-0 p-5 sm:p-6">
          <SectionTitle
            title="Today’s appointments"
            subtitle="Thursday, 20 August · 3 scheduled"
            action={
              <button
                onClick={() => onNav("schedule")}
                className="text-[11px] font-extrabold text-brand"
              >
                Full schedule →
              </button>
            }
          />
          <div className="mt-5 space-y-2">
            {today.map((a, i) => (
              <AppointmentRow key={a.id} a={a} index={i} onOpen={onOpen} />
            ))}
          </div>
        </section>
        <aside className="min-w-0 space-y-5">
          <div className="rounded-[20px] bg-[#0d4b43] p-5 text-white">
            <div className="flex justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-[#75d7bf]">
                <Sparkles size={19} />
              </span>
              <span className="rounded-full bg-red-400/15 px-2.5 py-1 text-[9px] font-extrabold text-[#ffbbb0]">
                HIGH PRIORITY
              </span>
            </div>
            <h3 className="mt-5 text-sm font-extrabold">
              A case needs attention
            </h3>
            <p className="mt-2 text-[10px] leading-5 text-white/55">
              Rohan reported sudden severe chest pain with sweating. Review
              before the 12:00 PM visit.
            </p>
            <button
              disabled={!today.some((a) => a.urgency === "High")}
              onClick={() => {
                const urgent = today.find((a) => a.urgency === "High");
                if (urgent) onOpen(urgent);
              }}
              className="mt-5 flex items-center gap-2 text-[10px] font-extrabold text-[#7edbc5]"
            >
              Review symptom brief <ArrowRight size={14} />
            </button>
          </div>
          <div className="card p-5">
            <SectionTitle title="Day progress" />
            <div className="mt-5 flex items-center gap-5">
              <div className="grid size-20 place-items-center rounded-full bg-[conic-gradient(#087f6c_0_35%,#e9efed_35%)]">
                <span className="grid size-15 place-items-center rounded-full bg-white text-sm font-extrabold">
                  35%
                </span>
              </div>
              <div className="space-y-2 text-[10px] font-bold">
                <p>
                  <span className="mr-2 inline-block size-2 rounded-full bg-brand" />
                  2 completed
                </p>
                <p>
                  <span className="mr-2 inline-block size-2 rounded-full bg-blue-400" />
                  3 upcoming
                </p>
                <p>
                  <span className="mr-2 inline-block size-2 rounded-full bg-slate-200" />
                  1 open slot
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="card p-5">
          <SectionTitle
            title="Follow-ups due"
            subtitle="Patients who may need a check-in"
          />
          <div className="mt-4 space-y-3">
            {[
              ["RN", "Riya Nair", "Blood pressure review", "Due today"],
              ["VK", "Varun Kumar", "Post-procedure follow-up", "Due tomorrow"],
            ].map((p, i) => (
              <div className="flex items-center gap-3" key={p[1]}>
                <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-[10px] font-extrabold text-brand">
                  {p[0]}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-extrabold">{p[1]}</p>
                  <p className="text-[10px] text-muted">{p[2]}</p>
                </div>
                <span
                  className={`text-[9px] font-bold ${i ? "text-muted" : "text-amber-700"}`}
                >
                  {p[3]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <SectionTitle title="Practice snapshot" subtitle="This month" />
          <div className="mt-5 grid grid-cols-3 divide-x divide-line text-center">
            <div>
              <p className="text-xl font-extrabold">92</p>
              <p className="mt-1 text-[9px] text-muted">VISITS</p>
            </div>
            <div>
              <p className="text-xl font-extrabold">86%</p>
              <p className="mt-1 text-[9px] text-muted">ON TIME</p>
            </div>
            <div>
              <p className="text-xl font-extrabold">14m</p>
              <p className="mt-1 text-[9px] text-muted">AVG. WAIT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function AppointmentRow({
  a,
  index,
  onOpen,
}: {
  a: Appointment;
  index: number;
  onOpen: (a: Appointment) => void;
}) {
  return (
    <button
      onClick={() => onOpen(a)}
      className={`flex min-w-0 w-full items-center gap-2 rounded-xl border p-3 text-left hover:border-brand/30 hover:bg-brand-soft/20 sm:gap-3 sm:p-3.5 ${a.urgency === "High" ? "border-red-100 bg-red-50/40" : "border-line"}`}
    >
      <div className="w-12 shrink-0 sm:w-16">
        <p className="text-xs font-extrabold">
          {a.time.replace(" AM", "").replace(" PM", "")}
        </p>
        <p className="mt-0.5 text-[9px] text-muted">45 min</p>
      </div>
      <span className="h-9 w-px bg-line" />
      <span
        className={`grid size-9 place-items-center rounded-xl text-[10px] font-extrabold ${["bg-blue-50 text-blue-600", "bg-violet-50 text-violet-600", "bg-orange-50 text-orange-600"][index % 3]}`}
      >
        {a.patientName
          .split(" ")
          .map((x) => x[0])
          .join("")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-xs font-extrabold">{a.patientName}</p>
          {a.urgency !== "Low" && (
            <span
              className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold ${a.urgency === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
            >
              {a.urgency}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-[10px] text-muted">{a.complaint}</p>
      </div>
      <span className="hidden items-center gap-1 text-[9px] font-bold text-muted sm:flex">
        <Stethoscope size={13} /> In-person
      </span>
      <ChevronRight size={16} className="text-muted" />
    </button>
  );
}
function normaliseTime(value: string) {
  return value.replace(/^0/, "").replace(/\s+/g, " ").toUpperCase();
}

function formatScheduleDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function scheduleDateForOffset(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function DoctorSchedule({
  onOpen,
  onManageAvailability,
}: {
  onOpen: (a: Appointment) => void;
  onManageAvailability: () => void;
}) {
  const { appointments } = useApp();
  const [doctorId, setDoctorId] = useState("");
  const [dayOffset, setDayOffset] = useState(0);
  const [view, setView] = useState("Day");
  const selectedDate = scheduleDateForOffset(dayOffset);
  const [slots, setSlots] = useState<SlotApi[]>([]);
  const [slotsDate, setSlotsDate] = useState("");
  const [slotsError, setSlotsError] = useState("");
  const mine = appointments.filter(
    (a) =>
      a.doctorId === doctorId &&
      a.status === "upcoming" &&
      a.date === selectedDate,
  );
  useEffect(() => {
    let cancelled = false;
    void getDoctorProfileRequest()
      .then((doctor) => {
        if (!cancelled) {
          setDoctorId(doctor.id);
        }
        return getDoctorSlotsRequest(doctor.id, selectedDate);
      })
      .then((loaded) => { if (!cancelled) { setSlots(loaded); setSlotsDate(selectedDate); } })
      .catch((e) => { if (!cancelled) { setSlotsError(e instanceof Error ? e.message : "Unable to load slots."); setSlotsDate(selectedDate); } });
    return () => { cancelled = true; };
  }, [selectedDate]);
  return (
    <div>
      <Header
        title="Schedule"
        copy="Plan your day and keep every appointment on track."
        action={
          <button
            onClick={onManageAvailability}
            className="rounded-xl bg-brand px-4 py-3 text-xs font-extrabold text-white"
          >
            <Plus size={15} className="mr-2 inline" />
            Manage time
          </button>
        }
      />
      <div className="card overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-line p-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <button
              disabled={dayOffset <= 0}
              onClick={() => setDayOffset(dayOffset - 1)}
              className="grid size-8 place-items-center rounded-lg border border-line disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>
            <p className="text-sm font-extrabold">{formatScheduleDate(selectedDate)}</p>
            <button
              disabled={dayOffset >= 7}
              onClick={() => setDayOffset(dayOffset + 1)}
              className="grid size-8 place-items-center rounded-lg border border-line disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => setDayOffset(0)}
              className="rounded-lg bg-brand-soft px-3 py-2 text-[10px] font-extrabold text-brand"
            >
              Today
            </button>
          </div>
          <div className="flex rounded-lg bg-canvas p-1 text-[10px] font-bold">
            {["Day", "Week", "Month"].map((x) => (
              <button
                key={x}
                onClick={() => setView(x)}
                className={`rounded-md px-3 py-2 ${view === x ? "bg-white text-ink shadow-sm" : "text-muted"}`}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        {view === "Day" ? (
          <div className="divide-y divide-line">
            {slotsDate !== selectedDate ? <p className="p-6 text-xs text-muted">Loading the day’s slots…</p> : slots.length === 0 ? <p className="p-6 text-xs text-muted">No availability configured for this date.</p> : slots.map((slot) => {
              const start = new Date(slot.startAt);
              const end = new Date(slot.endAt);
              const startLabel = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
              const endLabel = end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
              const appointment = mine.find((item) => normaliseTime(item.time) === normaliseTime(startLabel));
              return <div key={slot.startAt} className="grid min-h-20 grid-cols-[72px_1fr] sm:grid-cols-[92px_1fr]">
                <div className="border-r border-line px-3 py-4 text-right text-[10px] font-extrabold text-muted">{startLabel}</div>
                {appointment ? <button onClick={() => onOpen(appointment)} className={`m-2 rounded-xl border-l-4 p-3 text-left ${appointment.urgency === "High" ? "border-red-500 bg-red-50" : "border-brand bg-brand-soft"}`}><div className="flex justify-between gap-2"><p className="text-[10px] font-extrabold">{startLabel}–{endLabel} · {appointment.patientName}</p><span className="text-[9px] text-muted">{appointment.type}</span></div><p className="mt-1 truncate text-[9px] text-muted">{appointment.complaint}</p></button> : <div className={`m-2 flex items-center justify-between rounded-xl border px-3 py-2 text-[10px] font-extrabold ${slot.status === "BLOCKED" ? "border-slate-200 bg-slate-100 text-slate-500" : slot.status === "BOOKED" ? "border-blue-200 bg-blue-50 text-blue-900" : "border-brand/20 bg-brand-soft/40 text-brand-dark"}`}><span>{startLabel}–{endLabel}</span><span className="text-[9px] uppercase tracking-wider opacity-70">{slot.status}</span></div>}
              </div>;
            })}
          </div>
        ) : (
          <div className="p-6">
            <div
              className={`grid gap-3 ${view === "Week" ? "sm:grid-cols-7" : "sm:grid-cols-4"}`}
            >
              {(view === "Week"
                ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                : ["Week 1", "Week 2", "Week 3", "Week 4"]
              ).map((label, i) => (
                <button
                  key={label}
                  onClick={() => {
                    setView("Day");
                    setDayOffset(Math.min(i, 7));
                  }}
                  className="min-h-28 rounded-xl border border-line bg-canvas p-4 text-left hover:border-brand"
                >
                  <p className="text-xs font-extrabold">{label}</p>
                  <p className="mt-3 text-2xl font-extrabold text-brand">
                    {i === 3 ? mine.length : i + 1}
                  </p>
                  <p className="mt-1 text-[10px] text-muted">appointments</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {slotsError && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{slotsError}</p>}
    </div>
  );
}
function DoctorSlots() {
  const { appointments } = useApp();
  const [dayOffset, setDayOffset] = useState(0);
  const [doctorId, setDoctorId] = useState("");
  const selectedDate = scheduleDateForOffset(dayOffset);
  const [slots, setSlots] = useState<SlotApi[]>([]);
  const [loadedDate, setLoadedDate] = useState("");
  const [error, setError] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [blocking, setBlocking] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [overrides, setOverrides] = useState<AvailabilityOverrideApi[]>([]);
  const [extraOpen, setExtraOpen] = useState(false);
  const [extraStart, setExtraStart] = useState("18:00");
  const [extraEnd, setExtraEnd] = useState("19:00");
  const [extraReason, setExtraReason] = useState("");
  const [savingExtra, setSavingExtra] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void getDoctorProfileRequest()
      .then((doctor) => {
        if (!cancelled) {
          setDoctorId(doctor.id);
        }
        return getDoctorSlotsRequest(doctor.id, selectedDate);
      })
      .then((loaded) => getDoctorAvailabilityOverridesRequest(selectedDate).then((loadedOverrides) => ({ loaded, loadedOverrides })))
      .then(({ loaded, loadedOverrides }) => { if (!cancelled) { setError(""); setSlots(loaded); setOverrides(loadedOverrides); setSelectedSlots(new Set()); setSelectionMode(false); setLoadedDate(selectedDate); } })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : "Unable to load slots."); setLoadedDate(selectedDate); } });
    return () => { cancelled = true; };
  }, [selectedDate]);
  async function refreshAfterChange() {
    const doctor = await getDoctorProfileRequest();
    const [loaded, loadedOverrides] = await Promise.all([
      getDoctorSlotsRequest(doctor.id, selectedDate),
      getDoctorAvailabilityOverridesRequest(selectedDate),
    ]);
    setSlots(loaded);
    setOverrides(loadedOverrides);
    setSelectedSlots(new Set());
    setLoadedDate(selectedDate);
  }
  function toggleSlot(slot: SlotApi) {
    if (!selectionMode || slot.status !== "AVAILABLE") return;
    setSelectedSlots((current) => {
      const next = new Set(current);
      if (next.has(slot.startAt)) next.delete(slot.startAt); else next.add(slot.startAt);
      return next;
    });
  }
  async function blockSelectedSlots() {
    const chosen = slots.filter((slot) => {
      const appointment = appointments.find(
        (item) => item.doctorId === doctorId &&
          item.startAt &&
          new Date(item.startAt).getTime() === new Date(slot.startAt).getTime(),
      );
      return selectedSlots.has(slot.startAt) && slot.status === "AVAILABLE" && !appointment;
    });
    if (chosen.length === 0) return;
    setBlocking(true); setError("");
    try {
      await Promise.all(chosen.map((slot) => createDoctorAvailabilityOverrideRequest({
        date: selectedDate,
        startTime: slot.startAt.slice(11, 16),
        endTime: slot.endAt.slice(11, 16),
        type: "BLOCKED",
        reason: "Blocked from the Slots page",
      })));
      await refreshAfterChange();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to block the selected slots."); }
    finally { setBlocking(false); }
  }
  async function addExtraTime(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSavingExtra(true); setError("");
    if (![extraStart, extraEnd].every((value) => /^([01]\d|2[0-3]):(00|30)$/.test(value)) || extraStart >= extraEnd) {
      setError("Extra time must use 30-minute boundaries and end after it starts.");
      setSavingExtra(false);
      return;
    }
    try {
      await createDoctorAvailabilityOverrideRequest({ date: selectedDate, startTime: extraStart, endTime: extraEnd, type: "EXTRA", reason: extraReason.trim() || undefined });
      await refreshAfterChange();
      setExtraReason(""); setExtraOpen(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to add extra time."); }
    finally { setSavingExtra(false); }
  }
  async function deleteOverride(item: AvailabilityOverrideApi) {
    try {
      await deleteDoctorAvailabilityOverrideRequest(item.id);
      await refreshAfterChange();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete override."); }
  }
  return <div>
    <Header title="Slots" copy="Review every 30-minute slot and its current status." />
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-5">
        <button disabled={dayOffset <= 0} onClick={() => setDayOffset((value) => value - 1)} className="grid size-8 place-items-center rounded-lg border border-line disabled:opacity-30"><ChevronLeft size={15} /></button>
        <p className="text-sm font-extrabold">{formatScheduleDate(selectedDate)}</p>
        <button disabled={dayOffset >= 7} onClick={() => setDayOffset((value) => value + 1)} className="grid size-8 place-items-center rounded-lg border border-line disabled:opacity-30"><ChevronRight size={15} /></button>
        <button onClick={() => setDayOffset(0)} className="rounded-lg bg-brand-soft px-3 py-2 text-[10px] font-extrabold text-brand">Today</button>
      </div>
      {error && <p role="alert" className="m-5 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
      {loadedDate !== selectedDate ? <p className="p-6 text-xs text-muted">Loading slots…</p> : slots.length === 0 ? <p className="p-6 text-xs text-muted">No availability configured for this date.</p> : <>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4"><p className="text-xs text-muted">{selectionMode ? "Select available slots, then confirm the block." : "Viewing mode — enable selection before choosing slots."}</p><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => { setSelectionMode((value) => !value); setSelectedSlots(new Set()); }} disabled={blocking} className={`rounded-xl border px-4 py-2 text-[10px] font-extrabold ${selectionMode ? "border-brand bg-brand-soft text-brand" : "border-line"}`}>{selectionMode ? "Cancel selection" : "Select slots to block"}</button>{selectionMode && <><button type="button" onClick={() => setSelectedSlots(new Set())} disabled={selectedSlots.size === 0 || blocking} className="rounded-xl border border-line px-4 py-2 text-[10px] font-extrabold disabled:opacity-40">Clear</button><button type="button" onClick={() => void blockSelectedSlots()} disabled={selectedSlots.size === 0 || blocking} className="rounded-xl bg-brand px-4 py-2 text-[10px] font-extrabold text-white disabled:opacity-40">{blocking ? "Blocking…" : `Block ${selectedSlots.size || "selected"} slot${selectedSlots.size === 1 ? "" : "s"}`}</button></>}</div></div>
        <div className="grid gap-3 p-5 sm:grid-cols-3 lg:grid-cols-5">
          {slots.map((slot) => {
            const start = new Date(slot.startAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            });
            const end = new Date(slot.endAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            });
            const appointment = appointments.find(
              (item) => item.doctorId === doctorId &&
                item.startAt &&
                new Date(item.startAt).getTime() === new Date(slot.startAt).getTime(),
            );
            const booked = Boolean(appointment);
            const selected = selectedSlots.has(slot.startAt);
            const slotStart = slot.startAt.slice(11, 16);
            const slotEnd = slot.endAt.slice(11, 16);
            const isExtra = overrides.some(
              (item) => item.type === "EXTRA" &&
                item.startTime.slice(0, 5) <= slotStart &&
                item.endTime.slice(0, 5) >= slotEnd,
            );
            const status = booked ? "BOOKED" : slot.status;

            return (
              <button
                type="button"
                disabled={status !== "AVAILABLE" || blocking || !selectionMode}
                onClick={() => toggleSlot(slot)}
                key={slot.startAt}
                className={`rounded-xl border px-4 py-4 text-left transition ${
                  status === "BLOCKED"
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-600"
                    : status === "BOOKED"
                      ? "cursor-not-allowed border-blue-200 bg-blue-50 text-blue-900"
                      : selected
                        ? "border-brand bg-brand text-white"
                        : isExtra
                          ? "border-amber-200 bg-amber-50 text-amber-900"
                          : selectionMode
                            ? "border-brand/20 bg-brand-soft text-brand-dark hover:border-brand"
                            : "border-brand/20 bg-brand-soft text-brand-dark"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-extrabold">{start}–{end}</p>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider opacity-70">
                    {selected ? "SELECTED" : status === "BOOKED" ? "BOOKED" : status === "BLOCKED" ? "BLOCKED" : isExtra ? "EXTRA" : "AVAILABLE"}
                  </span>
                </div>
                <p className={`mt-2 text-[10px] ${selected ? "text-white/75" : "text-muted"}`}>
                  {status === "BLOCKED"
                    ? "Unavailable by doctor"
                    : status === "BOOKED"
                      ? appointment?.patientName || "Appointment booked"
                      : selected
                        ? "Ready to block"
                        : isExtra
                          ? "Extra availability"
                          : "Open for booking"}
                </p>
              </button>
            );
          })}
        </div>
      </>}
      <div className="border-t border-line p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-extrabold">Add extra time</p><p className="mt-1 text-[10px] text-muted">Create availability outside your normal working hours.</p></div><button type="button" onClick={() => setExtraOpen((value) => !value)} className="rounded-xl border border-brand/30 px-4 py-2 text-[10px] font-extrabold text-brand">{extraOpen ? "Cancel" : "Add extra time"}</button></div>{extraOpen && <form onSubmit={addExtraTime} className="mt-4 grid gap-3 sm:grid-cols-3"><label className="text-[10px] font-extrabold">From<input required type="time" step="1800" value={extraStart} onChange={(e) => setExtraStart(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3 text-xs" /></label><label className="text-[10px] font-extrabold">Until<input required type="time" step="1800" value={extraEnd} onChange={(e) => setExtraEnd(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3 text-xs" /></label><input value={extraReason} onChange={(e) => setExtraReason(e.target.value)} placeholder="Reason (optional)" className="self-end rounded-xl border border-line p-3 text-xs" /><button type="submit" disabled={savingExtra} className="rounded-xl bg-brand px-4 py-3 text-[10px] font-extrabold text-white sm:col-span-3">{savingExtra ? "Adding…" : "Add extra availability"}</button></form>}</div>
      {overrides.length > 0 && <div className="border-t border-line p-5"><p className="text-sm font-extrabold">Changes for this date</p><div className="mt-3 space-y-2">{overrides.map((item) => <div key={item.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3 text-[10px]"><span className={`rounded-full px-2 py-1 font-extrabold ${item.type === "BLOCKED" ? "bg-slate-100 text-slate-700" : "bg-emerald-50 text-emerald-700"}`}>{item.type}</span><span className="font-bold">{item.startTime.slice(0, 5)}–{item.endTime.slice(0, 5)}</span><span className="min-w-0 flex-1 text-muted">{item.reason || "No reason provided"}</span><button type="button" onClick={() => void deleteOverride(item)} className="font-extrabold text-red-700">Delete</button></div>)}</div></div>}
    </section>
  </div>;
}
function Patients() {
  const { appointments } = useApp();
  const [query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const names = [...new Set(appointments.map((a) => a.patientName))].filter(
    (n) => n.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div>
      <Header
        title="Patients"
        copy="Review patient history and maintain continuity of care."
      />
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row">
          <label className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl bg-canvas py-3 pl-10 text-xs outline-none"
              placeholder="Search patients"
            />
          </label>
          <button
            onClick={() => setQuery("")}
            className="rounded-xl border border-line px-4 py-3 text-xs font-bold"
          >
            Clear filter
          </button>
        </div>
        <div className="divide-y divide-line">
          {names.map((n, i) => (
            <div key={n} className="flex flex-wrap items-center gap-4 p-5">
              <span
                className={`grid size-11 place-items-center rounded-xl text-xs font-extrabold ${["bg-blue-50 text-blue-600", "bg-violet-50 text-violet-600", "bg-orange-50 text-orange-600"][i % 3]}`}
              >
                {n
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </span>
              <div className="flex-1">
                <p className="text-xs font-extrabold">{n}</p>
                <p className="mt-1 text-[10px] text-muted">
                  {i === 0
                    ? "28 years · O+ · Last seen 15 Aug"
                    : "Patient since 2025 · Last seen this month"}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-[10px] font-bold">{i + 1} visits</p>
                <p className="mt-1 text-[9px] text-muted">
                  Next: {i ? "Not scheduled" : "21 Aug"}
                </p>
              </div>
              <button
                onClick={() =>
                  setSelectedPatient(selectedPatient === n ? null : n)
                }
                className="rounded-lg border border-line px-3 py-2 text-[10px] font-bold"
              >
                {selectedPatient === n ? "Close profile" : "Open profile"}
              </button>
              {selectedPatient === n && (
                <div className="basis-full rounded-xl bg-canvas p-4 text-xs">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <p>
                      <b>Blood group</b>
                      <br />
                      <span className="text-muted">O positive</span>
                    </p>
                    <p>
                      <b>Allergies</b>
                      <br />
                      <span className="text-muted">None recorded</span>
                    </p>
                    <p>
                      <b>Last visit</b>
                      <br />
                      <span className="text-muted">15 August 2026</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Summaries({
  onOpen,
  notify,
}: {
  onOpen: (a: Appointment) => void;
  notify: (s: string) => void;
}) {
  const { appointments } = useApp();
  const [drafts, setDrafts] = useState(["Riya Nair", "Varun Kumar"]);
  const completed = appointments.filter((a) => a.status === "completed");
  return (
    <div>
      <Header
        title="Visit summaries"
        copy="Finalize clinical notes and clear, patient-friendly follow-ups."
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <section className="card">
          <div className="flex items-center justify-between border-b border-line p-5">
            <p className="text-sm font-extrabold">Recent visits</p>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[9px] font-extrabold text-amber-700">
              2 need review
            </span>
          </div>
          <div className="divide-y divide-line">
            {completed.map((a) => {
              return (
                <div
                  className="flex flex-wrap items-center gap-4 p-5"
                  key={a.id}
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-[10px] font-extrabold text-brand">
                    {a.patientName
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-extrabold">{a.patientName}</p>
                    <p className="mt-1 text-[10px] text-muted">
                      {a.diagnosis} · 15 Aug
                    </p>
                  </div>
                  <StatusBadge status="completed" />
                  <button
                    onClick={() => onOpen(a)}
                    className="rounded-lg border border-line px-3 py-2 text-[10px] font-bold"
                  >
                    Review
                  </button>
                </div>
              );
            })}
            {drafts.map((n) => (
              <div className="flex flex-wrap items-center gap-4 p-5" key={n}>
                <span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-[10px] font-extrabold text-orange-700">
                  {n
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-extrabold">{n}</p>
                  <p className="mt-1 text-[10px] text-muted">
                    Visit completed · Notes saved
                  </p>
                </div>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-extrabold text-amber-700">
                  Draft
                </span>
                <button
                  onClick={() => {
                    setDrafts(drafts.filter((x) => x !== n));
                    notify(`${n}'s summary finalized and sent`);
                  }}
                  className="rounded-lg bg-brand px-3 py-2 text-[10px] font-extrabold text-white"
                >
                  Complete
                </button>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-[20px] bg-[#edf7f4] p-6">
          <Sparkles className="text-brand" />
          <h3 className="mt-5 text-lg font-extrabold">
            Write clinically.
            <br />
            Share clearly.
          </h3>
          <p className="mt-3 text-xs leading-6 text-muted">
            Carely Assist turns your clinical notes into a simple, reassuring
            summary patients can understand.
          </p>
          <div className="mt-5 space-y-3">
            {[
              "Medication schedule extracted",
              "Follow-up steps highlighted",
              "Clinical meaning preserved",
            ].map((x) => (
              <p className="flex gap-2 text-[10px] font-bold" key={x}>
                <Check size={14} className="text-brand" />
                {x}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
function Availability({ notify, onOpenSlots }: { notify: (s: string) => void; onOpenSlots: () => void }) {
  const days: { label: string; value: DayOfWeek }[] = [
    { label: "Monday", value: "MONDAY" },
    { label: "Tuesday", value: "TUESDAY" },
    { label: "Wednesday", value: "WEDNESDAY" },
    { label: "Thursday", value: "THURSDAY" },
    { label: "Friday", value: "FRIDAY" },
    { label: "Saturday", value: "SATURDAY" },
    { label: "Sunday", value: "SUNDAY" },
  ];
  const [weekly, setWeekly] = useState<Record<DayOfWeek, { enabled: boolean; startTime: string; endTime: string; timezone: string }>>(
    Object.fromEntries(days.map(({ value }) => [value, { enabled: false, startTime: "09:00", endTime: "17:00", timezone: "Asia/Kolkata" }])) as Record<DayOfWeek, { enabled: boolean; startTime: string; endTime: string; timezone: string }>,
  );
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [savingWeekly, setSavingWeekly] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [requests, setRequests] = useState<LeaveRequestApi[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    void Promise.all([getDoctorAvailabilityRequest(), getDoctorLeaveRequestsRequest()])
      .then(([availability, loadedRequests]) => {
        setWeekly((current) => {
          const next = { ...current };
          availability.forEach((item: AvailabilityApi) => {
            next[item.dayOfWeek] = { enabled: true, startTime: item.startTime.slice(0, 5), endTime: item.endTime.slice(0, 5), timezone: item.timezone };
          });
          return next;
        });
        setRequests(loadedRequests);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load availability."))
      .finally(() => { setLoadingWeekly(false); setLoadingRequests(false); });
  }, []);
  function updateDay(day: DayOfWeek, patch: Partial<(typeof weekly)[DayOfWeek]>) {
    setWeekly((current) => ({ ...current, [day]: { ...current[day], ...patch } }));
  }
  async function saveWeekly() {
    setSavingWeekly(true); setError("");
    try {
      await Promise.all(days.map(({ value }) => {
        const item = weekly[value];
        return item.enabled
          ? saveDoctorAvailabilityRequest(value, { startTime: item.startTime, endTime: item.endTime, timezone: item.timezone })
          : deleteDoctorAvailabilityRequest(value);
      }));
      notify("Weekly availability saved");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save weekly availability."); }
    finally { setSavingWeekly(false); }
  }
  async function submitLeave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    if (!startDate || !endDate || !reason.trim()) { setError("Choose a date range and provide a reason."); return; }
    setSubmitting(true);
    try { const request = await createLeaveRequestRequest({ startDate, endDate, reason: reason.trim() }); setRequests((current) => [request, ...current]); setReason(""); notify("Leave request submitted for admin approval"); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to submit leave request."); }
    finally { setSubmitting(false); }
  }
  return (
    <div>
      <Header
        title="Availability"
        copy="Set your working rhythm and keep the clinic informed."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
        <section className="card p-6">
          <SectionTitle
            title="Weekly working hours"
            subtitle="30-minute slots generated from these working hours"
          />
          <div className="mt-5 divide-y divide-line">
            {days.map(({ label, value }) => {
              const item = weekly[value];
              return (
              <div
                className="flex flex-wrap items-center gap-3 py-4 sm:gap-4"
                key={value}
              >
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) => updateDay(value, { enabled: e.target.checked })}
                  className="accent-brand"
                />
                <span className="w-24 text-xs font-extrabold">{label}</span>
                {item.enabled ? (
                  <>
                    <input aria-label={`${label} start time`} type="time" step="1800" value={item.startTime} onChange={(e) => updateDay(value, { startTime: e.target.value })} className="rounded-lg bg-canvas px-3 py-2 text-[10px] font-bold" />
                    <span className="text-muted">—</span>
                    <input aria-label={`${label} end time`} type="time" step="1800" value={item.endTime} onChange={(e) => updateDay(value, { endTime: e.target.value })} className="rounded-lg bg-canvas px-3 py-2 text-[10px] font-bold" />
                  </>
                ) : (
                  <span className="text-[10px] text-muted">Not available</span>
                )}
              </div>
              );
            })}
          </div>
          <button
            onClick={() => void saveWeekly()}
            disabled={loadingWeekly || savingWeekly}
            className="mt-5 rounded-xl bg-brand px-5 py-3 text-xs font-extrabold text-white"
          >
            {savingWeekly ? "Saving…" : "Save working hours"}
          </button>
          <button type="button" onClick={onOpenSlots} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-brand/30 py-3 text-xs font-extrabold text-brand">Open Slots to block a specific time <ArrowRight size={15} /></button>
        </section>
        <aside className="space-y-5">
          <div className="card p-5">
            <Calendar className="text-brand" />
            <h3 className="mt-4 text-sm font-extrabold">Plan leave</h3>
            <p className="mt-2 text-xs leading-5 text-muted">
              The clinic will review affected appointments and notify patients.
            </p>
            <form onSubmit={submitLeave}>
            <label className="mt-4 block text-[10px] font-extrabold">Start date<input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3 text-xs" /></label>
            <label className="mt-3 block text-[10px] font-extrabold">End date<input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3 text-xs" /></label>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional note"
              className="mt-3 w-full resize-none rounded-xl border border-line p-3 text-xs"
            />
            <button type="submit" disabled={submitting}
              className="mt-3 w-full rounded-xl border border-brand/30 py-3 text-xs font-extrabold text-brand"
            >
              {submitting ? "Submitting…" : "Request leave"}
            </button>
            </form>
            {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-[10px] font-bold text-red-700">{error}</p>}
            {!loadingRequests && requests.length > 0 && <div className="mt-5 border-t border-line pt-4"><p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Your requests</p><div className="mt-3 space-y-2">{requests.slice(0, 4).map((request) => <div key={request.id} className="rounded-xl border border-line p-3 text-[10px]"><div className="flex items-center justify-between gap-2"><span className="font-bold">{request.startDate} → {request.endDate}</span><span className={`rounded-full px-2 py-1 font-extrabold ${request.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : request.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{request.status}</span></div><p className="mt-1 text-muted">{request.reason}</p>{request.reviewerNote && <p className="mt-1 font-bold text-muted">Admin: {request.reviewerNote}</p>}</div>)}</div></div>}
          </div>
          <div className="rounded-2xl bg-amber-50 p-5">
            <CircleAlert size={18} className="text-amber-700" />
            <p className="mt-3 text-xs font-extrabold">2 affected visits</p>
            <p className="mt-1 text-[10px] leading-5 text-muted">
              Choosing 28 August will require two patients to be rescheduled.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
function DoctorSettings({ notify }: { notify: (s: string) => void }) {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { void getDoctorProfileRequest().then(setProfile).catch((e) => setError(e instanceof Error ? e.message : "Unable to load profile.")); }, []);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true); setError("");
    const form = new FormData(e.currentTarget);
    try { await updateDoctorProfileRequest({ consultationFee: Number(form.get("fee")), slotDurationMinutes: Number(form.get("slot")), biography: String(form.get("bio")), workingStartTime: String(form.get("start")), workingEndTime: String(form.get("end")) }); notify("Professional profile updated"); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to save profile."); }
    finally { setSaving(false); }
  }
  if (!profile) return <div><Header title="Settings" copy="Manage your professional profile and consultation preferences." /><section className="card max-w-3xl p-6">{error ? <p role="alert" className="text-xs font-bold text-red-700">{error}</p> : <p className="text-sm text-muted">Loading your profile…</p>}</section></div>;
  return (
    <div>
      <Header
        title="Settings"
        copy="Manage your professional profile and consultation preferences."
      />
      <section className="card max-w-3xl p-6">
        {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
        <form onSubmit={save}>
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-[#dcefe9] text-lg font-extrabold">
            MP
          </span>
          <div>
            <p className="font-extrabold">Dr. {profile.firstName} {profile.lastName}</p>
            <p className="mt-1 text-xs text-muted">{profile.specialization} · {profile.medicalLicenseNumber}</p>
            <label className="mt-2 block cursor-pointer text-[10px] font-extrabold text-brand">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  notify(`${e.target.files[0].name} selected as profile photo`)
                }
              />
              Change profile photo
            </label>
          </div>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-extrabold">
            Consultation fee
            <input
              name="fee" type="number" defaultValue={profile.consultationFee}
              className="mt-2 w-full rounded-xl border border-line p-3 font-normal"
            />
          </label>
          <label className="text-xs font-extrabold">
            Slot duration
            <select name="slot" defaultValue={profile.slotDurationMinutes} className="mt-2 w-full rounded-xl border border-line p-3 font-normal">
              <option value="45">45 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </label>
          <label className="sm:col-span-2 text-xs font-extrabold">
            Professional bio
            <textarea
              name="bio" defaultValue={profile.biography || ""}
              className="mt-2 w-full rounded-xl border border-line p-3 font-normal"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-extrabold">Working from<input name="start" type="time" defaultValue={profile.workingStartTime?.slice(0, 5)} className="mt-2 w-full rounded-xl border border-line p-3 font-normal" /></label>
          <label className="text-xs font-extrabold">Working until<input name="end" type="time" defaultValue={profile.workingEndTime?.slice(0, 5)} className="mt-2 w-full rounded-xl border border-line p-3 font-normal" /></label>
        </div>
        <button type="submit" disabled={saving}
          className="mt-6 rounded-xl bg-brand px-5 py-3 text-xs font-extrabold text-white"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        </form>
      </section>
    </div>
  );
}
function ConsultationPanel({
  appointment: a,
  close,
  notify,
}: {
  appointment: Appointment;
  close: () => void;
  notify: (s: string) => void;
}) {
  const { updateAppointment } = useApp();
  const [tab, setTab] = useState<"brief" | "notes">(
    a.status === "completed" ? "notes" : "brief",
  );
  const [notes, setNotes] = useState(a.notes || "");
  const [diagnosis, setDiagnosis] = useState(a.diagnosis || "");
  const [medicine, setMedicine] = useState(a.prescription?.[0].medicine || "");
  const [generating, setGenerating] = useState(false);
  function complete() {
    if (notes.length < 10) {
      notify("Add clinical notes before completing the visit");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      updateAppointment(a.id, {
        status: "completed",
        notes,
        diagnosis,
        prescription: [
          {
            medicine: medicine || "Paracetamol 500mg",
            dose: "1 tablet",
            frequency: "Twice daily, after food",
            duration: "3 days",
          },
        ],
        summary: `You were seen for ${a.complaint.toLowerCase()}. ${diagnosis ? `Your doctor diagnosed ${diagnosis}. ` : ""}Follow the medication schedule, rest well, and contact the clinic if your symptoms get worse. A follow-up is recommended in one week.`,
      });
      setGenerating(false);
      notify("Visit completed and patient summary sent");
      close();
    }, 900);
  }
  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-ink/35 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white p-5">
          <div>
            <p className="text-[10px] font-bold text-muted">
              {a.id} · {a.time}
            </p>
            <h2 className="mt-1 text-base font-extrabold">{a.patientName}</h2>
          </div>
          <button
            aria-label="Close consultation"
            onClick={close}
            className="grid size-9 place-items-center rounded-xl bg-canvas"
          >
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 border-b border-line px-2 sm:block sm:px-5">
          <button
            onClick={() => setTab("brief")}
            className={`border-b-2 px-2 py-4 text-xs font-extrabold sm:px-4 ${tab === "brief" ? "border-brand text-brand" : "border-transparent text-muted"}`}
          >
            Pre-visit brief
          </button>
          <button
            onClick={() => setTab("notes")}
            className={`border-b-2 px-2 py-4 text-xs font-extrabold sm:px-4 ${tab === "notes" ? "border-brand text-brand" : "border-transparent text-muted"}`}
          >
            Consultation & notes
          </button>
        </div>
        <div className="p-5 sm:p-7">
          {tab === "brief" ? (
            <>
              <div
                className={`rounded-xl p-4 ${a.urgency === "High" ? "bg-red-50" : "bg-amber-50"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex gap-2 text-xs font-extrabold">
                    <Sparkles size={16} />
                    Carely Assist brief
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${a.urgency === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {a.urgency} urgency
                  </span>
                </div>
                {a.urgency === "High" && (
                  <p className="mt-3 flex gap-2 text-[10px] font-bold text-red-700">
                    <CircleAlert size={14} />
                    Consider advising immediate emergency evaluation.
                  </p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                  Chief complaint
                </p>
                <p className="mt-2 text-sm font-bold leading-6">
                  {a.complaint}
                </p>
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                  Patient’s description
                </p>
                <p className="mt-2 rounded-xl bg-canvas p-4 text-xs leading-6 text-muted">
                  “{a.symptoms}”
                </p>
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                  Suggested questions
                </p>
                <div className="mt-3 space-y-2">
                  {a.questions.map((q, i) => (
                    <p
                      className="flex gap-3 rounded-xl border border-line p-3 text-xs font-bold"
                      key={q}
                    >
                      <span className="text-brand">0{i + 1}</span>
                      {q}
                    </p>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setTab("notes")}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-xs font-extrabold text-white"
              >
                Start consultation <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <label className="block text-xs font-extrabold">
                Clinical notes
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Examination findings, assessment and clinical plan…"
                  className="mt-2 w-full resize-none rounded-xl border border-line p-4 text-xs font-normal leading-6 outline-none focus:border-brand"
                />
              </label>
              <label className="mt-5 block text-xs font-extrabold">
                Diagnosis
                <input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Primary diagnosis"
                  className="mt-2 w-full rounded-xl border border-line p-3.5 text-xs font-normal outline-none focus:border-brand"
                />
              </label>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold">Prescription</p>
                  <button
                    onClick={() => {
                      setMedicine("");
                      notify("New medicine row ready");
                    }}
                    className="flex gap-1 text-[10px] font-extrabold text-brand"
                  >
                    <Plus size={13} />
                    Add medicine
                  </button>
                </div>
                <div className="mt-3 grid gap-3 rounded-xl bg-canvas p-4 sm:grid-cols-2">
                  <input
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                    placeholder="Medicine & strength"
                    className="rounded-lg border border-line p-3 text-xs sm:col-span-2"
                  />
                  <select className="rounded-lg border border-line p-3 text-xs">
                    <option>1 tablet</option>
                    <option>2 tablets</option>
                  </select>
                  <select className="rounded-lg border border-line p-3 text-xs">
                    <option>Twice daily, after food</option>
                    <option>Once daily</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3 rounded-xl bg-brand-soft p-4">
                <Sparkles size={18} className="shrink-0 text-brand" />
                <div>
                  <p className="text-xs font-extrabold">
                    Patient-friendly summary
                  </p>
                  <p className="mt-1 text-[10px] leading-5 text-muted">
                    Carely Assist will turn your notes into clear next steps and
                    a medication schedule. You can review it before sending.
                  </p>
                </div>
              </div>
              <button
                disabled={generating}
                onClick={complete}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-xs font-extrabold text-white disabled:opacity-60"
              >
                {generating
                  ? "Creating patient-friendly summary…"
                  : "Complete visit & send summary"}
                <CheckCircle2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

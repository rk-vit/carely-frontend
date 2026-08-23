"use client";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BellRing,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileClock,
  Gauge,
  LayoutDashboard,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell, NavItem } from "./dashboard-shell";
import { useApp } from "@/lib/app-context";
import { Doctor } from "@/lib/types";
import { DoctorAvatar, SectionTitle, StatCard, StatusBadge } from "./ui";
import { GmailLogo, GoogleCalendarLogo } from "./brand";
import { createDoctorRequest, DoctorApiResponse, getAdminDoctorRequest, getAdminLeaveRequestsRequest, LeaveRequestApi, reviewAdminLeaveRequest, updateAdminDoctorRequest } from "@/lib/api";
const nav: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "leave-requests", label: "Leave requests", icon: Calendar },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "patients", label: "Patients", icon: Users },
  { id: "notifications", label: "Notification logs", icon: BellRing, badge: 2 },
  { id: "integrations", label: "Integrations", icon: Settings2 },
];
const chart = [
  { d: "14 Aug", v: 36 },
  { d: "15 Aug", v: 42 },
  { d: "16 Aug", v: 31 },
  { d: "17 Aug", v: 54 },
  { d: "18 Aug", v: 48 },
  { d: "19 Aug", v: 61 },
  { d: "20 Aug", v: 58 },
];
export function AdminPortal() {
  const { updateDoctor } = useApp();
  const [active, setActive] = useState("overview");
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState<Doctor | null>(null);
  const [leave, setLeave] = useState<Doctor | null>(null);
  const [toast, setToast] = useState("");
  function notify(s: string) {
    setToast(s);
    setTimeout(() => setToast(""), 2600);
  }
  return (
    <DashboardShell
      role="admin"
      nav={nav}
      active={active}
      onNavigate={setActive}
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-2xl bg-ink px-5 py-4 text-xs font-bold text-white shadow-2xl">
          <CheckCircle2 size={18} className="text-[#71d5be]" />
          {toast}
        </div>
      )}
      {active === "overview" && (
        <AdminOverview onNav={setActive} notify={notify} />
      )}{" "}
      {active === "doctors" && (
        <DoctorsView
          add={() => setAdd(true)}
          edit={setEdit}
          leave={setLeave}
          notify={notify}
        />
      )}{" "}
      {active === "leave-requests" && <AdminLeaveRequests notify={notify} />}{" "}
      {active === "appointments" && <AdminAppointments notify={notify} />}{" "}
      {active === "patients" && <AdminPatients />}{" "}
      {active === "notifications" && <NotificationLogs notify={notify} />}{" "}
      {active === "integrations" && <Integrations notify={notify} />}{" "}
      {active === "settings" && <AdminSettings notify={notify} />}{" "}
      {add && (
        <AddDoctor
          close={() => setAdd(false)}
          done={() => {
            setAdd(false);
            notify("Doctor profile created");
          }}
        />
      )}
      {edit && <EditDoctor close={() => setEdit(null)} doctor={edit} done={(d) => { updateDoctor(d.id, { name: `Dr. ${d.firstName} ${d.lastName}`, specialty: d.specialization, credentials: d.medicalLicenseNumber, experience: d.yearsOfExperience, fee: d.consultationFee, about: d.biography || "" }); setEdit(null); notify("Doctor profile updated"); }} />}
      {leave && (
        <LeaveModal
          doctor={leave}
          close={() => setLeave(null)}
          done={() => {
            setLeave(null);
            notify("Leave confirmed and affected patients notified");
          }}
        />
      )}
    </DashboardShell>
  );
}
function Head({
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
          Clinic operations · Live
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
function AdminOverview({
  onNav,
  notify,
}: {
  onNav: (s: string) => void;
  notify: (s: string) => void;
}) {
  const { doctors } = useApp();
  return (
    <div>
      <Head
        title="Operations overview"
        copy="Everything happening across Carely Medical Centre today."
        action={
          <button
            onClick={() =>
              notify("Email, calendar, AI and reminder services are healthy")
            }
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[10px] font-bold"
          >
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            All systems operational
          </button>
        }
      />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Appointments today"
          value="58"
          detail="12 still upcoming"
          icon={CalendarCheck}
          tone="blue"
          trend="up"
        />
        <StatCard
          label="Active doctors"
          value={String(doctors.filter((d) => d.active && !d.onLeave).length)}
          detail={`of ${doctors.length} total doctors`}
          icon={Stethoscope}
        />
        <StatCard
          label="Patients this month"
          value="1,248"
          detail="84 new this week"
          icon={Users}
          tone="amber"
          trend="up"
        />
        <StatCard
          label="Delivery success"
          value="98.7%"
          detail="Email & calendar events"
          icon={Gauge}
          tone="rose"
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <section className="card p-5 sm:p-6">
          <SectionTitle
            title="Appointment activity"
            subtitle="Completed bookings over the last 7 days"
            action={
              <select className="rounded-lg border border-line px-3 py-2 text-[10px] font-bold">
                <option>Last 7 days</option>
              </select>
            }
          />
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="carelyArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#087f6c" stopOpacity={0.28} />
                    <stop offset="1" stopColor="#087f6c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#edf1f0" />
                <XAxis
                  dataKey="d"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#71817e" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#71817e" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5ecea",
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#087f6c"
                  strokeWidth={2.5}
                  fill="url(#carelyArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <aside className="card p-5 sm:p-6">
          <SectionTitle
            title="Appointment mix"
            subtitle="Today’s status distribution"
          />
          <div className="relative mt-3 h-42">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { n: "Completed", v: 32, c: "#087f6c" },
                    { n: "Upcoming", v: 18, c: "#599ee6" },
                    { n: "Cancelled", v: 5, c: "#e9b45a" },
                    { n: "No-show", v: 3, c: "#df7466" },
                  ]}
                  dataKey="v"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {["#087f6c", "#599ee6", "#e9b45a", "#df7466"].map((c) => (
                    <Cell key={c} fill={c} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-xl font-extrabold">58</p>
                <p className="text-[8px] text-muted">TOTAL</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Completed", "32", "bg-brand"],
              ["Upcoming", "18", "bg-blue-400"],
              ["Cancelled", "5", "bg-amber-400"],
              ["No-show", "3", "bg-red-400"],
            ].map((x) => (
              <p
                className="flex items-center gap-2 text-[9px] text-muted"
                key={x[0]}
              >
                <span className={`size-2 rounded-full ${x[2]}`} />
                {x[0]} <b className="ml-auto text-ink">{x[1]}</b>
              </p>
            ))}
          </div>
        </aside>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="card p-5">
          <SectionTitle
            title="Needs attention"
            subtitle="Operational issues requiring action"
          />
          <div className="mt-4 space-y-2">
            <AlertRow
              tone="amber"
              icon={Calendar}
              title="Leave conflict · Dr. Neha Kapoor"
              copy="4 appointments affected on 24 August"
              action="Review"
              onClick={() => onNav("doctors")}
            />
            <AlertRow
              tone="red"
              icon={Mail}
              title="2 email notifications failed"
              copy="Automatic retry scheduled in 4 minutes"
              action="View logs"
              onClick={() => onNav("notifications")}
            />
            <AlertRow
              tone="blue"
              icon={FileClock}
              title="3 visit summaries pending"
              copy="Older than the 24-hour target"
              action="View"
              onClick={() => onNav("appointments")}
            />
          </div>
        </section>
        <section className="card p-5">
          <SectionTitle
            title="Live clinic status"
            subtitle="Current patient flow"
          />
          <div className="mt-5 grid grid-cols-3 divide-x divide-line text-center">
            <div>
              <p className="text-xl font-extrabold text-blue-600">8</p>
              <p className="mt-1 text-[9px] text-muted">WAITING</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-amber-600">5</p>
              <p className="mt-1 text-[9px] text-muted">IN VISIT</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-brand">32</p>
              <p className="mt-1 text-[9px] text-muted">DONE</p>
            </div>
          </div>
          <button
            onClick={() => onNav("appointments")}
            className="mt-5 flex w-full items-center justify-between rounded-xl bg-canvas p-3 text-[10px] font-extrabold"
          >
            Open live queue <ChevronRight size={14} />
          </button>
        </section>
      </div>
    </div>
  );
}
function AlertRow({
  tone,
  icon: Icon,
  title,
  copy,
  action,
  onClick,
}: {
  tone: string;
  icon: typeof Calendar;
  title: string;
  copy: string;
  action: string;
  onClick: () => void;
}) {
  const c =
    tone === "red"
      ? "bg-red-50 text-red-600"
      : tone === "amber"
        ? "bg-amber-50 text-amber-600"
        : "bg-blue-50 text-blue-600";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <span className={`grid size-9 place-items-center rounded-xl ${c}`}>
        <Icon size={17} />
      </span>
      <div className="flex-1">
        <p className="text-[11px] font-extrabold">{title}</p>
        <p className="mt-1 text-[9px] text-muted">{copy}</p>
      </div>
      <button
        onClick={onClick}
        className="text-[9px] font-extrabold text-brand"
      >
        {action}
      </button>
    </div>
  );
}
function DoctorsView({
  add,
  edit,
  leave,
  notify,
}: {
  add: () => void;
  edit: (doctor: Doctor) => void;
  leave: (d: Doctor) => void;
  notify: (s: string) => void;
}) {
  const { doctors, updateDoctor } = useApp();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [doctorStatus, setDoctorStatus] = useState("all");
  const [menu, setMenu] = useState<string | null>(null);
  const shownDoctors = doctors.filter(
    (d) =>
      (specialty === "all" || d.specialty === specialty) &&
      (doctorStatus === "all" ||
        (doctorStatus === "active"
          ? d.active && !d.onLeave
          : doctorStatus === "leave"
            ? d.onLeave
            : !d.active)) &&
      `${d.name} ${d.specialty}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div>
      <Head
        title="Doctors"
        copy="Create profiles, manage schedules and coordinate time away."
        action={
          <button
            onClick={add}
            className="rounded-xl bg-brand px-4 py-3 text-xs font-extrabold text-white"
          >
            <Plus size={15} className="mr-2 inline" />
            Add doctor
          </button>
        }
      />
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row">
          <label className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors or specialty"
              className="w-full rounded-xl bg-canvas py-3 pl-10 text-xs outline-none"
            />
          </label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded-xl border border-line px-4 py-3 text-xs font-bold"
          >
            <option value="all">All specialties</option>
            {[...new Set(doctors.map((d) => d.specialty))].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={doctorStatus}
            onChange={(e) => setDoctorStatus(e.target.value)}
            className="rounded-xl border border-line px-4 py-3 text-xs font-bold"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="leave">On leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="divide-y divide-line sm:hidden">
          {shownDoctors.map((d) => (
            <div key={d.id} className="p-5">
              <div className="flex items-start gap-3">
                <DoctorAvatar doctor={d} />
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold">{d.name}</p>
                  <p className="mt-1 text-xs font-bold text-brand">
                    {d.specialty}
                  </p>
                  <p className="mt-1 text-[10px] text-muted">
                    {d.credentials} · ₹{d.fee} · 45 min slots
                  </p>
                </div>
                {d.onLeave ? (
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
                    Leave
                  </span>
                ) : (
                  <StatusBadge status={d.active ? "active" : "inactive"} />
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => edit(d)} className="flex-1 rounded-xl border border-line px-3 py-2.5 text-xs font-bold">Edit profile</button>
                <button
                  onClick={() => leave(d)}
                  className="flex-1 rounded-xl border border-line px-3 py-2.5 text-xs font-bold"
                >
                  Manage leave
                </button>
                <button
                  onClick={() => {
                    updateDoctor(d.id, { active: !d.active });
                    notify(
                      `${d.name} ${d.active ? "deactivated" : "activated"}`,
                    );
                  }}
                  className="flex-1 rounded-xl bg-brand-soft px-3 py-2.5 text-xs font-extrabold text-brand"
                >
                  {d.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[780px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/50 text-[9px] font-extrabold uppercase tracking-wider text-muted">
                <th className="px-5 py-3">Doctor</th>
                <th>Specialty</th>
                <th>Working hours</th>
                <th>Slot</th>
                <th>Status</th>
                <th className="pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shownDoctors.map((d) => (
                <tr key={d.id} className="text-xs">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <DoctorAvatar doctor={d} />
                      <div>
                        <p className="font-extrabold">{d.name}</p>
                        <p className="mt-1 text-[9px] text-muted">
                          {d.credentials} · ₹{d.fee}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="font-bold">{d.specialty}</p>
                  </td>
                  <td>
                    <p className="text-[10px] font-bold">Mon–Fri</p>
                    <p className="mt-1 text-[9px] text-muted">
                      09:00 AM – 05:00 PM
                    </p>
                  </td>
                  <td>
                    <span className="rounded-lg bg-canvas px-2 py-1 text-[9px] font-bold">
                      45 min
                    </span>
                  </td>
                  <td>
                    {d.onLeave ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-extrabold text-amber-700">
                        On leave
                      </span>
                    ) : (
                      <StatusBadge status={d.active ? "active" : "inactive"} />
                    )}
                  </td>
                  <td className="pr-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => leave(d)}
                        className="rounded-lg border border-line px-3 py-2 text-[9px] font-bold"
                      >
                        Manage leave
                      </button>
                      <div className="relative">
                        <button onClick={() => setMenu(menu === d.id ? null : d.id)} aria-label={`Actions for ${d.name}`} className="grid size-8 place-items-center rounded-lg border border-line">
                          <MoreHorizontal size={15} />
                        </button>
                        {menu === d.id && <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-line bg-white p-1 text-left shadow-xl">
                          <button onClick={() => { setMenu(null); edit(d); }} className="w-full rounded-lg px-3 py-2 text-xs font-bold hover:bg-canvas">Edit profile</button>
                          <button onClick={() => { updateDoctor(d.id, { active: !d.active }); setMenu(null); notify(`${d.name} ${d.active ? "deactivated" : "activated"}`); }} className="w-full rounded-lg px-3 py-2 text-xs font-bold hover:bg-canvas">{d.active ? "Deactivate" : "Activate"}</button>
                        </div>}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function AdminLeaveRequests({ notify }: { notify: (s: string) => void }) {
  const [requests, setRequests] = useState<LeaveRequestApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<LeaveRequestApi["status"] | "ALL">("PENDING");
  const [reviewing, setReviewing] = useState<string | null>(null);
  useEffect(() => { let cancelled = false; void getAdminLeaveRequestsRequest(filter === "ALL" ? undefined : filter).then((items) => { if (!cancelled) setRequests(items); }).catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Unable to load leave requests."); }).finally(() => { if (!cancelled) setLoading(false); }); return () => { cancelled = true; }; }, [filter]);
  async function review(id: string, decision: "approve" | "reject") { setReviewing(id); setLoading(true); try { await reviewAdminLeaveRequest(id, decision); const items = await getAdminLeaveRequestsRequest(filter === "ALL" ? undefined : filter); setRequests(items); notify(`Leave request ${decision}d`); } catch (e) { setError(e instanceof Error ? e.message : "Unable to review leave request."); } finally { setReviewing(null); setLoading(false); } }
  return <div><Head title="Leave requests" copy="Review doctor time-off requests before they affect the clinic schedule." action={<select value={filter} onChange={(e) => { setLoading(true); setError(""); setFilter(e.target.value as LeaveRequestApi["status"] | "ALL"); }} className="rounded-xl border border-line px-4 py-3 text-xs font-bold"><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="ALL">All requests</option></select>} />
    <section className="card overflow-hidden">{error && <p role="alert" className="m-5 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}{loading ? <p className="p-6 text-sm text-muted">Loading leave requests…</p> : requests.length === 0 ? <p className="p-6 text-sm text-muted">No {filter === "ALL" ? "leave" : filter.toLowerCase()} requests.</p> : <div className="divide-y divide-line">{requests.map((request) => <article key={request.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-extrabold">{request.doctorName}</p><p className="mt-1 text-xs text-brand">{request.startDate} → {request.endDate}</p><p className="mt-1 text-[10px] text-muted">{request.doctorEmail}</p></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${request.status === "PENDING" ? "bg-amber-50 text-amber-700" : request.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{request.status}</span></div><p className="mt-4 rounded-xl bg-canvas p-3 text-xs leading-5 text-muted">{request.reason}</p>{request.reviewerNote && <p className="mt-2 text-[10px] font-bold text-muted">Reviewer note: {request.reviewerNote}</p>}{request.status === "PENDING" && <div className="mt-4 flex justify-end gap-2"><button disabled={reviewing === request.id} onClick={() => review(request.id, "reject")} className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-extrabold text-red-700">Reject</button><button disabled={reviewing === request.id} onClick={() => review(request.id, "approve")} className="rounded-xl bg-brand px-4 py-2.5 text-xs font-extrabold text-white">{reviewing === request.id ? "Saving…" : "Approve"}</button></div>}</article>)}</div>}</section>
  </div>;
}
function AdminAppointments({ notify }: { notify: (s: string) => void }) {
  const { appointments, doctors, updateAppointment } = useApp();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const filteredAppointments = appointments.filter(
    (a) =>
      (status === "all" || a.status === status) &&
      (!date || a.date === date) &&
      `${a.id} ${a.patientName}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div>
      <Head
        title="Appointments"
        copy="Monitor visits, booking statuses and sync health across the clinic."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Today"
          value="58"
          detail="Across 6 doctors"
          icon={CalendarDays}
        />
        <StatCard
          label="Upcoming"
          value="18"
          detail="Next 24 hours"
          icon={Clock3}
          tone="blue"
        />
        <StatCard
          label="Completed"
          value="32"
          detail="55% of today"
          icon={CheckCircle2}
        />
        <StatCard
          label="Cancelled"
          value="5"
          detail="8.6% cancellation rate"
          icon={X}
          tone="rose"
        />
      </div>
      <div className="mt-5 card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row">
          <label className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl bg-canvas py-3 pl-9 text-xs"
              placeholder="Search appointment ID or patient"
            />
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-line px-4 text-xs font-bold"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-line px-4 text-xs font-bold"
          >
            <option value="all">All statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="divide-y divide-line">
          {filteredAppointments.map((a) => {
            const d = doctors.find((x) => x.id === a.doctorId)!;
            return (
              <div className="flex flex-wrap items-center gap-4 p-5" key={a.id}>
                <div className="w-18">
                  <p className="text-xs font-extrabold">{a.time}</p>
                  <p className="mt-1 text-[9px] text-muted">{a.id}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[10px] font-extrabold text-blue-600">
                  {a.patientName
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                </span>
                <div className="min-w-40 flex-1">
                  <p className="text-xs font-extrabold">{a.patientName}</p>
                  <p className="mt-1 text-[9px] text-muted">
                    with {d.name} · {a.type}
                  </p>
                </div>
                <StatusBadge status={a.status} />
                <div className="flex gap-2">
                  <span
                    title="Calendar status"
                    className={`grid size-8 place-items-center rounded-lg ${a.calendarSynced ? "bg-emerald-50" : "bg-red-50 grayscale"}`}
                  >
                    <GoogleCalendarLogo size={16} />
                  </span>
                  <span
                    title="Email status"
                    className={`grid size-8 place-items-center rounded-lg ${a.emailSent ? "bg-emerald-50" : "bg-red-50 grayscale"}`}
                  >
                    <GmailLogo size={16} />
                  </span>
                </div>
                <button
                  onClick={() => {
                    const next =
                      a.status === "upcoming" ? "completed" : "upcoming";
                    updateAppointment(a.id, { status: next });
                    notify(`${a.id} marked ${next}`);
                  }}
                  title="Toggle appointment status"
                  className="grid size-8 place-items-center rounded-lg border border-line"
                >
                  {a.status === "upcoming" ? (
                    <Check size={16} className="text-brand" />
                  ) : (
                    <RefreshCcw size={14} className="text-muted" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function AdminPatients() {
  return (
    <div>
      <Head
        title="Patients"
        copy="A privacy-conscious view of patients using your clinic."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total patients"
          value="1,248"
          detail="Across all care teams"
          icon={Users}
        />
        <StatCard
          label="New this month"
          value="84"
          detail="12% growth"
          icon={UserRound}
          tone="blue"
          trend="up"
        />
        <StatCard
          label="Returning"
          value="73%"
          detail="Last 90 days"
          icon={RefreshCcw}
          tone="amber"
        />
        <StatCard
          label="Care satisfaction"
          value="4.8"
          detail="From 892 responses"
          icon={Activity}
        />
      </div>
      <div className="mt-5 card p-6">
        <SectionTitle
          title="Patient growth"
          subtitle="New registrations over six months"
        />
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { m: "Mar", v: 48 },
                { m: "Apr", v: 58 },
                { m: "May", v: 51 },
                { m: "Jun", v: 72 },
                { m: "Jul", v: 78 },
                { m: "Aug", v: 84 },
              ]}
            >
              <CartesianGrid vertical={false} stroke="#edf1f0" />
              <XAxis
                dataKey="m"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9 }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
              <Tooltip />
              <Bar dataKey="v" fill="#087f6c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
function NotificationLogs({ notify }: { notify: (s: string) => void }) {
  const [failed, setFailed] = useState(2);
  const logs = [
    {
      type: "Booking confirmation",
      to: "Aarav Sharma",
      channel: "Email + Calendar",
      time: "10:42 AM",
      status: "Delivered",
    },
    {
      type: "Medication reminder",
      to: "Riya Nair",
      channel: "Email",
      time: "09:30 AM",
      status: "Delivered",
    },
    {
      type: "Appointment reminder",
      to: "Rohan Das",
      channel: "Email",
      time: "09:05 AM",
      status: failed ? "Failed" : "Delivered",
    },
    {
      type: "Calendar update",
      to: "Dr. Neha Kapoor",
      channel: "Google Calendar",
      time: "08:58 AM",
      status: failed ? "Failed" : "Delivered",
    },
  ];
  return (
    <div>
      <Head
        title="Notification logs"
        copy="Monitor reliable delivery across email, reminders and calendars."
        action={
          <button
            onClick={() => {
              setFailed(0);
              notify("Failed notifications retried successfully");
            }}
            disabled={!failed}
            className="rounded-xl bg-brand px-4 py-3 text-xs font-extrabold text-white disabled:opacity-40"
          >
            <RefreshCcw size={15} className="mr-2 inline" />
            Retry failed ({failed})
          </button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Sent today"
          value="284"
          detail="Email & calendar events"
          icon={Mail}
        />
        <StatCard
          label="Delivered"
          value={failed ? "280" : "282"}
          detail="98.7% success rate"
          icon={CheckCircle2}
          tone="blue"
        />
        <StatCard
          label="Failed"
          value={String(failed)}
          detail={failed ? "Queued for retry" : "All cleared"}
          icon={AlertTriangle}
          tone="rose"
        />
        <StatCard
          label="Avg. delivery"
          value="1.2s"
          detail="Within target"
          icon={Activity}
          tone="amber"
        />
      </div>
      <div className="mt-5 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line p-5">
          <p className="text-sm font-extrabold">Delivery activity</p>
          <span className="flex items-center gap-2 text-[9px] font-bold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500" />
            Worker healthy
          </span>
        </div>
        <div className="divide-y divide-line">
          {logs.map((l) => (
            <div
              className="flex flex-wrap items-center gap-4 p-5"
              key={l.type + l.to}
            >
              <span
                className={`grid size-10 place-items-center rounded-xl ${l.status === "Failed" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
              >
                {l.channel.includes("Calendar") ? (
                  <Calendar size={18} />
                ) : (
                  <Mail size={18} />
                )}
              </span>
              <div className="min-w-40 flex-1">
                <p className="text-xs font-extrabold">{l.type}</p>
                <p className="mt-1 text-[9px] text-muted">
                  To {l.to} · {l.channel}
                </p>
              </div>
              <p className="text-[9px] font-bold text-muted">{l.time}</p>
              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${l.status === "Failed" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
              >
                {l.status}
              </span>
              {l.status === "Failed" && (
                <button
                  onClick={() => {
                    setFailed(Math.max(0, failed - 1));
                    notify("Notification delivered on retry");
                  }}
                  className="text-[9px] font-extrabold text-brand"
                >
                  Retry
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-blue-50 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="shrink-0 text-blue-600" size={19} />
          <div>
            <p className="text-xs font-extrabold text-blue-900">
              Reliable by design
            </p>
            <p className="mt-1 text-[10px] leading-5 text-blue-700">
              Failed messages use exponential retry. Delivery issues never block
              appointment creation or patient care workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function Integrations({ notify }: { notify: (s: string) => void }) {
  const [calendar, setCalendar] = useState(true);
  const [mail, setMail] = useState(true);
  return (
    <div>
      <Head
        title="Integrations"
        copy="Connect the services that keep patients and doctors informed."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <IntegrationCard
          logo={<GoogleCalendarLogo size={35} />}
          name="Google Calendar"
          detail="Creates and updates events for patients and doctors through OAuth 2.0."
          enabled={calendar}
          toggle={() => {
            setCalendar(!calendar);
            notify(
              `Google Calendar ${calendar ? "disconnected" : "connected"}`,
            );
          }}
          stats="342 events synced this month"
          onLogs={() =>
            notify("Google Calendar sync log: 342 successful, 0 pending")
          }
        />
        <IntegrationCard
          logo={<GmailLogo size={35} />}
          name="Email notifications"
          detail="Booking confirmations, reminders, cancellations and care summaries."
          enabled={mail}
          toggle={() => {
            setMail(!mail);
            notify(`Email service ${mail ? "paused" : "connected"}`);
          }}
          stats="1,824 emails delivered this month"
          onLogs={() => notify("Email delivery log opened: 98.7% delivered")}
        />
        <IntegrationCard
          logo={
            <span className="grid size-9 place-items-center rounded-xl bg-[#efe9ff] text-lg font-extrabold text-[#6a49bd]">
              AI
            </span>
          }
          name="Carely Assist"
          detail="Pre-visit symptom briefs and patient-friendly post-visit summaries."
          enabled
          toggle={() => notify("Carely Assist health check passed")}
          stats="99.4% generation success"
          onLogs={() =>
            notify("Carely Assist log: last summary generated 4 minutes ago")
          }
        />
        <IntegrationCard
          logo={
            <span className="grid size-9 place-items-center rounded-xl bg-[#e7f8f3] text-brand">
              <BellRing size={20} />
            </span>
          }
          name="Reminder worker"
          detail="Background medication reminders and automatic delivery retries."
          enabled
          toggle={() => notify("Reminder worker is healthy")}
          stats="Next job in 2 minutes"
          onLogs={() => notify("Reminder worker log: queue is healthy")}
        />
      </div>
    </div>
  );
}
function IntegrationCard({
  logo,
  name,
  detail,
  enabled,
  toggle,
  stats,
  onLogs,
}: {
  logo: React.ReactNode;
  name: string;
  detail: string;
  enabled: boolean;
  toggle: () => void;
  stats: string;
  onLogs: () => void;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl bg-canvas">
          {logo}
        </span>
        <StatusBadge status={enabled ? "active" : "inactive"} />
      </div>
      <h2 className="mt-6 text-lg font-extrabold">{name}</h2>
      <p className="mt-2 min-h-12 text-xs leading-6 text-muted">{detail}</p>
      <div className="mt-5 rounded-xl bg-canvas p-3 text-[10px] font-bold text-muted">
        {stats}
      </div>
      <div className="mt-5 flex gap-2">
        <button
          onClick={toggle}
          className={`rounded-xl px-4 py-2.5 text-[10px] font-extrabold ${enabled ? "border border-line" : "bg-brand text-white"}`}
        >
          {enabled ? "Manage connection" : "Connect"}
        </button>
        <button
          onClick={onLogs}
          className="rounded-xl border border-line px-4 py-2.5 text-[10px] font-bold"
        >
          View logs
        </button>
      </div>
    </div>
  );
}
function AdminSettings({ notify }: { notify: (s: string) => void }) {
  return (
    <div>
      <Head
        title="Settings"
        copy="Configure clinic information and operational defaults."
      />
      <section className="card max-w-3xl p-6">
        <h2 className="text-lg font-extrabold">Clinic profile</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-extrabold">
            Clinic name
            <input
              defaultValue="Carely Medical Centre"
              className="mt-2 w-full rounded-xl border border-line p-3 font-normal"
            />
          </label>
          <label className="text-xs font-extrabold">
            Timezone
            <select className="mt-2 w-full rounded-xl border border-line p-3 font-normal">
              <option>Asia/Kolkata (IST)</option>
            </select>
          </label>
          <label className="text-xs font-extrabold">
            Default slot duration
            <select className="mt-2 w-full rounded-xl border border-line p-3 font-normal">
              <option>45 minutes</option>
            </select>
          </label>
          <label className="text-xs font-extrabold">
            Slot hold time
            <select className="mt-2 w-full rounded-xl border border-line p-3 font-normal">
              <option>5 minutes</option>
            </select>
          </label>
        </div>
        <button
          onClick={() => notify("Clinic settings saved")}
          className="mt-6 rounded-xl bg-brand px-5 py-3 text-xs font-extrabold text-white"
        >
          Save settings
        </button>
      </section>
    </div>
  );
}
function AddDoctor({ close, done }: { close: () => void; done: () => void }) {
  const { addDoctor } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [license, setLicense] = useState("");
  const [experience, setExperience] = useState("0");
  const [fee, setFee] = useState("600");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [slot, setSlot] = useState("30");
  const [biography, setBiography] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) { setError("Enter first and last name."); return; }
    setSaving(true);
    try {
      const d = await createDoctorRequest({ email: email.trim(), temporaryPassword: password, firstName: parts[0], lastName: parts.slice(1).join(" "), phoneNumber: phone.trim(), specialization: specialty, medicalLicenseNumber: license.trim(), yearsOfExperience: Number(experience), consultationFee: Number(fee), biography: biography.trim(), workingStartTime: start, workingEndTime: end, slotDurationMinutes: Number(slot) });
      addDoctor({ id: d.id, name: `Dr. ${d.firstName} ${d.lastName}`, specialty: d.specialization, credentials: d.medicalLicenseNumber, experience: d.yearsOfExperience, rating: 0, reviews: 0, fee: d.consultationFee, color: "#DCEFE9", initials: `${d.firstName[0]}${d.lastName[0]}`.toUpperCase(), about: d.biography || "", languages: ["English"], nextAvailable: "Schedule pending", active: d.active });
      done();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create doctor profile."); }
    finally { setSaving(false); }
  }
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={save}
        className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand">
              New care provider
            </p>
            <h2 className="mt-2 text-xl font-extrabold">
              Create doctor profile
            </h2>
          </div>
          <button
            aria-label="Close doctor form"
            type="button"
            onClick={close}
            className="grid size-9 place-items-center rounded-xl bg-canvas"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-extrabold sm:col-span-2">
            Full name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kavya Menon"
              className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal"
            />
          </label>
          <label className="text-xs font-extrabold">Login email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
          <label className="text-xs font-extrabold">Temporary password<input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
          <label className="text-xs font-extrabold">Phone number<input required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
          <label className="text-xs font-extrabold">Medical license<input required value={license} onChange={(e) => setLicense(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
          <label className="text-xs font-extrabold">
            Specialty
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal"
            >
              <option>General Medicine</option>
              <option>Cardiology</option>
              <option>Dermatology</option>
              <option>Pediatrics</option>
            </select>
          </label>
          <label className="text-xs font-extrabold">
            Consultation fee
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal"
            />
          </label>
          <label className="text-xs font-extrabold">
            Working from
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal"
            />
          </label>
          <label className="text-xs font-extrabold">
            Slot duration
            <select value={slot} onChange={(e) => setSlot(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal">
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
            </select>
          </label>
          <label className="text-xs font-extrabold">Working until<input required type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
          <label className="text-xs font-extrabold">Experience (years)<input type="number" min="0" value={experience} onChange={(e) => setExperience(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
          <label className="text-xs font-extrabold sm:col-span-2">Professional biography<textarea value={biography} onChange={(e) => setBiography(e.target.value)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
        </div>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-line px-5 py-3 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand px-5 py-3 text-xs font-extrabold text-white"
          >
            {saving ? "Creating…" : "Create profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
function EditDoctor({ doctor, close, done }: { doctor: Doctor; close: () => void; done: (doctor: DoctorApiResponse) => void }) {
  const [profile, setProfile] = useState<DoctorApiResponse | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { void getAdminDoctorRequest(doctor.id).then(setProfile).catch((e) => setError(e instanceof Error ? e.message : "Unable to load doctor profile.")); }, [doctor.id]);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!profile) return; setSaving(true); setError("");
    const form = new FormData(e.currentTarget);
    try { const updated = await updateAdminDoctorRequest(profile.id, { specialization: String(form.get("specialization")), medicalLicenseNumber: String(form.get("license")), yearsOfExperience: Number(form.get("experience")), consultationFee: Number(form.get("fee")), biography: String(form.get("biography")), workingStartTime: String(form.get("start")), workingEndTime: String(form.get("end")), slotDurationMinutes: Number(form.get("slot")) }); done(updated); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to update doctor profile."); }
    finally { setSaving(false); }
  }
  return <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"><form onSubmit={save} className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl">
    <div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-wider text-brand">Doctor management</p><h2 className="mt-2 text-xl font-extrabold">Edit doctor profile</h2></div><button aria-label="Close edit doctor form" type="button" onClick={close} className="grid size-9 place-items-center rounded-xl bg-canvas"><X size={18} /></button></div>
    {!profile && !error && <p className="mt-6 text-sm text-muted">Loading profile…</p>}
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
    {profile && <><p className="mt-5 rounded-xl bg-canvas p-3 text-xs text-muted">{profile.email} · {profile.firstName} {profile.lastName} · {profile.phoneNumber}</p><div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-extrabold">Specialization<input name="specialization" required defaultValue={profile.specialization} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
      <label className="text-xs font-extrabold">Medical license<input name="license" required defaultValue={profile.medicalLicenseNumber} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
      <label className="text-xs font-extrabold">Experience (years)<input name="experience" type="number" min="0" defaultValue={profile.yearsOfExperience} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
      <label className="text-xs font-extrabold">Consultation fee<input name="fee" type="number" min="0" step="0.01" defaultValue={profile.consultationFee} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
      <label className="text-xs font-extrabold">Working from<input name="start" type="time" defaultValue={profile.workingStartTime?.slice(0, 5)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
      <label className="text-xs font-extrabold">Working until<input name="end" type="time" defaultValue={profile.workingEndTime?.slice(0, 5)} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
      <label className="text-xs font-extrabold">Slot duration<select name="slot" defaultValue={profile.slotDurationMinutes} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal"><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label>
      <label className="text-xs font-extrabold sm:col-span-2">Biography<textarea name="biography" defaultValue={profile.biography || ""} className="mt-2 w-full rounded-xl border border-line p-3.5 font-normal" /></label>
    </div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={close} className="rounded-xl border border-line px-5 py-3 text-xs font-bold">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-brand px-5 py-3 text-xs font-extrabold text-white">{saving ? "Saving…" : "Save changes"}</button></div></>}
  </form></div>;
}
function LeaveModal({
  doctor,
  close,
  done,
}: {
  doctor: Doctor;
  close: () => void;
  done: () => void;
}) {
  const [requests, setRequests] = useState<LeaveRequestApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [reviewing, setReviewing] = useState<string | null>(null);
  useEffect(() => { void getAdminLeaveRequestsRequest().then((items) => setRequests(items.filter((item) => item.doctorId === doctor.id))).catch((e) => setError(e instanceof Error ? e.message : "Unable to load leave requests.")).finally(() => setLoading(false)); }, [doctor.id]);
  async function review(request: LeaveRequestApi, decision: "approve" | "reject") {
    setReviewing(request.id); setError("");
    try { const updated = await reviewAdminLeaveRequest(request.id, decision, note); setRequests((items) => items.map((item) => item.id === updated.id ? updated : item)); setNote(""); done(); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to review leave request."); }
    finally { setReviewing(null); }
  }
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
              Leave conflict detected
            </p>
            <h2 className="mt-2 text-xl font-extrabold">
              Confirm leave for {doctor.name}
            </h2>
          </div>
          <button aria-label="Close leave dialog" onClick={close}>
            <X size={18} />
          </button>
        </div>
        {loading && <p className="mt-5 text-sm text-muted">Loading leave requests…</p>}
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
        {!loading && !error && requests.length === 0 && <p className="mt-5 rounded-xl bg-canvas p-4 text-xs text-muted">No leave requests have been submitted for this doctor.</p>}
        {!loading && requests.map((request) => <div key={request.id} className="mt-5 rounded-xl border border-line p-4">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-extrabold">{request.startDate} → {request.endDate}</p><p className="mt-1 text-[10px] text-muted">Submitted {new Date(request.createdAt).toLocaleDateString()}</p></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${request.status === "PENDING" ? "bg-amber-50 text-amber-700" : request.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{request.status}</span></div>
          <p className="mt-3 text-xs leading-5 text-muted">{request.reason}</p>
          {request.status === "PENDING" && <><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional reviewer note" className="mt-4 w-full resize-none rounded-xl border border-line p-3 text-xs" /><div className="mt-3 flex justify-end gap-2"><button disabled={reviewing === request.id} onClick={() => review(request, "reject")} className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-extrabold text-red-700">Reject</button><button disabled={reviewing === request.id} onClick={() => review(request, "approve")} className="rounded-xl bg-brand px-4 py-2.5 text-xs font-extrabold text-white">{reviewing === request.id ? "Saving…" : "Approve"}</button></div></>}
        </div>)}
      </div>
    </div>
  );
}

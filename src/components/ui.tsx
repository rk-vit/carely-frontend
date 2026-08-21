import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";
import { AppointmentStatus, Doctor } from "@/lib/types";
export function DoctorAvatar({
  doctor,
  size = "md",
}: {
  doctor: Doctor;
  size?: "sm" | "md" | "lg";
}) {
  const s =
    size === "sm"
      ? "size-10 text-xs"
      : size === "lg"
        ? "size-20 text-xl"
        : "size-12 text-sm";
  return (
    <span
      style={{ background: doctor.color }}
      className={`grid shrink-0 place-items-center rounded-2xl font-extrabold text-ink ${s}`}
    >
      {doctor.initials}
    </span>
  );
}
export function StatusBadge({
  status,
}: {
  status: AppointmentStatus | "active" | "inactive" | "synced" | "failed";
}) {
  const map: Record<string, string> = {
    upcoming: "bg-blue-50 text-blue-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
    "in-progress": "bg-amber-50 text-amber-700",
    active: "bg-emerald-50 text-emerald-700",
    inactive: "bg-slate-100 text-slate-600",
    synced: "bg-emerald-50 text-emerald-700",
    failed: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold capitalize ${map[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "green",
  trend,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "green" | "blue" | "amber" | "rose";
  trend?: "up" | "down";
}) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <span
          className={`grid size-10 place-items-center rounded-xl ${colors[tone]}`}
        >
          <Icon size={19} />
        </span>
        {trend && (
          <span
            className={`flex items-center text-[10px] font-extrabold ${trend === "up" ? "text-emerald-600" : "text-rose-600"}`}
          >
            {trend === "up" ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}
            8.4%
          </span>
        )}
      </div>
      <p className="mt-5 text-2xl font-extrabold tracking-[-.03em]">{value}</p>
      <p className="mt-1 text-xs font-bold text-ink">{label}</p>
      <p className="mt-1 text-[10px] text-muted">{detail}</p>
    </div>
  );
}
export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-lg font-extrabold tracking-[-.02em]">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

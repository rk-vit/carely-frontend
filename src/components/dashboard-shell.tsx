"use client";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./brand";
import { useApp } from "@/lib/app-context";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
}
export function DashboardShell({
  role,
  nav,
  active,
  onNavigate,
  children,
}: {
  role: Role;
  nav: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
}) {
  const [mobile, setMobile] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { notices, markNoticesRead, logout } = useApp();
  const router = useRouter();
  const unread = notices.filter((n) => !n.read).length;
  const user =
    role === "patient"
      ? { name: "Aarav Sharma", detail: "Patient", initials: "AS" }
      : role === "doctor"
        ? { name: "Dr. Maya Patel", detail: "Cardiologist", initials: "MP" }
        : { name: "Anika Rao", detail: "Administrator", initials: "AR" };
  function go(id: string) {
    onNavigate(id);
    setMobile(false);
  }
  async function signout() {
    await logout();
    router.replace(`/${role}/login`);
  }
  return (
    <div className="min-h-screen bg-canvas">
      {mobile && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[255px] flex-col border-r border-line bg-white transition-transform lg:translate-x-0 ${mobile ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Logo />
          <button
            aria-label="Close navigation menu"
            className="lg:hidden"
            onClick={() => setMobile(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {nav.map(({ id, label, icon: Icon, badge }) => (
            <button
              onClick={() => go(id)}
              key={id}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold ${active === id ? "bg-brand-soft text-brand-dark" : "text-[#697874] hover:bg-canvas hover:text-ink"}`}
            >
              <Icon size={19} strokeWidth={active === id ? 2.4 : 1.9} />
              <span className="flex-1">{label}</span>
              {badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${active === id ? "bg-brand text-white" : "bg-[#edf1f0] text-muted"}`}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="m-3 space-y-1 border-t border-line pt-3">
          <button
            onClick={() => go("settings")}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-muted hover:bg-canvas"
          >
            <Settings size={19} />
            Settings
          </button>
          <button
            onClick={() => setHelpOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-muted hover:bg-canvas"
          >
            <HelpCircle size={19} />
            Help & support
          </button>
          <button
            onClick={signout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-[#b65e5e] hover:bg-red-50"
          >
            <LogOut size={19} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="lg:pl-[255px]">
        <header className="sticky top-0 z-30 flex h-18 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <button
            aria-label="Open navigation menu"
            className="grid size-10 place-items-center rounded-xl border border-line lg:hidden"
            onClick={() => setMobile(true)}
          >
            <Menu size={20} />
          </button>
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                role === "admin"
                  ? "Search doctors, patients, appointments…"
                  : "Search anything…"
              }
              className="w-full rounded-xl bg-canvas py-2.5 pl-10 pr-4 text-xs outline-none ring-brand/20 focus:ring-4"
            />
            {search && (
              <div className="absolute inset-x-0 top-12 z-50 rounded-xl border border-line bg-white p-2 shadow-xl">
                {nav
                  .filter((n) =>
                    n.label.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => {
                        go(id);
                        setSearch("");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold hover:bg-canvas"
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                {nav.every(
                  (n) => !n.label.toLowerCase().includes(search.toLowerCase()),
                ) && (
                  <p className="px-3 py-2 text-xs text-muted">
                    No matching section
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setHelpOpen(true)}
              className="hidden rounded-xl px-3 py-2 text-xs font-bold text-muted hover:bg-canvas sm:block"
            >
              Need help?
            </button>
            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => {
                  setShowNotices(!showNotices);
                  if (!showNotices) setTimeout(markNoticesRead, 1200);
                }}
                className="relative grid size-10 place-items-center rounded-xl border border-line bg-white text-muted hover:text-brand"
              >
                <Bell size={19} />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#e06655] ring-2 ring-white" />
                )}
              </button>
              {showNotices && (
                <div className="absolute right-0 top-13 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-line p-4">
                    <b className="text-sm">Notifications</b>
                    <span className="text-[10px] font-bold text-brand">
                      {unread} new
                    </span>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        className={`border-b border-line p-4 last:border-0 ${!n.read ? "bg-brand-soft/30" : ""}`}
                      >
                        <div className="flex gap-3">
                          <span
                            className={`mt-1 size-2 shrink-0 rounded-full ${n.type === "warning" ? "bg-amber-500" : n.type === "success" ? "bg-brand" : "bg-blue-500"}`}
                          />
                          <div>
                            <p className="text-xs font-extrabold">{n.title}</p>
                            <p className="mt-1 text-xs leading-5 text-muted">
                              {n.detail}
                            </p>
                            <p className="mt-1.5 text-[10px] text-muted">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="ml-1 flex items-center gap-2 border-l border-line pl-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[#d8eee8] text-xs font-extrabold text-brand-dark">
                {user.initials}
              </span>
              <div className="hidden xl:block">
                <p className="text-xs font-extrabold">{user.name}</p>
                <p className="mt-0.5 text-[10px] text-muted">{user.detail}</p>
              </div>
              <ChevronDown size={14} className="hidden text-muted xl:block" />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-8">
          {children}
        </main>
      </div>
      {helpOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold">How can we help?</h2>
              <button
                aria-label="Close support dialog"
                onClick={() => setHelpOpen(false)}
                className="grid size-9 place-items-center rounded-xl bg-canvas"
              >
                <X size={17} />
              </button>
            </div>
            <p className="mt-3 text-xs leading-6 text-muted">
              Carely support is available Monday–Saturday, 8:00 AM–8:00 PM.
            </p>
            <div className="mt-5 grid gap-3">
              <a
                href="mailto:support@carely.demo"
                className="rounded-xl bg-brand px-4 py-3 text-center text-xs font-extrabold text-white"
              >
                Email support
              </a>
              <a
                href="tel:+9118001232273"
                className="rounded-xl border border-line px-4 py-3 text-center text-xs font-bold"
              >
                Call 1800 123 CARE
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

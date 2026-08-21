"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  PlugZap,
  Server,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Logo } from "@/components/brand";

type ConnectionResult = {
  ok: boolean;
  message: string;
  status?: number;
  durationMs?: number;
};

export default function ConnectionCheckPage() {
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConnectionResult | null>(null);

  async function checkConnection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setResult({
        ok: false,
        message: "Enter both the username and password before sending.",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/connection-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as ConnectionResult;
      setResult(data);
    } catch {
      setResult({
        ok: false,
        message: "The request could not be sent. Check the frontend server.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />
      <div className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-muted hover:bg-white hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </header>

        <section className="mt-10 overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_24px_70px_rgba(15,70,61,.11)] sm:mt-16">
          <div className="border-b border-line bg-[#0d4c43] px-5 py-7 text-white sm:px-8 sm:py-9">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#8be2cc]">
                <PlugZap size={24} />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#8be2cc]">
                  Backend diagnostic
                </p>
                <h1 className="mt-2 font-display text-3xl tracking-[-.035em] sm:text-4xl">
                  Connection check
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                  Verify that the Carely frontend can securely reach the local API.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-canvas p-4 sm:flex-row sm:items-center">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Server size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-muted">Request</p>
                <p className="mt-0.5 break-all font-mono text-sm font-extrabold text-ink">
                  GET localhost:8080/fe-connection-check
                </p>
              </div>
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700">
                Basic Auth
              </span>
            </div>

            <form onSubmit={checkConnection} className="mt-7 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">Username</span>
                <input
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="user"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">Password</span>
                <span className="relative block">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-line bg-white py-3.5 pl-11 pr-12 text-base outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                    placeholder="Enter the generated backend password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand/20 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <PlugZap size={18} />
                )}
                {loading ? "Checking connection…" : "Send GET request"}
              </button>
            </form>

            <div aria-live="polite" className="mt-5 min-h-20">
              {result && (
                <div
                  className={`rounded-2xl border p-4 ${
                    result.ok
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-red-200 bg-red-50 text-red-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.ok ? (
                      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
                    ) : (
                      <TriangleAlert className="mt-0.5 shrink-0 text-red-600" size={20} />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-extrabold">
                          {result.ok ? "Connection successful" : "Connection failed"}
                        </p>
                        {result.status && (
                          <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-extrabold">
                            {result.status} {result.status === 200 ? "OK" : ""}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 break-words text-sm leading-6">{result.message}</p>
                      {result.durationMs !== undefined && (
                        <p className="mt-1 text-xs opacity-70">Completed in {result.durationMs} ms</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand" />
              Credentials are used only for this check and are not stored by the frontend.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

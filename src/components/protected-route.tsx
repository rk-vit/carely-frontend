"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { useApp } from "@/lib/app-context";

export function ProtectedRoute({ role, children }: { role: Role; children: React.ReactNode }) {
  const router = useRouter();
  const { authStatus, role: signedInRole } = useApp();

  useEffect(() => {
    if (authStatus === "unauthenticated") router.replace(`/${role}/login`);
    if (authStatus === "authenticated" && signedInRole !== role) {
      router.replace(`/${signedInRole}/login`);
    }
  }, [authStatus, role, router, signedInRole]);

  if (authStatus !== "authenticated" || signedInRole !== role) {
    return <main className="grid min-h-screen place-items-center bg-canvas p-6 text-sm text-muted">Checking your Carely session…</main>;
  }
  return <>{children}</>;
}

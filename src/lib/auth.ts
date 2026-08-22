import { apiUrl } from "./api";
import { Role } from "./types";

export type LoginResponse = { email: string; role: string };

export async function loginRequest(email: string, password: string) {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Invalid email or password.");
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || body?.message || "Unable to sign in.");
  }

  return (await response.json()) as LoginResponse;
}

export async function checkSession() {
  const response = await fetch(apiUrl("/fe-connection-check"), {
    credentials: "include",
    cache: "no-store",
  });
  return response.ok;
}

export async function logoutRequest() {
  const response = await fetch(apiUrl("/auth/logout"), {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok && response.status !== 401) {
    throw new Error("Unable to sign out.");
  }
}

export function backendRoleToFrontendRole(role: string): Role | null {
  const normalized = role.toLowerCase();
  return normalized === "patient" || normalized === "doctor" || normalized === "admin"
    ? normalized
    : null;
}

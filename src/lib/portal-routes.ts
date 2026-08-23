import { Role } from "./types";

export const portalSections = {
  patient: ["overview", "doctors", "appointments", "records", "medications", "settings"],
  doctor: ["overview", "schedule", "slots", "patients", "summaries", "availability", "settings"],
  admin: ["overview", "doctors", "leave-requests", "appointments", "patients", "notifications", "integrations", "settings"],
} as const satisfies Record<Role, readonly string[]>;

export type PortalSection = (typeof portalSections)[Role][number];

export function isPortalSection(role: Role, value: string): value is PortalSection {
  return (portalSections[role] as readonly string[]).includes(value);
}

export function portalPath(role: Role, section: string) {
  return section === "overview" ? `/${role}` : `/${role}/${section}`;
}

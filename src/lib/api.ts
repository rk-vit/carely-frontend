const CARELY_BACKEND_URL = (
  process.env.CARELY_API_BASE_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

export const apiUrl = (path: string) =>
  `${CARELY_BACKEND_URL}/${path.replace(/^\//, "")}`;

export interface CreateDoctorRequest {
  email: string; temporaryPassword: string; firstName: string; lastName: string;
  phoneNumber: string; specialization: string; medicalLicenseNumber: string;
  yearsOfExperience: number; consultationFee: number; biography: string;
  workingStartTime: string; workingEndTime: string; slotDurationMinutes: number;
}
export interface DoctorApiResponse {
  id: string; userId: string; email: string; firstName: string; lastName: string;
  phoneNumber: string; specialization: string; medicalLicenseNumber: string;
  yearsOfExperience: number; consultationFee: number; biography: string | null;
  workingStartTime: string | null; workingEndTime: string | null;
  slotDurationMinutes: number; active: boolean;
}
export interface DoctorDirectoryApiResponse {
  id: string; firstName: string; lastName: string; specialization: string;
  yearsOfExperience: number; consultationFee: number; biography: string | null;
  workingStartTime: string | null; workingEndTime: string | null;
  slotDurationMinutes: number; active: boolean;
}
export async function createDoctorRequest(payload: CreateDoctorRequest) {
  const response = await fetch(apiUrl("/admin/doctors"), { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to create doctor profile.");
  return body as DoctorApiResponse;
}
export async function getAdminDoctorRequest(id: string) {
  const response = await fetch(apiUrl(`/admin/doctors/${id}`), { credentials: "include", cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to load doctor profile.");
  return body as DoctorApiResponse;
}
export async function getDoctorsRequest() {
  const response = await fetch(apiUrl("/doctors"), { credentials: "include", cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to load doctors.");
  return body as DoctorDirectoryApiResponse[];
}
export async function updateAdminDoctorRequest(id: string, payload: Record<string, unknown>) {
  const response = await fetch(apiUrl(`/admin/doctors/${id}`), { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to update doctor profile.");
  return body as DoctorApiResponse;
}
export type DoctorProfile = DoctorApiResponse;
export async function getDoctorProfileRequest() {
  const response = await fetch(apiUrl("/doctor/profile"), { credentials: "include", cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to load doctor profile.");
  return body as DoctorProfile;
}
export async function updateDoctorProfileRequest(payload: Record<string, unknown>) {
  const response = await fetch(apiUrl("/doctor/profile"), { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to save doctor profile.");
  return body as DoctorProfile;
}

export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
export type AvailabilityOverrideType = "BLOCKED" | "EXTRA";

export interface AvailabilityApi {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface AvailabilityOverrideApi {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: AvailabilityOverrideType;
  reason: string | null;
}

export interface SlotApi {
  startAt: string;
  endAt: string;
  status: "AVAILABLE" | "BLOCKED" | "BOOKED";
}

async function readApiError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return body?.detail || body?.message || fallback;
}

export async function getDoctorAvailabilityRequest() {
  const response = await fetch(apiUrl("/doctor/availability"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(await readApiError(response, "Unable to load your availability."));
  return (await response.json()) as AvailabilityApi[];
}

export async function saveDoctorAvailabilityRequest(day: DayOfWeek, payload: { startTime: string; endTime: string; timezone: string }) {
  const response = await fetch(apiUrl(`/doctor/availability/${day}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await readApiError(response, "Unable to save availability."));
  return (await response.json()) as AvailabilityApi;
}

export async function deleteDoctorAvailabilityRequest(day: DayOfWeek) {
  const response = await fetch(apiUrl(`/doctor/availability/${day}`), { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error(await readApiError(response, "Unable to remove availability."));
}

export async function getDoctorAvailabilityOverridesRequest(date?: string) {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  const response = await fetch(apiUrl(`/doctor/availability-overrides${query}`), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(await readApiError(response, "Unable to load availability overrides."));
  return (await response.json()) as AvailabilityOverrideApi[];
}

export async function createDoctorAvailabilityOverrideRequest(payload: {
  date: string;
  startTime: string;
  endTime: string;
  type: AvailabilityOverrideType;
  reason?: string;
}) {
  const response = await fetch(apiUrl("/doctor/availability-overrides"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await readApiError(response, "Unable to create availability override."));
  return (await response.json()) as AvailabilityOverrideApi;
}

export async function deleteDoctorAvailabilityOverrideRequest(id: string) {
  const response = await fetch(apiUrl(`/doctor/availability-overrides/${id}`), { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error(await readApiError(response, "Unable to delete availability override."));
}

export async function getDoctorSlotsRequest(doctorId: string, date: string) {
  const response = await fetch(apiUrl(`/doctors/${doctorId}/slots?date=${encodeURIComponent(date)}`), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(await readApiError(response, "Unable to load slots."));
  return (await response.json()) as SlotApi[];
}

export interface AppointmentApi {
  id: string;
  doctorId: string;
  patientId: string;
  startAt: string;
  endAt: string;
  status: "HELD" | "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  symptoms: string;
  holdExpiresAt: string | null;
  patientName?: string;
  patientEmail?: string | null;
}

export async function createAppointmentHoldRequest(payload: {
  doctorId: string;
  startAt: string;
  endAt: string;
  symptoms: string;
}) {
  const response = await fetch(apiUrl("/appointments/holds"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(await readApiError(response, "That slot is no longer available."));
  return (await response.json()) as AppointmentApi;
}

export async function confirmAppointmentRequest(id: string) {
  const response = await fetch(apiUrl(`/appointments/${id}/confirm`), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) throw new Error(await readApiError(response, "Your appointment hold expired. Please choose the slot again."));
  return (await response.json()) as AppointmentApi;
}

export async function getMyAppointmentsRequest() {
  const response = await fetch(apiUrl("/appointments/mine"), { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error(await readApiError(response, "Unable to load your appointments."));
  return (await response.json()) as AppointmentApi[];
}

export async function getDoctorAppointmentsRequest() {
  const response = await fetch(apiUrl("/appointments/doctor"), {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, "Unable to load your appointments."));
  }
  return (await response.json()) as AppointmentApi[];
}

export interface LeaveRequestApi {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewerNote: string | null;
  createdAt: string;
}

export async function createLeaveRequestRequest(payload: { startDate: string; endDate: string; reason: string }) {
  const response = await fetch(apiUrl("/doctor/leave-requests"), { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to submit leave request.");
  return body as LeaveRequestApi;
}

export async function getDoctorLeaveRequestsRequest() {
  const response = await fetch(apiUrl("/doctor/leave-requests"), { credentials: "include", cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to load leave requests.");
  return body as LeaveRequestApi[];
}

export async function getAdminLeaveRequestsRequest(status?: LeaveRequestApi["status"]) {
  const response = await fetch(apiUrl(`/admin/leave-requests${status ? `?status=${status}` : ""}`), { credentials: "include", cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to load leave requests.");
  return body as LeaveRequestApi[];
}

export async function reviewAdminLeaveRequest(id: string, decision: "approve" | "reject", reviewerNote?: string) {
  const response = await fetch(apiUrl(`/admin/leave-requests/${id}/${decision}`), { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ reviewerNote: reviewerNote || null }) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.detail || body?.message || "Unable to review leave request.");
  return body as LeaveRequestApi;
}

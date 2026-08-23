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

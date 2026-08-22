import { DoctorPortal } from "@/components/doctor-portal";
import { ProtectedRoute } from "@/components/protected-route";
export default function Page() {
  return <ProtectedRoute role="doctor"><DoctorPortal /></ProtectedRoute>;
}

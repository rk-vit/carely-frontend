import { PatientPortal } from "@/components/patient-portal";
import { ProtectedRoute } from "@/components/protected-route";
export default function Page() {
  return <ProtectedRoute role="patient"><PatientPortal /></ProtectedRoute>;
}

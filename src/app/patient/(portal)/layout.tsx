import { ProtectedRoute } from "@/components/protected-route";

export default function PatientPortalLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="patient">{children}</ProtectedRoute>;
}

import { ProtectedRoute } from "@/components/protected-route";

export default function DoctorPortalLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="doctor">{children}</ProtectedRoute>;
}

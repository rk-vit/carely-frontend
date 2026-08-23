import { ProtectedRoute } from "@/components/protected-route";

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="admin">{children}</ProtectedRoute>;
}

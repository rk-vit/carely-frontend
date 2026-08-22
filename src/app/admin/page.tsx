import { AdminPortal } from "@/components/admin-portal";
import { ProtectedRoute } from "@/components/protected-route";
export default function Page() {
  return <ProtectedRoute role="admin"><AdminPortal /></ProtectedRoute>;
}

import { notFound } from "next/navigation";
import { AdminPortal } from "@/components/admin-portal";
import { isPortalSection } from "@/lib/portal-routes";

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isPortalSection("admin", section) || section === "overview") notFound();
  return <AdminPortal section={section} />;
}

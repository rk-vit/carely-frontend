import { notFound } from "next/navigation";
import { DoctorPortal } from "@/components/doctor-portal";
import { isPortalSection } from "@/lib/portal-routes";

export default async function DoctorSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isPortalSection("doctor", section) || section === "overview") notFound();
  return <DoctorPortal section={section} />;
}

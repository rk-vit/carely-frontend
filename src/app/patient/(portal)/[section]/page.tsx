import { notFound } from "next/navigation";
import { PatientPortal } from "@/components/patient-portal";
import { isPortalSection } from "@/lib/portal-routes";

export default async function PatientSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isPortalSection("patient", section) || section === "overview") notFound();
  return <PatientPortal section={section} />;
}

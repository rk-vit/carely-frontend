import { DoctorConsultationWorkspace } from "@/components/doctor-consultation-workspace";

export default async function DoctorConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DoctorConsultationWorkspace appointmentId={id} />;
}

import { DoctorPatientProfilePage } from "@/components/doctor-patient-profile-page";

export default async function DoctorPatientProfileRoute({ params }: { params: Promise<{ appointmentId: string }> }) {
  const { appointmentId } = await params;
  return <DoctorPatientProfilePage appointmentId={appointmentId} />;
}

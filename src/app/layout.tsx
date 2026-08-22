import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/app-context";

export const metadata: Metadata = {
  title: {
    default: "Carely — Healthcare, thoughtfully connected",
    template: "%s · Carely",
  },
  description:
    "Appointments, care plans, prescriptions and follow-ups in one calm, connected healthcare workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

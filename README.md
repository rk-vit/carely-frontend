# Carely · Healthcare Appointment Manager

Carely is a responsive Next.js SaaS frontend for connected healthcare appointments. It includes dedicated patient, doctor, and clinic admin portals with a shared mock data layer so workflows can be explored end-to-end without a backend.

## Run locally

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000). The exact same UI can be built for deployment with `pnpm build` and started with `pnpm start`.

## Demo portals

All credentials are pre-filled on the role login screens. Any valid email and a password with at least six characters will work.

- Patient: `/patient/login` → Aarav Sharma
- Doctor: `/doctor/login` → Dr. Maya Patel
- Admin: `/admin/login` → Anika Rao

## Included workflows

- Patient discovery, specialty filters, in-person availability, multi-step booking, symptom intake, urgency brief, slot hold, cancellation and rescheduling
- Shared appointment state visible to patient, doctor and admin portals
- Doctor day view, calendar, pre-visit brief, high-urgency flags, clinical notes, prescriptions, AI-style patient summary, and availability/leave request
- Admin analytics, doctor CRUD, leave conflict review, appointment operations, patient metrics, notification delivery logs and retry, and integrations
- Google Calendar and Gmail brand treatments with simulated sync and delivery states
- Local storage persistence for appointments, doctor changes, notifications, integrations, and sessions
- Responsive mobile navigation, loading/empty/error/toast states, accessible form controls, and keyboard-friendly dialogs

## Technical notes

- Next.js App Router + TypeScript
- Tailwind CSS v4 with a shared Carely design token layer
- Recharts for operations analytics
- Lucide React for interface iconography
- `src/lib/app-context.tsx` is the replacement point for real authentication/API calls. It currently persists mock data under `carely-demo-v1` in browser storage.

Real production integrations would replace the mock service layer with role-based auth, a transactional appointment/slot table, an LLM provider, a background reminder worker, an email provider, and Google Calendar OAuth 2.0.

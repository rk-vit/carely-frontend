import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 font-extrabold tracking-[-.03em] text-ink"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-white shadow-[0_6px_18px_rgba(8,127,108,.22)]">
        <HeartPulse size={20} />
      </span>
      {!compact && (
        <span className="text-xl">
          carely<span className="text-brand">.</span>
        </span>
      )}
    </Link>
  );
}

export function GoogleCalendarLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label="Google Calendar"
    >
      <path
        fill="#4285F4"
        d="M21 8.5V19a2 2 0 0 1-2 2H8.5l-1-4 1-4-1-4 4-1 4 1 4-1z"
      />
      <path fill="#34A853" d="M8.5 21H5a2 2 0 0 1-2-2V8.5l3-1.5 2.5 1.5z" />
      <path fill="#FBBC04" d="M3 8.5V5a2 2 0 0 1 2-2h3.5L10 5.5 8.5 8z" />
      <path fill="#EA4335" d="M8.5 3H19a2 2 0 0 1 2 2v3.5H8.5z" />
      <path
        fill="#fff"
        d="M9.2 17.3a3.2 3.2 0 0 1-1.1-.8l.9-1.1c.5.5 1.1.8 1.8.8.8 0 1.3-.4 1.3-1s-.5-.9-1.4-.9h-.8V13h.8c.7 0 1.2-.3 1.2-.8s-.4-.8-1.1-.8c-.6 0-1 .2-1.5.6l-.8-1.1c.7-.6 1.5-.9 2.5-.9 1.5 0 2.6.8 2.6 2 0 .8-.5 1.4-1.2 1.7.9.3 1.5.9 1.5 1.8 0 1.4-1.3 2.3-3 2.3-.6 0-1.2-.2-1.7-.5zm6.1-5.7-1.3.9-.7-1.2 2.4-1.6h1.4v7.9h-1.8z"
      />
    </svg>
  );
}

export function GmailLogo({ size = 23 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Gmail">
      <path fill="#4285F4" d="M3 19.5h3V9.2L3 7z" />
      <path fill="#34A853" d="M18 19.5h3V7l-3 2.2z" />
      <path
        fill="#EA4335"
        d="M3 7v-.8c0-1.7 2-2.7 3.3-1.7L12 8.7l5.7-4.2C19 3.5 21 4.5 21 6.2V7l-9 6.7z"
      />
      <path fill="#FBBC04" d="M6 19.5H3V7l3 2.2z" />
      <path fill="#C5221F" d="M18 19.5h3V7l-3 2.2z" />
      <path fill="#fff" d="M6 9.2v10.3h12V9.2l-6 4.5z" />
    </svg>
  );
}

"use client";

import { useConsentStore } from "@/lib/consent/consent";

export function CookiePreferencesLink({ className }: { className?: string }) {
  const openPanel = useConsentStore((s) => s.openPanel);
  return (
    <button type="button" onClick={openPanel} className={className}>
      Preferências de cookies
    </button>
  );
}

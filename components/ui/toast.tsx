"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/ui/ui-store";

export function Toast() {
  const message = useUIStore((s) => s.toastMessage);
  const hideToast = useUIStore((s) => s.hideToast);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hideToast, 1800);
    return () => clearTimeout(timer);
  }, [message, hideToast]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-pill bg-verde-escuro px-6 py-3 text-sm font-semibold text-creme shadow-lg">
      <span className="text-dourado">✓</span> {message}
    </div>
  );
}

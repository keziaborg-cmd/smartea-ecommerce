"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart/cart-store";
import { Toast } from "@/components/ui/toast";
import { ContactModal } from "@/components/ui/contact-modal";

// Cart persistence uses skipHydration (see lib/cart/cart-store.ts) so the
// server-rendered markup never disagrees with what's actually in
// localStorage — rehydrate explicitly once we're on the client.
export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      {children}
      <Toast />
      <ContactModal />
    </>
  );
}

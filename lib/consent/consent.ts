"use client";

import { create } from "zustand";

// Trocar a versão faz o banner aparecer de novo pra todo mundo (ex.: mudou o texto ou entrou uma
// categoria nova de cookie).
export const COOKIE_CONSENT_VERSION = "cookies-2026-10-07";
const STORAGE_KEY = "smartea-consent";

export interface ConsentChoice {
  analytics: boolean;
  marketing: boolean;
  version: string;
  decidedAt: string;
}

interface ConsentState {
  choice: ConsentChoice | null;
  loaded: boolean;
  panelOpen: boolean;
  load: () => void;
  decide: (c: { analytics: boolean; marketing: boolean }) => void;
  openPanel: () => void;
  closePanel: () => void;
}

function readStored(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoice;
    return parsed?.version === COOKIE_CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export const useConsentStore = create<ConsentState>()((set, get) => ({
  choice: null,
  loaded: false,
  panelOpen: false,
  load: () => {
    if (get().loaded) return;
    set({ choice: readStored(), loaded: true });
  },
  decide: ({ analytics, marketing }) => {
    const choice: ConsentChoice = { analytics, marketing, version: COOKIE_CONSENT_VERSION, decidedAt: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    } catch {
      // navegador sem storage (aba anônima restrita): vale só pra esta página
    }
    set({ choice, panelOpen: false });
  },
  openPanel: () => set({ panelOpen: true }),
  closePanel: () => set({ panelOpen: false }),
}));

export function hasAnalyticsConsent(): boolean {
  return useConsentStore.getState().choice?.analytics === true;
}

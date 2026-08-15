import { create } from "zustand";

interface UIState {
  toastMessage: string | null;
  menuOpen: boolean;
  contactOpen: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;
  setMenuOpen: (open: boolean) => void;
  setContactOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toastMessage: null,
  menuOpen: false,
  contactOpen: false,
  showToast: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: null }),
  setMenuOpen: (open) => set({ menuOpen: open }),
  setContactOpen: (open) => set({ contactOpen: open }),
}));

import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface GamificationState {
  liveBadge: string | null;
  levelUp: string | null;
  toast: { type: ToastType; message: string } | null;
  showBadge: (badge: string) => void;
  clearBadge: () => void;
  showLevelUp: (level: string) => void;
  clearLevelUp: () => void;
  showToast: (message: string, type?: ToastType) => void;
  clearToast: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  liveBadge: null,
  levelUp: null,
  toast: null,
  showBadge: (badge) => set({ liveBadge: badge }),
  clearBadge: () => set({ liveBadge: null }),
  showLevelUp: (level) => set({ levelUp: level }),
  clearLevelUp: () => set({ levelUp: null }),
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));

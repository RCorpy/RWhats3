// src/stores/uiStore.ts
import { create } from 'zustand';

interface UIStore {
  isSidebarOpen: boolean;
  isSettingsModalOpen: boolean;
  isDarkMode: boolean;

  toggleSidebar: () => void;
  toggleSettingsModal: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isSidebarOpen: false,
  isSettingsModalOpen: false,
  isDarkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches || false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleSettingsModal: () =>
    set((state) => ({ isSettingsModalOpen: !state.isSettingsModalOpen })),

  setDarkMode: (value) => set({ isDarkMode: value }),
}));

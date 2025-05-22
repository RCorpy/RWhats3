// src/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
}

interface UserStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user: { ...user, isLoggedIn: true } }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // nombre en localStorage
    }
  )
);

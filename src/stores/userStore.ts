// src/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'admin' | 'agent' | 'bot';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
  businessName?: string;
  accessToken?: string;
  waId?: string; // WhatsApp ID from Meta
  userType?: UserType;
  isLoggedIn: boolean;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  login: (user: Omit<User, 'isLoggedIn'>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: (user) => {
        set({ user: { ...user, isLoggedIn: true }, isLoading: false });
      },

      logout: () => {
        set({ user: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      updateUser: (data) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...data } });
      },
    }),
    {
      name: 'user-storage', // saved in localStorage (or IndexedDB on mobile)
    }
  )
);

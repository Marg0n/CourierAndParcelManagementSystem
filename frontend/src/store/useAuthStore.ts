// store/useAuthStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: string;
  lastLogin?: string;
  lastLoginIP?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (userData: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  login: ({ user, accessToken, refreshToken }) => set({ user, accessToken, refreshToken }),
  logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}));
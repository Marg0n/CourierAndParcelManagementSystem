// store/useAuthStore.ts
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Customer" | "Delivery Agent";
  lastLogin?: Date;
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

//* Without using persist
// export const useAuthStore = create<AuthState>(
//     (set) => ({
//         user: null,
//         accessToken: null,
//         refreshToken: null,
//         login: ({ user, accessToken, refreshToken }) =>
//             set({ user, accessToken, refreshToken }),
//         logout: () => set({ user: null, accessToken: null, refreshToken: null }),
//     })
// );

//* Using persist
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
        (set)  => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            login: ({ user, accessToken, refreshToken }) =>
                set({ user, accessToken, refreshToken }),
            logout: () => {
              set({ user: null, accessToken: null, refreshToken: null });

              // Remove persisted storage key completely
              useAuthStore.persist.clearStorage();
            },
        }),
        {
            name: "auth-storage", //? storage key
            storage: createJSONStorage(() => localStorage), //? Default
        }
    )
  )
);

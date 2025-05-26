import { create } from "zustand";
import { User } from "../types/User.ts";
import { forget_password, login, register } from "@/services/auth/authService.ts";
import { LoginCredentials, RegisterData } from "@/types/Auth.ts";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  //State
  user: User | null;
  error: string | null;
  loading: boolean;

  //Actions
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  signUp: (registerData: RegisterData) => Promise<Boolean>;
  logIn: (loginCredentials: LoginCredentials) => Promise<Boolean>;
  logOut: () => void;
  sendResetPasswordEmail: (email: string) => Promise<Boolean>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      error: null,
      loading: false,
      setUser: (user: User) => set({ user }),
      setError: (error: string | null) => set({ error }),
      setLoading: (loading: boolean) => set({ loading }),

      logIn: async (loginCredentials: LoginCredentials) => {
        set({ loading: true, error: null });

        const result = await login(loginCredentials);

        if (result.user) {
          set({ user: result.user, loading: false });
          return true;
        } else {
          set({ error: result.error, loading: false });
          return false;
        }
      },

      signUp: async (registerData: RegisterData) => {
        set({ loading: true, error: null });

        const result = await register(registerData);

        if (result.user) {
          set({ user: result.user, loading: false });
          return true;
        } else {
          set({ error: result.error, loading: false });
          return false;
        }
      },

      logOut: () => {
        set({ user: null });
        localStorage.removeItem("token");
      },

      sendResetPasswordEmail: async (email) => {
        const prop = {
          email: email
        }
        return await forget_password(prop)
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist những field cần thiết
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

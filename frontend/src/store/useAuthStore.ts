import { create } from "zustand";
import { axiosInstance } from "../config/axios.ts";
import { User } from "../types/User.ts";

// Định nghĩa kiểu dữ liệu cho Zustand
type AuthState = {
  user: User | null;
  fetchUser: () => Promise<void>;
};

// Zustand Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  error: null,

  fetchUser: async () => {
    try {
      const res = await axiosInstance.get("/user");
      set({ user: res.data });
    } catch (error) {
        console.error(error)
    }
  },
}));

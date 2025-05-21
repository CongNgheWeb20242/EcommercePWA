import { User } from '@/types/User';
import { create } from 'zustand';

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
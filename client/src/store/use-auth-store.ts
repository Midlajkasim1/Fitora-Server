import { create } from 'zustand';
import type { User } from '../type/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean; 
  isLoggingOut: boolean;
  setAuth: (user: User) => void;
  updateOnboardingStatus: (status: boolean) => void; 
  setInitialLoading: (val: boolean) => void;
  setLoggingOut: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialLoading: true, 
  isLoggingOut: false,

  setAuth: (user) => {
    set({ user, isAuthenticated: true, isInitialLoading: false, isLoggingOut: false });
  },

  updateOnboardingStatus: (status) => set((state) => ({
    user: state.user ? { ...state.user, isOnboardingRequired: status } : null
  })),

  setInitialLoading: (val) => set({ isInitialLoading: val }),
  
  setLoggingOut: (val) => set({ isLoggingOut: val }),

  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false, 
      isInitialLoading: false,
      isLoggingOut: false
    });
    localStorage.removeItem('onboarding-storage');
  },
}));
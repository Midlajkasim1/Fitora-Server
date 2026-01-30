import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string; 
  email: string;
  role: 'user' | 'trainer';
  isOnboardingRequired: boolean;
  firstName: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean; 
  setAuth: (user: User) => void;
  updateOnboardingStatus: (status: boolean) => void;
  setHasHydrated: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setAuth: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),

      updateOnboardingStatus: (status) => set((state) => ({
        user: state.user ? { ...state.user, isOnboardingRequired: status } : null
      })),

      setHasHydrated: (val) => set({ hasHydrated: val }),

      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
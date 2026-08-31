import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Restaurant {
  id: string;
  restaurantName: string;
  ownerName: string;
  slug: string;
  email: string;
  phone: string;
  status: string;
  onboardingStep?: number;
  logoUrl?: string;
}

interface AuthState {
  restaurant: Restaurant | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (restaurant: Restaurant, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      restaurant: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (restaurant, accessToken) =>
        set({ restaurant, accessToken, isAuthenticated: true, isLoading: false }),
      setAccessToken: (accessToken) =>
        set({ accessToken, isAuthenticated: true }),
      logout: () =>
        set({ restaurant: null, accessToken: null, isAuthenticated: false, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'restaurant-os-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        restaurant: state.restaurant,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

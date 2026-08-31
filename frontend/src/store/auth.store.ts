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
  onboardingStep?: number | null;
  logoUrl?: string | null;
  onboardingCompleted?: boolean | null;
}

interface AuthState {
  restaurant: Restaurant | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profileLoaded: boolean; // true only after backend profile fetch completes
  setAuth: (restaurant: Restaurant, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setRestaurant: (restaurant: Restaurant) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setProfileLoaded: (loaded: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      restaurant: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      profileLoaded: false,
      setAuth: (restaurant, accessToken) =>
        set({ restaurant, accessToken, isAuthenticated: true, isLoading: false, profileLoaded: true }),
      setAccessToken: (accessToken) =>
        set({ accessToken, isAuthenticated: true }),
      setRestaurant: (restaurant) =>
        set({ restaurant, profileLoaded: true }),
      logout: () =>
        set({ restaurant: null, accessToken: null, isAuthenticated: false, isLoading: false, profileLoaded: false }),
      setLoading: (isLoading) => set({ isLoading }),
      setProfileLoaded: (profileLoaded) => set({ profileLoaded }),
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

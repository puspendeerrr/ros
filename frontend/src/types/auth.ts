export interface Restaurant {
  id: string;
  restaurantName: string;
  ownerName: string;
  slug: string;
  email: string;
  phone: string;
  status: string;
  onboardingStep?: number | null;
  onboardingCompleted?: boolean | null;
  logoUrl?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    restaurant: Restaurant;
    accessToken: string;
  };
}

export interface StandardResponse {
  success: boolean;
  message: string;
}

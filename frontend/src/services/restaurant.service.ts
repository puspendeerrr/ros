import api from './api.js';

export interface RestaurantProfile {
  id: string;
  restaurantName: string;
  ownerName: string;
  slug: string;
  email: string;
  phone: string;
  status: string;
  description?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  googleMapsUrl?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  onboardingStep?: number | null;
  createdAt: string;
  updatedAt: string;
}

export const restaurantService = {
  async getProfile(): Promise<{ success: boolean; data: RestaurantProfile }> {
    const response = await api.get('/api/restaurant');
    return response.data;
  },

  async updateProfile(data: Partial<RestaurantProfile>): Promise<{ success: boolean; data: RestaurantProfile }> {
    const response = await api.patch('/api/restaurant', data);
    return response.data;
  },

  async uploadImage(file: File): Promise<{ success: boolean; data: { imageUrl: string } }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/restaurant/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

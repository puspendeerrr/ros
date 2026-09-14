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
  logoPublicId?: string | null;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  googleMapsUrl?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  onboardingStep?: number | null;
  onboardingCompleted?: boolean | null;
  themeId?: string | null;
  themeConfig?: any | null;
  createdAt: string;
  updatedAt: string;
}

export const restaurantService = {
  async getProfile(): Promise<{ success: boolean; data: RestaurantProfile }> {
    const response = await api.get('/api/restaurant');
    return response.data;
  },

  async updateProfile(data: Partial<RestaurantProfile> & { logoPublicId?: string | null; coverImagePublicId?: string | null }): Promise<{ success: boolean; data: RestaurantProfile }> {
    const response = await api.patch('/api/restaurant', data);
    return response.data;
  },

  async uploadImage(file: File, type?: 'logo' | 'cover'): Promise<{ success: boolean; data: { imageUrl: string; publicId: string } }> {
    const formData = new FormData();
    formData.append('file', file);
    const url = type ? `/api/restaurant/upload?type=${type}` : '/api/restaurant/upload';
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateTheme(themeId: string, themeConfig: any): Promise<{ success: boolean; data: RestaurantProfile }> {
    const response = await api.patch('/api/restaurant/theme', { themeId, themeConfig });
    return response.data;
  },

  async resetTheme(): Promise<{ success: boolean; data: RestaurantProfile }> {
    const response = await api.post('/api/restaurant/theme/reset');
    return response.data;
  },
};

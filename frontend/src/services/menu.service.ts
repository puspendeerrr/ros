import api from './api.js';
import type { Category, MenuItem } from '../types/menu.js';
import type { StandardResponse } from '../types/auth.js';

export const menuService = {
  // --- CATEGORIES ---
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    const response = await api.get('/api/categories');
    return response.data;
  },

  async createCategory(name: string): Promise<{ success: boolean; data: Category }> {
    const response = await api.post('/api/categories', { name });
    return response.data;
  },

  async updateCategory(id: string, name: string): Promise<{ success: boolean; data: Category }> {
    const response = await api.patch(`/api/categories/${id}`, { name });
    return response.data;
  },

  async deleteCategory(id: string): Promise<StandardResponse> {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },

  // --- ITEMS ---
  async getItems(): Promise<{ success: boolean; data: MenuItem[] }> {
    const response = await api.get('/api/menu');
    return response.data;
  },

  async createItem(data: {
    name: string;
    description?: string | null;
    price: number;
    categoryId: string;
    imageUrl?: string | null;
    isVeg: boolean;
    isAvailable: boolean;
  }): Promise<{ success: boolean; data: MenuItem }> {
    const response = await api.post('/api/menu', data);
    return response.data;
  },

  async updateItem(
    id: string,
    data: {
      name?: string;
      description?: string | null;
      price?: number;
      categoryId?: string;
      imageUrl?: string | null;
      isVeg?: boolean;
      isAvailable?: boolean;
    }
  ): Promise<{ success: boolean; data: MenuItem }> {
    const response = await api.patch(`/api/menu/${id}`, data);
    return response.data;
  },

  async deleteItem(id: string): Promise<StandardResponse> {
    const response = await api.delete(`/api/menu/${id}`);
    return response.data;
  },

  // --- UPLOAD IMAGE ---
  async uploadImage(file: File): Promise<{ success: boolean; data: { imageUrl: string } }> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/api/menu/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // --- QR CODE DATA ---
  async getQRCodeData(): Promise<{ success: boolean; data: { publicUrl: string; restaurantSlug: string } }> {
    const response = await api.get('/api/qr');
    return response.data;
  },

  // --- PUBLIC MENU ---
  async getPublicMenu(restaurantSlug: string): Promise<{ success: boolean; data: { restaurant: any; categories: any[] } }> {
    const response = await api.get(`/api/public/menu/${restaurantSlug}`);
    return response.data;
  },
};

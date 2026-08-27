import api from './api.js';
import type { AuthResponse, StandardResponse } from '../types/auth.js';

export const authService = {
  async signup(data: any): Promise<StandardResponse> {
    const response = await api.post('/signup', data);
    return response.data;
  },

  async login(data: any): Promise<AuthResponse> {
    const response = await api.post('/login', data);
    return response.data;
  },

  async verifyEmail(token: string): Promise<StandardResponse> {
    const response = await api.get(`/verify-email?token=${token}`);
    return response.data;
  },

  async forgotPassword(email: string): Promise<StandardResponse> {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: any): Promise<StandardResponse> {
    const response = await api.post('/reset-password', data);
    return response.data;
  },

  async logout(): Promise<StandardResponse> {
    const response = await api.post('/logout');
    return response.data;
  },
};

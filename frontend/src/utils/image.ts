import React from 'react';
import { API_BASE_URL } from '../services/api.js';

/**
 * Helper function to construct complete image URLs safely.
 * Handles absolute Cloudinary URLs (http/https/data/blob), relative paths (/uploads/...), and missing slashes.
 */
export const getImageUrl = (url?: string | null, fallback: string = '/placeholder.png'): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const cleanUrl = url.trim();
  if (
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://') ||
    cleanUrl.startsWith('data:') ||
    cleanUrl.startsWith('blob:')
  ) {
    return cleanUrl;
  }
  return `${API_BASE_URL}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

/**
 * Global image onError fallback handler to prevent broken image UI icons
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = '/placeholder.png'
) => {
  const target = e.currentTarget;
  if (target.src !== fallback && !target.src.endsWith(fallback)) {
    target.onerror = null; // Prevent infinite error recursion
    target.src = fallback;
  }
};

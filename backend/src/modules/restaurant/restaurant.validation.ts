import { z } from 'zod';

export const updateRestaurantSchema = z.object({
  restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  googleMapsUrl: z
    .string()
    .url('Invalid Google Maps URL format')
    .or(z.literal(''))
    .nullable()
    .optional(),
  openingTime: z.string().nullable().optional(),
  closingTime: z.string().nullable().optional(),
});

export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

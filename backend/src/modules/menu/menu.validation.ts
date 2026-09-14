import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name is too long'),
});

export const updateCategorySchema = createCategorySchema;

export const createItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Item name is too long'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  price: z.coerce.number().positive('Price must be a positive number'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional().nullable(),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

export const updateItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Item name is too long').optional(),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  price: z.coerce.number().positive('Price must be a positive number').optional(),
  categoryId: z.string().min(1, 'Category is required').optional(),
  imageUrl: z.string().optional().nullable(),
  isVeg: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;

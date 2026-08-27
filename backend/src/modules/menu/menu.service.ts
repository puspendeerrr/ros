import fs from 'fs';
import path from 'path';
import { Category, MenuItem } from '@prisma/client';
import { MenuRepository } from './menu.repository';
import { CreateCategoryInput, CreateItemInput, UpdateItemInput } from './menu.validation';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';
import { slugify } from '../../utils/slug';

export class MenuService {
  private repository = new MenuRepository();

  // --- CATEGORY SERVICES ---
  async getCategories(restaurantId: string): Promise<Category[]> {
    return this.repository.findCategories(restaurantId);
  }

  async createCategory(restaurantId: string, input: CreateCategoryInput): Promise<Category> {
    const existing = await this.repository.findCategoryByName(restaurantId, input.name);
    if (existing) {
      throw new AppError(400, 'A category with this name already exists');
    }
    return this.repository.createCategory(restaurantId, input.name);
  }

  async updateCategory(
    id: string,
    restaurantId: string,
    input: CreateCategoryInput
  ): Promise<Category> {
    const category = await this.repository.findCategoryById(id, restaurantId);
    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    const existing = await this.repository.findCategoryByName(restaurantId, input.name);
    if (existing && existing.id !== id) {
      throw new AppError(400, 'A category with this name already exists');
    }

    return this.repository.updateCategory(id, input.name);
  }

  async deleteCategory(id: string, restaurantId: string): Promise<Category> {
    const category = await this.repository.findCategoryById(id, restaurantId);
    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    // Get all items in category to clean up their images
    const items = await this.repository.findItems(restaurantId);
    const categoryItems = items.filter((item) => item.categoryId === id);

    // Delete category (cascades database items deletion)
    const deleted = await this.repository.deleteCategory(id);

    // Delete associated local images on disk
    for (const item of categoryItems) {
      this.deleteItemImage(item.imageUrl);
    }

    return deleted;
  }

  // --- ITEM SERVICES ---
  async getItems(restaurantId: string): Promise<MenuItem[]> {
    return this.repository.findItems(restaurantId);
  }

  async createItem(restaurantId: string, input: CreateItemInput): Promise<MenuItem> {
    // 1. Verify category ownership
    const category = await this.repository.findCategoryById(input.categoryId, restaurantId);
    if (!category) {
      throw new AppError(400, 'Category not found');
    }

    // 2. Verify duplicate name in this category
    const existingName = await this.repository.findItemByNameInCategory(input.categoryId, input.name);
    if (existingName) {
      throw new AppError(400, 'An item with this name already exists inside this category');
    }

    // 3. Generate unique slug in this restaurant
    const slug = await this.generateUniqueSlug(restaurantId, input.name);

    return this.repository.createItem({
      restaurantId,
      categoryId: input.categoryId,
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      isVeg: input.isVeg,
      isAvailable: input.isAvailable,
    });
  }

  async updateItem(id: string, restaurantId: string, input: UpdateItemInput): Promise<MenuItem> {
    const item = await this.repository.findItemById(id, restaurantId);
    if (!item) {
      throw new AppError(404, 'Item not found');
    }

    const categoryId = input.categoryId || item.categoryId;

    // Verify category ownership if updated
    if (input.categoryId && input.categoryId !== item.categoryId) {
      const category = await this.repository.findCategoryById(input.categoryId, restaurantId);
      if (!category) {
        throw new AppError(400, 'Category not found');
      }
    }

    // Verify duplicate name inside target category
    if (input.name && (input.name !== item.name || input.categoryId)) {
      const existingName = await this.repository.findItemByNameInCategory(categoryId, input.name);
      if (existingName && existingName.id !== id) {
        throw new AppError(400, 'An item with this name already exists inside this category');
      }
    }

    // Generate unique slug if name changed
    let slug = item.slug;
    if (input.name && input.name !== item.name) {
      slug = await this.generateUniqueSlug(restaurantId, input.name);
    }

    // File cleanup on image replacement
    if (input.imageUrl !== undefined && input.imageUrl !== item.imageUrl) {
      this.deleteItemImage(item.imageUrl);
    }

    return this.repository.updateItem(id, {
      categoryId: input.categoryId,
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      isVeg: input.isVeg,
      isAvailable: input.isAvailable,
    });
  }

  async deleteItem(id: string, restaurantId: string): Promise<MenuItem> {
    const item = await this.repository.findItemById(id, restaurantId);
    if (!item) {
      throw new AppError(404, 'Item not found');
    }

    const deleted = await this.repository.deleteItem(id);

    // Delete image file from disk
    this.deleteItemImage(item.imageUrl);

    return deleted;
  }

  // --- PRIVATE UTILITIES ---
  private async generateUniqueSlug(restaurantId: string, name: string): Promise<string> {
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await this.repository.findItemBySlug(restaurantId, slug);
      if (!existing) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private deleteItemImage(imageUrl: string | null | undefined): void {
    if (!imageUrl) return;

    // Clean leading slash and prevent path traversal
    const relativePath = imageUrl.replace(/^\/+/, '');
    const absolutePath = path.resolve(__dirname, '../../../', relativePath);

    // Ensure we are only deleting files inside backend/uploads/menu directory
    const allowedDir = path.resolve(__dirname, '../../../uploads/menu');
    if (!absolutePath.startsWith(allowedDir)) {
      console.warn(`Prevented deletion of file outside allowed directory: ${absolutePath}`);
      return;
    }

    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error(`Failed to delete local file ${absolutePath}:`, err.message);
      } else {
        console.log(`Successfully deleted obsolete local file: ${absolutePath}`);
      }
    });
  }

  // --- PUBLIC & QR SERVICES ---
  async getPublicMenu(slug: string) {
    const restaurant = await this.repository.findRestaurantPublicDetailsBySlug(slug);
    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found');
    }

    if (restaurant.status !== 'ACTIVE') {
      throw new AppError(403, 'This restaurant menu is currently unavailable');
    }

    const categories = await this.repository.findPublicMenuCategories(restaurant.id);

    return {
      restaurant: {
        restaurantName: restaurant.restaurantName,
        slug: restaurant.slug,
        logoUrl: restaurant.logoUrl,
        coverImageUrl: restaurant.coverImageUrl,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        country: restaurant.country,
        openingTime: restaurant.openingTime,
        closingTime: restaurant.closingTime,
      },
      categories,
    };
  }

  async getQRCodeData(restaurantId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { slug: true }
    });

    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found');
    }

    const publicUrl = `${env.PUBLIC_BASE_URL}/r/${restaurant.slug}`;
    return {
      publicUrl,
      restaurantSlug: restaurant.slug,
    };
  }
}

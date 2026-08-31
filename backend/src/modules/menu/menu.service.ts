import fs from 'fs';
import path from 'path';
import { Category, MenuItem } from '@prisma/client';
import { MenuRepository } from './menu.repository';
import { CreateCategoryInput, CreateItemInput, UpdateItemInput } from './menu.validation';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';
import { slugify } from '../../utils/slug';
import { cacheService } from '../../utils/cache';

export class MenuService {
  private repository = new MenuRepository();

  // --- CATEGORY SERVICES ---
  async getCategories(restaurantId: string): Promise<Category[]> {
    const baseKey = `categories:${restaurantId}`;
    const cacheKey = await cacheService.getVersionedKey(baseKey);
    return cacheService.getOrFetch<Category[]>(
      cacheKey,
      900, // 15 minutes TTL
      () => this.repository.findCategories(restaurantId)
    ).then((res) => res || []);
  }

  async createCategory(restaurantId: string, input: CreateCategoryInput): Promise<Category> {
    const existing = await this.repository.findCategoryByName(restaurantId, input.name);
    if (existing) {
      throw new AppError(400, 'A category with this name already exists');
    }
    const category = await this.repository.createCategory(restaurantId, input.name);
    await this.invalidateAndWarmMenu(restaurantId);
    return category;
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

    const updated = await this.repository.updateCategory(id, input.name);
    await this.invalidateAndWarmMenu(restaurantId);
    return updated;
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

    await this.invalidateAndWarmMenu(restaurantId);
    return deleted;
  }

  // --- ITEM SERVICES ---
  async getItems(restaurantId: string): Promise<MenuItem[]> {
    const baseKey = `menu:${restaurantId}`;
    const cacheKey = await cacheService.getVersionedKey(baseKey);
    return cacheService.getOrFetch<MenuItem[]>(
      cacheKey,
      900, // 15 minutes TTL
      () => this.repository.findItems(restaurantId)
    ).then((res) => res || []);
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

    const item = await this.repository.createItem({
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

    await this.invalidateAndWarmMenu(restaurantId);
    return item;
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

    const updated = await this.repository.updateItem(id, {
      categoryId: input.categoryId,
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      isVeg: input.isVeg,
      isAvailable: input.isAvailable,
    });

    await this.invalidateAndWarmMenu(restaurantId);
    return updated;
  }

  async deleteItem(id: string, restaurantId: string): Promise<MenuItem> {
    const item = await this.repository.findItemById(id, restaurantId);
    if (!item) {
      throw new AppError(404, 'Item not found');
    }

    const deleted = await this.repository.deleteItem(id);

    // Delete image file from disk
    this.deleteItemImage(item.imageUrl);

    await this.invalidateAndWarmMenu(restaurantId);
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
    const baseKey = `public-menu:${slug}`;
    const cacheKey = await cacheService.getVersionedKey(baseKey);

    const data = await cacheService.getOrFetch<any>(
      cacheKey,
      900, // 15 minutes TTL
      () => this.getPublicMenuDataFromDb(slug)
    );

    if (!data) {
      throw new AppError(404, 'Restaurant or active menu not found');
    }

    return data;
  }

  async getQRCodeData(restaurantId: string) {
    const cacheKey = `qr:${restaurantId}`;
    return cacheService.getOrFetch<any>(
      cacheKey,
      86400, // 24 hours TTL
      async () => {
        const restaurant = await prisma.restaurant.findUnique({
          where: { id: restaurantId },
          select: { slug: true }
        });

        if (!restaurant) {
          return null;
        }

        const publicUrl = `${env.PUBLIC_BASE_URL}/r/${restaurant.slug}`;
        return {
          publicUrl,
          restaurantSlug: restaurant.slug,
        };
      }
    ).then((res) => {
      if (!res) {
        throw new AppError(404, 'Restaurant not found');
      }
      return res;
    });
  }

  // --- CACHE UTILITIES ---
  private async getRestaurantSlug(restaurantId: string): Promise<string> {
    const baseKey = `restaurant:${restaurantId}`;
    const cacheKey = await cacheService.getVersionedKey(baseKey);
    const cachedRestaurant = await cacheService.get<any>(cacheKey);
    if (cachedRestaurant?.slug) {
      return cachedRestaurant.slug;
    }
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { slug: true }
    });
    return restaurant?.slug || '';
  }

  private async getPublicMenuDataFromDb(slug: string) {
    const restaurant = await this.repository.findRestaurantPublicDetailsBySlug(slug);
    if (!restaurant) return null;
    if (restaurant.status !== 'ACTIVE') return null;

    const categories = await this.repository.findPublicMenuCategories(restaurant.id);

    return {
      restaurant: {
        restaurantName: restaurant.restaurantName,
        description: restaurant.description,
        slug: restaurant.slug,
        logoUrl: restaurant.logoUrl,
        coverImageUrl: restaurant.coverImageUrl,
        phone: restaurant.phone,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        country: restaurant.country,
        postalCode: restaurant.postalCode,
        googleMapsUrl: restaurant.googleMapsUrl,
        openingTime: restaurant.openingTime,
        closingTime: restaurant.closingTime,
      },
      categories,
    };
  }

  private async invalidateAndWarmMenu(restaurantId: string): Promise<void> {
    const slug = await this.getRestaurantSlug(restaurantId);

    // 1. Invalidate versions (Bump versions)
    await Promise.all([
      cacheService.incrementVersion(`categories:${restaurantId}`),
      cacheService.incrementVersion(`menu:${restaurantId}`),
      cacheService.incrementVersion(`public-menu:${slug}`)
    ]);

    // 2. Fetch new version keys
    const [categoriesKey, menuKey, publicMenuKey] = await Promise.all([
      cacheService.getVersionedKey(`categories:${restaurantId}`),
      cacheService.getVersionedKey(`menu:${restaurantId}`),
      cacheService.getVersionedKey(`public-menu:${slug}`)
    ]);

    // 3. Query PostgreSQL for latest state
    const [categories, items, publicMenuDetails] = await Promise.all([
      this.repository.findCategories(restaurantId),
      this.repository.findItems(restaurantId),
      this.getPublicMenuDataFromDb(slug)
    ]);

    // 4. Set Redis cache (warming)
    await Promise.all([
      cacheService.set(categoriesKey, categories, 900),
      cacheService.set(menuKey, items, 900),
      ...(publicMenuDetails ? [cacheService.set(publicMenuKey, publicMenuDetails, 900)] : [])
    ]);
  }
}

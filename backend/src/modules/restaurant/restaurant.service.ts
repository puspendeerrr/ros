import fs from 'fs';
import path from 'path';
import { Restaurant } from '@prisma/client';
import { RestaurantRepository } from './restaurant.repository';
import { UpdateRestaurantInput } from './restaurant.validation';
import { AppError } from '../../middleware/error.middleware';
import { cacheService } from '../../utils/cache';
import { CacheConfig } from '../../config/cache';

export class RestaurantService {
  private repository = new RestaurantRepository();

  async getProfile(restaurantId: string): Promise<Omit<Restaurant, 'passwordHash'>> {
    const baseKey = `profile:${restaurantId}`;
    const cacheKey = await cacheService.getVersionedKey(baseKey);

    const profile = await cacheService.getOrFetch<Omit<Restaurant, 'passwordHash'>>(
      cacheKey,
      CacheConfig.profileTTL,
      async () => {
        const restaurant = await this.repository.findById(restaurantId);
        if (!restaurant) return null;
        const { passwordHash, ...prof } = restaurant;
        return prof;
      }
    );

    if (!profile) {
      throw new AppError(404, 'Restaurant not found');
    }

    return profile;
  }

  async updateProfile(
    restaurantId: string,
    data: UpdateRestaurantInput
  ): Promise<Omit<Restaurant, 'passwordHash'>> {
    const oldProfile = await this.repository.findById(restaurantId);
    if (!oldProfile) {
      throw new AppError(404, 'Restaurant not found');
    }

    const updatedRestaurant = await this.repository.update(restaurantId, data);

    // Identify obsolete images to clean up
    const logoToCleanup = data.logoUrl !== undefined && oldProfile.logoUrl && oldProfile.logoUrl !== data.logoUrl;
    const coverToCleanup = data.coverImageUrl !== undefined && oldProfile.coverImageUrl && oldProfile.coverImageUrl !== data.coverImageUrl;

    // Delete obsolete files if successfully updated
    if (logoToCleanup && oldProfile.logoUrl) {
      this.deleteLocalFile(oldProfile.logoUrl);
    }
    if (coverToCleanup && oldProfile.coverImageUrl) {
      this.deleteLocalFile(oldProfile.coverImageUrl);
    }

    // Invalidate versions
    const oldSlug = oldProfile.slug;
    const newSlug = updatedRestaurant.slug;

    await Promise.all([
      cacheService.incrementVersion(`profile:${restaurantId}`),
      cacheService.incrementVersion(`restaurant:${restaurantId}`),
      cacheService.incrementVersion(`restaurant:slug:${oldSlug}`),
      cacheService.incrementVersion(`public-menu:${oldSlug}`),
      ...(oldSlug !== newSlug ? [
        cacheService.incrementVersion(`restaurant:slug:${newSlug}`),
        cacheService.incrementVersion(`public-menu:${newSlug}`)
      ] : [])
    ]);

    const { passwordHash, ...profile } = updatedRestaurant;

    // Warm cache
    const [profileKey, restaurantKey, slugKey] = await Promise.all([
      cacheService.getVersionedKey(`profile:${restaurantId}`),
      cacheService.getVersionedKey(`restaurant:${restaurantId}`),
      cacheService.getVersionedKey(`restaurant:slug:${newSlug}`)
    ]);

    await Promise.all([
      cacheService.set(profileKey, profile, CacheConfig.profileTTL),
      cacheService.set(restaurantKey, updatedRestaurant, CacheConfig.profileTTL),
      cacheService.set(slugKey, updatedRestaurant, CacheConfig.profileTTL)
    ]);

    return profile;
  }

  private deleteLocalFile(relativePath: string) {
    // Relative path starts with '/uploads/...', strip leading slash for resolve if needed, or resolve handles it
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    const absolutePath = path.resolve(__dirname, '../../../', cleanPath);

    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error(`Failed to delete local file ${absolutePath}:`, err.message);
      } else {
        console.log(`Successfully deleted obsolete local file: ${absolutePath}`);
      }
    });
  }
}

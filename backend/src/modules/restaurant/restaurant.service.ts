import { Restaurant } from '@prisma/client';
import { RestaurantRepository } from './restaurant.repository';
import { UpdateRestaurantInput } from './restaurant.validation';
import { AppError } from '../../middleware/error.middleware';
import { cacheService } from '../../utils/cache';
import { CacheConfig } from '../../config/cache';
import { cloudinaryService } from '../../services/cloudinary.service';

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

    // Delete obsolete assets from Cloudinary if successfully updated
    if (logoToCleanup && oldProfile.logoPublicId) {
      cloudinaryService.deleteImage(oldProfile.logoPublicId).catch((err) =>
        console.error(`Failed to delete old logo (${oldProfile.logoPublicId}) from Cloudinary:`, err)
      );
    }
    if (coverToCleanup && oldProfile.coverImagePublicId) {
      cloudinaryService.deleteImage(oldProfile.coverImagePublicId).catch((err) =>
        console.error(`Failed to delete old cover (${oldProfile.coverImagePublicId}) from Cloudinary:`, err)
      );
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

  async updateTheme(
    restaurantId: string,
    themeId: string,
    themeConfig: any
  ): Promise<Omit<Restaurant, 'passwordHash'>> {
    const restaurant = await this.repository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found');
    }

    const updated = await this.repository.updateTheme(restaurantId, themeId, themeConfig);

    // Invalidate versions to refresh profile and public menu caches instantly
    const slug = restaurant.slug;
    await Promise.all([
      cacheService.incrementVersion(`profile:${restaurantId}`),
      cacheService.incrementVersion(`public-menu:${slug}`),
    ]);

    const { passwordHash, ...profile } = updated;
    return profile;
  }
}

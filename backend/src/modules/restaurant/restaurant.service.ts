import fs from 'fs';
import path from 'path';
import { Restaurant } from '@prisma/client';
import { RestaurantRepository } from './restaurant.repository';
import { UpdateRestaurantInput } from './restaurant.validation';
import { AppError } from '../../middleware/error.middleware';

export class RestaurantService {
  private repository = new RestaurantRepository();

  async getProfile(restaurantId: string): Promise<Omit<Restaurant, 'passwordHash'>> {
    const restaurant = await this.repository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found');
    }

    const { passwordHash, ...profile } = restaurant;
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

    // Identify obsolete images to clean up
    const logoToCleanup = data.logoUrl !== undefined && oldProfile.logoUrl && oldProfile.logoUrl !== data.logoUrl;
    const coverToCleanup = data.coverImageUrl !== undefined && oldProfile.coverImageUrl && oldProfile.coverImageUrl !== data.coverImageUrl;

    const updatedRestaurant = await this.repository.update(restaurantId, data);

    // Delete obsolete files if successfully updated
    if (logoToCleanup && oldProfile.logoUrl) {
      this.deleteLocalFile(oldProfile.logoUrl);
    }
    if (coverToCleanup && oldProfile.coverImageUrl) {
      this.deleteLocalFile(oldProfile.coverImageUrl);
    }

    const { passwordHash, ...profile } = updatedRestaurant;
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

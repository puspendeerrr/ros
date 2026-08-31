import { Restaurant } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { UpdateRestaurantInput } from './restaurant.validation';

export class RestaurantRepository {
  async findById(id: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateRestaurantInput): Promise<Restaurant> {
    // Ensure nested/undefined properties are handled nicely
    return prisma.restaurant.update({
      where: { id },
      data: {
        restaurantName: data.restaurantName !== undefined ? data.restaurantName : undefined,
        description: data.description !== undefined ? data.description : undefined,
        logoUrl: data.logoUrl !== undefined ? data.logoUrl : undefined,
        coverImageUrl: data.coverImageUrl !== undefined ? data.coverImageUrl : undefined,
        phone: data.phone !== undefined ? data.phone.trim() : undefined,
        address: data.address !== undefined ? data.address : undefined,
        city: data.city !== undefined ? data.city : undefined,
        state: data.state !== undefined ? data.state : undefined,
        country: data.country !== undefined ? data.country : undefined,
        postalCode: data.postalCode !== undefined ? data.postalCode : undefined,
        googleMapsUrl: data.googleMapsUrl !== undefined ? data.googleMapsUrl : undefined,
        openingTime: data.openingTime !== undefined ? data.openingTime : undefined,
        closingTime: data.closingTime !== undefined ? data.closingTime : undefined,
        onboardingStep: data.onboardingStep !== undefined ? data.onboardingStep : undefined,
      },
    });
  }
}

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
        onboardingCompleted: data.onboardingCompleted !== undefined ? data.onboardingCompleted : undefined,
      },
    });
  }

  async findGalleryImages(restaurantId: string) {
    return prisma.galleryImage.findMany({
      where: { restaurantId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findGalleryImageById(id: string, restaurantId: string) {
    return prisma.galleryImage.findFirst({
      where: { id, restaurantId },
    });
  }

  async countGalleryImages(restaurantId: string): Promise<number> {
    return prisma.galleryImage.count({
      where: { restaurantId },
    });
  }

  async createGalleryImage(data: {
    restaurantId: string;
    url: string;
    publicId?: string | null;
    title?: string | null;
    displayOrder: number;
  }) {
    return prisma.galleryImage.create({
      data,
    });
  }

  async deleteGalleryImage(id: string) {
    return prisma.galleryImage.delete({
      where: { id },
    });
  }

  async updateGalleryOrders(restaurantId: string, imageIds: string[]) {
    return prisma.$transaction(
      imageIds.map((id, index) =>
        prisma.galleryImage.updateMany({
          where: { id, restaurantId },
          data: { displayOrder: index },
        })
      )
    );
  }

  async updateGalleryImage(id: string, restaurantId: string, data: { title?: string }) {
    return prisma.galleryImage.updateMany({
      where: { id, restaurantId },
      data,
    });
  }
}

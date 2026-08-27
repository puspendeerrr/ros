import { RestaurantStatus, TokenType, Restaurant, Token } from '@prisma/client';
import { prisma } from '../../config/prisma';

export class AuthRepository {
  async findRestaurantByEmail(email: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findRestaurantByPhone(phone: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { phone: phone.trim() },
    });
  }

  async findRestaurantBySlug(slug: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { slug },
    });
  }

  async findRestaurantById(id: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async createRestaurant(data: {
    restaurantName: string;
    ownerName: string;
    slug: string;
    email: string;
    phone: string;
    passwordHash: string;
  }): Promise<Restaurant> {
    return prisma.restaurant.create({
      data: {
        restaurantName: data.restaurantName,
        ownerName: data.ownerName,
        slug: data.slug,
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        passwordHash: data.passwordHash,
        status: RestaurantStatus.PENDING,
      },
    });
  }

  async updateRestaurantStatus(id: string, status: RestaurantStatus): Promise<Restaurant> {
    return prisma.restaurant.update({
      where: { id },
      data: { status },
    });
  }

  async updateRestaurantPassword(id: string, passwordHash: string): Promise<Restaurant> {
    return prisma.restaurant.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async createToken(data: {
    restaurantId: string;
    tokenHash: string;
    type: TokenType;
    expiresAt: Date;
  }): Promise<Token> {
    // Invalidate existing active tokens of the same type for this restaurant
    await prisma.token.updateMany({
      where: {
        restaurantId: data.restaurantId,
        type: data.type,
        used: false,
      },
      data: { used: true },
    });

    return prisma.token.create({
      data: {
        restaurantId: data.restaurantId,
        tokenHash: data.tokenHash,
        type: data.type,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findTokenWithRestaurant(
    tokenHash: string,
    type: TokenType
  ): Promise<(Token & { restaurant: Restaurant }) | null> {
    return prisma.token.findFirst({
      where: {
        tokenHash,
        type,
      },
      include: {
        restaurant: true,
      },
    });
  }

  async markTokenAsUsed(id: string): Promise<Token> {
    return prisma.token.update({
      where: { id },
      data: { used: true },
    });
  }
}

import { Category, MenuItem } from '@prisma/client';
import { prisma } from '../../config/prisma';

export class MenuRepository {
  // --- CATEGORIES ---
  async findCategories(restaurantId: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: { restaurantId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findCategoryById(id: string, restaurantId: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { id, restaurantId },
    });
  }

  async findCategoryByName(restaurantId: string, name: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        restaurantId,
        name: { equals: name.trim(), mode: 'insensitive' },
      },
    });
  }

  async createCategory(restaurantId: string, name: string): Promise<Category> {
    return prisma.category.create({
      data: {
        restaurantId,
        name: name.trim(),
      },
    });
  }

  async updateCategory(id: string, name: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });
  }

  async deleteCategory(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }

  async countItemsInCategory(categoryId: string): Promise<number> {
    return prisma.menuItem.count({
      where: { categoryId },
    });
  }

  // --- ITEMS ---
  async findItems(restaurantId: string): Promise<MenuItem[]> {
    return prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: { name: 'asc' },
    });
  }

  async findItemById(id: string, restaurantId: string): Promise<MenuItem | null> {
    return prisma.menuItem.findFirst({
      where: { id, restaurantId },
    });
  }

  async findItemByNameInCategory(categoryId: string, name: string): Promise<MenuItem | null> {
    return prisma.menuItem.findFirst({
      where: {
        categoryId,
        name: { equals: name.trim(), mode: 'insensitive' },
      },
    });
  }

  async findItemBySlug(restaurantId: string, slug: string): Promise<MenuItem | null> {
    return prisma.menuItem.findFirst({
      where: { restaurantId, slug },
    });
  }

  async createItem(data: {
    restaurantId: string;
    categoryId: string;
    name: string;
    slug: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    isVeg: boolean;
    isAvailable: boolean;
  }): Promise<MenuItem> {
    return prisma.menuItem.create({
      data: {
        restaurantId: data.restaurantId,
        categoryId: data.categoryId,
        name: data.name.trim(),
        slug: data.slug,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        isVeg: data.isVeg,
        isAvailable: data.isAvailable,
      },
    });
  }

  async updateItem(
    id: string,
    data: {
      categoryId?: string;
      name?: string;
      slug?: string;
      description?: string | null;
      price?: number;
      imageUrl?: string | null;
      isVeg?: boolean;
      isAvailable?: boolean;
    }
  ): Promise<MenuItem> {
    return prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        name: data.name ? data.name.trim() : undefined,
      },
    });
  }

  async deleteItem(id: string): Promise<MenuItem> {
    return prisma.menuItem.delete({
      where: { id },
    });
  }

  async findRestaurantPublicDetailsBySlug(slug: string) {
    return prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        restaurantName: true,
        slug: true,
        status: true,
        logoUrl: true,
        coverImageUrl: true,
        address: true,
        city: true,
        state: true,
        country: true,
        openingTime: true,
        closingTime: true,
      }
    });
  }

  async findPublicMenuCategories(restaurantId: string) {
    return prisma.category.findMany({
      where: { restaurantId },
      orderBy: { displayOrder: 'asc' },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { displayOrder: 'asc' },
          select: {
            id: true,
            categoryId: true,
            restaurantId: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            imageUrl: true,
            isVeg: true,
            isAvailable: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    });
  }
}

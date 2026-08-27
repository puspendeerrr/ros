export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  restaurantId: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number; // Decimal serialized to JSON is returned as string or number
  imageUrl: string | null;
  isVeg: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuStats {
  totalCategories: number;
  totalItems: number;
  availableItems: number;
  unavailableItems: number;
}

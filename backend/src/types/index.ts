import { Request } from 'express';
import { RestaurantStatus } from '@prisma/client';

export interface TokenPayload {
  restaurantId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  restaurant?: {
    id: string;
    email: string;
    status: RestaurantStatus;
  };
}

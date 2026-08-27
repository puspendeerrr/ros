import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './error.middleware';
import { AuthenticatedRequest, TokenPayload } from '../types/index';

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Access denied. No token provided.'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
    req.restaurant = {
      id: decoded.restaurantId,
      email: decoded.email,
      status: decoded.status,
    };
    next();
  } catch (error) {
    return next(new AppError(401, 'Invalid or expired token.'));
  }
}

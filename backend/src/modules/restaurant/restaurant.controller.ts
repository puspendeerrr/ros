import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Response, NextFunction } from 'express';
import multer from 'multer';
import { RestaurantService } from './restaurant.service';
import { updateRestaurantSchema } from './restaurant.validation';
import { AuthenticatedRequest } from '../../types';
import { AppError } from '../../middleware/error.middleware';

const uploadsDir = path.resolve(__dirname, '../../../uploads/restaurant');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = crypto.randomUUID() + ext;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'Invalid file type. Only JPG, PNG, and WEBP images are allowed.'), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
}).single('file');

export class RestaurantController {
  private service = new RestaurantService();

  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const profile = await this.service.getProfile(restaurantId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const parsedBody = updateRestaurantSchema.parse(req.body);
      const updatedProfile = await this.service.updateProfile(restaurantId, parsedBody);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError(400, 'File is too large. Maximum size allowed is 2MB.'));
        }
        return next(err);
      }

      if (!req.file) {
        return next(new AppError(400, 'No image file uploaded.'));
      }

      const relativePath = `/uploads/restaurant/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          imageUrl: relativePath,
        },
      });
    });
  };
}

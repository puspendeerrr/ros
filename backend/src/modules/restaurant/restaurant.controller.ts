import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Response, NextFunction } from 'express';
import multer from 'multer';
import { RestaurantService } from './restaurant.service';
import { updateRestaurantSchema } from './restaurant.validation';
import { AuthenticatedRequest } from '../../types';
import { AppError } from '../../middleware/error.middleware';
import { uploadToCloudinary } from '../../utils/cloudinary';

const uploadsDir = path.resolve(process.cwd(), 'uploads/restaurant');
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

const rawUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
}).any();

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
    rawUpload(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError(400, 'File is too large. Maximum size allowed is 2MB.'));
        }
        return next(err);
      }

      const files = req.files as Express.Multer.File[] | undefined;
      const uploadedFile = req.file || (files && files.length > 0 ? files[0] : null);

      if (!uploadedFile) {
        return next(new AppError(400, 'No image file uploaded.'));
      }

      const relativePath = `/uploads/restaurant/${uploadedFile.filename}`;
      const cloudinaryUrl = await uploadToCloudinary(uploadedFile.path, 'restaurant_os/restaurant');
      const finalUrl = cloudinaryUrl || relativePath;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          imageUrl: finalUrl,
        },
      });
    });
  };
}

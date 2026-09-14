import { Response, NextFunction } from 'express';
import { RestaurantService } from './restaurant.service';
import { updateRestaurantSchema } from './restaurant.validation';
import { updateThemeSchema } from './theme.validation';
import { AuthenticatedRequest } from '../../types';
import { AppError } from '../../middleware/error.middleware';
import { uploadMiddleware } from '../../middleware/upload.middleware';
import { cloudinaryService } from '../../services/cloudinary.service';

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

      // Apply Cloudinary optimized transformations on the database fields if public ID is present
      if (parsedBody.logoPublicId && parsedBody.logoUrl) {
        const logoUrl = cloudinaryService.cloudinary.url(parsedBody.logoPublicId, {
          secure: true,
          width: 300,
          height: 300,
          crop: 'fill',
          gravity: 'auto',
          fetch_format: 'auto',
          quality: 'auto',
          flags: 'progressive',
        });
        parsedBody.logoUrl = logoUrl;
      }
      if (parsedBody.coverImagePublicId && parsedBody.coverImageUrl) {
        const coverUrl = cloudinaryService.cloudinary.url(parsedBody.coverImagePublicId, {
          secure: true,
          width: 1600,
          height: 900,
          crop: 'fill',
          fetch_format: 'auto',
          quality: 'auto',
          flags: 'progressive',
        });
        parsedBody.coverImageUrl = coverUrl;
      }

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
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return next(new AppError(400, 'No image file uploaded.'));
      }

      try {
        const type = req.query.type as 'logo' | 'cover' | 'thumbnail' | undefined;
        let subfolder = 'restaurants/temp';
        if (type === 'logo') {
          subfolder = 'restaurants/logos';
        } else if (type === 'cover') {
          subfolder = 'restaurants/covers';
        }

        const uploadResult = await cloudinaryService.uploadImage(req.file.buffer, subfolder, type);

        res.status(200).json({
          success: true,
          message: 'Image uploaded successfully',
          data: {
            imageUrl: uploadResult.secureUrl,
            publicId: uploadResult.publicId,
          },
        });
      } catch (uploadError) {
        next(uploadError);
      }
    });
  };

  updateTheme = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const parsed = updateThemeSchema.parse(req.body);

      const profile = await this.service.updateTheme(restaurantId, parsed.themeId, parsed.themeConfig);

      res.status(200).json({
        success: true,
        message: 'Theme configuration updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  resetTheme = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const profile = await this.service.updateTheme(restaurantId, 'minimal', null);

      res.status(200).json({
        success: true,
        message: 'Theme configuration reset to defaults',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };
}

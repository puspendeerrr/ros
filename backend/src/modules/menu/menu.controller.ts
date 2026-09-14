import { Request, Response, NextFunction } from 'express';
import { MenuService } from './menu.service';
import { createCategorySchema, createItemSchema, updateItemSchema } from './menu.validation';
import { AppError } from '../../middleware/error.middleware';
import { AuthenticatedRequest } from '../../types';
import { uploadMiddleware } from '../../middleware/upload.middleware';
import { cloudinaryService } from '../../services/cloudinary.service';

export class MenuController {
  private service = new MenuService();

  // --- CATEGORIES ---
  getCategories = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const categories = await this.service.getCategories(restaurantId);

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const parsed = createCategorySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      const category = await this.service.createCategory(restaurantId, parsed.data);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;

      const parsed = createCategorySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      const category = await this.service.updateCategory(id, restaurantId, parsed.data);

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;

      await this.service.deleteCategory(id, restaurantId);

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // --- ITEMS ---
  getItems = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const items = await this.service.getItems(restaurantId);

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  };

  createItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const parsed = createItemSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      // Apply Cloudinary optimized transformations on the database fields if public ID is present
      if (parsed.data.imagePublicId && parsed.data.imageUrl) {
        parsed.data.imageUrl = cloudinaryService.cloudinary.url(parsed.data.imagePublicId, {
          secure: true,
          width: 600,
          height: 600,
          crop: 'fill',
          fetch_format: 'auto',
          quality: 'auto',
          flags: 'progressive',
        });
      }

      const item = await this.service.createItem(restaurantId, parsed.data);

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;

      const parsed = updateItemSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      // Apply Cloudinary optimized transformations on the database fields if public ID is present
      if (parsed.data.imagePublicId && parsed.data.imageUrl) {
        parsed.data.imageUrl = cloudinaryService.cloudinary.url(parsed.data.imagePublicId, {
          secure: true,
          width: 600,
          height: 600,
          crop: 'fill',
          fetch_format: 'auto',
          quality: 'auto',
          flags: 'progressive',
        });
      }

      const item = await this.service.updateItem(id, restaurantId, parsed.data);

      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const { id } = req.params;

      await this.service.deleteItem(id, restaurantId);

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // --- UPLOAD IMAGE ---
  uploadImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return next(new AppError(400, 'No image file uploaded.'));
      }

      try {
        const uploadResult = await cloudinaryService.uploadImage(req.file.buffer, 'menu/items', 'item');

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

  // --- PUBLIC & QR ENDPOINTS ---
  getPublicMenu = async (req: any, res: Response, next: NextFunction) => {
    try {
      const { restaurantSlug } = req.params;
      const data = await this.service.getPublicMenu(restaurantSlug);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getQRCodeData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.restaurant!.id;
      const data = await this.service.getQRCodeData(restaurantId);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

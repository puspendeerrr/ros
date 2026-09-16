import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { MenuService } from './menu.service';
import { createCategorySchema, createItemSchema, updateItemSchema } from './menu.validation';
import { AppError } from '../../middleware/error.middleware';
import { AuthenticatedRequest } from '../../types';
import { uploadToCloudinary } from '../../utils/cloudinary';

// Setup multer storage for local uploads
const uploadsDir = path.resolve(process.cwd(), 'uploads/menu');
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

export const uploadMiddleware = rawUpload;

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
        message: 'Category and all nested items deleted successfully',
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

      const relativePath = `/uploads/menu/${uploadedFile.filename}`;
      const cloudinaryUrl = await uploadToCloudinary(uploadedFile.path, 'restaurant_os/menu');
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

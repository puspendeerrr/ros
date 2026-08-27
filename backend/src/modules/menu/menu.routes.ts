import { Router } from 'express';
import { MenuController } from './menu.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new MenuController();

// Public route (unauthenticated)
router.get('/public/menu/:restaurantSlug', controller.getPublicMenu);

// Protect all subsequent routes under the menu builder
router.use(authMiddleware);

// Authenticated QR route
router.get('/qr', controller.getQRCodeData);

// Categories
router.get('/categories', controller.getCategories);
router.post('/categories', controller.createCategory);
router.patch('/categories/:id', controller.updateCategory);
router.delete('/categories/:id', controller.deleteCategory);

// Items
router.get('/menu', controller.getItems);
router.post('/menu', controller.createItem);
router.patch('/menu/:id', controller.updateItem);
router.delete('/menu/:id', controller.deleteItem);

// Image Upload
router.post('/menu/upload', controller.uploadImage);

export default router;

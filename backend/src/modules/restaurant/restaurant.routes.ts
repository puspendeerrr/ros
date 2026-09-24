import { Router } from 'express';
import { RestaurantController } from './restaurant.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new RestaurantController();

// All routes here require authentication
router.use(authMiddleware);

router.get('/restaurant', controller.getProfile);
router.patch('/restaurant', controller.updateProfile);
router.post('/restaurant/upload', controller.uploadImage);

// Gallery endpoints
router.get('/restaurant/gallery', controller.getGallery);
router.post('/restaurant/gallery', controller.uploadGallery);
router.put('/restaurant/gallery/order', controller.reorderGallery);
router.delete('/restaurant/gallery/:imageId', controller.deleteGalleryImage);

export default router;

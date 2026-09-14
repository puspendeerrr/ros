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

export default router;

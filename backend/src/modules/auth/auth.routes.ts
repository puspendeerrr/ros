import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/verify-email', controller.verifyEmail);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);
router.post('/refresh-token', controller.refreshToken);
router.post('/logout', controller.logout);

export default router;

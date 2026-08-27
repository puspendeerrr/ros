import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';
import { AppError } from '../../middleware/error.middleware';
import { env } from '../../config/env';

export class AuthController {
  private service = new AuthService();

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = signupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      const restaurant = await this.service.signup(parsed.data);

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        data: {
          id: restaurant.id,
          restaurantName: restaurant.restaurantName,
          ownerName: restaurant.ownerName,
          slug: restaurant.slug,
          email: restaurant.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      const { restaurant, accessToken, refreshToken } = await this.service.login(parsed.data);

      // Set Refresh Token in HTTP-Only Cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          restaurant,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        throw new AppError(400, 'Verification token is required');
      }

      await this.service.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully! You can now log in.',
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = forgotPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      await this.service.forgotPassword(parsed.data.email);

      res.status(200).json({
        success: true,
        message: 'If the email matches an account, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = resetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      await this.service.resetPassword(parsed.data);

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. You can now log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        throw new AppError(401, 'No refresh token provided');
      }

      const { accessToken } = await this.service.refreshToken(token);

      res.status(200).json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

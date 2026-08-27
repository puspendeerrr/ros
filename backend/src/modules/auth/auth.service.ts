import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RestaurantStatus, TokenType, Restaurant } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { SignupInput, LoginInput, ResetPasswordInput } from './auth.validation';
import { AppError } from '../../middleware/error.middleware';
import { generateRandomToken, hashToken } from '../../utils/crypto';
import { slugify } from '../../utils/slug';
import { sendEmail } from '../../utils/email';
import { env } from '../../config/env';
import { TokenPayload } from '../../types/index';

const SALT_ROUNDS = 12;

export class AuthService {
  private repository = new AuthRepository();

  async signup(input: SignupInput): Promise<Restaurant> {
    // 1. Check duplicate email
    const existingEmail = await this.repository.findRestaurantByEmail(input.email);
    if (existingEmail) {
      throw new AppError(400, 'A restaurant with this email address already exists');
    }

    // 2. Check duplicate phone
    const existingPhone = await this.repository.findRestaurantByPhone(input.phone);
    if (existingPhone) {
      throw new AppError(400, 'A restaurant with this phone number already exists');
    }

    // 3. Generate slug
    let slug = slugify(input.restaurantName);
    const existingSlug = await this.repository.findRestaurantBySlug(slug);
    if (existingSlug) {
      slug = `${slug}-${Math.random().toString(36).substr(2, 4)}`;
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // 5. Save restaurant (defaults to PENDING)
    const restaurant = await this.repository.createRestaurant({
      restaurantName: input.restaurantName,
      ownerName: input.ownerName,
      slug,
      email: input.email,
      phone: input.phone,
      passwordHash,
    });

    // 6. Generate email verification token
    const token = generateRandomToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.repository.createToken({
      restaurantId: restaurant.id,
      tokenHash,
      type: TokenType.VERIFY_EMAIL,
      expiresAt,
    });

    // 7. Send verification email
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: restaurant.email,
      subject: 'Verify Your Restaurant OS Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #F97316;">Welcome to Restaurant OS!</h2>
          <p>Hi ${restaurant.ownerName},</p>
          <p>Thank you for registering <strong>${restaurant.restaurantName}</strong>. Please verify your email address to activate your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="font-size: 12px; color: #666;">This verification link will expire in 24 hours. If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #666; word-break: break-all;">${verificationUrl}</p>
        </div>
      `,
    });

    return restaurant;
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    const dbToken = await this.repository.findTokenWithRestaurant(tokenHash, TokenType.VERIFY_EMAIL);

    if (!dbToken) {
      throw new AppError(400, 'Invalid verification token');
    }

    if (dbToken.used) {
      throw new AppError(400, 'Verification token has already been used');
    }

    if (new Date() > dbToken.expiresAt) {
      throw new AppError(400, 'Verification token has expired');
    }

    // Mark token as used & activate restaurant status
    await this.repository.markTokenAsUsed(dbToken.id);
    await this.repository.updateRestaurantStatus(dbToken.restaurantId, RestaurantStatus.ACTIVE);
  }

  async login(input: LoginInput): Promise<{
    restaurant: Omit<Restaurant, 'passwordHash'>;
    accessToken: string;
    refreshToken: string;
  }> {
    const restaurant = await this.repository.findRestaurantByEmail(input.email);
    if (!restaurant) {
      throw new AppError(401, 'Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, restaurant.passwordHash);
    if (!passwordMatches) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (restaurant.status === RestaurantStatus.PENDING) {
      throw new AppError(401, 'Please verify your email address before logging in');
    }

    if (restaurant.status === RestaurantStatus.SUSPENDED) {
      throw new AppError(403, 'Your account has been suspended. Please contact support.');
    }

    // Generate JWT Tokens
    const payload: TokenPayload = {
      restaurantId: restaurant.id,
      email: restaurant.email,
    };

    const accessToken = jwt.sign(
      { ...payload, status: restaurant.status },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      payload,
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...restaurantData } = restaurant;

    return {
      restaurant: restaurantData,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
      const restaurant = await this.repository.findRestaurantById(decoded.restaurantId);

      if (!restaurant) {
        throw new AppError(401, 'Restaurant not found');
      }

      if (restaurant.status !== RestaurantStatus.ACTIVE) {
        throw new AppError(403, 'Account is not active');
      }

      const accessToken = jwt.sign(
        { restaurantId: restaurant.id, email: restaurant.email, status: restaurant.status },
        env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      return { accessToken };
    } catch (error) {
      throw new AppError(401, 'Invalid or expired refresh token');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const restaurant = await this.repository.findRestaurantByEmail(email);
    
    // Fail silently/gracefully to prevent user enumeration
    if (!restaurant) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return;
    }

    const token = generateRandomToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.repository.createToken({
      restaurantId: restaurant.id,
      tokenHash,
      type: TokenType.RESET_PASSWORD,
      expiresAt,
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: restaurant.email,
      subject: 'Reset Your Restaurant OS Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #F97316;">Reset Your Password</h2>
          <p>Hi ${restaurant.ownerName},</p>
          <p>We received a request to reset the password for your Restaurant OS account. Click the button below to change your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #666;">This password reset link will expire in 1 hour. If you did not request this, you can ignore this email.</p>
          <p style="font-size: 12px; color: #666; word-break: break-all;">${resetUrl}</p>
        </div>
      `,
    });
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const tokenHash = hashToken(input.token);
    const dbToken = await this.repository.findTokenWithRestaurant(tokenHash, TokenType.RESET_PASSWORD);

    if (!dbToken) {
      throw new AppError(400, 'Invalid or expired password reset token');
    }

    if (dbToken.used) {
      throw new AppError(400, 'This password reset token has already been used');
    }

    if (new Date() > dbToken.expiresAt) {
      throw new AppError(400, 'Password reset token has expired');
    }

    // Invalidate token
    await this.repository.markTokenAsUsed(dbToken.id);

    // Hash new password and update restaurant
    const newPasswordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    await this.repository.updateRestaurantPassword(dbToken.restaurantId, newPasswordHash);
  }
}

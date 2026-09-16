import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import fs from 'fs';

let isCloudinaryConfigured = false;

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  isCloudinaryConfigured = true;
  console.log('[Cloudinary] Configured with Cloud Name:', env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log('[Cloudinary] Not fully configured. Falling back to local disk storage.');
}

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'restaurant_os'
): Promise<string | null> => {
  if (!isCloudinaryConfigured) return null;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });

    // Optionally cleanup local temp file after successful upload to Cloudinary
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.warn('[Cloudinary] Could not remove temp file:', filePath);
    }

    console.log('[Cloudinary] Upload success:', result.secure_url);
    return result.secure_url;
  } catch (error: any) {
    console.error('[Cloudinary Upload Error]:', error.message || error);
    return null;
  }
};

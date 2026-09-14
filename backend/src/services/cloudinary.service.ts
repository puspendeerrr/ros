import { cloudinary } from '../config/cloudinary';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export const cloudinaryService = {
  cloudinary,

  /**
   * Uploads an image buffer to a specified folder and returns optimized secure URL & public ID
   */
  uploadImage(
    buffer: Buffer,
    folder: string,
    type?: 'logo' | 'cover' | 'item' | 'thumbnail'
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `restaurant-os/${folder}`,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload returned no result'));
          }

          // Apply on-the-fly transformations using SDK to get optimized CDN URL
          let optimizedUrl = result.secure_url;
          const options: any = {
            secure: true,
            fetch_format: 'auto',
            quality: 'auto',
            flags: 'progressive',
          };

          if (type === 'logo') {
            options.width = 300;
            options.height = 300;
            options.crop = 'fill';
            options.gravity = 'auto';
          } else if (type === 'cover') {
            options.width = 1600;
            options.height = 900;
            options.crop = 'fill';
          } else if (type === 'item') {
            options.width = 600;
            options.height = 600;
            options.crop = 'fill';
          } else if (type === 'thumbnail') {
            options.width = 150;
            options.height = 150;
            options.crop = 'fill';
          }

          try {
            optimizedUrl = cloudinary.url(result.public_id, options);
          } catch (e) {
            console.error('Failed to generate optimized URL, using original secure_url', e);
          }

          resolve({
            secureUrl: optimizedUrl,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      );

      uploadStream.end(buffer);
    });
  },

  /**
   * Deletes an image asset from Cloudinary using its public ID
   */
  deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error(`Failed to delete Cloudinary asset with public ID ${publicId}:`, error);
          return reject(error);
        }
        resolve(result);
      });
    });
  },

  /**
   * Replaces an existing image asset with a new image buffer
   */
  async replaceImage(
    oldPublicId: string | null | undefined,
    newBuffer: Buffer,
    folder: string,
    type?: 'logo' | 'cover' | 'item' | 'thumbnail'
  ): Promise<CloudinaryUploadResult> {
    const uploadResult = await this.uploadImage(newBuffer, folder, type);

    if (oldPublicId) {
      try {
        await this.deleteImage(oldPublicId);
      } catch (err) {
        console.error('Failed to destroy old Cloudinary asset:', err);
      }
    }

    return uploadResult;
  },

  /**
   * Extracts Cloudinary public ID from a given Cloudinary secure URL
   */
  extractPublicId(url: string): string | null {
    if (!url) return null;
    try {
      const parts = url.split('/image/upload/');
      if (parts.length < 2) return null;
      const pathAndExt = parts[1].replace(/^v\d+\//, ''); // Strip version prefix
      const lastDotIndex = pathAndExt.lastIndexOf('.');
      if (lastDotIndex === -1) return pathAndExt;
      return pathAndExt.substring(0, lastDotIndex);
    } catch (e) {
      return null;
    }
  },
};

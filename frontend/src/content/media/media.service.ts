import type { MediaAsset } from './media.model.js';

export const MediaService = {
  generateSrcSet(asset: MediaAsset): string | undefined {
    if (!asset.responsiveSrcSet || asset.responsiveSrcSet.length === 0) {
      return undefined;
    }
    return asset.responsiveSrcSet.map(bp => `${bp.url} ${bp.width}w`).join(', ');
  },

  formatCaption(asset: MediaAsset): string | undefined {
    if (!asset.caption && !asset.credits) return undefined;
    if (asset.caption && asset.credits?.photographer) {
      return `${asset.caption} (Photo: ${asset.credits.photographer})`;
    }
    return asset.caption || (asset.credits?.photographer ? `Photo: ${asset.credits.photographer}` : undefined);
  },

  isAccessible(asset: MediaAsset): { valid: boolean; reason?: string } {
    if (!asset.altText || asset.altText.trim().length === 0) {
      return { valid: false, reason: `Asset "${asset.id}" is missing required altText.` };
    }
    if (asset.altText.toLowerCase().includes('image') || asset.altText.toLowerCase().includes('picture')) {
      return { valid: false, reason: `Asset "${asset.id}" altText contains redundant words ("image" or "picture").` };
    }
    return { valid: true };
  }
};

export type MediaAssetType =
  | 'image'
  | 'video'
  | 'svg'
  | 'gif'
  | 'lottie'
  | 'pdf'
  | 'download';

export interface ResponsiveBreakpoint {
  width: number;
  url: string;
}

export interface MediaAsset {
  id: string;
  type: MediaAssetType;
  url: string;
  altText: string;
  caption?: string;
  credits?: {
    photographer?: string;
    source?: string;
    license?: string;
  };
  dimensions?: {
    width: number;
    height: number;
    aspectRatio?: string; // e.g. "16:9", "4:3", "1:1"
  };
  fileSizeBytes?: number;
  mimeType?: string;
  checksumSha256?: string;
  responsiveSrcSet?: ResponsiveBreakpoint[];
  lottieData?: Record<string, unknown>; // JSON animation payload
}

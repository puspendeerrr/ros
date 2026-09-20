import React, { useState } from 'react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  webpSrc?: string;
  avifSrc?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Enterprise Performance Image Component
 * Provides:
 * - Modern format delivery (AVIF -> WebP -> Fallback)
 * - Zero CLS with explicit width/height/aspectRatio reservation
 * - Native lazy loading and asynchronous decoding
 * - High priority hints for LCP candidates
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  webpSrc,
  avifSrc,
  priority = false,
  className = '',
  style,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    width: width || (aspectRatio ? '100%' : 'auto'),
    height: height || 'auto',
    aspectRatio: aspectRatio,
    ...style,
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: (style?.objectFit as any) || 'cover',
    transition: 'opacity 0.25s ease-in-out',
    opacity: isLoaded ? 1 : 0.85,
  };

  return (
    <picture style={containerStyle}>
      {/* AVIF Next-gen Format */}
      {avifSrc && <source srcSet={avifSrc} type="image/avif" />}

      {/* WebP Next-gen Format */}
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}

      {/* Standard Image with Performance Attributes */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // @ts-ignore fetchpriority is a modern browser feature
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        className={className}
        style={imgStyle}
        {...rest}
      />
    </picture>
  );
};

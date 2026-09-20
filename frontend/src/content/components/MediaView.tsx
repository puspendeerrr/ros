import React from 'react';
import type { MediaAsset } from '../media/media.model.js';
import { MediaService } from '../media/media.service.js';

export interface MediaViewProps {
  asset: MediaAsset;
  className?: string;
}

export const MediaView: React.FC<MediaViewProps> = ({ asset, className }) => {
  const formattedCaption = MediaService.formatCaption(asset);
  const srcSet = MediaService.generateSrcSet(asset);

  const renderContent = () => {
    switch (asset.type) {
      case 'video':
        return (
          <video
            controls
            aria-label={asset.altText}
            style={{ width: '100%', height: 'auto', borderRadius: '10px', display: 'block' }}
          >
            <source src={asset.url} type={asset.mimeType || 'video/mp4'} />
            Your browser does not support the video tag.
          </video>
        );

      case 'lottie':
        return (
          <div
            role="img"
            aria-label={asset.altText}
            style={{
              padding: '24px',
              background: '#F8FAFC',
              borderRadius: '10px',
              textAlign: 'center',
              border: '1px dashed #CBD5E1'
            }}
          >
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
              [Lottie Animation: {asset.altText}]
            </span>
          </div>
        );

      case 'svg':
      case 'gif':
      case 'image':
      default:
        return (
          <img
            src={asset.url}
            srcSet={srcSet}
            alt={asset.altText}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              display: 'block',
              border: '1px solid #E2E8F0'
            }}
          />
        );
    }
  };

  return (
    <figure style={{ margin: '24px 0' }} className={className}>
      {renderContent()}
      {formattedCaption && (
        <figcaption style={{
          marginTop: '8px',
          fontSize: '12.5px',
          color: '#64748B',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          {formattedCaption}
        </figcaption>
      )}
    </figure>
  );
};

import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '36px',
        background: '#EF4444',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        zIndex: 2000,
        fontSize: '13px',
        fontWeight: 600,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <WifiOff size={16} />
      <span>No Internet Connection. Serving cached layout.</span>
    </div>
  );
};

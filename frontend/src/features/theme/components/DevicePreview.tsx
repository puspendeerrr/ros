import React from 'react';
import { PublicMenuContent } from '../../../pages/PublicMenuContent';

interface DevicePreviewProps {
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  restaurant: any;
  categories: any[];
  themeConfig: any;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  deviceMode,
  restaurant,
  categories,
  themeConfig,
}) => {
  // Styles for device wrappers
  const renderContent = () => {
    return (
      <PublicMenuContent
        restaurant={restaurant}
        categories={categories}
        activeThemeConfig={themeConfig}
        previewMode={true}
      />
    );
  };

  if (deviceMode === 'mobile') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', width: '100%' }}>
        {/* Mobile Bezel Screen Frame */}
        <div
          style={{
            width: '390px',
            height: '780px',
            background: '#000000',
            borderRadius: '40px',
            padding: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '4px solid #1E293B',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Speaker / Notch */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '110px',
              height: '30px',
              background: '#000000',
              borderRadius: '20px',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Camera dot */}
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1E293B', marginLeft: 'auto', marginRight: '16px' }} />
          </div>

          {/* Screen Content Wrapper */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#F8FAFC',
              borderRadius: '30px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  if (deviceMode === 'tablet') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', width: '100%' }}>
        {/* Tablet Bezel Frame */}
        <div
          style={{
            width: '700px',
            height: '900px',
            background: '#000000',
            borderRadius: '24px',
            padding: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '4px solid #334155',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Camera lens */}
          <div
            style={{
              position: 'absolute',
              top: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#1E293B',
              zIndex: 999
            }}
          />

          {/* Screen Content */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#F8FAFC',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div style={{ width: '100%', padding: '16px', background: '#F1F5F9', borderRadius: '12px', minHeight: '800px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      {/* Desktop Browser Frame Toolbar */}
      <div
        style={{
          background: '#E2E8F0',
          borderBottom: '1px solid #CBD5E1',
          padding: '8px 16px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {/* Bullets */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
        </div>
        {/* Address bar */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '6px',
            flex: 1,
            maxWidth: '480px',
            margin: '0 auto',
            fontSize: '11px',
            color: '#64748B',
            padding: '4px 12px',
            textAlign: 'center',
            border: '1px solid #CBD5E1'
          }}
        >
          ros.algorithyum.in/r/{restaurant?.slug || 'preview'}
        </div>
      </div>

      {/* Screen Content */}
      <div
        style={{
          background: '#F8FAFC',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          height: '750px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: '1px solid #CBD5E1',
          borderTop: 'none'
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

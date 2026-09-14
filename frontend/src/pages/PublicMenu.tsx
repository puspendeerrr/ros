import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flex, Card, Result } from 'antd';
import { menuService } from '../services/menu.service.js';
import { themePresets } from '../features/theme/presets';
import { PublicMenuContent } from './PublicMenuContent';
import { useNetworkStatus } from '../pwa/useNetworkStatus';
import { OfflinePage } from '../pwa/OfflinePage';

export const getThemeStyles = (config: any) => {
  if (!config) return {};
  
  let btnRadius = '8px';
  if (config.buttonStyle === 'square') btnRadius = '0px';
  else if (config.buttonStyle === 'pill') btnRadius = '9999px';
  
  let boxShadow = '0 4px 20px rgba(15, 23, 42, 0.05)';
  if (config.shadowStyle === 'none') boxShadow = 'none';
  else if (config.shadowStyle === 'strong') boxShadow = '0 12px 30px rgba(15,23,42,0.12)';

  let spacing = '16px';
  if (config.sectionSpacing === 'compact') spacing = '8px';
  else if (config.sectionSpacing === 'luxury') spacing = '32px';

  let transition = 'none';
  if (config.animationLevel === 'subtle') transition = 'all 0.2s ease-in-out';

  return {
    '--accent-color': config.accentColor,
    '--primary-color': config.primaryColor,
    '--secondary-color': config.secondaryColor,
    '--background-color': config.backgroundColor,
    '--card-color': config.cardColor,
    '--button-color': config.buttonColor,
    '--text-color': config.textColor,
    '--font-family': config.fontFamily,
    '--font-size-scale': String(config.fontSizeScale),
    '--card-radius': config.cardRadius,
    '--button-radius': btnRadius,
    '--box-shadow': boxShadow,
    '--section-spacing': spacing,
    '--transition-style': transition,
    fontFamily: config.fontFamily,
    fontSize: `calc(16px * ${config.fontSizeScale})`,
    background: config.backgroundColor,
    transition: transition
  } as React.CSSProperties;
};

// Premium Shimmer skeleton card loader
const MenuCardSkeleton: React.FC = () => (
  <div style={{
    padding: '16px 0',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    gap: '16px',
    alignItems: 'start'
  }}>
    <div style={{ flex: 1 }}>
      <div className="shimmer-block" style={{ width: '40%', height: '16px', borderRadius: '4px', marginBottom: '8px' }} />
      <div className="shimmer-block" style={{ width: '80%', height: '12px', borderRadius: '4px', marginBottom: '6px' }} />
      <div className="shimmer-block" style={{ width: '20%', height: '14px', borderRadius: '4px' }} />
    </div>
    <div className="shimmer-block" style={{ width: '80px', height: '80px', borderRadius: '12px', flexShrink: 0 }} />
  </div>
);

export const PublicMenu: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const { isOnline } = useNetworkStatus();

  // Fetch public menu data
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-menu', restaurantSlug],
    queryFn: () => menuService.getPublicMenu(restaurantSlug || ''),
    retry: false,
  });

  const restaurant = data?.data?.restaurant;
  const categories = data?.data?.categories || [];

  if (isLoading) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 16px' }}>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .shimmer-block {
            background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
        `}</style>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Card bordered={false} style={{ borderRadius: '16px', marginBottom: '16px' }}>
            <Flex gap={16} align="center">
              <div className="shimmer-block" style={{ width: '72px', height: '72px', borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="shimmer-block" style={{ width: '60%', height: '24px', borderRadius: '4px', marginBottom: '8px' }} />
                <div className="shimmer-block" style={{ width: '40%', height: '14px', borderRadius: '4px' }} />
              </div>
            </Flex>
          </Card>
          <Card bordered={false} style={{ borderRadius: '16px' }}>
            <MenuCardSkeleton />
            <MenuCardSkeleton />
            <MenuCardSkeleton />
          </Card>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    if (!isOnline) {
      return <OfflinePage />;
    }
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <Card bordered={false} style={{ borderRadius: '16px', maxWidth: '480px', textAlign: 'center', boxShadow: '0 4px 20px rgba(15,23,42,0.05)' }}>
          <Result
            status="404"
            title="Menu Not Found"
            subTitle="The restaurant link you requested does not exist or may be currently inactive."
          />
        </Card>
      </div>
    );
  }

  const preset = themePresets.find((p) => p.id === restaurant?.themeId) || themePresets[0];
  const activeThemeConfig = restaurant?.themeConfig 
    ? { ...preset.config, ...restaurant.themeConfig }
    : preset.config;

  return (
    <PublicMenuContent
      restaurant={restaurant}
      categories={categories}
      activeThemeConfig={activeThemeConfig}
      previewMode={false}
    />
  );
};

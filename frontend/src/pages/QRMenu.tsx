import React, { useState, useEffect } from 'react';
import { Flex, Spin } from 'antd';
import { useQRStudio } from '../features/qr-studio/hooks/useQRStudio';
import { QRStudioDesktop } from '../features/qr-studio/desktop/QRStudioDesktop';
import { QRStudioMobile } from '../features/qr-studio/mobile/QRStudioMobile';

export const QRMenu: React.FC = () => {
  const qrStudioData = useQRStudio();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (qrStudioData.isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" tip="Initializing QR Studio..." />
      </Flex>
    );
  }

  return isMobile ? (
    <QRStudioMobile qrStudioData={qrStudioData} />
  ) : (
    <QRStudioDesktop qrStudioData={qrStudioData} />
  );
};

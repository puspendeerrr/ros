import React from 'react';
import { WifiOff, RotateCw, Home } from 'lucide-react';
import { Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const OfflinePage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#F8FAFC',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          maxWidth: '440px',
          width: '100%',
          border: '1px solid #F1F5F9',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            color: '#D97706',
          }}
        >
          <WifiOff size={40} />
        </div>

        <Title level={3} style={{ margin: '0 0 12px 0', color: '#0F172A', fontWeight: 700 }}>
          No Internet Connection
        </Title>
        
        <Paragraph style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
          This page hasn't been cached yet. Reconnect to the internet and click retry to load the content.
        </Paragraph>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            type="primary"
            size="large"
            icon={<RotateCw size={16} />}
            onClick={handleRetry}
            style={{
              background: '#F97316',
              borderColor: '#F97316',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            Retry Connection
          </Button>

          <Button
            type="text"
            size="large"
            icon={<Home size={16} />}
            onClick={handleGoHome}
            style={{
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#475569',
            }}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
export default OfflinePage;

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button, Card, Typography } from 'antd';
import { usePWA } from './usePWA';

const { Text } = Typography;

export const UpdatePrompt: React.FC = () => {
  const { needsUpdate, updateNow } = usePWA();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (needsUpdate) {
      setVisible(true);
    }
  }, [needsUpdate]);

  useEffect(() => {
    // Multi-Tab Update Synchronizer using BroadcastChannel API
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('ros-pwa-channel');
      
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_TRIGGERED') {
          if (import.meta.env.DEV) {
            console.log('[PWA] Multi-tab update event received. Forcing reload...');
          }
          // Reload other tabs to load the latest service worker state immediately
          window.location.reload();
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  const handleUpdate = () => {
    // Send message to other tabs via BroadcastChannel before applying reload
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('ros-pwa-channel');
      channel.postMessage({ type: 'SW_UPDATE_TRIGGERED' });
    }
    
    updateNow();
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999, // Floating overlay priority
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        animation: 'slideInRightPrompt 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <style>{`
        @keyframes slideInRightPrompt {
          from { transform: translateX(120%); }
          to { transform: translateX(0); }
        }
      `}</style>
      
      <Card
        style={{
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '2px solid #F97316', // Vibrant orange brand accent
          background: '#FFFFFF'
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFEFE6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', flexShrink: 0 }}>
            <RefreshCw size={20} className="spin-icon-pwa" />
          </div>
          <style>{`
            .spin-icon-pwa {
              animation: spinPwa 4s linear infinite;
            }
            @keyframes spinPwa {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          
          <div style={{ flex: 1 }}>
            <Text strong style={{ display: 'block', fontSize: '14px', color: '#0F172A' }}>
              New Version Available
            </Text>
            <Text type="secondary" style={{ display: 'block', fontSize: '11px', marginBottom: '8px' }}>
              Update now to get the latest features and optimizations.
            </Text>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button size="small" type="text" onClick={handleClose} style={{ borderRadius: '6px', fontSize: '11px', color: '#64748B' }}>
                Later
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={handleUpdate}
                style={{
                  borderRadius: '6px',
                  background: '#F97316',
                  borderColor: '#F97316',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                Update Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default UpdatePrompt;

import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { Button, Card, Typography } from 'antd';
import type { BeforeInstallPromptEvent } from './pwa.types';

const { Text, Title, Paragraph } = Typography;

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Detect mobile layout size
    const checkDevice = () => {
      setIsMobileDevice(window.innerWidth <= 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser default mini-infobar
      e.preventDefault();
      
      // Store event so it can be triggered later
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Check 7-day dismissal cooldown
      const dismissedAt = localStorage.getItem('pwa-install-dismissed-at');
      const isDismissedRecently = dismissedAt 
        ? Date.now() - parseInt(dismissedAt, 10) < 7 * 24 * 60 * 60 * 1000 // 7 days in ms
        : false;

      // Check if already in standalone display mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      if (!isDismissedRecently && !isStandalone) {
        setIsVisible(true);
        if (import.meta.env.DEV) {
          console.log('[PWA] beforeinstallprompt event captured. Install prompt banner ready.');
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show native prompt
    await deferredPrompt.prompt();
    
    // Wait for choice outcome
    const { outcome } = await deferredPrompt.userChoice;
    
    if (import.meta.env.DEV) {
      console.log(`[PWA] Install Prompt user choice outcome: ${outcome}`);
    }

    // Clear saved event
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed-at', Date.now().toString());
    setIsVisible(false);
  };

  if (!isVisible || !deferredPrompt) return null;

  if (isMobileDevice) {
    // Mobile bottom sheet layout
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '24px 20px calc(24px + env(safe-area-inset-bottom)) 20px',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'slideUpPrompt 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <style>{`
          @keyframes slideUpPrompt {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316' }}>
              <Smartphone size={24} />
            </div>
            <div>
              <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
                Add to Home Screen
              </Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Install Restaurant OS for a faster app-like menu experience.
              </Text>
            </div>
          </div>
          <Button 
            type="text" 
            shape="circle" 
            icon={<X size={16} />} 
            onClick={handleDismiss} 
            style={{ color: '#64748B' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            onClick={handleDismiss}
            style={{ flex: 1, height: '44px', borderRadius: '8px', fontWeight: 600, color: '#475569' }}
          >
            Not Now
          </Button>
          <Button
            type="primary"
            icon={<Download size={16} />}
            onClick={handleInstallClick}
            style={{
              flex: 2,
              height: '44px',
              borderRadius: '8px',
              background: '#F97316',
              borderColor: '#F97316',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Install App
          </Button>
        </div>
      </div>
    );
  }

  // Desktop floating card banner (bottom left)
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9999,
        maxWidth: '380px',
        animation: 'slideInLeftPrompt 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <style>{`
        @keyframes slideInLeftPrompt {
          from { transform: translateX(-120%); }
          to { transform: translateX(0); }
        }
      `}</style>
      
      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E2E8F0',
          background: '#FFFFFF'
        }}
        bodyStyle={{ padding: '20px' }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', flexShrink: 0 }}>
            <Monitor size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Title level={5} style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                Install Restaurant OS
              </Title>
              <Button 
                type="text" 
                size="small"
                shape="circle" 
                icon={<X size={14} />} 
                onClick={handleDismiss} 
                style={{ color: '#94A3B8', marginTop: '-4px', marginRight: '-4px' }}
              />
            </div>
            <Paragraph style={{ color: '#64748B', fontSize: '12px', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Install the app on your desktop for quick launch, offline support, and full window access.
            </Paragraph>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button size="small" onClick={handleDismiss} style={{ borderRadius: '6px', fontSize: '12px' }}>
                Dismiss
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<Download size={12} />}
                onClick={handleInstallClick}
                style={{
                  borderRadius: '6px',
                  background: '#F97316',
                  borderColor: '#F97316',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Install
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default InstallPrompt;

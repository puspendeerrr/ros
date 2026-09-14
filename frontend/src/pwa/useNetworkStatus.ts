import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import type { NetworkStatus } from './pwa.types';

export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    connectionType: 'unknown',
  });

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const initNativeNetwork = async () => {
        try {
          const currentStatus = await Network.getStatus();
          setStatus({
            isOnline: currentStatus.connected,
            connectionType: currentStatus.connectionType as NetworkStatus['connectionType'],
          });
        } catch (e) {
          console.warn('[PWA] Failed to get Capacitor network status, falling back to browser', e);
        }
      };

      initNativeNetwork();

      const handler = Network.addListener('networkStatusChange', (currentStatus) => {
        if (import.meta.env.DEV) {
          console.log(`[PWA] Network status changed (Native): ${currentStatus.connected ? 'ONLINE' : 'OFFLINE'}`);
        }
        setStatus({
          isOnline: currentStatus.connected,
          connectionType: currentStatus.connectionType as NetworkStatus['connectionType'],
        });
      });

      return () => {
        handler.then((h) => h.remove());
      };
    } else {
      const handleOnline = () => {
        if (import.meta.env.DEV) console.log('[PWA] Network status changed (Browser): ONLINE');
        setStatus({ isOnline: true, connectionType: 'wifi' });
      };

      const handleOffline = () => {
        if (import.meta.env.DEV) console.log('[PWA] Network status changed (Browser): OFFLINE');
        setStatus({ isOnline: false, connectionType: 'none' });
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      setStatus({
        isOnline: navigator.onLine,
        connectionType: navigator.onLine ? 'wifi' : 'none',
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return status;
};

import { useRegisterSW } from 'virtual:pwa-register/react';
import { Capacitor } from '@capacitor/core';

export const usePWA = () => {
  const isNative = Capacitor.isNativePlatform();

  // On native Capacitor, skip SW entirely and return no-op state
  if (isNative) {
    return {
      needsUpdate: false,
      offlineReady: false,
      updateNow: async () => {},
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {
    needRefresh: [needsUpdate],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      console.error('[PWA] Service Worker registration failed:', error);
    },
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      if (r && import.meta.env.DEV) {
        console.log('[PWA] Service Worker registered successfully.');
      }
    },
  });

  const updateNow = async () => {
    if (import.meta.env.DEV) {
      console.log('[PWA] Updating Service Worker now, reload triggered...');
    }
    await updateServiceWorker(true);
  };

  return { needsUpdate, offlineReady, updateNow };
};

export default usePWA;

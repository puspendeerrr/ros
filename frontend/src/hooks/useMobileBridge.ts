import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

export const useMobileBridge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if running on a native platform (Android/iOS)
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      // 1. Configure Status Bar
      StatusBar.setStyle({ style: Style.Dark }).catch((err) => {
        console.warn('Status bar styling not supported:', err);
      });
      
      // Set background color to match dark app headers (#0F172A)
      StatusBar.setBackgroundColor({ color: '#0F172A' }).catch((err) => {
        console.warn('Status bar background color not supported:', err);
      });

      // 2. Configure Hardware Back Button
      const backButtonListener = App.addListener('backButton', (data) => {
        if (!data.canGoBack || location.pathname === '/dashboard' || location.pathname === '/login') {
          // If on main screen or login, exit app
          App.exitApp();
        } else {
          // Otherwise, perform native back navigation
          navigate(-1);
        }
      });

      return () => {
        backButtonListener.then((listener) => listener.remove());
      };
    }
  }, [location, navigate]);

  useEffect(() => {
    // 3. Network connection monitoring
    const initNetwork = async () => {
      try {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
      } catch (err) {
        console.warn('Network API not supported:', err);
      }
    };

    initNetwork();

    const networkListener = Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
      if (!status.connected) {
        triggerHaptic(ImpactStyle.Heavy);
      } else {
        triggerHaptic(ImpactStyle.Light);
      }
    });

    return () => {
      networkListener.then((listener) => listener.remove());
    };
  }, []);

  /**
   * Trigger native haptic feedback response
   */
  const triggerHaptic = async (style = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (err) {
        // Ignored if haptics fail
      }
    }
  };

  return { isOnline, triggerHaptic };
};

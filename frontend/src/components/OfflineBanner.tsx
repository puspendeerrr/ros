import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNetworkStatus } from '../pwa/useNetworkStatus';
import { useNetworkStore } from '../store/network.store.js';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const { isBackendOnline, isTimeout, isAuthExpired, isServerError } = useNetworkStore();
  
  const [show, setShow] = useState(false);
  const [hasOfflineBeenTriggered, setHasOfflineBeenTriggered] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  const isAppDisconnected = !isOnline || !isBackendOnline || isAuthExpired;

  useEffect(() => {
    if (isAppDisconnected) {
      setIsRestored(false);
      setHasOfflineBeenTriggered(true);
      setShow(true);
    } else if (!isAppDisconnected && hasOfflineBeenTriggered) {
      setIsRestored(true);
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setIsRestored(false);
        setHasOfflineBeenTriggered(false);
      }, 4000); // Show connection restored banner for 4s
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isAppDisconnected, hasOfflineBeenTriggered]);

  if (!show) return null;

  let bg = '#EF4444'; // Red for offline/error
  let text = "You're Offline. Changes will sync automatically once internet returns.";
  let Icon = WifiOff;
  let isPending = false;

  if (isRestored) {
    bg = '#10B981'; // Green for restored
    text = 'Connected. Syncing latest changes...';
    Icon = Wifi;
  } else if (!isOnline) {
    bg = '#EF4444';
    text = "You're Offline. Changes will sync automatically once internet returns.";
    Icon = WifiOff;
  } else if (isAuthExpired) {
    bg = '#F97316'; // Orange for auth expired
    text = 'Session expired. Please log in again.';
    Icon = AlertTriangle;
  } else if (!isBackendOnline) {
    isPending = true;
    if (isTimeout) {
      bg = '#F97316'; // Orange
      text = 'Connection timeout. Reconnecting to server...';
      Icon = RefreshCw;
    } else if (isServerError) {
      bg = '#EF4444'; // Red
      text = 'Server error. Reconnecting to server...';
      Icon = RefreshCw;
    } else {
      bg = '#EAB308'; // Yellow/Orange
      text = 'Connecting to server (Render instance waking up)...';
      Icon = RefreshCw;
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '40px',
        background: bg,
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        zIndex: 9999, // Ensure it floats above menus/headers/sidebars
        fontSize: '13px',
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        paddingTop: 'env(safe-area-inset-top)',
        transition: 'background-color 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: 'slideDownBanner 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <style>{`
        @keyframes slideDownBanner {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Icon 
        size={16} 
        style={isPending ? { animation: 'spin 1.5s linear infinite' } : undefined} 
      />
      <span>{text}</span>
    </div>
  );
};

export default OfflineBanner;


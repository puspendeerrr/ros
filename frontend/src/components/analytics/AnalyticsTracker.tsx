import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics.ts';

/**
 * Headless SPA Route Analytics Tracker
 * Automatically tracks page_view events across client-side navigations,
 * including path, query string, and hash. Deduplicates consecutive duplicate visits.
 */
export const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const fullPath = `${location.pathname}${location.search}${location.hash}`;

      // Prevent duplicate triggers for unchanged path
      if (lastTrackedPathRef.current !== fullPath) {
        lastTrackedPathRef.current = fullPath;
        trackPageView(fullPath);
      }
    } catch {
      // Analytics must never throw runtime errors or interrupt rendering
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
};

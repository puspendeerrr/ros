/**
 * Enterprise Multi-Provider Analytics Engine
 * Features:
 * - Multi-Provider architecture (GA4 active, extensible to Clarity, GTM, Meta Pixel)
 * - Google Consent Mode v2 & Cookie Consent enforcement
 * - Environment detection (Live in Production, testMode/debug in Dev)
 * - Development Debug Mode with styled console logs
 * - Automatic User Properties injection
 * - Central Event Constants registry
 * - Lossless FIFO Event Queue
 * - Automatic Core Web Vitals tracking (LCP, CLS, INP, FCP, TTFB)
 * - Global Uncaught Error & Promise Rejection tracking
 * - Correlation Session, Page, and Navigation IDs
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { AnalyticsEvents, AnalyticsCategories } from './analytics-events.ts';
import { GA4Provider } from './providers/ga4.provider.ts';
import type {
  AnalyticsProvider,
  AnalyticsEventPayload,
  PageViewPayload,
  SessionContext,
  UserProperties,
  InitializeAnalyticsOptions,
} from './analytics-types.ts';

export * from './analytics-events.ts';
export * from './analytics-types.ts';

// ---------------------------------------------------------------------------
// Internal State
// ---------------------------------------------------------------------------

type QueuedItem =
  | { type: 'page_view'; payload: PageViewPayload }
  | { type: 'event'; payload: AnalyticsEventPayload };

const providers: AnalyticsProvider[] = [new GA4Provider()];
const eventQueue: QueuedItem[] = [];

let isInitialized = false;
let isDebug = false;
let globalListenersAttached = false;

const isProduction = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.PROD);
const measurementId = typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_GA_MEASUREMENT_ID as string | undefined) : undefined;

// Session & Navigation correlation state
const sessionContext: SessionContext = {
  sessionId: initSessionId(),
  pageId: generateId('page'),
  navigationId: 0,
};

function initSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  try {
    const existing = window.sessionStorage.getItem('ros_analytics_session_id');
    if (existing) return existing;
    const fresh = generateId('session');
    window.sessionStorage.setItem('ros_analytics_session_id', fresh);
    return fresh;
  } catch {
    return generateId('session');
  }
}

function generateId(prefix: string): string {
  const rand = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${Date.now()}_${rand}`;
}

// ---------------------------------------------------------------------------
// Debug Logging Helper
// ---------------------------------------------------------------------------

function logDebug(type: string, ...details: unknown[]): void {
  if (!isDebug || typeof console === 'undefined') return;
  console.info(
    `%c[GA Debug] %c${type}`,
    'background: #3B82F6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
    'color: #2563EB; font-weight: bold;',
    ...details
  );
}

// ---------------------------------------------------------------------------
// Consent Management
// ---------------------------------------------------------------------------

const CONSENT_STORAGE_KEY = 'ros_cookie_consent';

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const consent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    // Defaults to true for basic non-sensitive analytics unless explicitly denied
    return consent !== 'denied';
  } catch {
    return true;
  }
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
    logDebug('Consent Updated', { granted });

    if (granted && isInitialized) {
      flushQueue();
    }
  } catch {
    // Fail silently
  }
}

// ---------------------------------------------------------------------------
// Provider Registry
// ---------------------------------------------------------------------------

export function registerProvider(provider: AnalyticsProvider): void {
  providers.push(provider);
  if (isInitialized) {
    provider.initialize({
      measurementId,
      isProduction,
      debug: isDebug,
    });
  }
}

// ---------------------------------------------------------------------------
// Event Queue
// ---------------------------------------------------------------------------

function queueItem(item: QueuedItem): void {
  eventQueue.push(item);
  logDebug('Event Queued', item);
}

function flushQueue(): void {
  if (eventQueue.length === 0) return;
  logDebug(`Flushing Queue (${eventQueue.length} items)`);

  while (eventQueue.length > 0) {
    const item = eventQueue.shift();
    if (!item) break;

    if (item.type === 'page_view') {
      providers.forEach((p) => p.trackPageView(item.payload, sessionContext));
    } else {
      providers.forEach((p) => p.trackEvent(item.payload, sessionContext));
    }
  }
}

// ---------------------------------------------------------------------------
// Core Web Vitals Listener
// ---------------------------------------------------------------------------

function setupWebVitalsTracking(): void {
  const reportMetric = (metric: Metric): void => {
    try {
      const roundedValue = Math.round(metric.value);
      trackTiming('Web Vitals', metric.name, roundedValue, metric.rating);
      trackEvent(AnalyticsEvents.WEB_VITAL, AnalyticsCategories.PERFORMANCE, metric.name, roundedValue, false, {
        rating: metric.rating,
        delta: Math.round(metric.delta),
        metric_id: metric.id,
        navigation_type: metric.navigationType,
      });
    } catch {
      // Fail silently
    }
  };

  try {
    onCLS(reportMetric);
    onFCP(reportMetric);
    onINP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  } catch (error) {
    logDebug('Web Vitals Setup Error', error);
  }
}

// ---------------------------------------------------------------------------
// Global Error Tracking
// ---------------------------------------------------------------------------

function setupGlobalErrorTracking(): void {
  if (globalListenersAttached || typeof window === 'undefined') return;
  globalListenersAttached = true;

  window.addEventListener('error', (event) => {
    try {
      trackException(event.error || event.message, false);
    } catch {
      // Prevent recursion
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      trackException(reason instanceof Error ? reason : String(reason || 'Unhandled Promise Rejection'), false);
    } catch {
      // Prevent recursion
    }
  });
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

export function initializeAnalytics(options?: InitializeAnalyticsOptions): void {
  if (typeof window === 'undefined' || isInitialized) return;

  const consentActive = options?.enabled !== undefined ? options.enabled : hasAnalyticsConsent();
  isDebug = options?.debug !== undefined ? options.debug : !isProduction;

  if (isDebug) {
    window.__GA_DEBUG__ = true;
    console.info(
      '%c[Restaurant OS Analytics Hub] Initializing in DEBUG mode...',
      'background: #1E293B; color: #38BDF8; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    );
  }

  // Safely exit if no Measurement ID is configured
  if (!measurementId) {
    logDebug('Initialization Aborted: No VITE_GA_MEASUREMENT_ID found.');
    return;
  }

  // Initialize all registered providers
  providers.forEach((provider) => {
    try {
      provider.initialize({
        measurementId,
        isProduction,
        debug: isDebug,
      });
    } catch (err) {
      logDebug(`Provider [${provider.name}] init error`, err);
    }
  });

  // Inject standard enterprise user properties
  const userProperties: UserProperties = {
    platform: 'web',
    app_name: 'Restaurant OS',
    app_version: '1.0.0',
    environment: isProduction ? 'production' : 'development',
    language: typeof navigator !== 'undefined' ? navigator.language : 'en',
    timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined,
  };

  providers.forEach((provider) => {
    try {
      provider.setUserProperties(userProperties);
    } catch {
      // Fail silently
    }
  });

  isInitialized = true;

  // Set up telemetry listeners
  setupWebVitalsTracking();
  setupGlobalErrorTracking();

  // If consent is already granted, flush any pending actions
  if (consentActive) {
    flushQueue();
  }
}

// ---------------------------------------------------------------------------
// Public Tracking API
// ---------------------------------------------------------------------------

export function trackPageView(
  path: string,
  title?: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === 'undefined') return;

  // Advance route correlation context
  sessionContext.pageId = generateId('page');
  sessionContext.navigationId += 1;

  const payload: PageViewPayload = {
    path,
    title: title || (typeof document !== 'undefined' ? document.title : ''),
    params,
  };

  logDebug('page_view', payload.path, {
    title: payload.title,
    pageId: sessionContext.pageId,
    navigationId: sessionContext.navigationId,
  });

  if (!isInitialized || !hasAnalyticsConsent()) {
    queueItem({ type: 'page_view', payload });
    return;
  }

  providers.forEach((provider) => {
    try {
      provider.trackPageView(payload, sessionContext);
    } catch (err) {
      logDebug(`Provider [${provider.name}] page_view error`, err);
    }
  });
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
  additionalParams?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === 'undefined') return;

  const payload: AnalyticsEventPayload = {
    action,
    category,
    label,
    value,
    nonInteraction,
    params: additionalParams,
  };

  logDebug('event', payload);

  if (!isInitialized || !hasAnalyticsConsent()) {
    queueItem({ type: 'event', payload });
    return;
  }

  providers.forEach((provider) => {
    try {
      provider.trackEvent(payload, sessionContext);
    } catch (err) {
      logDebug(`Provider [${provider.name}] event error`, err);
    }
  });
}

export function trackOutboundLink(url: string): void {
  trackEvent(AnalyticsEvents.OUTBOUND_LINK, AnalyticsCategories.ENGAGEMENT, url, undefined, false, {
    outbound_url: url,
  });
}

export function trackException(error: unknown, fatal = false): void {
  let message = 'Unknown Error';
  let stack: string | undefined;

  if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  } else if (typeof error === 'string') {
    message = error;
  }

  trackEvent(AnalyticsEvents.EXCEPTION, AnalyticsCategories.SYSTEM, message, undefined, true, {
    fatal,
    error_stack: stack ? stack.substring(0, 500) : undefined,
  });
}

export function trackTiming(category: string, variable: string, value: number, label?: string): void {
  trackEvent(AnalyticsEvents.TIMING, category, variable, value, false, {
    timing_label: label,
    timing_ms: value,
  });
}

// ---------------------------------------------------------------------------
// Standard High-Level Event Helpers (Consistent Naming & Typo Prevention)
// ---------------------------------------------------------------------------

export function trackCtaClick(label: string, location?: string): void {
  trackEvent(AnalyticsEvents.CTA_CLICK, AnalyticsCategories.ENGAGEMENT, label, undefined, false, {
    cta_location: location,
  });
}

export function trackDashboardButtonClick(label = 'Dashboard'): void {
  trackEvent(AnalyticsEvents.DASHBOARD_CLICK, AnalyticsCategories.NAVIGATION, label);
}

export function trackGetStartedClick(location?: string): void {
  trackEvent(AnalyticsEvents.GET_STARTED_CLICK, AnalyticsCategories.CONVERSION, 'Get Started', undefined, false, {
    source_location: location,
  });
}

export function trackContactFormSubmit(formName = 'Contact Form', success = true): void {
  trackEvent(AnalyticsEvents.CONTACT_FORM_SUBMIT, AnalyticsCategories.FORM, formName, undefined, false, {
    form_success: success,
  });
}

export function trackQrMenuDemo(source?: string): void {
  trackEvent(AnalyticsEvents.QR_MENU_DEMO, AnalyticsCategories.ENGAGEMENT, 'QR Menu Demo', undefined, false, {
    source,
  });
}

export function trackPricingCtaClick(planName: string, billingCycle?: string): void {
  trackEvent(AnalyticsEvents.PRICING_CTA_CLICK, AnalyticsCategories.CONVERSION, planName, undefined, false, {
    plan: planName,
    billing_cycle: billingCycle,
  });
}

export function trackDocsSearch(query: string, resultCount?: number): void {
  trackEvent(AnalyticsEvents.DOCS_SEARCH, AnalyticsCategories.ENGAGEMENT, query, resultCount, false, {
    search_term: query,
    result_count: resultCount,
  });
}

export function trackFeatureNavigation(featureName: string, source?: string): void {
  trackEvent(AnalyticsEvents.FEATURE_NAVIGATION, AnalyticsCategories.NAVIGATION, featureName, undefined, false, {
    feature: featureName,
    source,
  });
}

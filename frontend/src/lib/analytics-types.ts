/**
 * Enterprise Analytics Types & Multi-Provider Contracts
 * Zero `any` types. Strict TypeScript enforcement.
 */

declare global {
  interface Window {
    __GA_DEBUG__?: boolean;
  }
}

export interface SessionContext {
  sessionId: string;
  pageId: string;
  navigationId: number;
}

export interface UserProperties {
  platform: string;
  app_name: string;
  app_version: string;
  environment: string;
  language: string;
  timezone?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface AnalyticsEventPayload {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface PageViewPayload {
  path: string;
  title?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ProviderInitOptions {
  measurementId?: string;
  isProduction: boolean;
  debug: boolean;
}

export interface AnalyticsProvider {
  readonly name: string;
  initialize(options: ProviderInitOptions): void | Promise<void>;
  trackPageView(payload: PageViewPayload, session: SessionContext): void;
  trackEvent(payload: AnalyticsEventPayload, session: SessionContext): void;
  setUserProperties(properties: UserProperties): void;
}

export interface InitializeAnalyticsOptions {
  enabled?: boolean;
  debug?: boolean;
}

/**
 * Google Analytics 4 (GA4) Provider Implementation
 * Encapsulates react-ga4 with fail-safe error handling and strict typing.
 */

import ReactGA from 'react-ga4';
import type {
  AnalyticsProvider,
  ProviderInitOptions,
  PageViewPayload,
  AnalyticsEventPayload,
  SessionContext,
  UserProperties,
} from '../analytics-types.ts';

export class GA4Provider implements AnalyticsProvider {
  public readonly name = 'GA4';
  private initialized = false;

  public initialize(options: ProviderInitOptions): void {
    if (this.initialized) return;
    if (!options.measurementId) {
      if (options.debug) {
        console.warn('[GA4 Provider] Missing Measurement ID. Skipping initialization.');
      }
      return;
    }

    try {
      // In development/test mode, react-ga4 testMode prevents live hits to GA
      ReactGA.initialize(options.measurementId, {
        testMode: !options.isProduction,
      });
      this.initialized = true;

      if (options.debug) {
        console.info(
          `%c[GA4 Provider] Initialized with ID: ${options.measurementId} (${options.isProduction ? 'Live' : 'Test Mode'})`,
          'color: #10B981; font-weight: bold;'
        );
      }
    } catch (error) {
      if (options.debug) {
        console.error('[GA4 Provider] Initialization error:', error);
      }
    }
  }

  public setUserProperties(properties: UserProperties): void {
    if (!this.initialized) return;
    try {
      ReactGA.set(properties);
    } catch (error) {
      // Fail silently
    }
  }

  public trackPageView(payload: PageViewPayload, session: SessionContext): void {
    if (!this.initialized) return;
    try {
      ReactGA.send({
        hitType: 'pageview',
        page: payload.path,
        title: payload.title || (typeof document !== 'undefined' ? document.title : ''),
        sessionId: session.sessionId,
        pageId: session.pageId,
        navigationId: session.navigationId,
        ...payload.params,
      });
    } catch (error) {
      // Fail silently
    }
  }

  public trackEvent(payload: AnalyticsEventPayload, session: SessionContext): void {
    if (!this.initialized) return;
    try {
      ReactGA.event(
        {
          category: payload.category,
          action: payload.action,
          label: payload.label,
          value: payload.value,
          nonInteraction: payload.nonInteraction,
        },
        {
          sessionId: session.sessionId,
          pageId: session.pageId,
          navigationId: session.navigationId,
          ...payload.params,
        }
      );
    } catch (error) {
      // Fail silently
    }
  }
}

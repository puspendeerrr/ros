/**
 * Central Analytics Events & Categories Registry
 * Eliminates typographical errors and establishes unified enterprise taxonomy.
 */

export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  GET_STARTED_CLICK: 'get_started_click',
  DASHBOARD_CLICK: 'dashboard_click',
  PRICING_VIEW: 'pricing_view',
  PRICING_CTA_CLICK: 'pricing_cta_click',
  FEATURE_VIEW: 'feature_view',
  FEATURE_NAVIGATION: 'feature_navigation',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  QR_MENU_DEMO: 'qr_menu_demo',
  SEARCH: 'search',
  DOCS_SEARCH: 'docs_search',
  OUTBOUND_LINK: 'outbound_link',
  EXCEPTION: 'exception',
  WEB_VITAL: 'web_vital',
  TIMING: 'timing',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export const AnalyticsCategories = {
  NAVIGATION: 'navigation',
  ENGAGEMENT: 'engagement',
  CONVERSION: 'conversion',
  PERFORMANCE: 'performance',
  SYSTEM: 'system',
  FORM: 'form',
} as const;

export type AnalyticsCategory = (typeof AnalyticsCategories)[keyof typeof AnalyticsCategories];

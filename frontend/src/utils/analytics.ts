/**
 * Enterprise Web Analytics & Telemetry Loader with Consent Mode v2
 * Environment-variable driven placeholders for:
 * 1. Google Analytics 4 (GA4) -> VITE_GA_MEASUREMENT_ID
 * 2. Microsoft Clarity -> VITE_CLARITY_ID
 * 3. Cloudflare Web Analytics -> VITE_CLOUDFLARE_ANALYTICS_TOKEN
 * 
 * Supports Google Consent Mode v2 architecture with default privacy-first states
 * and a modular consent update interface for future cookie banners.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

export interface ConsentPreferences {
  analytics?: boolean;
  marketing?: boolean;
}

/**
 * Initialize Google Consent Mode v2 with privacy-first defaults
 */
function initializeConsentMode(): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
  }

  // Default to denied for EU/Global privacy compliance (Consent Mode v2)
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });
}

export function initializeAnalytics(): void {
  if (typeof window === 'undefined') return;

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const clarityId = import.meta.env.VITE_CLARITY_ID;
  const cfToken = import.meta.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN;

  // Initialize consent mode defaults first
  initializeConsentMode();

  // 1. Google Analytics 4
  if (gaId && !document.getElementById('ga-gtag-script')) {
    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);

    window.gtag!('js', new Date());
    window.gtag!('config', gaId, {
      send_page_view: true,
      anonymize_ip: true,
    });
    console.info('[Analytics] Google Analytics 4 initialized with Consent Mode v2.');
  }

  // 2. Microsoft Clarity
  if (clarityId && !document.getElementById('clarity-script')) {
    const script = document.createElement('script');
    script.id = 'clarity-script';
    script.type = 'text/javascript';
    script.async = true;
    script.textContent = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${encodeURIComponent(clarityId)}");
    `;
    document.head.appendChild(script);
    console.info('[Analytics] Microsoft Clarity initialized.');
  }

  // 3. Cloudflare Web Analytics
  if (cfToken && !document.getElementById('cloudflare-analytics-script')) {
    const script = document.createElement('script');
    script.id = 'cloudflare-analytics-script';
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token: cfToken }));
    document.head.appendChild(script);
    console.info('[Analytics] Cloudflare Analytics initialized.');
  }
}

/**
 * Update consent preferences (called when user grants/denies consent)
 */
export function updateConsent(preferences: ConsentPreferences): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
    });
    console.info('[Analytics] Consent preferences updated:', preferences);
  }
}

/**
 * Custom telemetry event logger
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

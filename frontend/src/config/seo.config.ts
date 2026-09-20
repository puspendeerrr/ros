/**
 * Centralized SEO, AEO & GEO Configuration
 * Single source of truth for site-wide metadata, canonical origins,
 * Knowledge Graph entities, social graph representations, and route SEO defaults.
 */

export interface PageMetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  type?: 'website' | 'article' | 'profile';
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export const SITE_CONFIG = {
  name: 'Restaurant OS',
  legalName: 'Restaurant OS Inc.',
  shortName: 'Restaurant OS',
  tagline: 'Run Your Restaurant Like a Tech Company',
  origin: 'https://ros.algorithyum.in',
  defaultLocale: 'en_IN',
  locales: ['en_IN', 'en_US', 'en'],
  themeColor: '#F97316',
  backgroundColor: '#0F172A',
  contactEmail: 'support@ros.algorithyum.in',
  salesEmail: 'contact@ros.algorithyum.in',
  twitterHandle: '@restaurantos',
  defaultOgImage: '/assets/logo.png',
  defaultAuthor: 'Restaurant OS Engineering Team',
  defaultPublisher: 'Restaurant OS',
  foundingDate: '2024-01-01',
  operatingSystem: 'All Modern Web Browsers, iOS, Android, macOS, Windows',
  category: 'BusinessApplication',
  pricingOffer: {
    price: '0',
    currency: 'INR',
    priceValidUntil: '2027-12-31',
    availability: 'https://schema.org/InStock',
  },
  knowsAbout: [
    'Restaurant Management Software',
    'QR Code Menus',
    'Digital Menu Systems',
    'Contactless Dining',
    'Cloud-Hosted Digital Menus',
    'Hospitality Point of Sale',
    'Commission-Free Restaurant Technology',
    'Dynamic Table Stand QR Generation'
  ],
  socialProfiles: [
    'https://twitter.com/restaurantos',
    'https://linkedin.com/company/restaurant-os',
    'https://github.com/puspendeerrr/ros'
  ]
} as const;

/**
 * Route-specific metadata registry for all public pages
 */
export const ROUTE_METADATA: Record<string, PageMetadataConfig> = {
  '/': {
    title: 'Run Your Restaurant Like a Tech Company | Free QR Menu & Digital Catalog',
    description: 'Restaurant OS gives restaurants commission-free digital QR menus, dynamic table stands, real-time catalog syncing, and branded storefronts in under 5 minutes.',
    keywords: [
      'Restaurant OS',
      'QR menu generator',
      'digital menu for restaurants',
      'commission free restaurant menu',
      'contactless dining India',
      'table QR stand',
      'restaurant POS system',
      'digital catalog for cafes'
    ],
    canonicalPath: '/',
    type: 'website',
  },
  '/features': {
    title: 'Features — Dynamic QR Stands, Menu Builder & Cloud Hosting',
    description: 'Explore enterprise-grade features: dynamic vector QR stands, real-time instant menu editor, brand profiles, and edge-hosted public dining pages.',
    keywords: [
      'Restaurant OS features',
      'dynamic QR code stand',
      'real-time menu builder',
      'restaurant brand profile',
      'cloud-hosted menus',
      'offline menu cache'
    ],
    canonicalPath: '/features',
    type: 'website',
  },
  '/about': {
    title: 'About Us — 0% Commission Hospitality Platform Mission',
    description: 'Learn about Restaurant OS mission to empower cafes and restaurants with commission-free digital operating systems and rapid 5-minute onboarding.',
    keywords: [
      'About Restaurant OS',
      'restaurant tech mission',
      'commission free restaurant software',
      'hospitality technology'
    ],
    canonicalPath: '/about',
    type: 'website',
  },
  '/contact': {
    title: 'Contact Sales & Enterprise Support',
    description: 'Contact our restaurant onboarding specialists for franchise setups, custom vector QR templates, and dedicated integration assistance.',
    keywords: [
      'Contact Restaurant OS',
      'restaurant tech support',
      'sales inquiry',
      'franchise menu onboarding'
    ],
    canonicalPath: '/contact',
    type: 'website',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Understand how Restaurant OS protects merchant data, authentication cookies, analytics telemetry, and customer dining privacy.',
    canonicalPath: '/privacy',
    type: 'website',
    noIndex: false,
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Read the terms of service governing Restaurant OS digital menus, platform use, white-label routing, and merchant accounts.',
    canonicalPath: '/terms',
    type: 'website',
    noIndex: false,
  },
  '/404': {
    title: 'Page Not Found',
    description: 'The requested page could not be located on Restaurant OS.',
    noIndex: true,
  },
  '/500': {
    title: 'Server Error',
    description: 'An internal server issue occurred. Our engineers are investigating.',
    noIndex: true,
  },
  '/403': {
    title: 'Access Restricted',
    description: 'You do not have administrative authorization to view this resource.',
    noIndex: true,
  },
};

/**
 * Reusable metadata builder that returns a comprehensive metadata object
 * ensuring zero duplication across pages.
 */
export function buildMetadata(
  pathname: string,
  overrides?: Partial<PageMetadataConfig>
) {
  // Normalize pathname (remove trailing slash unless root)
  const normalizedPath = pathname !== '/' && pathname.endsWith('/') 
    ? pathname.slice(0, -1) 
    : pathname;

  const baseConfig = ROUTE_METADATA[normalizedPath] || {
    title: 'Digital Operating System for Restaurants',
    description: 'Empower your restaurant with commission-free QR menus and instant menu management.',
    canonicalPath: normalizedPath,
    type: 'website' as const,
  };

  const merged = { ...baseConfig, ...overrides };
  const canonicalUrl = `${SITE_CONFIG.origin}${merged.canonicalPath || normalizedPath}`;

  // Formatting page title
  const formattedTitle = merged.title.includes(SITE_CONFIG.name)
    ? merged.title
    : `${merged.title} | ${SITE_CONFIG.name}`;

  return {
    title: formattedTitle,
    rawTitle: merged.title,
    description: merged.description,
    keywords: merged.keywords && merged.keywords.length > 0 ? merged.keywords.join(', ') : undefined,
    canonicalUrl,
    type: merged.type || 'website',
    ogImage: merged.ogImage || `${SITE_CONFIG.origin}${SITE_CONFIG.defaultOgImage}`,
    ogImageAlt: merged.ogImageAlt || `${SITE_CONFIG.name} Brand Display`,
    noIndex: Boolean(merged.noIndex),
    author: merged.author || SITE_CONFIG.defaultAuthor,
    publisher: SITE_CONFIG.defaultPublisher,
    themeColor: SITE_CONFIG.themeColor,
    locale: SITE_CONFIG.defaultLocale,
    siteName: SITE_CONFIG.name,
    twitterHandle: SITE_CONFIG.twitterHandle,
  };
}

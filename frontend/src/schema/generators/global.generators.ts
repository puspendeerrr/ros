import { SITE_CONFIG } from '../../config/seo.config.ts';
import { GLOBAL_ENTITY_IDS, resolveBreadcrumbId, resolvePrimaryImageId, resolveWebPageId } from '../entities/entity-ids.ts';
import type {
  SchemaOrganization,
  SchemaBrand,
  SchemaWebSite,
  SchemaWebPage,
  SchemaSoftwareApplication,
  SchemaBreadcrumbList,
  SchemaBreadcrumbElement
} from '../types/schema.types.ts';

export function createOrganizationSchema(): SchemaOrganization {
  return {
    '@type': 'Organization',
    '@id': GLOBAL_ENTITY_IDS.organization,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.origin,
    logo: {
      '@type': 'ImageObject',
      '@id': GLOBAL_ENTITY_IDS.logo,
      url: `${SITE_CONFIG.origin}/favicon.png`,
      caption: SITE_CONFIG.name
    },
    image: `${SITE_CONFIG.origin}/favicon.png`,
    description: SITE_CONFIG.tagline,
    foundingDate: SITE_CONFIG.foundingDate,
    sameAs: [...SITE_CONFIG.socialProfiles],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE_CONFIG.contactEmail,
        availableLanguage: ['en', 'hi']
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'sales@ros.algorithyum.in',
        availableLanguage: ['en', 'hi']
      }
    ],
    knowsAbout: [
      'Restaurant Point of Sale (POS)',
      'Dynamic QR Code Menus',
      'Kitchen Display Systems (KDS)',
      'Zero-Commission Food Ordering',
      'Hospitality Unit Economics'
    ]
  };
}

export function createBrandSchema(): SchemaBrand {
  return {
    '@type': 'Brand',
    '@id': GLOBAL_ENTITY_IDS.brand,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.origin,
    logo: `${SITE_CONFIG.origin}/favicon.png`,
    description: SITE_CONFIG.tagline
  };
}

export function createWebSiteSchema(): SchemaWebSite {
  return {
    '@type': 'WebSite',
    '@id': GLOBAL_ENTITY_IDS.website,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.origin,
    inLanguage: 'en-IN',
    publisher: { '@id': GLOBAL_ENTITY_IDS.organization },
    potentialAction: [
      {
        '@type': 'SearchAction',
        '@id': GLOBAL_ENTITY_IDS.searchAction,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_CONFIG.origin}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    ]
  };
}

export function createSoftwareApplicationSchema(): SchemaSoftwareApplication {
  return {
    '@type': 'SoftwareApplication',
    '@id': GLOBAL_ENTITY_IDS.softwareApplication,
    name: SITE_CONFIG.name,
    operatingSystem: 'Web, iOS, Android, macOS, Windows',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'RestaurantManagementSystem',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Zero-commission restaurant digital operating system'
    },
    featureList: [
      'Dynamic QR Stand Ordering',
      'Digital Menu Management',
      'Kitchen Display System (KDS)',
      'Split Billing with GST',
      'Offline-First Local Caching'
    ],
    publisher: { '@id': GLOBAL_ENTITY_IDS.organization }
  };
}

export function createWebPageSchema(props: {
  pageUrl?: string;
  url?: string;
  name: string;
  description?: string;
  inLanguage?: string;
  datePublished?: string;
  dateModified?: string;
  hasBreadcrumbs?: boolean;
  hasPrimaryImage?: boolean;
}): SchemaWebPage {
  const finalUrl = props.pageUrl || props.url || SITE_CONFIG.origin;
  const pageId = resolveWebPageId(finalUrl);

  const webPage: SchemaWebPage = {
    '@type': 'WebPage',
    '@id': pageId,
    url: finalUrl,
    name: props.name,
    description: props.description,
    isPartOf: { '@id': GLOBAL_ENTITY_IDS.website },
    inLanguage: props.inLanguage || 'en-IN',
    datePublished: props.datePublished,
    dateModified: props.dateModified
  };

  if (props.hasBreadcrumbs) {
    webPage.breadcrumb = { '@id': resolveBreadcrumbId(finalUrl) };
  }
  if (props.hasPrimaryImage) {
    webPage.primaryImageOfPage = { '@id': resolvePrimaryImageId(finalUrl) };
  }

  return webPage;
}

export function createBreadcrumbListSchema(
  pageUrlOrItems: string | Array<{ name: string; url?: string }>,
  maybeItems?: Array<{ name: string; url?: string }>
): SchemaBreadcrumbList {
  let pageUrl: string;
  let items: Array<{ name: string; url?: string }>;

  if (Array.isArray(pageUrlOrItems)) {
    items = pageUrlOrItems;
    pageUrl = items.length > 0 && items[items.length - 1].url ? items[items.length - 1].url! : SITE_CONFIG.origin;
  } else {
    pageUrl = pageUrlOrItems;
    items = maybeItems || [];
  }

  const elements: SchemaBreadcrumbElement[] = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }));

  return {
    '@type': 'BreadcrumbList',
    '@id': resolveBreadcrumbId(pageUrl),
    itemListElement: elements
  };
}

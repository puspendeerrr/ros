/**
 * Schema.org JSON-LD Structured Data Builders
 * Provides modular, type-safe generators for enterprise structured data.
 * In Phase 1: Only Organization, WebSite, SoftwareApplication, SearchAction, and WebPage are injected.
 * Reusable builders for FAQPage, Article, BlogPosting, Product, Service, Person, TechArticle, and Breadcrumbs
 * are provided here for future phases.
 */

import { SITE_CONFIG } from '../config/seo.config.js';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleSchemaProps {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
}

/**
 * 1. Organization Schema (Knowledge Graph Entity)
 */
export function generateOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.origin}/#organization`,
    'name': SITE_CONFIG.name,
    'legalName': SITE_CONFIG.legalName,
    'url': SITE_CONFIG.origin,
    'logo': {
      '@type': 'ImageObject',
      '@id': `${SITE_CONFIG.origin}/#logo`,
      'url': `${SITE_CONFIG.origin}/favicon.png`,
      'caption': SITE_CONFIG.name,
    },
    'image': `${SITE_CONFIG.origin}/favicon.png`,
    'description': SITE_CONFIG.tagline,
    'foundingDate': SITE_CONFIG.foundingDate,
    'sameAs': [...SITE_CONFIG.socialProfiles],
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'contactType': 'customer support',
        'email': SITE_CONFIG.contactEmail,
        'availableLanguage': ['en', 'hi'],
      },
      {
        '@type': 'ContactPoint',
        'contactType': 'sales',
        'email': SITE_CONFIG.salesEmail,
        'availableLanguage': ['en', 'hi'],
      }
    ],
    'knowsAbout': [...SITE_CONFIG.knowsAbout]
  };
}

/**
 * 2. WebSite Schema (with SearchAction)
 */
export function generateWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.origin}/#website`,
    'url': SITE_CONFIG.origin,
    'name': SITE_CONFIG.name,
    'description': SITE_CONFIG.tagline,
    'publisher': {
      '@id': `${SITE_CONFIG.origin}/#organization`
    },
    'inLanguage': 'en-IN',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${SITE_CONFIG.origin}/features?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * 3. SoftwareApplication Schema
 */
export function generateSoftwareApplicationSchema() {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_CONFIG.origin}/#software`,
    'name': SITE_CONFIG.name,
    'applicationCategory': SITE_CONFIG.category,
    'operatingSystem': SITE_CONFIG.operatingSystem,
    'url': SITE_CONFIG.origin,
    'description': 'Modern restaurant operating system providing commission-free digital QR menus, dynamic table stands, real-time catalog syncing, and cloud-hosted public dining pages.',
    'offers': {
      '@type': 'Offer',
      'price': SITE_CONFIG.pricingOffer.price,
      'priceCurrency': SITE_CONFIG.pricingOffer.currency,
      'priceValidUntil': SITE_CONFIG.pricingOffer.priceValidUntil,
      'availability': SITE_CONFIG.pricingOffer.availability,
    },
    'featureList': [
      'Dynamic Table Stand QR Generation',
      'Real-time Tactile Menu Builder',
      'Commission-Free Digital Menu Hosting',
      'Zero App Download Required',
      'Instant Out-of-Stock Item Toggling',
      'Multi-Language Support'
    ],
    'publisher': {
      '@id': `${SITE_CONFIG.origin}/#organization`
    }
  };
}

/**
 * 4. WebPage Schema (per-page semantic identity)
 */
export function generateWebPageSchema(path: string, title: string, description: string) {
  const fullUrl = `${SITE_CONFIG.origin}${path}`;
  return {
    '@type': 'WebPage',
    '@id': `${fullUrl}#webpage`,
    'url': fullUrl,
    'name': title,
    'description': description,
    'isPartOf': {
      '@id': `${SITE_CONFIG.origin}/#website`
    },
    'about': {
      '@id': `${SITE_CONFIG.origin}/#software`
    },
    'inLanguage': 'en-IN'
  };
}

/**
 * 5. BreadcrumbList Schema (Modular, for current and future hierarchy)
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `${SITE_CONFIG.origin}${item.url}`
    }))
  };
}

/* ========================================================================
   FUTURE REUSABLE SCHEMAS (Prepared for future phases as requested)
   ======================================================================== */

/**
 * Future: FAQPage Schema
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

/**
 * Future: Article & BlogPosting Schema
 */
export function generateArticleSchema(props: ArticleSchemaProps, isBlogPosting = false) {
  return {
    '@type': isBlogPosting ? 'BlogPosting' : 'Article',
    'headline': props.headline,
    'description': props.description,
    'url': props.url,
    'datePublished': props.datePublished,
    'dateModified': props.dateModified || props.datePublished,
    'image': props.image || `${SITE_CONFIG.origin}${SITE_CONFIG.defaultOgImage}`,
    'author': {
      '@type': 'Person',
      'name': props.authorName || SITE_CONFIG.defaultAuthor,
    },
    'publisher': {
      '@id': `${SITE_CONFIG.origin}/#organization`
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': props.url
    }
  };
}

/**
 * Future: TechArticle Schema
 */
export function generateTechArticleSchema(props: ArticleSchemaProps & { dependencies?: string; proficiencyLevel?: string }) {
  return {
    ...generateArticleSchema(props, false),
    '@type': 'TechArticle',
    'dependencies': props.dependencies || 'Modern Web Browser',
    'proficiencyLevel': props.proficiencyLevel || 'Beginner to Intermediate'
  };
}

/**
 * Future: Product Schema
 */
export function generateProductSchema(name: string, description: string, sku?: string) {
  return {
    '@type': 'Product',
    'name': name,
    'description': description,
    'sku': sku || 'ROS-CORE',
    'brand': {
      '@id': `${SITE_CONFIG.origin}/#organization`
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR',
      'availability': 'https://schema.org/InStock'
    }
  };
}

/**
 * Future: Service Schema
 */
export function generateServiceSchema(serviceName: string, serviceType: string, description: string) {
  return {
    '@type': 'Service',
    'name': serviceName,
    'serviceType': serviceType,
    'description': description,
    'provider': {
      '@id': `${SITE_CONFIG.origin}/#organization`
    }
  };
}

/**
 * Future: Person Schema (Authors / Contributors)
 */
export function generatePersonSchema(name: string, jobTitle?: string, sameAs?: string[]) {
  return {
    '@type': 'Person',
    'name': name,
    'jobTitle': jobTitle || 'Contributor',
    'worksFor': {
      '@id': `${SITE_CONFIG.origin}/#organization`
    },
    'sameAs': sameAs || []
  };
}

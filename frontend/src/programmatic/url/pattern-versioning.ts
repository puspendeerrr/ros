/**
 * Versioned URL Pattern Strategy
 * Decouples URL formatting from generator business logic.
 * Enables zero-downtime URL structure migrations.
 */

import type { ContentType } from '../../content/models/base.model.ts';

export interface RoutePattern {
  version: string;
  template: string; // e.g. "/features/:slug"
  generateUrl: (slug: string, extra?: Record<string, string>) => string;
}

export class PatternVersioning {
  public static readonly CURRENT_PATTERN_VERSION = 'v1';

  private static readonly PATTERNS: Record<ContentType, RoutePattern> = {
    feature: {
      version: 'v1',
      template: '/features/:slug',
      generateUrl: (slug) => `/features/${slug}`,
    },
    solution: {
      version: 'v1',
      template: '/solutions/:slug',
      generateUrl: (slug) => `/solutions/${slug}`,
    },
    industry: {
      version: 'v1',
      template: '/industries/:slug',
      generateUrl: (slug) => `/industries/${slug}`,
    },
    comparison: {
      version: 'v1',
      template: '/compare/:slug',
      generateUrl: (slug) => `/compare/${slug}`,
    },
    documentation: {
      version: 'v1',
      template: '/docs/:version/:category/:slug',
      generateUrl: (slug, extra) => {
        const ver = extra?.version || 'latest';
        const cat = extra?.category || 'getting-started';
        return `/docs/${ver}/${cat}/${slug}`;
      },
    },
    guide: {
      version: 'v1',
      template: '/resources/guides/:slug',
      generateUrl: (slug) => `/resources/guides/${slug}`,
    },
    tutorial: {
      version: 'v1',
      template: '/resources/tutorials/:slug',
      generateUrl: (slug) => `/resources/tutorials/${slug}`,
    },
    faq: {
      version: 'v1',
      template: '/resources/faqs/:slug',
      generateUrl: (slug) => `/resources/faqs/${slug}`,
    },
    glossary: {
      version: 'v1',
      template: '/resources/glossary/:slug',
      generateUrl: (slug) => `/resources/glossary/${slug}`,
    },
    blog: {
      version: 'v1',
      template: '/blog/:slug',
      generateUrl: (slug) => `/blog/${slug}`,
    },
    case_study: {
      version: 'v1',
      template: '/customers/:slug',
      generateUrl: (slug) => `/customers/${slug}`,
    },
    download: {
      version: 'v1',
      template: '/downloads/:slug',
      generateUrl: (slug) => `/downloads/${slug}`,
    },
    changelog: {
      version: 'v1',
      template: '/changelog/:slug',
      generateUrl: (slug) => `/changelog/${slug}`,
    },
    roadmap: {
      version: 'v1',
      template: '/roadmap/:slug',
      generateUrl: (slug) => `/roadmap/${slug}`,
    },
    whitepaper: {
      version: 'v1',
      template: '/resources/whitepapers/:slug',
      generateUrl: (slug) => `/resources/whitepapers/${slug}`,
    },
  };

  public static getPattern(contentType: ContentType): RoutePattern {
    return this.PATTERNS[contentType] || {
      version: 'v1',
      template: `/${contentType}/:slug`,
      generateUrl: (slug) => `/${contentType}/${slug}`,
    };
  }

  public static resolveUrl(contentType: ContentType, slug: string, extra?: Record<string, string>): string {
    const pattern = this.getPattern(contentType);
    return pattern.generateUrl(slug, extra);
  }
}

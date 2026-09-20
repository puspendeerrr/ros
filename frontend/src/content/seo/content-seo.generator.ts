import type { BaseContentItem } from '../models/base.model.js';
import { AUTHORS_REGISTRY } from '../authors/authors.registry.js';
import { SITE_CONFIG } from '../../config/seo.config.js';
import {
  generateArticleSchema,
  generateTechArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema
} from '../../utils/schema.js';

export interface GeneratedContentSEO {
  title: string;
  description: string;
  canonicalUrl: string;
  noIndex: boolean;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: string;
    image: string;
    publishedTime: string;
    modifiedTime: string;
    authors: string[];
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  schemas: Array<Record<string, unknown>>;
  llmMetadata: {
    title: string;
    aiSummary: string;
    targetAudience: string;
    intent: string;
    productArea: string;
    readingTime: string;
    lastUpdated: string;
  };
}

export class ContentSEOGenerator {
  public static generateSEO(item: BaseContentItem): GeneratedContentSEO {
    const author = AUTHORS_REGISTRY[item.authorId];
    const authorName = author ? author.name : SITE_CONFIG.name;
    const authorUrl = author?.socials?.website || `${SITE_CONFIG.origin}/authors/${author?.slug || 'team'}`;

    const title = item.seo.title || `${item.title} | ${SITE_CONFIG.name}`;
    const description = item.seo.description || item.description || item.summary;
    const canonicalUrl = item.seo.canonicalUrl || `${SITE_CONFIG.origin}/${item.contentType}/${item.slug}`;
    const ogImage = item.seo.ogImage || `${SITE_CONFIG.origin}/assets/hero.png`;

    const schemas: Array<Record<string, unknown>> = [];

    // 1. Article / TechArticle Schema
    if (item.contentType === 'blog' || item.contentType === 'guide' || item.contentType === 'case_study' || item.contentType === 'whitepaper') {
      schemas.push(generateArticleSchema({
        headline: item.title,
        description,
        url: canonicalUrl,
        datePublished: item.publishedAt,
        dateModified: item.updatedAt,
        image: ogImage,
        authorName
      }));
    } else if (item.contentType === 'documentation' || item.contentType === 'tutorial') {
      schemas.push(generateTechArticleSchema({
        headline: item.title,
        description,
        url: canonicalUrl,
        datePublished: item.publishedAt,
        dateModified: item.updatedAt,
        image: ogImage,
        authorName,
        dependencies: 'Restaurant OS Cloud'
      }));
    }

    // 2. FAQ Schema if item is FAQ or has questions
    if (item.contentType === 'faq' && 'faqs' in item && Array.isArray((item as any).faqs)) {
      schemas.push(generateFAQSchema((item as any).faqs));
    }

    // 3. Breadcrumbs Schema
    schemas.push(generateBreadcrumbSchema([
      { name: 'Home', url: SITE_CONFIG.origin },
      { name: item.contentType.replace('_', ' ').toUpperCase(), url: `${SITE_CONFIG.origin}/${item.contentType}` },
      { name: item.title, url: canonicalUrl }
    ]));

    return {
      title,
      description,
      canonicalUrl,
      noIndex: Boolean(item.seo.noIndex) || item.editorialStatus === 'draft' || item.editorialStatus === 'archived',
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: item.contentType === 'blog' ? 'article' : 'website',
        image: ogImage,
        publishedTime: item.publishedAt,
        modifiedTime: item.updatedAt,
        authors: [authorUrl]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image: ogImage
      },
      schemas,
      llmMetadata: {
        title: item.title,
        aiSummary: item.seo.aiSummary || item.summary,
        targetAudience: item.audience,
        intent: item.intent,
        productArea: item.productArea,
        readingTime: `${item.readingTimeMinutes} min read`,
        lastUpdated: item.updatedAt
      }
    };
  }
}

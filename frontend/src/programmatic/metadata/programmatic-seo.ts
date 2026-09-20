/**
 * Programmatic SEO Metadata Builder
 * Generates type-safe Title, Meta Description, Canonical URL, OpenGraph, and Twitter cards.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { ProgrammaticSeoMetadata, SearchIntentType } from '../types/programmatic.types.ts';
import { SITE_CONFIG } from '../../config/seo.config.ts';

export class ProgrammaticSeoBuilder {
  public static build(
    item: BaseContentItem,
    canonicalPath: string,
    searchIntent: SearchIntentType
  ): ProgrammaticSeoMetadata {
    const rawTitle = item.title.trim();
    // Brand suffix pattern
    const title = rawTitle.includes(SITE_CONFIG.name) ? rawTitle : `${rawTitle} | ${SITE_CONFIG.name}`;

    // Description fallback
    let description = item.description?.trim() || item.summary?.trim() || '';
    if (description.length > 160) {
      description = `${description.substring(0, 157)}...`;
    }

    const canonicalUrl = `${SITE_CONFIG.origin}${canonicalPath}`;
    const ogImage = `${SITE_CONFIG.origin}${item.seo?.ogImage || SITE_CONFIG.defaultOgImage}`;
    const ogImageAlt = `${rawTitle} — ${SITE_CONFIG.name}`;

    const readingTimeMinutes = item.readingTimeMinutes || 5;

    return {
      title,
      description,
      canonicalUrl,
      ogImage,
      ogImageAlt,
      noIndex: !!item.seo?.noIndex,
      readingTimeMinutes,
      updatedAt: item.updatedAt,
      targetAudience: item.audience,
      searchIntent,
      primaryKeywords: item.tagIds || [],
    };
  }
}

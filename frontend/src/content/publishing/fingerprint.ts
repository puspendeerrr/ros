/**
 * Composite Content Fingerprint Generator
 * Combines frontmatter, body, media assets, and relationship pointers into a deterministic SHA-256 hash.
 */

import crypto from 'crypto';
import type { BaseContentItem } from '../models/base.model.ts';

export class ContentFingerprint {
  /**
   * Computes a stable deterministic SHA-256 fingerprint for a content item.
   */
  public static compute(item: BaseContentItem, rawBody = ''): string {
    const canonicalPayload = {
      id: item.id,
      slug: item.slug,
      contentType: item.contentType,
      title: item.title?.trim(),
      description: item.description?.trim(),
      summary: item.summary?.trim(),
      editorialStatus: item.editorialStatus,
      updatedAt: item.updatedAt,
      version: item.version || 'latest',
      authorId: item.authorId,
      categoryId: item.categoryId,
      tagIds: (item.tagIds || []).slice().sort(),
      audience: item.audience,
      intent: item.intent,
      productArea: item.productArea,
      // Relationships
      seeAlsoIds: (item.seeAlsoIds || []).slice().sort(),
      prerequisiteIds: (item.prerequisiteIds || []).slice().sort(),
      continueLearningIds: (item.continueLearningIds || []).slice().sort(),
      // Raw Body
      bodySha256: crypto.createHash('sha256').update(rawBody || '').digest('hex'),
      // SEO
      canonicalUrl: item.seo?.canonicalUrl || '',
      noIndex: !!item.seo?.noIndex,
      aiSummary: item.seo?.aiSummary || '',
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(canonicalPayload))
      .digest('hex');
  }

  /**
   * Computes SHA-256 for a string or buffer.
   */
  public static computeHash(content: string | Buffer): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

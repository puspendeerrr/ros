/**
 * Trust Signal Engine
 * Computes granular trust, verification, and transparency signals for every page.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { PageTrustSignals } from '../types/eeat.types.ts';
import { ENTERPRISE_AUTHORS_REGISTRY } from '../authors/author-profile.registry.ts';

export class TrustSignalEngine {
  /**
   * Computes trust signals for all content items.
   */
  public static computeAllSignals(items: BaseContentItem[]): PageTrustSignals[] {
    return items.map(item => this.computeSignals(item));
  }

  /**
   * Computes granular trust signals for a single page.
   */
  public static computeSignals(item: BaseContentItem): PageTrustSignals {
    const author = ENTERPRISE_AUTHORS_REGISTRY[item.authorId];
    const verifiedAuthor = Boolean(author && author.isStaff);
    const authorName = author ? author.name : (item.authorId || 'Anonymous');

    const reviewedByIds = item.reviewedByIds || [];
    let reviewStatus: PageTrustSignals['reviewStatus'] = 'pending_review';
    if (reviewedByIds.length >= 2) {
      reviewStatus = 'peer_reviewed';
    } else if (reviewedByIds.length === 1 || verifiedAuthor) {
      reviewStatus = 'author_verified';
    }

    // References & Evidence
    const referencesCount = (item.seeAlsoIds?.length || 0) + (item.prerequisiteIds?.length || 0);
    const documentationLinksCount = (item.continueLearningIds?.length || 0) +
      (item.contentType === 'documentation' ? 2 : 0);

    // Product Evidence Strength
    let productEvidenceStrength: PageTrustSignals['productEvidenceStrength'] = 'declarative';
    if (item.contentType === 'guide' || item.contentType === 'documentation') {
      productEvidenceStrength = 'empirical';
    } else if (item.contentType === 'comparison') {
      productEvidenceStrength = 'benchmark';
    }

    // Technical Accuracy Score (0 - 100)
    let technicalAccuracyScore = 70;
    if (verifiedAuthor) technicalAccuracyScore += 10;
    if (reviewedByIds.length > 0) technicalAccuracyScore += 10;
    if (item.seo?.structuredDataType) technicalAccuracyScore += 10;
    technicalAccuracyScore = Math.min(100, technicalAccuracyScore);

    // Transparency Score (0 - 100)
    let transparencyScore = 60;
    if (item.publishedAt) transparencyScore += 10;
    if (item.updatedAt) transparencyScore += 10;
    if (item.version) transparencyScore += 10;
    if (author?.socialProfiles.github || author?.socialProfiles.linkedin) transparencyScore += 10;
    transparencyScore = Math.min(100, transparencyScore);

    // Overall Trust Score (0 - 100)
    const overallTrustScore = Math.min(
      100,
      Math.round(
        (verifiedAuthor ? 25 : 10) +
        (reviewStatus === 'peer_reviewed' ? 25 : reviewStatus === 'author_verified' ? 18 : 5) +
        (transparencyScore * 0.25) +
        (technicalAccuracyScore * 0.25)
      )
    );

    return {
      contentId: item.id,
      title: item.title,
      verifiedAuthor,
      authorId: item.authorId,
      authorName,
      reviewedByIds,
      reviewStatus,
      lastUpdated: item.updatedAt || item.publishedAt,
      contentVersion: item.version || '1.0.0',
      referencesCount,
      documentationLinksCount,
      productEvidenceStrength,
      technicalAccuracyScore,
      transparencyScore,
      overallTrustScore
    };
  }
}

/**
 * Content Overlap Detector Engine
 * Pinpoints topical redundancy, keyword cannibalization, and semantic overlap across content items.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { ContentOverlapItem } from '../types/authority.types.ts';

export class ContentOverlapDetector {
  /**
   * Evaluates pairwise semantic and taxonomy overlap across all content items.
   */
  public static detectOverlaps(items: BaseContentItem[], thresholdPercent = 40): ContentOverlapItem[] {
    const overlaps: ContentOverlapItem[] = [];

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];

        const overlapScore = this.calculateOverlap(itemA, itemB);

        if (overlapScore >= thresholdPercent) {
          const sharedTags = itemA.tagIds.filter(t => itemB.tagIds.includes(t));
          const sharedEntities = (itemA.seeAlsoIds || []).filter(id => (itemB.seeAlsoIds || []).includes(id));

          let recommendation: ContentOverlapItem['recommendation'] = 'acceptable';
          if (overlapScore >= 75) {
            recommendation = 'merge';
          } else if (overlapScore >= 60) {
            recommendation = 'differentiate';
          } else if (overlapScore >= 40) {
            recommendation = 'cross_link';
          }

          overlaps.push({
            itemAId: itemA.id,
            itemBId: itemB.id,
            titleA: itemA.title,
            titleB: itemB.title,
            overlapScore,
            sharedTags,
            sharedEntities,
            recommendation
          });
        }
      }
    }

    return overlaps.sort((a, b) => b.overlapScore - a.overlapScore);
  }

  /**
   * Computes multi-factor overlap score between two content items.
   */
  private static calculateOverlap(itemA: BaseContentItem, itemB: BaseContentItem): number {
    let score = 0;

    // 1. Same product area: +20%
    if (itemA.productArea === itemB.productArea) {
      score += 20;
    }

    // 2. Same content archetype (e.g. both guides): +15%
    if (itemA.contentType === itemB.contentType) {
      score += 15;
    }

    // 3. Same category: +15%
    if (itemA.categoryId === itemB.categoryId) {
      score += 15;
    }

    // 4. Same target audience and intent: +15%
    if (itemA.audience === itemB.audience) score += 10;
    if (itemA.intent === itemB.intent) score += 5;

    // 5. Shared tags Jaccard similarity: up to +20%
    const tagsB = new Set(itemB.tagIds);
    const intersectionTags = itemA.tagIds.filter(t => tagsB.has(t));
    const unionTags = new Set([...itemA.tagIds, ...itemB.tagIds]);
    if (unionTags.size > 0) {
      const tagJaccard = intersectionTags.length / unionTags.size;
      score += Math.round(tagJaccard * 20);
    }

    // 6. Keywords similarity in SEO metadata: up to +15%
    const kwA = (itemA.seo?.keywords || []).map(k => k.toLowerCase());
    const kwB = (itemB.seo?.keywords || []).map(k => k.toLowerCase());
    const sharedKw = kwA.filter(k => kwB.some(other => other.includes(k) || k.includes(other)));
    if (kwA.length > 0 && kwB.length > 0) {
      const kwOverlapRatio = sharedKw.length / Math.min(kwA.length, kwB.length);
      score += Math.round(kwOverlapRatio * 15);
    }

    return Math.min(100, score);
  }
}

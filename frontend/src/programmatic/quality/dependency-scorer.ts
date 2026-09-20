/**
 * Content Dependency Scorer (0 - 100)
 * Evaluates how solidly a page is supported by related entities, guides, docs, and FAQs.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';

export class ContentDependencyScorer {
  public static calculate(item: BaseContentItem, allItems: BaseContentItem[]): number {
    let score = 30; // base floor

    const seeAlso = item.seeAlsoIds || [];
    const prerequisites = item.prerequisiteIds || [];
    const continueLearning = item.continueLearningIds || [];

    // Validated references that exist in the registry
    const validRelatedCount = [...seeAlso, ...prerequisites, ...continueLearning]
      .filter(id => allItems.some(i => i.id === id)).length;

    // Add up to 30 points for relational links
    score += Math.min(30, validRelatedCount * 10);

    // Supporting documentation / guides in the same product area
    const areaPeers = allItems.filter(i => i.id !== item.id && i.productArea === item.productArea);
    const hasGuides = areaPeers.some(i => i.contentType === 'guide');
    const hasDocs = areaPeers.some(i => i.contentType === 'documentation');
    const hasFaqs = areaPeers.some(i => i.contentType === 'faq');

    if (hasGuides) score += 15;
    if (hasDocs) score += 15;
    if (hasFaqs) score += 10;

    return Math.min(100, score);
  }
}

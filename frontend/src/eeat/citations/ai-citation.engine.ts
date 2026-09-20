/**
 * AI Citation & Answer Engine Optimization (AEO/GEO) Engine
 * Evaluates how effectively Google AI Overviews, Perplexity, and ChatGPT can extract authoritative answers.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { AiCitationMetrics } from '../types/eeat.types.ts';

export class AiCitationEngine {
  /**
   * Scores AI citation readiness across all content items.
   */
  public static evaluateAll(items: BaseContentItem[]): AiCitationMetrics[] {
    return items.map(item => this.evaluateItem(item));
  }

  /**
   * Evaluates AI citation extraction readiness for a single item.
   */
  public static evaluateItem(item: BaseContentItem): AiCitationMetrics {
    // 1. Definition Quality (Concise, authoritative summary sentence)
    let definitionQuality = 60;
    if (item.summary && item.summary.length >= 60 && item.summary.length <= 160) {
      definitionQuality += 30; // Optimal snippet length
    } else if (item.summary && item.summary.length > 0) {
      definitionQuality += 15;
    }
    if (item.seo?.aiSummary) definitionQuality += 10;
    definitionQuality = Math.min(100, definitionQuality);

    // 2. Answer Completeness (Intent fulfillment and structured sections)
    let answerCompleteness = 70;
    if (item.contentType === 'guide' || item.contentType === 'documentation') {
      answerCompleteness += 20;
    } else if (item.contentType === 'comparison') {
      answerCompleteness += 15;
    }
    answerCompleteness = Math.min(100, answerCompleteness);

    // 3. Evidence Strength (Specific numbers, percentages, benchmark metrics)
    let evidenceStrength = 65;
    const text = `${item.title} ${item.description} ${item.summary}`.toLowerCase();
    if (text.includes('%') || text.includes('35%') || text.includes('30%') || text.includes('5-minute')) {
      evidenceStrength += 25; // Empirical numerical evidence
    }
    if (item.isFeatured) evidenceStrength += 10;
    evidenceStrength = Math.min(100, evidenceStrength);

    // 4. Entity Linking (Unambiguous cross-referencing)
    const entityLinkingCount = (item.seeAlsoIds?.length || 0) + (item.prerequisiteIds?.length || 0);
    const entityLinking = Math.min(100, 50 + entityLinkingCount * 15);

    // 5. FAQ Quality
    const faqQuality = item.contentType === 'faq' ? 100 : item.seo?.structuredDataType === 'FAQPage' ? 95 : 70;

    // 6. Schema Completeness
    const schemaCompleteness = item.seo?.structuredDataType ? 95 : 80;

    // 7. Reference Coverage
    const referenceCoverage = item.seeAlsoIds && item.seeAlsoIds.length > 0 ? 90 : 65;

    // 8. Overall Citation Readiness Score (0 - 100)
    const citationReadinessScore = Math.min(
      100,
      Math.round(
        definitionQuality * 0.25 +
        answerCompleteness * 0.20 +
        evidenceStrength * 0.20 +
        entityLinking * 0.15 +
        schemaCompleteness * 0.10 +
        referenceCoverage * 0.10
      )
    );

    const isAiOverviewOptimized = citationReadinessScore >= 85 && definitionQuality >= 80;

    return {
      contentId: item.id,
      title: item.title,
      contentType: item.contentType,
      citationReadinessScore,
      definitionQuality,
      answerCompleteness,
      evidenceStrength,
      entityLinking,
      faqQuality,
      schemaCompleteness,
      referenceCoverage,
      isAiOverviewOptimized
    };
  }
}

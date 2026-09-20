/**
 * LLM Retrieval Engine
 * Evaluates Context Density, Entity Density, Reference Density, and RAG Retrieval Confidence.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { RetrievalMetrics } from '../types/ai-search.types.ts';

export class LlmRetrievalEngine {
  /**
   * Evaluates retrieval metrics across all content items.
   */
  public static evaluateAll(items: BaseContentItem[]): RetrievalMetrics[] {
    return items.map(item => this.evaluateItem(item));
  }

  /**
   * Computes retrieval readiness for a single content item.
   */
  public static evaluateItem(item: BaseContentItem): RetrievalMetrics {
    // 1. Context Density: Factual informative words vs boilerplate filler
    const totalWords = (item.title + ' ' + item.description + ' ' + item.summary).split(/\s+/).length;
    let contextDensity = 75; // baseline
    if (totalWords >= 80) contextDensity += 15;
    if (item.readingTimeMinutes && item.readingTimeMinutes > 0) contextDensity += 10;
    contextDensity = Math.min(100, contextDensity);

    // 2. Entity Density: Disambiguated entities per chunk
    const entityCount = 1 + (item.seeAlsoIds?.length || 0) + (item.prerequisiteIds?.length || 0);
    const entityDensity = Math.min(100, Math.round((entityCount / 4) * 100));

    // 3. Reference Density: Verifiable source links
    const refCount = (item.seeAlsoIds?.length || 0) + (item.continueLearningIds?.length || 0);
    const referenceDensity = Math.min(100, Math.round((refCount / 3) * 100));

    // 4. Definition & Answer Coverage
    const hasClearSummary = Boolean(item.summary && item.summary.length >= 60);
    const definitionCoverage = hasClearSummary ? 95 : 60;
    const answerCoverage = item.contentType === 'guide' || item.contentType === 'documentation' ? 95 : 80;

    // 5. Retrieval Completeness
    const retrievalCompleteness = Math.round(
      (contextDensity * 0.35) + (entityDensity * 0.35) + (referenceDensity * 0.30)
    );

    // 6. Retrieval Confidence (0 - 100)
    let retrievalConfidence = 70;
    if (item.authorId) retrievalConfidence += 10;
    if (item.updatedAt) retrievalConfidence += 10;
    if (item.seo?.structuredDataType) retrievalConfidence += 10;
    retrievalConfidence = Math.min(100, retrievalConfidence);

    // 7. Overall Retrieval Readiness Score (0 - 100)
    const retrievalReadinessScore = Math.min(
      100,
      Math.round(
        contextDensity * 0.25 +
        entityDensity * 0.20 +
        definitionCoverage * 0.20 +
        answerCoverage * 0.15 +
        retrievalConfidence * 0.20
      )
    );

    return {
      contentId: item.id,
      title: item.title,
      contentType: item.contentType,
      retrievalCompleteness,
      answerCoverage,
      definitionCoverage,
      contextDensity,
      entityDensity,
      referenceDensity,
      retrievalConfidence,
      retrievalReadinessScore
    };
  }
}

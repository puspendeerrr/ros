/**
 * AI Citation Optimizer
 * Evaluates Citation Density, Evidence Density, and snippet extraction suitability.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';

export interface CitationOptimizationReport {
  contentId: string;
  title: string;
  citationDensityScore: number;  // 0 - 100
  evidenceDensityScore: number;  // 0 - 100
  definitionQualityScore: number;// 0 - 100
  entityLinkingScore: number;    // 0 - 100
  overallOptimizationScore: number;// 0 - 100
  strengths: string[];
  recommendations: string[];
}

export class AiCitationOptimizer {
  /**
   * Optimizes citation and snippet extraction for all content items.
   */
  public static optimizeAll(items: BaseContentItem[]): CitationOptimizationReport[] {
    return items.map(item => this.optimizeItem(item));
  }

  /**
   * Evaluates citation optimization dimensions for a single content item.
   */
  public static optimizeItem(item: BaseContentItem): CitationOptimizationReport {
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // 1. Definition Quality Score (0 - 100)
    let definitionQualityScore = 70;
    if (item.summary.length >= 60 && item.summary.length <= 180) {
      definitionQualityScore += 25;
      strengths.push('Concise summary fits optimal 40-55 word snippet window.');
    } else {
      recommendations.push('Refine summary to 40-55 words for tighter LLM answer synthesis.');
    }
    definitionQualityScore = Math.min(100, definitionQualityScore);

    // 2. Evidence Density Score (0 - 100)
    let evidenceDensityScore = 65;
    const bodyText = `${item.title} ${item.description} ${item.summary}`.toLowerCase();
    if (bodyText.includes('%') || bodyText.includes('minutes') || bodyText.includes('upi')) {
      evidenceDensityScore += 25;
      strengths.push('Contains hard numerical evidence and concrete protocol names (UPI, percentages).');
    } else {
      recommendations.push('Include verifiable statistics and performance benchmarks.');
    }
    evidenceDensityScore = Math.min(100, evidenceDensityScore);

    // 3. Citation Density Score (0 - 100)
    const relCount = (item.seeAlsoIds?.length || 0) + (item.continueLearningIds?.length || 0);
    const citationDensityScore = Math.min(100, 50 + relCount * 15);
    if (relCount >= 2) {
      strengths.push('High internal reference density supports authoritative citation.');
    }

    // 4. Entity Linking Score (0 - 100)
    const entityLinkingScore = Math.min(100, 60 + (item.prerequisiteIds?.length || 0) * 20);

    // 5. Overall Optimization Score
    const overallOptimizationScore = Math.min(
      100,
      Math.round(
        definitionQualityScore * 0.30 +
        evidenceDensityScore * 0.30 +
        citationDensityScore * 0.20 +
        entityLinkingScore * 0.20
      )
    );

    return {
      contentId: item.id,
      title: item.title,
      citationDensityScore,
      evidenceDensityScore,
      definitionQualityScore,
      entityLinkingScore,
      overallOptimizationScore,
      strengths,
      recommendations
    };
  }
}

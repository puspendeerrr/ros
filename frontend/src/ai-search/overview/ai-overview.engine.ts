/**
 * AI Overview & Featured Snippet Engine
 * Detects snippet eligibility and formats concise extraction targets for Google AI Overviews.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { AiOverviewOpportunity, SnippetType } from '../types/ai-search.types.ts';

export class AiOverviewEngine {
  /**
   * Evaluates AI Overview and Featured Snippet readiness for all content items.
   */
  public static evaluateAll(items: BaseContentItem[]): AiOverviewOpportunity[] {
    return items.map(item => this.evaluateItem(item));
  }

  /**
   * Computes snippet eligibility scores and formats extraction snippets.
   */
  public static evaluateItem(item: BaseContentItem): AiOverviewOpportunity {
    let targetSnippetType: SnippetType = 'paragraph';
    let primaryQuery = `What is ${item.title}?`;
    let extractedSnippetText = item.summary;

    // 1. Determine Snippet Type based on content archetype
    if (item.contentType === 'guide' || item.contentType === 'documentation') {
      targetSnippetType = 'list';
      primaryQuery = `How to implement ${item.title}?`;
      extractedSnippetText = `1. Configure dining room profile. 2. Upload catalog and prices. 3. Download vector table stands for direct UPI ordering.`;
    } else if (item.contentType === 'comparison') {
      targetSnippetType = 'table';
      primaryQuery = `Restaurant OS vs delivery aggregators cost comparison`;
      extractedSnippetText = `Restaurant OS (0% commission, direct UPI, full data ownership) vs Delivery Aggregators (15-30% commissions, customer data retained by app).`;
    } else {
      targetSnippetType = 'paragraph';
      primaryQuery = `What is ${item.title}?`;
      extractedSnippetText = item.summary.slice(0, 160);
    }

    // 2. AnswerScore (0 - 100)
    let answerScore = 75;
    if (item.summary.length >= 60 && item.summary.length <= 180) answerScore += 15;
    if (item.seo?.aiSummary) answerScore += 10;
    answerScore = Math.min(100, answerScore);

    // 3. SnippetScore (0 - 100)
    let snippetScore = 70;
    if (targetSnippetType === 'list' || targetSnippetType === 'table') snippetScore += 20;
    if (item.readingTimeMinutes && item.readingTimeMinutes > 0) snippetScore += 10;
    snippetScore = Math.min(100, snippetScore);

    // 4. AIOverviewScore (0 - 100)
    const aiOverviewScore = Math.min(
      100,
      Math.round(answerScore * 0.5 + snippetScore * 0.3 + (item.authorId ? 20 : 10))
    );

    const isAiOverviewCandidate = aiOverviewScore >= 85;
    const isFeaturedSnippetCandidate = snippetScore >= 80;

    return {
      contentId: item.id,
      title: item.title,
      aiOverviewScore,
      snippetScore,
      answerScore,
      isAiOverviewCandidate,
      isFeaturedSnippetCandidate,
      targetSnippetType,
      primaryQuery,
      extractedSnippetText
    };
  }
}

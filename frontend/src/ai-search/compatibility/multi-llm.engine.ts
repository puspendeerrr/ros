/**
 * Multi-LLM Compatibility Engine
 * Computes independent retrieval and synthesis scores for Google AI Overviews, ChatGPT Search, Gemini, Perplexity, and Copilot.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { LlmCompatibilityScore } from '../types/ai-search.types.ts';

export class MultiLlmCompatibilityEngine {
  /**
   * Computes multi-model compatibility for all content items.
   */
  public static evaluateAll(items: BaseContentItem[]): LlmCompatibilityScore[] {
    return items.map(item => this.evaluateItem(item));
  }

  /**
   * Evaluates compatibility across 5 distinct LLM search architectures for a single item.
   */
  public static evaluateItem(item: BaseContentItem): LlmCompatibilityScore {
    const isStructured = Boolean(item.seo?.structuredDataType);
    const hasAuthor = Boolean(item.authorId);
    const hasNumbers = `${item.title} ${item.description} ${item.summary}`.includes('%') ||
                       `${item.title} ${item.description}`.includes('35%');

    // 1. Google AI Overviews Score (0 - 100)
    // Favors Schema.org nodes (HowTo, FAQ), concise 45-word answers, and EEAT verified author
    let googleAiOverview = 75;
    if (isStructured) googleAiOverview += 10;
    if (hasAuthor) googleAiOverview += 10;
    if (item.summary.length <= 180) googleAiOverview += 5;
    googleAiOverview = Math.min(100, googleAiOverview);

    // 2. ChatGPT Search Score (0 - 100)
    // Favors balanced prose narrative, clear descriptive headings, and comprehensive context
    let chatGptSearch = 70;
    if (item.description.length >= 80) chatGptSearch += 15;
    if (item.readingTimeMinutes && item.readingTimeMinutes >= 5) chatGptSearch += 10;
    if (item.contentType === 'guide' || item.contentType === 'comparison') chatGptSearch += 5;
    chatGptSearch = Math.min(100, chatGptSearch);

    // 3. Gemini Score (0 - 100)
    // Favors structured bullet points, step-by-step lists, and Google ecosystem alignment
    let gemini = 75;
    if (item.contentType === 'documentation' || item.contentType === 'guide') gemini += 15;
    if (isStructured) gemini += 10;
    gemini = Math.min(100, gemini);

    // 4. Perplexity Score (0 - 100)
    // Heavily favors dense numerical benchmark tables, specific metrics, and source citations
    let perplexity = 65;
    if (hasNumbers) perplexity += 20;
    if (item.contentType === 'comparison') perplexity += 15;
    if (item.seeAlsoIds && item.seeAlsoIds.length > 0) perplexity += 10;
    perplexity = Math.min(100, perplexity);

    // 5. Bing Copilot Score (0 - 100)
    // Favors enterprise architecture documentation, technical specs, and RFC standards
    let bingCopilot = 70;
    if (item.contentType === 'documentation' || item.contentType === 'feature') bingCopilot += 15;
    if (item.version) bingCopilot += 10;
    bingCopilot = Math.min(100, bingCopilot);

    // 6. Composite LLM Readiness Score (0 - 100)
    const compositeLlmReadiness = Math.round(
      (googleAiOverview + chatGptSearch + gemini + perplexity + bingCopilot) / 5
    );

    // 7. Primary Model Affinity
    const scores = [
      { model: 'Google' as const, score: googleAiOverview },
      { model: 'ChatGPT' as const, score: chatGptSearch },
      { model: 'Gemini' as const, score: gemini },
      { model: 'Perplexity' as const, score: perplexity },
      { model: 'Bing' as const, score: bingCopilot }
    ];
    scores.sort((a, b) => b.score - a.score);
    const primaryModelAffinity = scores[0].model;

    return {
      contentId: item.id,
      title: item.title,
      googleAiOverview,
      chatGptSearch,
      gemini,
      perplexity,
      bingCopilot,
      compositeLlmReadiness,
      primaryModelAffinity
    };
  }
}

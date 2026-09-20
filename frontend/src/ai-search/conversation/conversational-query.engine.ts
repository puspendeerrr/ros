/**
 * Conversational Query Engine
 * Maps natural language user prompts (What, Why, How, Troubleshooting, Pricing) to verified Answer Objects.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { ConversationalQueryIntent, QueryCategory } from '../types/ai-search.types.ts';

export class ConversationalQueryEngine {
  /**
   * Generates simulated conversational intents for all content items.
   */
  public static generateIntents(items: BaseContentItem[]): ConversationalQueryIntent[] {
    const intents: ConversationalQueryIntent[] = [];

    for (const item of items) {
      // 1. WHAT Intent
      intents.push({
        intentId: `query-what-${item.id}`,
        category: 'what',
        userQuery: `What is ${item.title} in Restaurant OS?`,
        matchedAnswerId: `ans-def-${item.id}`,
        targetContentId: item.id,
        confidenceScore: 96,
        primaryEntityId: item.id
      });

      // 2. WHY Intent
      intents.push({
        intentId: `query-why-${item.id}`,
        category: 'why',
        userQuery: `Why should restaurants use ${item.title}?`,
        matchedAnswerId: `ans-probsol-${item.id}`,
        targetContentId: item.id,
        confidenceScore: 92,
        primaryEntityId: item.id
      });

      // 3. HOW / IMPLEMENTATION Intent
      if (item.contentType === 'guide' || item.contentType === 'documentation') {
        intents.push({
          intentId: `query-how-${item.id}`,
          category: 'how',
          userQuery: `How do I set up ${item.title} step by step?`,
          matchedAnswerId: item.contentType === 'guide' ? `ans-howto-${item.id}` : `ans-step-${item.id}`,
          targetContentId: item.id,
          confidenceScore: 98,
          primaryEntityId: item.id
        });
        intents.push({
          intentId: `query-impl-${item.id}`,
          category: 'implementation',
          userQuery: `How long does it take to implement ${item.title}?`,
          matchedAnswerId: item.contentType === 'guide' ? `ans-howto-${item.id}` : `ans-step-${item.id}`,
          targetContentId: item.id,
          confidenceScore: 90,
          primaryEntityId: item.id
        });
      }

      // 4. COMPARISON Intent
      if (item.contentType === 'comparison') {
        intents.push({
          intentId: `query-comp-${item.id}`,
          category: 'comparison',
          userQuery: `How does Restaurant OS compare with Swiggy and Zomato?`,
          matchedAnswerId: `ans-comp-${item.id}`,
          targetContentId: item.id,
          confidenceScore: 99,
          primaryEntityId: item.id
        });
      }

      // 5. TROUBLESHOOTING Intent
      intents.push({
        intentId: `query-trouble-${item.id}`,
        category: 'troubleshooting',
        userQuery: `What happens if the internet goes down while using ${item.title}?`,
        matchedAnswerId: `ans-probsol-${item.id}`,
        targetContentId: item.id,
        confidenceScore: 88,
        primaryEntityId: item.id
      });
    }

    return intents;
  }

  /**
   * Filters conversational intents by query category.
   */
  public static filterByCategory(
    intents: ConversationalQueryIntent[],
    category: QueryCategory
  ): ConversationalQueryIntent[] {
    return intents.filter(i => i.category === category);
  }
}

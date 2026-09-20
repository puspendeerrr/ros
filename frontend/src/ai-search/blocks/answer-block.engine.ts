/**
 * Answer Block Engine
 * Generates reusable, structured answer blocks (Key Takeaways, Quick Facts, Decision Matrices, Checklists).
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { AnswerBlockSet } from '../types/ai-search.types.ts';

export class AnswerBlockEngine {
  /**
   * Generates answer block sets for all content items.
   */
  public static generateAllBlocks(items: BaseContentItem[]): AnswerBlockSet[] {
    return items.map(item => this.generateForContent(item));
  }

  /**
   * Builds an AnswerBlockSet for a single content item.
   */
  public static generateForContent(item: BaseContentItem): AnswerBlockSet {
    // 1. Definition Block
    const definitionText = item.summary.slice(0, 200);
    const definitionBlock = {
      term: item.title,
      definition: definitionText,
      wordCount: definitionText.split(/\s+/).length
    };

    // 2. Summary Block
    const summaryBlock = {
      tldr: item.summary,
      targetAudience: item.audience.replace('_', ' ')
    };

    // 3. Key Takeaways
    const keyTakeaways = [
      `100% merchant data ownership with zero third-party commissions.`,
      `Cloud-native infrastructure with offline-first local cache synchronization.`,
      `Instant table QR code stand generation and direct UPI bill settlement.`
    ];

    // 4. Quick Facts
    const quickFacts = [
      { label: 'Category', value: item.productArea.replace('_', ' ').toUpperCase() },
      { label: 'Audience', value: item.audience.replace('_', ' ') },
      { label: 'Version', value: item.version || '1.0.0' },
      { label: 'Read Time', value: `${item.readingTimeMinutes || 5} mins` },
      { label: 'Intent', value: item.intent }
    ];

    // 5. Checklist (for Guides & Docs)
    let checklist: string[] | undefined;
    if (item.contentType === 'guide' || item.contentType === 'documentation') {
      checklist = [
        'Confirm restaurant profile and GST registration details.',
        'Upload menu categories, dishes, and high-resolution photos.',
        'Export and print table stands with embedded table query IDs.',
        'Test table UPI settlement with sample order.'
      ];
    }

    // 6. Decision Matrix (for Comparisons)
    let decisionMatrix: AnswerBlockSet['decisionMatrix'];
    if (item.contentType === 'comparison') {
      decisionMatrix = [
        {
          criteria: 'Commission Rate',
          restaurantOs: '0% fixed (Zero commissions)',
          alternative: '15% to 30% per order'
        },
        {
          criteria: 'Customer Phone & Data',
          restaurantOs: '100% merchant owned',
          alternative: 'Masked / Retained by marketplace'
        },
        {
          criteria: 'Payment Settlement',
          restaurantOs: 'Instant direct to bank via UPI',
          alternative: 'Weekly/bi-weekly payouts after deductions'
        }
      ];
    }

    // 7. Advantages
    const advantages = [
      'Zero commission fees on dining room transactions',
      'Local IndexedDB offline order preservation',
      'Direct customer relationship ownership'
    ];

    return {
      contentId: item.id,
      title: item.title,
      definitionBlock,
      summaryBlock,
      keyTakeaways,
      quickFacts,
      checklist,
      decisionMatrix,
      advantages,
      prerequisites: item.prerequisiteIds || []
    };
  }
}

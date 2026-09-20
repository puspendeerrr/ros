/**
 * Generation Rules Engine
 * Enforces business rules and depth constraints to prevent low-value or thin programmatic pages.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';

export interface GenerationRuleResult {
  allowed: boolean;
  reasons: string[];
  severity: 'pass' | 'reject' | 'warn';
}

export class GenerationRulesEngine {
  private static readonly MIN_WORD_COUNT = 25;
  private static readonly DISALLOWED_LIFECYCLES = ['draft', 'archived', 'deprecated'];

  /**
   * Evaluates an entity against strict quality rules.
   */
  public static evaluate(item: BaseContentItem): GenerationRuleResult {
    const reasons: string[] = [];

    // 1. Editorial status check
    if (this.DISALLOWED_LIFECYCLES.includes(item.editorialStatus)) {
      reasons.push(`Editorial status is "${item.editorialStatus}" (must be published or review).`);
      return { allowed: false, reasons, severity: 'reject' };
    }

    // 2. Minimum length check
    const takeaways = Array.isArray((item as any).keyTakeaways) ? (item as any).keyTakeaways.join(' ') : '';
    const points = Array.isArray((item as any).bulletPoints) ? (item as any).bulletPoints.join(' ') : '';
    const contentText = `${item.title} ${item.description} ${item.summary} ${takeaways} ${points} ${(item as any).markdownBody || ''}`;
    const wordCount = contentText.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < this.MIN_WORD_COUNT) {
      reasons.push(`Content word count (${wordCount}) falls below minimum threshold of ${this.MIN_WORD_COUNT} words.`);
      return { allowed: false, reasons, severity: 'reject' };
    }

    // 3. Slug syntax check
    if (!item.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      reasons.push(`Slug "${item.slug}" is not clean kebab-case.`);
      return { allowed: false, reasons, severity: 'reject' };
    }

    // 4. Required Taxonomy Category
    if (!item.categoryId) {
      reasons.push(`Item is missing required primary taxonomy category.`);
      return { allowed: false, reasons, severity: 'reject' };
    }

    // 5. Warning for low internal links
    const relCount = (item.seeAlsoIds?.length || 0) + (item.prerequisiteIds?.length || 0) + (item.continueLearningIds?.length || 0);
    if (relCount < 1) {
      reasons.push(`Item has 0 related entity links; link equity will be low.`);
      return { allowed: true, reasons, severity: 'warn' };
    }

    return { allowed: true, reasons: [], severity: 'pass' };
  }
}

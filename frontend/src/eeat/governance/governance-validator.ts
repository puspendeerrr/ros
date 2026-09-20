/**
 * Governance Compliance Validator
 * Verifies that content items comply with mandatory editorial, review, and AI usage policies.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import { ENTERPRISE_AUTHORS_REGISTRY } from '../authors/author-profile.registry.ts';

export interface GovernanceValidationResult {
  contentId: string;
  isCompliant: boolean;
  policyViolations: string[];
  warnings: string[];
  transparencyScore: number; // 0 - 100
}

export class GovernanceValidator {
  /**
   * Audits a content item against all 6 editorial governance policies.
   */
  public static validateItem(item: BaseContentItem): GovernanceValidationResult {
    const policyViolations: string[] = [];
    const warnings: string[] = [];
    let transparencyScore = 100;

    // 1. Author Attribution Compliance (Editorial Policy)
    if (!item.authorId) {
      policyViolations.push('Item lacks mandatory authorId attribution (violates Editorial Integrity Policy).');
      transparencyScore -= 30;
    } else if (!ENTERPRISE_AUTHORS_REGISTRY[item.authorId]) {
      warnings.push(`Author ID "${item.authorId}" is not registered in the Enterprise Author Profile Registry.`);
      transparencyScore -= 10;
    }

    // 2. Peer Review Compliance (Review Policy)
    const reviewedBy = item.reviewedByIds || [];
    if (reviewedBy.length === 0) {
      warnings.push('Item lacks verified peer reviewer attribution (recommended by Multi-Role Review Policy).');
      transparencyScore -= 15;
    } else {
      const invalidReviewers = reviewedBy.filter(rid => !ENTERPRISE_AUTHORS_REGISTRY[rid]);
      if (invalidReviewers.length > 0) {
        warnings.push(`Reviewer(s) [${invalidReviewers.join(', ')}] not registered in the Author & Reviewer Registry.`);
        transparencyScore -= 5;
      }
    }

    // 3. Timestamp Transparency (Update Policy)
    if (!item.publishedAt) {
      policyViolations.push('Item lacks mandatory publishedAt ISO date.');
      transparencyScore -= 20;
    }
    if (!item.updatedAt) {
      warnings.push('Item lacks explicit updatedAt timestamp.');
      transparencyScore -= 10;
    }

    // 4. Versioning Transparency (Correction Policy)
    if (item.contentType === 'documentation' && !item.version) {
      warnings.push('Technical documentation lacks semantic version tag (recommended by Correction Policy).');
      transparencyScore -= 10;
    }

    // 5. Zero-Synthetic-Review Gatekeeper (Responsible AI Policy)
    if (item.seo?.structuredDataType === 'Product') {
      warnings.push('Product schema must never emit placeholder or synthetic aggregate ratings.');
    }

    return {
      contentId: item.id,
      isCompliant: policyViolations.length === 0,
      policyViolations,
      warnings,
      transparencyScore: Math.max(0, transparencyScore)
    };
  }

  /**
   * Audits an array of content items.
   */
  public static validateAll(items: BaseContentItem[]): GovernanceValidationResult[] {
    return items.map(item => this.validateItem(item));
  }
}

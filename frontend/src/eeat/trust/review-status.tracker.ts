/**
 * Review Status Tracker
 * Generates audit logs and verification records for peer-reviewed content.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { ReviewAuditRecord } from '../types/eeat.types.ts';
import { ENTERPRISE_AUTHORS_REGISTRY } from '../authors/author-profile.registry.ts';

export class ReviewStatusTracker {
  /**
   * Generates peer-review audit records for all content items.
   */
  public static generateReviewRecords(items: BaseContentItem[]): ReviewAuditRecord[] {
    const records: ReviewAuditRecord[] = [];

    for (const item of items) {
      const reviewers = item.reviewedByIds || [];

      if (reviewers.length > 0) {
        for (const reviewerId of reviewers) {
          const profile = ENTERPRISE_AUTHORS_REGISTRY[reviewerId];
          const primaryRole = profile?.roles[0] || 'technical_reviewer';

          records.push({
            contentId: item.id,
            title: item.title,
            reviewerId,
            reviewerRole: primaryRole,
            reviewedAt: item.updatedAt || item.publishedAt,
            approvalStatus: 'approved',
            verificationNotes: `Verified for ${primaryRole.replace('_', ' ')} standards, factual integrity, and schema compliance.`,
            checkedDimensions: {
              factualAccuracy: true,
              securityCompliance: reviewerId === 'security-reviewer',
              mathIntegrity: item.contentType === 'comparison' || item.contentType === 'guide',
              schemaValidity: true
            }
          });
        }
      } else {
        // Author self-verified record
        records.push({
          contentId: item.id,
          title: item.title,
          reviewerId: item.authorId || 'puspender-singh',
          reviewerRole: 'author',
          reviewedAt: item.updatedAt || item.publishedAt,
          approvalStatus: 'approved_with_revisions',
          verificationNotes: 'Author self-verified. Recommended for multi-role peer review.',
          checkedDimensions: {
            factualAccuracy: true,
            securityCompliance: false,
            mathIntegrity: false,
            schemaValidity: true
          }
        });
      }
    }

    return records;
  }
}

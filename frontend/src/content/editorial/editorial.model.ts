import type { EditorialStatus } from '../models/base.model.js';

export interface EditorialReviewLog {
  reviewedBy: string;
  reviewedAt: string;
  notes?: string;
  approved: boolean;
}

export interface EditorialTransition {
  fromStatus: EditorialStatus;
  toStatus: EditorialStatus;
  allowedRoles: string[];
}

export interface EditorialAuditRecord {
  contentId: string;
  status: EditorialStatus;
  history: EditorialReviewLog[];
  scheduleDate?: string;
  deprecatedReason?: string;
  replacementSlug?: string;
}

export interface PublishabilityResult {
  canPublish: boolean;
  blockers: string[];
  warnings: string[];
}

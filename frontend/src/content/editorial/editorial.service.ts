import type { BaseContentItem, EditorialStatus } from '../models/base.model.js';
import type { PublishabilityResult } from './editorial.model.js';

export const EditorialService = {
  getEffectiveStatus(item: BaseContentItem): EditorialStatus {
    if (item.editorialStatus === 'scheduled' && item.scheduledFor) {
      const now = new Date().getTime();
      const scheduledTime = new Date(item.scheduledFor).getTime();
      if (now >= scheduledTime) {
        return 'published';
      }
    }
    return item.editorialStatus;
  },

  isPubliclyIndexable(item: BaseContentItem): boolean {
    const status = this.getEffectiveStatus(item);
    if (item.seo.noIndex) return false;
    return status === 'published' || status === 'needs_update';
  },

  checkPublishability(item: BaseContentItem): PublishabilityResult {
    const blockers: string[] = [];
    const warnings: string[] = [];

    if (!item.title || item.title.trim().length === 0) blockers.push('Missing required title.');
    if (!item.slug || item.slug.trim().length === 0) blockers.push('Missing required slug.');
    if (!item.authorId) blockers.push('Missing designated author ID.');
    if (!item.description || item.description.trim().length === 0) blockers.push('Missing meta description.');
    if (!item.categoryId) blockers.push('Missing primary taxonomy category.');

    if (item.editorialStatus === 'draft') warnings.push('Item is marked as draft.');
    if (item.editorialStatus === 'review' && (!item.reviewedByIds || item.reviewedByIds.length === 0)) {
      warnings.push('Item is in review stage but has no registered reviewers.');
    }
    if (item.editorialStatus === 'deprecated') {
      warnings.push('Item is deprecated and should provide a replacement canonical link.');
    }

    return {
      canPublish: blockers.length === 0,
      blockers,
      warnings
    };
  }
};

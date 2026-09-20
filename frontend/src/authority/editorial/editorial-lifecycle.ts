/**
 * 10-State Editorial Lifecycle Engine
 * Idea -> Candidate -> Approved -> Planned -> Writing -> Review -> Published -> Needs Refresh -> Deprecated -> Archived
 */

import type { AuthorityEditorialLifecycle } from '../types/authority.types.ts';

export interface LifecycleTransitionRule {
  from: AuthorityEditorialLifecycle;
  to: AuthorityEditorialLifecycle[];
  requiresApproval?: boolean;
}

export class EditorialLifecycleManager {
  private static readonly VALID_TRANSITIONS: Record<AuthorityEditorialLifecycle, AuthorityEditorialLifecycle[]> = {
    idea: ['candidate', 'deprecated', 'archived'],
    candidate: ['approved', 'idea', 'deprecated'],
    approved: ['planned', 'candidate', 'deprecated'],
    planned: ['writing', 'approved', 'deprecated'],
    writing: ['review', 'planned'],
    review: ['published', 'writing', 'deprecated'],
    published: ['needs_refresh', 'deprecated', 'archived'],
    needs_refresh: ['writing', 'published', 'deprecated', 'archived'],
    deprecated: ['archived', 'published'],
    archived: ['idea'] // can be resurrected
  };

  /**
   * Validates whether a lifecycle transition is allowed.
   */
  public static canTransition(from: AuthorityEditorialLifecycle, to: AuthorityEditorialLifecycle): boolean {
    const allowed = this.VALID_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  /**
   * Asserts transition validity or throws deterministic error.
   */
  public static validateTransition(from: AuthorityEditorialLifecycle, to: AuthorityEditorialLifecycle): void {
    if (!this.canTransition(from, to)) {
      throw new Error(`Invalid editorial transition from "${from}" to "${to}". Allowed: [${this.VALID_TRANSITIONS[from].join(', ')}]`);
    }
  }

  /**
   * Checks if an item is considered active in the production public catalog.
   */
  public static isPubliclyVisible(status: AuthorityEditorialLifecycle): boolean {
    return status === 'published' || status === 'needs_refresh';
  }

  /**
   * Returns display badge metadata for UI/editorial dashboards.
   */
  public static getLifecycleBadge(status: AuthorityEditorialLifecycle): { label: string; color: string } {
    switch (status) {
      case 'idea': return { label: 'Idea', color: 'gray' };
      case 'candidate': return { label: 'Candidate', color: 'purple' };
      case 'approved': return { label: 'Approved', color: 'blue' };
      case 'planned': return { label: 'Planned', color: 'cyan' };
      case 'writing': return { label: 'In Progress', color: 'orange' };
      case 'review': return { label: 'Under Review', color: 'gold' };
      case 'published': return { label: 'Published', color: 'green' };
      case 'needs_refresh': return { label: 'Needs Refresh', color: 'volcano' };
      case 'deprecated': return { label: 'Deprecated', color: 'red' };
      case 'archived': return { label: 'Archived', color: 'darkgray' };
    }
  }
}

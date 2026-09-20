/**
 * EEAT Composite Authority Scorer
 * Evaluates Google Search Quality Rater Guidelines: Experience, Expertise, Authoritativeness, and Trustworthiness.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { EeatCompositeScore } from '../types/eeat.types.ts';
import { ENTERPRISE_AUTHORS_REGISTRY } from '../authors/author-profile.registry.ts';
import { AuthorAuthorityEngine } from '../authors/author-authority.engine.ts';
import { TrustSignalEngine } from '../trust/trust-signal.engine.ts';

export class EeatAuthorityScorer {
  /**
   * Scores all items across the 4 pillars of EEAT.
   */
  public static scoreAll(items: BaseContentItem[]): EeatCompositeScore[] {
    return items.map(item => this.scoreItem(item));
  }

  /**
   * Scores a single content item.
   */
  public static scoreItem(item: BaseContentItem): EeatCompositeScore {
    const author = ENTERPRISE_AUTHORS_REGISTRY[item.authorId];
    const authorMetrics = author ? AuthorAuthorityEngine.evaluateProfile(author) : null;
    const trustSignals = TrustSignalEngine.computeSignals(item);

    // 1. Experience Score (0 - 100)
    // First-hand empirical proof, production configurations, real benchmarks
    let experienceScore = 65;
    if (item.contentType === 'guide' || item.contentType === 'documentation') experienceScore += 20;
    if (authorMetrics && authorMetrics.experienceScore >= 80) experienceScore += 15;
    experienceScore = Math.min(100, experienceScore);

    // 2. Expertise Score (0 - 100)
    // Author credentials, certifications, technical accuracy
    let expertiseScore = 70;
    if (authorMetrics) {
      expertiseScore = Math.min(100, Math.round(authorMetrics.authorityScore * 0.9 + 10));
    }

    // 3. Authoritativeness Score (0 - 100)
    // Inbound relationships, entity graph centrality, brand backing
    let authoritativenessScore = 70;
    const relCount = (item.seeAlsoIds?.length || 0) + (item.prerequisiteIds?.length || 0);
    authoritativenessScore += Math.min(20, relCount * 8);
    if (item.isFeatured) authoritativenessScore += 10;
    authoritativenessScore = Math.min(100, authoritativenessScore);

    // 4. Trustworthiness Score (0 - 100)
    // Peer reviews, transparency, source references, security validation
    const trustworthinessScore = trustSignals.overallTrustScore;

    // 5. Composite EEAT Score (0 - 100)
    // Trust is the most critical factor according to Google's Search Quality Rater Guidelines
    const compositeEeatScore = Math.min(
      100,
      Math.round(
        trustworthinessScore * 0.35 +
        expertiseScore * 0.25 +
        authoritativenessScore * 0.20 +
        experienceScore * 0.20
      )
    );

    // Rating tier
    let ratingTier: EeatCompositeScore['ratingTier'] = 'standard';
    if (compositeEeatScore >= 90) {
      ratingTier = 'elite';
    } else if (compositeEeatScore >= 78) {
      ratingTier = 'authoritative';
    } else if (compositeEeatScore >= 65) {
      ratingTier = 'standard';
    } else {
      ratingTier = 'needs_reinforcement';
    }

    return {
      contentId: item.id,
      title: item.title,
      experienceScore,
      expertiseScore,
      authoritativenessScore,
      trustworthinessScore,
      compositeEeatScore,
      ratingTier
    };
  }
}

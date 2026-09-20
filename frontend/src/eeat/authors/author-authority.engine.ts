/**
 * Author & Reviewer Authority Engine
 * Analyzes verified credentials, published vs. reviewed corpus, and knowledge domain depth.
 */

import type { EnterpriseAuthorProfile } from '../types/eeat.types.ts';
import { ENTERPRISE_AUTHORS_REGISTRY } from './author-profile.registry.ts';

export interface AuthorAuthorityMetrics {
  authorId: string;
  name: string;
  roles: string[];
  authorityScore: number;        // 0 - 100
  experienceScore: number;       // 0 - 100
  expertiseDepthScore: number;   // 0 - 100
  trustworthinessScore: number;  // 0 - 100
  totalPublished: number;
  totalReviewed: number;
  hasSocialVerification: boolean;
  hasCertifications: boolean;
}

export class AuthorAuthorityEngine {
  private profiles: Map<string, EnterpriseAuthorProfile> = new Map();

  constructor(customProfiles?: Record<string, EnterpriseAuthorProfile>) {
    const registry = customProfiles || ENTERPRISE_AUTHORS_REGISTRY;
    for (const [id, profile] of Object.entries(registry)) {
      this.profiles.set(id, profile);
    }
  }

  /**
   * Retrieves an author or reviewer by ID.
   */
  public getProfile(id: string): EnterpriseAuthorProfile | undefined {
    return this.profiles.get(id);
  }

  /**
   * Evaluates authority metrics for all registered authors and reviewers.
   */
  public evaluateAllAuthors(): AuthorAuthorityMetrics[] {
    return Array.from(this.profiles.values()).map(profile => AuthorAuthorityEngine.evaluateProfile(profile));
  }

  /**
   * Evaluates a single profile across EEAT author signals.
   */
  public static evaluateProfile(profile: EnterpriseAuthorProfile): AuthorAuthorityMetrics {
    // 1. Experience Score based on years in industry (10 yrs = 100)
    const experienceScore = Math.min(100, Math.round((profile.experienceYears / 10) * 100));

    // 2. Expertise Depth Score based on explicit areas and knowledge domains
    const areasCount = profile.expertiseAreas.length;
    const domainsCount = profile.knowledgeDomains.length;
    const expertiseDepthScore = Math.min(100, (areasCount * 12) + (domainsCount * 10));

    // 3. Social & External Verification
    const hasSocialVerification = Boolean(
      profile.socialProfiles.github ||
      profile.socialProfiles.linkedin ||
      profile.socialProfiles.website
    );

    // 4. Certifications check
    const hasCertifications = profile.certifications.length > 0;

    // 5. Trustworthiness Score
    let trustworthinessScore = 60;
    if (hasSocialVerification) trustworthinessScore += 15;
    if (hasCertifications) trustworthinessScore += 15;
    if (profile.isStaff) trustworthinessScore += 10;
    trustworthinessScore = Math.min(100, trustworthinessScore);

    // 6. Overall Author Authority Score
    const totalPublished = profile.publishedContentIds.length;
    const totalReviewed = profile.reviewedContentIds.length;
    const corpusWeight = Math.min(100, (totalPublished * 10) + (totalReviewed * 15));

    const authorityScore = Math.min(
      100,
      Math.round(
        experienceScore * 0.30 +
        expertiseDepthScore * 0.25 +
        trustworthinessScore * 0.25 +
        corpusWeight * 0.20
      )
    );

    return {
      authorId: profile.id,
      name: profile.name,
      roles: profile.roles,
      authorityScore,
      experienceScore,
      expertiseDepthScore,
      trustworthinessScore,
      totalPublished,
      totalReviewed,
      hasSocialVerification,
      hasCertifications
    };
  }
}

export const authorAuthorityEngine = new AuthorAuthorityEngine();

/**
 * Type Definitions for Enterprise EEAT, Trust Signals & Entity Authority Framework (Phase 5C)
 */

import type { ContentType, ProductArea } from '../../content/models/base.model.ts';

// --------------------------------------------------------------------------
// 1. Canonical Entity Identities & Knowledge Graph
// --------------------------------------------------------------------------

export type CanonicalEntityType =
  | 'Organization'
  | 'Brand'
  | 'SoftwareApplication'
  | 'Feature'
  | 'Solution'
  | 'Industry'
  | 'Person'
  | 'Documentation'
  | 'DefinedTerm';

export interface CanonicalEntity {
  id: string;
  canonicalUri: string;
  name: string;
  entityType: CanonicalEntityType;
  description: string;
  alternateNames?: string[];
  identifier: string;            // Permanent UUID or URN
  sameAs?: string[];             // Cross-graph reconciliation (Wikidata, Crunchbase, GitHub, LinkedIn, etc.)
  parentEntityId?: string;
  childEntityIds?: string[];
  relatedEntityIds?: string[];
  productArea?: ProductArea;
}

// --------------------------------------------------------------------------
// 2. Author & Multi-Role Reviewers
// --------------------------------------------------------------------------

export type ReviewerRole =
  | 'author'
  | 'technical_reviewer'
  | 'legal_reviewer'
  | 'product_reviewer'
  | 'engineering_reviewer';

export interface EnterpriseAuthorProfile {
  id: string;
  slug: string;
  name: string;
  roles: ReviewerRole[];
  jobTitle: string;
  biography: string;
  avatarUrl: string;
  email?: string;
  socialProfiles: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    orcid?: string;
  };
  expertiseAreas: string[];
  experienceYears: number;
  certifications: string[];
  organization: string;
  publishedContentIds: string[];
  reviewedContentIds: string[];
  knowledgeDomains: string[];
  isStaff: boolean;
  credentialsSummary: string;
}

// --------------------------------------------------------------------------
// 3. Editorial Governance Policies
// --------------------------------------------------------------------------

export interface GovernancePolicy {
  policyId: string;
  name: string;
  version: string;
  lastAudited: string;
  status: 'active' | 'under_review' | 'deprecated';
  purpose: string;
  standards: string[];
  enforcementMechanism: string;
  publicUrl: string;
}

// --------------------------------------------------------------------------
// 4. Trust Signals & Review Logs
// --------------------------------------------------------------------------

export interface PageTrustSignals {
  contentId: string;
  title: string;
  verifiedAuthor: boolean;
  authorId: string;
  authorName: string;
  reviewedByIds: string[];
  reviewStatus: 'peer_reviewed' | 'author_verified' | 'pending_review';
  lastUpdated: string;
  contentVersion: string;
  referencesCount: number;
  documentationLinksCount: number;
  productEvidenceStrength: 'empirical' | 'benchmark' | 'declarative' | 'none';
  technicalAccuracyScore: number; // 0 - 100
  transparencyScore: number;       // 0 - 100
  overallTrustScore: number;       // 0 - 100
}

export interface ReviewAuditRecord {
  contentId: string;
  title: string;
  reviewerId: string;
  reviewerRole: ReviewerRole;
  reviewedAt: string;
  approvalStatus: 'approved' | 'approved_with_revisions' | 'rejected';
  verificationNotes: string;
  checkedDimensions: {
    factualAccuracy: boolean;
    securityCompliance: boolean;
    mathIntegrity: boolean;
    schemaValidity: boolean;
  };
}

// --------------------------------------------------------------------------
// 5. Source Attribution & Reference Map
// --------------------------------------------------------------------------

export type ReferenceSourceType =
  | 'internal_documentation'
  | 'release_notes'
  | 'technical_specification'
  | 'regulatory_standard'
  | 'official_product_source'
  | 'external_benchmark';

export interface SourceReference {
  referenceId: string;
  title: string;
  url: string;
  sourceType: ReferenceSourceType;
  publisher: string;
  publishedDate?: string;
  isVerifiable: boolean;
  verificationHash?: string;
}

export interface ContentReferenceMap {
  contentId: string;
  contentTitle: string;
  references: SourceReference[];
  totalReferences: number;
  hasOfficialSpecification: boolean;
}

// --------------------------------------------------------------------------
// 6. Knowledge Panel Readiness
// --------------------------------------------------------------------------

export interface KnowledgePanelReadiness {
  entityId: string;
  entityName: string;
  entityType: CanonicalEntityType;
  readinessScore: number;        // 0 - 100
  sameAsLinksCount: number;
  attributes: {
    hasLogo: boolean;
    hasContactPoint: boolean;
    hasFoundingDate: boolean;
    hasKnowsAbout: boolean;
    hasMemberOf: boolean;
    hasPublisher: boolean;
    hasSameAs: boolean;
    hasIdentifier: boolean;
  };
  missingCriticalAttributes: string[];
  recommendations: string[];
}

// --------------------------------------------------------------------------
// 7. AI Citation & Answer Engine Optimization (AEO/GEO)
// --------------------------------------------------------------------------

export interface AiCitationMetrics {
  contentId: string;
  title: string;
  contentType: ContentType;
  citationReadinessScore: number; // 0 - 100
  definitionQuality: number;      // 0 - 100 (concise definitional sentences)
  answerCompleteness: number;     // 0 - 100 (direct answers to core intent)
  evidenceStrength: number;       // 0 - 100 (hard percentages, metrics, benchmark data)
  entityLinking: number;          // 0 - 100 (unambiguous entity references)
  faqQuality: number;             // 0 - 100 (Q&A pair schema richness)
  schemaCompleteness: number;     // 0 - 100 (valid JSON-LD graph nodes)
  referenceCoverage: number;      // 0 - 100 (verifiable source backing)
  isAiOverviewOptimized: boolean; // boolean flag for top-tier extraction
}

// --------------------------------------------------------------------------
// 8. EEAT Composite Authority Scoring
// --------------------------------------------------------------------------

export interface EeatCompositeScore {
  contentId: string;
  title: string;
  experienceScore: number;       // 0 - 100 (first-hand proof, implementation examples)
  expertiseScore: number;        // 0 - 100 (author credentials, technical accuracy)
  authoritativenessScore: number;// 0 - 100 (entity graph centrality, inbound references)
  trustworthinessScore: number;  // 0 - 100 (peer review, transparency, source citations)
  compositeEeatScore: number;    // 0 - 100
  ratingTier: 'elite' | 'authoritative' | 'standard' | 'needs_reinforcement';
}

// --------------------------------------------------------------------------
// 9. Master Framework Summary
// --------------------------------------------------------------------------

export interface MasterEeatReport {
  buildId: string;
  generatedAt: string;
  totalEntitiesAudited: number;
  totalAuthorsAudited: number;
  averageEeatScore: number;
  averageTrustScore: number;
  averageCitationScore: number;
  peerReviewedPercent: number;
  knowledgePanelReadyCount: number;
  warnings: string[];
}

export interface GeneratedEeatArtifacts {
  entityAuthority: CanonicalEntity[];
  authorProfiles: EnterpriseAuthorProfile[];
  reviewStatus: ReviewAuditRecord[];
  editorialGovernance: GovernancePolicy[];
  trustSignals: PageTrustSignals[];
  knowledgePanelReadiness: KnowledgePanelReadiness[];
  citationReadiness: AiCitationMetrics[];
  referenceMap: ContentReferenceMap[];
}

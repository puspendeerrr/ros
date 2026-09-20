/**
 * Type Definitions for Enterprise Topical Authority & Content Cluster Engine (Phase 5B)
 */

import type { ContentType, ProductArea, SearchIntent, TargetAudience } from '../../content/models/base.model.ts';

// --------------------------------------------------------------------------
// 1. Cluster Taxonomy & Nesting
// --------------------------------------------------------------------------

export type KnowledgeDomain =
  | 'ordering_technology'
  | 'kitchen_operations'
  | 'hospitality_economics'
  | 'enterprise_management'
  | 'guest_experience'
  | 'restaurant_analytics';

export type BusinessDomain =
  | 'revenue_recovery'
  | 'operational_efficiency'
  | 'customer_retention'
  | 'franchise_scale'
  | 'cost_reduction';

export type ClusterMaturity =
  | 'seed'         // < 3 items, < 40% completeness
  | 'growing'      // 3-5 items, 40-65% completeness
  | 'established'  // 6-9 items, 65-80% completeness
  | 'authority'    // 10-14 items, 80-92% completeness
  | 'dominant';    // >= 15 items, > 92% completeness

export interface SubtopicDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetKeywords: string[];
  recommendedContentType: ContentType;
}

export interface LearningPathStep {
  stepNumber: number;
  title: string;
  contentId?: string;
  contentType: ContentType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  outcome: string;
}

export interface TopicCluster {
  id: string;
  name: string;
  slug: string;
  domain: KnowledgeDomain;
  businessDomain: BusinessDomain;
  description: string;
  primaryPillar: {
    title: string;
    targetKeyword: string;
    entityId: string;
  };
  supportingTopics: string[];
  subtopics: SubtopicDefinition[];
  learningPath: LearningPathStep[];
  requiredContentTypes: ContentType[];
  targetAudience: TargetAudience[];
  primaryProductArea: ProductArea;
  parentClusterId?: string;
  childClusterIds?: string[];
  entityIds: string[];
}

// --------------------------------------------------------------------------
// 2. 10-State Editorial Lifecycle
// --------------------------------------------------------------------------

export type AuthorityEditorialLifecycle =
  | 'idea'
  | 'candidate'
  | 'approved'
  | 'planned'
  | 'writing'
  | 'review'
  | 'published'
  | 'needs_refresh'
  | 'deprecated'
  | 'archived';

// --------------------------------------------------------------------------
// 3. Knowledge Graph & Entity Dependencies
// --------------------------------------------------------------------------

export type GraphRelationType =
  | 'prerequisite_for'
  | 'depends_on'
  | 'supports_pillar'
  | 'subtopic_of'
  | 'contrasts_with'
  | 'powers_solution'
  | 'industry_variant_of'
  | 'references_term'
  | 'see_also';

export interface GraphEdge {
  fromId: string;
  toId: string;
  relation: GraphRelationType;
  inverseRelation: GraphRelationType;
  weight: number; // 0.1 - 1.0
}

export interface EntityGraphNode {
  id: string;
  title: string;
  contentType: ContentType;
  productArea: ProductArea;
  inDegree: number;
  outDegree: number;
  centralityScore: number;       // 0 - 100
  dependencyScore: number;       // 0 - 100 (topological foundational depth)
  prerequisiteChain: string[];
  dependentIds: string[];
}

// --------------------------------------------------------------------------
// 4. Content Overlap & Gap Models
// --------------------------------------------------------------------------

export interface ContentOverlapItem {
  itemAId: string;
  itemBId: string;
  titleA: string;
  titleB: string;
  overlapScore: number;          // 0 - 100 percentage
  sharedTags: string[];
  sharedEntities: string[];
  recommendation: 'merge' | 'differentiate' | 'cross_link' | 'acceptable';
}

export interface ContentGapItem {
  clusterId: string;
  gapType:
    | 'missing_guide'
    | 'missing_faq'
    | 'missing_glossary'
    | 'missing_documentation'
    | 'missing_comparison'
    | 'missing_industry'
    | 'missing_solution'
    | 'search_intent_gap'
    | 'journey_gap';
  title: string;
  reason: string;                // Explicit rationale
  urgency: 'critical' | 'high' | 'medium' | 'low';
  targetContentType: ContentType;
  suggestedSlug: string;
  targetAudience: TargetAudience;
  targetIntent: SearchIntent;
}

// --------------------------------------------------------------------------
// 5. Freshness & Content Decay
// --------------------------------------------------------------------------

export type RefreshPriority = 'urgent' | 'moderate' | 'low' | 'fresh';

export interface ContentDecayRecord {
  contentId: string;
  title: string;
  contentType: ContentType;
  publishedAt: string;
  updatedAt: string;
  daysSinceUpdate: number;
  freshnessScore: number;        // 0 - 100
  decayRate: number;             // decay multiplier per month
  refreshPriority: RefreshPriority;
  recommendations: string[];
}

// --------------------------------------------------------------------------
// 6. Authority & Ownership Scoring
// --------------------------------------------------------------------------

export interface ClusterAuthorityScore {
  clusterId: string;
  clusterName: string;
  completeness: number;          // 0 - 100
  relationshipDensity: number;   // 0 - 100
  entityCoverage: number;        // 0 - 100
  linkStrength: number;          // 0 - 100
  intentCoverage: number;        // 0 - 100
  documentationDepth: number;    // 0 - 100
  glossaryDepth: number;         // 0 - 100
  faqDepth: number;              // 0 - 100
  comparisonCoverage: number;    // 0 - 100
  topicOwnershipScore: number;   // 0 - 100 (Market category ownership)
  maturity: ClusterMaturity;
  overallAuthorityScore: number; // 0 - 100
}

export interface EntityAuthorityScore {
  entityId: string;
  title: string;
  contentType: ContentType;
  authorityScore: number;        // 0 - 100
  dependencyScore: number;       // 0 - 100
  coverageScore: number;         // 0 - 100
  freshnessScore: number;        // 0 - 100
  relationshipScore: number;     // 0 - 100
  citationReadiness: number;     // 0 - 100
  clusterMemberships: string[];
}

// --------------------------------------------------------------------------
// 7. Editorial Backlog & Recommendation Models
// --------------------------------------------------------------------------

export interface EditorialBacklogItem {
  id: string;
  title: string;
  suggestedSlug: string;
  targetClusterId: string;
  targetContentType: ContentType;
  priorityScore: number;         // 0 - 100
  confidenceScore: number;       // 0 - 100 (Ready for generation vs manual review)
  businessValue: 'high' | 'medium' | 'strategic';
  estimatedAuthorityGain: number;// Points gain (e.g. +4.5)
  primaryIntent: SearchIntent;
  targetAudience: TargetAudience;
  recommendationReason: string;  // Explicit reason (e.g. "Need FAQ because Search Intent Gap")
  suggestedEntitiesToLink: string[];
  status: AuthorityEditorialLifecycle;
}

// --------------------------------------------------------------------------
// 8. Multi-Dimensional Knowledge Coverage
// --------------------------------------------------------------------------

export interface KnowledgeCoverageReport {
  generatedAt: string;
  topicCoverage: Record<string, { totalItems: number; coveragePercent: number }>;
  industryCoverage: Record<string, { totalItems: number; coveragePercent: number }>;
  featureCoverage: Record<string, { totalItems: number; coveragePercent: number }>;
  userJourneyCoverage: {
    awareness: number;      // 0 - 100%
    consideration: number;  // 0 - 100%
    decision: number;       // 0 - 100%
    onboarding: number;     // 0 - 100%
    expansion: number;      // 0 - 100%
  };
  searchIntentCoverage: {
    informational: number;
    commercial: number;
    transactional: number;
    navigational: number;
  };
  funnelStageCoverage: {
    tofu: number; // Top of Funnel
    mofu: number; // Middle of Funnel
    bofu: number; // Bottom of Funnel
  };
  businessGoalCoverage: {
    marketplace_replacement: number;
    operational_efficiency: number;
    franchise_scaling: number;
  };
}

// --------------------------------------------------------------------------
// 9. Inter-Cluster Link Health
// --------------------------------------------------------------------------

export interface ClusterLinkHealthItem {
  clusterId: string;
  internalLinksCount: number;
  crossClusterOutboundCount: number;
  crossClusterInboundCount: number;
  isHub: boolean;
  isOrphan: boolean;
  healthStatus: 'healthy' | 'overlinked' | 'underlinked' | 'isolated';
  suggestedBridges: Array<{ targetClusterId: string; reason: string }>;
}

// --------------------------------------------------------------------------
// 10. Master Authority Engine Output
// --------------------------------------------------------------------------

export interface MasterTopicalAuthorityReport {
  buildId: string;
  generatedAt: string;
  totalClusters: number;
  totalEntities: number;
  averageClusterAuthority: number;
  averageTopicOwnership: number;
  dominantClustersCount: number;
  authorityClustersCount: number;
  establishedClustersCount: number;
  growingClustersCount: number;
  seedClustersCount: number;
  criticalGapsCount: number;
  totalBacklogItems: number;
  warnings: string[];
}

export interface GeneratedAuthorityArtifacts {
  authorityClusters: TopicCluster[];
  contentGaps: ContentGapItem[];
  contentOverlaps: ContentOverlapItem[];
  editorialBacklog: EditorialBacklogItem[];
  knowledgeCoverage: KnowledgeCoverageReport;
  contentFreshness: ContentDecayRecord[];
  clusterAuthorityScores: ClusterAuthorityScore[];
  entityAuthorityScores: EntityAuthorityScore[];
  entityGraph: {
    nodesCount: number;
    edgesCount: number;
    nodes: unknown[];
    edges: unknown[];
  };
  clusterHealth: ClusterLinkHealthItem[];
}

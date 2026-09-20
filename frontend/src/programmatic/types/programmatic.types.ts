/**
 * Core Type Definitions for Programmatic SEO Engine (Phase 5A)
 */

import type { ContentType, TargetAudience, ProductArea } from '../../content/models/base.model.ts';
import type { SchemaNode } from '../../schema/types/schema.types.ts';
import type { BreadcrumbItem } from '../../utils/schema.ts';

export type ProgrammaticLifecycleState =
  | 'candidate'
  | 'generated'
  | 'published'
  | 'needs_improvement'
  | 'deprecated';

export type SearchIntentType =
  | 'informational'
  | 'commercial'
  | 'commercial_investigation'
  | 'navigational'
  | 'transactional';

export type PageTemplateType =
  | 'FeatureTemplate'
  | 'SolutionTemplate'
  | 'IndustryTemplate'
  | 'ComparisonTemplate'
  | 'DocsTemplate'
  | 'ResourceTemplate'
  | 'PricingTemplate'
  | 'LegalTemplate';

export interface SemanticAnchorVariants {
  exact: string;
  descriptive: string;
  action: string;
}

export interface InternalLinkReference {
  targetId: string;
  targetUrl: string;
  anchor: string;
  anchorVariant: 'exact' | 'descriptive' | 'action';
  relationshipType: 'feature' | 'industry' | 'guide' | 'faq' | 'doc' | 'prerequisite' | 'next_step';
}

export interface ProgrammaticSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogImageAlt: string;
  noIndex: boolean;
  readingTimeMinutes: number;
  updatedAt: string;
  targetAudience: TargetAudience;
  searchIntent: SearchIntentType;
  primaryKeywords: string[];
}

export interface QualityScorecard {
  totalScore: number; // 0 - 100
  metadataScore: number; // max 25
  schemaScore: number; // max 25
  linkingScore: number; // max 25
  relationalScore: number; // max 25
  issues: string[];
  passed: boolean; // totalScore >= 75
}

export interface ProgrammaticPageDefinition {
  id: string;
  slug: string;
  url: string;
  patternVersion: string;
  contentType: ContentType;
  template: PageTemplateType;
  lifecycleState: ProgrammaticLifecycleState;
  crawlPriority: number; // 0.1 to 1.0
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  searchWeight: number; // 0 - 100
  metadata: ProgrammaticSeoMetadata;
  breadcrumbs: BreadcrumbItem[];
  schemaGraph: SchemaNode[];
  internalLinks: InternalLinkReference[];
  qualityScore: QualityScorecard;
  contentDependencyScore: number; // 0 - 100
  aiCitationScore: number; // 0 - 100
  aiSummary: string;
  productArea: ProductArea;
}

export interface EntityCoverageReport {
  generatedAt: string;
  totalEntities: number;
  coverageRatio: number; // 0 - 100%
  entities: Array<{
    id: string;
    name: string;
    productArea: ProductArea;
    hasFeature: boolean;
    hasGuide: boolean;
    hasFaq: boolean;
    hasComparison: boolean;
    hasDoc: boolean;
    clusterScore: number;
    gaps: string[];
  }>;
}

export interface TopicClusterReport {
  generatedAt: string;
  totalPillars: number;
  pillars: Array<{
    pillarId: string;
    pillarName: string;
    productArea: ProductArea;
    clusterSize: number;
    sufficientSupport: boolean;
    clusterItems: Array<{ id: string; contentType: ContentType; title: string }>;
  }>;
}

export interface SerpPreviewItem {
  id: string;
  url: string;
  title: string;
  titleLength: number;
  titleTruncated: boolean;
  description: string;
  descriptionLength: number;
  descriptionTruncated: boolean;
  breadcrumbsPreview: string;
  openGraphPreview: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogType: string;
  };
}

export interface CitationReadinessReport {
  generatedAt: string;
  averageCitationScore: number;
  pages: Array<{
    id: string;
    url: string;
    aiCitationScore: number;
    criteria: {
      schemaCompleteness: number; // max 30
      qaPairsCount: number; // max 25
      entityGraphLinks: number; // max 20
      authorAttribution: number; // max 15
      freshness: number; // max 10
    };
    verdict: 'citation_ready' | 'needs_reinforcement';
  }>;
}

export interface TemplateHealthReport {
  generatedAt: string;
  totalTemplates: number;
  templates: Record<PageTemplateType, {
    count: number;
    averageQualityScore: number;
    errorRate: number;
    healthStatus: 'healthy' | 'warning' | 'critical';
  }>;
}

export interface ProgrammaticReport {
  generatedAt: string;
  buildId: string;
  totalPages: number;
  lifecycleBreakdown: Record<ProgrammaticLifecycleState, number>;
  intentBreakdown: Record<SearchIntentType, number>;
  averageQualityScore: number;
  averageCitationScore: number;
  skippedCandidatesCount: number;
  skippedReasons: string[];
  crawlPriorityDistribution: Record<string, number>;
  warnings: string[];
  errors: string[];
}

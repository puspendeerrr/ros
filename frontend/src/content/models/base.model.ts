/**
 * Core Base Content Model & Lifecycle Specifications
 * Powers all 15 content entities in Restaurant OS Content Engine.
 */

export type ContentType =
  | 'feature'
  | 'solution'
  | 'industry'
  | 'blog'
  | 'guide'
  | 'tutorial'
  | 'documentation'
  | 'faq'
  | 'glossary'
  | 'comparison'
  | 'case_study'
  | 'whitepaper'
  | 'download'
  | 'changelog'
  | 'roadmap';

export type EditorialStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'scheduled'
  | 'needs_update'
  | 'deprecated'
  | 'archived';

export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type TargetAudience =
  | 'restaurateur'
  | 'franchise_operator'
  | 'general_manager'
  | 'chef'
  | 'developer'
  | 'investor'
  | 'all';

export type SearchIntent =
  | 'informational'
  | 'commercial'
  | 'transactional'
  | 'navigational';

export type ProductArea =
  | 'qr_menu'
  | 'cloud_pos'
  | 'kds'
  | 'multi_branch'
  | 'billing'
  | 'crm'
  | 'analytics'
  | 'platform';

export interface ContentSeoMetadata {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  ogImage?: string;
  keywords?: string[];
  structuredDataType?: 'Article' | 'TechArticle' | 'FAQPage' | 'HowTo' | 'SoftwareApplication' | 'Product';
  aiSummary?: string;
}

export interface ContentSearchScores {
  popularityScore: number;     // 0 - 100 historical engagement
  freshnessScore: number;      // 0 - 100 freshness decay calculation
  entityRelevanceScore: number; // 0 - 100 authority & centrality weight
}

export interface BaseContentItem {
  id: string;
  slug: string;
  contentType: ContentType;
  title: string;
  description: string;
  summary: string;

  // Editorial Lifecycle
  editorialStatus: EditorialStatus;
  publishedAt: string;          // ISO Date string
  updatedAt: string;            // ISO Date string
  scheduledFor?: string;        // ISO Date string if scheduled
  version?: string;             // e.g., 'latest', 'v1', 'v2'

  // Authorship & Attribution
  authorId: string;
  reviewedByIds?: string[];
  lastUpdatedById?: string;

  // Multi-Axis Taxonomy
  categoryId: string;
  subCategoryId?: string;
  tagIds: string[];
  topicIds?: string[];
  collectionIds?: string[];
  seriesId?: string;
  orderInSeries?: number;
  audience: TargetAudience;
  intent: SearchIntent;
  productArea: ProductArea;

  // Telemetry & Flags
  readingTimeMinutes: number;
  difficulty?: ContentDifficulty;
  isFeatured?: boolean;
  searchScores: ContentSearchScores;

  // Relationships
  prerequisiteIds?: string[];
  seeAlsoIds?: string[];
  relatedContentIds?: string[];
  relatedFeatureIds?: string[];
  relatedIndustryIds?: string[];
  continueLearningIds?: string[];

  // SEO / AEO / GEO
  seo: ContentSeoMetadata;
}

import type { TargetAudience, SearchIntent, ProductArea } from '../models/base.model.js';

export interface TaxonomyTerm {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface SubCategory extends TaxonomyTerm {
  parentCategoryId: string;
}

export interface Category extends TaxonomyTerm {
  iconName?: string;
  subCategories: SubCategory[];
}

export interface Tag extends TaxonomyTerm {
  colorHex?: string;
}

export interface TopicCluster extends TaxonomyTerm {
  pillarArticleSlug?: string;
  clusterSlugs: string[];
}

export interface Collection extends TaxonomyTerm {
  curatedContentIds: string[];
  bannerImageUrl?: string;
}

export interface ContentSeries extends TaxonomyTerm {
  orderedContentSlugs: string[];
  estimatedTotalHours: number;
}

export interface LearningPathStep {
  stepIndex: number;
  contentId: string;
  isRequired: boolean;
}

export interface LearningPath extends TaxonomyTerm {
  targetAudience: TargetAudience;
  prerequisiteDescription?: string;
  steps: LearningPathStep[];
}

export interface TaxonomyCatalog {
  categories: Category[];
  tags: Tag[];
  topics: TopicCluster[];
  collections: Collection[];
  series: ContentSeries[];
  learningPaths: LearningPath[];
  audiences: Array<{ id: TargetAudience; name: string; description: string }>;
  intents: Array<{ id: SearchIntent; name: string; description: string }>;
  productAreas: Array<{ id: ProductArea; name: string; description: string }>;
}

/**
 * Search Information Architecture & Schema
 * Scalable entity taxonomy indexing features, industries, solutions,
 * guides, blogs, API references, FAQs, documentation, comparisons, and glossary items.
 */

export type SearchEntityType =
  | 'feature'
  | 'solution'
  | 'industry'
  | 'guide'
  | 'blog'
  | 'api'
  | 'faq'
  | 'documentation'
  | 'comparison'
  | 'glossary';

export interface SearchableDocument {
  id: string;
  title: string;
  description: string;
  url: string;
  entityType: SearchEntityType;
  category: string;
  tags: string[];
  keywords: string[];
}

export interface SearchFilterOptions {
  entityTypes?: SearchEntityType[];
  category?: string;
  query: string;
  limit?: number;
}

export const SEARCH_ENTITY_METADATA: Record<SearchEntityType, { label: string; badgeColor: string }> = {
  feature: { label: 'Feature', badgeColor: '#F97316' },
  solution: { label: 'Solution', badgeColor: '#3B82F6' },
  industry: { label: 'Industry', badgeColor: '#10B981' },
  documentation: { label: 'Documentation', badgeColor: '#6366F1' },
  guide: { label: 'Guide', badgeColor: '#8B5CF6' },
  blog: { label: 'Blog', badgeColor: '#EC4899' },
  api: { label: 'API Reference', badgeColor: '#14B8A6' },
  faq: { label: 'FAQ', badgeColor: '#F59E0B' },
  comparison: { label: 'Comparison', badgeColor: '#64748B' },
  glossary: { label: 'Glossary', badgeColor: '#06B6D4' }
};

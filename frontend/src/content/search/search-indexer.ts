import type { BaseContentItem } from '../models/base.model.ts';
import type { SearchableDocument, SearchEntityType } from '../../config/search.config.ts';
import { AUTHORS_REGISTRY } from '../authors/authors.registry.ts';
import { TAXONOMY_REGISTRY } from '../taxonomy/taxonomy.registry.ts';

export interface ScoredSearchDocument extends SearchableDocument {
  summary: string;
  authorName: string;
  headings: string[];
  readingTimeMinutes: number;
  popularityScore: number;
  freshnessScore: number;
  entityRelevanceScore: number;
}

export class ContentSearchIndexer {
  public static calculateFreshness(updatedAt: string): number {
    const daysOld = Math.max(0, (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    // Time decay formula: halflife at 90 days
    return Math.round(Math.max(10, 100 * Math.exp(-daysOld / 90)));
  }

  public static mapToSearchDocument(item: BaseContentItem, headings: string[] = []): ScoredSearchDocument {
    const author = AUTHORS_REGISTRY[item.authorId];
    const category = TAXONOMY_REGISTRY.categories.find(c => c.id === item.categoryId);

    // Compute dynamic freshness score
    const freshnessScore = item.searchScores?.freshnessScore ?? this.calculateFreshness(item.updatedAt);
    const popularityScore = item.searchScores?.popularityScore ?? 50;
    const entityRelevanceScore = item.searchScores?.entityRelevanceScore ?? 75;

    // Map ContentType to SearchEntityType
    let entityType: SearchEntityType = 'guide';
    if (item.contentType === 'feature') entityType = 'feature';
    else if (item.contentType === 'solution') entityType = 'solution';
    else if (item.contentType === 'industry') entityType = 'industry';
    else if (item.contentType === 'documentation') entityType = 'documentation';
    else if (item.contentType === 'blog') entityType = 'blog';
    else if (item.contentType === 'faq') entityType = 'faq';
    else if (item.contentType === 'glossary') entityType = 'glossary';
    else if (item.contentType === 'comparison') entityType = 'comparison';

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      summary: item.summary,
      url: item.seo.canonicalUrl || `/${item.contentType}/${item.slug}`,
      entityType,
      category: category?.name || item.categoryId,
      tags: item.tagIds,
      keywords: item.seo.keywords || item.tagIds,
      headings,
      authorName: author?.name || 'Restaurant OS Team',
      readingTimeMinutes: item.readingTimeMinutes || 5,
      popularityScore,
      freshnessScore,
      entityRelevanceScore
    };
  }

  public static buildSearchIndex(items: BaseContentItem[]): ScoredSearchDocument[] {
    return items
      .filter(item => item.editorialStatus === 'published' || item.editorialStatus === 'needs_update')
      .map(item => this.mapToSearchDocument(item));
  }
}

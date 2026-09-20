import type { BaseContentItem, ContentType } from '../models/base.model.js';
import type { SeriesNavigation } from './relationships.types.js';

export class ContentRelationshipEngine {
  private itemsById: Map<string, BaseContentItem> = new Map();
  private itemsBySlug: Map<string, BaseContentItem> = new Map();

  public registerItem(item: BaseContentItem): void {
    this.itemsById.set(item.id, item);
    this.itemsBySlug.set(`${item.contentType}:${item.slug}`, item);
  }

  public registerItems(items: BaseContentItem[]): void {
    items.forEach(item => this.registerItem(item));
  }

  public getItemById(id: string): BaseContentItem | undefined {
    return this.itemsById.get(id);
  }

  public getSeeAlso(item: BaseContentItem, limit = 4): BaseContentItem[] {
    if (item.seeAlsoIds && item.seeAlsoIds.length > 0) {
      return item.seeAlsoIds
        .map(id => this.itemsById.get(id))
        .filter((i): i is BaseContentItem => Boolean(i))
        .slice(0, limit);
    }
    // Fallback: match by shared category or audience
    return Array.from(this.itemsById.values())
      .filter(i => i.id !== item.id && (i.categoryId === item.categoryId || i.audience === item.audience))
      .slice(0, limit);
  }

  public getPrerequisites(item: BaseContentItem): BaseContentItem[] {
    if (!item.prerequisiteIds || item.prerequisiteIds.length === 0) {
      return [];
    }
    return item.prerequisiteIds
      .map(id => this.itemsById.get(id))
      .filter((i): i is BaseContentItem => Boolean(i));
  }

  public getContinueLearning(item: BaseContentItem, limit = 3): BaseContentItem[] {
    if (item.continueLearningIds && item.continueLearningIds.length > 0) {
      return item.continueLearningIds
        .map(id => this.itemsById.get(id))
        .filter((i): i is BaseContentItem => Boolean(i))
        .slice(0, limit);
    }
    // Fallback: next difficulty level in same productArea
    return Array.from(this.itemsById.values())
      .filter(i => i.id !== item.id && i.productArea === item.productArea)
      .slice(0, limit);
  }

  public getRelatedArticles(item: BaseContentItem, limit = 3): BaseContentItem[] {
    return Array.from(this.itemsById.values())
      .filter(i => i.id !== item.id && (i.contentType === 'blog' || i.contentType === 'guide'))
      .sort((a, b) => {
        const aScore = a.tagIds.filter(t => item.tagIds.includes(t)).length;
        const bScore = b.tagIds.filter(t => item.tagIds.includes(t)).length;
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  public getRelatedGuides(item: BaseContentItem, limit = 3): BaseContentItem[] {
    return Array.from(this.itemsById.values())
      .filter(i => i.id !== item.id && i.contentType === 'guide')
      .slice(0, limit);
  }

  public getRelatedDocumentation(item: BaseContentItem, limit = 3): BaseContentItem[] {
    return Array.from(this.itemsById.values())
      .filter(i => i.id !== item.id && i.contentType === 'documentation')
      .slice(0, limit);
  }

  public getRelatedFaqs(item: BaseContentItem, limit = 5): BaseContentItem[] {
    return Array.from(this.itemsById.values())
      .filter(i => i.contentType === 'faq' && (i.categoryId === item.categoryId || i.productArea === item.productArea))
      .slice(0, limit);
  }

  public getPopularContent(contentType?: ContentType, limit = 5): BaseContentItem[] {
    let list = Array.from(this.itemsById.values());
    if (contentType) list = list.filter(i => i.contentType === contentType);
    return list
      .sort((a, b) => (b.searchScores?.popularityScore || 0) - (a.searchScores?.popularityScore || 0))
      .slice(0, limit);
  }

  public getRecentlyUpdated(limit = 5): BaseContentItem[] {
    return Array.from(this.itemsById.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  public getSeriesNavigation(seriesId: string, currentContentId: string): SeriesNavigation | null {
    const seriesItems = Array.from(this.itemsById.values())
      .filter(i => i.seriesId === seriesId)
      .sort((a, b) => (a.orderInSeries || 0) - (b.orderInSeries || 0));

    if (seriesItems.length === 0) return null;

    const currentIndex = seriesItems.findIndex(i => i.id === currentContentId);
    if (currentIndex === -1) return null;

    return {
      seriesId,
      currentIndex,
      totalSteps: seriesItems.length,
      prevItem: currentIndex > 0 ? seriesItems[currentIndex - 1] : undefined,
      nextItem: currentIndex < seriesItems.length - 1 ? seriesItems[currentIndex + 1] : undefined
    };
  }
}

export const relationshipEngine = new ContentRelationshipEngine();

import type { CMSAdapter, CMSFilterOptions } from './cms.types.js';
import type { BaseContentItem, ContentType } from '../models/base.model.js';
import type { AuthorProfile } from '../authors/author.model.js';
import type { TaxonomyCatalog } from '../taxonomy/taxonomy.model.js';
import type { MediaAsset } from '../media/media.model.js';
import { AuthorService } from '../authors/authors.registry.js';
import { TaxonomyService } from '../taxonomy/taxonomy.registry.js';

export class LocalStaticCMSAdapter implements CMSAdapter {
  public readonly providerName = 'local-repository-static';
  public readonly isReadOnly = true;

  private contentStore: Map<string, BaseContentItem> = new Map();

  public registerStaticItem(item: BaseContentItem): void {
    this.contentStore.set(`${item.contentType}:${item.slug}`, item);
  }

  public async getContentList<T extends BaseContentItem>(options?: CMSFilterOptions): Promise<T[]> {
    let items = Array.from(this.contentStore.values());

    if (options?.contentType) {
      items = items.filter(item => item.contentType === options.contentType);
    }
    if (options?.categorySlug) {
      items = items.filter(item => item.categoryId === options.categorySlug);
    }
    if (options?.offset) {
      items = items.slice(options.offset);
    }
    if (options?.limit) {
      items = items.slice(0, options.limit);
    }

    return items as T[];
  }

  public async getContentBySlug<T extends BaseContentItem>(contentType: ContentType, slug: string): Promise<T | null> {
    const item = this.contentStore.get(`${contentType}:${slug}`);
    return (item as T) || null;
  }

  public async getAuthors(): Promise<AuthorProfile[]> {
    return AuthorService.getAllAuthors();
  }

  public async getTaxonomy(): Promise<TaxonomyCatalog> {
    return TaxonomyService.getAllTaxonomy();
  }

  public async syncMedia(assetId: string): Promise<MediaAsset | null> {
    // Local filesystem / public folder media resolver stub
    return {
      id: assetId,
      type: 'image',
      url: `/assets/${assetId}`,
      altText: `Restaurant OS asset ${assetId}`
    };
  }

  public async performHealthCheck(): Promise<{ ok: boolean; message: string }> {
    return {
      ok: true,
      message: `Local static CMS active with ${this.contentStore.size} items indexed.`
    };
  }
}

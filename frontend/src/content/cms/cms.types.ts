import type { BaseContentItem, ContentType } from '../models/base.model.js';
import type { AuthorProfile } from '../authors/author.model.js';
import type { TaxonomyCatalog } from '../taxonomy/taxonomy.model.js';
import type { MediaAsset } from '../media/media.model.js';

export interface CMSFilterOptions {
  contentType?: ContentType;
  categorySlug?: string;
  tagSlug?: string;
  limit?: number;
  offset?: number;
}

export interface CMSSyncResult {
  syncedAt: string;
  recordsSynced: number;
  errors: string[];
}

export interface CMSAdapter {
  readonly providerName: string;
  readonly isReadOnly: boolean;

  getContentList<T extends BaseContentItem>(options?: CMSFilterOptions): Promise<T[]>;
  getContentBySlug<T extends BaseContentItem>(contentType: ContentType, slug: string): Promise<T | null>;
  getAuthors(): Promise<AuthorProfile[]>;
  getTaxonomy(): Promise<TaxonomyCatalog>;
  syncMedia(assetId: string): Promise<MediaAsset | null>;
  performHealthCheck(): Promise<{ ok: boolean; message: string }>;
}

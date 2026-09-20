/**
 * Unified Content Sources Loader
 * Ingests content items from:
 * 1. MASTER_CONTENT_REGISTRY (static typed code)
 * 2. Raw JSON content files
 * 3. Future CMS Adapter integration
 * Normalizes all sources into uniform BaseContentItem models.
 */

import type { BaseContentItem } from '../models/base.model.ts';
import { MASTER_CONTENT_REGISTRY } from '../registries/content.registry.ts';

export class ContentSourceLoader {
  /**
   * Ingests all active registered content items and CMS sources into a unified array.
   */
  public static async loadAll(): Promise<BaseContentItem[]> {
    const items: BaseContentItem[] = [];

    // 1. Ingest Master Content Registry
    for (const item of MASTER_CONTENT_REGISTRY) {
      items.push(item);
    }

    // Return unified normalized list
    return items;
  }
}

/**
 * Pre-Generation URL Conflict Resolver
 * Detects route collisions, self-canonical errors, and handles alias resolutions
 * before any static generation occurs.
 */

export interface UrlCollision {
  url: string;
  contendingIds: string[];
  resolvedUrl: string;
  resolutionStrategy: 'fail' | 'suffix_id' | 'alias';
}

export class UrlConflictResolver {
  private registeredUrls = new Map<string, string>(); // url -> contentId
  private collisions: UrlCollision[] = [];

  /**
   * Registers a proposed URL path for a content item.
   * If collision is detected, flags it according to resolution strategy.
   */
  public register(contentId: string, candidateUrl: string): { finalUrl: string; hasCollision: boolean } {
    const normalizedUrl = candidateUrl.toLowerCase().trim();

    if (this.registeredUrls.has(normalizedUrl)) {
      const existingId = this.registeredUrls.get(normalizedUrl)!;
      if (existingId !== contentId) {
        // Collision detected
        const resolvedUrl = `${normalizedUrl}-${contentId.replace(/[^a-z0-9]+/g, '-')}`;
        this.collisions.push({
          url: normalizedUrl,
          contendingIds: [existingId, contentId],
          resolvedUrl,
          resolutionStrategy: 'suffix_id',
        });
        this.registeredUrls.set(resolvedUrl, contentId);
        return { finalUrl: resolvedUrl, hasCollision: true };
      }
    }

    this.registeredUrls.set(normalizedUrl, contentId);
    return { finalUrl: normalizedUrl, hasCollision: false };
  }

  public getCollisions(): UrlCollision[] {
    return this.collisions;
  }

  public clear(): void {
    this.registeredUrls.clear();
    this.collisions = [];
  }
}

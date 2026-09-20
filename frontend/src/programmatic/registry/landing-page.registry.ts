/**
 * Master Landing Page Registry
 * Central catalog of all programmatically generated landing pages.
 */

import type { ProgrammaticPageDefinition } from '../types/programmatic.types.ts';
import type { ContentType } from '../../content/models/base.model.ts';

export class LandingPageRegistry {
  private static instance: LandingPageRegistry;
  private pages: Map<string, ProgrammaticPageDefinition> = new Map();

  private constructor() {}

  public static getInstance(): LandingPageRegistry {
    if (!LandingPageRegistry.instance) {
      LandingPageRegistry.instance = new LandingPageRegistry();
    }
    return LandingPageRegistry.instance;
  }

  public register(page: ProgrammaticPageDefinition): void {
    this.pages.set(page.id, page);
  }

  public get(id: string): ProgrammaticPageDefinition | undefined {
    return this.pages.get(id);
  }

  public getAll(): ProgrammaticPageDefinition[] {
    return Array.from(this.pages.values());
  }

  public getByContentType(contentType: ContentType): ProgrammaticPageDefinition[] {
    return this.getAll().filter(p => p.contentType === contentType);
  }

  public getByUrl(url: string): ProgrammaticPageDefinition | undefined {
    return this.getAll().find(p => p.url === url || p.metadata.canonicalUrl.endsWith(url));
  }

  public clear(): void {
    this.pages.clear();
  }

  public size(): number {
    return this.pages.size;
  }
}

export const landingPageRegistry = LandingPageRegistry.getInstance();

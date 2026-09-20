import {
  GLOBAL_ENTITY_IDS,
  resolveWebPageId,
  resolveAuthorPersonId,
  resolveDefinedTermId
} from './entity-ids.ts';

export interface RegisteredEntityRecord {
  id: string;
  type: string;
  canonicalId: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export class EntityRegistry {
  private static entityMap: Map<string, RegisteredEntityRecord> = new Map();

  public static register(type: string, key: string, url: string, metadata?: Record<string, unknown>): string {
    let canonicalId: string;

    if (type === 'organization') canonicalId = GLOBAL_ENTITY_IDS.organization;
    else if (type === 'brand') canonicalId = GLOBAL_ENTITY_IDS.brand;
    else if (type === 'website') canonicalId = GLOBAL_ENTITY_IDS.website;
    else if (type === 'software') canonicalId = GLOBAL_ENTITY_IDS.softwareApplication;
    else if (type === 'person' || type === 'author') canonicalId = resolveAuthorPersonId(key);
    else if (type === 'glossary') canonicalId = resolveDefinedTermId(key);
    else canonicalId = resolveWebPageId(url);

    this.entityMap.set(`${type}:${key}`, {
      id: key,
      type,
      canonicalId,
      url,
      metadata
    });

    return canonicalId;
  }

  public static getCanonicalId(type: string, key: string): string | undefined {
    return this.entityMap.get(`${type}:${key}`)?.canonicalId;
  }

  public static getEntity(type: string, key: string): RegisteredEntityRecord | undefined {
    return this.entityMap.get(`${type}:${key}`);
  }

  public static getAllEntities(): RegisteredEntityRecord[] {
    return Array.from(this.entityMap.values());
  }
}

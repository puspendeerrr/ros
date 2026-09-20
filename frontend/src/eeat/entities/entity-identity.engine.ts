/**
 * Entity Identity Engine
 * Resolves, validates, and guarantees permanent canonical identities across the knowledge graph.
 */

import type { CanonicalEntity } from '../types/eeat.types.ts';
import { CANONICAL_ENTITIES_REGISTRY } from './canonical-entity.registry.ts';

export class EntityIdentityEngine {
  private entities: Map<string, CanonicalEntity> = new Map();

  constructor(customEntities?: CanonicalEntity[]) {
    const list = customEntities || CANONICAL_ENTITIES_REGISTRY;
    for (const ent of list) {
      this.entities.set(ent.id, ent);
    }
  }

  /**
   * Retrieves all canonical entities.
   */
  public getAllEntities(): CanonicalEntity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Resolves an entity by its internal ID.
   */
  public getEntityById(id: string): CanonicalEntity | undefined {
    return this.entities.get(id);
  }

  /**
   * Resolves an entity by its canonical URI.
   */
  public getEntityByUri(canonicalUri: string): CanonicalEntity | undefined {
    return Array.from(this.entities.values()).find(e => e.canonicalUri === canonicalUri);
  }

  /**
   * Validates permanent identity completeness and sameAs reconciliation.
   */
  public validateEntityIntegrity(entity: CanonicalEntity): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!entity.canonicalUri.startsWith('http://') && !entity.canonicalUri.startsWith('https://')) {
      errors.push(`Entity ${entity.id} has invalid canonical URI: must be an absolute HTTP/HTTPS URL.`);
    }

    if (!entity.identifier || !entity.identifier.startsWith('urn:uuid:')) {
      errors.push(`Entity ${entity.id} lacks a permanent UUID identifier (urn:uuid:...).`);
    }

    if (!entity.sameAs || entity.sameAs.length === 0) {
      warnings.push(`Entity ${entity.id} lacks sameAs cross-graph references for external authority reconciliation.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Traverses parent/child entity hierarchy.
   */
  public getEntityHierarchy(entityId: string): {
    parent?: CanonicalEntity;
    children: CanonicalEntity[];
    related: CanonicalEntity[];
  } {
    const target = this.entities.get(entityId);
    if (!target) return { children: [], related: [] };

    const parent = target.parentEntityId ? this.entities.get(target.parentEntityId) : undefined;
    const children = (target.childEntityIds || [])
      .map(cid => this.entities.get(cid))
      .filter((c): c is CanonicalEntity => Boolean(c));
    const related = (target.relatedEntityIds || [])
      .map(rid => this.entities.get(rid))
      .filter((r): r is CanonicalEntity => Boolean(r));

    return { parent, children, related };
  }
}

export const entityIdentityEngine = new EntityIdentityEngine();

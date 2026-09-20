/**
 * Knowledge Panel Readiness Engine
 * Evaluates entity attribute density and external graph authority for Google Knowledge Panels.
 */

import type { CanonicalEntity, KnowledgePanelReadiness } from '../types/eeat.types.ts';
import { CANONICAL_ENTITIES_REGISTRY } from '../entities/canonical-entity.registry.ts';

export class KnowledgePanelEngine {
  /**
   * Evaluates Knowledge Panel readiness across all registered canonical entities.
   */
  public static evaluateAllEntities(
    entities: CanonicalEntity[] = CANONICAL_ENTITIES_REGISTRY
  ): KnowledgePanelReadiness[] {
    return entities.map(entity => this.evaluateEntity(entity));
  }

  /**
   * Evaluates a single entity for Knowledge Panel completeness.
   */
  public static evaluateEntity(entity: CanonicalEntity): KnowledgePanelReadiness {
    const isOrgOrBrand = entity.entityType === 'Organization' || entity.entityType === 'Brand';
    const isSoftware = entity.entityType === 'SoftwareApplication';

    const hasSameAs = Boolean(entity.sameAs && entity.sameAs.length > 0);
    const sameAsLinksCount = entity.sameAs?.length || 0;
    const hasIdentifier = Boolean(entity.identifier && entity.identifier.startsWith('urn:uuid:'));

    // Simulated presence check based on global schema nodes
    const hasLogo = isOrgOrBrand || isSoftware;
    const hasContactPoint = isOrgOrBrand;
    const hasFoundingDate = isOrgOrBrand;
    const hasKnowsAbout = true;
    const hasMemberOf = isOrgOrBrand;
    const hasPublisher = !isOrgOrBrand;

    const attributes = {
      hasLogo,
      hasContactPoint,
      hasFoundingDate,
      hasKnowsAbout,
      hasMemberOf,
      hasPublisher,
      hasSameAs,
      hasIdentifier
    };

    const missingCriticalAttributes: string[] = [];
    const recommendations: string[] = [];

    if (!hasSameAs || sameAsLinksCount < 2) {
      missingCriticalAttributes.push('sameAs (requires >= 2 external authority URLs)');
      recommendations.push(`Link ${entity.name} to verified Wikidata, Crunchbase, or GitHub profiles.`);
    }

    if (isOrgOrBrand && !hasContactPoint) {
      missingCriticalAttributes.push('contactPoint');
      recommendations.push('Add formal customer support and sales contactPoint schema.');
    }

    // Score calculation (0 - 100)
    let readinessScore = 50;
    if (hasIdentifier) readinessScore += 10;
    if (hasSameAs) readinessScore += Math.min(20, sameAsLinksCount * 10);
    if (hasLogo) readinessScore += 10;
    if (hasContactPoint) readinessScore += 5;
    if (hasFoundingDate) readinessScore += 5;

    return {
      entityId: entity.id,
      entityName: entity.name,
      entityType: entity.entityType,
      readinessScore: Math.min(100, readinessScore),
      sameAsLinksCount,
      attributes,
      missingCriticalAttributes,
      recommendations
    };
  }
}

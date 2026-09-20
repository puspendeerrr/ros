/**
 * Knowledge Graph Health Engine
 * Audits broken relationships, orphan entities, duplicate entities, missing references, and graph connectivity.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type {
  BrokenRelationship,
  DuplicateEntityDetection,
  KnowledgeGraphHealthData
} from '../types/intelligence.types.ts';

export class KnowledgeGraphHealthEngine {
  /**
   * Audits the Knowledge Graph built from content items.
   */
  public static audit(items: BaseContentItem[]): KnowledgeGraphHealthData {
    const allIds = new Set(items.map(i => i.id));
    const brokenRelationships: BrokenRelationship[] = [];
    const entityTargetCounts: Record<string, number> = {};
    const entitySourceCounts: Record<string, number> = {};

    // Initialize counts
    items.forEach(i => {
      entityTargetCounts[i.id] = 0;
      entitySourceCounts[i.id] = 0;
    });

    // Verify relationship integrity
    items.forEach(item => {
      const related: string[] = [
        ...(item.relatedContentIds || []),
        ...(item.relatedFeatureIds || []),
        ...(item.relatedIndustryIds || []),
        ...(item.seeAlsoIds || [])
      ];
      entitySourceCounts[item.id] = (entitySourceCounts[item.id] || 0) + related.length;

      related.forEach((targetId: string) => {
        if (!allIds.has(targetId)) {
          brokenRelationships.push({
            sourceId: item.id,
            targetId,
            relationship: 'relatedEntity',
            issue: 'missing_target'
          });
        } else {
          entityTargetCounts[targetId] = (entityTargetCounts[targetId] || 0) + 1;
        }
      });
    });

    // Detect orphan entities (entities with 0 outgoing and 0 incoming connections)
    const orphanEntities: string[] = items
      .filter(i => (entitySourceCounts[i.id] || 0) === 0 && (entityTargetCounts[i.id] || 0) === 0)
      .map(i => i.id);

    // Detect duplicate entities using title normalization
    const titleMap: Record<string, string[]> = {};
    items.forEach(i => {
      const normalized = i.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!titleMap[normalized]) titleMap[normalized] = [];
      titleMap[normalized].push(i.id);
    });

    const duplicateEntities: DuplicateEntityDetection[] = Object.entries(titleMap)
      .filter(([_, list]) => list.length > 1)
      .map(([key, list]) => ({
        normalizedKey: key,
        entityIds: list,
        canonicalId: list[0]
      }));

    // Missing references: items lacking technical documentation or glossary links
    const missingReferences: Array<{ entityId: string; requiredDocType: string }> = [];
    items.forEach(item => {
      if (item.contentType === 'feature' && !item.relatedContentIds?.some((id: string) => id.includes('doc') || id.includes('guide'))) {
        missingReferences.push({
          entityId: item.id,
          requiredDocType: 'documentation'
        });
      }
    });

    // Nodes with weak connectivity (< 2 total connections)
    const weakConnectivityNodes = items
      .filter(i => ((entitySourceCounts[i.id] || 0) + (entityTargetCounts[i.id] || 0)) < 2)
      .map(i => i.id);

    const totalEntities = items.length;
    const totalRelationships = Object.values(entitySourceCounts).reduce((a, b) => a + b, 0);
    const maxPossibleEdges = Math.max(1, totalEntities * (totalEntities - 1));
    const densityScore = Math.min(100, Math.round((totalRelationships / maxPossibleEdges) * 200));

    // Health score drops on broken relations, orphans, duplicates
    const deductions =
      brokenRelationships.length * 15 +
      orphanEntities.length * 10 +
      duplicateEntities.length * 20 +
      weakConnectivityNodes.length * 2;

    const overallHealthScore = Math.max(20, Math.min(100, 100 - deductions));

    return {
      generatedAt: new Date().toISOString(),
      overallHealthScore,
      totalEntities,
      totalRelationships,
      densityScore,
      brokenRelationships,
      orphanEntities,
      duplicateEntities,
      missingReferences,
      weakConnectivityNodes
    };
  }
}

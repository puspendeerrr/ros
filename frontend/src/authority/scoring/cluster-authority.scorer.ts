/**
 * Cluster Authority & Topic Ownership Scorer
 * Evaluates completeness, relationship density, link strength, Topic Ownership Score, and Cluster Maturity.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type {
  ClusterAuthorityScore,
  ClusterMaturity,
  TopicCluster
} from '../types/authority.types.ts';
import { ENTERPRISE_CLUSTERS } from '../clusters/cluster.registry.ts';

export class ClusterAuthorityScorer {
  /**
   * Scores all clusters across multi-factor authority dimensions.
   */
  public static scoreAllClusters(
    items: BaseContentItem[],
    clusters: TopicCluster[] = ENTERPRISE_CLUSTERS
  ): ClusterAuthorityScore[] {
    return clusters.map(cluster => this.scoreCluster(cluster, items));
  }

  /**
   * Scores a single topic cluster.
   */
  public static scoreCluster(cluster: TopicCluster, allItems: BaseContentItem[]): ClusterAuthorityScore {
    // Find items belonging to this cluster
    const clusterItems = allItems.filter(item =>
      cluster.entityIds.includes(item.id) ||
      cluster.primaryPillar.entityId === item.id ||
      cluster.primaryProductArea === item.productArea
    );

    const totalItems = clusterItems.length;

    // 1. Completeness: Check required content archetypes
    const presentTypes = new Set(clusterItems.map(i => i.contentType));
    const requiredTypes = cluster.requiredContentTypes || ['feature', 'guide', 'faq', 'documentation'];
    const matchedRequired = requiredTypes.filter(t => presentTypes.has(t));
    const completeness = Math.round((matchedRequired.length / requiredTypes.length) * 100);

    // 2. Archetype Depths
    const documentationDepth = presentTypes.has('documentation') ? Math.min(100, clusterItems.filter(i => i.contentType === 'documentation').length * 40) : 0;
    const glossaryDepth = presentTypes.has('glossary') ? 100 : 0;
    const faqDepth = presentTypes.has('faq') ? 100 : 0;
    const comparisonCoverage = presentTypes.has('comparison') ? 100 : 0;

    // 3. Search Intent Coverage (out of 4 main intents)
    const presentIntents = new Set(clusterItems.map(i => i.intent));
    const intentCoverage = Math.round((presentIntents.size / 4) * 100);

    // 4. Relationship Density
    let totalRelationships = 0;
    clusterItems.forEach(i => {
      const relCount = (i.seeAlsoIds?.length || 0) +
                       (i.prerequisiteIds?.length || 0) +
                       (i.continueLearningIds?.length || 0) +
                       (i.relatedFeatureIds?.length || 0);
      totalRelationships += relCount;
    });
    const avgRels = totalItems > 0 ? totalRelationships / totalItems : 0;
    const relationshipDensity = Math.min(100, Math.round((avgRels / 3) * 100));

    // 5. Entity Coverage
    const clusterEntitiesCount = cluster.entityIds.length;
    const coveredEntities = cluster.entityIds.filter(id => allItems.some(i => i.id === id)).length;
    const entityCoverage = clusterEntitiesCount > 0 ? Math.round((coveredEntities / clusterEntitiesCount) * 100) : 50;

    // 6. Link Strength
    const linkStrength = Math.min(100, Math.round((avgRels * 25)));

    // 7. Topic Ownership Score (0 - 100)
    // Measures how thoroughly Restaurant OS owns this market category
    // Combines content volume, archetype coverage, entity depth, and link equity
    const volumeScore = Math.min(100, totalItems * 20); // 5 items = 100 volume
    const topicOwnershipScore = Math.min(
      100,
      Math.round(
        volumeScore * 0.35 +
        completeness * 0.30 +
        entityCoverage * 0.20 +
        relationshipDensity * 0.15
      )
    );

    // 8. Cluster Maturity Classification
    let maturity: ClusterMaturity = 'seed';
    if (totalItems >= 15 && completeness >= 90) {
      maturity = 'dominant';
    } else if (totalItems >= 10 && completeness >= 80) {
      maturity = 'authority';
    } else if (totalItems >= 6 && completeness >= 65) {
      maturity = 'established';
    } else if (totalItems >= 3 && completeness >= 40) {
      maturity = 'growing';
    } else {
      maturity = 'seed';
    }

    // 9. Overall Authority Score (0 - 100)
    const overallAuthorityScore = Math.min(
      100,
      Math.round(
        completeness * 0.25 +
        relationshipDensity * 0.20 +
        linkStrength * 0.15 +
        intentCoverage * 0.15 +
        topicOwnershipScore * 0.15 +
        entityCoverage * 0.10
      )
    );

    return {
      clusterId: cluster.id,
      clusterName: cluster.name,
      completeness,
      relationshipDensity,
      entityCoverage,
      linkStrength,
      intentCoverage,
      documentationDepth,
      glossaryDepth,
      faqDepth,
      comparisonCoverage,
      topicOwnershipScore,
      maturity,
      overallAuthorityScore
    };
  }
}

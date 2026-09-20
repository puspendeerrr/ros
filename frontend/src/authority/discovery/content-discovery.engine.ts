/**
 * Content Discovery Engine
 * Evaluates registered content and clusters to uncover unmapped topics and weak entities.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { TopicCluster } from '../types/authority.types.ts';
import { ENTERPRISE_CLUSTERS } from '../clusters/cluster.registry.ts';

export interface DiscoveredOpportunity {
  topic: string;
  clusterId: string;
  category: 'uncovered_subtopic' | 'weak_cluster' | 'missing_archetype' | 'missing_industry';
  reason: string;
  urgency: 'critical' | 'high' | 'medium';
}

export class ContentDiscoveryEngine {
  /**
   * Discovers content opportunities across the cluster universe.
   */
  public static discoverOpportunities(
    items: BaseContentItem[],
    clusters: TopicCluster[] = ENTERPRISE_CLUSTERS
  ): DiscoveredOpportunity[] {
    const opportunities: DiscoveredOpportunity[] = [];

    for (const cluster of clusters) {
      const clusterItems = items.filter(i =>
        cluster.entityIds.includes(i.id) ||
        cluster.primaryPillar.entityId === i.id ||
        cluster.primaryProductArea === i.productArea
      );

      // 1. Weak Cluster Discovery (< 3 items)
      if (clusterItems.length < 3) {
        opportunities.push({
          topic: cluster.name,
          clusterId: cluster.id,
          category: 'weak_cluster',
          reason: `Cluster has only ${clusterItems.length} active items. Minimum 4 items required for domain authority.`,
          urgency: 'critical'
        });
      }

      // 2. Uncovered Subtopics
      for (const subtopic of cluster.subtopics) {
        const hasSubtopicCovered = clusterItems.some(i =>
          i.slug.includes(subtopic.slug) ||
          i.title.toLowerCase().includes(subtopic.name.toLowerCase()) ||
          subtopic.targetKeywords.some(kw => i.title.toLowerCase().includes(kw.toLowerCase()))
        );

        if (!hasSubtopicCovered) {
          opportunities.push({
            topic: subtopic.name,
            clusterId: cluster.id,
            category: 'uncovered_subtopic',
            reason: `Core subtopic "${subtopic.name}" is defined in cluster taxonomy but has no dedicated page.`,
            urgency: 'high'
          });
        }
      }

      // 3. Missing Content Archetypes
      const presentTypes = new Set(clusterItems.map(i => i.contentType));
      for (const reqType of cluster.requiredContentTypes) {
        if (!presentTypes.has(reqType)) {
          opportunities.push({
            topic: `${cluster.name} — ${reqType.toUpperCase()}`,
            clusterId: cluster.id,
            category: 'missing_archetype',
            reason: `Required archetype "${reqType}" is completely missing in ${cluster.name}.`,
            urgency: reqType === 'faq' || reqType === 'guide' ? 'high' : 'medium'
          });
        }
      }
    }

    return opportunities;
  }
}

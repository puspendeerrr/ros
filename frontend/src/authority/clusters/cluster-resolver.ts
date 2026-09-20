/**
 * Cluster Resolver Engine
 * Maps pages, content items, and entities to their corresponding Topic Clusters.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { TopicCluster } from '../types/authority.types.ts';
import { ENTERPRISE_CLUSTERS } from './cluster.registry.ts';

export class ClusterResolver {
  private clusters: TopicCluster[] = ENTERPRISE_CLUSTERS;

  constructor(customClusters?: TopicCluster[]) {
    if (customClusters) {
      this.clusters = customClusters;
    }
  }

  /**
   * Retrieves all registered topic clusters.
   */
  public getAllClusters(): TopicCluster[] {
    return this.clusters;
  }

  /**
   * Finds a cluster by unique identifier.
   */
  public getClusterById(clusterId: string): TopicCluster | undefined {
    return this.clusters.find(c => c.id === clusterId);
  }

  /**
   * Resolves which clusters a content item belongs to.
   */
  public resolveClustersForItem(item: BaseContentItem): TopicCluster[] {
    const matchedClusters: TopicCluster[] = [];

    for (const cluster of this.clusters) {
      // 1. Direct entity ID match
      if (cluster.entityIds.includes(item.id)) {
        matchedClusters.push(cluster);
        continue;
      }

      // 2. Pillar match
      if (cluster.primaryPillar.entityId === item.id) {
        matchedClusters.push(cluster);
        continue;
      }

      // 3. Learning path match
      if (cluster.learningPath.some(step => step.contentId === item.id)) {
        matchedClusters.push(cluster);
        continue;
      }

      // 4. Primary product area match
      if (cluster.primaryProductArea === item.productArea) {
        matchedClusters.push(cluster);
        continue;
      }

      // 5. Keyword or tag similarity
      const hasMatchingTags = cluster.subtopics.some(sub =>
        sub.targetKeywords.some(kw =>
          item.seo?.keywords?.some(itemKw => itemKw.toLowerCase().includes(kw.toLowerCase()))
        )
      );

      if (hasMatchingTags) {
        matchedClusters.push(cluster);
      }
    }

    // Default to first general cluster if unmapped
    if (matchedClusters.length === 0 && this.clusters.length > 0) {
      matchedClusters.push(this.clusters[0]);
    }

    return matchedClusters;
  }

  /**
   * Gets all content items registered to a given cluster.
   */
  public getItemsForCluster(clusterId: string, allItems: BaseContentItem[]): BaseContentItem[] {
    const cluster = this.getClusterById(clusterId);
    if (!cluster) return [];

    return allItems.filter(item => {
      const parentClusters = this.resolveClustersForItem(item);
      return parentClusters.some(c => c.id === clusterId);
    });
  }

  /**
   * Builds a full nested hierarchy tree.
   */
  public getClusterHierarchyTree(): Array<TopicCluster & { children: TopicCluster[] }> {
    const rootClusters = this.clusters.filter(c => !c.parentClusterId);

    const buildTree = (cluster: TopicCluster): TopicCluster & { children: TopicCluster[] } => {
      const children = this.clusters
        .filter(c => c.parentClusterId === cluster.id)
        .map(buildTree);

      return {
        ...cluster,
        children
      };
    };

    return rootClusters.map(buildTree);
  }
}

export const clusterResolver = new ClusterResolver();

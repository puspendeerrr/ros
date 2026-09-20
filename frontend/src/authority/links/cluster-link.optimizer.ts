/**
 * Inter-Cluster Internal Link Optimizer
 * Analyzes link equity between distinct clusters and identifies bridges, hub pages, and orphan clusters.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { ClusterLinkHealthItem, TopicCluster } from '../types/authority.types.ts';
import { ENTERPRISE_CLUSTERS } from '../clusters/cluster.registry.ts';
import { ClusterResolver } from '../clusters/cluster-resolver.ts';

export class ClusterLinkOptimizer {
  /**
   * Audits cross-cluster internal links and produces a health report.
   */
  public static auditClusterLinks(
    items: BaseContentItem[],
    clusters: TopicCluster[] = ENTERPRISE_CLUSTERS
  ): ClusterLinkHealthItem[] {
    const resolver = new ClusterResolver(clusters);
    const healthItems: ClusterLinkHealthItem[] = [];

    for (const cluster of clusters) {
      const clusterItems = resolver.getItemsForCluster(cluster.id, items);
      const clusterItemIds = new Set(clusterItems.map(i => i.id));

      let internalLinksCount = 0;
      let crossClusterOutboundCount = 0;
      let crossClusterInboundCount = 0;

      // Count outbound edges
      for (const item of clusterItems) {
        const outTargets = [
          ...(item.seeAlsoIds || []),
          ...(item.prerequisiteIds || []),
          ...(item.continueLearningIds || []),
          ...(item.relatedFeatureIds || [])
        ];

        for (const targetId of outTargets) {
          if (clusterItemIds.has(targetId)) {
            internalLinksCount++;
          } else {
            crossClusterOutboundCount++;
          }
        }
      }

      // Count inbound edges from items outside this cluster
      const outsideItems = items.filter(i => !clusterItemIds.has(i.id));
      for (const outItem of outsideItems) {
        const outTargets = [
          ...(outItem.seeAlsoIds || []),
          ...(outItem.prerequisiteIds || []),
          ...(outItem.continueLearningIds || []),
          ...(outItem.relatedFeatureIds || [])
        ];

        for (const targetId of outTargets) {
          if (clusterItemIds.has(targetId)) {
            crossClusterInboundCount++;
          }
        }
      }

      const totalConnections = crossClusterInboundCount + crossClusterOutboundCount;
      const isHub = totalConnections >= 6 || internalLinksCount >= 8;
      const isOrphan = totalConnections === 0;

      let healthStatus: ClusterLinkHealthItem['healthStatus'] = 'healthy';
      if (isOrphan) {
        healthStatus = 'isolated';
      } else if (crossClusterInboundCount < 2) {
        healthStatus = 'underlinked';
      } else if (internalLinksCount > 25) {
        healthStatus = 'overlinked';
      }

      // Recommend bridges to related domain clusters
      const suggestedBridges: ClusterLinkHealthItem['suggestedBridges'] = [];
      if (cluster.id === 'cluster-qr-menu' && crossClusterOutboundCount < 4) {
        suggestedBridges.push({
          targetClusterId: 'cluster-cloud-pos',
          reason: 'Bridge QR menu table ordering to Cloud POS cashier ticket synchronization.'
        });
      } else if (cluster.id === 'cluster-kds' && crossClusterInboundCount < 2) {
        suggestedBridges.push({
          targetClusterId: 'cluster-cloud-pos',
          reason: 'Link KDS station routing from Cloud POS hardware setup guides.'
        });
      }

      healthItems.push({
        clusterId: cluster.id,
        internalLinksCount,
        crossClusterOutboundCount,
        crossClusterInboundCount,
        isHub,
        isOrphan,
        healthStatus,
        suggestedBridges
      });
    }

    return healthItems;
  }
}

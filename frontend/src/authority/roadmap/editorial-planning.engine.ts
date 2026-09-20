/**
 * Editorial Planning & Roadmap Engine
 * Generates prioritized content backlogs with Confidence Scores, explicit reasons, and authority gain estimates.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type {
  EditorialBacklogItem,
  TopicCluster
} from '../types/authority.types.ts';
import { ENTERPRISE_CLUSTERS } from '../clusters/cluster.registry.ts';
import { ContentGapEngine } from '../gaps/content-gap.engine.ts';
import { ClusterAuthorityScorer } from '../scoring/cluster-authority.scorer.ts';

export class EditorialPlanningEngine {
  /**
   * Generates a prioritized editorial backlog from detected gaps and cluster authority weaknesses.
   */
  public static generateBacklog(
    items: BaseContentItem[],
    clusters: TopicCluster[] = ENTERPRISE_CLUSTERS
  ): EditorialBacklogItem[] {
    const gaps = ContentGapEngine.analyzeGaps(items, clusters);
    const clusterScores = ClusterAuthorityScorer.scoreAllClusters(items, clusters);
    const scoreMap = new Map(clusterScores.map(cs => [cs.clusterId, cs]));

    const backlog: EditorialBacklogItem[] = [];

    for (let index = 0; index < gaps.length; index++) {
      const gap = gaps[index];
      const cluster = clusters.find(c => c.id === gap.clusterId);
      const clusterScore = scoreMap.get(gap.clusterId);
      const currentAuthority = clusterScore ? clusterScore.overallAuthorityScore : 50;

      // 1. Business Value Tier
      let businessValue: EditorialBacklogItem['businessValue'] = 'medium';
      if (cluster?.businessDomain === 'revenue_recovery' || gap.targetContentType === 'guide') {
        businessValue = 'high';
      } else if (cluster?.businessDomain === 'franchise_scale' || gap.targetContentType === 'comparison') {
        businessValue = 'strategic';
      }

      // 2. Estimated Authority Gain (+2.0 to +8.5 pts)
      const gapWeight = gap.urgency === 'critical' ? 7.5 : gap.urgency === 'high' ? 5.5 : 3.5;
      const authorityOpportunityFactor = (100 - currentAuthority) / 100;
      const estimatedAuthorityGain = Number((gapWeight * authorityOpportunityFactor).toFixed(1));

      // 3. Priority Score (0 - 100)
      const urgencyBase = gap.urgency === 'critical' ? 90 : gap.urgency === 'high' ? 75 : 60;
      const priorityScore = Math.min(
        100,
        Math.round(urgencyBase * 0.5 + (100 - currentAuthority) * 0.3 + (businessValue === 'high' ? 20 : 10))
      );

      // 4. Recommendation Confidence Score (0 - 100)
      // High confidence (>= 80): clear gap, high urgency, strong cluster alignment -> ready to generate
      // Low confidence (< 80): requires manual editorial review
      let confidenceScore = 75;
      if (gap.urgency === 'critical') confidenceScore += 15;
      if (clusterScore && clusterScore.entityCoverage >= 75) confidenceScore += 10;
      if (gap.targetContentType === 'faq' || gap.targetContentType === 'documentation') confidenceScore += 5;
      confidenceScore = Math.min(100, confidenceScore);

      // 5. Suggested Entities to Link
      const suggestedEntitiesToLink = cluster ? cluster.entityIds.slice(0, 3) : [];

      backlog.push({
        id: `backlog-${gap.clusterId}-${gap.targetContentType}-${index + 1}`,
        title: gap.title,
        suggestedSlug: gap.suggestedSlug,
        targetClusterId: gap.clusterId,
        targetContentType: gap.targetContentType,
        priorityScore,
        confidenceScore,
        businessValue,
        estimatedAuthorityGain,
        primaryIntent: gap.targetIntent,
        targetAudience: gap.targetAudience,
        recommendationReason: gap.reason,
        suggestedEntitiesToLink,
        status: confidenceScore >= 85 ? 'planned' : 'candidate'
      });
    }

    return backlog.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Filters backlog by recommended content archetype.
   */
  public static getRecommendationsByType(
    backlog: EditorialBacklogItem[]
  ): {
    guides: EditorialBacklogItem[];
    faqs: EditorialBacklogItem[];
    comparisons: EditorialBacklogItem[];
    documentation: EditorialBacklogItem[];
    glossary: EditorialBacklogItem[];
    features: EditorialBacklogItem[];
  } {
    return {
      guides: backlog.filter(b => b.targetContentType === 'guide'),
      faqs: backlog.filter(b => b.targetContentType === 'faq'),
      comparisons: backlog.filter(b => b.targetContentType === 'comparison'),
      documentation: backlog.filter(b => b.targetContentType === 'documentation'),
      glossary: backlog.filter(b => b.targetContentType === 'glossary'),
      features: backlog.filter(b => b.targetContentType === 'feature')
    };
  }
}

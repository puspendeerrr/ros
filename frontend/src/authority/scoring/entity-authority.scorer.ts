/**
 * Entity Authority & Dependency Scorer
 * Evaluates individual entities across authority, dependency depth, freshness, and citation readiness.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { EntityAuthorityScore, TopicCluster } from '../types/authority.types.ts';
import { KnowledgeGraphEngine } from '../graph/knowledge-graph.engine.ts';
import { ContentFreshnessEngine } from '../freshness/content-freshness.engine.ts';
import { ENTERPRISE_CLUSTERS } from '../clusters/cluster.registry.ts';

export class EntityAuthorityScorer {
  /**
   * Scores all entities using graph analysis, freshness calculation, and citation readiness.
   */
  public static scoreAllEntities(
    items: BaseContentItem[],
    graphEngine?: KnowledgeGraphEngine,
    clusters: TopicCluster[] = ENTERPRISE_CLUSTERS
  ): EntityAuthorityScore[] {
    const graph = graphEngine || new KnowledgeGraphEngine(items);
    const referenceDate = new Date('2026-09-21T00:00:00Z');

    return items.map(item => {
      const graphNode = graph.getNode(item.id);
      const decayRecord = ContentFreshnessEngine.computeDecayRecord(item, referenceDate);

      // 1. Dependency Score from Knowledge Graph (0 - 100)
      const dependencyScore = graphNode ? graphNode.dependencyScore : 20;

      // 2. Relationship Score based on in-degree and reciprocal links (0 - 100)
      const totalEdges = (graphNode?.inDegree || 0) + (graphNode?.outDegree || 0);
      const relationshipScore = Math.min(100, Math.round((totalEdges / 4) * 100));

      // 3. Freshness Score (0 - 100)
      const freshnessScore = decayRecord.freshnessScore;

      // 4. Citation Readiness (0 - 100)
      // Measures how primed the entity is for LLM answer extraction and Rich Results
      let citationReadiness = 70; // baseline
      if (item.seo?.structuredDataType) citationReadiness += 15;
      if (item.authorId) citationReadiness += 5;
      if (item.summary && item.summary.length >= 80) citationReadiness += 5;
      if (item.seo?.keywords && item.seo.keywords.length >= 3) citationReadiness += 5;
      citationReadiness = Math.min(100, citationReadiness);

      // 5. Coverage Score (completeness of content metadata)
      let coverageScore = 60;
      if (item.description && item.description.length >= 100) coverageScore += 15;
      if (item.readingTimeMinutes && item.readingTimeMinutes > 0) coverageScore += 10;
      if (item.tagIds && item.tagIds.length >= 2) coverageScore += 15;
      coverageScore = Math.min(100, coverageScore);

      // 6. Overall Entity Authority Score
      const authorityScore = Math.min(
        100,
        Math.round(
          dependencyScore * 0.25 +
          relationshipScore * 0.25 +
          freshnessScore * 0.20 +
          citationReadiness * 0.15 +
          coverageScore * 0.15
        )
      );

      // 7. Cluster Memberships
      const clusterMemberships = clusters
        .filter(c =>
          c.entityIds.includes(item.id) ||
          c.primaryPillar.entityId === item.id ||
          c.primaryProductArea === item.productArea
        )
        .map(c => c.name);

      return {
        entityId: item.id,
        title: item.title,
        contentType: item.contentType,
        authorityScore,
        dependencyScore,
        coverageScore,
        freshnessScore,
        relationshipScore,
        citationReadiness,
        clusterMemberships: clusterMemberships.length > 0 ? clusterMemberships : ['General Platform']
      };
    });
  }
}

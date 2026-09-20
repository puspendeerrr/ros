/**
 * Master Topical Authority & Content Cluster Engine
 * Unified coordinator integrating knowledge graphs, gap analysis, authority scoring, and editorial planning.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import { MASTER_CONTENT_REGISTRY } from '../../content/registries/content.registry.ts';
import type {
  GeneratedAuthorityArtifacts,
  MasterTopicalAuthorityReport
} from '../types/authority.types.ts';
import { ENTERPRISE_CLUSTERS } from '../clusters/cluster.registry.ts';
import { KnowledgeGraphEngine } from '../graph/knowledge-graph.engine.ts';
import { ContentDiscoveryEngine } from '../discovery/content-discovery.engine.ts';
import { ContentGapEngine } from '../gaps/content-gap.engine.ts';
import { ContentOverlapDetector } from '../gaps/content-overlap.detector.ts';
import { ContentFreshnessEngine } from '../freshness/content-freshness.engine.ts';
import { ClusterAuthorityScorer } from '../scoring/cluster-authority.scorer.ts';
import { EntityAuthorityScorer } from '../scoring/entity-authority.scorer.ts';
import { EditorialPlanningEngine } from '../roadmap/editorial-planning.engine.ts';
import { KnowledgeCoverageEngine } from '../coverage/knowledge-coverage.engine.ts';
import { ClusterLinkOptimizer } from '../links/cluster-link.optimizer.ts';
import { AuthorityReportingEngine } from '../reports/authority-reporting.ts';

export class MasterTopicalAuthorityEngine {
  private items: BaseContentItem[];

  constructor(customItems?: BaseContentItem[]) {
    this.items = customItems || MASTER_CONTENT_REGISTRY;
  }

  /**
   * Executes the full Topical Authority & Content Cluster pipeline.
   */
  public runPipeline(outputDirs: string[] = ['public', 'dist']): {
    summary: MasterTopicalAuthorityReport;
    writtenFiles: string[];
    artifacts: GeneratedAuthorityArtifacts;
  } {
    const buildId = `auth-${Date.now()}`;
    const generatedAt = new Date().toISOString();

    // 1. Build Bidirectional Knowledge Graph
    const graphEngine = new KnowledgeGraphEngine(this.items);
    const entityGraph = graphEngine.toSerializableGraph();

    // 2. Discover Content Opportunities & Gaps
    const contentGaps = ContentGapEngine.analyzeGaps(this.items, ENTERPRISE_CLUSTERS);
    const contentOverlaps = ContentOverlapDetector.detectOverlaps(this.items, 40);
    ContentDiscoveryEngine.discoverOpportunities(this.items, ENTERPRISE_CLUSTERS);

    // 3. Analyze Content Freshness & Decay
    const contentFreshness = ContentFreshnessEngine.analyzeFreshness(this.items);

    // 4. Score Cluster & Entity Authority
    const clusterAuthorityScores = ClusterAuthorityScorer.scoreAllClusters(this.items, ENTERPRISE_CLUSTERS);
    const entityAuthorityScores = EntityAuthorityScorer.scoreAllEntities(this.items, graphEngine, ENTERPRISE_CLUSTERS);

    // 5. Generate Editorial Planning Backlog
    const editorialBacklog = EditorialPlanningEngine.generateBacklog(this.items, ENTERPRISE_CLUSTERS);

    // 6. Compute Multi-Dimensional Knowledge Coverage
    const knowledgeCoverage = KnowledgeCoverageEngine.calculateCoverage(this.items);

    // 7. Audit Inter-Cluster Links
    const clusterHealth = ClusterLinkOptimizer.auditClusterLinks(this.items, ENTERPRISE_CLUSTERS);

    // 8. Bundle Artifacts and Write Reports
    const artifacts: GeneratedAuthorityArtifacts = {
      authorityClusters: ENTERPRISE_CLUSTERS,
      contentGaps,
      contentOverlaps,
      editorialBacklog,
      knowledgeCoverage,
      contentFreshness,
      clusterAuthorityScores,
      entityAuthorityScores,
      entityGraph,
      clusterHealth
    };

    const writtenFiles = AuthorityReportingEngine.writeReports(artifacts, outputDirs);

    // 9. Compute Summary
    const avgAuthority = Math.round(
      clusterAuthorityScores.reduce((acc, c) => acc + c.overallAuthorityScore, 0) /
      Math.max(1, clusterAuthorityScores.length)
    );
    const avgOwnership = Math.round(
      clusterAuthorityScores.reduce((acc, c) => acc + c.topicOwnershipScore, 0) /
      Math.max(1, clusterAuthorityScores.length)
    );

    const summary: MasterTopicalAuthorityReport = {
      buildId,
      generatedAt,
      totalClusters: ENTERPRISE_CLUSTERS.length,
      totalEntities: this.items.length,
      averageClusterAuthority: avgAuthority,
      averageTopicOwnership: avgOwnership,
      dominantClustersCount: clusterAuthorityScores.filter(c => c.maturity === 'dominant').length,
      authorityClustersCount: clusterAuthorityScores.filter(c => c.maturity === 'authority').length,
      establishedClustersCount: clusterAuthorityScores.filter(c => c.maturity === 'established').length,
      growingClustersCount: clusterAuthorityScores.filter(c => c.maturity === 'growing').length,
      seedClustersCount: clusterAuthorityScores.filter(c => c.maturity === 'seed').length,
      criticalGapsCount: contentGaps.filter(g => g.urgency === 'critical').length,
      totalBacklogItems: editorialBacklog.length,
      warnings: []
    };

    return {
      summary,
      writtenFiles,
      artifacts
    };
  }
}

export const topicalAuthorityEngine = new MasterTopicalAuthorityEngine();

/**
 * Authority Reporting Suite
 * Writes all 8 JSON authority artifacts to public/ and dist/.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { GeneratedAuthorityArtifacts } from '../types/authority.types.ts';

export class AuthorityReportingEngine {
  /**
   * Serializes all 8 reports and outputs them to target directories.
   */
  public static writeReports(
    artifacts: GeneratedAuthorityArtifacts,
    outputDirs: string[] = ['public', 'dist']
  ): string[] {
    const writtenFiles: string[] = [];

    const reports: Record<string, unknown> = {
      'authority-clusters.json': {
        generatedAt: new Date().toISOString(),
        totalClusters: artifacts.authorityClusters.length,
        clusters: artifacts.authorityClusters
      },
      'content-gap-analysis.json': {
        generatedAt: new Date().toISOString(),
        totalGaps: artifacts.contentGaps.length,
        totalOverlaps: artifacts.contentOverlaps.length,
        gaps: artifacts.contentGaps,
        overlaps: artifacts.contentOverlaps
      },
      'editorial-backlog.json': {
        generatedAt: new Date().toISOString(),
        totalBacklogItems: artifacts.editorialBacklog.length,
        backlog: artifacts.editorialBacklog
      },
      'knowledge-coverage.json': artifacts.knowledgeCoverage,
      'content-freshness.json': {
        generatedAt: new Date().toISOString(),
        totalAudited: artifacts.contentFreshness.length,
        staleItemsCount: artifacts.contentFreshness.filter(f => f.refreshPriority === 'urgent').length,
        freshnessRecords: artifacts.contentFreshness
      },
      'authority-scoreboard.json': {
        generatedAt: new Date().toISOString(),
        averageClusterAuthority: Math.round(
          artifacts.clusterAuthorityScores.reduce((acc, c) => acc + c.overallAuthorityScore, 0) /
          Math.max(1, artifacts.clusterAuthorityScores.length)
        ),
        averageTopicOwnership: Math.round(
          artifacts.clusterAuthorityScores.reduce((acc, c) => acc + c.topicOwnershipScore, 0) /
          Math.max(1, artifacts.clusterAuthorityScores.length)
        ),
        clusterScores: artifacts.clusterAuthorityScores,
        entityScores: artifacts.entityAuthorityScores
      },
      'entity-relationships.json': {
        generatedAt: new Date().toISOString(),
        ...artifacts.entityGraph
      },
      'cluster-health.json': {
        generatedAt: new Date().toISOString(),
        totalClustersAudited: artifacts.clusterHealth.length,
        hubClusters: artifacts.clusterHealth.filter(c => c.isHub).map(c => c.clusterId),
        isolatedClusters: artifacts.clusterHealth.filter(c => c.isOrphan).map(c => c.clusterId),
        clusterHealthDetails: artifacts.clusterHealth
      }
    };

    for (const dir of outputDirs) {
      const targetDir = path.resolve(process.cwd(), dir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      for (const [filename, content] of Object.entries(reports)) {
        const filePath = path.join(targetDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
        if (!writtenFiles.includes(filePath)) {
          writtenFiles.push(filePath);
        }
      }
    }

    return writtenFiles;
  }
}

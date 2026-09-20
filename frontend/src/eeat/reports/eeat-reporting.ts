/**
 * EEAT Reporting Engine
 * Serializes and outputs all 8 Trust, Entity, and EEAT JSON artifacts into public/ and dist/.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { GeneratedEeatArtifacts } from '../types/eeat.types.ts';

export class EeatReportingEngine {
  /**
   * Serializes all 8 reports and outputs them to target directories.
   */
  public static writeReports(
    artifacts: GeneratedEeatArtifacts,
    outputDirs: string[] = ['public', 'dist']
  ): string[] {
    const writtenFiles: string[] = [];

    const reports: Record<string, unknown> = {
      'entity-authority.json': {
        generatedAt: new Date().toISOString(),
        totalEntities: artifacts.entityAuthority.length,
        entities: artifacts.entityAuthority
      },
      'author-profiles.json': {
        generatedAt: new Date().toISOString(),
        totalAuthors: artifacts.authorProfiles.length,
        authors: artifacts.authorProfiles
      },
      'review-status.json': {
        generatedAt: new Date().toISOString(),
        totalReviews: artifacts.reviewStatus.length,
        approvedPercent: Math.round(
          (artifacts.reviewStatus.filter(r => r.approvalStatus === 'approved').length /
            Math.max(1, artifacts.reviewStatus.length)) * 100
        ),
        reviews: artifacts.reviewStatus
      },
      'editorial-governance.json': {
        generatedAt: new Date().toISOString(),
        totalPolicies: artifacts.editorialGovernance.length,
        policies: artifacts.editorialGovernance
      },
      'trust-signals.json': {
        generatedAt: new Date().toISOString(),
        averageTrustScore: Math.round(
          artifacts.trustSignals.reduce((acc, s) => acc + s.overallTrustScore, 0) /
            Math.max(1, artifacts.trustSignals.length)
        ),
        signals: artifacts.trustSignals
      },
      'knowledge-panel-readiness.json': {
        generatedAt: new Date().toISOString(),
        totalEntitiesAudited: artifacts.knowledgePanelReadiness.length,
        averageReadinessScore: Math.round(
          artifacts.knowledgePanelReadiness.reduce((acc, k) => acc + k.readinessScore, 0) /
            Math.max(1, artifacts.knowledgePanelReadiness.length)
        ),
        readinessScores: artifacts.knowledgePanelReadiness
      },
      'citation-readiness.json': {
        generatedAt: new Date().toISOString(),
        averageCitationScore: Math.round(
          artifacts.citationReadiness.reduce((acc, c) => acc + c.citationReadinessScore, 0) /
            Math.max(1, artifacts.citationReadiness.length)
        ),
        optimizedForAiOverviewCount: artifacts.citationReadiness.filter(c => c.isAiOverviewOptimized).length,
        citations: artifacts.citationReadiness
      },
      'reference-map.json': {
        generatedAt: new Date().toISOString(),
        totalMappedPages: artifacts.referenceMap.length,
        totalTrackedReferences: artifacts.referenceMap.reduce((acc, r) => acc + r.totalReferences, 0),
        referenceMap: artifacts.referenceMap
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

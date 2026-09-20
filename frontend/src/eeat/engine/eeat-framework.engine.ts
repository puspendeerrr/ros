/**
 * Master Enterprise EEAT & Entity Authority Framework Engine
 * Unified orchestrator coordinating entity identities, trust signals, editorial policies, and AI citations.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import { MASTER_CONTENT_REGISTRY } from '../../content/registries/content.registry.ts';
import type { GeneratedEeatArtifacts, MasterEeatReport } from '../types/eeat.types.ts';
import { CANONICAL_ENTITIES_REGISTRY } from '../entities/canonical-entity.registry.ts';
import { ENTERPRISE_AUTHORS_REGISTRY } from '../authors/author-profile.registry.ts';
import { EDITORIAL_GOVERNANCE_POLICIES } from '../governance/editorial-policies.ts';
import { TrustSignalEngine } from '../trust/trust-signal.engine.ts';
import { ReviewStatusTracker } from '../trust/review-status.tracker.ts';
import { SourceAttributionEngine } from '../references/source-attribution.engine.ts';
import { KnowledgePanelEngine } from '../knowledge-panel/knowledge-panel.engine.ts';
import { AiCitationEngine } from '../citations/ai-citation.engine.ts';
import { EeatAuthorityScorer } from '../scoring/eeat-authority.scorer.ts';
import { EeatReportingEngine } from '../reports/eeat-reporting.ts';

export class MasterEeatFrameworkEngine {
  private items: BaseContentItem[];

  constructor(customItems?: BaseContentItem[]) {
    this.items = customItems || MASTER_CONTENT_REGISTRY;
  }

  /**
   * Executes the full EEAT, Trust Signal, and Entity Authority auditing pipeline.
   */
  public runPipeline(outputDirs: string[] = ['public', 'dist']): {
    summary: MasterEeatReport;
    writtenFiles: string[];
    artifacts: GeneratedEeatArtifacts;
  } {
    const buildId = `eeat-${Date.now()}`;
    const generatedAt = new Date().toISOString();

    // 1. Entities & Authors
    const entityAuthority = CANONICAL_ENTITIES_REGISTRY;
    const authorProfiles = Object.values(ENTERPRISE_AUTHORS_REGISTRY);

    // 2. Editorial Governance
    const editorialGovernance = EDITORIAL_GOVERNANCE_POLICIES;

    // 3. Trust Signals & Review Logs
    const trustSignals = TrustSignalEngine.computeAllSignals(this.items);
    const reviewStatus = ReviewStatusTracker.generateReviewRecords(this.items);

    // 4. Source Attribution & Reference Map
    const referenceMap = SourceAttributionEngine.buildReferenceMap(this.items);

    // 5. Knowledge Panel Readiness
    const knowledgePanelReadiness = KnowledgePanelEngine.evaluateAllEntities(CANONICAL_ENTITIES_REGISTRY);

    // 6. AI Citation Readiness
    const citationReadiness = AiCitationEngine.evaluateAll(this.items);

    // 7. EEAT Authority Scoring
    const eeatScores = EeatAuthorityScorer.scoreAll(this.items);

    // 8. Bundle Artifacts
    const artifacts: GeneratedEeatArtifacts = {
      entityAuthority,
      authorProfiles,
      reviewStatus,
      editorialGovernance,
      trustSignals,
      knowledgePanelReadiness,
      citationReadiness,
      referenceMap
    };

    // 9. Write JSON Reports
    const writtenFiles = EeatReportingEngine.writeReports(artifacts, outputDirs);

    // 10. Summary Metrics
    const avgTrust = Math.round(
      trustSignals.reduce((acc, s) => acc + s.overallTrustScore, 0) / Math.max(1, trustSignals.length)
    );
    const avgCitation = Math.round(
      citationReadiness.reduce((acc, c) => acc + c.citationReadinessScore, 0) / Math.max(1, citationReadiness.length)
    );
    const avgEeat = Math.round(
      eeatScores.reduce((acc, e) => acc + e.compositeEeatScore, 0) / Math.max(1, eeatScores.length)
    );
    const peerReviewedCount = reviewStatus.filter(r => r.reviewerRole !== 'author').length;
    const peerReviewedPercent = Math.round((peerReviewedCount / Math.max(1, reviewStatus.length)) * 100);

    const summary: MasterEeatReport = {
      buildId,
      generatedAt,
      totalEntitiesAudited: entityAuthority.length,
      totalAuthorsAudited: authorProfiles.length,
      averageEeatScore: avgEeat,
      averageTrustScore: avgTrust,
      averageCitationScore: avgCitation,
      peerReviewedPercent,
      knowledgePanelReadyCount: knowledgePanelReadiness.filter(k => k.readinessScore >= 80).length,
      warnings: []
    };

    return {
      summary,
      writtenFiles,
      artifacts
    };
  }
}

export const eeatFrameworkEngine = new MasterEeatFrameworkEngine();

/**
 * Alert Engine
 * Evaluates performance thresholds and triggers structured alerts with root-cause investigations.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type {
  AlertsReport,
  AiSearchMonitorMetrics,
  KnowledgeGraphHealthData,
  RootCauseAnalysisReport,
  RootCauseInvestigation,
  SearchAlertItem,
  SearchPerformanceMetrics
} from '../types/intelligence.types.ts';
import { RootCauseEngine } from './root-cause.engine.ts';

export class AlertEngine {
  /**
   * Evaluates all platform telemetry and generates structured search alerts.
   */
  public static evaluateAlerts(
    _items: BaseContentItem[],
    perf: SearchPerformanceMetrics,
    aiMonitor: AiSearchMonitorMetrics,
    kgHealth: KnowledgeGraphHealthData
  ): { alertsReport: AlertsReport; rootCauseReport: RootCauseAnalysisReport } {
    const alerts: SearchAlertItem[] = [];
    const investigations: RootCauseInvestigation[] = [];

    // 1. Audit Lost AI Citations
    aiMonitor.monitoredPages.forEach(p => {
      if (p.citationLosses > 1) {
        const alertId = `alt-cit-${p.contentId}`;
        const symptom = `Detected ${p.citationLosses} citation losses in frontier AI search engines.`;
        const rootCause = RootCauseEngine.diagnose(alertId, 'lost_ai_citation', symptom, p.url);

        alerts.push({
          id: alertId,
          severity: 'warning',
          category: 'lost_ai_citation',
          title: `Lost AI Citations on "${p.title}"`,
          description: symptom,
          affectedUrl: p.url,
          detectedAt: new Date().toISOString(),
          rootCause
        });
        investigations.push(rootCause);
      }
    });

    // 2. Audit Broken Relationships in Knowledge Graph
    if (kgHealth.brokenRelationships.length > 0) {
      kgHealth.brokenRelationships.forEach((br, idx) => {
        const alertId = `alt-kg-${idx}`;
        const symptom = `Broken entity relation from "${br.sourceId}" targeting nonexistent "${br.targetId}".`;
        const url = `https://restaurantos.com/features/${br.sourceId}`;
        const rootCause = RootCauseEngine.diagnose(alertId, 'broken_link', symptom, url);

        alerts.push({
          id: alertId,
          severity: 'critical',
          category: 'broken_link',
          title: `Broken Entity Relation: ${br.sourceId} -> ${br.targetId}`,
          description: symptom,
          affectedUrl: url,
          detectedAt: new Date().toISOString(),
          rootCause
        });
        investigations.push(rootCause);
      });
    }

    // 3. Audit Indexing Exclusions
    const unindexedPages = perf.pages.filter(p => !p.indexed);
    unindexedPages.forEach(p => {
      const alertId = `alt-idx-${p.contentId}`;
      const symptom = `Page "${p.title}" is marked unindexed or excluded by search crawlers.`;
      const rootCause = RootCauseEngine.diagnose(alertId, 'indexing_issue', symptom, p.url);

      alerts.push({
        id: alertId,
        severity: 'critical',
        category: 'indexing_issue',
        title: `Indexation Alert: "${p.title}"`,
        description: symptom,
        affectedUrl: p.url,
        detectedAt: new Date().toISOString(),
        rootCause
      });
      investigations.push(rootCause);
    });

    // 4. Audit Search Performance & Ranking Drops
    perf.pages.forEach(p => {
      if (p.averagePosition > 6.0) {
        const alertId = `alt-rank-${p.contentId}`;
        const symptom = `Average search position has slipped to ${p.averagePosition}.`;
        const rootCause = RootCauseEngine.diagnose(alertId, 'ranking_drop', symptom, p.url);

        alerts.push({
          id: alertId,
          severity: 'warning',
          category: 'ranking_drop',
          title: `Ranking Volatility on "${p.title}"`,
          description: symptom,
          affectedUrl: p.url,
          detectedAt: new Date().toISOString(),
          rootCause
        });
        investigations.push(rootCause);
      }
    });

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;
    const infoCount = alerts.filter(a => a.severity === 'info').length;

    return {
      alertsReport: {
        generatedAt: new Date().toISOString(),
        criticalCount,
        warningCount,
        infoCount,
        alerts
      },
      rootCauseReport: {
        generatedAt: new Date().toISOString(),
        totalInvestigations: investigations.length,
        investigations
      }
    };
  }
}

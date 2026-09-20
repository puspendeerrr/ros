/**
 * Search Intelligence Reporting Engine
 * Serializes all 13 enterprise JSON reports into public/ and dist/ directories.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { GeneratedIntelligenceArtifacts } from '../types/intelligence.types.ts';

export class SearchIntelligenceReportingEngine {
  /**
   * Writes all intelligence artifacts to the targeted output directories.
   */
  public static writeReports(
    artifacts: GeneratedIntelligenceArtifacts,
    outputDirs: string[] = ['public', 'dist']
  ): string[] {
    const writtenFiles: string[] = [];

    const reports: Record<string, unknown> = {
      'search-performance.json': artifacts.searchPerformance,
      'ai-search-monitor.json': artifacts.aiSearchMonitor,
      'retrieval-analytics.json': artifacts.retrievalAnalytics,
      'content-performance.json': artifacts.contentPerformance,
      'knowledge-health.json': artifacts.knowledgeHealth,
      'optimization-recommendations.json': artifacts.optimizationRecommendations,
      'alerts.json': artifacts.alerts,
      'search-intelligence-report.json': artifacts.searchIntelligenceReport,
      // Refinement Enhancements
      'trend-analysis.json': artifacts.trendAnalysis,
      'recommendation-priority.json': artifacts.recommendationPriority,
      'recommendation-lifecycle.json': artifacts.recommendationLifecycle,
      'historical-snapshots.json': artifacts.historicalSnapshots,
      'root-cause-analysis.json': artifacts.rootCauseAnalysis
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

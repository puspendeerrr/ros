/**
 * AI Search Reporting Engine
 * Serializes and outputs all 8 AI Search, AEO, and Retrieval JSON artifacts to public/ and dist/.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { GeneratedAiSearchArtifacts } from '../types/ai-search.types.ts';

export class AiSearchReportingEngine {
  /**
   * Serializes all 8 reports and outputs them to target directories.
   */
  public static writeReports(
    artifacts: GeneratedAiSearchArtifacts,
    outputDirs: string[] = ['public', 'dist']
  ): string[] {
    const writtenFiles: string[] = [];

    const reports: Record<string, unknown> = {
      'ai-overview-readiness.json': {
        generatedAt: new Date().toISOString(),
        totalAudited: artifacts.aiOverviewReadiness.length,
        candidateCount: artifacts.aiOverviewReadiness.filter(o => o.isAiOverviewCandidate).length,
        opportunities: artifacts.aiOverviewReadiness
      },
      'retrieval-readiness.json': {
        generatedAt: new Date().toISOString(),
        averageRetrievalReadiness: Math.round(
          artifacts.retrievalReadiness.reduce((acc, r) => acc + r.retrievalReadinessScore, 0) /
            Math.max(1, artifacts.retrievalReadiness.length)
        ),
        metrics: artifacts.retrievalReadiness
      },
      'answer-blocks.json': {
        generatedAt: new Date().toISOString(),
        totalBlockSets: artifacts.answerBlocks.length,
        answerBlocks: artifacts.answerBlocks
      },
      'conversation-coverage.json': {
        generatedAt: new Date().toISOString(),
        totalQueries: artifacts.conversationCoverage.length,
        intents: artifacts.conversationCoverage
      },
      'llm-compatibility.json': {
        generatedAt: new Date().toISOString(),
        totalScored: artifacts.llmCompatibility.length,
        compatibilityScores: artifacts.llmCompatibility
      },
      'snippet-opportunities.json': {
        generatedAt: new Date().toISOString(),
        totalFeaturedSnippetCandidates: artifacts.snippetOpportunities.filter(s => s.isFeaturedSnippetCandidate).length,
        opportunities: artifacts.snippetOpportunities
      },
      'retrieval-graph.json': {
        generatedAt: new Date().toISOString(),
        ...artifacts.retrievalGraph
      },
      'ai-search-report.json': artifacts.aiSearchReport
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

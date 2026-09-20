/**
 * Master AI Search Optimization Engine
 * Unified coordinator integrating answer extraction, retrieval analysis, snippet eligibility, and LLM compatibility.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import { MASTER_CONTENT_REGISTRY } from '../../content/registries/content.registry.ts';
import type {
  GeneratedAiSearchArtifacts,
  MasterAiSearchReport
} from '../types/ai-search.types.ts';
import { AnswerExtractorEngine } from '../answers/answer-extractor.engine.ts';
import { LlmRetrievalEngine } from '../retrieval/llm-retrieval.engine.ts';
import { AiOverviewEngine } from '../overview/ai-overview.engine.ts';
import { ConversationalQueryEngine } from '../conversation/conversational-query.engine.ts';
import { AnswerBlockEngine } from '../blocks/answer-block.engine.ts';
import { RetrievalGraphEngine } from '../graph/retrieval-graph.engine.ts';
import { MultiLlmCompatibilityEngine } from '../compatibility/multi-llm.engine.ts';
import { AiSearchReportingEngine } from '../reports/ai-search-reporting.ts';

export class MasterAiSearchEngine {
  private items: BaseContentItem[];

  constructor(customItems?: BaseContentItem[]) {
    this.items = customItems || MASTER_CONTENT_REGISTRY;
  }

  /**
   * Executes the full AI Search, AEO, and LLM Retrieval pipeline.
   */
  public runPipeline(outputDirs: string[] = ['public', 'dist']): {
    summary: MasterAiSearchReport;
    writtenFiles: string[];
    artifacts: GeneratedAiSearchArtifacts;
  } {
    const buildId = `aeo-${Date.now()}`;
    const generatedAt = new Date().toISOString();

    // 1. Answer Objects & Conversational Queries
    const answers = AnswerExtractorEngine.extractAllAnswers(this.items);
    const conversationCoverage = ConversationalQueryEngine.generateIntents(this.items);

    // 2. Retrieval Readiness & Density
    const retrievalReadiness = LlmRetrievalEngine.evaluateAll(this.items);

    // 3. AI Overview & Snippet Opportunities
    const aiOverviewReadiness = AiOverviewEngine.evaluateAll(this.items);

    // 4. Answer Block Sets
    const answerBlocks = AnswerBlockEngine.generateAllBlocks(this.items);

    // 5. Retrieval Graph
    const retrievalGraph = RetrievalGraphEngine.buildGraph(this.items);

    // 6. Multi-LLM Compatibility
    const llmCompatibility = MultiLlmCompatibilityEngine.evaluateAll(this.items);

    // 7. Compute Summary Metrics
    const avgRetrieval = Math.round(
      retrievalReadiness.reduce((acc, r) => acc + r.retrievalReadinessScore, 0) /
        Math.max(1, retrievalReadiness.length)
    );
    const avgOverview = Math.round(
      aiOverviewReadiness.reduce((acc, o) => acc + o.aiOverviewScore, 0) /
        Math.max(1, aiOverviewReadiness.length)
    );

    const googleAvg = Math.round(
      llmCompatibility.reduce((acc, l) => acc + l.googleAiOverview, 0) / Math.max(1, llmCompatibility.length)
    );
    const chatgptAvg = Math.round(
      llmCompatibility.reduce((acc, l) => acc + l.chatGptSearch, 0) / Math.max(1, llmCompatibility.length)
    );
    const geminiAvg = Math.round(
      llmCompatibility.reduce((acc, l) => acc + l.gemini, 0) / Math.max(1, llmCompatibility.length)
    );
    const perplexityAvg = Math.round(
      llmCompatibility.reduce((acc, l) => acc + l.perplexity, 0) / Math.max(1, llmCompatibility.length)
    );
    const bingAvg = Math.round(
      llmCompatibility.reduce((acc, l) => acc + l.bingCopilot, 0) / Math.max(1, llmCompatibility.length)
    );

    const topAiOverviewCandidates = aiOverviewReadiness
      .filter(o => o.isAiOverviewCandidate)
      .map(o => o.title);

    const topFeaturedSnippetCandidates = aiOverviewReadiness
      .filter(o => o.isFeaturedSnippetCandidate)
      .map(o => o.title);

    const aiSearchReport: MasterAiSearchReport = {
      buildId,
      generatedAt,
      totalAnswerObjects: answers.length,
      totalConversationalQueries: conversationCoverage.length,
      averageRetrievalReadiness: avgRetrieval,
      averageAiOverviewScore: avgOverview,
      topAiOverviewCandidates,
      topFeaturedSnippetCandidates,
      llmCompatibilityAverages: {
        google: googleAvg,
        chatgpt: chatgptAvg,
        gemini: geminiAvg,
        perplexity: perplexityAvg,
        bing: bingAvg
      },
      warnings: []
    };

    const artifacts: GeneratedAiSearchArtifacts = {
      aiOverviewReadiness,
      retrievalReadiness,
      answerBlocks,
      conversationCoverage,
      llmCompatibility,
      snippetOpportunities: aiOverviewReadiness,
      retrievalGraph,
      aiSearchReport
    };

    // 8. Output Reports
    const writtenFiles = AiSearchReportingEngine.writeReports(artifacts, outputDirs);

    return {
      summary: aiSearchReport,
      writtenFiles,
      artifacts
    };
  }
}

export const masterAiSearchEngine = new MasterAiSearchEngine();

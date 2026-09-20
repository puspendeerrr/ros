/**
 * Type Definitions for Enterprise AI Search Optimization (AEO, GEO & LLM Retrieval Platform) (Phase 6A)
 */

import type { ContentType } from '../../content/models/base.model.ts';

// --------------------------------------------------------------------------
// 1. Structured Answer Types
// --------------------------------------------------------------------------

export type AnswerType =
  | 'definition'
  | 'how_to'
  | 'faq'
  | 'step_by_step'
  | 'comparison'
  | 'feature_summary'
  | 'industry_summary'
  | 'problem_solution';

export interface StructuredAnswerObject {
  id: string;
  contentId: string;
  type: AnswerType;
  question: string;
  shortAnswer: string;           // Direct snippet (< 50 words)
  detailedAnswer: string;        // Complete authoritative synthesis
  steps?: string[];              // Step-by-step procedural breakdown
  keyTakeaways: string[];
  entitiesMentioned: string[];
  confidenceScore: number;       // 0 - 100
  sourceReference: {
    title: string;
    url: string;
  };
}

// --------------------------------------------------------------------------
// 2. Conversational Query Intents
// --------------------------------------------------------------------------

export type QueryCategory =
  | 'what'
  | 'why'
  | 'how'
  | 'best_practices'
  | 'troubleshooting'
  | 'comparison'
  | 'pricing'
  | 'implementation';

export interface ConversationalQueryIntent {
  intentId: string;
  category: QueryCategory;
  userQuery: string;
  matchedAnswerId: string;
  targetContentId: string;
  confidenceScore: number;       // 0 - 100
  primaryEntityId: string;
}

// --------------------------------------------------------------------------
// 3. LLM Retrieval & Context Density Metrics
// --------------------------------------------------------------------------

export interface RetrievalMetrics {
  contentId: string;
  title: string;
  contentType: ContentType;
  retrievalCompleteness: number; // 0 - 100
  answerCoverage: number;        // 0 - 100
  definitionCoverage: number;    // 0 - 100
  contextDensity: number;        // 0 - 100 (ratio of factual tokens)
  entityDensity: number;         // 0 - 100 (disambiguated entity anchors)
  referenceDensity: number;      // 0 - 100 (verifiable source backing)
  retrievalConfidence: number;   // 0 - 100
  retrievalReadinessScore: number;// 0 - 100
}

// --------------------------------------------------------------------------
// 4. AI Overview & Featured Snippet Opportunities
// --------------------------------------------------------------------------

export type SnippetType = 'paragraph' | 'list' | 'table';

export interface AiOverviewOpportunity {
  contentId: string;
  title: string;
  aiOverviewScore: number;       // 0 - 100
  snippetScore: number;          // 0 - 100
  answerScore: number;           // 0 - 100
  isAiOverviewCandidate: boolean;
  isFeaturedSnippetCandidate: boolean;
  targetSnippetType: SnippetType;
  primaryQuery: string;
  extractedSnippetText: string;
}

// --------------------------------------------------------------------------
// 5. Answer Blocks (Reusable Components)
// --------------------------------------------------------------------------

export interface AnswerBlockSet {
  contentId: string;
  title: string;
  definitionBlock?: {
    term: string;
    definition: string;
    wordCount: number;
  };
  summaryBlock: {
    tldr: string;
    targetAudience: string;
  };
  keyTakeaways: string[];
  quickFacts: Array<{ label: string; value: string }>;
  checklist?: string[];
  decisionMatrix?: Array<{ criteria: string; restaurantOs: string; alternative: string }>;
  advantages: string[];
  disadvantages?: string[];
  prerequisites?: string[];
}

// --------------------------------------------------------------------------
// 6. Retrieval Graph
// --------------------------------------------------------------------------

export interface RetrievalGraphNode {
  id: string;
  label: string;
  nodeType: 'Entity' | 'Question' | 'Answer' | 'Definition' | 'Reference';
  contentId?: string;
  metadata?: Record<string, unknown>;
}

export interface RetrievalGraphEdge {
  fromId: string;
  toId: string;
  relationship:
    | 'answers_question'
    | 'defines_entity'
    | 'has_answer_block'
    | 'supported_by_reference'
    | 'subtopic_of';
  weight: number;
}

export interface RetrievalGraphSummary {
  nodesCount: number;
  edgesCount: number;
  nodes: RetrievalGraphNode[];
  edges: RetrievalGraphEdge[];
}

// --------------------------------------------------------------------------
// 7. Multi-LLM Compatibility
// --------------------------------------------------------------------------

export interface LlmCompatibilityScore {
  contentId: string;
  title: string;
  googleAiOverview: number;      // 0 - 100 (Concise, HowTo/FAQ Schema, Author transparency)
  chatGptSearch: number;         // 0 - 100 (Balanced prose, Heading hierarchy, Product evidence)
  gemini: number;                // 0 - 100 (Structured lists, Google Knowledge Graph sameAs)
  perplexity: number;            // 0 - 100 (Dense source citations, numerical benchmark tables)
  bingCopilot: number;           // 0 - 100 (Tabular comparisons, enterprise specs, RFCs)
  compositeLlmReadiness: number; // 0 - 100
  primaryModelAffinity: 'Google' | 'ChatGPT' | 'Perplexity' | 'Gemini' | 'Bing';
}

// --------------------------------------------------------------------------
// 8. Master AI Search Framework Report
// --------------------------------------------------------------------------

export interface MasterAiSearchReport {
  buildId: string;
  generatedAt: string;
  totalAnswerObjects: number;
  totalConversationalQueries: number;
  averageRetrievalReadiness: number;
  averageAiOverviewScore: number;
  topAiOverviewCandidates: string[];
  topFeaturedSnippetCandidates: string[];
  llmCompatibilityAverages: {
    google: number;
    chatgpt: number;
    gemini: number;
    perplexity: number;
    bing: number;
  };
  warnings: string[];
}

export interface GeneratedAiSearchArtifacts {
  aiOverviewReadiness: AiOverviewOpportunity[];
  retrievalReadiness: RetrievalMetrics[];
  answerBlocks: AnswerBlockSet[];
  conversationCoverage: ConversationalQueryIntent[];
  llmCompatibility: LlmCompatibilityScore[];
  snippetOpportunities: AiOverviewOpportunity[];
  retrievalGraph: RetrievalGraphSummary;
  aiSearchReport: MasterAiSearchReport;
}

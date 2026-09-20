/**
 * Enterprise Search Intelligence, Monitoring & Continuous Optimization Platform Types (Phase 6B)
 */

// --------------------------------------------------------------------------
// 1. Search Performance Types
// --------------------------------------------------------------------------

export interface CoreWebVitalsMetric {
  lcpMs: number;
  fidMs: number;
  cls: number;
  inpMs: number;
  fcpMs: number;
  ttfbMs: number;
  rating: 'good' | 'needs_improvement' | 'poor';
}

export interface PageSearchPerformance {
  contentId: string;
  url: string;
  title: string;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  indexed: boolean;
  crawlErrors: string[];
  coreWebVitals: CoreWebVitalsMetric;
}

export interface SearchPerformanceMetrics {
  generatedAt: string;
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
  averagePosition: number;
  totalIndexedPages: number;
  totalCrawlErrors: number;
  pages: PageSearchPerformance[];
}

// --------------------------------------------------------------------------
// 2. AI Search Monitor Types
// --------------------------------------------------------------------------

export interface AiEnginePresence {
  googleAiOverview: boolean;
  chatGptSearch: boolean;
  gemini: boolean;
  perplexity: boolean;
  bingCopilot: boolean;
}

export interface PageAiSearchMonitor {
  contentId: string;
  title: string;
  url: string;
  presence: AiEnginePresence;
  shareOfVoice: number; // 0-100
  citationWins: number;
  citationLosses: number;
  displacedCompetitors: string[];
  vulnerableToDisplacement: boolean;
}

export interface AiSearchMonitorMetrics {
  generatedAt: string;
  averageShareOfVoice: number;
  totalCitationWins: number;
  totalCitationLosses: number;
  netCitationGrowth: number;
  monitoredPages: PageAiSearchMonitor[];
}

// --------------------------------------------------------------------------
// 3. Retrieval Analytics Types
// --------------------------------------------------------------------------

export interface MissingAnswerEntry {
  query: string;
  category: string;
  confidenceScore: number;
  deficitReason: string;
}

export interface ChunkPerformanceMetric {
  chunkId: string;
  contentId: string;
  hitCount: number;
  averageLatencyMs: number;
  precisionScore: number; // 0-100
}

export interface RetrievalAnalyticsData {
  generatedAt: string;
  retrievalSuccessRate: number; // 0-100
  retrievalFailureCount: number;
  weakEvidenceCount: number;
  hallucinationRisk: 'low' | 'medium' | 'high';
  hallucinationRiskScore: number; // 0-100
  missingAnswers: MissingAnswerEntry[];
  chunkPerformance: ChunkPerformanceMetric[];
}

// --------------------------------------------------------------------------
// 4. Content Performance & Decay Types
// --------------------------------------------------------------------------

export interface BounceSignals {
  bounceRate: number;
  exitRate: number;
  dwellTimeSeconds: number;
}

export interface PageContentPerformance {
  contentId: string;
  title: string;
  pageViews: number;
  uniqueVisitors: number;
  engagementScore: number; // 0-100
  bounceSignals: BounceSignals;
  contentDecayScore: number; // 0-100 (higher = more decayed)
  freshnessDays: number;
  authorityGrowthRate: number; // percentage growth
  performanceStatus: 'surging' | 'stable' | 'decaying' | 'critical';
}

export interface ContentPerformanceData {
  generatedAt: string;
  averageEngagementScore: number;
  averageDecayScore: number;
  decayingPagesCount: number;
  pages: PageContentPerformance[];
}

// --------------------------------------------------------------------------
// 5. Knowledge Graph Health Types
// --------------------------------------------------------------------------

export interface BrokenRelationship {
  sourceId: string;
  targetId: string;
  relationship: string;
  issue: 'missing_target' | 'orphaned_reference' | 'circular_loop';
}

export interface DuplicateEntityDetection {
  normalizedKey: string;
  entityIds: string[];
  canonicalId: string;
}

export interface KnowledgeGraphHealthData {
  generatedAt: string;
  overallHealthScore: number; // 0-100
  totalEntities: number;
  totalRelationships: number;
  densityScore: number; // 0-100
  brokenRelationships: BrokenRelationship[];
  orphanEntities: string[];
  duplicateEntities: DuplicateEntityDetection[];
  missingReferences: Array<{ entityId: string; requiredDocType: string }>;
  weakConnectivityNodes: string[];
}

// --------------------------------------------------------------------------
// 6. Baseline & Trend Types
// --------------------------------------------------------------------------

export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface MetricTrend {
  metricName: string;
  currentValue: number;
  sevenDaysAgo: number;
  thirtyDaysAgo: number;
  ninetyDaysAgo: number;
  trend: TrendDirection;
  percentageChange30d: number;
}

export interface TrendAnalysisReport {
  generatedAt: string;
  overallTrajectory: TrendDirection;
  metrics: MetricTrend[];
}

// --------------------------------------------------------------------------
// 7. Recommendation Engine Types (with Lifecycle, Impact & Priority)
// --------------------------------------------------------------------------

export type RecommendationType =
  | 'content_refresh'
  | 'schema_improvement'
  | 'internal_links'
  | 'faq_expansion'
  | 'definition_improvement'
  | 'entity_relationship';

export type RecommendationStatus =
  | 'open'
  | 'accepted'
  | 'implemented'
  | 'verified'
  | 'closed';

export type PriorityClassification =
  | 'quick_win' // High Impact, Low Effort
  | 'strategic' // High Impact, High Effort
  | 'low_hanging_fruit' // Medium Impact, Low Effort
  | 'deprioritized'; // Low Impact, High Effort

export interface RecommendationImpactScore {
  expectedSeoImpact: 'high' | 'medium' | 'low';
  expectedAiImpact: 'high' | 'medium' | 'low';
  implementationEffort: 'low' | 'medium' | 'high';
  confidenceScore: number; // 0-100%
  priorityClassification: PriorityClassification;
}

export interface UnifiedOptimizationRecommendation {
  id: string;
  type: RecommendationType;
  sources: Array<'content_engine' | 'ai_engine' | 'schema_engine' | 'search_engine'>;
  targetContentId: string;
  targetUrl: string;
  title: string;
  issue: string;
  recommendedAction: string;
  status: RecommendationStatus;
  impact: RecommendationImpactScore;
  createdAt: string;
  updatedAt: string;
}

export interface OptimizationRecommendationsReport {
  generatedAt: string;
  totalRecommendations: number;
  quickWinsCount: number;
  strategicCount: number;
  recommendations: UnifiedOptimizationRecommendation[];
}

export interface RecommendationPriorityReport {
  generatedAt: string;
  quickWins: UnifiedOptimizationRecommendation[];
  strategic: UnifiedOptimizationRecommendation[];
  lowHangingFruit: UnifiedOptimizationRecommendation[];
  deprioritized: UnifiedOptimizationRecommendation[];
}

export interface RecommendationLifecycleReport {
  generatedAt: string;
  statusSummary: Record<RecommendationStatus, number>;
  activeWorkflows: UnifiedOptimizationRecommendation[];
}

// --------------------------------------------------------------------------
// 8. Root Cause Analysis & Alerts Types
// --------------------------------------------------------------------------

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertCategory =
  | 'traffic_drop'
  | 'ranking_drop'
  | 'lost_ai_citation'
  | 'broken_schema'
  | 'indexing_issue'
  | 'broken_link';

export interface RootCauseInvestigation {
  alertId: string;
  symptom: string;
  primaryCause: string;
  contributingFactors: string[];
  provenanceChain: string[];
  remediationPath: string;
}

export interface SearchAlertItem {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  affectedUrl: string;
  detectedAt: string;
  rootCause: RootCauseInvestigation;
}

export interface AlertsReport {
  generatedAt: string;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  alerts: SearchAlertItem[];
}

export interface RootCauseAnalysisReport {
  generatedAt: string;
  totalInvestigations: number;
  investigations: RootCauseInvestigation[];
}

// --------------------------------------------------------------------------
// 9. Historical Snapshots & Master Report Types
// --------------------------------------------------------------------------

export interface HistoricalSnapshot {
  snapshotId: string;
  date: string; // YYYY-MM-DD
  overallHealthScore: number;
  impressions: number;
  clicks: number;
  activeAlerts: number;
  openRecommendations: number;
}

export interface HistoricalSnapshotsReport {
  generatedAt: string;
  snapshots: HistoricalSnapshot[];
}

export interface MasterSearchIntelligenceReport {
  buildId: string;
  generatedAt: string;
  overallHealthScore: number; // 0-100
  organicSearchHealth: number; // 0-100
  aiSearchHealth: number; // 0-100
  retrievalHealth: number; // 0-100
  contentQualityHealth: number; // 0-100
  knowledgeGraphHealth: number; // 0-100
  totalActiveAlerts: number;
  criticalAlertsCount: number;
  totalRecommendations: number;
  quickWinOpportunities: number;
  trajectory: TrendDirection;
}

export interface GeneratedIntelligenceArtifacts {
  searchPerformance: SearchPerformanceMetrics;
  aiSearchMonitor: AiSearchMonitorMetrics;
  retrievalAnalytics: RetrievalAnalyticsData;
  contentPerformance: ContentPerformanceData;
  knowledgeHealth: KnowledgeGraphHealthData;
  trendAnalysis: TrendAnalysisReport;
  optimizationRecommendations: OptimizationRecommendationsReport;
  recommendationPriority: RecommendationPriorityReport;
  recommendationLifecycle: RecommendationLifecycleReport;
  alerts: AlertsReport;
  rootCauseAnalysis: RootCauseAnalysisReport;
  historicalSnapshots: HistoricalSnapshotsReport;
  searchIntelligenceReport: MasterSearchIntelligenceReport;
}

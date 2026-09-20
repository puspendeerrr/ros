/**
 * Recommendation Engine
 * Generates deduplicated, impact-scored, lifecycle-tracked, and priority-classified optimization recommendations.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type {
  ContentPerformanceData,
  KnowledgeGraphHealthData,
  OptimizationRecommendationsReport,
  PriorityClassification,
  RecommendationImpactScore,
  RecommendationLifecycleReport,
  RecommendationPriorityReport,
  RecommendationStatus,
  RetrievalAnalyticsData,
  UnifiedOptimizationRecommendation
} from '../types/intelligence.types.ts';

export class RecommendationEngine {
  /**
   * Computes priority classification based on impact and effort matrix.
   */
  public static computePriority(
    seoImpact: 'high' | 'medium' | 'low',
    aiImpact: 'high' | 'medium' | 'low',
    effort: 'low' | 'medium' | 'high'
  ): PriorityClassification {
    const isHighImpact = seoImpact === 'high' || aiImpact === 'high';
    const isMedImpact = seoImpact === 'medium' || aiImpact === 'medium';

    if (isHighImpact && effort === 'low') return 'quick_win';
    if (isHighImpact && (effort === 'medium' || effort === 'high')) return 'strategic';
    if (isMedImpact && effort === 'low') return 'low_hanging_fruit';
    return 'deprioritized';
  }

  /**
   * Generates and deduplicates recommendations across all content and system diagnostics.
   */
  public static generateRecommendations(
    items: BaseContentItem[],
    contentPerf: ContentPerformanceData,
    retrievalData: RetrievalAnalyticsData,
    kgHealth: KnowledgeGraphHealthData
  ): UnifiedOptimizationRecommendation[] {
    const rawRecs: UnifiedOptimizationRecommendation[] = [];

    // 1. Content Decay & Refresh Recommendations
    contentPerf.pages.forEach(p => {
      if (p.performanceStatus === 'decaying' || p.performanceStatus === 'critical') {
        const impact: RecommendationImpactScore = {
          expectedSeoImpact: 'high',
          expectedAiImpact: 'high',
          implementationEffort: 'medium',
          confidenceScore: 94,
          priorityClassification: this.computePriority('high', 'high', 'medium')
        };

        rawRecs.push({
          id: `rec-refresh-${p.contentId}`,
          type: 'content_refresh',
          sources: ['content_engine', 'search_engine'],
          targetContentId: p.contentId,
          targetUrl: `https://restaurantos.com/content/${p.contentId}`,
          title: `Update decaying content on "${p.title}"`,
          issue: `Content decay score is ${p.contentDecayScore}/100 and has not been revised in ${p.freshnessDays} days.`,
          recommendedAction: 'Refresh benchmark figures, add latest v2.0 features, and verify current pricing tables.',
          status: 'open',
          impact,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });

    // 2. Retrieval Deficit & FAQ Expansion Recommendations
    retrievalData.missingAnswers.forEach((m, idx) => {
      const impact: RecommendationImpactScore = {
        expectedSeoImpact: 'medium',
        expectedAiImpact: 'high',
        implementationEffort: 'low',
        confidenceScore: 92,
        priorityClassification: this.computePriority('medium', 'high', 'low')
      };

      rawRecs.push({
        id: `rec-faq-${idx}`,
        type: 'faq_expansion',
        sources: ['ai_engine'],
        targetContentId: 'global-faq',
        targetUrl: 'https://restaurantos.com/faq',
        title: `Add verified answer for query "${m.query}"`,
        issue: `Retrieval deficit: ${m.deficitReason}`,
        recommendedAction: `Create a concise, structured FAQ answer node addressing "${m.query}" with schema.org FAQPage markup.`,
        status: 'open',
        impact,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    // 3. Knowledge Graph Connectivity & Entity Relationship Recommendations
    kgHealth.weakConnectivityNodes.forEach(entityId => {
      const item = items.find(i => i.id === entityId);
      const title = item?.title || entityId;

      const impact: RecommendationImpactScore = {
        expectedSeoImpact: 'high',
        expectedAiImpact: 'medium',
        implementationEffort: 'low',
        confidenceScore: 89,
        priorityClassification: this.computePriority('high', 'medium', 'low')
      };

      rawRecs.push({
        id: `rec-kg-${entityId}`,
        type: 'entity_relationship',
        sources: ['content_engine', 'ai_engine'],
        targetContentId: entityId,
        targetUrl: `https://restaurantos.com/features/${entityId}`,
        title: `Strengthen knowledge graph relationships for "${title}"`,
        issue: 'Entity has fewer than 2 incoming/outgoing relationship edges, forming a weak graph island.',
        recommendedAction: 'Link this entity to relevant parent pillar guides and sibling features in relatedEntityIds.',
        status: 'open',
        impact,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    // 4. Schema Improvements for High Authority Guides
    items.forEach(item => {
      const takeaways = (item as { keyTakeaways?: string[] }).keyTakeaways;
      if (item.contentType === 'guide' && (!takeaways || takeaways.length < 3)) {
        const impact: RecommendationImpactScore = {
          expectedSeoImpact: 'medium',
          expectedAiImpact: 'high',
          implementationEffort: 'low',
          confidenceScore: 96,
          priorityClassification: this.computePriority('medium', 'high', 'low')
        };

        rawRecs.push({
          id: `rec-schema-${item.id}`,
          type: 'schema_improvement',
          sources: ['schema_engine', 'ai_engine'],
          targetContentId: item.id,
          targetUrl: `https://restaurantos.com/guides/${item.slug}`,
          title: `Enrich How-To and Key Takeaways schema for "${item.title}"`,
          issue: 'Missing structured bullet takeaways, hindering Google AI Overview list snippet eligibility.',
          recommendedAction: 'Add at least 3 structured takeaways and itemized step definitions to the frontmatter.',
          status: 'open',
          impact,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });

    // Deduplicate recommendations by targetContentId + type
    const deduplicatedMap = new Map<string, UnifiedOptimizationRecommendation>();
    rawRecs.forEach(rec => {
      const key = `${rec.targetContentId}:${rec.type}`;
      if (deduplicatedMap.has(key)) {
        const existing = deduplicatedMap.get(key)!;
        // Merge sources
        rec.sources.forEach(s => {
          if (!existing.sources.includes(s)) existing.sources.push(s);
        });
        // Retain highest confidence
        if (rec.impact.confidenceScore > existing.impact.confidenceScore) {
          existing.impact = rec.impact;
        }
      } else {
        deduplicatedMap.set(key, rec);
      }
    });

    return Array.from(deduplicatedMap.values());
  }

  /**
   * Generates reports across recommendations, priority matrix, and lifecycle.
   */
  public static generateReports(recommendations: UnifiedOptimizationRecommendation[]): {
    recommendationsReport: OptimizationRecommendationsReport;
    priorityReport: RecommendationPriorityReport;
    lifecycleReport: RecommendationLifecycleReport;
  } {
    const quickWins = recommendations.filter(r => r.impact.priorityClassification === 'quick_win');
    const strategic = recommendations.filter(r => r.impact.priorityClassification === 'strategic');
    const lowHangingFruit = recommendations.filter(r => r.impact.priorityClassification === 'low_hanging_fruit');
    const deprioritized = recommendations.filter(r => r.impact.priorityClassification === 'deprioritized');

    const statusSummary: Record<RecommendationStatus, number> = {
      open: recommendations.filter(r => r.status === 'open').length,
      accepted: recommendations.filter(r => r.status === 'accepted').length,
      implemented: recommendations.filter(r => r.status === 'implemented').length,
      verified: recommendations.filter(r => r.status === 'verified').length,
      closed: recommendations.filter(r => r.status === 'closed').length
    };

    return {
      recommendationsReport: {
        generatedAt: new Date().toISOString(),
        totalRecommendations: recommendations.length,
        quickWinsCount: quickWins.length,
        strategicCount: strategic.length,
        recommendations
      },
      priorityReport: {
        generatedAt: new Date().toISOString(),
        quickWins,
        strategic,
        lowHangingFruit,
        deprioritized
      },
      lifecycleReport: {
        generatedAt: new Date().toISOString(),
        statusSummary,
        activeWorkflows: recommendations.filter(r => r.status !== 'closed')
      }
    };
  }
}

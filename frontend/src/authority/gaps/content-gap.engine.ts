/**
 * Content Gap Engine
 * Analyzes cluster coverage, entity links, search intent, and user journey gaps.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { ContentGapItem, TopicCluster } from '../types/authority.types.ts';
import { ENTERPRISE_CLUSTERS } from '../clusters/cluster.registry.ts';

export class ContentGapEngine {
  /**
   * Evaluates all gaps across the cluster taxonomy and content graph.
   */
  public static analyzeGaps(
    items: BaseContentItem[],
    clusters: TopicCluster[] = ENTERPRISE_CLUSTERS
  ): ContentGapItem[] {
    const gaps: ContentGapItem[] = [];

    for (const cluster of clusters) {
      const clusterItems = items.filter(i =>
        cluster.entityIds.includes(i.id) ||
        cluster.primaryPillar.entityId === i.id ||
        cluster.primaryProductArea === i.productArea
      );

      const presentTypes = new Set(clusterItems.map(i => i.contentType));
      const presentIntents = new Set(clusterItems.map(i => i.intent));

      // 1. Missing Guide Gap
      if (!presentTypes.has('guide')) {
        gaps.push({
          clusterId: cluster.id,
          gapType: 'missing_guide',
          title: `How-To Operational Guide for ${cluster.name}`,
          reason: `Cluster lacks a practical step-by-step operational guide for ${cluster.targetAudience.join(', ')}.`,
          urgency: 'high',
          targetContentType: 'guide',
          suggestedSlug: `${cluster.slug}-implementation-guide`,
          targetAudience: cluster.targetAudience[0] || 'restaurateur',
          targetIntent: 'informational'
        });
      }

      // 2. Missing FAQ Gap
      if (!presentTypes.has('faq')) {
        gaps.push({
          clusterId: cluster.id,
          gapType: 'missing_faq',
          title: `${cluster.name} Frequently Asked Questions`,
          reason: `Zero FAQ coverage detected. FAQs are essential for Google AI Overviews and conversational answer extraction.`,
          urgency: 'high',
          targetContentType: 'faq',
          suggestedSlug: `${cluster.slug}-faq`,
          targetAudience: cluster.targetAudience[0] || 'restaurateur',
          targetIntent: 'informational'
        });
      }

      // 3. Missing Documentation Gap
      if (!presentTypes.has('documentation')) {
        gaps.push({
          clusterId: cluster.id,
          gapType: 'missing_documentation',
          title: `${cluster.name} Technical Setup & Configuration`,
          reason: `Engineers and operators lack technical onboarding documentation and API specifications.`,
          urgency: 'critical',
          targetContentType: 'documentation',
          suggestedSlug: `${cluster.slug}-setup-docs`,
          targetAudience: 'developer',
          targetIntent: 'informational'
        });
      }

      // 4. Missing Comparison Gap (Commercial Investigation)
      if (!presentTypes.has('comparison')) {
        gaps.push({
          clusterId: cluster.id,
          gapType: 'missing_comparison',
          title: `Restaurant OS vs Traditional Alternatives: ${cluster.name}`,
          reason: `Missing commercial investigation comparison table. High intent buyers searching for comparisons are lost to competitors.`,
          urgency: 'medium',
          targetContentType: 'comparison',
          suggestedSlug: `compare-${cluster.slug}-alternatives`,
          targetAudience: 'restaurateur',
          targetIntent: 'commercial'
        });
      }

      // 5. Missing Glossary Gap
      if (!presentTypes.has('glossary')) {
        gaps.push({
          clusterId: cluster.id,
          gapType: 'missing_glossary',
          title: `Key Terminology & Definitions: ${cluster.name}`,
          reason: `Missing glossary DefinedTerm entities prevents semantic Schema.org knowledge graph anchoring.`,
          urgency: 'low',
          targetContentType: 'glossary',
          suggestedSlug: `${cluster.slug}-terminology`,
          targetAudience: 'all',
          targetIntent: 'informational'
        });
      }

      // 6. Search Intent Gaps (e.g. Missing Commercial or Transactional Intent)
      if (!presentIntents.has('commercial')) {
        gaps.push({
          clusterId: cluster.id,
          gapType: 'search_intent_gap',
          title: `Commercial Evaluation Page for ${cluster.name}`,
          reason: `Cluster has zero commercial intent pages to convert organic discovery traffic into sales consultations.`,
          urgency: 'high',
          targetContentType: 'feature',
          suggestedSlug: `${cluster.slug}-pricing-and-plans`,
          targetAudience: 'restaurateur',
          targetIntent: 'commercial'
        });
      }

      // 7. Journey Gaps (Onboarding)
      const hasOnboarding = clusterItems.some(i => i.contentType === 'documentation' || i.difficulty === 'beginner');
      if (!hasOnboarding) {
        gaps.push({
          clusterId: cluster.id,
          gapType: 'journey_gap',
          title: `Day 1 Onboarding Checklist for ${cluster.name}`,
          reason: `New customers lack structured onboarding content for the ${cluster.name} product area.`,
          urgency: 'high',
          targetContentType: 'documentation',
          suggestedSlug: `${cluster.slug}-onboarding-checklist`,
          targetAudience: 'general_manager',
          targetIntent: 'informational'
        });
      }
    }

    return gaps;
  }
}

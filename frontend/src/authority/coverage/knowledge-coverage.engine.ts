/**
 * Knowledge Coverage Engine
 * Computes multi-dimensional coverage across Topics, Industries, Features, User Journey, Search Intent, and Funnel.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { KnowledgeCoverageReport } from '../types/authority.types.ts';
import { ENTERPRISE_CLUSTERS } from '../clusters/cluster.registry.ts';

export class KnowledgeCoverageEngine {
  /**
   * Generates a comprehensive multi-axis coverage report.
   */
  public static calculateCoverage(items: BaseContentItem[]): KnowledgeCoverageReport {
    const totalItems = Math.max(1, items.length);

    // 1. Topic Coverage across Registered Clusters
    const topicCoverage: KnowledgeCoverageReport['topicCoverage'] = {};
    for (const cluster of ENTERPRISE_CLUSTERS) {
      const count = items.filter(i =>
        cluster.entityIds.includes(i.id) ||
        cluster.primaryPillar.entityId === i.id ||
        cluster.primaryProductArea === i.productArea
      ).length;

      topicCoverage[cluster.name] = {
        totalItems: count,
        coveragePercent: Math.min(100, Math.round((count / 4) * 100))
      };
    }

    // 2. Industry Coverage
    const targetIndustries = ['cafes', 'qsr', 'fine_dining', 'bars_breweries', 'cloud_kitchens'];
    const industryCoverage: KnowledgeCoverageReport['industryCoverage'] = {};
    for (const ind of targetIndustries) {
      const indItems = items.filter(i =>
        i.slug.includes(ind) ||
        i.tagIds.some(t => t.includes(ind)) ||
        (i.relatedIndustryIds && i.relatedIndustryIds.some(r => r.includes(ind)))
      );
      industryCoverage[ind] = {
        totalItems: indItems.length,
        coveragePercent: Math.min(100, indItems.length * 50)
      };
    }

    // 3. Feature Coverage
    const featureAreas = ['qr_menu', 'cloud_pos', 'kds', 'multi_branch', 'billing', 'analytics'];
    const featureCoverage: KnowledgeCoverageReport['featureCoverage'] = {};
    for (const fa of featureAreas) {
      const featItems = items.filter(i => i.productArea === fa);
      featureCoverage[fa] = {
        totalItems: featItems.length,
        coveragePercent: Math.min(100, Math.round((featItems.length / 3) * 100))
      };
    }

    // 4. User Journey Coverage
    // Awareness: Blogs, Guides (beginner/intermediate)
    // Consideration: Comparisons, Features
    // Decision: Pricing, Case Studies
    // Onboarding: Documentation, Quickstarts
    // Expansion: Multi-branch, Advanced API docs
    const awarenessCount = items.filter(i => i.contentType === 'blog' || i.contentType === 'guide').length;
    const considerationCount = items.filter(i => i.contentType === 'comparison' || i.contentType === 'feature').length;
    const decisionCount = items.filter(i => i.contentType === 'case_study' || i.contentType === 'download' || i.slug.includes('pricing')).length;
    const onboardingCount = items.filter(i => i.contentType === 'documentation').length;
    const expansionCount = items.filter(i => i.productArea === 'multi_branch' || i.contentType === 'changelog').length;

    const userJourneyCoverage = {
      awareness: Math.min(100, Math.round((awarenessCount / 2) * 100)),
      consideration: Math.min(100, Math.round((considerationCount / 2) * 100)),
      decision: Math.min(100, Math.round((decisionCount / 1) * 100)),
      onboarding: Math.min(100, Math.round((onboardingCount / 2) * 100)),
      expansion: Math.min(100, Math.round((expansionCount / 1) * 100))
    };

    // 5. Search Intent Coverage
    const intentCounts = {
      informational: items.filter(i => i.intent === 'informational').length,
      commercial: items.filter(i => i.intent === 'commercial').length,
      transactional: items.filter(i => i.intent === 'transactional').length,
      navigational: items.filter(i => i.intent === 'navigational').length
    };
    const searchIntentCoverage = {
      informational: Math.round((intentCounts.informational / totalItems) * 100),
      commercial: Math.round((intentCounts.commercial / totalItems) * 100),
      transactional: Math.round((intentCounts.transactional / totalItems) * 100),
      navigational: Math.round((intentCounts.navigational / totalItems) * 100)
    };

    // 6. Funnel Stage Coverage
    const tofuCount = awarenessCount;
    const mofuCount = considerationCount;
    const bofuCount = decisionCount + onboardingCount;
    const funnelStageCoverage = {
      tofu: Math.min(100, Math.round((tofuCount / 2) * 100)),
      mofu: Math.min(100, Math.round((mofuCount / 2) * 100)),
      bofu: Math.min(100, Math.round((bofuCount / 2) * 100))
    };

    // 7. Business Goal Coverage
    const businessGoalCoverage = {
      marketplace_replacement: Math.min(100, items.filter(i => i.tagIds.includes('tag-zero-commission') || i.slug.includes('aggregator')).length * 50),
      operational_efficiency: Math.min(100, items.filter(i => i.productArea === 'cloud_pos' || i.productArea === 'kds').length * 40),
      franchise_scaling: Math.min(100, items.filter(i => i.productArea === 'multi_branch').length * 50)
    };

    return {
      generatedAt: new Date().toISOString(),
      topicCoverage,
      industryCoverage,
      featureCoverage,
      userJourneyCoverage,
      searchIntentCoverage,
      funnelStageCoverage,
      businessGoalCoverage
    };
  }
}

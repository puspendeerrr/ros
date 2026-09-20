/**
 * Opportunity Engine & Topic Cluster Validator
 * Assesses business opportunity, topical authority clusters, and content sufficiency.
 */

import type { BaseContentItem, ProductArea } from '../../content/models/base.model.ts';
import type { EntityCoverageReport, TopicClusterReport } from '../types/programmatic.types.ts';

export class OpportunityEngine {
  private static readonly CORE_PRODUCT_AREAS: ProductArea[] = [
    'qr_menu',
    'cloud_pos',
    'kds',
    'multi_branch',
    'billing',
    'crm',
    'analytics',
    'platform',
  ];

  /**
   * Generates an entity coverage and topical gap report.
   */
  public static evaluateCoverage(items: BaseContentItem[]): EntityCoverageReport {
    const areaStats: Record<ProductArea, {
      items: BaseContentItem[];
      hasFeature: boolean;
      hasGuide: boolean;
      hasFaq: boolean;
      hasComparison: boolean;
      hasDoc: boolean;
    }> = {} as any;

    for (const area of this.CORE_PRODUCT_AREAS) {
      areaStats[area] = {
        items: [],
        hasFeature: false,
        hasGuide: false,
        hasFaq: false,
        hasComparison: false,
        hasDoc: false,
      };
    }

    for (const item of items) {
      const area = item.productArea || 'platform';
      if (!areaStats[area]) {
        areaStats[area] = { items: [], hasFeature: false, hasGuide: false, hasFaq: false, hasComparison: false, hasDoc: false };
      }
      areaStats[area].items.push(item);
      if (item.contentType === 'feature') areaStats[area].hasFeature = true;
      if (item.contentType === 'guide') areaStats[area].hasGuide = true;
      if (item.contentType === 'faq') areaStats[area].hasFaq = true;
      if (item.contentType === 'comparison') areaStats[area].hasComparison = true;
      if (item.contentType === 'documentation') areaStats[area].hasDoc = true;
    }

    const entities: EntityCoverageReport['entities'] = [];
    let coveredAreas = 0;

    for (const area of this.CORE_PRODUCT_AREAS) {
      const stat = areaStats[area];
      const gaps: string[] = [];
      if (!stat.hasFeature) gaps.push('Missing Feature Landing Page');
      if (!stat.hasGuide) gaps.push('Missing Tactical Implementation Guide');
      if (!stat.hasFaq) gaps.push('Missing Architecture FAQs');
      if (!stat.hasComparison) gaps.push('Missing Competitor Comparison');
      if (!stat.hasDoc) gaps.push('Missing Developer Documentation');

      const clusterScore = Math.round(((5 - gaps.length) / 5) * 100);
      if (clusterScore >= 60) coveredAreas++;

      entities.push({
        id: `entity-${area}`,
        name: area.replace(/_/g, ' ').toUpperCase(),
        productArea: area,
        hasFeature: stat.hasFeature,
        hasGuide: stat.hasGuide,
        hasFaq: stat.hasFaq,
        hasComparison: stat.hasComparison,
        hasDoc: stat.hasDoc,
        clusterScore,
        gaps,
      });
    }

    return {
      generatedAt: new Date().toISOString(),
      totalEntities: this.CORE_PRODUCT_AREAS.length,
      coverageRatio: Math.round((coveredAreas / this.CORE_PRODUCT_AREAS.length) * 100),
      entities,
    };
  }

  /**
   * Generates a Topic Cluster validation report.
   */
  public static evaluateTopicClusters(items: BaseContentItem[]): TopicClusterReport {
    const pillars: TopicClusterReport['pillars'] = this.CORE_PRODUCT_AREAS.map(area => {
      const clusterItems = items
        .filter(i => i.productArea === area)
        .map(i => ({ id: i.id, contentType: i.contentType, title: i.title }));

      // A pillar has sufficient support if it has at least 2 distinct content types
      const types = new Set(clusterItems.map(c => c.contentType));
      const sufficientSupport = types.size >= 2;

      return {
        pillarId: `pillar-${area}`,
        pillarName: `${area.replace(/_/g, ' ')} Suite`.toUpperCase(),
        productArea: area,
        clusterSize: clusterItems.length,
        sufficientSupport,
        clusterItems,
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      totalPillars: pillars.length,
      pillars,
    };
  }
}

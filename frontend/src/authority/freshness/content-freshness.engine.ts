/**
 * Content Freshness & Decay Engine
 * Models content decay over time and flags stale articles, comparisons, and guides for refreshing.
 */

import type { BaseContentItem, ContentType } from '../../content/models/base.model.ts';
import type { ContentDecayRecord, RefreshPriority } from '../types/authority.types.ts';

export class ContentFreshnessEngine {
  // Monthly decay rate multipliers by content type
  private static readonly HALF_LIFE_DAYS: Record<ContentType, number> = {
    comparison: 90,     // Competitor comparisons decay rapidly (3 months)
    changelog: 60,      // Changelogs are superseded quickly (2 months)
    roadmap: 90,        // Product roadmaps require quarterly review
    blog: 120,          // News & industry commentary
    guide: 180,         // Practical guides decay moderately (6 months)
    tutorial: 180,      // Code/setup tutorials
    faq: 180,           // Feature questions
    feature: 240,       // Feature overview pages
    solution: 240,
    industry: 240,
    case_study: 300,
    whitepaper: 360,
    documentation: 180, // Technical docs need frequent verification
    glossary: 360,      // Definitions are relatively evergreen
    download: 240
  };

  /**
   * Analyzes all content items and computes decay and freshness records.
   */
  public static analyzeFreshness(
    items: BaseContentItem[],
    referenceDate: Date = new Date('2026-09-21T00:00:00Z')
  ): ContentDecayRecord[] {
    return items.map(item => this.computeDecayRecord(item, referenceDate));
  }

  /**
   * Computes freshness metrics for a single content item.
   */
  public static computeDecayRecord(item: BaseContentItem, referenceDate: Date): ContentDecayRecord {
    const updatedTime = new Date(item.updatedAt || item.publishedAt).getTime();
    const nowTime = referenceDate.getTime();
    const daysSinceUpdate = Math.max(0, Math.floor((nowTime - updatedTime) / (1000 * 60 * 60 * 24)));

    const halfLife = this.HALF_LIFE_DAYS[item.contentType] || 180;

    // Exponential decay formula: N(t) = 100 * (0.5)^(t / halfLife)
    const decayFactor = Math.pow(0.5, daysSinceUpdate / halfLife);
    const freshnessScore = Math.max(10, Math.round(decayFactor * 100));

    // Assign refresh priority
    let refreshPriority: RefreshPriority = 'fresh';
    const recommendations: string[] = [];

    if (freshnessScore < 45 || daysSinceUpdate > halfLife * 1.5) {
      refreshPriority = 'urgent';
      recommendations.push(`High decay detected (${daysSinceUpdate} days old). Perform full factual and technical audit.`);
    } else if (freshnessScore < 70 || daysSinceUpdate > halfLife) {
      refreshPriority = 'moderate';
      recommendations.push('Approaching half-life threshold. Validate code samples, screenshots, and internal links.');
    } else if (freshnessScore < 85) {
      refreshPriority = 'low';
      recommendations.push('Content is moderately fresh. Verify minor version references.');
    } else {
      refreshPriority = 'fresh';
      recommendations.push('Content is up-to-date and fully authoritative.');
    }

    if (item.contentType === 'comparison' && daysSinceUpdate > 60) {
      recommendations.push('Verify competitor pricing and features against latest market tiers.');
    }

    if (item.contentType === 'documentation' && item.version !== 'latest') {
      recommendations.push(`Document tagged with version "${item.version}". Review compatibility with latest release.`);
    }

    return {
      contentId: item.id,
      title: item.title,
      contentType: item.contentType,
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      daysSinceUpdate,
      freshnessScore,
      decayRate: Number((1 / (halfLife / 30)).toFixed(2)),
      refreshPriority,
      recommendations
    };
  }
}

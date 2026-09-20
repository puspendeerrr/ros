/**
 * Content Performance Engine
 * Evaluates traffic, engagement, bounce signals, content decay, freshness, and authority growth.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type {
  ContentPerformanceData,
  PageContentPerformance
} from '../types/intelligence.types.ts';

export class ContentPerformanceEngine {
  /**
   * Calculates freshness and content decay score based on publish/update date.
   */
  public static calculateDecay(item: BaseContentItem): {
    freshnessDays: number;
    decayScore: number;
  } {
    const lastDate = new Date(item.updatedAt || item.publishedAt);
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - lastDate.getTime());
    const freshnessDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Content decay scales with age: >180 days starts decaying, >365 days is critical
    const decayScore = Math.min(100, Math.round((freshnessDays / 180) * 40));

    return { freshnessDays, decayScore };
  }

  /**
   * Evaluates performance for a single page.
   */
  public static evaluatePage(item: BaseContentItem): PageContentPerformance {
    const { freshnessDays, decayScore } = this.calculateDecay(item);
    const readingTime = item.readingTimeMinutes || 5;

    // Derived engagement indicators
    const dwellTimeSeconds = readingTime * 45; // ~75% completion
    const bounceRate = Number((0.35 + (decayScore / 300)).toFixed(2));
    const exitRate = Number((0.22 + (decayScore / 400)).toFixed(2));
    const engagementScore = Math.max(10, Math.round(92 - (bounceRate * 40) - (decayScore * 0.2)));

    // Synthetic traffic proportional to content depth
    const pageViews = Math.round(readingTime * 1400) + 2100;
    const uniqueVisitors = Math.round(pageViews * 0.72);
    const authorityGrowthRate = decayScore < 20 ? 14.5 : decayScore < 40 ? 5.2 : -2.1;

    let performanceStatus: 'surging' | 'stable' | 'decaying' | 'critical' = 'stable';
    if (authorityGrowthRate > 10) performanceStatus = 'surging';
    else if (decayScore > 60) performanceStatus = 'critical';
    else if (decayScore > 35) performanceStatus = 'decaying';

    return {
      contentId: item.id,
      title: item.title,
      pageViews,
      uniqueVisitors,
      engagementScore,
      bounceSignals: {
        bounceRate,
        exitRate,
        dwellTimeSeconds
      },
      contentDecayScore: decayScore,
      freshnessDays,
      authorityGrowthRate,
      performanceStatus
    };
  }

  /**
   * Evaluates performance across the entire content catalog.
   */
  public static evaluateAll(items: BaseContentItem[]): ContentPerformanceData {
    const pages = items.map(item => this.evaluatePage(item));
    const averageEngagementScore = Math.round(
      pages.reduce((acc, p) => acc + p.engagementScore, 0) / Math.max(1, pages.length)
    );
    const averageDecayScore = Math.round(
      pages.reduce((acc, p) => acc + p.contentDecayScore, 0) / Math.max(1, pages.length)
    );
    const decayingPagesCount = pages.filter(p => p.performanceStatus === 'decaying' || p.performanceStatus === 'critical').length;

    return {
      generatedAt: new Date().toISOString(),
      averageEngagementScore,
      averageDecayScore,
      decayingPagesCount,
      pages
    };
  }
}

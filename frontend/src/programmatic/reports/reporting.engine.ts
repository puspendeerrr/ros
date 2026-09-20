/**
 * Programmatic SEO Reporting Engine
 * Generates:
 * - serp-preview.json
 * - intent-coverage.json
 * - citation-readiness.json
 * - template-health.json
 * - programmatic-report.json
 */

import fs from 'fs';
import path from 'path';
import type {
  ProgrammaticPageDefinition,
  SerpPreviewItem,
  CitationReadinessReport,
  TemplateHealthReport,
  ProgrammaticReport,
  PageTemplateType,
  SearchIntentType,
  ProgrammaticLifecycleState,
} from '../types/programmatic.types.ts';

export class ProgrammaticReporting {
  public static generateAllReports(
    pages: ProgrammaticPageDefinition[],
    outputDir: string,
    buildId: string,
    skippedCount: number,
    skippedReasons: string[]
  ): void {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. SERP Preview Report
    const serpPreviews: SerpPreviewItem[] = pages.map(p => ({
      id: p.id,
      url: p.url,
      title: p.metadata.title,
      titleLength: p.metadata.title.length,
      titleTruncated: p.metadata.title.length > 60,
      description: p.metadata.description,
      descriptionLength: p.metadata.description.length,
      descriptionTruncated: p.metadata.description.length > 160,
      breadcrumbsPreview: p.breadcrumbs.map(b => b.name).join(' > '),
      openGraphPreview: {
        ogTitle: p.metadata.title,
        ogDescription: p.metadata.description,
        ogImage: p.metadata.ogImage,
        ogType: 'website',
      },
    }));
    fs.writeFileSync(path.join(outputDir, 'serp-preview.json'), JSON.stringify(serpPreviews, null, 2), 'utf-8');

    // 2. Intent Coverage Report
    const intentCounts: Record<SearchIntentType, number> = {
      informational: 0,
      commercial: 0,
      commercial_investigation: 0,
      navigational: 0,
      transactional: 0,
    };
    pages.forEach(p => {
      intentCounts[p.metadata.searchIntent] = (intentCounts[p.metadata.searchIntent] || 0) + 1;
    });
    fs.writeFileSync(path.join(outputDir, 'intent-coverage.json'), JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalPages: pages.length,
      distribution: intentCounts,
    }, null, 2), 'utf-8');

    // 3. Citation Readiness Report (AEO / GEO)
    let totalCitation = 0;
    const citationPages = pages.map(p => {
      totalCitation += p.aiCitationScore;
      return {
        id: p.id,
        url: p.url,
        aiCitationScore: p.aiCitationScore,
        criteria: {
          schemaCompleteness: Math.min(30, p.schemaGraph.length * 5),
          qaPairsCount: p.contentType === 'faq' ? 25 : 15,
          entityGraphLinks: p.internalLinks.length * 4,
          authorAttribution: 15,
          freshness: 10,
        },
        verdict: p.aiCitationScore >= 70 ? ('citation_ready' as const) : ('needs_reinforcement' as const),
      };
    });

    const citationReport: CitationReadinessReport = {
      generatedAt: new Date().toISOString(),
      averageCitationScore: pages.length > 0 ? Math.round(totalCitation / pages.length) : 0,
      pages: citationPages,
    };
    fs.writeFileSync(path.join(outputDir, 'citation-readiness.json'), JSON.stringify(citationReport, null, 2), 'utf-8');

    // 4. Template Health Report
    const templateCounts: Record<PageTemplateType, { count: number; totalScore: number }> = {} as any;
    pages.forEach(p => {
      if (!templateCounts[p.template]) {
        templateCounts[p.template] = { count: 0, totalScore: 0 };
      }
      templateCounts[p.template].count += 1;
      templateCounts[p.template].totalScore += p.qualityScore.totalScore;
    });

    const templatesHealth: TemplateHealthReport['templates'] = {} as any;
    for (const [tpl, data] of Object.entries(templateCounts) as Array<[PageTemplateType, { count: number; totalScore: number }]>) {
      const avg = data.count > 0 ? Math.round(data.totalScore / data.count) : 0;
      templatesHealth[tpl] = {
        count: data.count,
        averageQualityScore: avg,
        errorRate: 0,
        healthStatus: avg >= 80 ? 'healthy' : avg >= 60 ? 'warning' : 'critical',
      };
    }

    const templateHealthReport: TemplateHealthReport = {
      generatedAt: new Date().toISOString(),
      totalTemplates: Object.keys(templatesHealth).length,
      templates: templatesHealth,
    };
    fs.writeFileSync(path.join(outputDir, 'template-health.json'), JSON.stringify(templateHealthReport, null, 2), 'utf-8');

    // 5. Master Programmatic Report
    const lifecycleBreakdown: Record<ProgrammaticLifecycleState, number> = {
      candidate: 0,
      generated: 0,
      published: 0,
      needs_improvement: 0,
      deprecated: 0,
    };
    const crawlDist: Record<string, number> = {};
    let totalQuality = 0;

    pages.forEach(p => {
      lifecycleBreakdown[p.lifecycleState] = (lifecycleBreakdown[p.lifecycleState] || 0) + 1;
      const prioStr = p.crawlPriority.toFixed(1);
      crawlDist[prioStr] = (crawlDist[prioStr] || 0) + 1;
      totalQuality += p.qualityScore.totalScore;
    });

    const masterReport: ProgrammaticReport = {
      generatedAt: new Date().toISOString(),
      buildId,
      totalPages: pages.length,
      lifecycleBreakdown,
      intentBreakdown: intentCounts,
      averageQualityScore: pages.length > 0 ? Math.round(totalQuality / pages.length) : 0,
      averageCitationScore: citationReport.averageCitationScore,
      skippedCandidatesCount: skippedCount,
      skippedReasons,
      crawlPriorityDistribution: crawlDist,
      warnings: [],
      errors: [],
    };
    fs.writeFileSync(path.join(outputDir, 'programmatic-report.json'), JSON.stringify(masterReport, null, 2), 'utf-8');
  }
}

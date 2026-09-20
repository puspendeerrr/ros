/**
 * Master Programmatic SEO Execution Engine
 * Orchestrates:
 * 1. Opportunity assessment & topic cluster validation
 * 2. Pre-generation URL conflict checking
 * 3. Generation rules & thin content filtering
 * 4. Specialized page generation (Features, Solutions, Industries, Comparisons, Docs, Resources)
 * 5. Quality & Cannibalization auditing
 * 6. LandingPageRegistry population and report exports
 */

import path from 'path';
import fs from 'fs';
import type { BaseContentItem } from '../../content/models/base.model.ts';
import { MASTER_CONTENT_REGISTRY } from '../../content/registries/content.registry.ts';
import { OpportunityEngine } from '../opportunity/opportunity.engine.ts';
import { GenerationRulesEngine } from '../rules/generation-rules.ts';
import { UrlConflictResolver } from '../url/conflict-resolver.ts';
import { LandingPageRegistry } from '../registry/landing-page.registry.ts';
import { CannibalizationDetector } from '../quality/cannibalization-check.ts';
import { ProgrammaticReporting } from '../reports/reporting.engine.ts';
import {
  FeaturePageGenerator,
  SolutionPageGenerator,
  IndustryPageGenerator,
  ComparisonPageGenerator,
  DocumentationPageGenerator,
  ResourcePageGenerator,
} from '../generators/specialized.generators.ts';
import type { ProgrammaticPageDefinition } from '../types/programmatic.types.ts';

export class ProgrammaticEngine {
  private featureGenerator = new FeaturePageGenerator();
  private solutionGenerator = new SolutionPageGenerator();
  private industryGenerator = new IndustryPageGenerator();
  private comparisonGenerator = new ComparisonPageGenerator();
  private docGenerator = new DocumentationPageGenerator();
  private resourceGenerator = new ResourcePageGenerator();

  private conflictResolver = new UrlConflictResolver();

  public async execute(workspaceDir: string, customItems?: BaseContentItem[]): Promise<{
    pages: ProgrammaticPageDefinition[];
    skippedCount: number;
    warnings: string[];
    errors: string[];
  }> {
    const buildId = `pseo-${Date.now()}`;
    const outputDir = path.join(workspaceDir, 'public');
    const items = customItems || MASTER_CONTENT_REGISTRY;

    const warnings: string[] = [];
    const errors: string[] = [];
    const skippedReasons: string[] = [];
    let skippedCount = 0;

    const registry = LandingPageRegistry.getInstance();
    registry.clear();
    this.conflictResolver.clear();

    // 1. Opportunity & Topic Cluster Evaluation
    const coverageReport = OpportunityEngine.evaluateCoverage(items);
    const clusterReport = OpportunityEngine.evaluateTopicClusters(items);

    fs.writeFileSync(path.join(outputDir, 'entity-coverage.json'), JSON.stringify(coverageReport, null, 2), 'utf-8');
    fs.writeFileSync(path.join(outputDir, 'topic-clusters.json'), JSON.stringify(clusterReport, null, 2), 'utf-8');

    // 2. Filter candidate items using GenerationRulesEngine
    const eligibleItems: BaseContentItem[] = [];
    for (const item of items) {
      const ruleResult = GenerationRulesEngine.evaluate(item);
      if (!ruleResult.allowed) {
        skippedCount++;
        skippedReasons.push(`[${item.id}] Skipped: ${ruleResult.reasons.join(', ')}`);
      } else {
        if (ruleResult.reasons.length > 0) {
          warnings.push(`[${item.id}] ${ruleResult.reasons.join(', ')}`);
        }
        eligibleItems.push(item);
      }
    }

    // 3. Generate Programmatic Pages via Specialized Generators
    const generatedPages: ProgrammaticPageDefinition[] = [];

    for (const item of eligibleItems) {
      let pageDef: ProgrammaticPageDefinition;

      switch (item.contentType) {
        case 'feature':
          pageDef = this.featureGenerator.generate(item, items);
          break;
        case 'solution':
          pageDef = this.solutionGenerator.generate(item, items);
          break;
        case 'industry':
          pageDef = this.industryGenerator.generate(item, items);
          break;
        case 'comparison':
          pageDef = this.comparisonGenerator.generate(item, items);
          break;
        case 'documentation':
          pageDef = this.docGenerator.generate(item, items);
          break;
        case 'guide':
        case 'tutorial':
        case 'faq':
        case 'glossary':
        default:
          pageDef = this.resourceGenerator.generate(item, items);
          break;
      }

      // Pre-generation URL collision check
      const { finalUrl, hasCollision } = this.conflictResolver.register(pageDef.id, pageDef.url);
      if (hasCollision) {
        warnings.push(`URL collision resolved for "${pageDef.id}": redirected to "${finalUrl}".`);
        pageDef.url = finalUrl;
        pageDef.metadata.canonicalUrl = `https://ros.algorithyum.in${finalUrl}`;
      }

      registry.register(pageDef);
      generatedPages.push(pageDef);
    }

    // 4. Cannibalization & Intent Overlap Audit
    const cannibalizationIssues = CannibalizationDetector.audit(generatedPages);
    for (const issue of cannibalizationIssues) {
      warnings.push(`[Cannibalization] ${issue.conflictType} between "${issue.pageIdA}" and "${issue.pageIdB}": ${issue.details}`);
    }

    // 5. Generate All Programmatic Reports
    ProgrammaticReporting.generateAllReports(generatedPages, outputDir, buildId, skippedCount, skippedReasons);

    // 6. Write Master Manifest programmatic-pages.json
    fs.writeFileSync(
      path.join(outputDir, 'programmatic-pages.json'),
      JSON.stringify({
        schemaVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        totalPages: generatedPages.length,
        pages: generatedPages,
      }, null, 2),
      'utf-8'
    );

    // Also mirror into dist/ if exists
    const distDir = path.join(workspaceDir, 'dist');
    if (fs.existsSync(distDir)) {
      const publicFiles = [
        'programmatic-pages.json',
        'entity-coverage.json',
        'topic-clusters.json',
        'serp-preview.json',
        'intent-coverage.json',
        'citation-readiness.json',
        'template-health.json',
        'programmatic-report.json',
      ];
      for (const f of publicFiles) {
        const src = path.join(outputDir, f);
        const dest = path.join(distDir, f);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      }
    }

    return {
      pages: generatedPages,
      skippedCount,
      warnings,
      errors,
    };
  }
}

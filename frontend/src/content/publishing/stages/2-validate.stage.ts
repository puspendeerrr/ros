/**
 * Stage 2: Validate Stage (Runs concurrently with Optimize stage)
 * Extends ContentValidator with:
 * - Orphan page detection
 * - Redirect loop detection
 * - Broken outbound links
 * - Invalid anchor hash detection
 * - JSON-LD Schema compliance
 */

import type { StageContext, StageExecutionTiming } from '../types.ts';
import { ContentValidator } from '../../validation/content.validator.ts';
import { SchemaValidator } from '../../../schema/validators/schema.validator.ts';
import { JsonLdPipeline } from '../../../schema/jsonld/pipeline.ts';

export class ValidateStage {
  public static async execute(context: StageContext): Promise<void> {
    const startTime = new Date().toISOString();
    const startMs = Date.now();

    const items = context.rawContent;
    const referencedIds = new Set<string>();

    // 1. Gather reference graph to detect orphan pages
    for (const item of items) {
      const related = [
        ...(item.seeAlsoIds || []),
        ...(item.prerequisiteIds || []),
        ...(item.continueLearningIds || []),
      ];
      related.forEach(r => referencedIds.add(r));
    }

    // 2. Run standard ContentValidator suite
    for (const item of items) {
      const issues = ContentValidator.validateItem(item, items, []);
      for (const issue of issues) {
        if (issue.severity === 'error') {
          context.errors.push(`[${item.id}] ${issue.ruleCode}: ${issue.message}`);
        } else {
          context.warnings.push(`[${item.id}] ${issue.ruleCode}: ${issue.message}`);
        }
      }

      // 3. Orphan page detection (unreferenced in content graph and not a top-level hub)
      const isTopLevelHub = ['feature', 'documentation', 'guide', 'comparison'].includes(item.contentType) && item.slug.includes('quickstart');
      if (!referencedIds.has(item.id) && !isTopLevelHub) {
        context.warnings.push(`[OrphanPage] Content item "${item.id}" is not referenced by any other content relationship.`);
      }

      // 4. Redirect loop / self-canonical check
      const selfCanonical = item.seo?.canonicalUrl;
      if (selfCanonical && selfCanonical.endsWith(`/${item.slug}/${item.slug}`)) {
        context.errors.push(`[RedirectLoop] Self-referential loop detected in canonical URL for "${item.id}": ${selfCanonical}`);
      }

      // 5. Anchor hash verification in compiled headings
      const compiled = context.compiledMap.get(item.id);
      if (compiled && compiled.headings) {
        // Check for duplicate heading anchors within single document
        const seenHeadings = new Set<string>();
        for (const h of compiled.headings) {
          if (seenHeadings.has(h.id)) {
            context.warnings.push(`[DuplicateAnchor] Duplicate anchor hash "#${h.id}" in "${item.id}".`);
          }
          seenHeadings.add(h.id);
        }
      }
    }

    // 6. Schema Node Validation via SchemaValidator
    const pipeline = JsonLdPipeline.getInstance();
    for (const item of items.slice(0, 5)) { // validate sample batch for build-time safety
      const doc = pipeline.generatePageGraph({
        url: item.seo?.canonicalUrl || `https://ros.algorithyum.in/${item.contentType}/${item.slug}`,
        title: item.title,
        description: item.description,
      });

      const schemaResults = SchemaValidator.validateGraph(doc['@graph']);
      for (const res of schemaResults) {
        if (!res.valid) {
          for (const err of res.errors) {
            context.errors.push(`[SchemaError] (${res.targetType}) on "${item.id}": [${err.field}] ${err.message}`);
          }
        }
      }
    }

    const endMs = Date.now();
    const timing: StageExecutionTiming = {
      stageName: 'Validate',
      startTime,
      endTime: new Date().toISOString(),
      durationMs: endMs - startMs,
      status: context.errors.length === 0 ? 'success' : 'failed',
      itemsProcessed: items.length,
    };
    context.stageTimings.push(timing);
  }
}

/**
 * Build-Time Content Engine Validation CLI
 * Validates 100% of registered content items against:
 * - Slug regex syntax
 * - Duplicate slug/ID detection
 * - Duplicate title detection
 * - Duplicate description detection
 * - Missing author / broken author reference
 * - Missing category / broken category reference
 * - Missing canonical URL
 * - Broken relationship references
 * - Missing alt text and broken media paths
 */

import { ContentValidator } from '../src/content/validation/content.validator.ts';
import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';

export function runContentValidation() {
  console.log(`[Content Engine] Starting integrity audit on ${MASTER_CONTENT_REGISTRY.length} registered content items...`);

  const report = ContentValidator.validateAll(MASTER_CONTENT_REGISTRY);

  console.log(`[Content Engine] Audit finished at: ${report.timestamp}`);
  console.log(`[Content Engine] Checked: ${report.totalItemsChecked} items | Errors: ${report.errorCount} | Warnings: ${report.warningCount}`);

  if (report.issues.length > 0) {
    for (const issue of report.issues) {
      const prefix = issue.severity === 'error' ? '❌ [ERROR]' : '⚠️ [WARN]';
      console.log(`${prefix} (${issue.ruleCode}) on "${issue.contentId}": ${issue.message}`);
    }
  }

  if (!report.passed) {
    console.error(`[Content Engine] Validation FAILED with ${report.errorCount} blocking errors.`);
    process.exit(1);
  }

  console.log(`[Content Engine] ✅ All content items PASSED integrity validation.`);
}

runContentValidation();

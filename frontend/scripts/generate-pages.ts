/**
 * CLI Tool: Generate Programmatic Pages (npm run generate-pages)
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { ProgrammaticEngine } from '../src/programmatic/engine/programmatic.engine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

async function runGeneratePages() {
  console.log('============================================================');
  console.log('🚀 [pSEO Engine] Running Programmatic SEO Generation');
  console.log('============================================================');

  const engine = new ProgrammaticEngine();

  try {
    const result = await engine.execute(workspaceDir);

    console.log(`\n✅ [pSEO Engine] Successfully generated ${result.pages.length} programmatic landing pages.`);
    console.log(`ℹ️  Skipped Candidates: ${result.skippedCount}`);
    console.log(`⚠️  Warnings: ${result.warnings.length} | ❌ Errors: ${result.errors.length}`);
    console.log('------------------------------------------------------------');
    console.log('Generated Artifacts in public/:');
    console.log('  - programmatic-pages.json');
    console.log('  - entity-coverage.json');
    console.log('  - topic-clusters.json');
    console.log('  - serp-preview.json');
    console.log('  - intent-coverage.json');
    console.log('  - citation-readiness.json');
    console.log('  - template-health.json');
    console.log('  - programmatic-report.json');
    console.log('============================================================');
  } catch (err) {
    console.error('❌ [pSEO Engine] Generation failed with fatal error:', err);
    process.exit(1);
  }
}

runGeneratePages();

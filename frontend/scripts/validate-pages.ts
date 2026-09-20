/**
 * CLI Tool: Validate Programmatic Pages (npm run validate-pages)
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { ProgrammaticPageDefinition } from '../src/programmatic/types/programmatic.types.ts';
import { SchemaValidator } from '../src/schema/validators/schema.validator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

async function runValidatePages() {
  console.log('============================================================');
  console.log('🔍 [pSEO Validator] Auditing Programmatic Landing Pages');
  console.log('============================================================');

  const manifestPath = path.join(workspaceDir, 'public', 'programmatic-pages.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ programmatic-pages.json does not exist. Run "npm run generate-pages" first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(raw);
  const pages: ProgrammaticPageDefinition[] = manifest.pages || [];

  console.log(`Auditing ${pages.length} programmatic pages...`);

  let errorCount = 0;
  const seenUrls = new Set<string>();
  const seenCanonicals = new Set<string>();

  for (const page of pages) {
    // 1. URL Uniqueness
    if (seenUrls.has(page.url)) {
      console.error(`❌ Duplicate URL path "${page.url}" on page "${page.id}".`);
      errorCount++;
    }
    seenUrls.add(page.url);

    // 2. Canonical Uniqueness
    if (seenCanonicals.has(page.metadata.canonicalUrl)) {
      console.error(`❌ Duplicate Canonical URL "${page.metadata.canonicalUrl}" on page "${page.id}".`);
      errorCount++;
    }
    seenCanonicals.add(page.metadata.canonicalUrl);

    // 3. Title & Description constraints
    if (!page.metadata.title || page.metadata.title.length < 15) {
      console.error(`❌ Too short title on "${page.id}": "${page.metadata.title}".`);
      errorCount++;
    }
    if (!page.metadata.description || page.metadata.description.length < 30) {
      console.error(`❌ Too short description on "${page.id}".`);
      errorCount++;
    }

    // 4. Schema Node Validation
    const schemaResults = SchemaValidator.validateGraph(page.schemaGraph);
    for (const res of schemaResults) {
      if (!res.valid) {
        console.error(`❌ Schema error on "${page.id}" (${res.targetType}): ${res.errors.map(e => e.message).join(', ')}`);
        errorCount++;
      }
    }

    // 5. Minimum Quality Score
    if (page.qualityScore.totalScore < 70) {
      console.error(`❌ Quality score (${page.qualityScore.totalScore}/100) below threshold for "${page.id}".`);
      errorCount++;
    }
  }

  console.log('------------------------------------------------------------');
  if (errorCount > 0) {
    console.error(`❌ [pSEO Validator] Validation FAILED with ${errorCount} errors.`);
    process.exit(1);
  } else {
    console.log(`🎉 [pSEO Validator] All ${pages.length} programmatic pages PASSED validation!`);
    console.log('============================================================');
  }
}

runValidatePages();

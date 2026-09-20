/**
 * Search Index Generator CLI (npm run generate-search)
 * Generates versioned search-index.json and minified search-index.min.json.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { PublishingEngine } from '../src/content/publishing/publishing.engine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

async function runGenerateSearch() {
  console.log('[Search Pipeline] Generating search-index.json and search-index.min.json...');
  const engine = new PublishingEngine();
  try {
    await engine.run(workspaceDir, false);
    console.log('[Search Pipeline] ✅ Generated search-index.json and search-index.min.json in public/.');
  } catch (err) {
    console.error('[Search Pipeline] ❌ Generation failed:', err);
    process.exit(1);
  }
}

runGenerateSearch();

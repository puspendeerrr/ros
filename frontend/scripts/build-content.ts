/**
 * Content Build CLI (npm run build-content)
 * Ingests content, validates integrity, compiles ASTs, and writes manifests.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { PublishingEngine } from '../src/content/publishing/publishing.engine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

async function runBuildContent() {
  console.log('[Content Pipeline] Compiling, validating, and updating content manifests...');
  const engine = new PublishingEngine();
  try {
    const report = await engine.run(workspaceDir, false);
    console.log(`[Content Pipeline] ✅ Completed in ${report.totalDurationMs}ms (${report.stats.totalPages} pages).`);
  } catch (err) {
    console.error('[Content Pipeline] ❌ Failed:', err);
    process.exit(1);
  }
}

runBuildContent();

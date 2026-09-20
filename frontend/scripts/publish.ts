/**
 * Master CLI for Enterprise Publishing Pipeline (npm run publish)
 * Coordinates the full staged build: Compile -> Validate & Optimize -> Generate -> Publish
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { PublishingEngine } from '../src/content/publishing/publishing.engine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

async function runPublish() {
  console.log('============================================================');
  console.log('🚀 [Publishing Pipeline] Launching Enterprise Publishing Engine');
  console.log('============================================================');

  const engine = new PublishingEngine();

  try {
    const isDev = process.env.NODE_ENV !== 'production';
    const report = await engine.run(workspaceDir, isDev);

    console.log('\n------------------------------------------------------------');
    console.log(`✅ [Publishing Pipeline] Build "${report.buildId}" Finished Successfully!`);
    console.log(`⏱️  Total Duration: ${report.totalDurationMs}ms`);
    console.log(`📄 Pages Processed: ${report.stats.totalPages} (${report.stats.rebuiltPages} rebuilt, ${report.stats.cachedPages} cached)`);
    console.log(`⚠️  Warnings: ${report.stats.warningsCount} | ❌ Errors: ${report.stats.errorsCount}`);
    console.log('------------------------------------------------------------');
    console.log('Stage Breakdown:');
    report.stageTimings.forEach(st => {
      console.log(`  - ${st.stageName.padEnd(12)}: ${st.durationMs}ms [${st.status}] (${st.itemsProcessed} items)`);
    });
    console.log('------------------------------------------------------------');
    console.log('Runtime Diagnostics:');
    console.log(`  - Memory RSS: ${report.diagnostics.peakMemoryRssMb} MB | Heap: ${report.diagnostics.peakHeapUsedMb} / ${report.diagnostics.peakHeapTotalMb} MB`);
    console.log(`  - CPU: ${report.diagnostics.cpuUserMs}ms user, ${report.diagnostics.cpuSystemMs}ms system`);
    console.log(`  - Node: ${report.diagnostics.nodeVersion} on ${report.diagnostics.platform} (${report.diagnostics.arch})`);
    console.log('============================================================');
  } catch (err) {
    console.error('\n❌ [Publishing Pipeline] Build FAILED with fatal error:');
    console.error(err);
    process.exit(1);
  }
}

runPublish();

/**
 * CLI Tool: Analyze Programmatic Internal Links (npm run analyze-links)
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { ProgrammaticPageDefinition } from '../src/programmatic/types/programmatic.types.ts';
import { LinkGraphAnalyzer } from '../src/programmatic/links/link-graph-analyzer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

async function runAnalyzeLinks() {
  console.log('============================================================');
  console.log('🕸️  [Link Graph Analyzer] Inspecting Programmatic Internal Links');
  console.log('============================================================');

  const manifestPath = path.join(workspaceDir, 'public', 'programmatic-pages.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ programmatic-pages.json does not exist. Run "npm run generate-pages" first.');
    process.exit(1);
  }

  const raw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(raw);
  const pages: ProgrammaticPageDefinition[] = manifest.pages || [];

  const telemetry = LinkGraphAnalyzer.analyze(
    pages.map(p => ({ id: p.id, url: p.url, internalLinks: p.internalLinks }))
  );

  console.log(`Total Pages Analyzed   : ${telemetry.totalNodes}`);
  console.log(`Total Internal Edges   : ${telemetry.totalEdges}`);
  console.log(`Avg Links Per Page     : ${telemetry.averageInternalLinks}`);
  console.log(`Max Click Depth from / : ${telemetry.maxClickDistance}`);
  console.log(`Isolated Pages (0 In)  : ${telemetry.isolatedNodeIds.length} ${telemetry.isolatedNodeIds.length > 0 ? `(${telemetry.isolatedNodeIds.join(', ')})` : '(None)'}`);
  console.log('------------------------------------------------------------');
  console.log('In-Degree Link Equity Distribution:');
  Object.entries(telemetry.inDegreeMap).forEach(([id, count]) => {
    console.log(`  - ${id.padEnd(30)}: ${count} inbound links`);
  });
  console.log('============================================================');
}

runAnalyzeLinks();

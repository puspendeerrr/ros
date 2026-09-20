/**
 * CLI Tool: Analyze Citations
 * Audits AI Citation Readiness, AEO/GEO optimization, and snippet quality.
 * Usage: npm run analyze-citations
 */

import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';
import { AiCitationEngine } from '../src/eeat/citations/ai-citation.engine.ts';
import { SourceAttributionEngine } from '../src/eeat/references/source-attribution.engine.ts';

console.log('\n============================================================');
console.log('🤖 [AI Citation Auditor] Evaluating AEO, GEO & Answer Extraction');
console.log('============================================================\n');

const citations = AiCitationEngine.evaluateAll(MASTER_CONTENT_REGISTRY);
const referenceMap = SourceAttributionEngine.buildReferenceMap(MASTER_CONTENT_REGISTRY);
const refMapLookup = new Map(referenceMap.map(r => [r.contentId, r]));

console.log(`Audited ${citations.length} pages for Google AI Overviews, Perplexity & ChatGPT Search readiness.`);
console.log('------------------------------------------------------------');

citations.forEach(c => {
  const aeoBadge = c.isAiOverviewOptimized ? '⭐ AI-OVERVIEW READY' : '🔹 STANDARD EXTRACTION';
  const refData = refMapLookup.get(c.contentId);
  const totalRefs = refData ? refData.totalReferences : 0;

  console.log(`\n  [${aeoBadge} | ${c.citationReadinessScore}/100] "${c.title}"`);
  console.log(`     • Definition Quality : ${c.definitionQuality}/100`);
  console.log(`     • Answer Completeness: ${c.answerCompleteness}/100`);
  console.log(`     • Evidence Strength  : ${c.evidenceStrength}/100`);
  console.log(`     • Entity Linking     : ${c.entityLinking}/100`);
  console.log(`     • Tracked Sources    : ${totalRefs} verifiable references`);
});

console.log('\n============================================================\n');

/**
 * CLI Tool: Analyze Retrieval
 * Audits Context Density, Entity Density, Reference Density, and RAG retrieval readiness.
 * Usage: npm run analyze-retrieval
 */

import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';
import { LlmRetrievalEngine } from '../src/ai-search/retrieval/llm-retrieval.engine.ts';

console.log('\n============================================================');
console.log('🔍 [Retrieval Auditor] Evaluating Context Density & Chunking');
console.log('============================================================\n');

const metrics = LlmRetrievalEngine.evaluateAll(MASTER_CONTENT_REGISTRY);

console.log(`Audited ${metrics.length} content chunks for LLM RAG retrieval readiness.`);
console.log('------------------------------------------------------------');

metrics.forEach(m => {
  const readyBadge = m.retrievalReadinessScore >= 85 ? '🟢 HIGH READINESS' : '🟡 MODERATE READINESS';
  console.log(`\n  [${readyBadge} | Readiness: ${m.retrievalReadinessScore}/100] "${m.title}"`);
  console.log(`     • Context Density   : ${m.contextDensity}/100 (Factual Informative Tokens)`);
  console.log(`     • Entity Density    : ${m.entityDensity}/100 (Disambiguated Knowledge Graph Anchors)`);
  console.log(`     • Reference Density : ${m.referenceDensity}/100 (Verifiable Citation Linkages)`);
  console.log(`     • Definition Cover  : ${m.definitionCoverage}/100 | Answer Cover: ${m.answerCoverage}/100`);
});

console.log('\n============================================================\n');

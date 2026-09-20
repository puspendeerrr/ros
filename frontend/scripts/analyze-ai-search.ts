/**
 * CLI Tool: Analyze AI Search
 * Master audit of Google AI Overviews, Featured Snippets, and LLM answer eligibility.
 * Usage: npm run analyze-ai-search
 */

import { MasterAiSearchEngine } from '../src/ai-search/engine/master-ai-search.engine.ts';

console.log('\n============================================================');
console.log('🤖 [AI Search Engine] Evaluating Google AI Overviews & AEO');
console.log('============================================================\n');

const engine = new MasterAiSearchEngine();
const result = engine.runPipeline(['public', 'dist']);

console.log(`✅ Pipeline Build ID : ${result.summary.buildId}`);
console.log(`⏱️  Timestamp         : ${result.summary.generatedAt}`);
console.log('------------------------------------------------------------');
console.log(`⭐ Average AI Overview Readiness Score : ${result.summary.averageAiOverviewScore}/100`);
console.log(`🔍 Average LLM Retrieval Score         : ${result.summary.averageRetrievalReadiness}/100`);
console.log(`🧩 Total Structured Answer Objects     : ${result.summary.totalAnswerObjects}`);
console.log(`💬 Total Conversational Query Intents  : ${result.summary.totalConversationalQueries}`);
console.log('------------------------------------------------------------');

console.log('\nTop Google AI Overview & Featured Snippet Opportunities:');
result.artifacts.aiOverviewReadiness.forEach(o => {
  const candidateBadge = o.isAiOverviewCandidate ? '🌟 ELIGIBLE' : '🔹 STANDARD';
  console.log(`  - [${candidateBadge} | Overview: ${o.aiOverviewScore}/100 | Snippet: ${o.snippetScore}/100] "${o.title}"`);
  console.log(`     • Snippet Type : [${o.targetSnippetType.toUpperCase()}]`);
  console.log(`     • Target Query : "${o.primaryQuery}"`);
  console.log(`     • Snippet Text : "${o.extractedSnippetText}"`);
});

console.log('------------------------------------------------------------');
console.log('Generated 8 AI Search & Retrieval Reports in public/ and dist/:');
console.log('  - ai-overview-readiness.json');
console.log('  - retrieval-readiness.json');
console.log('  - answer-blocks.json');
console.log('  - conversation-coverage.json');
console.log('  - llm-compatibility.json');
console.log('  - snippet-opportunities.json');
console.log('  - retrieval-graph.json');
console.log('  - ai-search-report.json');
console.log('============================================================\n');

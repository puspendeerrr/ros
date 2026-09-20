/**
 * CLI Tool: Analyze LLM
 * Audits Multi-LLM Compatibility across Google AI Overviews, ChatGPT Search, Gemini, Perplexity, and Bing Copilot.
 * Usage: npm run analyze-llm
 */

import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';
import { MultiLlmCompatibilityEngine } from '../src/ai-search/compatibility/multi-llm.engine.ts';

console.log('\n============================================================');
console.log('🌐 [Multi-LLM Compatibility Auditor] Google vs ChatGPT vs Perplexity vs Gemini vs Copilot');
console.log('============================================================\n');

const compatibilityScores = MultiLlmCompatibilityEngine.evaluateAll(MASTER_CONTENT_REGISTRY);

console.log(`Audited ${compatibilityScores.length} pages across 5 frontier AI search engines.`);
console.log('------------------------------------------------------------');

compatibilityScores.forEach(c => {
  console.log(`\n  "${c.title}"`);
  console.log(`     • Primary Affinity   : [${c.primaryModelAffinity.toUpperCase()}]`);
  console.log(`     • Composite Readiness: ${c.compositeLlmReadiness}/100`);
  console.log(`     • Google AI Overviews: ${c.googleAiOverview}/100`);
  console.log(`     • ChatGPT Search     : ${c.chatGptSearch}/100`);
  console.log(`     • Perplexity Search  : ${c.perplexity}/100`);
  console.log(`     • Gemini Multimodal  : ${c.gemini}/100`);
  console.log(`     • Bing Copilot       : ${c.bingCopilot}/100`);
});

const avgGoogle = Math.round(compatibilityScores.reduce((acc, c) => acc + c.googleAiOverview, 0) / compatibilityScores.length);
const avgChatgpt = Math.round(compatibilityScores.reduce((acc, c) => acc + c.chatGptSearch, 0) / compatibilityScores.length);
const avgPerplexity = Math.round(compatibilityScores.reduce((acc, c) => acc + c.perplexity, 0) / compatibilityScores.length);
const avgGemini = Math.round(compatibilityScores.reduce((acc, c) => acc + c.gemini, 0) / compatibilityScores.length);
const avgBing = Math.round(compatibilityScores.reduce((acc, c) => acc + c.bingCopilot, 0) / compatibilityScores.length);

console.log('------------------------------------------------------------');
console.log('Fleet-Wide LLM Compatibility Averages:');
console.log(`  - Google AI Overviews : ${avgGoogle}/100`);
console.log(`  - ChatGPT Search      : ${avgChatgpt}/100`);
console.log(`  - Perplexity Search   : ${avgPerplexity}/100`);
console.log(`  - Gemini Multimodal   : ${avgGemini}/100`);
console.log(`  - Bing Copilot        : ${avgBing}/100`);
console.log('============================================================\n');

/**
 * CLI Tool: Analyze Answers
 * Audits structured Answer Objects, Decision Matrices, and Conversational Query intents.
 * Usage: npm run analyze-answers
 */

import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';
import { AnswerExtractorEngine } from '../src/ai-search/answers/answer-extractor.engine.ts';
import { ConversationalQueryEngine } from '../src/ai-search/conversation/conversational-query.engine.ts';
import { AnswerBlockEngine } from '../src/ai-search/blocks/answer-block.engine.ts';

console.log('\n============================================================');
console.log('💬 [Answer & Query Auditor] Structured Answers & Conversational Intents');
console.log('============================================================\n');

const answers = AnswerExtractorEngine.extractAllAnswers(MASTER_CONTENT_REGISTRY);
const intents = ConversationalQueryEngine.generateIntents(MASTER_CONTENT_REGISTRY);
const blockSets = AnswerBlockEngine.generateAllBlocks(MASTER_CONTENT_REGISTRY);

console.log(`Audited ${answers.length} verified Answer Objects across ${intents.length} conversational user intents.`);
console.log('------------------------------------------------------------');

console.log('\nSample Structured Answer Objects:');
answers.slice(0, 4).forEach((a, i) => {
  console.log(`  ${i + 1}. [${a.type.toUpperCase()} | Confidence: ${a.confidenceScore}%] "${a.question}"`);
  console.log(`     • Short Answer: "${a.shortAnswer}"`);
  if (a.steps && a.steps.length > 0) {
    console.log(`     • Steps (${a.steps.length}): [1. ${a.steps[0]}]`);
  }
});

console.log('\nConversational Intents by Category:');
const categories = ['what', 'why', 'how', 'comparison', 'troubleshooting', 'implementation'] as const;
categories.forEach(cat => {
  const count = ConversationalQueryEngine.filterByCategory(intents, cat).length;
  console.log(`  - Category [${cat.toUpperCase().padEnd(15)}] : ${count} simulated queries`);
});

console.log('\nReusable Answer Blocks Sample:');
blockSets.slice(0, 2).forEach(b => {
  console.log(`  - Page: "${b.title}"`);
  console.log(`     • Key Takeaways : ${b.keyTakeaways.length} points`);
  console.log(`     • Quick Facts    : [${b.quickFacts.map(f => `${f.label}: ${f.value}`).join(' | ')}]`);
  if (b.checklist) console.log(`     • Checklist      : ${b.checklist.length} verification steps`);
  if (b.decisionMatrix) console.log(`     • Decision Matrix: ${b.decisionMatrix.length} comparative criteria`);
});

console.log('\n============================================================\n');

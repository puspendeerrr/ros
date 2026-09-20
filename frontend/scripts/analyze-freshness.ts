/**
 * CLI Tool: Analyze Freshness
 * Audits content decay curves, freshness scores, and refresh priorities.
 * Usage: npm run analyze-freshness
 */

import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';
import { ContentFreshnessEngine } from '../src/authority/freshness/content-freshness.engine.ts';

console.log('\n============================================================');
console.log('⏳ [Freshness Engine] Content Decay & Refresh Priority Audit');
console.log('============================================================\n');

const records = ContentFreshnessEngine.analyzeFreshness(MASTER_CONTENT_REGISTRY);
const urgent = records.filter(r => r.refreshPriority === 'urgent');
const moderate = records.filter(r => r.refreshPriority === 'moderate');
const fresh = records.filter(r => r.refreshPriority === 'fresh');

console.log(`Audited ${records.length} production content assets.`);
console.log(`Summary: ${fresh.length} Fresh | ${moderate.length} Moderate Decay | ${urgent.length} Urgent Refresh`);
console.log('------------------------------------------------------------');

records.forEach(r => {
  const badge = r.refreshPriority === 'urgent' ? '🔴 URGENT' : r.refreshPriority === 'moderate' ? '🟡 MODERATE' : '🟢 FRESH';
  console.log(`\n  ${badge}: "${r.title}" (${r.contentType})`);
  console.log(`     • Freshness Score : ${r.freshnessScore}/100`);
  console.log(`     • Age             : ${r.daysSinceUpdate} days since last update`);
  console.log(`     • Monthly Decay   : ${r.decayRate}x/mo`);
  if (r.recommendations.length > 0) {
    console.log(`     • Action Items    : ${r.recommendations.join(' | ')}`);
  }
});

console.log('\n============================================================\n');

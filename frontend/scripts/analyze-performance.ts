/**
 * CLI Tool: Analyze Content Performance & Decay
 * Evaluates traffic, engagement, bounce signals, content decay, and authority growth.
 * Usage: npm run analyze-performance
 */

import { MasterIntelligenceEngine } from '../src/intelligence/engines/master-intelligence.engine.ts';

console.log('\n============================================================');
console.log('📊 [Content Performance] Traffic, Engagement & Decay Auditor');
console.log('============================================================\n');

const engine = new MasterIntelligenceEngine();
const result = engine.runPipeline(['public', 'dist']);
const contentPerf = result.artifacts.contentPerformance;

console.log(`Average Engagement Score : ${contentPerf.averageEngagementScore}/100`);
console.log(`Average Decay Score      : ${contentPerf.averageDecayScore}/100`);
console.log(`Decaying Pages Count     : ${contentPerf.decayingPagesCount}`);
console.log('------------------------------------------------------------\n');

console.log('Detailed Page Performance Breakdown:');
contentPerf.pages.forEach(p => {
  const badge = p.performanceStatus === 'surging'
    ? '🚀 SURGING'
    : p.performanceStatus === 'stable'
      ? '🟢 STABLE'
      : p.performanceStatus === 'decaying'
        ? '🟡 DECAYING'
        : '🔴 CRITICAL';

  console.log(`  [${badge}] "${p.title}"`);
  console.log(`     • Page Views    : ${p.pageViews.toLocaleString()} | Unique Visitors: ${p.uniqueVisitors.toLocaleString()}`);
  console.log(`     • Engagement    : ${p.engagementScore}/100 | Dwell Time: ${p.bounceSignals.dwellTimeSeconds}s | Bounce: ${(p.bounceSignals.bounceRate * 100).toFixed(0)}%`);
  console.log(`     • Freshness     : ${p.freshnessDays} days ago | Decay Score: ${p.contentDecayScore}/100`);
  console.log(`     • Auth Growth   : ${p.authorityGrowthRate > 0 ? '+' : ''}${p.authorityGrowthRate}%`);
});

console.log('\n============================================================\n');

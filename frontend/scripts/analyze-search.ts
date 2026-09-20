/**
 * CLI Tool: Analyze Search Performance & Intelligence
 * Master audit of organic search performance, rankings, indexation, CWV, and intelligence reports.
 * Usage: npm run analyze-search
 */

import { MasterIntelligenceEngine } from '../src/intelligence/engines/master-intelligence.engine.ts';

console.log('\n============================================================');
console.log('📈 [Search Intelligence] Organic Performance & Platform Health');
console.log('============================================================\n');

const engine = new MasterIntelligenceEngine();
const result = engine.runPipeline(['public', 'dist']);

console.log(`✅ Build ID                 : ${result.summary.buildId}`);
console.log(`⏱️  Timestamp                : ${result.summary.generatedAt}`);
console.log('------------------------------------------------------------');
console.log(`⭐ Overall Health Score      : ${result.summary.overallHealthScore}/100`);
console.log(`🌐 Organic Search Health    : ${result.summary.organicSearchHealth}/100`);
console.log(`🤖 AI Search Health         : ${result.summary.aiSearchHealth}/100`);
console.log(`🔍 Retrieval Health         : ${result.summary.retrievalHealth}/100`);
console.log(`📝 Content Quality Health   : ${result.summary.contentQualityHealth}/100`);
console.log(`🕸️  Knowledge Graph Health   : ${result.summary.knowledgeGraphHealth}/100`);
console.log(`📈 30-Day Trajectory        : [${result.summary.trajectory.toUpperCase()}]`);
console.log('------------------------------------------------------------');

console.log('\nOrganic Search & Core Web Vitals Performance:');
result.artifacts.searchPerformance.pages.forEach(p => {
  console.log(`  - "${p.title}"`);
  console.log(`     • Impressions : ${p.impressions.toLocaleString()} | Clicks: ${p.clicks.toLocaleString()} | CTR: ${(p.ctr * 100).toFixed(1)}% | Pos: ${p.averagePosition}`);
  console.log(`     • Core Web Vitals : LCP ${p.coreWebVitals.lcpMs}ms | CLS ${p.coreWebVitals.cls} | INP ${p.coreWebVitals.inpMs}ms [${p.coreWebVitals.rating.toUpperCase()}]`);
});

console.log('\nTrend Analysis (30-Day Velocity):');
result.artifacts.trendAnalysis.metrics.forEach(m => {
  const dir = m.trend === 'improving' ? '↗️' : m.trend === 'declining' ? '↘️' : '➡️';
  console.log(`  ${dir} ${m.metricName.padEnd(25)} : Current: ${m.currentValue} | 30d Ago: ${m.thirtyDaysAgo} (${m.percentageChange30d > 0 ? '+' : ''}${m.percentageChange30d}%) [${m.trend.toUpperCase()}]`);
});

console.log('------------------------------------------------------------');
console.log('Generated 13 Search Intelligence & Monitoring Reports in public/ and dist/:');
console.log('  - search-performance.json');
console.log('  - ai-search-monitor.json');
console.log('  - retrieval-analytics.json');
console.log('  - content-performance.json');
console.log('  - knowledge-health.json');
console.log('  - optimization-recommendations.json');
console.log('  - alerts.json');
console.log('  - search-intelligence-report.json');
console.log('  - trend-analysis.json');
console.log('  - recommendation-priority.json');
console.log('  - recommendation-lifecycle.json');
console.log('  - historical-snapshots.json');
console.log('  - root-cause-analysis.json');
console.log('============================================================\n');

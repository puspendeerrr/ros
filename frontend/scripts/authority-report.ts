/**
 * CLI Tool: Authority Report
 * Computes Topic Ownership, Cluster Maturity, and Entity Dependency Scores.
 * Usage: npm run authority-report
 */

import { MasterTopicalAuthorityEngine } from '../src/authority/engine/topical-authority.engine.ts';

console.log('\n============================================================');
console.log('🏛️  [Authority Engine] Generating Authority & Ownership Report');
console.log('============================================================\n');

const engine = new MasterTopicalAuthorityEngine();
const result = engine.runPipeline(['public', 'dist']);

console.log(`✅ Pipeline Build ID: ${result.summary.buildId}`);
console.log(`⏱️  Timestamp: ${result.summary.generatedAt}`);
console.log('------------------------------------------------------------');
console.log(`📊 Average Cluster Authority Score : ${result.summary.averageClusterAuthority}/100`);
console.log(`🏆 Average Topic Ownership Score   : ${result.summary.averageTopicOwnership}/100`);
console.log(`🌳 Total Registered Clusters       : ${result.summary.totalClusters}`);
console.log(`🔗 Total Graph Entities            : ${result.summary.totalEntities}`);
console.log('------------------------------------------------------------');
console.log('Cluster Maturity & Topic Ownership Breakdown:');

result.artifacts.clusterAuthorityScores.forEach(c => {
  console.log(`  - [${c.maturity.toUpperCase()}] ${c.clusterName}`);
  console.log(`     • Topic Ownership : ${c.topicOwnershipScore}/100`);
  console.log(`     • Overall Authority: ${c.overallAuthorityScore}/100`);
  console.log(`     • Completeness     : ${c.completeness}% | Intent Coverage: ${c.intentCoverage}%`);
});

console.log('\nTop Foundational Entities (Dependency Score):');
result.artifacts.entityAuthorityScores
  .sort((a, b) => b.dependencyScore - a.dependencyScore)
  .slice(0, 5)
  .forEach(e => {
    console.log(`  - [Score: ${e.dependencyScore}/100] ${e.title} (${e.contentType})`);
    console.log(`     • Authority: ${e.authorityScore}/100 | Citation: ${e.citationReadiness}/100 | Freshness: ${e.freshnessScore}/100`);
  });

console.log('------------------------------------------------------------');
console.log(`Generated 8 Authority JSON Reports in public/ and dist/:`);
console.log('  - authority-clusters.json');
console.log('  - content-gap-analysis.json');
console.log('  - editorial-backlog.json');
console.log('  - knowledge-coverage.json');
console.log('  - content-freshness.json');
console.log('  - authority-scoreboard.json');
console.log('  - entity-relationships.json');
console.log('  - cluster-health.json');
console.log('============================================================\n');

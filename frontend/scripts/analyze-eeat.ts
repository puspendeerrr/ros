/**
 * CLI Tool: Analyze EEAT
 * Audits Experience, Expertise, Authoritativeness, and Trustworthiness scores.
 * Usage: npm run analyze-eeat
 */

import { MasterEeatFrameworkEngine } from '../src/eeat/engine/eeat-framework.engine.ts';
import { EeatAuthorityScorer } from '../src/eeat/scoring/eeat-authority.scorer.ts';
import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';

console.log('\n============================================================');
console.log('🏆 [EEAT Quality Auditor] Evaluating Search Quality Rater Guidelines');
console.log('============================================================\n');

const engine = new MasterEeatFrameworkEngine();
const result = engine.runPipeline(['public', 'dist']);
const eeatScores = EeatAuthorityScorer.scoreAll(MASTER_CONTENT_REGISTRY);

console.log(`✅ Pipeline Build ID: ${result.summary.buildId}`);
console.log(`⏱️  Timestamp        : ${result.summary.generatedAt}`);
console.log('------------------------------------------------------------');
console.log(`⭐ Average Composite EEAT Score   : ${result.summary.averageEeatScore}/100`);
console.log(`🛡️  Average Page Trust Score       : ${result.summary.averageTrustScore}/100`);
console.log(`🤖 Average AI Citation Score      : ${result.summary.averageCitationScore}/100`);
console.log(`👥 Peer-Reviewed Content Ratio    : ${result.summary.peerReviewedPercent}%`);
console.log(`🏛️  Knowledge Panel Ready Entities : ${result.summary.knowledgePanelReadyCount}/${result.summary.totalEntitiesAudited}`);
console.log('------------------------------------------------------------');

console.log('\nDetailed EEAT Scorecard by Content Item:');
eeatScores.forEach(s => {
  const badge = s.ratingTier === 'elite' ? '🌟 ELITE' : s.ratingTier === 'authoritative' ? '🔷 AUTHORITATIVE' : '⚪ STANDARD';
  console.log(`  - [${badge} | ${s.compositeEeatScore}/100] "${s.title}"`);
  console.log(`     • Experience: ${s.experienceScore}/100 | Expertise: ${s.expertiseScore}/100`);
  console.log(`     • Authority : ${s.authoritativenessScore}/100 | Trust: ${s.trustworthinessScore}/100`);
});

console.log('\n------------------------------------------------------------');
console.log('Generated 8 Enterprise Trust & EEAT Reports in public/ and dist/:');
console.log('  - entity-authority.json');
console.log('  - author-profiles.json');
console.log('  - review-status.json');
console.log('  - editorial-governance.json');
console.log('  - trust-signals.json');
console.log('  - knowledge-panel-readiness.json');
console.log('  - citation-readiness.json');
console.log('  - reference-map.json');
console.log('============================================================\n');

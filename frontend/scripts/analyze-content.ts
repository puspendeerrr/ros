/**
 * CLI Tool: Analyze Content
 * Audits content discovery opportunities, gaps, and content overlap.
 * Usage: npm run analyze-content
 */

import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';
import { ENTERPRISE_CLUSTERS } from '../src/authority/clusters/cluster.registry.ts';
import { ContentDiscoveryEngine } from '../src/authority/discovery/content-discovery.engine.ts';
import { ContentGapEngine } from '../src/authority/gaps/content-gap.engine.ts';
import { ContentOverlapDetector } from '../src/authority/gaps/content-overlap.detector.ts';

console.log('\n============================================================');
console.log('🔍 [Content Analyzer] Running Discovery & Gap Analysis');
console.log('============================================================\n');

const opportunities = ContentDiscoveryEngine.discoverOpportunities(MASTER_CONTENT_REGISTRY, ENTERPRISE_CLUSTERS);
const gaps = ContentGapEngine.analyzeGaps(MASTER_CONTENT_REGISTRY, ENTERPRISE_CLUSTERS);
const overlaps = ContentOverlapDetector.detectOverlaps(MASTER_CONTENT_REGISTRY, 40);

console.log(`Audited ${MASTER_CONTENT_REGISTRY.length} content items across ${ENTERPRISE_CLUSTERS.length} enterprise clusters.`);
console.log('------------------------------------------------------------');

console.log(`\n🎯 Discovered Content Opportunities (${opportunities.length}):`);
opportunities.slice(0, 5).forEach((opp, i) => {
  console.log(`  ${i + 1}. [${opp.urgency.toUpperCase()}] ${opp.topic}`);
  console.log(`     -> Category: ${opp.category}`);
  console.log(`     -> Reason: ${opp.reason}`);
});

console.log(`\n⚠️  Content Gaps Detected (${gaps.length}):`);
gaps.slice(0, 5).forEach((gap, i) => {
  console.log(`  ${i + 1}. [${gap.urgency.toUpperCase()}] ${gap.title} (${gap.targetContentType})`);
  console.log(`     -> Cluster: ${gap.clusterId}`);
  console.log(`     -> Intent: ${gap.targetIntent} | Audience: ${gap.targetAudience}`);
  console.log(`     -> Reason: ${gap.reason}`);
});

console.log(`\n🔄 Content Overlap & Redundancy Warnings (${overlaps.length}):`);
if (overlaps.length === 0) {
  console.log('  ✅ No high-overlap redundancy detected (all items < 40% overlap).');
} else {
  overlaps.forEach((ov, i) => {
    console.log(`  ${i + 1}. [${ov.overlapScore}% Overlap] "${ov.titleA}" <==> "${ov.titleB}"`);
    console.log(`     -> Shared Tags: [${ov.sharedTags.join(', ')}]`);
    console.log(`     -> Action: ${ov.recommendation.toUpperCase()}`);
  });
}

console.log('\n============================================================\n');

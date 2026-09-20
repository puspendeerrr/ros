/**
 * CLI Tool: Editorial Plan
 * Generates prioritized content backlog with Confidence Scores and explicit reasons.
 * Usage: npm run editorial-plan
 */

import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';
import { ENTERPRISE_CLUSTERS } from '../src/authority/clusters/cluster.registry.ts';
import { EditorialPlanningEngine } from '../src/authority/roadmap/editorial-planning.engine.ts';

console.log('\n============================================================');
console.log('📝 [Editorial Planner] Strategic Content Backlog & Recommendations');
console.log('============================================================\n');

const backlog = EditorialPlanningEngine.generateBacklog(MASTER_CONTENT_REGISTRY, ENTERPRISE_CLUSTERS);
const byType = EditorialPlanningEngine.getRecommendationsByType(backlog);

console.log(`Generated ${backlog.length} strategic recommendations across 6 clusters.`);
console.log('------------------------------------------------------------');

console.log('\n🚀 Top 5 High-Impact Backlog Items:');
backlog.slice(0, 5).forEach((item, i) => {
  console.log(`  ${i + 1}. [Priority: ${item.priorityScore}/100 | Confidence: ${item.confidenceScore}%] ${item.title}`);
  console.log(`     • Archetype   : ${item.targetContentType.toUpperCase()}`);
  console.log(`     • Value Tier  : ${item.businessValue.toUpperCase()} (Est. Authority Gain: +${item.estimatedAuthorityGain} pts)`);
  console.log(`     • Intent      : ${item.primaryIntent} | Audience: ${item.targetAudience}`);
  console.log(`     • RATIONALE   : ${item.recommendationReason}`);
  console.log(`     • Link To     : [${item.suggestedEntitiesToLink.join(', ')}]`);
  console.log(`     • Lifecycle   : ${item.status.toUpperCase()}`);
});

console.log('\n📋 Breakdown by Content Archetype:');
console.log(`  - Practical Guides        : ${byType.guides.length} items`);
console.log(`  - Frequently Asked Qs (FAQ): ${byType.faqs.length} items`);
console.log(`  - Competitor Comparisons  : ${byType.comparisons.length} items`);
console.log(`  - Technical Documentation : ${byType.documentation.length} items`);
console.log(`  - Glossary Terms          : ${byType.glossary.length} items`);
console.log(`  - Commercial Features     : ${byType.features.length} items`);

console.log('\n============================================================\n');

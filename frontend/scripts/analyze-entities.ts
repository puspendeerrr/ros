/**
 * CLI Tool: Analyze Entities
 * Audits Canonical Entity identities, sameAs reconciliation, and Knowledge Panel readiness.
 * Usage: npm run analyze-entities
 */

import { CANONICAL_ENTITIES_REGISTRY } from '../src/eeat/entities/canonical-entity.registry.ts';
import { EntityIdentityEngine } from '../src/eeat/entities/entity-identity.engine.ts';
import { KnowledgePanelEngine } from '../src/eeat/knowledge-panel/knowledge-panel.engine.ts';

console.log('\n============================================================');
console.log('🏛️  [Entity Auditor] Evaluating Knowledge Panel & Graph Identities');
console.log('============================================================\n');

const identityEngine = new EntityIdentityEngine();
const kpReadiness = KnowledgePanelEngine.evaluateAllEntities(CANONICAL_ENTITIES_REGISTRY);

console.log(`Audited ${CANONICAL_ENTITIES_REGISTRY.length} canonical entities in the Restaurant OS Knowledge Graph.`);
console.log('------------------------------------------------------------');

console.log('\nCanonical Entity Registry & Permanent URIs:');
CANONICAL_ENTITIES_REGISTRY.forEach(e => {
  const check = identityEngine.validateEntityIntegrity(e);
  const statusIcon = check.isValid ? '✅' : '❌';
  console.log(`  ${statusIcon} [${e.entityType}] ${e.name}`);
  console.log(`     • URI       : ${e.canonicalUri}`);
  console.log(`     • UUID      : ${e.identifier}`);
  console.log(`     • sameAs    : [${(e.sameAs || []).join(', ')}]`);
});

console.log('\nKnowledge Panel Readiness Scores:');
kpReadiness.forEach(k => {
  const readyBadge = k.readinessScore >= 80 ? '🟢 READY' : '🟡 PARTIAL';
  console.log(`  - [${readyBadge} | ${k.readinessScore}/100] ${k.entityName} (${k.entityType})`);
  console.log(`     • sameAs Links: ${k.sameAsLinksCount}`);
  if (k.missingCriticalAttributes.length > 0) {
    console.log(`     • Missing     : ${k.missingCriticalAttributes.join(', ')}`);
  }
  if (k.recommendations.length > 0) {
    console.log(`     • Action Items: ${k.recommendations.join(' | ')}`);
  }
});

console.log('\n============================================================\n');

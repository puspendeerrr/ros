/**
 * CLI Tool: Analyze Trust
 * Audits page trust signals, author verification, and editorial governance compliance.
 * Usage: npm run analyze-trust
 */

import { MASTER_CONTENT_REGISTRY } from '../src/content/registries/content.registry.ts';
import { TrustSignalEngine } from '../src/eeat/trust/trust-signal.engine.ts';
import { ReviewStatusTracker } from '../src/eeat/trust/review-status.tracker.ts';
import { GovernanceValidator } from '../src/eeat/governance/governance-validator.ts';
import { EDITORIAL_GOVERNANCE_POLICIES } from '../src/eeat/governance/editorial-policies.ts';

console.log('\n============================================================');
console.log('🛡️  [Trust Auditor] Evaluating Trust Signals & Governance');
console.log('============================================================\n');

const signals = TrustSignalEngine.computeAllSignals(MASTER_CONTENT_REGISTRY);
const reviews = ReviewStatusTracker.generateReviewRecords(MASTER_CONTENT_REGISTRY);
const governanceResults = GovernanceValidator.validateAll(MASTER_CONTENT_REGISTRY);

console.log(`Audited ${signals.length} content items against ${EDITORIAL_GOVERNANCE_POLICIES.length} active governance policies.`);
console.log('------------------------------------------------------------');

console.log('\nPage Trust Signals & Review Breakdown:');
signals.forEach(s => {
  const statusBadge = s.reviewStatus === 'peer_reviewed' ? '✅ PEER-REVIEWED' : '🟡 AUTHOR-VERIFIED';
  console.log(`  - [Trust: ${s.overallTrustScore}/100 | ${statusBadge}] "${s.title}"`);
  console.log(`     • Author        : ${s.authorName} (${s.verifiedAuthor ? 'Verified Staff' : 'Unverified'})`);
  console.log(`     • Reviewers     : [${s.reviewedByIds.join(', ') || 'None'}]`);
  console.log(`     • Evidence      : ${s.productEvidenceStrength.toUpperCase()} | Version: ${s.contentVersion}`);
  console.log(`     • Transparency  : ${s.transparencyScore}/100 | Accuracy: ${s.technicalAccuracyScore}/100`);
});

console.log('\nGovernance Policy Compliance Summary:');
const nonCompliant = governanceResults.filter(g => !g.isCompliant);
if (nonCompliant.length === 0) {
  console.log('  ✅ 100% of production content items pass all mandatory governance rules.');
} else {
  nonCompliant.forEach(g => {
    console.log(`  ❌ Item "${g.contentId}" policy violations: ${g.policyViolations.join('; ')}`);
  });
}

console.log(`\nActive Editorial Governance Policies (${EDITORIAL_GOVERNANCE_POLICIES.length}):`);
EDITORIAL_GOVERNANCE_POLICIES.forEach((pol, i) => {
  console.log(`  ${i + 1}. [v${pol.version}] ${pol.name}`);
  console.log(`     -> URL: ${pol.publicUrl}`);
});

console.log('\n============================================================\n');

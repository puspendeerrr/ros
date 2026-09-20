/**
 * CLI Tool: Analyze AI Search Monitoring & System Alerts
 * Evaluates AI engine presence, citation wins/losses, retrieval metrics, knowledge graph health, and alerts.
 * Usage: npm run analyze-monitoring
 */

import { MasterIntelligenceEngine } from '../src/intelligence/engines/master-intelligence.engine.ts';

console.log('\n============================================================');
console.log('🤖 [AI Search & System Monitoring] Citations, KG & Alerts');
console.log('============================================================\n');

const engine = new MasterIntelligenceEngine();
const result = engine.runPipeline(['public', 'dist']);

const aiMonitor = result.artifacts.aiSearchMonitor;
const retrieval = result.artifacts.retrievalAnalytics;
const kg = result.artifacts.knowledgeHealth;
const alerts = result.artifacts.alerts;

console.log(`Average Share of Voice   : ${aiMonitor.averageShareOfVoice}%`);
console.log(`Citation Growth          : +${aiMonitor.totalCitationWins} wins / -${aiMonitor.totalCitationLosses} losses (Net: +${aiMonitor.netCitationGrowth})`);
console.log(`Retrieval Success Rate   : ${retrieval.retrievalSuccessRate}% [Hallucination Risk: ${retrieval.hallucinationRisk.toUpperCase()}]`);
console.log(`Knowledge Graph Health   : ${kg.overallHealthScore}/100 (Entities: ${kg.totalEntities}, Edges: ${kg.totalRelationships})`);
console.log(`Active Platform Alerts   : ${alerts.alerts.length} (${alerts.criticalCount} Critical, ${alerts.warningCount} Warning)`);
console.log('------------------------------------------------------------\n');

console.log('AI Search Visibility & Citation Dynamics:');
aiMonitor.monitoredPages.forEach(p => {
  const presenceList = Object.entries(p.presence)
    .filter(([_, active]) => active)
    .map(([engineName]) => engineName)
    .join(', ');

  console.log(`  - "${p.title}"`);
  console.log(`     • Presence Engines : [${presenceList}]`);
  console.log(`     • Share of Voice   : ${p.shareOfVoice}% | Citations: +${p.citationWins} / -${p.citationLosses}`);
  console.log(`     • Displacing       : ${p.displacedCompetitors.join(', ')}`);
});

console.log('\nActive System Alerts & Root Cause Investigations:');
alerts.alerts.forEach(a => {
  const badge = a.severity === 'critical' ? '🔴 CRITICAL' : a.severity === 'warning' ? '🟡 WARNING' : 'ℹ️ INFO';
  console.log(`  [${badge}] ${a.title}`);
  console.log(`     • URL            : ${a.affectedUrl}`);
  console.log(`     • Symptom        : ${a.description}`);
  console.log(`     • Root Cause     : ${a.rootCause.primaryCause}`);
  console.log(`     • Remediation    : ${a.rootCause.remediationPath}`);
});

console.log('\n============================================================\n');

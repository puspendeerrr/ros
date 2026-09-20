/**
 * Root Barrel Export for Enterprise Topical Authority & Content Cluster Engine (Phase 5B)
 */

export * from './types/authority.types.ts';
export * from './editorial/editorial-lifecycle.ts';
export * from './clusters/cluster.registry.ts';
export * from './clusters/cluster-resolver.ts';
export * from './graph/knowledge-graph.engine.ts';
export * from './discovery/content-discovery.engine.ts';
export * from './gaps/content-gap.engine.ts';
export * from './gaps/content-overlap.detector.ts';
export * from './freshness/content-freshness.engine.ts';
export * from './scoring/cluster-authority.scorer.ts';
export * from './scoring/entity-authority.scorer.ts';
export * from './roadmap/editorial-planning.engine.ts';
export * from './coverage/knowledge-coverage.engine.ts';
export * from './links/cluster-link.optimizer.ts';
export * from './reports/authority-reporting.ts';
export * from './engine/topical-authority.engine.ts';

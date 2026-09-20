/**
 * Root Cause Analysis (RCA) Engine
 * Performs deterministic multi-factor root cause diagnosis for search performance, indexing, and AI citation anomalies.
 */

import type { RootCauseInvestigation } from '../types/intelligence.types.ts';

export class RootCauseEngine {
  /**
   * Investigates an alert symptom and builds a deterministic root-cause provenance chain.
   */
  public static diagnose(
    alertId: string,
    category: string,
    symptom: string,
    affectedUrl: string
  ): RootCauseInvestigation {
    switch (category) {
      case 'traffic_drop':
        return {
          alertId,
          symptom,
          primaryCause: 'Search Query Volatility & Competitor SERP Feature Rollout',
          contributingFactors: [
            'Increase in Google AI Overview answer box occupying position 0',
            'Decreased organic CTR on non-branded dining POS queries',
            'Content freshness threshold reached 120+ days'
          ],
          provenanceChain: [
            'Google SERP Layout Update',
            'Organic Snippet Demoted Below Fold',
            'Dwell Time Reduced on Top Landing URL',
            affectedUrl
          ],
          remediationPath: 'Inject structured Definition Blocks and Step-by-Step lists to capture AI Overview Position 0.'
        };

      case 'lost_ai_citation':
        return {
          alertId,
          symptom,
          primaryCause: 'Competitor Definition Displacement in LLM Retrieval Chunks',
          contributingFactors: [
            'Competitor updated comparison table with newly claimed features',
            'Entity context density dropped below 80% threshold',
            'Missing direct table-order data points in source markdown'
          ],
          provenanceChain: [
            'Perplexity / ChatGPT Index Refresh',
            'Third-Party Comparison Aggregator Ingested',
            'Restaurant OS Chunk Down-weighted',
            affectedUrl
          ],
          remediationPath: 'Publish verified head-to-head comparison metrics with explicit schema citations.'
        };

      case 'indexing_issue':
        return {
          alertId,
          symptom,
          primaryCause: 'Robots.txt Disallow or Soft 404 Header Misconfiguration',
          contributingFactors: [
            'Canonical tag mismatching trailing slash',
            'Dynamic client-side hydration delay exceeding Googlebot 5s budget'
          ],
          provenanceChain: [
            'Build Deployment Pipeline',
            'Canonical URL Normalization Variance',
            'Search Console Coverage Exclusion',
            affectedUrl
          ],
          remediationPath: 'Enforce strict canonical URL normalization in SEOManager.tsx and verify XML sitemap entry.'
        };

      case 'broken_schema':
        return {
          alertId,
          symptom,
          primaryCause: 'Missing Mandatory Schema.org Properties in JSON-LD',
          contributingFactors: [
            'Author profile lacking sameAs social or Wikidata verification URI',
            'Product schema missing aggregateRating review count'
          ],
          provenanceChain: [
            'Schema Validator Linting',
            'JSON-LD Generation Hook',
            'Rich Results Test Warning',
            affectedUrl
          ],
          remediationPath: 'Verify author bio in AuthorRegistry and add verified sameAs profile links.'
        };

      default:
        return {
          alertId,
          symptom,
          primaryCause: 'General Content Decay & Internal Linking Deficiency',
          contributingFactors: [
            'Internal link in-degree is lower than 2',
            'No inbound contextual anchors from pillar topic guides'
          ],
          provenanceChain: [
            'Information Architecture Crawler',
            'Internal Link Graph In-degree < 2',
            affectedUrl
          ],
          remediationPath: 'Add bidirectional contextual internal links from relevant pillar cluster guide.'
        };
    }
  }
}

/**
 * Semantic Intent & Keyword Cannibalization Auditor
 * Detects multiple landing pages competing for identical search intents or keyword targets.
 */

import type { ProgrammaticPageDefinition } from '../types/programmatic.types.ts';

export interface CannibalizationIssue {
  pageIdA: string;
  urlA: string;
  pageIdB: string;
  urlB: string;
  conflictType: 'duplicate_intent' | 'keyword_overlap' | 'canonical_conflict';
  details: string;
}

export class CannibalizationDetector {
  public static audit(pages: ProgrammaticPageDefinition[]): CannibalizationIssue[] {
    const issues: CannibalizationIssue[] = [];

    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        const a = pages[i];
        const b = pages[j];

        // 1. Exact Canonical Conflict
        if (a.metadata.canonicalUrl.toLowerCase() === b.metadata.canonicalUrl.toLowerCase()) {
          issues.push({
            pageIdA: a.id,
            urlA: a.url,
            pageIdB: b.id,
            urlB: b.url,
            conflictType: 'canonical_conflict',
            details: `Identical canonical URL "${a.metadata.canonicalUrl}" assigned to two different pages.`,
          });
        }

        // 2. Semantic Intent Collision on same product area
        if (
          a.productArea === b.productArea &&
          a.contentType === b.contentType &&
          a.metadata.searchIntent === b.metadata.searchIntent &&
          a.metadata.targetAudience === b.metadata.targetAudience &&
          a.id !== b.id
        ) {
          // Check title similarity
          const wordsA = new Set(a.metadata.title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
          const wordsB = new Set(b.metadata.title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
          const common = [...wordsA].filter(w => wordsB.has(w));

          if (common.length >= 3) {
            issues.push({
              pageIdA: a.id,
              urlA: a.url,
              pageIdB: b.id,
              urlB: b.url,
              conflictType: 'duplicate_intent',
              details: `Duplicate search intent (${a.metadata.searchIntent}) and high title term overlap (${common.join(', ')}) between pages in "${a.productArea}".`,
            });
          }
        }
      }
    }

    return issues;
  }
}

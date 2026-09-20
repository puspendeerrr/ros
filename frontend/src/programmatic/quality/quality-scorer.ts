/**
 * Landing Page Quality Scorer (0 - 100)
 * Evaluates metadata completeness, schema depth, internal linking, and relationship coverage.
 */

import type { QualityScorecard, ProgrammaticSeoMetadata, InternalLinkReference } from '../types/programmatic.types.ts';
import type { SchemaNode } from '../../schema/types/schema.types.ts';

export class QualityScorer {
  public static evaluate(
    metadata: ProgrammaticSeoMetadata,
    schemaGraph: SchemaNode[],
    internalLinks: InternalLinkReference[],
    relationshipsCount: number
  ): QualityScorecard {
    const issues: string[] = [];
    let metadataScore = 0;
    let schemaScore = 0;
    let linkingScore = 0;
    let relationalScore = 0;

    // 1. Metadata Scoring (max 25)
    if (metadata.title && metadata.title.length >= 20 && metadata.title.length <= 70) {
      metadataScore += 10;
    } else {
      issues.push(`Title length (${metadata.title?.length || 0}) outside ideal range (20-70 chars).`);
    }

    if (metadata.description && metadata.description.length >= 50 && metadata.description.length <= 160) {
      metadataScore += 10;
    } else {
      issues.push(`Description length (${metadata.description?.length || 0}) outside ideal range (50-160 chars).`);
    }

    if (metadata.ogImage && metadata.canonicalUrl) {
      metadataScore += 5;
    }

    // 2. Schema Scoring (max 25)
    if (schemaGraph.length > 0) {
      schemaScore += 10;
      const hasWebPage = schemaGraph.some(n => n['@type'] === 'WebPage');
      const hasAppOrOrg = schemaGraph.some(n => n['@type'] === 'SoftwareApplication' || n['@type'] === 'Organization');
      if (hasWebPage) schemaScore += 7;
      if (hasAppOrOrg) schemaScore += 8;
    } else {
      issues.push('Schema graph is empty.');
    }

    // 3. Internal Linking Scoring (max 25)
    if (internalLinks.length >= 3) {
      linkingScore = 25;
    } else if (internalLinks.length >= 1) {
      linkingScore = 15;
      issues.push(`Low internal linking count (${internalLinks.length} links). Target is >= 3.`);
    } else {
      issues.push('Zero internal links generated.');
    }

    // 4. Relational Depth Scoring (max 25)
    if (relationshipsCount >= 3) {
      relationalScore = 25;
    } else if (relationshipsCount >= 1) {
      relationalScore = 15;
    } else {
      issues.push('Low entity relationship connectivity.');
    }

    const totalScore = metadataScore + schemaScore + linkingScore + relationalScore;

    return {
      totalScore,
      metadataScore,
      schemaScore,
      linkingScore,
      relationalScore,
      issues,
      passed: totalScore >= 75,
    };
  }
}

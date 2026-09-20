/**
 * Abstract Base Page Generator
 * Provides common template binding, schema generation, and quality assessment pipeline.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { ProgrammaticPageDefinition, PageTemplateType } from '../types/programmatic.types.ts';
import { PatternVersioning } from '../url/pattern-versioning.ts';
import { IntentMatrixEngine } from '../intent/intent-matrix.ts';
import { ProgrammaticSeoBuilder } from '../metadata/programmatic-seo.ts';
import { AnchorDiversityEngine } from '../links/anchor-diversity.ts';
import { QualityScorer } from '../quality/quality-scorer.ts';
import { ContentDependencyScorer } from '../quality/dependency-scorer.ts';
import { JsonLdPipeline } from '../../schema/jsonld/pipeline.ts';
import { getBreadcrumbs } from '../../utils/internalLinking.ts';
import type { BreadcrumbItem } from '../../utils/schema.ts';

export abstract class BasePageGenerator {
  public abstract readonly template: PageTemplateType;

  /**
   * Generates a fully bound ProgrammaticPageDefinition from a structured content item.
   */
  public generate(
    item: BaseContentItem,
    allItems: BaseContentItem[]
  ): ProgrammaticPageDefinition {
    // 1. Resolve canonical URL
    const url = PatternVersioning.resolveUrl(item.contentType, item.slug, {
      version: item.version || 'latest',
      category: item.categoryId || 'general',
    });

    // 2. Resolve Search Intent
    const searchIntent = IntentMatrixEngine.resolveIntent(item.contentType, item.intent);

    // 3. Build SEO Metadata
    const metadata = ProgrammaticSeoBuilder.build(item, url, searchIntent);

    // 4. Build Breadcrumbs (ensure absolute URLs for Schema.org compliance)
    const rawBreadcrumbs = getBreadcrumbs(url);
    const breadcrumbs: BreadcrumbItem[] = rawBreadcrumbs.map(b => ({
      name: b.name,
      url: b.url.startsWith('http') ? b.url : `${metadata.canonicalUrl.replace(url, '')}${b.url}`,
    }));

    // 5. Build Internal Links with Semantic Anchor Diversity
    const relatedItems = allItems.filter(i => {
      const isDirectRel = (item.seeAlsoIds || []).includes(i.id) ||
                          (item.prerequisiteIds || []).includes(i.id) ||
                          (item.continueLearningIds || []).includes(i.id);
      const isAreaPeer = i.productArea === item.productArea && i.id !== item.id;
      return isDirectRel || isAreaPeer;
    }).slice(0, 5);

    const internalLinks = AnchorDiversityEngine.bindInternalLinks(item, relatedItems);

    // 6. Generate Interconnected Schema Graph via Phase 4A JsonLdPipeline
    const pipeline = JsonLdPipeline.getInstance();
    const doc = pipeline.generatePageGraph({
      url: metadata.canonicalUrl,
      title: metadata.title,
      description: metadata.description,
      breadcrumbs,
    });
    const schemaGraph = doc['@graph'];

    // 7. Calculate Quality Score & Content Dependency Score
    const relationshipsCount = (item.seeAlsoIds?.length || 0) + (item.prerequisiteIds?.length || 0);
    const qualityScore = QualityScorer.evaluate(metadata, schemaGraph, internalLinks, relationshipsCount);
    const contentDependencyScore = ContentDependencyScorer.calculate(item, allItems);

    // 8. AI Citation & GEO Score (0 - 100)
    let aiCitationScore = 40; // baseline
    if (schemaGraph.length >= 4) aiCitationScore += 20;
    if (item.authorId) aiCitationScore += 15;
    if (item.contentType === 'faq' || item.summary) aiCitationScore += 15;
    if (contentDependencyScore >= 70) aiCitationScore += 10;
    aiCitationScore = Math.min(100, aiCitationScore);

    // 9. Determine Crawl Priority and Frequency
    let crawlPriority = 0.7;
    if (item.contentType === 'feature' || item.isFeatured) crawlPriority = 0.9;
    else if (item.contentType === 'comparison' || item.contentType === 'documentation') crawlPriority = 0.8;
    else if (item.contentType === 'glossary') crawlPriority = 0.6;

    const changefreq = crawlPriority >= 0.8 ? 'weekly' : 'monthly';

    // 10. Assign Lifecycle State
    const lifecycleState = qualityScore.passed ? 'published' : 'needs_improvement';

    return {
      id: item.id,
      slug: item.slug,
      url,
      patternVersion: PatternVersioning.CURRENT_PATTERN_VERSION,
      contentType: item.contentType,
      template: this.template,
      lifecycleState,
      crawlPriority,
      changefreq,
      searchWeight: item.searchScores?.popularityScore || 70,
      metadata,
      breadcrumbs,
      schemaGraph,
      internalLinks,
      qualityScore,
      contentDependencyScore,
      aiCitationScore,
      aiSummary: item.seo?.aiSummary || item.summary || item.description,
      productArea: item.productArea || 'platform',
    };
  }
}

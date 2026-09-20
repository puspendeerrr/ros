/**
 * Enterprise Search Engine Service
 * Provides in-memory indexing and fast multi-attribute filtering across
 * Features, Solutions, Industries, Guides, Docs, FAQs, Comparisons, and Glossary.
 */

import type { SearchableDocument, SearchFilterOptions, SearchEntityType } from '../config/search.config.js';
import { FEATURES_REGISTRY } from '../config/features.config.js';
import { SOLUTIONS_REGISTRY } from '../config/solutions.config.js';
import { INDUSTRIES_REGISTRY } from '../config/industries.config.js';
import { DOCUMENTATION_REGISTRY, GLOSSARY_REGISTRY, FAQ_CATEGORIES_REGISTRY, RESOURCES_CATALOG } from '../config/resources.config.js';
import { COMPARISONS_REGISTRY } from '../config/comparisons.config.js';

class SearchIndexService {
  private documents: SearchableDocument[] = [];
  private isIndexed = false;

  public ensureIndex(): void {
    if (this.isIndexed) return;

    const docs: SearchableDocument[] = [];

    // 1. Index Features
    Object.values(FEATURES_REGISTRY).forEach(f => {
      docs.push({
        id: `feature-${f.slug}`,
        title: f.name,
        description: f.summary,
        url: `/features/${f.slug}`,
        entityType: 'feature',
        category: f.category,
        tags: [f.category, 'feature', f.slug],
        keywords: [f.name.toLowerCase(), f.tagline.toLowerCase(), ...f.highlightCapabilities.map(c => c.toLowerCase())]
      });
    });

    // 2. Index Solutions
    Object.values(SOLUTIONS_REGISTRY).forEach(s => {
      docs.push({
        id: `solution-${s.slug}`,
        title: s.name,
        description: s.summary,
        url: `/solutions/${s.slug}`,
        entityType: 'solution',
        category: 'Solution',
        tags: ['solution', s.slug],
        keywords: [s.name.toLowerCase(), s.tagline.toLowerCase(), s.targetAudience.toLowerCase()]
      });
    });

    // 3. Index Industries
    Object.values(INDUSTRIES_REGISTRY).forEach(ind => {
      docs.push({
        id: `industry-${ind.slug}`,
        title: ind.name,
        description: ind.summary,
        url: `/industries/${ind.slug}`,
        entityType: 'industry',
        category: 'Industry',
        tags: ['industry', ind.slug],
        keywords: [ind.name.toLowerCase(), ind.tagline.toLowerCase(), ...ind.challengesSolved.map(c => c.toLowerCase())]
      });
    });

    // 4. Index Documentation
    Object.entries(DOCUMENTATION_REGISTRY).forEach(([catKey, cat]) => {
      cat.articles.forEach(art => {
        docs.push({
          id: `doc-${catKey}-${art.slug}`,
          title: art.title,
          description: art.summary,
          url: `/docs/${catKey}/${art.slug}`,
          entityType: 'documentation',
          category: cat.name,
          tags: ['documentation', catKey, art.slug],
          keywords: [art.title.toLowerCase(), art.summary.toLowerCase(), cat.name.toLowerCase()]
        });
      });
    });

    // 5. Index Resources (Guides, Whitepapers, Downloads)
    RESOURCES_CATALOG.forEach(r => {
      docs.push({
        id: `resource-${r.slug}`,
        title: r.title,
        description: r.summary,
        url: `/resources/${r.type}/${r.slug}`,
        entityType: r.type as SearchEntityType,
        category: r.category,
        tags: [...r.tags, r.type],
        keywords: [r.title.toLowerCase(), r.summary.toLowerCase(), ...r.tags]
      });
    });

    // 6. Index Comparisons
    Object.values(COMPARISONS_REGISTRY).forEach(c => {
      docs.push({
        id: `compare-${c.slug}`,
        title: c.title,
        description: c.summary,
        url: `/compare/${c.slug}`,
        entityType: 'comparison',
        category: 'Commercial Comparison',
        tags: ['comparison', c.slug],
        keywords: [c.title.toLowerCase(), c.competitorName.toLowerCase(), c.whySwitchSummary.toLowerCase()]
      });
    });

    // 7. Index Glossary
    Object.entries(GLOSSARY_REGISTRY).forEach(([slug, g]) => {
      docs.push({
        id: `glossary-${slug}`,
        title: g.term,
        description: g.definition,
        url: `/resources/glossary/${slug}`,
        entityType: 'glossary',
        category: g.category,
        tags: ['glossary', g.category.toLowerCase()],
        keywords: [g.term.toLowerCase(), g.definition.toLowerCase()]
      });
    });

    // 8. Index FAQs
    Object.entries(FAQ_CATEGORIES_REGISTRY).forEach(([catKey, cat]) => {
      cat.faqs.forEach((faq, idx) => {
        docs.push({
          id: `faq-${catKey}-${idx}`,
          title: faq.q,
          description: faq.a,
          url: `/resources/faqs/${catKey}`,
          entityType: 'faq',
          category: cat.name,
          tags: ['faq', catKey],
          keywords: [faq.q.toLowerCase(), faq.a.toLowerCase()]
        });
      });
    });

    this.documents = docs;
    this.isIndexed = true;
  }

  public search(options: SearchFilterOptions): SearchableDocument[] {
    this.ensureIndex();

    const query = options.query.trim().toLowerCase();
    if (!query) {
      return [];
    }

    const tokens = query.split(/\s+/).filter(Boolean);

    let results = this.documents.filter(doc => {
      // Filter by entityTypes if provided
      if (options.entityTypes && options.entityTypes.length > 0) {
        if (!options.entityTypes.includes(doc.entityType)) {
          return false;
        }
      }

      // Filter by category if provided
      if (options.category && doc.category.toLowerCase() !== options.category.toLowerCase()) {
        return false;
      }

      // Keyword and title scoring
      const titleMatch = tokens.every(t => doc.title.toLowerCase().includes(t));
      const descMatch = tokens.every(t => doc.description.toLowerCase().includes(t));
      const kwMatch = tokens.some(t => doc.keywords.some(k => k.includes(t)));
      const tagMatch = tokens.some(t => doc.tags.some(tag => tag.toLowerCase().includes(t)));

      return titleMatch || descMatch || kwMatch || tagMatch;
    });

    // Prioritize title matches
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query) ? 1 : 0;
      const bTitle = b.title.toLowerCase().includes(query) ? 1 : 0;
      return bTitle - aTitle;
    });

    if (options.limit && options.limit > 0) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  public getAllDocuments(): SearchableDocument[] {
    this.ensureIndex();
    return [...this.documents];
  }
}

export const searchService = new SearchIndexService();

/**
 * Internal Linking Graph Engine
 * Resolves graph-aware relationships:
 * - Related Features
 * - Related Solutions & Industries
 * - Recommended Reading
 * - Popular Content
 * - Recently Updated
 * - Related FAQs
 * - Hierarchical Breadcrumbs
 * - Next / Previous Pagination
 */

import { FEATURES_REGISTRY, type FeatureItem } from '../config/features.config.ts';
import { SOLUTIONS_REGISTRY, type SolutionItem } from '../config/solutions.config.ts';
import { INDUSTRIES_REGISTRY, type IndustryItem } from '../config/industries.config.ts';
import { RESOURCES_CATALOG, type ResourceItem, DOCUMENTATION_REGISTRY } from '../config/resources.config.ts';
import { COMPARISONS_REGISTRY } from '../config/comparisons.config.ts';

export interface BreadcrumbNode {
  name: string;
  url: string;
}

/**
 * 1. Breadcrumb Chain Constructor
 */
export function getBreadcrumbs(pathname: string): BreadcrumbNode[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbNode[] = [{ name: 'Home', url: '/' }];

  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Try finding human-readable names
    let label = segment.replace(/-/g, ' ');
    label = label.charAt(0).toUpperCase() + label.slice(1);

    if (FEATURES_REGISTRY[segment]) {
      label = FEATURES_REGISTRY[segment].name;
    } else if (SOLUTIONS_REGISTRY[segment]) {
      label = SOLUTIONS_REGISTRY[segment].name;
    } else if (INDUSTRIES_REGISTRY[segment]) {
      label = INDUSTRIES_REGISTRY[segment].name;
    } else if (COMPARISONS_REGISTRY[segment]) {
      label = COMPARISONS_REGISTRY[segment].competitorName;
    } else if (segment === 'features') {
      label = 'Features';
    } else if (segment === 'solutions') {
      label = 'Solutions';
    } else if (segment === 'industries') {
      label = 'Industries';
    } else if (segment === 'resources') {
      label = 'Resources';
    } else if (segment === 'docs') {
      label = 'Documentation';
    } else if (segment === 'company') {
      label = 'Company';
    } else if (segment === 'legal') {
      label = 'Legal';
    } else if (segment === 'compare') {
      label = 'Comparisons';
    }

    breadcrumbs.push({ name: label, url: currentPath });
  }

  return breadcrumbs;
}

/**
 * 2. Related Features Provider
 */
export function getRelatedFeatures(currentSlug: string, limit = 3): FeatureItem[] {
  const current = FEATURES_REGISTRY[currentSlug];
  if (!current) {
    return Object.values(FEATURES_REGISTRY).slice(0, limit);
  }

  const explicitRelated = current.relatedFeatureSlugs
    .map(slug => FEATURES_REGISTRY[slug])
    .filter(Boolean);

  if (explicitRelated.length >= limit) {
    return explicitRelated.slice(0, limit);
  }

  // Fallback: features from the same category
  const categoryRelated = Object.values(FEATURES_REGISTRY).filter(
    f => f.category === current.category && f.slug !== currentSlug
  );

  const combined = Array.from(new Set([...explicitRelated, ...categoryRelated]));
  return combined.slice(0, limit);
}

/**
 * 3. Related Industries Provider
 */
export function getRelatedIndustries(currentSlug: string, limit = 3): IndustryItem[] {
  const current = INDUSTRIES_REGISTRY[currentSlug];
  if (!current) {
    return Object.values(INDUSTRIES_REGISTRY).slice(0, limit);
  }

  return Object.values(INDUSTRIES_REGISTRY)
    .filter(ind => ind.slug !== currentSlug)
    .slice(0, limit);
}

/**
 * 4. Related Solutions Provider
 */
export function getRelatedSolutions(currentSlug: string, limit = 3): SolutionItem[] {
  return Object.values(SOLUTIONS_REGISTRY)
    .filter(sol => sol.slug !== currentSlug)
    .slice(0, limit);
}

/**
 * 5. Recommended Reading / Guides Provider
 */
export function getRecommendedReading(tags?: string[], limit = 3): ResourceItem[] {
  if (!tags || tags.length === 0) {
    return RESOURCES_CATALOG.slice(0, limit);
  }

  const matched = RESOURCES_CATALOG.filter(res =>
    res.tags.some(t => tags.includes(t))
  );

  if (matched.length >= limit) {
    return matched.slice(0, limit);
  }

  const fallbacks = RESOURCES_CATALOG.filter(res => !matched.includes(res));
  return [...matched, ...fallbacks].slice(0, limit);
}

/**
 * 6. Popular Content Provider
 */
export function getPopularContent(limit = 4): Array<{ title: string; url: string; category: string }> {
  return [
    { title: 'Dynamic QR Stand Ecosystem', url: '/features/qr-menu', category: 'Feature' },
    { title: 'Commission-Free Ordering Playbook', url: '/resources/guides/leaving-aggregators-behind', category: 'Guide' },
    { title: 'Restaurant OS vs. Paper Menus', url: '/compare/vs-paper-menus', category: 'Comparison' },
    { title: 'Specialty Cafes & Coffee Solutions', url: '/industries/cafes', category: 'Industry' },
  ].slice(0, limit);
}

/**
 * 7. Recently Updated Provider
 */
export function getRecentlyUpdated(limit = 4): Array<{ title: string; url: string; date: string; type: string }> {
  return [
    { title: 'Platform Changelog v2.0.4', url: '/changelog', date: '2026-09-20', type: 'Release' },
    { title: 'Recipe-Based Inventory Architecture', url: '/features/inventory', date: '2026-09-18', type: 'Feature' },
    { title: 'The Blueprint for Transitioning to Direct Dining', url: '/resources/guides/leaving-aggregators-behind', date: '2026-09-15', type: 'Guide' },
    { title: '5-Minute Restaurant Quick Start', url: '/docs/getting-started/quick-start-guide', date: '2026-09-10', type: 'Docs' }
  ].slice(0, limit);
}

/**
 * 8. Related FAQs Provider
 */
export function getRelatedFAQs(contextSlug: string): Array<{ question: string; answer: string }> {
  if (FEATURES_REGISTRY[contextSlug]) {
    return FEATURES_REGISTRY[contextSlug].faqs;
  }
  if (SOLUTIONS_REGISTRY[contextSlug]) {
    return SOLUTIONS_REGISTRY[contextSlug].faqs;
  }
  if (INDUSTRIES_REGISTRY[contextSlug]) {
    return INDUSTRIES_REGISTRY[contextSlug].faqs;
  }
  if (COMPARISONS_REGISTRY[contextSlug]) {
    return COMPARISONS_REGISTRY[contextSlug].faqs;
  }

  // General fallback FAQs
  return [
    {
      question: 'Is Restaurant OS really 0% commission?',
      answer: 'Yes. We charge 0% commission on orders and digital menu views. Restaurants retain 100% of their operational sales.'
    },
    {
      question: 'Do customers need to install an app?',
      answer: 'No. Scanning the table QR stand opens the menu instantly in any default smartphone web browser without app downloads.'
    }
  ];
}

/**
 * 9. Adjacent Documentation Pagination Provider (Prev/Next)
 */
export function getAdjacentDocs(categorySlug: string, articleSlug: string): {
  previous: { title: string; url: string } | null;
  next: { title: string; url: string } | null;
} {
  const category = DOCUMENTATION_REGISTRY[categorySlug];
  if (!category) return { previous: null, next: null };

  const articles = [...category.articles].sort((a, b) => a.order - b.order);
  const currentIndex = articles.findIndex(a => a.slug === articleSlug);

  if (currentIndex === -1) return { previous: null, next: null };

  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return {
    previous: prevArticle ? { title: prevArticle.title, url: `/docs/${categorySlug}/${prevArticle.slug}` } : null,
    next: nextArticle ? { title: nextArticle.title, url: `/docs/${categorySlug}/${nextArticle.slug}` } : null
  };
}

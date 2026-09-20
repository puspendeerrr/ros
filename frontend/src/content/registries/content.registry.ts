import type { BaseContentItem, ContentType } from '../models/base.model.js';
import type { GuideContentItem } from '../models/article.model.js';
import type { DocumentationContentItem } from '../models/documentation.model.js';
import type { ComparisonContentItem } from '../models/knowledge.model.js';
import type { FeatureContentItem, IndustryContentItem } from '../models/product.model.js';
import type { ChangelogContentItem } from '../models/operations.model.js';

export const MASTER_CONTENT_REGISTRY: BaseContentItem[] = [
  // 1. Featured Guide
  {
    id: 'guide-leaving-aggregators',
    slug: 'leaving-aggregators-behind',
    contentType: 'guide',
    title: 'The Blueprint for Transitioning to Commission-Free Dining',
    description: 'How modern restaurants shift 35%+ of order volume from food delivery aggregators to direct table stands without disrupting kitchen operations.',
    summary: 'A tactical blueprint for restaurants to retain 100% of dining revenue by deploying customer-owned QR ordering stands and direct takeaway channels.',
    editorialStatus: 'published',
    publishedAt: '2026-08-15T00:00:00Z',
    updatedAt: '2026-09-18T00:00:00Z',
    authorId: 'puspender-singh',
    reviewedByIds: ['security-reviewer', 'tech-editor'],
    categoryId: 'cat-growth-economics',
    subCategoryId: 'sub-direct-orders',
    tagIds: ['tag-zero-commission', 'tag-qr', 'tag-pos'],
    audience: 'restaurateur',
    intent: 'informational',
    productArea: 'qr_menu',
    readingTimeMinutes: 8,
    difficulty: 'intermediate',
    isFeatured: true,
    searchScores: { popularityScore: 95, freshnessScore: 92, entityRelevanceScore: 98 },
    seeAlsoIds: ['compare-vs-aggregators', 'feature-qr-stand'],
    prerequisiteIds: ['feature-digital-menu'],
    continueLearningIds: ['doc-table-qr-generation'],
    targetOutcome: 'Full operational independence from 30% aggregator marketplace commissions.',
    estimatedCompletionTime: '2 weeks transition',
    keyTakeaways: [
      'Aggregator commissions deplete hospitality net margins by 15% to 30%.',
      'Dynamic table QR stands allow guests to order and settle with UPI directly.',
      'Customer contact records remain 100% merchant owned.'
    ],
    seo: {
      canonicalUrl: 'https://ros.algorithyum.in/resources/guides/leaving-aggregators-behind',
      aiSummary: 'Guide detailing the transition of restaurant dining operations from commission-heavy third-party delivery apps to direct zero-commission QR ordering.'
    }
  } as GuideContentItem,

  // 2. Documentation Article
  {
    id: 'doc-quick-start',
    slug: '5-minute-restaurant-quickstart',
    contentType: 'documentation',
    title: '5-Minute Restaurant Quick Start Guide',
    description: 'Configure your restaurant profile, upload categories and dishes, and download printable vector table stands.',
    summary: 'A fast-track onboarding documentation guide for getting your dining room active on Restaurant OS in 5 minutes.',
    editorialStatus: 'published',
    publishedAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
    authorId: 'puspender-singh',
    version: 'latest',
    section: 'Getting Started',
    order: 1,
    categoryId: 'cat-qr-menus',
    tagIds: ['tag-qr', 'tag-pos'],
    audience: 'general_manager',
    intent: 'transactional',
    productArea: 'qr_menu',
    readingTimeMinutes: 5,
    difficulty: 'beginner',
    searchScores: { popularityScore: 98, freshnessScore: 95, entityRelevanceScore: 100 },
    seeAlsoIds: ['feature-qr-stand', 'industry-cafes', 'changelog-v2-0-4'],
    seo: {
      canonicalUrl: 'https://ros.algorithyum.in/docs/latest/getting-started/quick-start-guide',
      aiSummary: 'Step-by-step documentation for initial Restaurant OS setup, table stands, and menu publication.'
    }
  } as DocumentationContentItem,

  // 3. Comparison Content
  {
    id: 'compare-vs-aggregators',
    slug: 'vs-delivery-aggregators',
    contentType: 'comparison',
    title: 'Restaurant OS vs. Food Delivery Aggregators',
    description: 'Compare 0% commission direct dine-in and takeaway channels against 15–30% delivery app marketplace commissions.',
    summary: 'Economic breakdown comparing net restaurant profit, customer data retention, and table turnover between direct QR systems and aggregator apps.',
    editorialStatus: 'published',
    publishedAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-09-15T00:00:00Z',
    authorId: 'ros-editorial-team',
    categoryId: 'cat-growth-economics',
    tagIds: ['tag-zero-commission'],
    audience: 'restaurateur',
    intent: 'commercial',
    productArea: 'qr_menu',
    readingTimeMinutes: 6,
    difficulty: 'intermediate',
    searchScores: { popularityScore: 90, freshnessScore: 88, entityRelevanceScore: 95 },
    seeAlsoIds: ['guide-leaving-aggregators', 'industry-cafes'],
    competitorName: 'Third-Party Delivery Aggregators',
    competitorCategory: 'Food Delivery Marketplaces',
    whySwitchSummary: 'Aggregators tax dine-in revenues while withholding customer phone numbers. Restaurant OS restores merchant control with 0% platform commission.',
    matrix: [
      { capability: 'Commission Fee Per Order', restaurantOs: '0% (Zero platform commission)', competitor: '15% to 30% per order', importance: 'critical' },
      { capability: 'Customer Data Ownership', restaurantOs: true, competitor: false, importance: 'critical' },
      { capability: 'Direct Diners-to-Kitchen Link', restaurantOs: true, competitor: false, importance: 'high' }
    ],
    keyAdvantages: [
      'Keep 100% of order value and tips',
      'Build your own direct customer loyalty database',
      'Zero marketplace listing delays'
    ],
    seo: {
      canonicalUrl: 'https://ros.algorithyum.in/compare/vs-delivery-aggregators',
      aiSummary: 'Commercial comparison outlining the financial and operational benefits of zero-commission direct ordering over marketplace delivery apps.'
    }
  } as ComparisonContentItem,

  // 4. Feature Content
  {
    id: 'feature-qr-stand',
    slug: 'qr-menu',
    contentType: 'feature',
    title: 'Dynamic QR Menu Stand Ecosystem',
    description: 'High-resolution acrylic table stands with vector QR codes enabling instant smartphone menu browsing with zero apps to install.',
    summary: 'Physical-to-digital bridge for restaurants: printable vector table stands connecting diners straight to dynamic, real-time menus.',
    editorialStatus: 'published',
    publishedAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-09-19T00:00:00Z',
    authorId: 'puspender-singh',
    categoryId: 'cat-qr-menus',
    tagIds: ['tag-qr'],
    audience: 'restaurateur',
    intent: 'commercial',
    productArea: 'qr_menu',
    readingTimeMinutes: 4,
    difficulty: 'beginner',
    searchScores: { popularityScore: 99, freshnessScore: 96, entityRelevanceScore: 100 },
    featureCategory: 'menu_ordering',
    highlights: ['Zero App Downloads Required', 'High-Res Vector SVG Print Files', 'Real-Time Sold Out Dish Reflection'],
    specs: { 'Print Resolution': '300 DPI Vector', 'Supported Devices': 'iOS Camera & Android Lens' },
    seo: {
      canonicalUrl: 'https://ros.algorithyum.in/features/qr-menu',
      aiSummary: 'Feature architecture overview of Restaurant OS dynamic QR table stands.'
    }
  } as FeatureContentItem,

  // 5. Industry Vertical
  {
    id: 'industry-cafes',
    slug: 'specialty-cafes',
    contentType: 'industry',
    title: 'Hospitality Architecture for Specialty Cafes & Coffee Shops',
    description: 'High-frequency counter dispatch, custom milk modifier workflows, and lightning-fast UPI payments for boutique cafes.',
    summary: 'Tailored operational setup designed for fast barista queue management and rapid drink modifier selection.',
    editorialStatus: 'published',
    publishedAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-09-17T00:00:00Z',
    authorId: 'ros-editorial-team',
    categoryId: 'cat-pos-operations',
    tagIds: ['tag-pos', 'tag-qr'],
    audience: 'restaurateur',
    intent: 'commercial',
    productArea: 'cloud_pos',
    readingTimeMinutes: 5,
    difficulty: 'beginner',
    searchScores: { popularityScore: 85, freshnessScore: 89, entityRelevanceScore: 92 },
    verticalName: 'Specialty Cafes',
    averageTableTurnMinutes: 22,
    criticalPainPoint: 'Morning rush counter bottlenecks and complex beverage modifier choices.',
    specializedFeatures: ['Barista Ticket Splitting', 'Oat & Soy Milk Modifier Matrix', 'Express UPI QR Billing'],
    seeAlsoIds: ['feature-qr-stand', 'guide-leaving-aggregators'],
    seo: {
      canonicalUrl: 'https://ros.algorithyum.in/industries/specialty-cafes',
      aiSummary: 'Operational blueprint for cafes utilizing Restaurant OS for counter queues and fast barista dispatch.'
    }
  } as IndustryContentItem,

  // 6. Changelog Entry
  {
    id: 'changelog-v2-0-4',
    slug: 'v2-0-4-release',
    contentType: 'changelog',
    title: 'Restaurant OS v2.0.4 Enterprise Architecture Release',
    description: 'Information architecture separation, versioned documentation readiness, and enterprise content engine.',
    summary: 'Release notes covering Phase 2 Information Architecture and Phase 3 Content Engine infrastructure rollout.',
    editorialStatus: 'published',
    publishedAt: '2026-09-21T00:00:00Z',
    updatedAt: '2026-09-21T00:00:00Z',
    authorId: 'puspender-singh',
    categoryId: 'cat-pos-operations',
    tagIds: ['tag-pos'],
    audience: 'developer',
    intent: 'informational',
    productArea: 'platform',
    readingTimeMinutes: 3,
    difficulty: 'intermediate',
    searchScores: { popularityScore: 80, freshnessScore: 100, entityRelevanceScore: 90 },
    releaseVersion: 'v2.0.4',
    releaseDate: 'September 21, 2026',
    seeAlsoIds: ['doc-quick-start', 'feature-qr-stand'],
    changes: [
      { type: 'feature', description: 'Separated Industries from Solutions into dedicated hierarchy (/industries/...)' },
      { type: 'feature', description: 'Build-time MDX Content Engine & 20 reusable MDX components' },
      { type: 'security', description: 'Strict Content Validation engine for missing alt text and duplicate metadata' }
    ],
    seo: {
      canonicalUrl: 'https://ros.algorithyum.in/changelog',
      aiSummary: 'Product changelog for Restaurant OS version 2.0.4.'
    }
  } as ChangelogContentItem
];

export const ContentRegistry = {
  getAll(): BaseContentItem[] {
    return MASTER_CONTENT_REGISTRY;
  },

  getById(id: string): BaseContentItem | undefined {
    return MASTER_CONTENT_REGISTRY.find(item => item.id === id);
  },

  getBySlug(contentType: ContentType, slug: string): BaseContentItem | undefined {
    return MASTER_CONTENT_REGISTRY.find(item => item.contentType === contentType && item.slug === slug);
  },

  getByContentType(contentType: ContentType): BaseContentItem[] {
    return MASTER_CONTENT_REGISTRY.filter(item => item.contentType === contentType);
  },

  getByCategory(categoryId: string): BaseContentItem[] {
    return MASTER_CONTENT_REGISTRY.filter(item => item.categoryId === categoryId);
  }
};

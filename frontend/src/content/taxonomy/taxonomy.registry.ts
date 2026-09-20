import type { TaxonomyCatalog } from './taxonomy.model.js';

export const TAXONOMY_REGISTRY: TaxonomyCatalog = {
  categories: [
    {
      id: 'cat-qr-menus',
      slug: 'qr-menus',
      name: 'Dynamic QR & Digital Menus',
      description: 'Zero-touch digital menu display, table QR stand generation, and live dish catalog synchronization.',
      subCategories: [
        { id: 'sub-table-stands', slug: 'table-stands', parentCategoryId: 'cat-qr-menus', name: 'Table Stand Ecosystem', description: 'Printable vector assets, acrylic holders, and scan optimization.' },
        { id: 'sub-realtime-sync', slug: 'realtime-sync', parentCategoryId: 'cat-qr-menus', name: 'Real-Time Sync', description: 'Sold-out switches, instantaneous price updates, and category badges.' }
      ]
    },
    {
      id: 'cat-pos-operations',
      slug: 'pos-and-operations',
      name: 'Cloud POS & Kitchen Operations',
      description: 'Order routing, kitchen display coordination, split billing, and thermal printing architecture.',
      subCategories: [
        { id: 'sub-kds', slug: 'kds', parentCategoryId: 'cat-pos-operations', name: 'Kitchen Display Systems', description: 'Bump screen dispatch, chef station routing, and ticket aging.' },
        { id: 'sub-billing', slug: 'billing', parentCategoryId: 'cat-pos-operations', name: 'Billing & GST Compliance', description: 'Dual GST splitting, service charges, and UPI dynamic payments.' }
      ]
    },
    {
      id: 'cat-growth-economics',
      slug: 'growth-and-economics',
      name: 'Hospitality Growth & Economics',
      description: 'Transitioning away from food aggregator commissions, customer retention, and table turnover optimization.',
      subCategories: [
        { id: 'sub-direct-orders', slug: 'direct-ordering', parentCategoryId: 'cat-growth-economics', name: 'Direct Ordering Channels', description: 'Commission-free takeaway, room delivery, and website orders.' }
      ]
    }
  ],
  tags: [
    { id: 'tag-qr', slug: 'qr-code', name: 'QR Code', colorHex: '#F97316', description: 'Dynamic vector QR technology.' },
    { id: 'tag-pos', slug: 'cloud-pos', name: 'Cloud POS', colorHex: '#0284C7', description: 'Cloud and offline-first POS systems.' },
    { id: 'tag-kds', slug: 'kds', name: 'KDS', colorHex: '#10B981', description: 'Kitchen display systems and dispatch.' },
    { id: 'tag-zero-commission', slug: 'zero-commission', name: 'Zero Commission', colorHex: '#8B5CF6', description: '0% platform intermediary commission models.' },
    { id: 'tag-gst', slug: 'gst-compliance', name: 'GST Compliance', colorHex: '#EAB308', description: 'Indian CGST, SGST, and tax invoice compliance.' },
    { id: 'tag-offline', slug: 'offline-mode', name: 'Offline Mode', colorHex: '#64748B', description: 'Local-first caching and network drop resilience.' }
  ],
  topics: [
    {
      id: 'topic-contactless',
      slug: 'contactless-dining-architecture',
      name: 'Contactless Dining Architecture',
      description: 'The end-to-end blueprint for smartphone-based order placement and bill settlement.',
      pillarArticleSlug: 'the-future-of-dining-contactless-systems',
      clusterSlugs: ['qr-menu-generation-guide', 'eliminating-paper-menu-invoices', 'instant-out-of-stock-management']
    }
  ],
  collections: [
    {
      id: 'coll-startup-pack',
      slug: 'restaurant-launch-pack',
      name: 'New Restaurant Tech Stack Launch Pack',
      description: 'Essential manuals, QR setup guides, and operational playbooks for opening week.',
      curatedContentIds: ['guide-zero-commission-transition', 'doc-quick-start', 'pos-supported-hardware']
    }
  ],
  series: [
    {
      id: 'series-commission-free',
      slug: 'leaving-aggregators-masterclass',
      name: 'Leaving Aggregators: The 4-Part Masterclass',
      description: 'A structured blueprint for transitioning dine-in and takeaway volume to 100% merchant-owned channels.',
      orderedContentSlugs: ['the-real-cost-of-30-percent-commissions', 'setting-up-merchant-upi-channels', 'driving-qr-table-adoption', 'retaining-repeat-diners'],
      estimatedTotalHours: 2.5
    }
  ],
  learningPaths: [
    {
      id: 'path-pos-admin',
      slug: 'pos-administrator-certification',
      name: 'POS & Kitchen Display Administrator Track',
      description: 'Step-by-step master track for setting up floor stations, printers, and multi-user roles.',
      targetAudience: 'general_manager',
      steps: [
        { stepIndex: 1, contentId: 'doc-quick-start', isRequired: true },
        { stepIndex: 2, contentId: 'doc-hardware-setup', isRequired: true },
        { stepIndex: 3, contentId: 'doc-kds-station-routing', isRequired: true }
      ]
    }
  ],
  audiences: [
    { id: 'restaurateur', name: 'Independent Restaurateurs', description: 'Single bistros, independent eateries, and boutique culinary ventures.' },
    { id: 'franchise_operator', name: 'Franchise & Multi-Unit Operators', description: 'Regional and national multi-branch restaurant brands.' },
    { id: 'general_manager', name: 'General Managers & Shift Leads', description: 'Floor managers coordinating waitstaff and billing terminals.' },
    { id: 'chef', name: 'Head Chefs & Kitchen Directors', description: 'Culinary leaders operating kitchen display tickets and recipe stock.' },
    { id: 'developer', name: 'Engineers & System Integrators', description: 'Technical teams integrating custom webhooks and REST APIs.' },
    { id: 'investor', name: 'Hospitality Investors & Founders', description: 'Stakeholders evaluating operational unit economics.' },
    { id: 'all', name: 'All Hospitality Professionals', description: 'Universal content applicable to all hospitality stakeholders.' }
  ],
  intents: [
    { id: 'informational', name: 'Informational', description: 'Educational guides, concepts, and architectural documentation.' },
    { id: 'commercial', name: 'Commercial', description: 'Comparison pages, ROI benchmarks, and capability matrices.' },
    { id: 'transactional', name: 'Transactional', description: 'Sign-up triggers, downloadable stands, and template assets.' },
    { id: 'navigational', name: 'Navigational', description: 'Topic directories, sitemaps, and index pages.' }
  ],
  productAreas: [
    { id: 'qr_menu', name: 'Dynamic QR Menu Stand', description: 'Smartphone QR menus and table stands.' },
    { id: 'cloud_pos', name: 'Cloud POS Terminal', description: 'Multi-device order input and billing.' },
    { id: 'kds', name: 'Kitchen Display System', description: 'Cook station ticket visualization.' },
    { id: 'multi_branch', name: 'Multi-Branch Master Hub', description: 'Chain menu control and multi-outlet analytics.' },
    { id: 'billing', name: 'Split Billing & GST', description: 'Invoicing, tax splitting, and UPI settlement.' },
    { id: 'crm', name: 'Customer Retention & CRM', description: 'Customer dine telemetry and loyalty.' },
    { id: 'analytics', name: 'Performance Analytics', description: 'Shift revenue, item velocity, and sales reports.' },
    { id: 'platform', name: 'Platform & Developer API', description: 'REST APIs, webhooks, and security.' }
  ]
};

export const TaxonomyService = {
  getCategoryById(id: string) {
    return TAXONOMY_REGISTRY.categories.find(c => c.id === id);
  },
  getTagById(id: string) {
    return TAXONOMY_REGISTRY.tags.find(t => t.id === id);
  },
  getSeriesById(id: string) {
    return TAXONOMY_REGISTRY.series.find(s => s.id === id);
  },
  getLearningPathById(id: string) {
    return TAXONOMY_REGISTRY.learningPaths.find(p => p.id === id);
  },
  getAllTaxonomy(): TaxonomyCatalog {
    return TAXONOMY_REGISTRY;
  }
};

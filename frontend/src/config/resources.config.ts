/**
 * Resource Center Information Architecture & Registry
 * Scalable architecture for:
 * - Documentation (with versioning support)
 * - Blog & Knowledge Hub
 * - Guides & Playbooks
 * - Tutorials
 * - Case Studies
 * - Whitepapers
 * - Printable Downloads
 * - Glossary
 * - FAQ Library
 * - Changelog & Roadmap
 * - API Reference
 */

export interface ResourceItem {
  slug: string;
  type: 'blog' | 'guide' | 'tutorial' | 'case-study' | 'whitepaper' | 'download' | 'glossary' | 'faq' | 'doc';
  title: string;
  summary: string;
  category: string;
  readingTime?: string;
  lastUpdated?: string;
  author?: string;
  tags: string[];
  externalOrFilePath?: string;
}

export interface DocCategory {
  id: string;
  name: string;
  description: string;
  articles: Array<{
    slug: string;
    title: string;
    summary: string;
    order: number;
  }>;
}

export const DOC_VERSIONS = ['latest', 'v1'] as const;
export type DocVersion = typeof DOC_VERSIONS[number];

export const DOCUMENTATION_REGISTRY: Record<string, DocCategory> = {
  'getting-started': {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Initial restaurant profile setup, account registration, and digital menu publishing.',
    articles: [
      { slug: 'quick-start-guide', title: '5-Minute Restaurant Quick Start', summary: 'Set up your restaurant card, upload dishes, and download table stands.', order: 1 },
      { slug: 'generating-table-qr-codes', title: 'Generating Table QR Codes', summary: 'Learn how to generate and print unique table stand vector assets.', order: 2 },
      { slug: 'menu-builder-fundamentals', title: 'Menu Builder Fundamentals', summary: 'Organize categories, dietary badges, modifiers, and dish photography.', order: 3 }
    ]
  },
  'pos-and-hardware': {
    id: 'pos-and-hardware',
    name: 'Point of Sale & Devices',
    description: 'Hardware compatibility, tablet setup, and offline operations.',
    articles: [
      { slug: 'supported-devices-and-printers', title: 'Supported Devices & POS Tablets', summary: 'Operating POS on iPads, Android tablets, laptops, and thermal printers.', order: 1 },
      { slug: 'configuring-offline-mode', title: 'Offline Fallback & Cache Architecture', summary: 'How offline order caching ensures zero downtime during network drops.', order: 2 }
    ]
  },
  'kitchen-workflows': {
    id: 'kitchen-workflows',
    name: 'Kitchen Display & Dispatch',
    description: 'Chef stations, ticket coordination, and bump screen operations.',
    articles: [
      { slug: 'setting-up-kds-stations', title: 'Setting Up Kitchen Display Stations', summary: 'Route bar tickets and kitchen tickets to distinct screens simultaneously.', order: 1 }
    ]
  },
  'integrations-and-api': {
    id: 'integrations-and-api',
    name: 'Integrations & Webhooks',
    description: 'Connecting third-party accounting, UPI payment gateways, and custom webhooks.',
    articles: [
      { slug: 'api-authentication-tokens', title: 'REST API Authentication & Secrets', summary: 'Authenticate external services using scoped merchant API keys.', order: 1 },
      { slug: 'webhook-events-reference', title: 'Webhook Event Payload Reference', summary: 'Listen for real-time order.created, bill.settled, and menu.updated events.', order: 2 }
    ]
  }
};

export const GLOSSARY_REGISTRY: Record<string, { term: string; definition: string; category: string }> = {
  'contactless-dining': {
    term: 'Contactless Dining',
    definition: 'A hospitality service model where diners view menus, place orders, and settle bills using their personal smartphones without physical interaction.',
    category: 'Industry Concepts'
  },
  'dynamic-qr-code': {
    term: 'Dynamic QR Code',
    definition: 'A vector QR code with an editable destination URL, allowing menu modifications without reprinting physical table stands.',
    category: 'Technology'
  },
  'kds': {
    term: 'Kitchen Display System (KDS)',
    definition: 'A digital screen in the kitchen replacing paper tickets to display active orders, preparation times, and dish modifications in real-time.',
    category: 'Operations'
  },
  'table-turnover': {
    term: 'Table Turnover Rate',
    definition: 'The speed at which a dining table is occupied, served, settled, and prepared for the next party during a dining shift.',
    category: 'Economics'
  },
  'zero-commission': {
    term: 'Zero-Commission SaaS',
    definition: 'A software model charging 0% intermediary platform commission on merchant orders and transactions, allowing restaurants to retain 100% of revenue.',
    category: 'Business Models'
  }
};

export const FAQ_CATEGORIES_REGISTRY: Record<string, { name: string; faqs: Array<{ q: string; a: string }> }> = {
  'general': {
    name: 'General Platform',
    faqs: [
      { q: 'What makes Restaurant OS different from food delivery aggregators?', a: 'Aggregators take 15% to 30% cuts and hide customer relationships. Restaurant OS gives you your own direct digital operating system with 0% commission.' },
      { q: 'Is there a setup or onboarding fee?', a: 'None. Restaurant OS is 100% free to start during launch with zero hidden transaction costs.' }
    ]
  },
  'qr-menus': {
    name: 'QR Codes & Menus',
    faqs: [
      { q: 'What file formats can I download for table QR codes?', a: 'You can download high-resolution vector SVG (ideal for commercial graphic printing) and PNG format.' },
      { q: 'Can customers order without scanning a QR code?', a: 'Yes, customers can access your menu directly through your public restaurant website URL.' }
    ]
  },
  'billing-and-payments': {
    name: 'Billing & Payments',
    faqs: [
      { q: 'How do customers pay their bills?', a: 'Guests can pay directly via dynamic UPI QR codes displayed on their phones or thermal bills, or via cash/card at the counter.' },
      { q: 'Is GST tax calculation supported?', a: 'Yes. Full configurable CGST, SGST, and service charge rates are supported.' }
    ]
  }
};

export const RESOURCES_CATALOG: ResourceItem[] = [
  {
    slug: 'leaving-aggregators-behind',
    type: 'guide',
    title: 'The Blueprint for Transitioning to Commission-Free Dining',
    summary: 'A step-by-step roadmap for cafes and restaurants to reclaim direct patron ordering and eliminate aggregator take rates.',
    category: 'Hospitality Strategy',
    readingTime: '7 min read',
    lastUpdated: '2026-09-15',
    author: 'Restaurant OS Architecture Team',
    tags: ['commission-free', 'hospitality-economics', 'direct-ordering']
  },
  {
    slug: 'optimizing-qr-scan-rates',
    type: 'guide',
    title: 'Engineering High-Scan Table Stand Collateral',
    summary: 'Graphic design, contrast ratios, and table placement best practices that drive 95%+ guest scan rates.',
    category: 'Guest Experience',
    readingTime: '5 min read',
    lastUpdated: '2026-09-10',
    author: 'Product Experience Team',
    tags: ['qr-menu', 'table-stands', 'diner-adoption']
  },
  {
    slug: 'menu-engineering-matrix-guide',
    type: 'whitepaper',
    title: 'Menu Engineering Matrix: Stars, Puzzles, Plowhorses, and Dogs',
    summary: 'Algorithmic dish profitability and popularity segmentation to maximize food margin contributions.',
    category: 'Financial Engineering',
    readingTime: '12 min read',
    lastUpdated: '2026-09-01',
    author: 'Hospitality Analytics Desk',
    tags: ['analytics', 'menu-engineering', 'profitability']
  },
  {
    slug: 'printable-qr-stand-templates',
    type: 'download',
    title: 'Standard Vector Acrylic Table Stand Templates (SVG & PDF)',
    summary: 'Print-ready acrylic table stand dimensions for A6, A7, and counter tent cards with bleed margins.',
    category: 'Print Collateral',
    lastUpdated: '2026-08-20',
    author: 'Design Systems',
    tags: ['downloads', 'qr-stands', 'print-templates'],
    externalOrFilePath: '/downloads/stand-templates.zip'
  }
];

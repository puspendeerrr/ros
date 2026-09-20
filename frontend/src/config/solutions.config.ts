/**
 * Solutions Information Architecture & Data Registry
 * Scalable definitions for operational models and business solutions.
 */

export interface SolutionItem {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  targetAudience: string;
  corePillars: string[];
  recommendedFeatureSlugs: string[];
  relatedIndustrySlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const SOLUTIONS_REGISTRY: Record<string, SolutionItem> = {
  'restaurant-chains': {
    slug: 'restaurant-chains',
    name: 'Multi-Unit Restaurant Chains',
    tagline: 'Standardize Menus, Centralize Telemetry, and Scale Franchise Outlets',
    summary: 'Centralized master catalog management, role-based store controls, and cross-outlet comparative analytics engineered for growing franchise groups.',
    targetAudience: 'Franchise brands, regional restaurant groups, and enterprise chains with 3 to 100+ locations.',
    corePillars: [
      'Master menu broadcasting with outlet-specific pricing overrides',
      'Unified enterprise reporting comparing regional store velocity',
      'Role-based access separating regional directors from local floor staff'
    ],
    recommendedFeatureSlugs: ['multi-branch-management', 'restaurant-pos', 'analytics', 'inventory'],
    relatedIndustrySlugs: ['fast-food', 'fine-dining', 'cafes'],
    faqs: [
      {
        question: 'How quickly can changes be rolled out across all locations?',
        answer: 'Menu edits in the master portal broadcast instantly across all designated branch displays in real-time.'
      }
    ]
  },
  'single-restaurants': {
    slug: 'single-restaurants',
    name: 'Independent Restaurants',
    tagline: 'Run Your Independent Dining Room Like a Modern Tech Startup',
    summary: 'Eliminate monthly menu printing costs, empower guests with table QR stands, and keep 100% of revenue with 0% commissions.',
    targetAudience: 'Independent cafe owners, standalone bistros, and family-owned dining establishments.',
    corePillars: [
      'Zero commission fees on all digital menu views and orders',
      'Instant 5-minute setup using existing smartphones and tablets',
      'Direct customer relationship ownership without intermediary fees'
    ],
    recommendedFeatureSlugs: ['qr-menu', 'digital-menu', 'restaurant-website', 'billing'],
    relatedIndustrySlugs: ['fine-dining', 'cafes', 'bakery'],
    faqs: [
      {
        question: 'Is special hardware required for a single restaurant?',
        answer: 'None. You can operate the entire system using any tablet, smartphone, or laptop.'
      }
    ]
  },
  'cloud-kitchens': {
    slug: 'cloud-kitchens',
    name: 'Cloud & Virtual Kitchens',
    tagline: 'High-Velocity Multi-Brand Management for Delivery-Only Outlets',
    summary: 'Operate multiple virtual brands from a single kitchen facility with station-routed KDS displays, unified ingredient tracking, and direct takeaway pages.',
    targetAudience: 'Ghost kitchens, dark kitchens, delivery hubs, and multi-brand culinary operators.',
    corePillars: [
      'Multi-brand menu management under a unified kitchen operation',
      'KDS station routing coordinating order tickets across prep lines',
      'Direct commission-free pickup channels complementing delivery apps'
    ],
    recommendedFeatureSlugs: ['kitchen-display-system', 'restaurant-ordering', 'inventory', 'analytics'],
    relatedIndustrySlugs: ['cloud-kitchens', 'fast-food'],
    faqs: [
      {
        question: 'Can one kitchen run multiple brand menus in Restaurant OS?',
        answer: 'Yes. You can manage distinct virtual brand menus and logos while routing tickets into a unified kitchen display.'
      }
    ]
  },
  'contactless-dining': {
    slug: 'contactless-dining',
    name: 'Contactless Dining Ecosystem',
    tagline: 'Turn Friction-Filled Dining into Seamless Table Self-Ordering',
    summary: 'Replace physical paper menus and delayed server checks with high-speed table QR stands that let diners order and pay directly from their phones.',
    targetAudience: 'High-volume dining halls, brewpubs, taprooms, and dynamic outdoor patios.',
    corePillars: [
      'Faster table turnover by eliminating order and bill settlement delays',
      'Diner self-customization with dish modifiers and allergen visibility',
      'Reduced floor staff overhead during peak operational rushes'
    ],
    recommendedFeatureSlugs: ['qr-menu', 'table-ordering', 'billing', 'feedback'],
    relatedIndustrySlugs: ['food-courts', 'cafes', 'hotels'],
    faqs: [
      {
        question: 'How much does contactless ordering accelerate table turnover?',
        answer: 'By removing the wait time for servers to bring menus and bill folders, restaurants routinely save 12 to 18 minutes per table session.'
      }
    ]
  },
  'direct-ordering': {
    slug: 'direct-ordering',
    name: 'Direct Commission-Free Ordering',
    tagline: 'Reclaim Customer Relationships and Stop Paying 30% Margins',
    summary: 'Build a direct digital storefront where loyal guests order directly from your restaurant via UPI, card, or cash at counter without platform cuts.',
    targetAudience: 'Restaurants aiming to transition takeaway and repeat patrons off high-commission third-party portals.',
    corePillars: [
      '100% direct revenue retention with 0% commission deductions',
      'Direct customer database capture for targeted WhatsApp campaigns',
      'Custom branded menu URLs for social media bio links and flyers'
    ],
    recommendedFeatureSlugs: ['restaurant-ordering', 'restaurant-crm', 'customer-management'],
    relatedIndustrySlugs: ['fast-food', 'cloud-kitchens', 'bakery'],
    faqs: [
      {
        question: 'How do customers discover our direct ordering link?',
        answer: 'You can print the direct ordering QR on takeaway bags, flyers, and link it in your Instagram bio and Google Business Profile.'
      }
    ]
  }
};

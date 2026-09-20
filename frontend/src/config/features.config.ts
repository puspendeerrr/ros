/**
 * Features Information Architecture & Data Registry
 * Scalable definitions for all 15 core Restaurant OS features.
 */

export interface FeatureItem {
  slug: string;
  name: string;
  category: 'guest-experience' | 'kitchen-pos' | 'operations-management' | 'marketing-growth';
  summary: string;
  tagline: string;
  iconName: string;
  schemaType?: string;
  highlightCapabilities: string[];
  relatedFeatureSlugs: string[];
  relatedGuideSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
  badge?: string;
}

export const FEATURE_CATEGORIES = {
  'guest-experience': {
    label: 'Guest Experience',
    description: 'Frictionless contactless dining, dynamic QR stands, and digital catalogs.'
  },
  'kitchen-pos': {
    label: 'Point of Sale & Kitchen',
    description: 'Instant ticket dispatch, POS billing, and real-time order coordination.'
  },
  'operations-management': {
    label: 'Operations & Multi-Branch',
    description: 'Inventory monitoring, multi-location rollouts, and menu lifecycle sync.'
  },
  'marketing-growth': {
    label: 'CRM & Growth Analytics',
    description: 'Guest feedback, review capture, patron loyalty, and telemetry reporting.'
  }
} as const;

export const FEATURES_REGISTRY: Record<string, FeatureItem> = {
  'qr-menu': {
    slug: 'qr-menu',
    name: 'Dynamic QR Stand Ecosystem',
    category: 'guest-experience',
    tagline: 'High-Resolution Vector Table Stands for Every Dining Zone',
    summary: 'Generate table-specific and counter QR stands with dynamic destination routing, allowing real-time menu redirection without reprinting acrylic stands.',
    iconName: 'QrCode',
    highlightCapabilities: [
      'Table-specific vector SVG and PNG downloads',
      'Dynamic URL re-routing without re-printing',
      'Built-in scan analytics telemetry',
      'Zero application download requirement for guests'
    ],
    relatedFeatureSlugs: ['digital-menu', 'restaurant-website', 'table-ordering'],
    relatedGuideSlugs: ['how-to-print-qr-stands', 'optimizing-qr-scan-rates'],
    faqs: [
      {
        question: 'Do customers need to download an app to scan the QR stand?',
        answer: 'No. The QR code links directly to a fast mobile web application that opens instantly in any default iOS or Android camera.'
      },
      {
        question: 'Can I change the destination menu after printing the stands?',
        answer: 'Yes! Restaurant OS uses dynamic slug routing, meaning you can update menu categories and items anytime without replacing physical acrylic stands.'
      }
    ],
    badge: 'Popular'
  },
  'digital-menu': {
    slug: 'digital-menu',
    name: 'Real-Time Digital Menu',
    category: 'guest-experience',
    tagline: 'Tactile, Mobile-First Menu Browsing with Live Item Availability',
    summary: 'Cloud-hosted digital catalogs with high-resolution food photography, allergen badges, dietary markers, and instant sold-out item toggling.',
    iconName: 'Smartphone',
    highlightCapabilities: [
      'Instant out-of-stock item toggles from manager mobile',
      'Rich dietary indicators: Veg, Non-Veg, Vegan, Gluten-Free',
      'Category-anchored sticky navigation',
      'Progressive Web App caching for offline resilience'
    ],
    relatedFeatureSlugs: ['qr-menu', 'restaurant-website', 'billing'],
    relatedGuideSlugs: ['engineering-a-high-converting-menu', 'reducing-wait-times-with-digital-catalogs'],
    faqs: [
      {
        question: 'How fast do price changes update on active guest phones?',
        answer: 'Updates push instantly via WebSocket sync, updating active guest displays without requiring a manual page refresh.'
      }
    ]
  },
  'restaurant-website': {
    slug: 'restaurant-website',
    name: 'Cloud Restaurant Webpage',
    category: 'guest-experience',
    tagline: 'White-Label Branded Webpage Hosted on Global Edge Networks',
    summary: 'An SEO-optimized, branded public profile displaying operating hours, maps coordinates, social links, contact forms, and the active digital menu.',
    iconName: 'Globe',
    highlightCapabilities: [
      'Automated Schema.org Restaurant JSON-LD structured data',
      'Custom subdomain and brand color matching',
      'Edge CDN hosting for sub-800ms global load times',
      'Responsive design across mobile, tablet, and desktop'
    ],
    relatedFeatureSlugs: ['digital-menu', 'qr-menu', 'restaurant-crm'],
    relatedGuideSlugs: ['local-seo-guide-for-restaurants', 'building-direct-customer-relationships'],
    faqs: [
      {
        question: 'Will our restaurant website rank on Google Search?',
        answer: 'Yes. Every public restaurant webpage is pre-configured with local business Schema.org markup, semantic HTML headings, and OpenGraph social tags.'
      }
    ]
  },
  'restaurant-ordering': {
    slug: 'restaurant-ordering',
    name: 'Commission-Free Ordering',
    category: 'guest-experience',
    tagline: 'Direct-to-Kitchen Guest Ordering Without Aggregator Take Rates',
    summary: 'Enable direct customer order placement for dine-in, takeaway, and counter pickup without giving away 15% to 30% aggregator margins.',
    iconName: 'Utensils',
    highlightCapabilities: [
      '0% commission on orders',
      'Direct order dispatch to kitchen displays',
      'Flexible payment workflows: UPI, card, and cash at counter',
      'Live order state tracking for diners'
    ],
    relatedFeatureSlugs: ['table-ordering', 'kitchen-display-system', 'billing'],
    relatedGuideSlugs: ['leaving-aggregators-behind', 'maximizing-direct-takeaway-margins'],
    faqs: [
      {
        question: 'Does Restaurant OS charge order commissions?',
        answer: 'No. Restaurant OS provides 0% commission ordering on all plans. Payment settlements go directly to your merchant account.'
      }
    ]
  },
  'table-ordering': {
    slug: 'table-ordering',
    name: 'Self-Serve Table Ordering',
    category: 'guest-experience',
    tagline: 'Empower Diners to Order from Their Table Without Waiting for Staff',
    summary: 'Guests sit, scan the table stand, select items, and submit their ticket directly to the kitchen, dramatically accelerating table turnover.',
    iconName: 'LayoutList',
    highlightCapabilities: [
      'Table session management and cart accumulation',
      'Repeat order round support without re-scanning',
      'Item modifier customization (spice level, extra toppings)',
      'Digital bill preview with split-bill readiness'
    ],
    relatedFeatureSlugs: ['qr-menu', 'kitchen-display-system', 'billing'],
    relatedGuideSlugs: ['accelerating-table-turnover', 'contactless-dining-best-practices'],
    faqs: [
      {
        question: 'Can customers add items incrementally during their meal?',
        answer: 'Yes. The active table cart allows multiple ordering rounds tied to the same table number until final checkout.'
      }
    ]
  },
  'restaurant-pos': {
    slug: 'restaurant-pos',
    name: 'Cloud Restaurant POS',
    category: 'kitchen-pos',
    tagline: 'Lightweight, Touch-Optimized Point of Sale for Service Staff',
    summary: 'A fast browser-based POS terminal that runs on any tablet, iPad, or desktop computer, synchronizing dine-in tables, takeaway, and delivery orders.',
    iconName: 'LayoutDashboard',
    highlightCapabilities: [
      'Zero proprietary hardware lock-in (runs in any modern browser)',
      'Offline caching for uninterrupted order entry during network drops',
      'Floor plan table mapping with occupied and vacant status',
      'Staff PIN authorization with role-based access'
    ],
    relatedFeatureSlugs: ['billing', 'kitchen-display-system', 'inventory'],
    relatedGuideSlugs: ['transitioning-from-legacy-pos', 'setting-up-cloud-pos-hardware'],
    faqs: [
      {
        question: 'Do we need proprietary terminals to run the POS?',
        answer: 'No. Restaurant OS POS runs in standard browsers on Android tablets, iPads, Windows laptops, and touch terminals.'
      }
    ],
    badge: 'Enterprise'
  },
  'billing': {
    slug: 'billing',
    name: 'Split Billing & GST Invoicing',
    category: 'kitchen-pos',
    tagline: 'Rapid Table Settlement, GST Compliance, and Digital Receipts',
    summary: 'Generate compliant tax invoices, split bills by seat or item, accept digital UPI/cards, and send receipts via SMS or WhatsApp.',
    iconName: 'Receipt',
    highlightCapabilities: [
      'GST tax breakdown and compliant invoicing',
      'Dynamic UPI QR display on bill receipts',
      'Split-bill and itemized payment distribution',
      'Instant WhatsApp and SMS digital receipt delivery'
    ],
    relatedFeatureSlugs: ['restaurant-pos', 'table-ordering', 'analytics'],
    relatedGuideSlugs: ['navigating-gst-in-food-service', 'digital-receipts-vs-paper-rolls'],
    faqs: [
      {
        question: 'Does billing support Indian GST tax slabs?',
        answer: 'Yes. Customizable CGST, SGST, and service charge rates can be configured per category or item.'
      }
    ]
  },
  'kitchen-display-system': {
    slug: 'kitchen-display-system',
    name: 'Kitchen Display System (KDS)',
    category: 'kitchen-pos',
    tagline: 'Paperless Kitchen Routing and Real-Time Station Dispatch',
    summary: 'Replace noisy thermal kitchen ticket printers with digital color-coded KDS screens that route orders to specific chef stations (Grill, Fryer, Bar).',
    iconName: 'ChefHat',
    highlightCapabilities: [
      'Color-coded order prep time alerts (Green, Amber, Red)',
      'Station-specific routing (Appetizers, Mains, Drinks, Bar)',
      'Bump bar and touch-screen completion triggers',
      'Average ticket preparation velocity metrics'
    ],
    relatedFeatureSlugs: ['restaurant-pos', 'restaurant-ordering', 'inventory'],
    relatedGuideSlugs: ['optimizing-line-cook-velocity-with-kds', 'cutting-ticket-errors-in-busy-kitchens'],
    faqs: [
      {
        question: 'Can orders be split across separate kitchen stations?',
        answer: 'Yes. Drinks route to the bar display, while food items route simultaneously to the kitchen line display.'
      }
    ]
  },
  'inventory': {
    slug: 'inventory',
    name: 'Recipe-Based Inventory',
    category: 'operations-management',
    tagline: 'Real-Time Ingredient Depletion and Automated Reorder Triggers',
    summary: 'Track raw ingredient levels in real-time as dishes are prepared, generate low-stock alerts, and forecast replenishment requirements.',
    iconName: 'Boxes',
    highlightCapabilities: [
      'Recipe yield mapping with automatic ingredient depletion',
      'Low-stock threshold alerts via email and manager portal',
      'Waste logging and variance discrepancy tracking',
      'Vendor purchase order management'
    ],
    relatedFeatureSlugs: ['restaurant-pos', 'analytics', 'multi-branch-management'],
    relatedGuideSlugs: ['reducing-food-waste-in-commercial-kitchens', 'recipe-costing-mathematics'],
    faqs: [
      {
        question: 'Does inventory deplete automatically when an item is ordered?',
        answer: 'Yes. Each menu item connects to a recipe bill of materials that deducts constituent ingredients in real-time.'
      }
    ]
  },
  'analytics': {
    slug: 'analytics',
    name: 'Operational Analytics',
    category: 'marketing-growth',
    tagline: 'Real-Time Hospitality Business Intelligence and Sales Telemetry',
    summary: 'Gain actionable visibility into top-selling dishes, peak dining hours, table turnover velocity, scan-to-order conversion rates, and revenue trends.',
    iconName: 'LineChart',
    highlightCapabilities: [
      'Menu item contribution margin and matrix analysis',
      'Hourly sales heatmaps and peak staffing indicators',
      'QR scan volume and diner conversion funnel telemetry',
      'Daily, weekly, and monthly automated revenue exports'
    ],
    relatedFeatureSlugs: ['billing', 'inventory', 'customer-management'],
    relatedGuideSlugs: ['menu-engineering-matrix-guide', 'understanding-table-turnover-economics'],
    faqs: [
      {
        question: 'Can sales telemetry data be exported to CSV or Excel?',
        answer: 'Yes. Detailed itemized transaction and revenue reports can be exported with a single click.'
      }
    ]
  },
  'customer-management': {
    slug: 'customer-management',
    name: 'Guest Directory & Profiles',
    category: 'marketing-growth',
    tagline: 'Build Direct Customer Relationships and Dining Preferences',
    summary: 'Store customer visit history, favorite orders, dietary preferences, and contact details without intermediary platform obfuscation.',
    iconName: 'Users',
    highlightCapabilities: [
      'Automated customer profile aggregation from digital orders',
      'Allergy and dietary preference flags',
      'Visit frequency and lifetime dining value (LTV) indicators',
      'GDPR and DPDP compliance with one-click data export'
    ],
    relatedFeatureSlugs: ['restaurant-crm', 'feedback', 'reviews'],
    relatedGuideSlugs: ['building-a-loyal-guest-community', 'compliant-hospitality-data-collection'],
    faqs: [
      {
        question: 'Do we own our customer contact data?',
        answer: '100%. Restaurant OS never holds your customer directory hostage. All contact coordinates belong entirely to your restaurant.'
      }
    ]
  },
  'feedback': {
    slug: 'feedback',
    name: 'In-Dining Guest Feedback',
    category: 'marketing-growth',
    tagline: 'Capture Real-Time Diner Sentiment Before Guests Walk Out the Door',
    summary: 'Collect private ratings on food quality, service velocity, and ambience at the point of billing, catching negative experiences before they hit public review sites.',
    iconName: 'MessageSquare',
    highlightCapabilities: [
      'Post-meal satisfaction pulse surveys on mobile bill screens',
      'Instant manager SMS alerts for sub-3-star ratings',
      'Specific dish feedback tags (cold food, too salty, delayed service)',
      'Trend dashboards identifying operational blind spots'
    ],
    relatedFeatureSlugs: ['reviews', 'customer-management', 'analytics'],
    relatedGuideSlugs: ['intercepting-complaints-before-yelp', 'service-recovery-frameworks'],
    faqs: [
      {
        question: 'How do managers get notified about unhappy customers?',
        answer: 'Immediate alerts ping the manager dashboard whenever a diner submits low-score feedback, allowing instant on-floor recovery.'
      }
    ]
  },
  'reviews': {
    slug: 'reviews',
    name: 'Google Review Booster',
    category: 'marketing-growth',
    tagline: 'Turn Delighted Diners into 5-Star Public Google Search Reviews',
    summary: 'Automate review requests that route satisfied diners (4 & 5 stars) directly to your Google Business Profile, amplifying your local search ranking.',
    iconName: 'Star',
    highlightCapabilities: [
      'Smart routing: 5-star diners prompted to post on Google Maps',
      'NFC table tap and QR review incentive flows',
      'Centralized review monitoring dashboard',
      'Local SEO ranking lift for "restaurant near me" queries'
    ],
    relatedFeatureSlugs: ['feedback', 'restaurant-website', 'restaurant-crm'],
    relatedGuideSlugs: ['climbing-local-google-pack-rankings', 'automating-google-reviews-ethically'],
    faqs: [
      {
        question: 'Does this directly increase our Google Maps ranking?',
        answer: 'Yes. Consistent, high-velocity reviews with food-specific keywords significantly improve local map pack visibility.'
      }
    ]
  },
  'restaurant-crm': {
    slug: 'restaurant-crm',
    name: 'Hospitality CRM & Marketing',
    category: 'marketing-growth',
    tagline: 'Automated WhatsApp & SMS Campaigns That Drive Repeat Dining',
    summary: 'Segment patrons by dining frequency and send targeted anniversary greetings, weekday lunch specials, and personalized comeback incentives.',
    iconName: 'Send',
    highlightCapabilities: [
      'Official WhatsApp Business API integration for broadcast updates',
      'Automated birthday and anniversary dining promotions',
      'Lapsed guest win-back triggers (e.g. absent for 30+ days)',
      'ROI tracking connecting campaigns to actual dining orders'
    ],
    relatedFeatureSlugs: ['customer-management', 'reviews', 'analytics'],
    relatedGuideSlugs: ['high-converting-whatsapp-restaurant-campaigns', 'guest-retention-playbook'],
    faqs: [
      {
        question: 'Can campaigns be sent via WhatsApp Business?',
        answer: 'Yes. Official WhatsApp templates can be sent with dynamic customer names and personalized discount voucher codes.'
      }
    ]
  },
  'multi-branch-management': {
    slug: 'multi-branch-management',
    name: 'Multi-Branch Master Hub',
    category: 'operations-management',
    tagline: 'Centralized Control Across Multi-Location Restaurant Chains',
    summary: 'Manage centralized master menus, differential regional pricing, branch inventory levels, and comparative franchise performance from a single pane of glass.',
    iconName: 'Network',
    highlightCapabilities: [
      'Master catalog inheritance with branch-specific price overrides',
      'Role-based permissions for regional directors, store managers, and staff',
      'Consolidated multi-unit enterprise financial reporting',
      'Centralized staff roster and outlet onboarding pipeline'
    ],
    relatedFeatureSlugs: ['restaurant-pos', 'inventory', 'analytics'],
    relatedGuideSlugs: ['scaling-from-1-to-10-locations', 'franchise-operating-system-standards'],
    faqs: [
      {
        question: 'Can individual branch managers modify item prices?',
        answer: 'Master account administrators can lock core pricing or grant selective override permissions to specific store managers.'
      }
    ],
    badge: 'Enterprise'
  }
};

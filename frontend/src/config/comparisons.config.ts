/**
 * Commercial Comparisons Information Architecture & Registry
 * Reusable data models for comparison pages (vs Paper, vs Aggregators, vs Legacy POS).
 */

export interface ComparisonMatrixItem {
  featureName: string;
  restaurantOs: string | boolean;
  competitor: string | boolean;
  importance: 'critical' | 'high' | 'medium';
}

export interface ComparisonItem {
  slug: string;
  competitorName: string;
  competitorCategory: string;
  title: string;
  tagline: string;
  summary: string;
  whySwitchSummary: string;
  matrix: ComparisonMatrixItem[];
  keyAdvantages: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const COMPARISONS_REGISTRY: Record<string, ComparisonItem> = {
  'vs-paper-menus': {
    slug: 'vs-paper-menus',
    competitorName: 'Traditional Paper & Laminated Menus',
    competitorCategory: 'Physical Print Menus',
    title: 'Restaurant OS vs. Traditional Paper Menus',
    tagline: 'Why Modern Restaurants Are Retiring Recurring Printing Invoices',
    summary: 'Compare recurring reprint costs, sanitation, sold-out delays, and customer interaction telemetry between digital QR stands and static paper menus.',
    whySwitchSummary: 'Physical menus cost ₹8,000+ monthly to maintain and cannot reflect sold-out ingredients in real-time. Restaurant OS enables instant zero-cost updates and dynamic QR stands.',
    matrix: [
      { featureName: 'Monthly Menu Printing Invoices', restaurantOs: '₹0 (Zero recurring print costs)', competitor: '₹8,000 to ₹25,000+ monthly', importance: 'critical' },
      { featureName: 'Instant Out-of-Stock Dish Updates', restaurantOs: true, competitor: false, importance: 'critical' },
      { featureName: 'Hygiene & Contactless Safety', restaurantOs: true, competitor: false, importance: 'high' },
      { featureName: 'High-Res Food Photography', restaurantOs: true, competitor: 'Limited by page real estate', importance: 'medium' },
      { featureName: 'Customer Scan & View Telemetry', restaurantOs: true, competitor: false, importance: 'high' }
    ],
    keyAdvantages: [
      'Zero reprint overhead when ingredient prices change',
      'Instant real-time menu synchronization across all tables',
      'Rich dietary tags and allergen alerts for guests'
    ],
    faqs: [
      {
        question: 'How much money does a typical cafe save by switching from paper?',
        answer: 'Independent cafes report saving ₹70,000 to ₹1,50,000 annually in avoided graphic design and printing bills.'
      }
    ]
  },
  'vs-delivery-aggregators': {
    slug: 'vs-delivery-aggregators',
    competitorName: 'Third-Party Delivery Platforms & Marketplaces',
    competitorCategory: 'Food Delivery Aggregators',
    title: 'Restaurant OS vs. Delivery Aggregator Marketplaces',
    tagline: 'Own Your Direct Customer Relationships Without 30% Margin Deductions',
    summary: 'A direct comparison of commission structures, customer data ownership, and brand sovereignty between aggregator apps and your own digital operating system.',
    whySwitchSummary: 'Aggregator marketplaces take 15% to 30% cuts on every order and lock customer relationships inside their walled garden. Restaurant OS provides 0% commission direct ordering.',
    matrix: [
      { featureName: 'Commission Deductions', restaurantOs: '0% (Always free to take orders)', competitor: '15% to 30% cut per ticket', importance: 'critical' },
      { featureName: 'Customer Contact Ownership', restaurantOs: '100% Owned by Merchant', competitor: 'Masked phone numbers & locked data', importance: 'critical' },
      { featureName: 'White-Label Brand Identity', restaurantOs: 'Your logo, colors & domain', competitor: 'Competitor logos & sponsored ads', importance: 'high' },
      { featureName: 'Table QR Stand Integration', restaurantOs: true, competitor: false, importance: 'high' }
    ],
    keyAdvantages: [
      'Keep 100% of your operational menu margins',
      'Direct customer phone numbers and dining histories for marketing',
      'Zero algorithmic ranking penalties or competing restaurant recommendations'
    ],
    faqs: [
      {
        question: 'Can we use Restaurant OS alongside third-party aggregators?',
        answer: 'Yes. Many restaurants keep aggregators for new customer acquisition while routing dine-in, takeaway, and repeat diners through Restaurant OS.'
      }
    ]
  },
  'vs-legacy-pos': {
    slug: 'vs-legacy-pos',
    competitorName: 'Legacy Hardware-Locked POS Systems',
    competitorCategory: 'Traditional Terminal POS',
    title: 'Restaurant OS vs. Legacy Hardware-Locked POS',
    tagline: 'Break Free from Proprietary POS Terminals and Expensive Annual Maintenance',
    summary: 'Compare cloud browser accessibility, tablet hardware flexibility, and modern digital QR synchronization against outdated server-based legacy POS terminals.',
    whySwitchSummary: 'Legacy POS requires proprietary hardware terminals costing ₹60,000+ with cumbersome local database maintenance. Restaurant OS runs seamlessly in any modern web browser.',
    matrix: [
      { featureName: 'Proprietary Terminal Hardware Lock-in', restaurantOs: 'None (Runs on any tablet, phone, PC)', competitor: 'Requires specialized terminal stations', importance: 'critical' },
      { featureName: 'Integrated Guest Table QR Menus', restaurantOs: 'Native & synchronized in real-time', competitor: 'Requires costly third-party add-ons', importance: 'high' },
      { featureName: 'Cloud-Based Remote Access', restaurantOs: 'Check sales anywhere on your phone', competitor: 'Locked to back-office terminal', importance: 'high' },
      { featureName: 'Annual Maintenance Contracts (AMC)', restaurantOs: 'None', competitor: '₹15,000+ yearly maintenance contracts', importance: 'medium' }
    ],
    keyAdvantages: [
      'Deploy on hardware you already own (iPads, Android tablets, laptops)',
      'Remote manager oversight from any smartphone anywhere in the world',
      'Seamless cloud updates with zero on-premise server maintenance'
    ],
    faqs: [
      {
        question: 'Can Restaurant OS operate if our local Wi-Fi drops temporarily?',
        answer: 'Yes. Progressive offline caching allows order entry to proceed smoothly during temporary connectivity disruptions.'
      }
    ]
  }
};

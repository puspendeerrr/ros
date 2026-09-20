/**
 * Enterprise Navigation Hierarchy & Mega Menu Architecture
 * Single source of truth for Desktop Header, Mega Menus, Mobile Drawer, and Footer.
 */

export interface NavLinkItem {
  label: string;
  path: string;
  description?: string;
  badge?: string;
  iconName?: string;
  isExternal?: boolean;
}

export interface NavSection {
  title: string;
  items: NavLinkItem[];
}

export interface MegaMenuDropdown {
  key: string;
  label: string;
  sections: NavSection[];
  featuredCta?: {
    title: string;
    description: string;
    buttonLabel: string;
    path: string;
  };
}

export const MAIN_NAV_ITEMS: Array<{ key: string; label: string; path?: string; megaMenu?: MegaMenuDropdown }> = [
  {
    key: 'platform',
    label: 'Platform',
    path: '/features',
    megaMenu: {
      key: 'platform',
      label: 'Platform',
      sections: [
        {
          title: 'Guest Experience',
          items: [
            { label: 'QR Menu Ecosystem', path: '/features/qr-menu', description: 'Table stand vector QR generator', badge: 'POPULAR', iconName: 'QrCode' },
            { label: 'Real-Time Digital Menu', path: '/features/digital-menu', description: 'Tactile, live-sync digital catalog', iconName: 'Smartphone' },
            { label: 'Restaurant Website', path: '/features/restaurant-website', description: 'Edge-hosted branded storefront', iconName: 'Globe' },
            { label: 'Commission-Free Ordering', path: '/features/restaurant-ordering', description: 'Direct guest order intake', iconName: 'ShoppingBag' },
            { label: 'Table Ordering', path: '/features/table-ordering', description: 'Self-serve dine-in ordering', iconName: 'Utensils' },
          ]
        },
        {
          title: 'Point of Sale & Kitchen',
          items: [
            { label: 'Cloud Restaurant POS', path: '/features/restaurant-pos', description: 'Hardware-agnostic tablet billing', badge: 'NEW', iconName: 'Tablet' },
            { label: 'Billing & GST Invoicing', path: '/features/billing', description: 'Split bills and compliant invoices', iconName: 'Receipt' },
            { label: 'Kitchen Display System (KDS)', path: '/features/kitchen-display-system', description: 'Paperless cook station routing', iconName: 'Printer' },
            { label: 'Recipe Inventory', path: '/features/inventory', description: 'Real-time ingredient depletion', iconName: 'Layers' },
          ]
        },
        {
          title: 'Growth & Multi-Unit',
          items: [
            { label: 'Multi-Branch Master Hub', path: '/features/multi-branch-management', description: 'Enterprise franchise management', badge: 'ENTERPRISE', iconName: 'Building2' },
            { label: 'Operational Analytics', path: '/features/analytics', description: 'Sales heatmaps & menu engineering', iconName: 'BarChart3' },
            { label: 'Guest CRM & WhatsApp', path: '/features/restaurant-crm', description: 'Automated repeat dining triggers', iconName: 'Users' },
            { label: 'In-Dining Feedback', path: '/features/feedback', description: 'Pre-exit satisfaction capture', iconName: 'Star' },
            { label: 'Google Review Booster', path: '/features/reviews', description: 'Automate 5-star Google Map reviews', iconName: 'Award' },
          ]
        }
      ],
      featuredCta: {
        title: 'See the Full Platform Suite',
        description: 'Explore all 15 operational modules engineered for modern restaurants.',
        buttonLabel: 'Explore Platform →',
        path: '/features'
      }
    }
  },
  {
    key: 'solutions',
    label: 'Solutions',
    megaMenu: {
      key: 'solutions',
      label: 'Solutions',
      sections: [
        {
          title: 'Operational Models',
          items: [
            { label: 'Restaurant Chains', path: '/solutions/restaurant-chains', description: 'Franchise and multi-location management', badge: 'ENTERPRISE', iconName: 'Building2' },
            { label: 'Independent Restaurants', path: '/solutions/single-restaurants', description: 'Single-unit cafes, bistros, and eateries', iconName: 'Store' },
            { label: 'Cloud & Virtual Kitchens', path: '/solutions/cloud-kitchens', description: 'Delivery-only multi-brand operations', badge: 'POPULAR', iconName: 'Layers' },
            { label: 'Contactless Dining', path: '/solutions/contactless-dining', description: 'Accelerate table turnover rates', iconName: 'Smartphone' },
            { label: 'Direct Ordering', path: '/solutions/direct-ordering', description: '0% commission pickup and delivery', iconName: 'ShoppingBag' },
          ]
        }
      ],
      featuredCta: {
        title: 'Compare vs. Traditional Options',
        description: 'Review our side-by-side matrices against paper menus and aggregators.',
        buttonLabel: 'View Comparisons →',
        path: '/compare'
      }
    }
  },
  {
    key: 'industries',
    label: 'Industries',
    megaMenu: {
      key: 'industries',
      label: 'Industries',
      sections: [
        {
          title: 'Hospitality Verticals',
          items: [
            { label: 'Specialty Cafes & Coffee', path: '/industries/cafes', description: 'Fast counter queues and drink modifiers', iconName: 'Coffee' },
            { label: 'Cloud Kitchens', path: '/industries/cloud-kitchens', description: 'Ghost kitchens and virtual hubs', iconName: 'Layers' },
            { label: 'Hotels & In-Room Dining', path: '/industries/hotels', description: 'Room-specific QR stands and dining', badge: 'ENTERPRISE', iconName: 'Building2' },
            { label: 'Resorts & Beach Clubs', path: '/industries/resorts', description: 'Cabana and poolside outdoor ordering', iconName: 'Globe' },
          ]
        },
        {
          title: 'Commercial Food Formats',
          items: [
            { label: 'Food Courts & Malls', path: '/industries/food-courts', description: 'Multi-stall ordering without standing queues', iconName: 'Store' },
            { label: 'Fine Dining & Lounges', path: '/industries/fine-dining', description: 'Minimalist tasting menus & wine lists', iconName: 'Utensils' },
            { label: 'Fast Casual & QSR', path: '/industries/fast-food', description: 'Sub-3-minute ticket velocity', badge: 'POPULAR', iconName: 'Zap' },
            { label: 'Bakeries & Patisseries', path: '/industries/bakery', description: 'Fresh morning bakes & custom cakes', iconName: 'Store' },
            { label: 'Food Trucks & Pop-Ups', path: '/industries/food-trucks', description: 'Mobile POS that runs anywhere', iconName: 'Store' },
          ]
        }
      ]
    }
  },
  {
    key: 'resources',
    label: 'Resources',
    megaMenu: {
      key: 'resources',
      label: 'Resources',
      sections: [
        {
          title: 'Learning & Playbooks',
          items: [
            { label: 'Guides & Best Practices', path: '/resources/guides', description: 'Deep-dive hospitality playbooks', badge: 'POPULAR', iconName: 'BookOpen' },
            { label: 'Documentation Hub', path: '/docs', description: 'Platform setup guides and workflows', iconName: 'FileText' },
            { label: 'FAQ Library', path: '/resources/faqs', description: 'Categorized questions and answers', iconName: 'HelpCircle' },
            { label: 'Hospitality Glossary', path: '/resources/glossary', description: 'Industry and technical terminology', iconName: 'BookOpen' },
          ]
        },
        {
          title: 'Developer & Assets',
          items: [
            { label: 'API & Webhooks', path: '/api', description: 'Developer documentation and payloads', badge: 'NEW', iconName: 'Layers' },
            { label: 'Printable QR Downloads', path: '/downloads', description: 'Vector stand templates and print assets', iconName: 'Download' },
            { label: 'Platform Changelog', path: '/changelog', description: 'Latest releases and engineering notes', iconName: 'RefreshCw' },
            { label: 'Product Roadmap', path: '/roadmap', description: 'Upcoming platform capabilities', iconName: 'TrendingUp' },
          ]
        }
      ]
    }
  },
  {
    key: 'pricing',
    label: 'Pricing',
    path: '/pricing'
  },
  {
    key: 'company',
    label: 'Company',
    megaMenu: {
      key: 'company',
      label: 'Company',
      sections: [
        {
          title: 'About Restaurant OS',
          items: [
            { label: 'Our Mission & Story', path: '/company/about', description: 'Why we built a 0% commission platform', iconName: 'Sparkles' },
            { label: 'Careers', path: '/company/careers', description: 'Join our product and engineering team', badge: 'WE ARE HIRING', iconName: 'Users' },
            { label: 'Contact Sales & Support', path: '/company/contact', description: 'Enterprise onboarding and inquiries', iconName: 'Mail' },
            { label: 'Customer Stories', path: '/customers', description: 'How restaurateurs run digital menus', iconName: 'Star' },
          ]
        }
      ]
    }
  }
];

export const FOOTER_SECTIONS: NavSection[] = [
  {
    title: 'Product & Features',
    items: [
      { label: 'QR Menu Stand Ecosystem', path: '/features/qr-menu' },
      { label: 'Real-Time Digital Menu', path: '/features/digital-menu' },
      { label: 'Cloud Restaurant Website', path: '/features/restaurant-website' },
      { label: 'Commission-Free Ordering', path: '/features/restaurant-ordering' },
      { label: 'Table Self-Ordering', path: '/features/table-ordering' },
      { label: 'Cloud Restaurant POS', path: '/features/restaurant-pos' },
      { label: 'Split Billing & GST', path: '/features/billing' },
      { label: 'Kitchen Display System (KDS)', path: '/features/kitchen-display-system' },
      { label: 'Multi-Branch Master Hub', path: '/features/multi-branch-management' },
    ]
  },
  {
    title: 'Solutions & Models',
    items: [
      { label: 'Restaurant Chains', path: '/solutions/restaurant-chains' },
      { label: 'Independent Bistros', path: '/solutions/single-restaurants' },
      { label: 'Cloud Kitchens', path: '/solutions/cloud-kitchens' },
      { label: 'Contactless Dining', path: '/solutions/contactless-dining' },
      { label: 'Direct Ordering Channel', path: '/solutions/direct-ordering' },
      { label: 'Compare vs. Paper Menus', path: '/compare/vs-paper-menus' },
      { label: 'Compare vs. Aggregators', path: '/compare/vs-delivery-aggregators' },
      { label: 'Compare vs. Legacy POS', path: '/compare/vs-legacy-pos' },
    ]
  },
  {
    title: 'Hospitality Industries',
    items: [
      { label: 'Specialty Cafes & Coffee', path: '/industries/cafes' },
      { label: 'Ghost & Dark Kitchens', path: '/industries/cloud-kitchens' },
      { label: 'Hotels & In-Room Dining', path: '/industries/hotels' },
      { label: 'Resorts & Beach Clubs', path: '/industries/resorts' },
      { label: 'Food Courts & Malls', path: '/industries/food-courts' },
      { label: 'Fine Dining & Lounges', path: '/industries/fine-dining' },
      { label: 'Fast Food & QSR', path: '/industries/fast-food' },
      { label: 'Bakeries & Patisseries', path: '/industries/bakery' },
      { label: 'Food Trucks & Pop-ups', path: '/industries/food-trucks' },
    ]
  },
  {
    title: 'Resources & Docs',
    items: [
      { label: 'Documentation Hub', path: '/docs' },
      { label: 'Guides & Playbooks', path: '/resources/guides' },
      { label: 'FAQ Knowledge Library', path: '/resources/faqs' },
      { label: 'Hospitality Glossary', path: '/resources/glossary' },
      { label: 'Developer API & Webhooks', path: '/api' },
      { label: 'Printable Stand Downloads', path: '/downloads' },
      { label: 'Product Changelog', path: '/changelog' },
      { label: 'Public Roadmap', path: '/roadmap' },
    ]
  },
  {
    title: 'Company & Legal',
    items: [
      { label: 'About Brand & Mission', path: '/company/about' },
      { label: 'Careers', path: '/company/careers' },
      { label: 'Contact Enterprise Sales', path: '/company/contact' },
      { label: 'Customer Stories', path: '/customers' },
      { label: 'Pricing Matrix', path: '/pricing' },
      { label: 'Privacy Policy', path: '/legal/privacy-policy' },
      { label: 'Terms of Service', path: '/legal/terms-of-service' },
      { label: 'Security Policy (RFC 9116)', path: '/.well-known/security.txt', isExternal: true },
      { label: 'AI Context (llms.txt)', path: '/llms.txt', isExternal: true }
    ]
  }
];

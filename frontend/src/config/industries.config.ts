/**
 * Industries Information Architecture & Data Registry
 * Dedicated vertical architecture for specific hospitality sectors.
 */

export interface IndustryItem {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  challengesSolved: string[];
  keyFeatureSlugs: string[];
  recommendedSolutionSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const INDUSTRIES_REGISTRY: Record<string, IndustryItem> = {
  'cafes': {
    slug: 'cafes',
    name: 'Specialty Cafes & Coffee Shops',
    tagline: 'High-Pace Drink Menus, Counter QR Displays, and Quick Turnarounds',
    summary: 'Tailored for coffee bars and casual cafes with dynamic bean origin notes, milk alternatives, pastry displays, and fast QR counter ordering.',
    challengesSolved: [
      'Fast morning beverage queues via quick scan-and-pay',
      'Instant pastry out-of-stock toggles as display items sell out',
      'Custom drink modifier selections (almond milk, extra espresso shot, syrup flavor)'
    ],
    keyFeatureSlugs: ['qr-menu', 'digital-menu', 'table-ordering', 'reviews'],
    recommendedSolutionSlugs: ['single-restaurants', 'contactless-dining'],
    faqs: [
      {
        question: 'Can customers customize drink modifiers like milk type?',
        answer: 'Yes. Items support multi-tier modifiers such as dairy alternatives, espresso shots, and sugar levels.'
      }
    ]
  },
  'cloud-kitchens': {
    slug: 'cloud-kitchens',
    name: 'Cloud Kitchens & Ghost Kitchens',
    tagline: 'Multi-Brand Routing, Delivery Integration, and Direct Takeaway Channels',
    summary: 'Engineered for delivery-centric food ventures running multiple concept menus from a single kitchen footprint with kitchen ticket routing.',
    challengesSolved: [
      'Multi-brand menu management under a unified kitchen operation',
      'Paperless kitchen display routing orders to correct cook stations',
      'Direct order pickup without 30% aggregator commission deductions'
    ],
    keyFeatureSlugs: ['kitchen-display-system', 'restaurant-ordering', 'inventory', 'analytics'],
    recommendedSolutionSlugs: ['cloud-kitchens', 'direct-ordering'],
    faqs: [
      {
        question: 'Can we manage multiple brands under one subscription?',
        answer: 'Yes. Restaurant OS supports multi-brand catalog segregation with unified operational dashboards.'
      }
    ]
  },
  'hotels': {
    slug: 'hotels',
    name: 'Hotels & In-Room Dining',
    tagline: 'Room-Specific QR Service for Seamless In-Room Dining and Poolside Orders',
    summary: 'Equip guest rooms, balconies, and poolside cabanas with custom QR stands so travelers can order room service directly from their phones without picking up landlines.',
    challengesSolved: [
      'Eliminate bulky, unhygienic printed room service folders',
      'Dynamic dayparting: automatically switch between Breakfast, All-Day, and Night menus',
      'Room-number routed ordering dispatching straight to kitchen and front desk'
    ],
    keyFeatureSlugs: ['qr-menu', 'restaurant-pos', 'kitchen-display-system', 'billing'],
    recommendedSolutionSlugs: ['contactless-dining', 'restaurant-chains'],
    faqs: [
      {
        question: 'Can QR stands be tied to specific room numbers?',
        answer: 'Yes. Each room receives a unique vector QR stand that automatically encodes the guest room number on the kitchen ticket.'
      }
    ]
  },
  'resorts': {
    slug: 'resorts',
    name: 'Resorts & Beach Clubs',
    tagline: 'Expansive Area Ordering for Cabanas, Lawns, and Lounges',
    summary: 'Deliver hospitality across sprawling outdoor footprints with mobile ordering for poolside chairs, private gazebos, and event pavilions.',
    challengesSolved: [
      'Servers no longer need to walk huge distances to deliver physical menus',
      'Guest ordering directly from sunbeds, beach lounges, and cabana zones',
      'Instant out-of-stock sync for seasonal cocktail and kitchen offerings'
    ],
    keyFeatureSlugs: ['qr-menu', 'table-ordering', 'billing', 'analytics'],
    recommendedSolutionSlugs: ['contactless-dining', 'restaurant-chains'],
    faqs: [
      {
        question: 'Can outdoor zones be organized separately from the main restaurant?',
        answer: 'Yes. You can define distinct service zones (Poolside, Beachfront, Cabanas, Main Terrace) with zone-specific table numbering.'
      }
    ]
  },
  'food-courts': {
    slug: 'food-courts',
    name: 'Food Courts & Commercial Hubs',
    tagline: 'Unified Mall QR Stands with Multi-Vendor Ordering Direct to Stall',
    summary: 'Place unified QR stands across food court seating, allowing mall diners to browse multiple brand menus and pick up orders without standing in queue lines.',
    challengesSolved: [
      'Eliminate long standing queues in busy commercial malls',
      'SMS alerts notifying diners when their order is ready for collection',
      'Touchless ordering with transparent wait times per counter'
    ],
    keyFeatureSlugs: ['qr-menu', 'restaurant-ordering', 'kitchen-display-system', 'analytics'],
    recommendedSolutionSlugs: ['contactless-dining', 'direct-ordering'],
    faqs: [
      {
        question: 'How do diners know when their food is ready?',
        answer: 'Kitchen staff tap the order as ready on the KDS display, instantly dispatching an automated SMS notification with ticket collection details.'
      }
    ]
  },
  'fine-dining': {
    slug: 'fine-dining',
    name: 'Fine Dining & Gastropubs',
    tagline: 'Elegant Minimalist Digital Menus Befitting Premium Hospitality',
    summary: 'Sleek, dark-mode digital wine lists, tasting menus, chef notes, and pairing recommendations maintaining luxury ambience.',
    challengesSolved: [
      'Extensive wine lists updated instantly as vintage bottles deplete',
      'Storytelling for tasting menus with provenance and sommelier pairings',
      'Discreet service flows that never disrupt romantic dining conversations'
    ],
    keyFeatureSlugs: ['digital-menu', 'restaurant-website', 'reviews', 'feedback'],
    recommendedSolutionSlugs: ['single-restaurants', 'restaurant-chains'],
    faqs: [
      {
        question: 'Can the menu styling match our luxury fine-dining brand aesthetic?',
        answer: 'Yes. Restaurant OS layouts feature sleek typography, dark-mode themes, and subtle animations tailored for upscale establishments.'
      }
    ]
  },
  'fast-food': {
    slug: 'fast-food',
    name: 'Fast Food & Quick Service (QSR)',
    tagline: 'High-Volume Order Throughput with Real-Time Kitchen Dispatch',
    summary: 'Built for speed: rapid counter billing, combo meal item selection, visual kitchen bump screens, and sub-3-minute ticket turnaround.',
    challengesSolved: [
      'Peak lunchtime queue busting with QR ordering on counter stands',
      'Kitchen prep velocity tracking with color-coded KDS timers',
      'Fast UPI QR code payments displayed on thermal customer bills'
    ],
    keyFeatureSlugs: ['restaurant-pos', 'kitchen-display-system', 'billing', 'restaurant-ordering'],
    recommendedSolutionSlugs: ['direct-ordering', 'restaurant-chains'],
    faqs: [
      {
        question: 'Does the system support combo meal pricing?',
        answer: 'Yes. Combo menus, upsells, and beverage add-on recommendations can be configured in seconds.'
      }
    ]
  },
  'bakery': {
    slug: 'bakery',
    name: 'Bakeries & Patisseries',
    tagline: 'Dynamic Daily Bakes Display and Advance Celebration Cake Orders',
    summary: 'Showcase freshly baked morning viennoiserie, display custom celebration cakes, and manage shelf-life item availability with zero friction.',
    challengesSolved: [
      'Morning vs afternoon availability toggles as fresh batches leave the oven',
      'Allergen declarations: dairy-free, nut-free, eggless, and gluten-free badges',
      'Pre-order scheduling for custom birthday and celebration cakes'
    ],
    keyFeatureSlugs: ['digital-menu', 'restaurant-website', 'customer-management', 'restaurant-crm'],
    recommendedSolutionSlugs: ['single-restaurants', 'direct-ordering'],
    faqs: [
      {
        question: 'Can customers filter items for eggless or gluten-free pastries?',
        answer: 'Yes. Diners can toggle dietary filters to see only eggless, vegan, or nut-safe baked goods.'
      }
    ]
  },
  'food-trucks': {
    slug: 'food-trucks',
    name: 'Food Trucks & Mobile Pop-ups',
    tagline: 'Mobile Point of Sale and QR Stands That Move Where You Park',
    summary: 'Operate entirely from a mobile phone or battery-powered tablet with live location sharing, fast counter billing, and dynamic QR ordering.',
    challengesSolved: [
      'Zero bulky terminal hardware or cables required',
      'Dynamic location updates on your public website so fans know where you park',
      'Fast QR queue busting while you focus on cooking on the grill'
    ],
    keyFeatureSlugs: ['qr-menu', 'restaurant-pos', 'billing', 'restaurant-website'],
    recommendedSolutionSlugs: ['single-restaurants', 'direct-ordering'],
    faqs: [
      {
        question: 'Can Restaurant OS work on mobile hotspot connections?',
        answer: 'Yes. The lightweight web application is aggressively optimized for mobile 4G/5G connections.'
      }
    ]
  }
};

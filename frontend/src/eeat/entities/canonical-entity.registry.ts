/**
 * Canonical Entity Registry
 * Permanent URI identities and multi-graph reconciliations for Restaurant OS entities.
 */

import { SITE_CONFIG } from '../../config/seo.config.ts';
import type { CanonicalEntity } from '../types/eeat.types.ts';

export const CANONICAL_ENTITIES_REGISTRY: CanonicalEntity[] = [
  // 1. Organization (Top-Level Identity)
  {
    id: 'ent-org-restaurant-os',
    canonicalUri: `${SITE_CONFIG.origin}/#organization`,
    name: 'Restaurant OS',
    entityType: 'Organization',
    description: 'Autonomous restaurant operating system powering cloud POS, dynamic QR ordering, kitchen display systems, and commission-free dining infrastructure.',
    alternateNames: ['RestaurantOS', 'ROS Platform', 'Algorithyum Restaurant OS'],
    identifier: 'urn:uuid:8b3e5108-8f85-45cf-9bb2-c7f42ef89360',
    sameAs: [
      'https://github.com/puspendeerrr/ros',
      'https://twitter.com/restaurant_os',
      'https://www.linkedin.com/company/restaurant-os'
    ],
    childEntityIds: ['ent-brand-restaurant-os', 'ent-software-restaurant-os']
  },

  // 2. Brand Identity
  {
    id: 'ent-brand-restaurant-os',
    canonicalUri: `${SITE_CONFIG.origin}/#brand`,
    name: 'Restaurant OS',
    entityType: 'Brand',
    description: 'The premier enterprise brand for commission-free restaurant hospitality technology.',
    alternateNames: ['Restaurant OS Brand'],
    identifier: 'urn:uuid:6e5e8a0c-4392-4217-a065-27a96df8734a',
    parentEntityId: 'ent-org-restaurant-os',
    sameAs: ['https://ros.algorithyum.in']
  },

  // 3. Primary SoftwareApplication Entity
  {
    id: 'ent-software-restaurant-os',
    canonicalUri: `${SITE_CONFIG.origin}/#softwareapplication`,
    name: 'Restaurant OS Enterprise Suite',
    entityType: 'SoftwareApplication',
    description: 'Cloud-native multi-terminal restaurant point of sale, QR code dining, and kitchen order routing system.',
    alternateNames: ['Restaurant OS Software', 'ROS Cloud POS'],
    identifier: 'urn:uuid:f1894d80-5a39-4d69-a359-2fce81a54130',
    parentEntityId: 'ent-org-restaurant-os',
    sameAs: [
      'https://github.com/puspendeerrr/ros',
      'https://ros.algorithyum.in/download'
    ],
    childEntityIds: [
      'ent-feat-qr-stand',
      'ent-feat-cloud-pos',
      'ent-feat-kds',
      'ent-feat-multi-branch'
    ]
  },

  // 4. Feature: Dynamic QR Stand Ecosystem
  {
    id: 'ent-feat-qr-stand',
    canonicalUri: `${SITE_CONFIG.origin}/features/qr-ordering-table-stand#feature`,
    name: 'Dynamic QR Menu Stand Ecosystem',
    entityType: 'Feature',
    description: 'Table-specific vector QR code generation, contactless mobile ordering, and instant UPI bill settlement.',
    alternateNames: ['Table QR Ordering', 'Digital Dine-In Menu', 'Contactless QR Stand'],
    identifier: 'urn:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567801',
    parentEntityId: 'ent-software-restaurant-os',
    productArea: 'qr_menu',
    sameAs: [`${SITE_CONFIG.origin}/features/qr-ordering-table-stand`],
    relatedEntityIds: ['ent-ind-cafes', 'ent-doc-quickstart']
  },

  // 5. Feature: Cloud POS & Billing
  {
    id: 'ent-feat-cloud-pos',
    canonicalUri: `${SITE_CONFIG.origin}/features/cloud-pos-billing#feature`,
    name: 'Cloud POS & Offline Billing Terminal',
    entityType: 'Feature',
    description: 'Browser-based Point of Sale with local IndexedDB offline failover and Ethernet/Bluetooth thermal KOT printing.',
    alternateNames: ['Cloud POS', 'Offline POS', 'Restaurant Billing Terminal'],
    identifier: 'urn:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567802',
    parentEntityId: 'ent-software-restaurant-os',
    productArea: 'cloud_pos',
    relatedEntityIds: ['ent-doc-quickstart']
  },

  // 6. Feature: Kitchen Display System (KDS)
  {
    id: 'ent-feat-kds',
    canonicalUri: `${SITE_CONFIG.origin}/features/kitchen-display-system#feature`,
    name: 'Kitchen Display System & Station Routing',
    entityType: 'Feature',
    description: 'Paperless digital KOT routing, cook timers, multi-station order assembly, and expediter bump bars.',
    alternateNames: ['Kitchen Display System', 'Restaurant KDS', 'Chef Bump Bar'],
    identifier: 'urn:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567803',
    parentEntityId: 'ent-software-restaurant-os',
    productArea: 'kds'
  },

  // 7. Feature: Multi-Branch Fleet Management
  {
    id: 'ent-feat-multi-branch',
    canonicalUri: `${SITE_CONFIG.origin}/features/multi-branch-franchise#feature`,
    name: 'Multi-Branch & Franchise Fleet Control',
    entityType: 'Feature',
    description: 'Centralized menu catalog push, branch pricing tiers, unified sales rollups, and role-based permissions.',
    alternateNames: ['Franchise Fleet POS', 'Multi-Location Restaurant Management'],
    identifier: 'urn:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567804',
    parentEntityId: 'ent-software-restaurant-os',
    productArea: 'multi_branch'
  },

  // 8. Industry: Specialty Cafes & Coffee Shops
  {
    id: 'ent-ind-cafes',
    canonicalUri: `${SITE_CONFIG.origin}/industries/cafes-and-coffee-shops#industry`,
    name: 'Specialty Cafes & Quick-Serve Coffee Architecture',
    entityType: 'Industry',
    description: 'High-throughput counter ordering, mobile queue busting, and UPI settlement optimized for specialty cafes.',
    alternateNames: ['Cafe POS Architecture', 'Coffee Shop Operating System'],
    identifier: 'urn:uuid:b2c3d4e5-f678-9012-bcde-fa2345678901',
    relatedEntityIds: ['ent-feat-qr-stand', 'ent-feat-cloud-pos']
  },

  // 9. Documentation: 5-Minute Quickstart
  {
    id: 'ent-doc-quickstart',
    canonicalUri: `${SITE_CONFIG.origin}/docs/5-minute-restaurant-quickstart#documentation`,
    name: '5-Minute Restaurant Quick Start Documentation',
    entityType: 'Documentation',
    description: 'Technical configuration guide for restaurant onboarding, catalog upload, and vector QR stand printing.',
    alternateNames: ['Restaurant OS Quickstart', 'Onboarding Documentation'],
    identifier: 'urn:uuid:c3d4e5f6-7890-1234-cdef-ab3456789012',
    relatedEntityIds: ['ent-feat-qr-stand', 'ent-software-restaurant-os']
  },

  // 10. DefinedTerm: Direct Commission-Free Dining
  {
    id: 'ent-term-commission-free',
    canonicalUri: `${SITE_CONFIG.origin}/resources/glossary/commission-free-dining#term`,
    name: 'Commission-Free Dining Infrastructure',
    entityType: 'DefinedTerm',
    description: 'Direct dining architecture that enables restaurants to accept guest orders and payments without paying 15-30% marketplace aggregator fees.',
    alternateNames: ['Zero-Commission Ordering', 'Direct Dining Protocol'],
    identifier: 'urn:uuid:d4e5f678-9012-3456-defa-bc4567890123'
  }
];

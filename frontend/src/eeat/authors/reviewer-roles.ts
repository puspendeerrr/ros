/**
 * Reviewer Roles Taxonomy & Permissions
 * Multi-role peer review governance for enterprise EEAT assurance.
 */

import type { ReviewerRole } from '../types/eeat.types.ts';

export interface ReviewerRoleDefinition {
  role: ReviewerRole;
  title: string;
  description: string;
  responsibilities: string[];
  requiredExperienceYears: number;
}

export const REVIEWER_ROLE_DEFINITIONS: Record<ReviewerRole, ReviewerRoleDefinition> = {
  author: {
    role: 'author',
    title: 'Primary Author / Subject Matter Expert',
    description: 'Direct author responsible for original empirical research, implementation workflows, and technical writing.',
    responsibilities: [
      'Original technical documentation and architecture blueprints',
      'Accurate workflow and step-by-step guidance',
      'Empirical data collection and margin calculations'
    ],
    requiredExperienceYears: 3
  },
  technical_reviewer: {
    role: 'technical_reviewer',
    title: 'Technical Reviewer',
    description: 'System architect validating software specifications, network protocols, offline caching, and API models.',
    responsibilities: [
      'Verification of IndexedDB sync and offline resiliency',
      'Validation of printer network sockets (ESC/POS) and Bluetooth stacks',
      'API payload and JSON schema verification'
    ],
    requiredExperienceYears: 5
  },
  legal_reviewer: {
    role: 'legal_reviewer',
    title: 'Legal & Regulatory Reviewer',
    description: 'Specialist ensuring compliance with payment gateway laws, GST tax invoicing rules, and data privacy regulations.',
    responsibilities: [
      'NPCI UPI payment flow and escrow regulations',
      'GST tax invoice layout, HSN codes, and compliance',
      'Customer phone number privacy and data protection'
    ],
    requiredExperienceYears: 5
  },
  product_reviewer: {
    role: 'product_reviewer',
    title: 'Product & UX Reviewer',
    description: 'Product manager auditing operational ergonomics for chefs, cashiers, and restaurant managers.',
    responsibilities: [
      'Floor operations and dining room turnaround validation',
      'Cashier interface efficiency and error prevention',
      'Kitchen expediter bump bar ergonomics'
    ],
    requiredExperienceYears: 4
  },
  engineering_reviewer: {
    role: 'engineering_reviewer',
    title: 'Principal Engineering Reviewer',
    description: 'Principal engineer reviewing code samples, TypeScript type safety, performance budgets, and security RFCs.',
    responsibilities: [
      'TypeScript strictness and schema correctness',
      'Security.txt RFC 9116 adherence and vulnerability prevention',
      'Lighthouse Core Web Vitals and performance benchmarks'
    ],
    requiredExperienceYears: 7
  }
};

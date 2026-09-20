import type { AuthorProfile, AuthorRole } from './author.model.js';

export const AUTHORS_REGISTRY: Record<string, AuthorProfile> = {
  'ros-editorial-team': {
    id: 'ros-editorial-team',
    slug: 'ros-editorial-team',
    name: 'Restaurant OS Editorial Board',
    role: 'organization',
    jobTitle: 'Research & Standards Group',
    bio: 'The central hospitality research and engineering standards group at Restaurant OS, establishing best practices for commission-free dining infrastructure.',
    avatarUrl: '/assets/logo-icon.png',
    socials: {
      website: 'https://ros.algorithyum.in',
      twitter: 'https://twitter.com/restaurant_os',
      github: 'https://github.com/puspendeerrr/ros'
    },
    expertise: ['Hospitality Systems', 'Commission-Free Economics', 'AEO Architecture'],
    isStaff: true,
    organizationName: 'Restaurant OS'
  },
  'puspender-singh': {
    id: 'puspender-singh',
    slug: 'puspender-singh',
    name: 'Puspender Singh',
    role: 'author',
    jobTitle: 'Principal Systems Architect',
    bio: 'Lead architect building enterprise-grade point of sale, real-time kitchen orchestration, and dynamic QR systems.',
    avatarUrl: '/assets/logo-icon.png',
    socials: {
      github: 'https://github.com/puspendeerrr',
      linkedin: 'https://linkedin.com'
    },
    expertise: ['Cloud POS', 'Offline-First Web Apps', 'Dynamic QR Stand Generation', 'Distributed Systems'],
    credentials: 'Lead Architect',
    isStaff: true
  },
  'security-reviewer': {
    id: 'security-reviewer',
    slug: 'security-reviewer',
    name: 'Hospitality Security Council',
    role: 'reviewer',
    jobTitle: 'Compliance & Verification Office',
    bio: 'Technical reviewing body responsible for validating payment gateway isolation, RFC 9116 security policies, and GST compliance rules.',
    avatarUrl: '/assets/logo-icon.png',
    socials: {
      website: 'https://ros.algorithyum.in/.well-known/security.txt'
    },
    expertise: ['Payment Security', 'Data Privacy', 'GST Architecture'],
    isStaff: true
  },
  'tech-editor': {
    id: 'tech-editor',
    slug: 'tech-editor',
    name: 'Technical Editorial Desk',
    role: 'editor',
    jobTitle: 'Documentation & Developer Standards Editor',
    bio: 'Responsible for API specifications, developer playbooks, and developer guide clarity.',
    avatarUrl: '/assets/logo-icon.png',
    socials: {},
    expertise: ['API Documentation', 'Webhooks', 'Developer Experience'],
    isStaff: true
  }
};

export const AuthorService = {
  getAuthorById(id: string): AuthorProfile | undefined {
    return AUTHORS_REGISTRY[id];
  },

  getAuthorBySlug(slug: string): AuthorProfile | undefined {
    return Object.values(AUTHORS_REGISTRY).find(a => a.slug === slug);
  },

  getAuthorsByRole(role: AuthorRole): AuthorProfile[] {
    return Object.values(AUTHORS_REGISTRY).filter(a => a.role === role);
  },

  getAllAuthors(): AuthorProfile[] {
    return Object.values(AUTHORS_REGISTRY);
  }
};

import { SITE_CONFIG } from '../../config/seo.config.ts';

export const GLOBAL_ENTITY_IDS = {
  organization: `${SITE_CONFIG.origin}/#organization`,
  brand: `${SITE_CONFIG.origin}/#brand`,
  website: `${SITE_CONFIG.origin}/#website`,
  searchAction: `${SITE_CONFIG.origin}/#searchaction`,
  softwareApplication: `${SITE_CONFIG.origin}/#softwareapplication`,
  contactPoint: `${SITE_CONFIG.origin}/#contactpoint`,
  logo: `${SITE_CONFIG.origin}/#logo`
} as const;

export function resolveWebPageId(pageUrl: string): string {
  const cleanUrl = pageUrl.split('#')[0];
  return `${cleanUrl}#webpage`;
}

export function resolveArticleId(pageUrl: string): string {
  const cleanUrl = pageUrl.split('#')[0];
  return `${cleanUrl}#article`;
}

export function resolveTechArticleId(pageUrl: string): string {
  const cleanUrl = pageUrl.split('#')[0];
  return `${cleanUrl}#techarticle`;
}

export function resolvePrimaryImageId(pageUrl: string): string {
  const cleanUrl = pageUrl.split('#')[0];
  return `${cleanUrl}#primaryimage`;
}

export function resolveBreadcrumbId(pageUrl: string): string {
  const cleanUrl = pageUrl.split('#')[0];
  return `${cleanUrl}#breadcrumb`;
}

export function resolveAuthorPersonId(authorSlug: string): string {
  return `${SITE_CONFIG.origin}/authors/${authorSlug}#person`;
}

export function resolveDefinedTermId(glossarySlug: string): string {
  return `${SITE_CONFIG.origin}/resources/glossary/${glossarySlug}#term`;
}

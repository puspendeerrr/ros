import { SITE_CONFIG } from '../../config/seo.config.ts';

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_CONFIG.origin;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_CONFIG.origin}${cleanPath}`;
}

export function isValidHttpUrl(stringToTest: string): boolean {
  try {
    const url = new URL(stringToTest);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isAbsoluteUrl(url: string): boolean {
  return isValidHttpUrl(url);
}

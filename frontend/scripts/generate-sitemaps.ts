/**
 * Build-Time Dynamic Sitemap Generator
 * Automatically generates standard-compliant XML sitemaps:
 * 1. sitemap.xml (All canonical public pages)
 * 2. image-sitemap.xml (Google Image Sitemap for visual media assets)
 * 3. sitemap-index.xml (Sitemap Index unifying all sitemaps)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://ros.algorithyum.in';
const LAST_MOD = new Date().toISOString().split('T')[0];

import { FEATURES_REGISTRY } from '../src/config/features.config.ts';
import { SOLUTIONS_REGISTRY } from '../src/config/solutions.config.ts';
import { INDUSTRIES_REGISTRY } from '../src/config/industries.config.ts';
import { COMPARISONS_REGISTRY } from '../src/config/comparisons.config.ts';
import { 
  DOCUMENTATION_REGISTRY, 
  GLOSSARY_REGISTRY, 
  FAQ_CATEGORIES_REGISTRY, 
  RESOURCES_CATALOG 
} from '../src/config/resources.config.ts';

interface SitemapRoute {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface ImageEntry {
  pagePath: string;
  loc: string;
  title: string;
  caption: string;
}

// Canonical Public Static Pages
const STATIC_ROUTES: SitemapRoute[] = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/features', changefreq: 'weekly', priority: 0.9 },
  { path: '/compare', changefreq: 'weekly', priority: 0.8 },
  { path: '/pricing', changefreq: 'weekly', priority: 0.9 },
  { path: '/customers', changefreq: 'monthly', priority: 0.7 },
  { path: '/docs', changefreq: 'weekly', priority: 0.8 },
  { path: '/resources', changefreq: 'weekly', priority: 0.8 },
  { path: '/resources/glossary', changefreq: 'monthly', priority: 0.7 },
  { path: '/resources/faqs', changefreq: 'weekly', priority: 0.7 },
  { path: '/resources/guides', changefreq: 'weekly', priority: 0.7 },
  { path: '/company/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/company/careers', changefreq: 'monthly', priority: 0.6 },
  { path: '/company/contact', changefreq: 'monthly', priority: 0.8 },
  { path: '/legal/privacy-policy', changefreq: 'yearly', priority: 0.5 },
  { path: '/legal/terms-of-service', changefreq: 'yearly', priority: 0.5 },
  { path: '/changelog', changefreq: 'weekly', priority: 0.6 },
  { path: '/roadmap', changefreq: 'monthly', priority: 0.6 },
  { path: '/api', changefreq: 'weekly', priority: 0.7 },
  { path: '/downloads', changefreq: 'monthly', priority: 0.6 },
];

// Flatten documentation pages from registry
const docRoutes: SitemapRoute[] = Object.values(DOCUMENTATION_REGISTRY).flatMap(cat => 
  cat.articles.map(art => ({
    path: `/docs/latest/${cat.id}/${art.slug}`,
    changefreq: 'monthly' as const,
    priority: 0.7
  }))
);

// Combine Static + Dynamic Catalog Routes
const ROUTES: SitemapRoute[] = [
  ...STATIC_ROUTES,
  ...Object.values(FEATURES_REGISTRY).map(f => ({ path: `/features/${f.slug}`, changefreq: 'weekly' as const, priority: 0.85 })),
  ...Object.values(SOLUTIONS_REGISTRY).map(s => ({ path: `/solutions/${s.slug}`, changefreq: 'weekly' as const, priority: 0.85 })),
  ...Object.values(INDUSTRIES_REGISTRY).map(i => ({ path: `/industries/${i.slug}`, changefreq: 'weekly' as const, priority: 0.85 })),
  ...Object.values(COMPARISONS_REGISTRY).map(c => ({ path: `/compare/${c.slug}`, changefreq: 'weekly' as const, priority: 0.8 })),
  ...docRoutes,
  ...Object.keys(GLOSSARY_REGISTRY).map(slug => ({ path: `/resources/glossary/${slug}`, changefreq: 'monthly' as const, priority: 0.6 })),
  ...Object.keys(FAQ_CATEGORIES_REGISTRY).map(slug => ({ path: `/resources/faqs/${slug}`, changefreq: 'monthly' as const, priority: 0.6 })),
  ...RESOURCES_CATALOG.map(r => ({ path: `/resources/${r.type}/${r.slug}`, changefreq: 'monthly' as const, priority: 0.65 })),
];

// Media assets indexed for Google Image Search
const IMAGES: ImageEntry[] = [
  {
    pagePath: '/',
    loc: `${BASE_URL}/assets/logo.png`,
    title: 'Restaurant OS Official Brand Logo',
    caption: 'Restaurant OS Digital Operating System for Modern Hospitality'
  },
  {
    pagePath: '/',
    loc: `${BASE_URL}/assets/logo-icon.png`,
    title: 'Restaurant OS Brand Icon',
    caption: 'Dynamic QR Code Menu Platform Icon'
  },
  {
    pagePath: '/features',
    loc: `${BASE_URL}/assets/hero.png`,
    title: 'Dynamic QR Table Stand Ecosystem',
    caption: 'Instant smartphone scanning table stand demonstration'
  }
];

function generateMainSitemap(): string {
  const urlEntries = ROUTES.map(route => {
    return `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>
`;
}

function generateImageSitemap(): string {
  // Group images by page path
  const grouped = IMAGES.reduce((acc, img) => {
    if (!acc[img.pagePath]) acc[img.pagePath] = [];
    acc[img.pagePath].push(img);
    return acc;
  }, {} as Record<string, ImageEntry[]>);

  const urlEntries = Object.entries(grouped).map(([pagePath, images]) => {
    const imgXml = images.map(img => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>`).join('\n');

    return `  <url>
    <loc>${BASE_URL}${pagePath}</loc>
${imgXml}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>
`;
}

function generateSitemapIndex(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/image-sitemap.xml</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </sitemap>
</sitemapindex>
`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function runGenerator() {
  const publicDir = path.resolve(__dirname, '../public');
  const distDir = path.resolve(__dirname, '../dist');

  const mainSitemapContent = generateMainSitemap();
  const imageSitemapContent = generateImageSitemap();
  const sitemapIndexContent = generateSitemapIndex();

  const targetDirs = [publicDir];
  if (fs.existsSync(distDir)) {
    targetDirs.push(distDir);
  }

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), mainSitemapContent, 'utf-8');
    fs.writeFileSync(path.join(dir, 'image-sitemap.xml'), imageSitemapContent, 'utf-8');
    fs.writeFileSync(path.join(dir, 'sitemap-index.xml'), sitemapIndexContent, 'utf-8');
  }

  console.log(`[SEO] Generated sitemap.xml, image-sitemap.xml, and sitemap-index.xml successfully in [${targetDirs.join(', ')}].`);
}

// Execute directly if run via CLI
runGenerator();

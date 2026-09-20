import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { buildMetadata, type PageMetadataConfig } from '../config/seo.config.js';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateSoftwareApplicationSchema,
  generateWebPageSchema,
} from '../utils/schema.js';

interface SEOProps extends Partial<PageMetadataConfig> {
  schema?: Record<string, any>;
}

export const SEOManager: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  type,
  ogImage,
  ogImageAlt,
  noIndex,
  author,
  schema,
}) => {
  const { pathname } = useLocation();
  const meta = buildMetadata(pathname, {
    title,
    description,
    keywords,
    type,
    ogImage,
    ogImageAlt,
    noIndex,
    author,
  });

  useEffect(() => {
    // 1. Page Title
    document.title = meta.title;

    // Helper for meta tags
    const updateOrCreateMeta = (attrName: 'name' | 'property', attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for link tags
    const updateOrCreateLink = (rel: string, href: string, extraAttrs?: Record<string, string>) => {
      let selector = `link[rel="${rel}"]`;
      if (extraAttrs?.hreflang) {
        selector += `[hreflang="${extraAttrs.hreflang}"]`;
      }
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (extraAttrs) {
          Object.entries(extraAttrs).forEach(([k, v]) => element!.setAttribute(k, v));
        }
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Metadata
    updateOrCreateMeta('name', 'description', meta.description);
    if (meta.keywords) {
      updateOrCreateMeta('name', 'keywords', meta.keywords);
    } else {
      const existingKeywords = document.querySelector('meta[name="keywords"]');
      if (existingKeywords) existingKeywords.remove();
    }
    updateOrCreateMeta('name', 'author', meta.author);
    updateOrCreateMeta('name', 'publisher', meta.publisher);
    updateOrCreateMeta('name', 'theme-color', meta.themeColor);

    // Search Engine Verification (Google & Bing)
    const gscVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
    if (gscVerification) {
      updateOrCreateMeta('name', 'google-site-verification', gscVerification);
    }
    const bingVerification = import.meta.env.VITE_BING_SITE_VERIFICATION;
    if (bingVerification) {
      updateOrCreateMeta('name', 'msvalidate.01', bingVerification);
    }

    // 3. Robots Directives
    const robotsContent = meta.noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    updateOrCreateMeta('name', 'robots', robotsContent);
    updateOrCreateMeta('name', 'googlebot', robotsContent);

    // 4. OpenGraph Tags
    updateOrCreateMeta('property', 'og:title', meta.rawTitle || meta.title);
    updateOrCreateMeta('property', 'og:description', meta.description);
    updateOrCreateMeta('property', 'og:type', meta.type);
    updateOrCreateMeta('property', 'og:url', meta.canonicalUrl);
    updateOrCreateMeta('property', 'og:site_name', meta.siteName);
    updateOrCreateMeta('property', 'og:locale', meta.locale);
    updateOrCreateMeta('property', 'og:image', meta.ogImage);
    updateOrCreateMeta('property', 'og:image:alt', meta.ogImageAlt);

    // 5. Twitter Card Tags
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:site', meta.twitterHandle);
    updateOrCreateMeta('name', 'twitter:creator', meta.twitterHandle);
    updateOrCreateMeta('name', 'twitter:title', meta.rawTitle || meta.title);
    updateOrCreateMeta('name', 'twitter:description', meta.description);
    updateOrCreateMeta('name', 'twitter:image', meta.ogImage);
    updateOrCreateMeta('name', 'twitter:image:alt', meta.ogImageAlt);

    // 6. Canonical URL
    updateOrCreateLink('canonical', meta.canonicalUrl);

    // 7. Alternate Hreflang Tags (AEO & international search engine signals)
    updateOrCreateLink('alternate', meta.canonicalUrl, { hreflang: 'x-default' });
    updateOrCreateLink('alternate', meta.canonicalUrl, { hreflang: 'en' });
    updateOrCreateLink('alternate', meta.canonicalUrl, { hreflang: 'en-IN' });

    // 8. Structured Data (JSON-LD)
    // Strictly inject only Phase 1 approved schemas:
    // Homepage: Organization, WebSite, SoftwareApplication, SearchAction, WebPage
    // Other pages: WebPage
    const jsonLdGraph: any[] = [];

    const isHomepage = pathname === '/' || pathname === '';

    if (isHomepage) {
      jsonLdGraph.push(
        generateOrganizationSchema(),
        generateWebSiteSchema(),
        generateSoftwareApplicationSchema(),
        generateWebPageSchema(pathname, meta.title, meta.description)
      );
    } else {
      jsonLdGraph.push(generateWebPageSchema(pathname, meta.title, meta.description));
    }

    if (schema) {
      jsonLdGraph.push(schema);
    }

    let schemaScript = document.getElementById('jsonld-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'jsonld-schema';
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': jsonLdGraph,
    });

    return () => {
      // Clean up script on unmount/navigation
      const activeScript = document.getElementById('jsonld-schema');
      if (activeScript) {
        activeScript.remove();
      }
    };
  }, [
    meta.title,
    meta.rawTitle,
    meta.description,
    meta.keywords,
    meta.canonicalUrl,
    meta.type,
    meta.ogImage,
    meta.ogImageAlt,
    meta.noIndex,
    meta.author,
    meta.publisher,
    meta.themeColor,
    meta.locale,
    meta.siteName,
    meta.twitterHandle,
    pathname,
    schema,
  ]);

  return null;
};

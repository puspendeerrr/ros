import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  schema?: Record<string, any>;
}

export const SEOManager: React.FC<SEOProps> = ({ title, description, type = 'website', schema }) => {
  const { pathname } = useLocation();
  const canonicalUrl = `https://ros.algorithyum.in${pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | Restaurant OS`;

    // Helper to get or create element
    const updateOrCreateMeta = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Meta Description
    updateOrCreateMeta('name', 'description', description);

    // 3. Update OpenGraph (OG) tags
    updateOrCreateMeta('property', 'og:title', title);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:type', type);
    updateOrCreateMeta('property', 'og:url', canonicalUrl);
    updateOrCreateMeta('property', 'og:site_name', 'Restaurant OS');

    // 4. Update Twitter Card tags
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', title);
    updateOrCreateMeta('name', 'twitter:description', description);

    // 5. Update Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. Inject Schema JSON-LD if provided
    let schemaScript = document.getElementById('jsonld-schema');
    if (schemaScript) {
      schemaScript.remove();
    }
    if (schema) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'jsonld-schema';
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        ...schema
      });
      document.head.appendChild(schemaScript);
    }

    return () => {
      const scriptToRemove = document.getElementById('jsonld-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, type, canonicalUrl, schema]);

  return null;
};

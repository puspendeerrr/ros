import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getBreadcrumbs } from '../../utils/internalLinking.js';
import { generateBreadcrumbSchema } from '../../utils/schema.js';

export interface BreadcrumbsProps {
  customItems?: Array<{ name: string; url: string }>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const { pathname } = useLocation();
  const items = customItems || getBreadcrumbs(pathname);

  // If only Home, don't show breadcrumbs
  if (items.length <= 1) return null;

  const breadcrumbSchema = generateBreadcrumbSchema(items);

  return (
    <>
      {/* Schema.org BreadcrumbList Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="Breadcrumbs" style={{ padding: '16px 0', fontSize: '13px' }}>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.url} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {isLast ? (
                  <span aria-current="page" style={{ color: '#0F172A', fontWeight: 600 }}>
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link to={item.url} style={{ color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>
                      {item.name}
                    </Link>
                    <span style={{ color: '#CBD5E1', userSelect: 'none' }}>/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

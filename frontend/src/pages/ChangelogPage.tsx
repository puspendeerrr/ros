import React from 'react';
import { Typography, Card, Tag, Timeline } from 'antd';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const ChangelogPage: React.FC = () => {
  const releases = [
    {
      version: 'v2.0.4',
      date: 'September 20, 2026',
      badge: 'Latest',
      highlights: [
        'Enhanced Core Web Vitals optimization with route-based code splitting and resource hints.',
        'W3C Speculation Rules API integration for instant page prerendering.',
        'Dynamic build-time sitemap generator with image-sitemap and sitemap-index support.',
        'Google Consent Mode v2 architecture with privacy-first default states.'
      ]
    },
    {
      version: 'v2.0.0',
      date: 'August 15, 2026',
      badge: 'Major',
      highlights: [
        'Tactile Menu Builder grid with drag-and-drop category restructuring.',
        'Dynamic high-resolution vector QR code stand generator.',
        'Multi-language menu support and allergen badge indicators.',
        'Instant out-of-stock item toggles from manager mobile portal.'
      ]
    }
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Product Changelog & Release Notes | Restaurant OS"
        description="Review the latest platform updates, architectural releases, and feature deployments on Restaurant OS."
      />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <Tag color="orange" style={{ textTransform: 'uppercase', fontWeight: 800, padding: '4px 12px', fontSize: '11px', marginBottom: '16px' }}>
            PRODUCT RELEASES
          </Tag>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 16px 0' }}>
            Platform Changelog
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            A transparent record of platform improvements, speed optimizations, and new features.
          </Paragraph>
        </header>

        <Timeline
          items={releases.map(rel => ({
            color: '#F97316',
            children: (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>{rel.version}</span>
                  <Tag color="orange">{rel.badge}</Tag>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>{rel.date}</span>
                </div>
                <Card style={{ borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#475569', fontSize: '14px' }}>
                    {rel.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            )
          }))}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { Typography, Card, Tag } from 'antd';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const ApiPage: React.FC = () => {
  const endpoints = [
    { method: 'GET', path: '/api/v1/menus/:restaurantSlug', desc: 'Retrieve public catalog categories, dishes, modifiers, and availability.' },
    { method: 'POST', path: '/api/v1/orders', desc: 'Dispatch table or takeaway orders directly into the restaurant POS and KDS.' },
    { method: 'PATCH', path: '/api/v1/items/:itemId/availability', desc: 'Toggle real-time dish availability status (instantly updates diner displays).' },
    { method: 'GET', path: '/api/v1/qr/:tableNumber/stand', desc: 'Generate dynamically routed SVG/PNG vector QR stands for specified tables.' }
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Developer API & Webhooks Reference | Restaurant OS"
        description="Integrate Restaurant OS into external POS terminals, accounting tools, and custom webhooks with our REST API."
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <Tag color="cyan" style={{ textTransform: 'uppercase', fontWeight: 800, padding: '4px 12px', fontSize: '11px', marginBottom: '16px' }}>
            DEVELOPER PLATFORM
          </Tag>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 16px 0' }}>
            REST API & Webhooks
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Build custom integrations, synchronize external inventory systems, and listen for real-time order events.
          </Paragraph>
        </header>

        <section style={{ marginBottom: '64px' }}>
          <Title level={2} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '20px' }}>
            Core Endpoints Overview
          </Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {endpoints.map((ep, i) => (
              <Card key={i} style={{ borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <Tag color={ep.method === 'GET' ? 'green' : ep.method === 'POST' ? 'blue' : 'orange'} style={{ fontWeight: 800, fontSize: '12px' }}>
                    {ep.method}
                  </Tag>
                  <code style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{ep.path}</code>
                </div>
                <Paragraph style={{ color: '#64748B', fontSize: '13.5px', margin: 0 }}>
                  {ep.desc}
                </Paragraph>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

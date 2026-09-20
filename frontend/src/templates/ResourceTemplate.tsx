import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Collapse, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { RESOURCES_CATALOG, GLOSSARY_REGISTRY, FAQ_CATEGORIES_REGISTRY } from '../config/resources.config.js';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export interface ResourceTemplateProps {
  forcedType?: 'guides' | 'glossary' | 'faqs' | 'downloads' | 'changelog' | 'roadmap' | 'api' | 'index';
}

export const ResourceTemplate: React.FC<ResourceTemplateProps> = ({ forcedType }) => {
  const params = useParams<{ type?: string; slug?: string }>();
  const navigate = useNavigate();

  const activeType = forcedType || params.type || 'index';
  const slug = params.slug;

  // 1. Glossary Sub-view
  if (activeType === 'glossary') {
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
        <SEOManager
          title="Hospitality & Restaurant Technology Glossary | Restaurant OS"
          description="Comprehensive definitions of digital menu concepts, KDS dispatching, zero-commission economics, and POS architecture."
        />
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Breadcrumbs />
          <header style={{ margin: '32px 0 48px 0', textAlign: 'center' }}>
            <Title level={1} style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A' }}>
              Hospitality Technology Glossary
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
              Authoritative industry terminology and architectural definitions for modern dining operations.
            </Paragraph>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(GLOSSARY_REGISTRY).map(([key, item]) => (
              <Card key={key} id={key} style={{ borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Title level={3} style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    {item.term}
                  </Title>
                  <Tag color="orange">{item.category}</Tag>
                </div>
                <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {item.definition}
                </Paragraph>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. FAQ Library Sub-view
  if (activeType === 'faqs') {
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
        <SEOManager
          title="FAQ Knowledge Library | Restaurant OS Support"
          description="Categorized frequently asked questions regarding QR table stands, digital menus, billing, and merchant onboarding."
        />
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Breadcrumbs />
          <header style={{ margin: '32px 0 48px 0', textAlign: 'center' }}>
            <Title level={1} style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A' }}>
              FAQ Knowledge Library
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
              Find instant answers across billing, hardware, QR menus, and operational setup.
            </Paragraph>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {Object.entries(FAQ_CATEGORIES_REGISTRY).map(([catId, cat]) => (
              <div key={catId}>
                <Title level={2} style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  {cat.name}
                </Title>
                <Collapse
                  accordion
                  ghost
                  items={cat.faqs.map((f, idx) => ({
                    key: String(idx),
                    label: <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>{f.q}</span>,
                    style: { background: '#F8FAFC', borderRadius: '12px', marginBottom: '8px', border: '1px solid #E2E8F0' },
                    children: <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{f.a}</Paragraph>
                  }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Single Guide or Resource Article
  if (slug) {
    const resource = RESOURCES_CATALOG.find(r => r.slug === slug) || RESOURCES_CATALOG[0];
    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
        <SEOManager
          title={`${resource.title} | Restaurant OS Resources`}
          description={resource.summary}
        />
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Breadcrumbs />
          <article style={{ marginTop: '32px' }}>
            <header style={{ marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                <Tag color="orange" style={{ textTransform: 'uppercase', fontWeight: 700 }}>{resource.type}</Tag>
                <span style={{ fontSize: '12px', color: '#64748B' }}>{resource.category}</span>
                {resource.readingTime && <span style={{ fontSize: '12px', color: '#64748B' }}>• {resource.readingTime}</span>}
              </div>
              <Title level={1} style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', margin: '0 0 16px 0' }}>
                {resource.title}
              </Title>
              <Paragraph style={{ fontSize: '17px', color: '#64748B', lineHeight: '1.6' }}>
                {resource.summary}
              </Paragraph>
              <div style={{ display: 'flex', gap: '16px', color: '#94A3B8', fontSize: '13px', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', padding: '12px 0' }}>
                <span>By {resource.author}</span>
                <span>•</span>
                <span>Last Updated: {resource.lastUpdated}</span>
              </div>
            </header>

            <Card style={{ borderRadius: '16px', border: '1px solid #E2E8F0', background: '#F8FAFC', padding: '20px' }}>
              <Title level={3} style={{ fontSize: '18px', fontWeight: 800 }}>
                Playbook & Strategic Guidance
              </Title>
              <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                This resource details the technical methodology, diner behavioral metrics, and operational steps for {resource.title.toLowerCase()}.
              </Paragraph>
            </Card>
          </article>
        </div>
      </div>
    );
  }

  // 4. Default: Resource Center Index Overview
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Resource Center & Hospitality Knowledge Hub | Restaurant OS"
        description="Guides, case studies, printable downloads, and technical documentation for modern restaurateurs."
      />
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Breadcrumbs />
        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <Title level={1} style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A' }}>
            Resource Center
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Hospitality playbooks, technical documentation, printable stand assets, and industry research.
          </Paragraph>
        </header>

        <Row gutter={[24, 24]}>
          {RESOURCES_CATALOG.map(res => (
            <Col xs={24} md={12} key={res.slug}>
              <Card
                hoverable
                onClick={() => navigate(`/resources/${res.type}/${res.slug}`)}
                style={{ borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Tag color="orange" style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '10px' }}>{res.type}</Tag>
                  {res.readingTime && <span style={{ fontSize: '11px', color: '#94A3B8' }}>{res.readingTime}</span>}
                </div>
                <Title level={3} style={{ fontSize: '17px', fontWeight: 750, margin: '4px 0 8px 0', color: '#0F172A' }}>
                  {res.title}
                </Title>
                <Paragraph style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                  {res.summary}
                </Paragraph>
                <span style={{ fontSize: '13px', color: '#F97316', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Read Resource <ArrowRightOutlined style={{ fontSize: '11px' }} />
                </span>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

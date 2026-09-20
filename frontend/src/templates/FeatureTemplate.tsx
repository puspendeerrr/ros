import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Button, Collapse } from 'antd';
import { CheckOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { FEATURES_REGISTRY, FEATURE_CATEGORIES } from '../config/features.config.js';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';
import { getRelatedFeatures, getRecommendedReading } from '../utils/internalLinking.js';

const { Title, Paragraph, Text } = Typography;

export const FeatureTemplate: React.FC<{ forcedSlug?: string }> = ({ forcedSlug }) => {
  const params = useParams<{ slug: string }>();
  const slug = forcedSlug || params.slug || 'qr-menu';
  const navigate = useNavigate();

  const feature = FEATURES_REGISTRY[slug] || FEATURES_REGISTRY['qr-menu'];
  const categoryInfo = FEATURE_CATEGORIES[feature.category];
  const relatedFeatures = getRelatedFeatures(feature.slug, 3);
  const relatedGuides = getRecommendedReading(feature.relatedGuideSlugs, 2);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title={`${feature.name} | Restaurant OS Features`}
        description={feature.summary}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs />

        {/* Feature Header */}
        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '6px 16px', borderRadius: '30px', marginBottom: '16px' }}>
            <span style={{ color: '#EA580C', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {categoryInfo.label}
            </span>
            {feature.badge && (
              <span style={{ background: '#EA580C', color: '#FFFFFF', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}>
                {feature.badge}
              </span>
            )}
          </div>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            {feature.name}
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '720px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            {feature.tagline}
          </Paragraph>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/signup')}
              style={{ background: '#F97316', borderColor: '#F97316', height: '48px', padding: '0 32px', borderRadius: '10px', fontWeight: 700 }}
            >
              Get Started Free
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => navigate('/company/contact')}
              style={{ height: '48px', padding: '0 28px', borderRadius: '10px', fontWeight: 600 }}
            >
              Contact Sales
            </Button>
          </div>
        </header>

        {/* Overview & Highlight Capabilities */}
        <section style={{ marginBottom: '64px' }}>
          <Card
            style={{
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              background: '#F8FAFC',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)'
            }}
          >
            <Row gutter={[48, 32]} align="middle">
              <Col xs={24} md={12}>
                <Title level={2} style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  Architecture & Overview
                </Title>
                <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
                  {feature.summary}
                </Paragraph>
                <div style={{ display: 'flex', gap: '16px', color: '#94A3B8', fontSize: '12px' }}>
                  <span>Updated: September 2026</span>
                  <span>•</span>
                  <span>Engineering Team Verified</span>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px', marginBottom: '16px' }}>
                    KEY SYSTEM CAPABILITIES
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {feature.highlightCapabilities.map((cap, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                          <CheckOutlined style={{ color: '#16A34A', fontSize: '11px' }} />
                        </div>
                        <span style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </section>

        {/* Related Features Internal Linking */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Complementary Features
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Connect with other modules to build your unified operating stack.
            </Text>
          </div>
          <Row gutter={[24, 24]}>
            {relatedFeatures.map(rf => (
              <Col xs={24} md={8} key={rf.slug}>
                <Card
                  hoverable
                  onClick={() => navigate(`/features/${rf.slug}`)}
                  style={{ borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%' }}
                >
                  <Title level={4} style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>
                    {rf.name}
                  </Title>
                  <Paragraph style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                    {rf.tagline}
                  </Paragraph>
                  <span style={{ fontSize: '13px', color: '#F97316', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Explore Feature <ArrowRightOutlined style={{ fontSize: '11px' }} />
                  </span>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Feature FAQs (AEO Ready) */}
        {feature.faqs.length > 0 && (
          <section style={{ marginBottom: '64px' }} data-aeo-type="faq">
            <div style={{ marginBottom: '24px' }}>
              <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Frequently Asked Questions
              </Title>
            </div>
            <Collapse
              accordion
              ghost
              items={feature.faqs.map((faq, idx) => ({
                key: String(idx),
                label: <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>{faq.question}</span>,
                style: { background: '#F8FAFC', borderRadius: '12px', marginBottom: '8px', border: '1px solid #E2E8F0' },
                children: <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{faq.answer}</Paragraph>
              }))}
            />
          </section>
        )}

        {/* Related Guides Internal Linking */}
        {relatedGuides.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ marginBottom: '24px' }}>
              <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Recommended Guides & Best Practices
              </Title>
            </div>
            <Row gutter={[24, 24]}>
              {relatedGuides.map(rg => (
                <Col xs={24} sm={12} key={rg.slug}>
                  <div style={{ padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase' }}>
                      {rg.category} • {rg.readingTime}
                    </span>
                    <Title level={4} style={{ fontSize: '15px', fontWeight: 700, margin: '6px 0' }}>
                      <Link to={`/resources/${rg.type}/${rg.slug}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                        {rg.title}
                      </Link>
                    </Title>
                    <Paragraph style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>{rg.summary}</Paragraph>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* Reusable Conversion CTA Block */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '20px',
            padding: '48px 32px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <Title level={2} style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 800, margin: '0 0 12px 0' }}>
            Ready to Deploy {feature.name}?
          </Title>
          <Paragraph style={{ color: '#94A3B8', fontSize: '15px', maxWidth: '520px', margin: '0 auto 24px auto' }}>
            Launch your digital menu stands and catalog in less than 5 minutes with 0% commissions.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/signup')}
            style={{ background: '#F97316', borderColor: '#F97316', height: '48px', padding: '0 32px', borderRadius: '10px', fontWeight: 700 }}
          >
            Start Free Now
          </Button>
        </section>
      </div>
    </div>
  );
};

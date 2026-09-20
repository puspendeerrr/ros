import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Button, Collapse } from 'antd';
import { CheckOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { INDUSTRIES_REGISTRY } from '../config/industries.config.js';
import { FEATURES_REGISTRY } from '../config/features.config.js';
import { SOLUTIONS_REGISTRY } from '../config/solutions.config.js';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph, Text } = Typography;

export const IndustryTemplate: React.FC<{ forcedSlug?: string }> = ({ forcedSlug }) => {
  const params = useParams<{ slug: string }>();
  const slug = forcedSlug || params.slug || 'cafes';
  const navigate = useNavigate();

  const industry = INDUSTRIES_REGISTRY[slug] || INDUSTRIES_REGISTRY['cafes'];
  const keyFeatures = industry.keyFeatureSlugs
    .map(fSlug => FEATURES_REGISTRY[fSlug])
    .filter(Boolean);
  const recommendedSolutions = industry.recommendedSolutionSlugs
    .map(sSlug => SOLUTIONS_REGISTRY[sSlug])
    .filter(Boolean);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title={`${industry.name} | Restaurant OS for Hospitality Verticals`}
        description={industry.summary}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Breadcrumbs />

        {/* Header */}
        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#ECFDF5', border: '1px solid #D1FAE5', padding: '6px 16px', borderRadius: '30px', marginBottom: '16px' }}>
            <span style={{ color: '#059669', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              HOSPITALITY VERTICAL
            </span>
          </div>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            {industry.name}
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '720px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            {industry.tagline}
          </Paragraph>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/signup')}
              style={{ background: '#F97316', borderColor: '#F97316', height: '48px', padding: '0 32px', borderRadius: '10px', fontWeight: 700 }}
            >
              Start Free Setup
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => navigate('/company/contact')}
              style={{ height: '48px', padding: '0 28px', borderRadius: '10px', fontWeight: 600 }}
            >
              Talk to Specialist
            </Button>
          </div>
        </header>

        {/* Industry Challenges Solved */}
        <section style={{ marginBottom: '64px' }}>
          <Card style={{ borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', background: '#F8FAFC' }}>
            <Title level={2} style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Sector Operational Profile
            </Title>
            <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
              {industry.summary}
            </Paragraph>
            <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px', marginBottom: '16px' }}>
              CHALLENGES ELIMINATED BY RESTAURANT OS
            </div>
            <Row gutter={[20, 20]}>
              {industry.challengesSolved.map((chal, idx) => (
                <Col xs={24} md={8} key={idx}>
                  <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', height: '100%' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <CheckOutlined style={{ color: '#059669', fontSize: '12px' }} />
                    </div>
                    <Paragraph style={{ color: '#1E293B', fontSize: '14px', fontWeight: 600, lineHeight: '1.6', margin: 0 }}>
                      {chal}
                    </Paragraph>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </section>

        {/* Key Feature Modules */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Tailored System Features
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Core modules selected specifically for {industry.name.toLowerCase()}.
            </Text>
          </div>
          <Row gutter={[24, 24]}>
            {keyFeatures.map(kf => (
              <Col xs={24} sm={12} md={6} key={kf.slug}>
                <Card
                  hoverable
                  onClick={() => navigate(`/features/${kf.slug}`)}
                  style={{ borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%' }}
                >
                  <Title level={4} style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px 0' }}>
                    {kf.name}
                  </Title>
                  <Paragraph style={{ color: '#64748B', fontSize: '12.5px', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                    {kf.summary.slice(0, 80)}...
                  </Paragraph>
                  <span style={{ fontSize: '12.5px', color: '#F97316', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    View Module <ArrowRightOutlined style={{ fontSize: '10px' }} />
                  </span>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Recommended Solutions */}
        {recommendedSolutions.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ marginBottom: '24px' }}>
              <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Complementary Solutions
              </Title>
            </div>
            <Row gutter={[20, 20]}>
              {recommendedSolutions.map(rs => (
                <Col xs={24} sm={12} key={rs.slug}>
                  <div
                    onClick={() => navigate(`/solutions/${rs.slug}`)}
                    style={{ padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', cursor: 'pointer', background: '#FFFFFF' }}
                  >
                    <div style={{ fontWeight: 750, color: '#0F172A', fontSize: '15px' }}>{rs.name}</div>
                    <div style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>{rs.tagline}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* FAQs */}
        {industry.faqs.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ marginBottom: '24px' }}>
              <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Frequently Asked Questions
              </Title>
            </div>
            <Collapse
              accordion
              ghost
              items={industry.faqs.map((faq, idx) => ({
                key: String(idx),
                label: <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>{faq.question}</span>,
                style: { background: '#F8FAFC', borderRadius: '12px', marginBottom: '8px', border: '1px solid #E2E8F0' },
                children: <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{faq.answer}</Paragraph>
              }))}
            />
          </section>
        )}
      </div>
    </div>
  );
};

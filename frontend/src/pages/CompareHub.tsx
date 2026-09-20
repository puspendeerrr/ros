import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { COMPARISONS_REGISTRY } from '../config/comparisons.config.js';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const CompareHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Restaurant OS Comparisons | Side-by-Side Architectural Breakdown"
        description="See how Restaurant OS outperforms paper menus, delivery aggregator commissions, and legacy hardware POS."
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <Tag color="orange" style={{ textTransform: 'uppercase', fontWeight: 800, padding: '4px 12px', fontSize: '11px', marginBottom: '16px' }}>
            SIDE-BY-SIDE EVALUATION
          </Tag>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            Commercial Comparisons
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Direct architectural comparisons against traditional restaurant operational workflows.
          </Paragraph>
        </header>

        <Row gutter={[24, 24]}>
          {Object.values(COMPARISONS_REGISTRY).map(comp => (
            <Col xs={24} md={8} key={comp.slug}>
              <Card
                hoverable
                onClick={() => navigate(`/compare/${comp.slug}`)}
                style={{ borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%' }}
              >
                <Tag color="blue" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                  {comp.competitorCategory}
                </Tag>
                <Title level={3} style={{ fontSize: '18px', fontWeight: 750, color: '#0F172A', margin: '8px 0' }}>
                  {comp.title}
                </Title>
                <Paragraph style={{ color: '#64748B', fontSize: '13.5px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                  {comp.summary}
                </Paragraph>
                <span style={{ fontSize: '13px', color: '#F97316', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Read Breakdown <ArrowRightOutlined style={{ fontSize: '11px' }} />
                </span>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

import React from 'react';
import { Typography, Row, Col, Card, Tag } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const RoadmapPage: React.FC = () => {
  const columns = [
    {
      status: 'In Progress',
      color: '#F97316',
      icon: <SyncOutlined spin style={{ color: '#F97316' }} />,
      items: [
        { title: 'Razorpay & UPI Table Checkout', desc: 'Allow diners to settle orders directly through dynamic UPI QR codes on their phone screen.' },
        { title: 'Offline Table Session Sync', desc: 'Peer-to-peer tablet sync for KDS stations during local internet outages.' }
      ]
    },
    {
      status: 'Planned Next',
      color: '#3B82F6',
      icon: <ClockCircleOutlined style={{ color: '#3B82F6' }} />,
      items: [
        { title: 'White-Label Custom Domain Routing', desc: 'Bind menu.yourbrand.com directly to your restaurant profile.' },
        { title: 'Kitchen Recipe Yield Costing', desc: 'Automated cost-per-plate metrics tied to ingredient purchase orders.' }
      ]
    },
    {
      status: 'Recently Shipped',
      color: '#10B981',
      icon: <CheckCircleOutlined style={{ color: '#10B981' }} />,
      items: [
        { title: 'Vector Table Stand Generator', desc: 'Instant SVG & PNG dynamic table stands with custom numbering.' },
        { title: 'Core Web Vitals Architecture', desc: 'Sub-second edge menu rendering with route-based code splitting.' }
      ]
    }
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Public Product Roadmap | Restaurant OS"
        description="Explore upcoming feature releases, technical milestones, and our long-term product vision."
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <Tag color="orange" style={{ textTransform: 'uppercase', fontWeight: 800, padding: '4px 12px', fontSize: '11px', marginBottom: '16px' }}>
            PRODUCT VISION
          </Tag>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 16px 0' }}>
            Product Roadmap
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Transparency in our engineering priorities. See what we are building, what is next, and what has shipped.
          </Paragraph>
        </header>

        <Row gutter={[24, 24]}>
          {columns.map((col, idx) => (
            <Col xs={24} md={8} key={idx}>
              <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  {col.icon}
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{col.status}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.items.map((item, i) => (
                    <Card key={i} style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 750, color: '#0F172A', fontSize: '14.5px', marginBottom: '4px' }}>
                        {item.title}
                      </div>
                      <Paragraph style={{ color: '#64748B', fontSize: '12.5px', lineHeight: '1.5', margin: 0 }}>
                        {item.desc}
                      </Paragraph>
                    </Card>
                  ))}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

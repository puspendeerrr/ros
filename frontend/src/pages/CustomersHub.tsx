import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Button } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const CustomersHub: React.FC = () => {
  const navigate = useNavigate();

  const caseStories = [
    {
      name: 'The Spice Library',
      location: 'Bandra West, Mumbai',
      type: 'Fine Dining Bistro',
      stats: '100% Paperless Dining Room',
      quote: 'Restaurant OS completely cut out our monthly print menu costs. Updates take literally seconds instead of days.'
    },
    {
      name: 'The Coconut Grove',
      location: 'Indiranagar, Bengaluru',
      type: 'Specialty Cafe & Kitchen',
      stats: '18min Faster Table Turnover',
      quote: 'The QR menu generator is incredibly smooth. Our guests scan, view, and table turnover velocity increased notably.'
    },
    {
      name: 'Punjab Grill Dhaba',
      location: 'Cyber City, Gurugram',
      type: 'High-Volume QSR & Dhaba',
      stats: '0% Aggregator Commission',
      quote: '0% commission is a true game changer. We shifted dine-in and takeaway completely to our direct Restaurant OS catalog.'
    }
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Customer Stories & Case Studies | Restaurant OS"
        description="See how Indian cafes, cloud kitchens, and restaurants operate commission-free with Restaurant OS."
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 16px 0' }}>
            Customer Stories
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            How forward-thinking restaurateurs eliminate printing invoices and keep 100% of their operational margins.
          </Paragraph>
        </header>

        <Row gutter={[24, 24]} style={{ marginBottom: '64px' }}>
          {caseStories.map((story, i) => (
            <Col xs={24} md={8} key={i}>
              <Card style={{ borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%', padding: '12px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, idx) => (
                    <StarFilled key={idx} style={{ color: '#F59E0B' }} />
                  ))}
                </div>
                <Paragraph style={{ color: '#334155', fontSize: '15px', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '24px' }}>
                  "{story.quote}"
                </Paragraph>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '16px' }}>{story.name}</div>
                  <div style={{ color: '#64748B', fontSize: '13px' }}>{story.location} • {story.type}</div>
                  <div style={{ color: '#F97316', fontWeight: 700, fontSize: '12.5px', marginTop: '6px' }}>
                    {story.stats}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

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
            Join Hundreds of Restaurants Going Digital
          </Title>
          <Paragraph style={{ color: '#94A3B8', fontSize: '15px', maxWidth: '520px', margin: '0 auto 24px auto' }}>
            Launch your commission-free digital menu and dynamic QR table stands in under 5 minutes.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/signup')}
            style={{ background: '#F97316', borderColor: '#F97316', height: '48px', padding: '0 32px', borderRadius: '10px', fontWeight: 700 }}
          >
            Start Free
          </Button>
        </section>
      </div>
    </div>
  );
};

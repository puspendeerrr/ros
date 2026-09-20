import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card, Button, Tag } from 'antd';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const CareersPage: React.FC = () => {
  const navigate = useNavigate();

  const openings = [
    { title: 'Senior Frontend Engineer (React + TS)', dept: 'Engineering', location: 'Remote / Bengaluru', type: 'Full-time' },
    { title: 'Backend Systems Engineer (Node / Cloud)', dept: 'Engineering', location: 'Remote / Bengaluru', type: 'Full-time' },
    { title: 'Hospitality Growth & Merchant Success Manager', dept: 'Operations', location: 'Mumbai / Delhi NCR', type: 'Full-time' }
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Careers at Restaurant OS | Building Hospitality Technology"
        description="Join Restaurant OS engineering and product teams building the commission-free operating system for modern dining."
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <Tag color="orange" style={{ textTransform: 'uppercase', fontWeight: 800, padding: '4px 12px', fontSize: '11px', marginBottom: '16px' }}>
            WE ARE HIRING
          </Tag>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 16px 0' }}>
            Build the Future of Dining
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            We are building commission-free technology that empowers independent restaurants and culinary creators.
          </Paragraph>
        </header>

        <section style={{ marginBottom: '64px' }}>
          <Title level={2} style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>
            Open Positions
          </Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {openings.map((job, idx) => (
              <Card key={idx} style={{ borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 750, color: '#0F172A' }}>{job.title}</div>
                    <div style={{ color: '#64748B', fontSize: '13.5px', marginTop: '4px' }}>
                      {job.dept} • {job.location} • {job.type}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => navigate('/company/contact')}
                    style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '8px', fontWeight: 600 }}
                  >
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

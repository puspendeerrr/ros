import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Button, Table, Tag } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const PricingTemplate: React.FC = () => {
  const navigate = useNavigate();

  const matrixData = [
    { feature: 'Commission Fee on Orders', starter: '0%', growth: '0%', enterprise: '0%' },
    { feature: 'Digital Menu & Public Webpage', starter: true, growth: true, enterprise: true },
    { feature: 'Dynamic QR Stand Generation', starter: 'Unlimited', growth: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Real-time Item Availability Sync', starter: true, growth: true, enterprise: true },
    { feature: 'Cloud POS Terminal Access', starter: '1 Device', growth: 'Up to 5 Devices', enterprise: 'Unlimited Devices' },
    { feature: 'Kitchen Display System (KDS)', starter: false, growth: true, enterprise: true },
    { feature: 'Recipe-Based Inventory', starter: false, growth: true, enterprise: true },
    { feature: 'Multi-Branch Master Management', starter: false, growth: false, enterprise: true },
    { feature: 'Dedicated Account Manager', starter: false, growth: false, enterprise: true },
  ];

  const columns = [
    { title: 'Platform Capability', dataIndex: 'feature', key: 'feature', render: (text: string) => <span style={{ fontWeight: 650 }}>{text}</span> },
    {
      title: 'Early Access Launch',
      dataIndex: 'starter',
      key: 'starter',
      render: (val: any) => typeof val === 'boolean'
        ? (val ? <CheckOutlined style={{ color: '#16A34A', fontSize: '16px' }} /> : <span style={{ color: '#94A3B8' }}>—</span>)
        : <span style={{ fontWeight: 700, color: '#F97316' }}>{val}</span>
    },
    {
      title: 'Growth Tier',
      dataIndex: 'growth',
      key: 'growth',
      render: (val: any) => typeof val === 'boolean'
        ? (val ? <CheckOutlined style={{ color: '#16A34A', fontSize: '16px' }} /> : <span style={{ color: '#94A3B8' }}>—</span>)
        : <span style={{ fontWeight: 600 }}>{val}</span>
    },
    {
      title: 'Enterprise Multi-Unit',
      dataIndex: 'enterprise',
      key: 'enterprise',
      render: (val: any) => typeof val === 'boolean'
        ? (val ? <CheckOutlined style={{ color: '#16A34A', fontSize: '16px' }} /> : <span style={{ color: '#94A3B8' }}>—</span>)
        : <span style={{ fontWeight: 600 }}>{val}</span>
    },
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Commission-Free Pricing & Plan Matrix | Restaurant OS"
        description="Transparent 0% commission pricing for restaurants and cafes. Unlimited QR scans, digital menus, and cloud hosting."
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '6px 16px', borderRadius: '30px', marginBottom: '16px' }}>
            <span style={{ color: '#EA580C', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              TRANSPARENT 0% COMMISSION PRICING
            </span>
          </div>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            Predictable, Commission-Free Plans
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            No transaction percentage fees, no menu view limits, and no credit card required during early launch.
          </Paragraph>
        </header>

        {/* Pricing Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '64px' }} justify="center">
          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: '20px',
                border: '2px solid #F97316',
                padding: '16px',
                background: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(249, 115, 22, 0.08)',
                position: 'relative'
              }}
            >
              <Tag color="orange" style={{ position: 'absolute', top: '-12px', right: '20px', fontWeight: 800 }}>
                ACTIVE LAUNCH TIER
              </Tag>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Early Access</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#F97316', margin: '16px 0' }}>
                ₹0 <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>/ month</span>
              </div>
              <Paragraph style={{ color: '#64748B', fontSize: '13.5px' }}>
                Everything independent restaurants and cafes need to deploy digital QR stands.
              </Paragraph>
              <Button
                type="primary"
                block
                size="large"
                onClick={() => navigate('/signup')}
                style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', fontWeight: 700, height: '46px', margin: '16px 0 24px 0' }}
              >
                Start Free — No Credit Card
              </Button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#334155' }}>
                <div>✓ 0% commission on orders</div>
                <div>✓ Unlimited categories & dishes</div>
                <div>✓ Unlimited table QR code stands</div>
                <div>✓ Cloud-hosted public menu</div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card style={{ borderRadius: '20px', border: '1px solid #E2E8F0', padding: '16px', background: '#F8FAFC' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Growth</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', margin: '16px 0' }}>
                ₹1,499 <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>/ month (Future)</span>
              </div>
              <Paragraph style={{ color: '#64748B', fontSize: '13.5px' }}>
                For high-volume restaurants requiring kitchen bump screens and ingredient tracking.
              </Paragraph>
              <Button
                type="default"
                block
                size="large"
                onClick={() => navigate('/company/contact')}
                style={{ borderRadius: '10px', fontWeight: 600, height: '46px', margin: '16px 0 24px 0' }}
              >
                Join Waitlist
              </Button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#64748B' }}>
                <div>✓ Everything in Early Access</div>
                <div>✓ Kitchen Display System (KDS)</div>
                <div>✓ Multi-device POS support</div>
                <div>✓ Recipe-based inventory tracking</div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card style={{ borderRadius: '20px', border: '1px solid #E2E8F0', padding: '16px', background: '#F8FAFC' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Enterprise</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', margin: '16px 0' }}>
                Custom
              </div>
              <Paragraph style={{ color: '#64748B', fontSize: '13.5px' }}>
                Tailored SLA, franchise menu inheritance, and dedicated account managers for restaurant chains.
              </Paragraph>
              <Button
                type="default"
                block
                size="large"
                onClick={() => navigate('/company/contact')}
                style={{ borderRadius: '10px', fontWeight: 600, height: '46px', margin: '16px 0 24px 0' }}
              >
                Contact Enterprise Sales
              </Button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#64748B' }}>
                <div>✓ Multi-branch master management</div>
                <div>✓ Custom API & webhook integrations</div>
                <div>✓ Dedicated onboarding specialist</div>
                <div>✓ 99.9% uptime enterprise SLA</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Plan Comparison Table */}
        <section style={{ marginBottom: '64px' }}>
          <Title level={2} style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 20px 0', color: '#0F172A' }}>
            Complete Capability Matrix
          </Title>
          <Table
            dataSource={matrixData.map((d, i) => ({ ...d, key: String(i) }))}
            columns={columns}
            pagination={false}
            bordered
            style={{ borderRadius: '14px', overflow: 'hidden' }}
          />
        </section>
      </div>
    </div>
  );
};

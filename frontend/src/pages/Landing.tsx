import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Card, Row, Col, Typography, Collapse, Table } from 'antd';
import { motion } from 'framer-motion';
import {
  QrcodeOutlined,
  BuildOutlined,
  ShopOutlined,
  GlobalOutlined,
  LineChartOutlined,
  SyncOutlined,
  MobileOutlined,
  ThunderboltOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons';
import logoIcon from '../assets/logo-icon.png';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <QrcodeOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'QR Menu Generator',
      description: 'Generate customizable, high-resolution QR codes that link directly to your digital menu.',
    },
    {
      icon: <BuildOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Digital Menu Builder',
      description: 'Manage food categories, items, pricing, availability, and details in a fast admin interface.',
    },
    {
      icon: <ShopOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Restaurant Profile',
      description: 'Establish your brand with customizable covers, logos, locations, maps, and hours.',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Public Web Menus',
      description: 'A lightning-fast, SEO-optimized public website for your menu, hosted on a premium domain.',
    },
    {
      icon: <LineChartOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Analytics & Insights',
      description: 'Understand customer preferences with visual data reports and profile completion stats.',
    },
    {
      icon: <SyncOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Real-Time Sync',
      description: 'Updates to items or availability are instantly reflected on customer viewports.',
    },
    {
      icon: <MobileOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Multi-Device Support',
      description: 'Optimized for mobile, tablet, and desktop. Manage your kitchen from anywhere.',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Lightning Setup',
      description: 'Get your restaurant online and print your first QR menu in less than 5 minutes.',
    },
  ];

  const comparisonColumns = [
    { title: 'Feature', dataIndex: 'feature', key: 'feature', width: '30%' },
    { 
      title: <span style={{ color: '#F97316', fontWeight: 700 }}>Restaurant OS</span>, 
      dataIndex: 'ros', 
      key: 'ros',
      render: (val: boolean | string) => typeof val === 'string' ? <strong>{val}</strong> : (val ? <CheckCircleTwoTone twoToneColor="#22C55E" style={{ fontSize: '18px' }} /> : <CloseCircleTwoTone twoToneColor="#EF4444" style={{ fontSize: '18px' }} />)
    },
    { 
      title: 'Printed Menus', 
      dataIndex: 'printed', 
      key: 'printed',
      render: (val: boolean | string) => typeof val === 'string' ? val : (val ? <CheckCircleTwoTone twoToneColor="#22C55E" style={{ fontSize: '16px' }} /> : <CloseCircleTwoTone twoToneColor="#EF4444" style={{ fontSize: '16px' }} />)
    },
    { 
      title: 'Marketplace Apps', 
      dataIndex: 'market', 
      key: 'market',
      render: (val: boolean | string) => typeof val === 'string' ? val : (val ? <CheckCircleTwoTone twoToneColor="#22C55E" style={{ fontSize: '16px' }} /> : <CloseCircleTwoTone twoToneColor="#EF4444" style={{ fontSize: '16px' }} />)
    },
  ];

  const comparisonData = [
    { key: 1, feature: 'Commission Fee', ros: '0% Always', printed: 'None', market: '15% - 30% Per Order' },
    { key: 2, feature: 'Instant Updates', ros: true, printed: false, market: true },
    { key: 3, feature: 'QR Ordering Ready', ros: true, printed: false, market: false },
    { key: 4, feature: 'Customer Analytics', ros: true, printed: false, market: false },
    { key: 5, feature: 'Brand Ownership', ros: 'Full Control', printed: 'Limited', market: 'Stolen Visibility' },
    { key: 6, feature: 'Operational Cost', ros: 'Free Startup', printed: 'High Re-print cost', market: 'High commissions' },
    { key: 7, feature: 'Self-Setup Time', ros: '5 Minutes', printed: 'Days (Design & Print)', market: 'Weeks (Approval)' },
  ];

  const faqs = [
    { q: 'What is Restaurant OS?', a: 'Restaurant OS is a modern, digital operating system built for restaurants. It offers digital menu building, dynamic QR menu creation, and premium public website pages so you can serve customers without relying on expensive aggregators.' },
    { q: 'Is Restaurant OS really free?', a: 'Yes! Our Starter plan is 100% free with unlimited categories, items, and QR code scans. We believe restaurants should own their digital relationships without paying a dime in commissions.' },
    { q: 'Do I need to download any app?', a: 'No, Restaurant OS is a web-based platform. You can access the manager portal from any browser on your computer, tablet, or smartphone. Customers simply scan your QR code to view the menu instantly on their phones.' },
    { q: 'How do customers view the menu?', a: 'Customers scan the printed QR code placed on their tables or counters. The menu loads instantly as a fast-loading, beautiful mobile website, with no app download required.' },
    { q: 'Can I change my menu items or prices in real time?', a: 'Absolutely! Any changes you make to categories, prices, descriptions, or availability in the Menu Builder are updated instantly on the public menu page.' },
    { q: 'Does it support images for menu items?', a: 'Yes. You can upload high-resolution images for each menu item to give your guests a premium visual dining preview.' },
    { q: 'How do I download my QR code?', a: 'Under the QR Menu tab, you can generate your QR code and download it instantly as a high-quality SVG or PNG file suitable for professional printing.' },
    { q: 'Is my data secure?', a: 'Yes. We run on secure, cloud-based hosting infrastructure, and all traffic is encrypted over HTTPS. Your session is protected by top-grade authentication protocols.' },
    { q: 'Can I customize the look of my public menu?', a: 'Yes, your public menu automatically pulls your restaurant logo, custom cover banner, description, and contact info, presenting it in a modern, floating-card layout.' },
    { q: 'What happens when I scale up?', a: 'We are continuously building features for our upcoming Pro tier (like digital cart ordering, POS integrations, and loyalty systems). The core menu and QR tools will remain free.' },
  ];

  return (
    <div style={{ overflowX: 'hidden' }}>
      <style>{`
        .hero-gradient {
          background: radial-gradient(circle at 80% 20%, rgba(253, 186, 116, 0.15) 0%, rgba(255, 255, 255, 0) 50%),
                      radial-gradient(circle at 10% 80%, rgba(249, 115, 22, 0.05) 0%, rgba(255, 255, 255, 0) 50%);
        }
        .feature-card {
          border-radius: 16px;
          border: 1px solid #F1F5F9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #FFFFFF;
          height: 100%;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: #FED7AA;
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.05);
        }
        .dashboard-mockup {
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.12);
          border: 6px solid #1E293B;
          background: #0F172A;
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        .trusted-badge {
          background: #F8FAFC;
          padding: 8px 24px;
          border-radius: 30px;
          color: #64748B;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
          border: 1px solid #E2E8F0;
        }
        .pricing-card {
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          padding: 40px 32px;
          background: #FFFFFF;
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        .pricing-card.premium {
          border-color: #F97316;
          box-shadow: 0 10px 40px rgba(249, 115, 22, 0.08);
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-gradient" style={{ padding: '80px 24px 100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={11}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFEDD5', padding: '6px 16px', borderRadius: '30px', marginBottom: '24px', border: '1px solid #FFD8A8' }}>
                  <img src={logoIcon} alt="Icon" style={{ height: '16px' }} />
                  <span style={{ color: '#C2410C', fontWeight: 700, fontSize: '12px', letterSpacing: '0.5px' }}>RELAUNCHED 2.0</span>
                </div>
                <Title level={1} style={{ fontSize: 'calc(2rem + 1.5vw)', fontWeight: 850, letterSpacing: '-1.5px', lineHeight: 1.1, margin: '0 0 20px 0', color: '#0F172A' }}>
                  Run Your Restaurant Like a <span style={{ color: '#F97316' }}>Tech Company.</span>
                </Title>
                <Paragraph style={{ fontSize: '18px', color: '#475569', lineHeight: 1.6, marginBottom: '32px' }}>
                  Restaurant OS helps restaurants manage menus, QR ordering, profiles, and digital menu presence—all in one place, 100% commission-free.
                </Paragraph>
                <Flex gap={16} wrap="wrap">
                  <Button 
                    type="primary" 
                    size="large" 
                    onClick={() => navigate('/signup')}
                    style={{ background: '#F97316', borderColor: '#F97316', height: '54px', padding: '0 32px', borderRadius: '12px', fontWeight: 600, fontSize: '16px', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}
                  >
                    Start Free
                  </Button>
                  <Button 
                    type="default" 
                    size="large" 
                    onClick={() => navigate('/contact')}
                    style={{ height: '54px', padding: '0 32px', borderRadius: '12px', fontWeight: 600, fontSize: '16px', borderColor: '#CBD5E1' }}
                  >
                    Book Demo
                  </Button>
                </Flex>
              </motion.div>
            </Col>

            {/* Right mockup side */}
            <Col xs={24} lg={13}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="dashboard-mockup"
              >
                <div style={{ height: '32px', background: '#1E293B', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                </div>
                <div style={{ background: '#0F172A', padding: '16px 20px', minHeight: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Mock dashboard layout components */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>
                    <div style={{ width: '120px', height: '16px', background: '#1E293B', borderRadius: '4px' }} />
                    <div style={{ width: '80px', height: '24px', background: '#F97316', borderRadius: '6px' }} />
                  </div>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ background: '#1E293B', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ width: '40px', height: '12px', background: '#475569', borderRadius: '2px', marginBottom: '8px' }} />
                        <div style={{ width: '60px', height: '20px', background: '#FFFFFF', borderRadius: '3px' }} />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ background: '#1E293B', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ width: '40px', height: '12px', background: '#475569', borderRadius: '2px', marginBottom: '8px' }} />
                        <div style={{ width: '70px', height: '20px', background: '#F97316', borderRadius: '3px' }} />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ background: '#1E293B', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                        <div style={{ width: '40px', height: '12px', background: '#475569', borderRadius: '2px', marginBottom: '8px' }} />
                        <div style={{ width: '50px', height: '20px', background: '#FFFFFF', borderRadius: '3px' }} />
                      </div>
                    </Col>
                  </Row>
                  <div style={{ flex: 1, background: '#1E293B', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ width: '100%', height: '12px', background: '#334155', borderRadius: '2px' }} />
                    <div style={{ width: '85%', height: '12px', background: '#334155', borderRadius: '2px' }} />
                    <div style={{ width: '60%', height: '12px', background: '#334155', borderRadius: '2px' }} />
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Trusted By Segment */}
      <section style={{ padding: '40px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '24px', letterSpacing: '1px' }}>
            TRUSTED BY BUSINESSES ACROSS THE INDUSTRY
          </Text>
          <Flex justify="center" align="center" gap={32} wrap="wrap">
            <span className="trusted-badge">Restaurants</span>
            <span className="trusted-badge">Cafes & Bistros</span>
            <span className="trusted-badge">Boutique Hotels</span>
            <span className="trusted-badge">Food Courts</span>
            <span className="trusted-badge">Gourmet Food Trucks</span>
          </Flex>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '100px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.8px' }}>
              Packed with powerful features to grow your business
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '12px auto 0 auto' }}>
              Everything you need to digitize your restaurant menu operation, scale presence, and save on fees.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, idx) => (
              <Col xs={24} sm={12} md={6} key={idx}>
                <Card bordered={false} className="feature-card" bodyStyle={{ padding: '28px' }}>
                  <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
                  <Title level={4} style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                    {feature.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    {feature.description}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* QR Menu Animated Flow */}
      <section style={{ padding: '100px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.8px' }}>
              How Restaurant OS Works
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '12px auto 0 auto' }}>
              A seamless, zero-friction experience for both owners and guests.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            {[
              { step: '1', title: 'Setup Restaurant', desc: 'Create your account and add location, cover details, and hours.' },
              { step: '2', title: 'Build Menu', desc: 'Add food categories, items, prices, descriptions, and dynamic photos.' },
              { step: '3', title: 'Generate QR', desc: 'Generate high-res dynamic QR codes and place them on restaurant tables.' },
              { step: '4', title: 'Serve Customers', desc: 'Guests scan the QR code to instantly view your premium menu on their phones.' },
            ].map((step, idx) => (
              <Col xs={24} md={6} key={idx}>
                <div style={{ background: '#FFFFFF', padding: '32px 24px', borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-16px', left: '24px', width: '36px', height: '36px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 800 }}>
                    {step.step}
                  </div>
                  <Title level={4} style={{ marginTop: '8px', fontSize: '16px', fontWeight: 700 }}>{step.title}</Title>
                  <Paragraph style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>{step.desc}</Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: '100px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.8px' }}>
              Why restaurants choose Restaurant OS
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', margin: '8px 0 0 0' }}>
              A comparison showing why print and aggregator apps are becoming obsolete.
            </Paragraph>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            <Table 
              columns={comparisonColumns} 
              dataSource={comparisonData} 
              pagination={false} 
              size="middle"
              rowKey="key"
            />
          </div>
        </div>
      </section>

      {/* Simple Pricing Section */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.8px' }}>
              Simple, transparent pricing
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', margin: '8px 0 0 0' }}>
              Get started for free. Upgrade whenever your restaurant expands.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={12}>
              <div className="pricing-card premium">
                <div style={{ display: 'inline-block', background: '#FFEDD5', padding: '4px 12px', borderRadius: '20px', color: '#C2410C', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Current Tier
                </div>
                <Title level={3} style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Starter Plan</Title>
                <Paragraph style={{ color: '#64748B', marginTop: '8px' }}>Perfect for cafes, food courts and dine-in restaurants.</Paragraph>
                <div style={{ margin: '24px 0' }}>
                  <span style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A' }}>$0</span>
                  <span style={{ color: '#64748B', fontSize: '14px' }}> / forever free</span>
                </div>
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  onClick={() => navigate('/signup')}
                  style={{ background: '#F97316', borderColor: '#F97316', height: '48px', borderRadius: '8px', fontWeight: 600 }}
                >
                  Start Free Now
                </Button>
                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '28px 0' }} />
                <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '13px', lineHeight: '2' }}>
                  <li>Unlimited Food Categories</li>
                  <li>Unlimited Menu Items</li>
                  <li>Dynamic QR Code Generation</li>
                  <li>Instant Real-Time Sync</li>
                  <li>Zero commissions on menu loads</li>
                </ul>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div className="pricing-card">
                <div style={{ display: 'inline-block', background: '#E2E8F0', padding: '4px 12px', borderRadius: '20px', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Coming Soon
                </div>
                <Title level={3} style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Pro Plan</Title>
                <Paragraph style={{ color: '#64748B', marginTop: '8px' }}>Advanced features for growing dining operations.</Paragraph>
                <div style={{ margin: '24px 0' }}>
                  <span style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A' }}>$19</span>
                  <span style={{ color: '#64748B', fontSize: '14px' }}> / month</span>
                </div>
                <Button 
                  type="default" 
                  size="large" 
                  block 
                  disabled
                  style={{ height: '48px', borderRadius: '8px', fontWeight: 600 }}
                >
                  Coming Soon
                </Button>
                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '28px 0' }} />
                <ul style={{ paddingLeft: '20px', color: '#64748B', fontSize: '13px', lineHeight: '2' }}>
                  <li>Everything in Starter</li>
                  <li>Mobile cart & order placement</li>
                  <li>Custom Domain Mapping</li>
                  <li>Advanced Customer Analytics</li>
                  <li>POS & Printer Integrations</li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section style={{ padding: '100px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.8px' }}>
              Frequently Asked Questions
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', margin: '8px 0 0 0' }}>
              Got questions? We have got answers.
            </Paragraph>
          </div>

          <Collapse 
            accordion 
            bordered={false} 
            expandIconPosition="end"
            style={{ background: 'transparent' }}
          >
            {faqs.map((faq, idx) => (
              <Panel 
                header={<span style={{ fontWeight: 600, color: '#0F172A', fontSize: '15px' }}>{faq.q}</span>} 
                key={idx}
                style={{ background: '#F8FAFC', borderRadius: '12px', marginBottom: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}
              >
                <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  {faq.a}
                </Paragraph>
              </Panel>
            ))}
          </Collapse>
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Title level={2} style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: 850, letterSpacing: '-1px', marginBottom: '16px' }}>
            Ready to digitize your restaurant menu?
          </Title>
          <Paragraph style={{ color: '#94A3B8', fontSize: '17px', lineHeight: '1.6', maxWidth: '560px', margin: '0 auto 40px auto' }}>
            Join hundreds of restaurants using Restaurant OS to power their dining experience. Create your free account today.
          </Paragraph>
          <Flex gap={16} justify="center" wrap="wrap">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/signup')}
              style={{ background: '#F97316', borderColor: '#F97316', height: '54px', padding: '0 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px' }}
            >
              Start Free Now
            </Button>
            <Button 
              type="default" 
              ghost 
              size="large" 
              onClick={() => navigate('/signup')}
              style={{ height: '54px', padding: '0 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', color: '#FFFFFF', borderColor: '#FFFFFF' }}
            >
              Create Restaurant
            </Button>
          </Flex>
        </div>
      </section>
    </div>
  );
};

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
      icon: <QrcodeOutlined style={{ fontSize: '28px', color: '#F97316' }} />,
      title: 'QR Code Generation',
      description: 'Create customized QR codes for tables or counters. Guests scan to view menus instantly.',
    },
    {
      icon: <BuildOutlined style={{ fontSize: '28px', color: '#F97316' }} />,
      title: 'Dynamic Menu Builder',
      description: 'Manage items, prices, photos, and live availability in an easy-to-use editor.',
    },
    {
      icon: <ShopOutlined style={{ fontSize: '28px', color: '#F97316' }} />,
      title: 'Restaurant Profile',
      description: 'Set up custom logo, cover banner, maps location, business hours, and phone contact.',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '28px', color: '#F97316' }} />,
      title: 'Hosted Digital Menus',
      description: 'Your menu hosted on a premium domain, fully optimized for search engines.',
    },
    {
      icon: <LineChartOutlined style={{ fontSize: '28px', color: '#F97316' }} />,
      title: 'Completion Checklists',
      description: 'Stay on track with live setup suggestions and profile completion statistics.',
    },
    {
      icon: <SyncOutlined style={{ fontSize: '28px', color: '#F97316' }} />,
      title: 'Instant Sync',
      description: 'Any updates in the builder are pushed instantly to customer screens without refresh.',
    },
    {
      icon: <MobileOutlined style={{ fontSize: '28px', color: '#F97316' }} />,
      title: 'Fluid Mobile Layouts',
      description: 'Optimized for single-hand scrolling, touch targets, and notch screens.',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '28px', color: '#F97316' }} />,
      title: 'Rapid Deployment',
      description: 'Launch your restaurant menu and print QR table stands in under five minutes.',
    },
  ];

  const comparisonColumns = [
    { title: 'Feature', dataIndex: 'feature', key: 'feature', width: '35%' },
    { 
      title: <span style={{ color: '#F97316', fontWeight: 800 }}>Restaurant OS</span>, 
      dataIndex: 'ros', 
      key: 'ros',
      render: (val: boolean | string) => typeof val === 'string' ? <strong>{val}</strong> : (val ? <CheckCircleTwoTone twoToneColor="#22C55E" style={{ fontSize: '20px' }} /> : <CloseCircleTwoTone twoToneColor="#EF4444" style={{ fontSize: '20px' }} />)
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
    { key: 5, feature: 'Brand Ownership', ros: 'Full Control', printed: 'Limited', market: 'None' },
    { key: 6, feature: 'Operational Cost', ros: 'Free Starter', printed: 'High printing costs', market: 'High commissions' },
    { key: 7, feature: 'Setup Time', ros: '5 Minutes', printed: 'Days', market: 'Weeks' },
  ];

  const faqs = [
    { q: 'What is Restaurant OS?', a: 'Restaurant OS is a modern operating system built for restaurants. It offers digital menu building, dynamic QR menu creation, and premium public website pages so you can serve customers without relying on expensive aggregators.' },
    { q: 'Is Restaurant OS really free?', a: 'Yes! Our Starter plan is 100% free with unlimited categories, items, and QR code scans. We believe restaurants should own their digital relationships without paying a dime in commissions.' },
    { q: 'Do I need to download any app?', a: 'No, Restaurant OS is a web-based platform. You can access the manager portal from any browser on your computer, tablet, or smartphone. Customers simply scan your QR code to view the menu instantly on their phones.' },
    { q: 'How do customers view the menu?', a: 'Customers scan the printed QR code placed on their tables or counters. The menu loads instantly as a fast-loading, beautiful mobile website, with no app download required.' },
    { q: 'Can I change my menu items or prices in real time?', a: 'Absolutely! Any changes you make to categories, prices, descriptions, or availability in the Menu Builder are updated instantly on the public menu page.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };

  return (
    <div style={{ overflowX: 'hidden', background: '#FFFFFF' }}>
      <style>{`
        .hero-section {
          position: relative;
          padding: 120px 24px 140px 24px;
          background: #FFFFFF;
          overflow: hidden;
        }
        .hero-glow-1 {
          position: absolute;
          top: -10%;
          right: -5%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, rgba(255,255,255,0) 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-glow-2 {
          position: absolute;
          bottom: -10%;
          left: -10%;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(249,115,22,0.04) 0%, rgba(255,255,255,0) 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .visual-depth-mockups {
          position: relative;
          height: 420px;
          width: 100%;
        }
        .laptop-mockup-frame {
          position: absolute;
          top: 20px;
          left: 0;
          width: 85%;
          height: 320px;
          background: #0F172A;
          border-radius: 16px;
          border: 4px solid #1E293B;
          box-shadow: 0 30px 70px rgba(15,23,42,0.18);
          overflow: hidden;
          z-index: 5;
        }
        .mobile-mockup-frame {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 180px;
          height: 340px;
          background: #FFFFFF;
          border-radius: 28px;
          border: 6px solid #0F172A;
          box-shadow: 0 20px 45px rgba(15,23,42,0.25);
          overflow: hidden;
          z-index: 10;
        }
        .glow-card {
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 30px rgba(15, 23, 42, 0.02);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: #FFFFFF;
          height: 100%;
        }
        .glow-card:hover {
          transform: translateY(-8px);
          border-color: #F97316;
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.06);
        }
        .glow-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .premium-btn-primary {
          background: #F97316 !important;
          border-color: #F97316 !important;
          height: 56px !important;
          padding: 0 36px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.25) !important;
          transition: all 0.3s !important;
        }
        .premium-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(249, 115, 22, 0.35) !important;
        }
        .premium-btn-secondary {
          height: 56px !important;
          padding: 0 36px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          border-color: #CBD5E1 !important;
          color: #475569 !important;
          transition: all 0.3s !important;
        }
        .premium-btn-secondary:hover {
          background: #F8FAFC !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Row gutter={[64, 48]} align="middle">
            <Col xs={24} lg={11}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFEDD5', padding: '6px 14px', borderRadius: '30px', marginBottom: '24px', border: '1px solid #FFD8A8' }}>
                  <img src={logoIcon} alt="Icon" style={{ height: '14px' }} />
                  <span style={{ color: '#C2410C', fontWeight: 750, fontSize: '11px', letterSpacing: '0.5px' }}>RELAUNCHED 2.0</span>
                </div>
                <Title level={1} style={{ fontSize: 'calc(2.2rem + 2vw)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 24px 0', color: '#0F172A' }}>
                  Run Your Restaurant Like a <span style={{ color: '#F97316' }}>Tech Company.</span>
                </Title>
                <Paragraph style={{ fontSize: '18px', color: '#475569', lineHeight: 1.65, marginBottom: '40px', fontWeight: 400 }}>
                  Restaurant OS helps restaurants manage menus, QR table ordering, digital profiles, and live customer menus—all from one premium dashboard.
                </Paragraph>
                <Flex gap={16} wrap="wrap">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="premium-btn-primary"
                    onClick={() => navigate('/signup')}
                  >
                    Start Free Now
                  </Button>
                  <Button 
                    type="default" 
                    size="large" 
                    className="premium-btn-secondary"
                    onClick={() => navigate('/contact')}
                  >
                    Book Demo
                  </Button>
                </Flex>
              </motion.div>
            </Col>

            {/* Laptop + Mobile Floating Mockup */}
            <Col xs={24} lg={13}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="visual-depth-mockups"
              >
                {/* Simulated Laptop */}
                <div className="laptop-mockup-frame">
                  <div style={{ height: '32px', background: '#1E293B', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                  </div>
                  <div style={{ background: '#0F172A', padding: '20px', minHeight: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>
                      <div style={{ width: '120px', height: '14px', background: '#1E293B', borderRadius: '4px' }} />
                      <div style={{ width: '64px', height: '20px', background: '#F97316', borderRadius: '6px' }} />
                    </div>
                    <Row gutter={16}>
                      <Col span={8}>
                        <div style={{ background: '#1E293B', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
                          <div style={{ width: '32px', height: '10px', background: '#475569', borderRadius: '2px', marginBottom: '8px' }} />
                          <div style={{ width: '48px', height: '18px', background: '#FFFFFF', borderRadius: '3px' }} />
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{ background: '#1E293B', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
                          <div style={{ width: '32px', height: '10px', background: '#475569', borderRadius: '2px', marginBottom: '8px' }} />
                          <div style={{ width: '56px', height: '18px', background: '#F97316', borderRadius: '3px' }} />
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{ background: '#1E293B', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
                          <div style={{ width: '32px', height: '10px', background: '#475569', borderRadius: '2px', marginBottom: '8px' }} />
                          <div style={{ width: '40px', height: '18px', background: '#FFFFFF', borderRadius: '3px' }} />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* Simulated Floating Mobile Device */}
                <motion.div 
                  className="mobile-mockup-frame"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div style={{ height: '24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '4px', background: '#E2E8F0', borderRadius: '2px' }} />
                  </div>
                  {/* Public Menu preview mockup */}
                  <div style={{ background: '#FFFFFF', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
                    <div style={{ height: '48px', background: '#FFF7ED', borderRadius: '8px', border: '1px dashed #FFD8A8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#F97316', fontWeight: 700 }}>Menu Active</span>
                    </div>
                    <div style={{ width: '60%', height: '12px', background: '#0F172A', borderRadius: '2px', marginTop: '4px' }} />
                    <div style={{ width: '90%', height: '8px', background: '#94A3B8', borderRadius: '2px' }} />
                    <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
                        <div style={{ width: '80%', height: '10px', background: '#334155', borderRadius: '2px' }} />
                        <div style={{ width: '40%', height: '8px', background: '#F97316', borderRadius: '2px' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Trusted By Segment */}
      <section style={{ padding: '48px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Text type="secondary" style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '24px', letterSpacing: '1.5px', color: '#64748B' }}>
            TRUSTED BY LEADERS IN MODERN DINING
          </Text>
          <Flex justify="center" align="center" gap={20} wrap="wrap">
            <span className="trusted-badge">Restaurants</span>
            <span className="trusted-badge">Specialty Cafes</span>
            <span className="trusted-badge">Boutique Hotels</span>
            <span className="trusted-badge">Dine-in Bars</span>
            <span className="trusted-badge">Food Courts</span>
          </Flex>
        </div>
      </section>

      {/* Features Segment */}
      <section id="features" style={{ padding: '120px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>
              All the tools you need in one OS
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0 auto', lineHeight: '1.6' }}>
              Built specifically to streamline restaurant operations, increase menu clarity, and bypass aggregator commissions.
            </Paragraph>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <Row gutter={[32, 32]}>
              {features.map((feature, idx) => (
                <Col xs={24} sm={12} md={6} key={idx}>
                  <motion.div variants={itemVariants} style={{ height: '100%' }}>
                    <Card bordered={false} className="glow-card" bodyStyle={{ padding: '32px' }}>
                      <div className="glow-icon-wrap">{feature.icon}</div>
                      <Title level={4} style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                        {feature.title}
                      </Title>
                      <Paragraph style={{ color: '#64748B', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
                        {feature.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Animated QR Flow Showcase */}
      <section style={{ padding: '120px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>
              Delightful ordering, zero friction
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0 auto' }}>
              How Restaurant OS transforms printed cards into live dining portals.
            </Paragraph>
          </div>

          <Row gutter={[40, 40]} justify="center">
            {[
              { num: '01', title: 'Verify Profile', text: 'Register restaurant location, cover details, hours, and contacts.' },
              { num: '02', title: 'Publish Menu', text: 'Enter food categories and items in our clean, dynamic menu builder.' },
              { num: '03', title: 'Print Stands', text: 'Generate high-res dynamic QR codes and download SVG stands.' },
              { num: '04', title: 'Serve Customers', text: 'Guests scan the dynamic QR, loading your beautiful menu in milliseconds.' }
            ].map((step, idx) => (
              <Col xs={24} md={6} key={idx}>
                <div style={{ background: '#FFFFFF', padding: '40px 28px', borderRadius: '24px', border: '1px solid #E2E8F0', height: '100%', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                  <div style={{ fontSize: '48px', fontWeight: 900, color: '#FFEDD5', lineHeight: 1, marginBottom: '20px' }}>
                    {step.num}
                  </div>
                  <Title level={4} style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: '#0F172A' }}>{step.title}</Title>
                  <Paragraph style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{step.text}</Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Comparison Grid */}
      <section style={{ padding: '120px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>
              Why restaurants upgrade
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', margin: '12px 0 0 0' }}>
              The breakdown between static printouts, high-fee marketplaces, and Restaurant OS.
            </Paragraph>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '20px', boxShadow: '0 10px 30px rgba(15,23,42,0.02)' }}>
            <Table 
              columns={comparisonColumns} 
              dataSource={comparisonData} 
              pagination={false} 
              size="large"
              rowKey="key"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '120px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>
              Simple, transparent plans
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', margin: '12px 0 0 0' }}>
              Get started for free. Upgrade as your restaurant scales.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={12}>
              <div className="pricing-card premium">
                <div style={{ display: 'inline-block', background: '#FFEDD5', padding: '6px 14px', borderRadius: '20px', color: '#C2410C', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', marginBottom: '20px', border: '1px solid #FFD8A8' }}>
                  starter package
                </div>
                <Title level={3} style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Starter Plan</Title>
                <Paragraph style={{ color: '#64748B', marginTop: '10px', fontSize: '14px' }}>Essential dynamic QR menu tooling for single locations.</Paragraph>
                <div style={{ margin: '32px 0' }}>
                  <span style={{ fontSize: '48px', fontWeight: 900, color: '#0F172A' }}>$0</span>
                  <span style={{ color: '#64748B', fontSize: '15px' }}> / forever free</span>
                </div>
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  className="premium-btn-primary"
                  onClick={() => navigate('/signup')}
                  style={{ height: '50px !important' }}
                >
                  Start Free Now
                </Button>
                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />
                <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '13.5px', lineHeight: '2.2' }}>
                  <li>Unlimited Food Categories</li>
                  <li>Unlimited Menu Items</li>
                  <li>Dynamic QR Code stands</li>
                  <li>Real-time menu edits sync</li>
                  <li>Zero commissions on menu loads</li>
                </ul>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div className="pricing-card">
                <div style={{ display: 'inline-block', background: '#E2E8F0', padding: '6px 14px', borderRadius: '20px', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', marginBottom: '20px', border: '1px solid #CBD5E1' }}>
                  Advanced features
                </div>
                <Title level={3} style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Pro Plan</Title>
                <Paragraph style={{ color: '#64748B', marginTop: '10px', fontSize: '14px' }}>Integrated digital checkout and table ordering suites.</Paragraph>
                <div style={{ margin: '32px 0' }}>
                  <span style={{ fontSize: '48px', fontWeight: 900, color: '#0F172A' }}>$19</span>
                  <span style={{ color: '#64748B', fontSize: '15px' }}> / month</span>
                </div>
                <Button 
                  type="default" 
                  size="large" 
                  block 
                  disabled
                  style={{ height: '50px', borderRadius: '10px', fontWeight: 600 }}
                >
                  Coming Soon
                </Button>
                <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />
                <ul style={{ paddingLeft: '20px', color: '#64748B', fontSize: '13.5px', lineHeight: '2.2' }}>
                  <li>Everything in Starter</li>
                  <li>Mobile table cart ordering</li>
                  <li>Custom Domain mapping</li>
                  <li>POS & kitchen printer sync</li>
                  <li>Advanced profile statistics</li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section style={{ padding: '120px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>
              Frequently Asked Questions
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', margin: '12px 0 0 0' }}>
              Everything you need to know about the platform.
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
                header={<span style={{ fontWeight: 650, color: '#0F172A', fontSize: '15.5px' }}>{faq.q}</span>} 
                key={idx}
                style={{ background: '#F8FAFC', borderRadius: '16px', marginBottom: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}
              >
                <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.65', margin: 0 }}>
                  {faq.a}
                </Paragraph>
              </Panel>
            ))}
          </Collapse>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section style={{ padding: '120px 24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Title level={2} style={{ color: '#FFFFFF', fontSize: '40px', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '20px' }}>
            Ready to upgrade your dining?
          </Title>
          <Paragraph style={{ color: '#94A3B8', fontSize: '17px', lineHeight: '1.65', maxWidth: '540px', margin: '0 auto 48px auto' }}>
            Create your free account, set up your profile stands, and display your menu online in under five minutes.
          </Paragraph>
          <Flex gap={16} justify="center" wrap="wrap">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/signup')}
              style={{ background: '#F97316', borderColor: '#F97316', height: '54px', padding: '0 36px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', boxShadow: '0 8px 24px rgba(249,115,22,0.2)' }}
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

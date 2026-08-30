import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Card, Row, Col, Typography, Collapse } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrcodeOutlined,
  BuildOutlined,
  ShopOutlined,
  GlobalOutlined,
  LineChartOutlined,
  SyncOutlined,
  StarFilled,
  CheckOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  LaptopOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { HeroSection, FeaturesSection, SocialProofMetrics } from '../components/HeroSection.js';
import { SEOManager } from '../components/SEOManager.js';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeMockupTab, setActiveMockupTab] = useState('dashboard');

  const faqsList = [
    { q: 'What is Restaurant OS?', a: 'Restaurant OS is a modern operating system built for restaurants. It offers digital menu building, dynamic QR menu creation, and premium public website pages so you can serve customers without relying on expensive aggregators.' },
    { q: 'Is Restaurant OS really free?', a: 'Yes! Restaurant OS is 100% free during our early launch phase with unlimited categories, items, and QR code scans. We believe restaurants should own their digital relationships without paying a dime in commissions.' },
    { q: 'Do I need to download any app?', a: 'No, Restaurant OS is a web-based platform. You can access the manager portal from any browser on your computer, tablet, or smartphone. Customers simply scan your QR code to view the menu instantly on their phones.' },
    { q: 'How do customers view the menu?', a: 'Customers scan the printed QR code placed on their tables or counters. The menu loads instantly as a fast-loading, beautiful mobile website, with no app download required.' },
    { q: 'Can I change my menu items or prices in real time?', a: 'Absolutely! Any changes you make to categories, prices, descriptions, or availability in the Menu Builder are updated instantly on the public menu page.' },
    { q: 'Do you offer online ordering and payments?', a: 'Our future-ready roadmap includes table-ordering carts, kitchen ticket synchronization, and integrated UPI/Razorpay checkouts for instant payments.' },
    { q: 'Can I use my own custom domain?', a: 'Yes! Custom domain routing (e.g. menu.myrestaurant.com) will be available soon. Your restaurant identity remains fully white-labelled.' },
    { q: 'How many QR codes can I generate?', a: 'You can generate unlimited QR codes for tables, counters, delivery cards, or marketing flyers on all plans.' },
    { q: 'Is there support for multiple languages?', a: 'Yes! We support multi-language menu options so international guests can toggle and read menus in their native language.' },
    { q: 'How secure is Restaurant OS?', a: 'We protect your business data and authentication sessions using enterprise-grade JWT token sets, secure HTTP-only cookies, and encrypted data tunnels.' },
    { q: 'Can I manage multiple restaurant branches?', a: 'Yes, our platform is built from the ground up to support multi-branch management under a single enterprise master account.' },
    { q: 'Do I need special hardware to run the system?', a: 'No, any existing smartphone, tablet, laptop, or desktop is fully compatible. There is no proprietary hardware locking.' },
    { q: 'Are there any hidden transaction fees?', a: 'None. Restaurant OS charges 0% commissions on all menu loads and view interactions. You keep 100% of your operational revenues.' },
    { q: 'Can I import my existing menu from a CSV or PDF?', a: 'Yes, we provide menu importing services so you can load thousands of items in bulk without manual typing.' },
    { q: 'Can I add images to my menu items?', a: 'Yes, you can upload high-resolution cover photos for each dish to make your public menu highly appealing to customers.' },
    { q: 'Does it support offline menu views?', a: 'Our public menus are heavily cached using progressive web tech, allowing customers to view loaded categories even under unstable internet connections.' },
    { q: 'Can I restrict menu access to physical customers only?', a: 'Yes, we offer location-based geofencing features so customers can scan and view menus only when physically present inside your restaurant boundaries.' },
    { q: 'Can I toggle items as sold-out instantly?', a: 'Yes, our quick out-of-stock toggles allow kitchen staffs to mark items as sold-out instantly, preventing incorrect orders.' },
    { q: 'Do you offer onboarding help for new restaurants?', a: 'Absolutely! We offer free premium setup assistance. Simply submit your PDF menu to our sales desk, and our team will build your digital catalog within 24 hours.' },
    { q: 'Do you charge any commission on orders?', a: 'No. Restaurant OS is committed to keeping order pages commission-free. You receive payments directly to your restaurant bank account via UPI or cash.' }
  ];

  const demoTestimonials = [
    { name: 'Aarav Mehta', role: 'Owner, The Spice Library', city: 'Mumbai', quote: 'Restaurant OS completely cut out our monthly print menu costs. Updates take literally seconds instead of days.', rating: 5, avatar: 'AM' },
    { name: 'Priya Nair', role: 'Founder, The Coconut Grove', city: 'Bengaluru', quote: 'The QR menu generator is incredibly smooth. Our guests scan, view, and ordering is flawless.', rating: 5, avatar: 'PN' },
    { name: 'Vikram Malhotra', role: 'Partner, Punjab Grill Dhaba', city: 'Delhi NCR', quote: '0% commission is a game changer. We shifted from expensive third-party platforms to our own digital menu.', rating: 5, avatar: 'VM' },
    { name: 'Ananya Iyer', role: 'Owner, Cafe Mysore', city: 'Chennai', quote: 'Setting up took less than 5 minutes. The real-time sync works immediately without customer page refresh.', rating: 5, avatar: 'AI' },
    { name: 'Kabir Sen', role: 'Director, Flurys Bistro', city: 'Kolkata', quote: 'The mobile view feels like a premium native app. The navigation is tactile, fluid, and perfect for dining.', rating: 5, avatar: 'KS' },
    { name: 'Rohan Sharma', role: 'Owner, Royal Tandoor', city: 'Pune', quote: 'Our completion checklist guided us step-by-step. Extremely intuitive interface for restaurant staffs.', rating: 5, avatar: 'RS' }
  ];

  const bentoFeatures = [
    {
      icon: <QrcodeOutlined style={{ fontSize: '32px', color: '#F97316' }} />,
      title: 'Dynamic QR Stand Generation',
      desc: 'Create customized vector QR stands for specific tables, counters, or event spaces. Dynamically edit destinations without reprinting.',
      size: 'large'
    },
    {
      icon: <BuildOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Tactile Menu Builder',
      desc: 'Organize items, modifiers, tags, and pricing schemas inside our fast-loading editor grid.',
      size: 'small'
    },
    {
      icon: <ShopOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Restaurant Profiles',
      desc: 'Display brand logos, operating hours, geolocation, and contact coordinates.',
      size: 'small'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '32px', color: '#F97316' }} />,
      title: 'Cloud-Hosted Digital Menus',
      desc: 'Get an SEO-optimized public domain landing page hosting your menus, compatible with all screen sizes and browsers.',
      size: 'large'
    },
    {
      icon: <LineChartOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Live Completion Checklist',
      desc: 'Track operational readiness using automated checklists and setup steps.',
      size: 'small'
    },
    {
      icon: <SyncOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Instant Database Sync',
      desc: 'Edits push instantly to active guest displays without page refreshes.',
      size: 'small'
    }
  ];


  return (
    <div style={{ overflowX: 'hidden', background: '#FFFFFF' }}>
      <SEOManager 
        title="Run Your Restaurant Like a Tech Company" 
        description="Restaurant OS helps restaurants manage digital menus, QR ordering, profiles, and live sync customer menus—commission-free."
        schema={{
          '@type': 'SoftwareApplication',
          'name': 'Restaurant OS',
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Web-based',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'INR'
          }
        }}
      />

      <style>{`
        .trusted-logo {
          filter: grayscale(1);
          opacity: 0.5;
          font-size: 16px;
          font-weight: 700;
          color: #64748B;
          transition: all 0.3s ease;
          cursor: default;
        }
        .trusted-logo:hover {
          filter: grayscale(0);
          opacity: 1;
          color: #F97316;
        }
        .comparison-badge-green {
          background: #DCFCE7;
          color: #166534;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }
        .comparison-badge-red {
          background: #FEE2E2;
          color: #991B1B;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }
        .bento-card {
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          padding: 32px;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(15,23,42,0.01);
        }
        .bento-card:hover {
          transform: translateY(-4px);
          border-color: #F97316;
          box-shadow: 0 16px 36px rgba(249,115,22,0.06);
        }
        .timeline-line {
          position: absolute;
          top: 54px;
          left: 60px;
          right: 60px;
          height: 2px;
          background: #E2E8F0;
          z-index: 1;
        }
        .timeline-card-redesign {
          position: relative;
          z-index: 2;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 32px 24px;
          box-shadow: 0 4px 20px rgba(15,23,42,0.01);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
          height: 100%;
        }
        .timeline-card-redesign:hover {
          transform: translateY(-6px);
          border-color: #F97316;
          box-shadow: 0 16px 36px rgba(249,115,22,0.06);
        }
        .timeline-card-redesign:hover .timeline-bullet-redesign {
          background: #F97316;
          color: #FFFFFF;
          border-color: #F97316;
          box-shadow: 0 8px 20px rgba(249,115,22,0.25);
        }
        .timeline-bullet-redesign {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid #E2E8F0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #475569;
          font-size: 15px;
          transition: all 0.3s;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .timeline-line {
            display: none !important;
          }
        }
        .mockup-tab-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mockup-tab-btn.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }
        .testimonial-card {
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
          height: 100%;
          transition: all 0.3s;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          border-color: #CBD5E1;
        }
      `}</style>      {/* Hero Section */}
      <HeroSection />

      {/* Social Proof Metrics Strip */}
      <SocialProofMetrics />

      {/* Features Section */}
      <FeaturesSection />

      {/* Trusted By Segment (Grayscale Logos Hover Color) */}
      <section style={{ padding: '60px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '2px', display: 'block', marginBottom: '32px' }}>
            OPERATING DIGITAL MENUS FOR MODERN HOSPITALITY
          </Text>
          <Row gutter={[24, 24]} justify="center" align="middle">
            <Col xs={12} sm={6}>
              <span className="trusted-logo">⚡ SPECIALTY CAFES</span>
            </Col>
            <Col xs={12} sm={6}>
              <span className="trusted-logo">🍽️ FINE DINING OUTLETS</span>
            </Col>
            <Col xs={12} sm={6}>
              <span className="trusted-logo">🏨 BOUTIQUE HOTELS</span>
            </Col>
            <Col xs={12} sm={6}>
              <span className="trusted-logo">🍹 COCKTAIL LOUNGES</span>
            </Col>
          </Row>
        </div>
      </section>

      {/* Why Choose Restaurant OS Comparison Cards */}
      <section style={{ padding: '120px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1.5px', color: '#0F172A' }}>
              The end of commission fees and printing delays
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0 auto' }}>
              See how Restaurant OS outperforms outdated physical setups and high-fee marketplace platforms.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '24px', padding: '16px', height: '100%' }}>
                <span className="comparison-badge-green">RESTAURANT OS</span>
                <Title level={4} style={{ marginTop: '20px', fontSize: '18px', fontWeight: 750 }}>Future-Ready QR Menus</Title>
                <ul style={{ paddingLeft: '18px', marginTop: '16px', lineHeight: '2', color: '#475569' }}>
                  <li><CheckOutlined style={{ color: '#166534', marginRight: '6px' }} /> 0% commissions on customers</li>
                  <li><CheckOutlined style={{ color: '#166534', marginRight: '6px' }} /> Edits sync instantly in real-time</li>
                  <li><CheckOutlined style={{ color: '#166534', marginRight: '6px' }} /> Custom design brand tags</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '16px', height: '100%' }}>
                <span className="comparison-badge-red">TRADITIONAL PDF/PRINT</span>
                <Title level={4} style={{ marginTop: '20px', fontSize: '18px', fontWeight: 750 }}>High Operational Friction</Title>
                <ul style={{ paddingLeft: '18px', marginTop: '16px', lineHeight: '2', color: '#64748B' }}>
                  <li><CloseOutlined style={{ color: '#991B1B', marginRight: '6px' }} /> ₹8,000+ monthly menu reprinting costs</li>
                  <li><CloseOutlined style={{ color: '#991B1B', marginRight: '6px' }} /> Stale PDF files require manual zoom</li>
                  <li><CloseOutlined style={{ color: '#991B1B', marginRight: '6px' }} /> No customer telemetry analytics</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '16px', height: '100%' }}>
                <span className="comparison-badge-red">AGGREGATOR APPS</span>
                <Title level={4} style={{ marginTop: '20px', fontSize: '18px', fontWeight: 750 }}>Severe Commission Deductions</Title>
                <ul style={{ paddingLeft: '18px', marginTop: '16px', lineHeight: '2', color: '#64748B' }}>
                  <li><CloseOutlined style={{ color: '#991B1B', marginRight: '6px' }} /> 15% to 30% commission cuts per order</li>
                  <li><CloseOutlined style={{ color: '#991B1B', marginRight: '6px' }} /> Customers locked inside their app</li>
                  <li><CloseOutlined style={{ color: '#991B1B', marginRight: '6px' }} /> Zero branding or domain control</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Strategic CTA #1 */}
      <section style={{ padding: '60px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={24}>
            <div style={{ textAlign: 'left' }}>
              <Title level={3} style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Save up to ₹25,000+ monthly on aggregator commissions</Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>Launch a commission-free QR menu stand in less than five minutes.</Text>
            </div>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/signup')}
              style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', fontWeight: 700 }}
            >
              Get Started Free <ArrowRightOutlined />
            </Button>
          </Flex>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" style={{ padding: '120px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1.5px', color: '#0F172A' }}>
              All the tools you need to digitize service
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0 auto' }}>
              Our platform matches top-tier SaaS frameworks, giving cafe owners complete control.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {bentoFeatures.map((feat, idx) => (
              <Col xs={24} md={feat.size === 'large' ? 16 : 8} key={idx}>
                <div className="bento-card">
                  <div style={{ marginBottom: '20px' }}>{feat.icon}</div>
                  <Title level={3} style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>{feat.title}</Title>
                  <Paragraph style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.65', margin: 0 }}>{feat.desc}</Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section style={{ padding: '120px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1.5px', color: '#0F172A' }}>
              From print menu to active scans in 5 minutes
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0 auto' }}>
              We optimized the setup pipeline to clear out administrative overhead.
            </Paragraph>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Desktop Connector Line */}
            <div className="timeline-line" />
            
            <Row gutter={[20, 20]} justify="center">
              {[
                { step: '01', title: 'Setup Profile', body: 'Register business operations, maps address, contacts, and brand logos.' },
                { step: '02', title: 'Enter Menu Details', body: 'Upload food categories, dish photos, modifier pricing, and diet labels.' },
                { step: '03', title: 'Generate QR Stand', body: 'Download vector files of table-specific QR codes, custom to your styling.' },
                { step: '04', title: 'Scan to View', body: 'Guests scan using basic smartphone cameras. Menu renders instantly.' },
                { step: '05', title: 'Operations Grow', body: 'Analyze analytics telemetry, update menu availability, and scaling.' }
              ].map((node, index) => (
                <Col xs={24} sm={12} md={4} key={index}>
                  <div className="timeline-card-redesign">
                    <div className="timeline-bullet-redesign">{node.step}</div>
                    <Title level={4} style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>{node.title}</Title>
                    <Paragraph style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>{node.body}</Paragraph>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </section>

      {/* Product Showcase Tabbed Carousel */}
      <section style={{ padding: '120px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1.5px', color: '#0F172A' }}>
              Explore the Restaurant OS Workspace
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0 auto' }}>
              Click on the workspaces below to review exact dashboard integrations.
            </Paragraph>
          </div>

          <Flex gap={12} justify="center" wrap="wrap" style={{ marginBottom: '40px' }}>
            {[
              { id: 'dashboard', label: 'Live Dashboard', icon: <LaptopOutlined /> },
              { id: 'builder', label: 'Menu Builder', icon: <BuildOutlined /> },
              { id: 'profile', label: 'Restaurant Profile', icon: <ShopOutlined /> },
              { id: 'qr', label: 'QR Generator', icon: <QrcodeOutlined /> },
              { id: 'public', label: 'Public Menu Display', icon: <PhoneOutlined /> }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveMockupTab(tab.id)}
                className={`mockup-tab-btn ${activeMockupTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon} <span style={{ marginLeft: '6px' }}>{tab.label}</span>
              </button>
            ))}
          </Flex>

          {/* Graphical Mockup Viewer */}
          <div style={{ background: '#0F172A', borderRadius: '24px', border: '4px solid #1E293B', padding: '32px', minHeight: '380px', color: '#FFFFFF', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <AnimatePresence mode="wait">
              {activeMockupTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ borderBottom: '1px solid #1E293B', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyItems: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: '#F97316' }}>Manager Dashboard / Analytics</span>
                    <span style={{ fontSize: '12px', background: '#1E293B', padding: '4px 10px', borderRadius: '4px' }}>Active Session</span>
                  </div>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                      <Card bordered={false} style={{ background: '#1E293B', color: '#FFFFFF', borderRadius: '14px' }}>
                        <Text type="secondary" style={{ color: '#94A3B8', fontSize: '13px' }}>TOTAL MENU VIEWS</Text>
                        <Title level={2} style={{ color: '#FFFFFF', margin: '8px 0 0 0', fontWeight: 900 }}>18,492</Title>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card bordered={false} style={{ background: '#1E293B', color: '#FFFFFF', borderRadius: '14px' }}>
                        <Text type="secondary" style={{ color: '#94A3B8', fontSize: '13px' }}>QR SCANS FOR TABLES</Text>
                        <Title level={2} style={{ color: '#FFFFFF', margin: '8px 0 0 0', fontWeight: 900 }}>4,921</Title>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card bordered={false} style={{ background: '#1E293B', color: '#FFFFFF', borderRadius: '14px' }}>
                        <Text type="secondary" style={{ color: '#94A3B8', fontSize: '13px' }}>COMPLETION RATING</Text>
                        <Title level={2} style={{ color: '#F97316', margin: '8px 0 0 0', fontWeight: 900 }}>100% Ready</Title>
                      </Card>
                    </Col>
                  </Row>
                </motion.div>
              )}

              {activeMockupTab === 'builder' && (
                <motion.div key="builder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ borderBottom: '1px solid #1E293B', paddingBottom: '16px', marginBottom: '24px' }}>
                    <span style={{ fontWeight: 800, color: '#F97316' }}>Dynamic Menu Editor workspace</span>
                  </div>
                  <div style={{ background: '#1E293B', padding: '24px', borderRadius: '14px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ background: '#F97316', padding: '4px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: 700 }}>Starter Categories</span>
                      <span style={{ background: '#334155', padding: '4px 12px', borderRadius: '14px', fontSize: '12px' }}>Main Courses</span>
                      <span style={{ background: '#334155', padding: '4px 12px', borderRadius: '14px', fontSize: '12px' }}>Desserts</span>
                    </div>
                    <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center', background: '#0F172A', padding: '12px 20px', borderRadius: '8px', border: '1px solid #334155' }}>
                      <span>🍛 Paneer Butter Masala</span>
                      <span style={{ color: '#F97316', fontWeight: 800 }}>₹280</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMockupTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ borderBottom: '1px solid #1E293B', paddingBottom: '16px', marginBottom: '24px' }}>
                    <span style={{ fontWeight: 800, color: '#F97316' }}>Restaurant Profile & Geolocation Info</span>
                  </div>
                  <div style={{ background: '#1E293B', padding: '24px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>RESTAURANT NAME</span>
                      <span style={{ fontSize: '16px', fontWeight: 700 }}>The Pepper Bistro</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>BUSINESS HOURS</span>
                      <span style={{ fontSize: '14px' }}>Mon - Sun, 11:00 AM - 11:00 PM</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMockupTab === 'qr' && (
                <motion.div key="qr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ borderBottom: '1px solid #1E293B', paddingBottom: '16px', marginBottom: '24px' }}>
                    <span style={{ fontWeight: 800, color: '#F97316' }}>High-Res QR Code Stands Download</span>
                  </div>
                  <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} md={12}>
                      <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '14px', display: 'inline-flex', justifyItems: 'center' }}>
                        <QrcodeOutlined style={{ fontSize: '140px', color: '#0F172A' }} />
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <Title level={4} style={{ color: '#FFFFFF', margin: 0 }}>Print Table Stands</Title>
                      <Paragraph style={{ color: '#94A3B8', marginTop: '12px' }}>Each table gets a uniquely routed QR code stand. Scans register analytics data to track dining table metrics.</Paragraph>
                    </Col>
                  </Row>
                </motion.div>
              )}

              {activeMockupTab === 'public' && (
                <motion.div key="public" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ borderBottom: '1px solid #1E293B', paddingBottom: '16px', marginBottom: '24px' }}>
                    <span style={{ fontWeight: 800, color: '#F97316' }}>Customer Digital Menu Preview</span>
                  </div>
                  <div style={{ maxWidth: '360px', margin: '0 auto', background: '#FFFFFF', color: '#0F172A', borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
                    <div style={{ height: '100px', background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', display: 'flex', alignItems: 'center', padding: '0 24px', color: '#FFFFFF' }}>
                      <Title level={4} style={{ color: '#FFFFFF', margin: 0 }}>The Pepper Bistro</Title>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <span style={{ fontWeight: 700 }}>Menu List</span>
                      <div style={{ marginTop: '12px', display: 'flex', justifyItems: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                        <span>🍛 Dal Makhani</span>
                        <span style={{ fontWeight: 850 }}>₹220</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Strategic CTA #2 */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', color: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={2} style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: 900, marginBottom: '20px' }}>Configure your catalog stands in minutes</Title>
          <Paragraph style={{ color: '#FFEDD5', fontSize: '16px', marginBottom: '32px' }}>No commissions, no proprietary terminals, no coding required.</Paragraph>
          <Button 
            size="large" 
            onClick={() => navigate('/signup')}
            style={{ color: '#F97316', background: '#FFFFFF', borderColor: '#FFFFFF', fontWeight: 800, height: '54px', padding: '0 36px', borderRadius: '10px' }}
          >
            Launch Free QR Stand
          </Button>
        </div>
      </section>

      {/* Labeled Demo Testimonials Grid */}
      <section style={{ padding: '120px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-block', background: '#F1F5F9', padding: '4px 12px', borderRadius: '14px', color: '#475569', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>
              SAMPLE USER REVIEWS / STAGE CASE STORIES
            </div>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1.5px', color: '#0F172A' }}>
              Reviewed by modern restaurateurs
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '12px auto 0 auto' }}>
              These demo customer reviews demonstrate the operational value of Restaurant OS in staging restaurant environments.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {demoTestimonials.map((story, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <div className="testimonial-card">
                  <Flex gap={4} style={{ marginBottom: '16px' }}>
                    {[...Array(story.rating)].map((_, i) => (
                      <StarFilled key={i} style={{ color: '#F59E0B' }} />
                    ))}
                  </Flex>
                  <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', minHeight: '80px' }}>
                    "{story.quote}"
                  </Paragraph>
                  <Flex gap={12} align="center">
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F97316', color: '#FFFFFF', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                      {story.avatar}
                    </div>
                    <div>
                      <span style={{ display: 'block', fontWeight: 750, color: '#0F172A', fontSize: '14px' }}>{story.name}</span>
                      <span style={{ display: 'block', color: '#64748B', fontSize: '12px' }}>{story.role} — {story.city}</span>
                    </div>
                  </Flex>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Strategic CTA #3 */}
      <section style={{ padding: '80px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={3} style={{ fontSize: '24px', fontWeight: 800 }}>Need a custom setup audit for your franchise outlets?</Title>
          <Paragraph style={{ color: '#64748B', marginTop: '8px', marginBottom: '24px' }}>Our technical specialists are available to onboard large menus and set up vector stand templates.</Paragraph>
          <Button 
            type="default" 
            size="large" 
            onClick={() => navigate('/contact')}
            style={{ height: '48px', borderRadius: '10px', fontWeight: 700, borderColor: '#475569', color: '#475569' }}
          >
            Contact Integration Sales
          </Button>
        </div>
      </section>

      {/* Early Access CTA — replaces pricing during launch phase */}
      <section style={{ padding: '120px 24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', padding: '6px 16px', borderRadius: '30px', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F97316', display: 'inline-block' }} />
            <span style={{ color: '#FB923C', fontWeight: 700, fontSize: '12px', letterSpacing: '0.5px' }}>EARLY ACCESS — NOW FREE FOR ALL RESTAURANTS</span>
          </div>
          <Title level={2} style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-1.5px', color: '#FFFFFF', margin: '0 0 20px 0' }}>
            Join hundreds of Indian restaurants <span style={{ color: '#F97316' }}>going digital for free.</span>
          </Title>
          <Paragraph style={{ fontSize: '17px', color: '#94A3B8', lineHeight: 1.7, margin: '0 auto 40px auto', maxWidth: '580px' }}>
            Restaurant OS is free to use during our early launch phase. No plans, no credit card, no commitment. Create your digital menu, generate QR stands, and publish your restaurant profile in under 5 minutes.
          </Paragraph>

          {/* CTA Row */}
          <Flex gap={16} justify="center" wrap="wrap" style={{ marginBottom: '40px' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/signup')}
              style={{ background: '#F97316', borderColor: '#F97316', height: '54px', padding: '0 40px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}
            >
              Start Free — No Credit Card
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => navigate('/contact')}
              style={{ height: '54px', padding: '0 32px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', borderColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', background: 'transparent' }}
            >
              Book a Demo
            </Button>
          </Flex>

          {/* Trust pills */}
          <Flex gap={24} justify="center" wrap="wrap">
            {['✓ 100% Free During Launch', '✓ No Commission Fees', '✓ Setup in 5 Minutes', '✓ Built for India 🇮🇳'].map((pill) => (
              <span key={pill} style={{ color: '#64748B', fontSize: '13px', fontWeight: 600 }}>{pill}</span>
            ))}
          </Flex>
        </div>
      </section>

      {/* Accordions FAQs Segment (Expanded 20+ FAQs) */}
      <section style={{ padding: '120px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1.5px', color: '#0F172A' }}>
              Common Questions & Inquiries
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', margin: '12px 0 0 0' }}>
              Everything you need to know about the platform operations.
            </Paragraph>
          </div>

          <Collapse 
            accordion 
            bordered={false} 
            expandIconPosition="end"
            style={{ background: 'transparent' }}
          >
            {faqsList.map((faq, idx) => (
              <Panel 
                header={<span style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>{faq.q}</span>} 
                key={idx}
                style={{ background: '#FFFFFF', borderRadius: '14px', marginBottom: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}
              >
                <Paragraph style={{ color: '#475569', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
                  {faq.a}
                </Paragraph>
              </Panel>
            ))}
          </Collapse>
        </div>
      </section>

      {/* Strategic CTA #4 (Final Footer Banner CTA) */}
      <section style={{ padding: '120px 24px', background: '#0F172A', color: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Title level={2} style={{ color: '#FFFFFF', fontSize: '40px', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '20px' }}>
            Ready to upgrade your dining floor?
          </Title>
          <Paragraph style={{ color: '#94A3B8', fontSize: '16px', lineHeight: '1.6', maxWidth: '540px', margin: '0 auto 48px auto' }}>
            Generate your free restaurant account, customize menus, and download table standings in under 5 minutes.
          </Paragraph>
          <Flex gap={16} justify="center" wrap="wrap">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/signup')}
              style={{ background: '#F97316', borderColor: '#F97316', height: '54px', padding: '0 36px', borderRadius: '10px', fontWeight: 700 }}
            >
              Get Started Now
            </Button>
            <Button 
              type="default" 
              ghost 
              size="large" 
              onClick={() => navigate('/contact')}
              style={{ height: '54px', padding: '0 36px', borderRadius: '10px', fontWeight: 750, color: '#FFFFFF', borderColor: '#FFFFFF' }}
            >
              Contact Sales
            </Button>
          </Flex>
        </div>
      </section>
    </div>
  );
};

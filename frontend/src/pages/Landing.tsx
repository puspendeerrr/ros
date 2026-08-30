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
import logoIcon from '../assets/logo-icon.png';
import { SEOManager } from '../components/SEOManager.js';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeMockupTab, setActiveMockupTab] = useState('dashboard');

  const faqsList = [
    { q: 'What is Restaurant OS?', a: 'Restaurant OS is a modern operating system built for restaurants. It offers digital menu building, dynamic QR menu creation, and premium public website pages so you can serve customers without relying on expensive aggregators.' },
    { q: 'Is Restaurant OS really free?', a: 'Yes! Our Starter plan is 100% free with unlimited categories, items, and QR code scans. We believe restaurants should own their digital relationships without paying a dime in commissions.' },
    { q: 'Do I need to download any app?', a: 'No, Restaurant OS is a web-based platform. You can access the manager portal from any browser on your computer, tablet, or smartphone. Customers simply scan your QR code to view the menu instantly on their phones.' },
    { q: 'How do customers view the menu?', a: 'Customers scan the printed QR code placed on their tables or counters. The menu loads instantly as a fast-loading, beautiful mobile website, with no app download required.' },
    { q: 'Can I change my menu items or prices in real time?', a: 'Absolutely! Any changes you make to categories, prices, descriptions, or availability in the Menu Builder are updated instantly on the public menu page.' },
    { q: 'Do you offer online ordering and payments?', a: 'Our future-ready roadmap includes table-ordering carts, kitchen ticket synchronization, and integrated Stripe/Razorpay checkouts on our upcoming Business/Pro tiers.' },
    { q: 'Can I use my own custom domain?', a: 'Yes! Custom domain routing (e.g. menu.myrestaurant.com) will be available in our Business package. Your restaurant identity remains fully white-labeled.' },
    { q: 'How many QR codes can I generate?', a: 'You can generate unlimited QR codes for tables, counters, delivery cards, or marketing flyers on all plans, including the free tier.' },
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
    { q: 'What is your refund policy for paid tiers?', a: 'We offer a 14-day money-back guarantee on all subscription plans if you are not fully satisfied with our premium tools.' }
  ];

  const demoTestimonials = [
    { name: 'Aarav Mehta', role: 'Owner, The Spice Library', city: 'Mumbai', quote: 'Restaurant OS completely cut out our monthly print menu costs. Updates take literally seconds instead of days.', rating: 5, avatar: 'AM' },
    { name: 'Sarah Jenkins', role: 'General Manager, Craft & Grind', city: 'London', quote: 'The QR menu generator is incredibly smooth. Our guests scan, view, and ordering is flawless.', rating: 5, avatar: 'SJ' },
    { name: 'Elena Rostova', role: 'Founder, Bistro Verde', city: 'Berlin', quote: '0% commission is a game changer. We shifted from expensive third-party platforms to our own digital menu.', rating: 5, avatar: 'ER' },
    { name: 'Koji Tanaka', role: 'Director, Sakura Sushi', city: 'Tokyo', quote: 'Setting up took less than 5 minutes. The real-time sync works immediately without customer page refresh.', rating: 5, avatar: 'KT' },
    { name: 'Carlos Gomez', role: 'Partner, El Toro Grill', city: 'Madrid', quote: 'The mobile view feels like a premium native app. The navigation is tactile, fluid, and perfect for dining.', rating: 5, avatar: 'CG' },
    { name: 'Rohan Sharma', role: 'Owner, Royal Tandoor', city: 'Delhi', quote: 'Our completion checklist guided us step-by-step. Extremely intuitive interface for restaurant staffs.', rating: 5, avatar: 'RS' }
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

  const pricingTiers = [
    {
      name: 'Free Package',
      price: '$0',
      badge: 'Starter',
      desc: 'Perfect for local cafes and single-table locations looking to digitalize menus.',
      features: ['1 Restaurant Location', '1 Active Digital Menu', 'Basic QR Code Stand', 'Real-time sync edits', 'Standard Community Support'],
      highlight: false
    },
    {
      name: 'Starter Plan',
      price: '$9',
      badge: 'Most Popular',
      desc: 'Best for active dine-in restaurants requiring custom configurations.',
      features: ['3 Restaurant Locations', '3 Active Digital Menus', 'Customizable QR Templates', 'Priority Email Support', 'Access to Analytics Dashboard'],
      highlight: true
    },
    {
      name: 'Business Plan',
      price: '$29',
      badge: 'Advanced',
      desc: 'Built for high-volume dining outlets and multi-branch operations.',
      features: ['Unlimited Locations', 'Unlimited Digital Menus', 'Custom Domain Mapping', 'Stripe Payments Sync (Coming Soon)', '24/7 Phone Desk Support'],
      highlight: false
    },
    {
      name: 'Enterprise Tier',
      price: 'Custom',
      badge: 'Tailored',
      desc: 'For hospitality chains and franchises requiring dedicated support agreements.',
      features: ['Custom POS Integrations', 'Multi-tenant admin controls', 'White-labeled layouts', 'Dedicated account strategist', 'Custom SLA agreements'],
      highlight: false
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
            'priceCurrency': 'USD'
          }
        }}
      />

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
        .timeline-bullet {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFF7ED;
          border: 2px solid #FFEDD5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #F97316;
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
        .pricing-card-overhaul {
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          padding: 40px 32px;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .pricing-card-overhaul.highlight {
          border-color: #F97316;
          box-shadow: 0 20px 40px rgba(249,115,22,0.08);
        }
        .pricing-card-overhaul:hover {
          transform: translateY(-8px);
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
                  <li><CloseOutlined style={{ color: '#991B1B', marginRight: '6px' }} /> Repetitive menu reprint expenses</li>
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
                  <li><CloseOutlined style={{ color: '#991B1B', marginRight: '6px' }} /> 15% to 30% order deductions</li>
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
              <Title level={3} style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Stop paying commissions to third-party delivery apps</Title>
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

          <Row gutter={[40, 40]} justify="center">
            {[
              { step: '01', title: 'Setup Restaurant Profile', body: 'Register business operations, maps address, contacts, and brand logos.' },
              { step: '02', title: 'Enter Menu Details', body: 'Upload food categories, dish photos, modifier pricing, and diet labels.' },
              { step: '03', title: 'Generate QR Stand SVG', body: 'Download vector files of table-specific QR codes, custom to your styling.' },
              { step: '04', title: 'Customers Scan to View', body: 'Guests scan using basic smartphone cameras. Menu renders instantly.' },
              { step: '05', title: 'Operations Grow', body: 'Analyze analytics telemetry, update menu availability, and scaling.' }
            ].map((node, index) => (
              <Col xs={24} md={4} key={index}>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div className="timeline-bullet">{node.step}</div>
                  </div>
                  <Title level={4} style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>{node.title}</Title>
                  <Paragraph style={{ fontSize: '12.5px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>{node.body}</Paragraph>
                </div>
              </Col>
            ))}
          </Row>
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
                      <span>🍔 Classic Truffle Cheeseburger</span>
                      <span style={{ color: '#F97316', fontWeight: 800 }}>$14.50</span>
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
                        <span>🍔 Classic Burger</span>
                        <span style={{ fontWeight: 850 }}>$12.00</span>
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

      {/* Pricing Section (Free, Starter, Business, Enterprise) */}
      <section id="pricing" style={{ padding: '120px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <Title level={2} style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1.5px', color: '#0F172A' }}>
              Transparent tiers for every restaurant scale
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#64748B', margin: '16px 0 0 0' }}>
              Start for free with basic configurations. Transition to business features as your traffic expands.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {pricingTiers.map((tier, idx) => (
              <Col xs={24} sm={12} lg={6} key={idx}>
                <div className={`pricing-card-overhaul ${tier.highlight ? 'highlight' : ''}`}>
                  {tier.highlight && (
                    <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#FFF7ED', border: '1px solid #FFD8A8', color: '#EA580C', fontWeight: 700, fontSize: '11px', padding: '4px 10px', borderRadius: '14px', textTransform: 'uppercase' }}>
                      {tier.badge}
                    </span>
                  )}
                  {!tier.highlight && (
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '8px', fontWeight: 700 }}>{tier.badge}</span>
                  )}
                  <Title level={3} style={{ fontSize: '22px', fontWeight: 800, margin: '12px 0 0 0', color: '#0F172A' }}>{tier.name}</Title>
                  <Paragraph style={{ color: '#64748B', fontSize: '13px', marginTop: '8px', minHeight: '40px' }}>{tier.desc}</Paragraph>
                  <div style={{ margin: '24px 0' }}>
                    <span style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A' }}>{tier.price}</span>
                    {tier.price !== 'Custom' && <span style={{ color: '#64748B', fontSize: '14px' }}>/mo</span>}
                  </div>
                  <Button 
                    type={tier.highlight ? 'primary' : 'default'} 
                    size="large" 
                    block 
                    onClick={() => navigate('/signup')}
                    style={{ 
                      height: '46px', 
                      borderRadius: '10px', 
                      fontWeight: 700, 
                      background: tier.highlight ? '#F97316' : undefined, 
                      borderColor: tier.highlight ? '#F97316' : undefined 
                    }}
                  >
                    Get Started
                  </Button>
                  <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '24px 0' }} />
                  <ul style={{ paddingLeft: '16px', color: '#475569', fontSize: '13px', lineHeight: '2' }}>
                    {tier.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            ))}
          </Row>
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

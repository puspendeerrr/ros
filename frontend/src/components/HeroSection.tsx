import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Row, Col, Typography } from 'antd';
import {
  QrcodeOutlined,
  BuildOutlined,
  ShopOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  RiseOutlined,
  ArrowRightOutlined,
  MobileOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

/* ────────────────────────────────────────────────────────────
   HERO SECTION COMPONENT (Static, Clean, Simplicity First)
   ──────────────────────────────────────────────────────────── */
export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .hero-section-v3 {
          position: relative;
          padding: 40px 24px 80px 24px;
          background: #FFFFFF;
          overflow: hidden;
        }
        .hero-grid-bg-v3 {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(249,115,22,0.015) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(249,115,22,0.015) 1px, transparent 1px);
          z-index: 1;
          pointer-events: none;
        }
        .hero-spotlight-v3 {
          position: absolute;
          top: -10%; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 400px;
          background: radial-gradient(circle, rgba(249,115,22,0.04) 0%, rgba(255,255,255,0) 70%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 2;
        }
        .hero-headline-v3 {
          font-size: clamp(2rem, 1.8rem + 2.5vw, 3.4rem) !important;
          font-weight: 900 !important;
          letter-spacing: -2px !important;
          line-height: 1.1 !important;
          margin: 0 0 20px 0 !important;
          color: #0F172A !important;
          max-width: 580px;
        }
        .hero-btn-primary-v3 {
          background: #F97316 !important;
          border-color: #F97316 !important;
          height: 52px !important;
          padding: 0 32px !important;
          border-radius: 10px !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          box-shadow: 0 8px 20px rgba(249,115,22,0.2) !important;
          transition: all 0.25s !important;
        }
        .hero-btn-primary-v3:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(249,115,22,0.3) !important;
        }
        .hero-btn-secondary-v3 {
          height: 52px !important;
          padding: 0 32px !important;
          border-radius: 10px !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          border-color: #CBD5E1 !important;
          color: #475569 !important;
          transition: all 0.25s !important;
        }
        .hero-btn-secondary-v3:hover {
          background: #F8FAFC !important;
          transform: translateY(-2px);
        }
        .benefit-item-v3 {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .benefit-icon-v3 {
          color: #22C55E;
          font-weight: 800;
        }
        .trust-text-v3 {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
          margin-top: 12px;
          display: block;
        }

        /* Workflow Journey Cards */
        .journey-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          position: relative;
        }
        .journey-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(15,23,42,0.03);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.2s ease-in-out;
        }
        .journey-card:hover {
          transform: translateY(-2px);
          border-color: #F97316;
          box-shadow: 0 8px 30px rgba(249,115,22,0.06);
        }
        .journey-badge {
          background: #FFF7ED;
          color: #EA580C;
          border: 1px solid #FFEDD5;
          font-size: 10px;
          font-weight: 750;
          padding: 2px 8px;
          border-radius: 20px;
          width: fit-content;
          margin-bottom: 12px;
        }
        .flow-arrow-h {
          position: absolute;
          top: 30%;
          left: 48%;
          transform: translateX(-50%);
          font-size: 18px;
          color: #F97316;
          opacity: 0.5;
          z-index: 10;
        }
        .flow-arrow-v {
          position: absolute;
          top: 48%;
          left: 25%;
          transform: rotate(90deg);
          font-size: 18px;
          color: #F97316;
          opacity: 0.5;
          z-index: 10;
        }
        .flow-arrow-v2 {
          position: absolute;
          top: 48%;
          left: 75%;
          transform: rotate(90deg);
          font-size: 18px;
          color: #F97316;
          opacity: 0.5;
          z-index: 10;
        }

        /* Responsive styling for right column */
        @media (max-width: 576px) {
          .journey-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .flow-arrow-h, .flow-arrow-v, .flow-arrow-v2 {
            display: none !important;
          }
        }
      `}</style>

      <section className="hero-section-v3">
        <div className="hero-grid-bg-v3" />
        <div className="hero-spotlight-v3" />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Row gutter={[48, 48]} align="middle">
            {/* ─── Left Side: Headline & Copy ─── */}
            <Col xs={24} lg={11}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '6px 14px', borderRadius: '30px', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px' }}>🇮🇳</span>
                <span style={{ color: '#EA580C', fontWeight: 750, fontSize: '11px', letterSpacing: '0.5px' }}>MADE FOR INDIAN RESTAURANTS</span>
              </div>

              <Title level={1} className="hero-headline-v3">
                Build a Modern Digital Restaurant in Minutes
              </Title>

              <Paragraph style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px' }}>
                Create your digital menu, generate QR codes, manage your restaurant profile, and give customers a premium menu experience — all from one simple dashboard.
              </Paragraph>

              {/* Benefits checklist */}
              <Row gutter={[16, 12]} style={{ marginBottom: '28px', maxWidth: '500px' }}>
                {[
                  'Digital QR Menu',
                  'Update Menu Anytime',
                  'No Printing Cost',
                  'Restaurant Website Included',
                  'Mobile Friendly',
                  'Ready in Minutes',
                ].map(b => (
                  <Col span={12} key={b}>
                    <span className="benefit-item-v3">
                      <span className="benefit-icon-v3">✓</span> {b}
                    </span>
                  </Col>
                ))}
              </Row>

              {/* CTAs */}
              <Flex gap={12} wrap="wrap">
                <Button
                  type="primary"
                  size="large"
                  className="hero-btn-primary-v3"
                  onClick={() => navigate('/signup')}
                >
                  Create My Restaurant
                </Button>
                <Button
                  type="default"
                  size="large"
                  className="hero-btn-secondary-v3"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See How It Works
                </Button>
              </Flex>

              <span className="trust-text-v3">
                No Credit Card Required • Setup in Minutes • Made for Indian Restaurants
              </span>
            </Col>

            {/* ─── Right Side: Visual Workflow Journey ─── */}
            <Col xs={24} lg={13}>
              <div className="journey-grid">
                {/* Connecting Arrows for Desktop */}
                <div className="flow-arrow-h"><ArrowRightOutlined /></div>
                <div className="flow-arrow-v"><ArrowRightOutlined /></div>
                <div className="flow-arrow-v2"><ArrowRightOutlined /></div>

                {/* ── Step 1: Owner Dashboard ── */}
                <div className="journey-card">
                  <div className="journey-badge">STEP 1 • OWNER ADDS INFO</div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F8FAFC', padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '12px' }}>🏪</span>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A' }}>The Pepper Bistro</span>
                    </div>
                    <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#475569' }}>Add Menu Item:</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ flex: 1, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '3px 6px', fontSize: '8px', color: '#475569' }}>Paneer Tikka</div>
                        <div style={{ width: '40px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '3px 6px', fontSize: '8px', color: '#475569' }}>₹260</div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', alignSelf: 'flex-end' }}>
                        <span style={{ fontSize: '7px', color: '#16A34A', background: '#F0FDF4', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>🟢 Veg Added</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Step 2: QR Generated ── */}
                <div className="journey-card" style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <div className="journey-badge" style={{ alignSelf: 'flex-start' }}>STEP 2 • QR GENERATED</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
                    <div style={{ background: '#FFF7ED', border: '2px solid #FFEDD5', padding: '14px', borderRadius: '16px', display: 'inline-flex' }}>
                      <QrcodeOutlined style={{ fontSize: '48px', color: '#F97316' }} />
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 750, color: '#0F172A', textAlign: 'center' }}>Unique QR Menu Created</span>
                    <span style={{ fontSize: '8px', color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '10px' }}>Table Stands Ready</span>
                  </div>
                </div>

                {/* ── Step 3: Customer Scans ── */}
                <div className="journey-card">
                  <div className="journey-badge">STEP 3 • CUSTOMER SCANS</div>
                  <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* Tiny phone screen mock */}
                    <div style={{ width: '70px', height: '110px', background: '#0F172A', borderRadius: '8px', border: '2px solid #1E293B', padding: '2px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '4px', padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ fontSize: '5px', fontWeight: 800, color: '#0F172A' }}>Pepper Bistro</div>
                        <div style={{ background: '#FFF7ED', padding: '2px', borderRadius: '2px', fontSize: '4.5px', color: '#EA580C', fontWeight: 700 }}>🍛 Paneer Tikka</div>
                        <div style={{ fontSize: '5px', fontWeight: 900, color: '#F97316' }}>₹260</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#0F172A' }}>Instant Digital Menu</span>
                      <span style={{ fontSize: '7.5px', color: '#64748B', lineHeight: '1.3' }}>Diners scan QR on table to view categories, photos, and live prices.</span>
                    </div>
                  </div>
                </div>

                {/* ── Step 4: Growth ── */}
                <div className="journey-card">
                  <div className="journey-badge">STEP 4 • RESTAURANT GROWS</div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                    {[
                      { icon: '📈', label: 'More Orders' },
                      { icon: '⭐', label: 'Better Dining Experience' },
                      { icon: '💰', label: 'Zero Printing Cost' },
                      { icon: '🔄', label: 'Instant Menu Updates' },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '4px 8px', borderRadius: '6px', border: '1px solid #F1F5F9' }}>
                        <span style={{ fontSize: '10px' }}>{r.icon}</span>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#334155' }}>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

/* ────────────────────────────────────────────────────────────
   FEATURES SECTION (6 Feature Cards Below Hero)
   ──────────────────────────────────────────────────────────── */
export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <MobileOutlined style={{ color: '#F97316', fontSize: '24px' }} />,
      title: '📱 QR Menu',
      desc: 'Create QR menus for every table.',
    },
    {
      icon: <BuildOutlined style={{ color: '#F97316', fontSize: '24px' }} />,
      title: '🍽 Menu Builder',
      desc: 'Update food items, prices and photos anytime.',
    },
    {
      icon: <ShopOutlined style={{ color: '#F97316', fontSize: '24px' }} />,
      title: '🏪 Restaurant Profile',
      desc: 'Show customers your restaurant information.',
    },
    {
      icon: <GlobalOutlined style={{ color: '#F97316', fontSize: '24px' }} />,
      title: '🌐 Restaurant Website',
      desc: 'Get your own professional restaurant page.',
    },
    {
      icon: <AppstoreOutlined style={{ color: '#F97316', fontSize: '24px' }} />,
      title: '📊 Dashboard',
      desc: 'Manage everything from one place.',
    },
    {
      icon: <RiseOutlined style={{ color: '#F97316', fontSize: '24px' }} />,
      title: '📈 Grow Your Business',
      desc: 'Give customers a modern dining experience.',
    },
  ];

  return (
    <>
      <style>{`
        .features-section-v3 {
          padding: 80px 24px;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
        }
        .features-grid-v3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .feature-card-v3 {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(15,23,42,0.02);
          transition: all 0.25s ease-in-out;
        }
        .feature-card-v3:hover {
          transform: translateY(-3px);
          border-color: #F97316;
          box-shadow: 0 12px 30px rgba(249,115,22,0.06);
        }
        .feature-title-v3 {
          font-size: 18px;
          fontWeight: 800;
          color: #0F172A;
          margin: 16px 0 8px 0;
        }
        .feature-desc-v3 {
          font-size: 13.5px;
          color: #64748B;
          line-height: 1.5;
        }
        @media (max-width: 991px) {
          .features-grid-v3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .features-grid-v3 {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      <section className="features-section-v3" id="how-it-works">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <Title level={2} style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>
              Everything You Need to Run Your Restaurant Digitally
            </Title>
            <Paragraph style={{ fontSize: '15px', color: '#64748B', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Simple, powerful tools designed specifically for non-technical restaurant owners in India.
            </Paragraph>
          </div>

          <div className="features-grid-v3">
            {features.map((f, i) => (
              <div key={i} className="feature-card-v3">
                <div>{f.icon}</div>
                <div className="feature-title-v3">{f.title}</div>
                <div className="feature-desc-v3">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

/* ────────────────────────────────────────────────────────────
   SOCIAL PROOF METRICS STRIP (Phase 11)
   ──────────────────────────────────────────────────────────── */
export const SocialProofMetrics: React.FC = () => {
  const metrics = [
    { value: '1,000+', label: 'Restaurants Ready' },
    { value: '50,000+', label: 'QR Scans Served' },
    { value: '99.9%', label: 'Cloud Availability' },
    { value: '24×7', label: 'Accessible Anywhere' },
  ];

  return (
    <section style={{ padding: '36px 24px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Row gutter={[24, 24]} justify="center" align="middle">
          {metrics.map((m, i) => (
            <Col xs={12} sm={6} key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', lineHeight: 1.2 }}>
                {m.value}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{m.label}</div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

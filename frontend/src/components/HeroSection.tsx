import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Row, Col, Typography } from 'antd';
import {
  QrCode,
  Utensils,
  Store,
  Globe,
  LayoutDashboard,
  TrendingUp,
  ArrowRight,
  Smartphone,
  Camera,
  Check,
} from 'lucide-react';

const { Title, Paragraph } = Typography;

/* ────────────────────────────────────────────────────────────
   FoodVegIndicator — Indian standard Veg (🟢) / Non-Veg (🔴) vector label
   ──────────────────────────────────────────────────────────── */
const FoodVegIndicator: React.FC<{ isVeg: boolean }> = ({ isVeg }) => (
  <div style={{
    width: '8px',
    height: '8px',
    border: `1px solid ${isVeg ? '#16A34A' : '#DC2626'}`,
    padding: '1px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1px',
    background: '#FFFFFF'
  }}>
    <div style={{
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: isVeg ? '#16A34A' : '#DC2626'
    }} />
  </div>
);

/* ────────────────────────────────────────────────────────────
   HERO SECTION COMPONENT (Super Simple - "Ghanta kuch na pata ho tab bhi samajh aaye")
   ──────────────────────────────────────────────────────────── */
export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .hero-section-v4 {
          position: relative;
          padding: 48px 24px 80px 24px;
          background: #FFFFFF;
          overflow: hidden;
        }
        .hero-grid-bg-v4 {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(249,115,22,0.015) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(249,115,22,0.015) 1px, transparent 1px);
          z-index: 1;
          pointer-events: none;
        }
        .hero-spotlight-v4 {
          position: absolute;
          top: -10%; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 400px;
          background: radial-gradient(circle, rgba(249,115,22,0.04) 0%, rgba(255,255,255,0) 70%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 2;
        }
        .hero-headline-v4 {
          font-size: clamp(2rem, 1.8rem + 2.5vw, 3.4rem) !important;
          font-weight: 900 !important;
          letter-spacing: -2px !important;
          line-height: 1.1 !important;
          margin: 0 0 20px 0 !important;
          color: #0F172A !important;
          max-width: 580px;
        }
        .hero-btn-primary-v4 {
          background: #F97316 !important;
          border-color: #F97316 !important;
          height: 54px !important;
          padding: 0 36px !important;
          border-radius: 12px !important;
          font-weight: 750 !important;
          font-size: 16px !important;
          box-shadow: 0 8px 20px rgba(249,115,22,0.25) !important;
          transition: all 0.25s !important;
        }
        .hero-btn-primary-v4:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(249,115,22,0.35) !important;
        }
        .hero-btn-secondary-v4 {
          height: 54px !important;
          padding: 0 36px !important;
          border-radius: 12px !important;
          font-weight: 750 !important;
          font-size: 16px !important;
          border-color: #CBD5E1 !important;
          color: #475569 !important;
          transition: all 0.25s !important;
        }
        .hero-btn-secondary-v4:hover {
          background: #F8FAFC !important;
          transform: translateY(-2px);
        }
        .benefit-item-v4 {
          font-size: 15px;
          font-weight: 700;
          color: #1E293B;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .benefit-icon-v4 {
          color: #22C55E;
          font-weight: 900;
          font-size: 16px;
        }
        .trust-text-v4 {
          font-size: 13px;
          color: #64748B;
          font-weight: 600;
          margin-top: 14px;
          display: block;
        }

        /* Physical Table Stand Mockup */
        .physical-stand {
          width: 160px;
          height: 240px;
          background: linear-gradient(to bottom, #475569, #1E293B);
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 20px 40px rgba(15,23,42,0.15);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .stand-base {
          position: absolute;
          bottom: -12px;
          left: -10px;
          right: -10px;
          height: 16px;
          background: #0F172A;
          border-radius: 4px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .stand-card {
          flex: 1;
          background: #FFFFFF;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
        }

        /* Phone Mockup */
        .customer-phone {
          width: 170px;
          height: 310px;
          background: #0F172A;
          border-radius: 28px;
          border: 6px solid #0F172A;
          box-shadow: 0 25px 50px rgba(15,23,42,0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .phone-screen {
          flex: 1;
          background: #FFFFFF;
          border-radius: 22px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Connecting arrow */
        .connecting-flow {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #F97316;
          z-index: 10;
        }
        .connecting-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          animation: pulse-arrow 2s infinite;
        }
        @keyframes pulse-arrow {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(6px); opacity: 1; }
        }

        /* Mobile overrides */
        @media (max-width: 576px) {
          .visual-journey-v4 {
            flex-direction: column !important;
            gap: 40px !important;
            align-items: center !important;
          }
          .connecting-flow {
            transform: rotate(90deg);
          }
          @keyframes pulse-arrow {
            0%, 100% { transform: translateY(0); opacity: 0.6; }
            50% { transform: translateY(6px); opacity: 1; }
          }
        }
      `}</style>

      <section className="hero-section-v4">
        <div className="hero-grid-bg-v4" />
        <div className="hero-spotlight-v4" />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Row gutter={[48, 48]} align="middle">
            {/* ─── Left Side: Super Simple Headline & Checklist ─── */}
            <Col xs={24} lg={11}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '6px 14px', borderRadius: '30px', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px' }}>🇮🇳</span>
                <span style={{ color: '#EA580C', fontWeight: 750, fontSize: '11px', letterSpacing: '0.5px' }}>MADE FOR INDIAN RESTAURANTS</span>
              </div>

              <Title level={1} className="hero-headline-v4">
                Put QR Menus on Your Tables. Zero Printing Costs.
              </Title>

              <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6, marginBottom: '28px', maxWidth: '520px' }}>
                Stop printing paper menus. Generate a QR code stand for your tables. Customers scan it with their mobile camera to see your full menu instantly — and you can change items or prices anytime from your phone.
              </Paragraph>

              {/* Checklist */}
              <Row gutter={[16, 16]} style={{ marginBottom: '32px', maxWidth: '520px' }}>
                {[
                  'Digital QR Menu',
                  'Update Menu Anytime',
                  'No Printing Cost',
                  'Restaurant Website Included',
                  'Mobile Friendly',
                  'Ready in Minutes',
                ].map(b => (
                  <Col span={12} key={b}>
                    <span className="benefit-item-v4">
                      <Check size={16} strokeWidth={3} style={{ color: '#22C55E' }} /> {b}
                    </span>
                  </Col>
                ))}
              </Row>

              {/* CTAs */}
              <Flex gap={12} wrap="wrap">
                <Button
                  type="primary"
                  size="large"
                  className="hero-btn-primary-v4"
                  onClick={() => navigate('/signup')}
                >
                  Create My Restaurant
                </Button>
                <Button
                  type="default"
                  size="large"
                  className="hero-btn-secondary-v4"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See How It Works
                </Button>
              </Flex>

              <span className="trust-text-v4">
                No Credit Card Required • Setup in Minutes • Made for Indian Restaurants
              </span>
            </Col>

            {/* ─── Right Side: Visually Self-Explanatory Table-Stand to Phone Flow ─── */}
            <Col xs={24} lg={13}>
              <div 
                className="visual-journey-v4"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', position: 'relative' }}
              >
                {/* 1. Physical QR Table Stand */}
                <div className="physical-stand">
                  <div className="stand-card">
                    <span style={{ fontSize: '8px', fontWeight: 800, color: '#EA580C', background: '#FFF7ED', padding: '2px 8px', borderRadius: '10px' }}>THE PEPPER BISTRO</span>
                    <QrCode size={72} strokeWidth={1.5} style={{ color: '#0F172A', margin: '12px 0' }} />
                    <div>
                      <span style={{ display: 'block', fontSize: '9px', fontWeight: 900, color: '#0F172A' }}>SCAN TO VIEW MENU</span>
                      <span style={{ display: 'block', fontSize: '6px', color: '#64748B', marginTop: '2px' }}>No App Download Required</span>
                    </div>
                  </div>
                  <div className="stand-base" />
                </div>

                {/* 2. Dotted Connecting Flow with Label */}
                <div className="connecting-flow">
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', background: '#FFF7ED', padding: '4px 10px', borderRadius: '12px', border: '1px solid #FFEDD5', color: '#EA580C', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Camera size={12} /> Scan QR
                  </span>
                  <span className="connecting-arrow"><ArrowRight size={20} strokeWidth={3} /></span>
                </div>

                {/* 3. Sleek Mobile Mockup displaying Diner Menu */}
                <div className="customer-phone">
                  <div className="phone-screen">
                    {/* Header Banner */}
                    <div style={{ height: '48px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '6px 10px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800 }}>The Pepper Bistro</span>
                      <span style={{ fontSize: '5.5px', color: '#94A3B8' }}>Koramangala, Bengaluru</span>
                    </div>
                    {/* Status badge floating inside phone */}
                    <div style={{ margin: '-8px 6px 4px 6px', background: '#FFFFFF', borderRadius: '4px', padding: '4px', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                      <span style={{ fontSize: '7px', fontWeight: 800, color: '#0F172A' }}>Digital Menu</span>
                      <span style={{ fontSize: '5px', background: '#F0FDF4', color: '#16A34A', padding: '1px 3px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#16A34A' }} /> Open
                      </span>
                    </div>
                    {/* Menu items */}
                    <div style={{ padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'hidden' }}>
                      {[
                        { name: 'Paneer Butter Masala', price: '₹280', veg: true },
                        { name: 'Chicken Biryani', price: '₹340', veg: false },
                        { name: 'Dal Makhani', price: '₹220', veg: true },
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '5px', padding: '4px', background: '#FFFFFF', borderRadius: '4px', border: '1px solid #F1F5F9', alignItems: 'center' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Utensils size={10} style={{ color: '#EA580C' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', lineHeight: 1 }}>
                              <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#1E293B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</span>
                              <FoodVegIndicator isVeg={item.veg} />
                            </div>
                            <span style={{ display: 'block', fontSize: '7.5px', fontWeight: 900, color: '#F97316', marginTop: '2px' }}>{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#FFFFFF', borderTop: '1px solid #F1F5F9', padding: '4px 0', textAlign: 'center', fontSize: '5.5px', color: '#94A3B8', fontWeight: 600 }}>
                      Powered by Restaurant OS
                    </div>
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
      icon: <Smartphone size={24} style={{ color: '#F97316' }} />,
      title: '📱 QR Menu',
      desc: 'Create QR menus for every table.',
    },
    {
      icon: <Utensils size={24} style={{ color: '#F97316' }} />,
      title: '🍽 Menu Builder',
      desc: 'Update food items, prices and photos anytime.',
    },
    {
      icon: <Store size={24} style={{ color: '#F97316' }} />,
      title: '🏪 Restaurant Profile',
      desc: 'Show customers your restaurant information.',
    },
    {
      icon: <Globe size={24} style={{ color: '#F97316' }} />,
      title: '🌐 Restaurant Website',
      desc: 'Get your own professional restaurant page.',
    },
    {
      icon: <LayoutDashboard size={24} style={{ color: '#F97316' }} />,
      title: '📊 Dashboard',
      desc: 'Manage everything from one place.',
    },
    {
      icon: <TrendingUp size={24} style={{ color: '#F97316' }} />,
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

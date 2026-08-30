import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Typography, Collapse } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { SEOManager } from '../components/SEOManager.js';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

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

  const pricingFaqs = [
    { q: 'Is there a contract or setup fee?', a: 'No setup fees or mandatory contracts. You can upgrade, downgrade, or cancel your monthly subscription plan at any time.' },
    { q: 'What payment methods do you support?', a: 'We accept all major credit cards, debit cards, and local UPI/net-banking transfers via secure merchant checkouts.' },
    { q: 'Are menu view scans limited on the Free plan?', a: 'No, we support unlimited QR scans and catalog views even on the Free Starter plan. We never penalize you for guest traffic.' },
    { q: 'Can I add multiple restaurant branches under a single plan?', a: 'Yes! Our Business and Enterprise plans are designed to aggregate multi-branch controls and menu management under a unified manager dashboard.' },
    { q: 'Do you charge transaction fees on digital payments?', a: 'No, Restaurant OS charges 0% transaction commissions. Standard payment gateway processing charges of your payment merchant apply.' }
  ];

  return (
    <div style={{ padding: '100px 24px', background: '#FFFFFF', overflow: 'hidden' }}>
      <SEOManager 
        title="SaaS Plans & Transparent Pricing" 
        description="Select the perfect digital menu package for your restaurant. Start free and unlock custom domains, POS integrations, and priorities support." 
      />

      <style>{`
        .pricing-glow {
          position: absolute;
          top: -15%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, rgba(255,255,255,0) 70%);
          filter: blur(80px);
          pointer-events: none;
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <div className="pricing-glow" />

        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'inline-block', background: '#FFF7ED', padding: '6px 14px', borderRadius: '30px', color: '#EA580C', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px', border: '1px solid #FFEDD5' }}>
            PRICING SCHEDULING
          </div>
          <Title level={1} style={{ fontSize: '46px', fontWeight: 900, color: '#0F172A', letterSpacing: '-2px', marginBottom: '16px' }}>
            Simple, commission-free packages
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#475569', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Keep 100% of your operational menu sales. Grow with zero transaction deductions.
          </Paragraph>
        </div>

        {/* Pricing Cards Grid */}
        <Row gutter={[24, 24]} style={{ marginBottom: '100px' }}>
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
                    <li key={i} style={{ marginBottom: '8px' }}>
                      <CheckOutlined style={{ color: '#F97316', marginRight: '8px' }} /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          ))}
        </Row>

        {/* Pricing FAQs Block */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>Pricing Inquiries</Title>
            <Paragraph style={{ color: '#64748B', fontSize: '16px' }}>Answers to standard billing questions.</Paragraph>
          </div>

          <Collapse 
            accordion 
            bordered={false} 
            expandIconPosition="end"
            style={{ background: 'transparent' }}
          >
            {pricingFaqs.map((faq, idx) => (
              <Panel 
                header={<span style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>{faq.q}</span>} 
                key={idx}
                style={{ background: '#F8FAFC', borderRadius: '14px', marginBottom: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}
              >
                <Paragraph style={{ color: '#475569', fontSize: '13.5px', lineHeight: '1.65', margin: 0 }}>
                  {faq.a}
                </Paragraph>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Typography, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import {
  ShopOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  MobileOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { SEOManager } from '../components/SEOManager.js';

const { Title, Paragraph } = Typography;

export const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };

  const pillars = [
    {
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Commission Free Always',
      desc: 'No transaction fees, no margin cuts, no intermediary platform fees. Your hard-earned revenue remains entirely yours.'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Fast Setup Under 5 Min',
      desc: 'Simple onboarding. Register your storefront, upload your categories, and print vector QR stands in minutes.'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Modern Cloud Architecture',
      desc: 'Your catalog hosted on global edge servers, ensuring lightning-fast load times for dining guests.'
    },
    {
      icon: <MobileOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Tactile Mobile Experience',
      desc: 'Optimized for one-hand guest browsing. Clean category tabs, notch adjustments, and touch targets.'
    },
    {
      icon: <ShopOutlined style={{ fontSize: '24px', color: '#F97316' }} />,
      title: 'Built for Restaurants First',
      desc: 'From small cafes and cloud kitchens to franchise chains. We fit custom configurations at all hospitality scales.'
    }
  ];

  return (
    <div style={{ padding: '100px 24px', background: '#FFFFFF', overflow: 'hidden' }}>
      <SEOManager 
        title="Our Mission & Values" 
        description="Learn about the core principles behind Restaurant OS—providing commission-free, lightning-fast digital menus for modern dining rooms." 
      />

      <style>{`
        .about-glow {
          position: absolute;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(249,115,22,0.05) 0%, rgba(255,255,255,0) 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .about-bento-card {
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 36px;
          height: 100%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-bento-card:hover {
          transform: translateY(-4px);
          border-color: #F97316;
          box-shadow: 0 16px 36px rgba(249,115,22,0.05);
        }
        .pillar-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #FFF7ED;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border: 1px solid #FFEDD5;
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <div className="about-glow" />

        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
          <Title level={1} style={{ fontSize: '46px', fontWeight: 900, color: '#0F172A', letterSpacing: '-2px', marginBottom: '16px' }}>
            Empowering kitchens to own their <span style={{ color: '#F97316' }}>digital presence.</span>
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#475569', maxWidth: '640px', margin: '0 auto', lineHeight: '1.65' }}>
            Restaurant OS was founded to level the playing field, giving local owners enterprise-grade tools without the enterprise price tags.
          </Paragraph>
        </div>

        {/* Bento Grid: Mission & Vision */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginBottom: '80px' }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <div className="about-bento-card" style={{ borderLeft: '6px solid #F97316' }}>
                  <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Our Mission</Title>
                  <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.75', margin: 0 }}>
                    We aim to bypass middleman platform commissions by offering cafe owners robust menu-building software. Digital ordering should be an organic extension of restaurant operations—accessible, scalable, and fully owned by the brand.
                  </Paragraph>
                </div>
              </motion.div>
            </Col>
            <Col xs={24} md={12}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <div className="about-bento-card" style={{ borderLeft: '6px solid #0F172A' }}>
                  <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Our Vision</Title>
                  <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.75', margin: 0 }}>
                    To establish a commission-free dining infrastructure that powers thousands of cafes, hotels, food courts, and kitchens across India. We build tools that make hospitality services fast, tactile, and highly cost-effective.
                  </Paragraph>
                </div>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Core Pillars Grid */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={2} style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px' }}>Our Operational Pillars</Title>
          <Paragraph style={{ color: '#64748B', fontSize: '16px' }}>The guiding values built into every line of code.</Paragraph>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Row gutter={[24, 24]}>
            {pillars.map((pillar, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <div className="about-bento-card">
                    <div className="pillar-icon-wrap">{pillar.icon}</div>
                    <Title level={4} style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>{pillar.title}</Title>
                    <Paragraph style={{ color: '#64748B', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>{pillar.desc}</Paragraph>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </div>
    </div>
  );
};

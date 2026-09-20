import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Button, Flex, Input, message, Row, Col } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Header as EnterpriseHeader } from '../components/navigation/Header.js';
import { FOOTER_SECTIONS } from '../config/navigation.config.js';
import logo from '../assets/logo.png';

const { Content, Footer } = Layout;

export const LandingLayout: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = () => {
    if (!emailInput) {
      message.error('Please enter a valid email address.');
      return;
    }
    message.success('Thank you for subscribing to our newsletter!');
    setEmailInput('');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Skip to Content for Keyboard Accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Accessible Live Region for Screen Reader Announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-live-region" 
        id="a11y-status-announcer" 
      />

      {/* Enterprise Sticky Header with MegaMenu, CommandPalette, MobileNav */}
      <EnterpriseHeader />


      {/* Main Page Content Landmark */}
      <Content id="main-content" role="main" style={{ background: '#FFFFFF' }}>
        <Outlet />
      </Content>

      {/* Footer Landmark */}
      <Footer role="contentinfo" style={{ background: '#0F172A', color: '#94A3B8', padding: '72px 24px 36px 24px', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {/* Top Brand & Newsletter Banner */}
          <Row gutter={[40, 32]} justify="space-between" align="middle" style={{ marginBottom: '48px', paddingBottom: '40px', borderBottom: '1px solid #1E293B' }}>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: '16px' }}>
                <img 
                  src={logo} 
                  alt="Restaurant OS" 
                  style={{ 
                    height: '130px', 
                    marginTop: '-52px', 
                    marginBottom: '-52px', 
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </div>
              <p style={{ color: '#94A3B8', fontSize: '14.5px', lineHeight: '1.6', maxWidth: '440px', margin: 0 }}>
                Run your restaurant like a tech company. All the digital menu and QR ordering features you need in one unified, commission-free platform.
              </p>
            </Col>

            <Col xs={24} md={12}>
              <Flex vertical gap={8} style={{ maxWidth: '420px', marginLeft: 'auto' }}>
                <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px' }}>Stay ahead with Hospitality Tech insights</span>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Get monthly product updates, operational guides, and growth strategies.</span>
                <Flex gap={8} style={{ marginTop: '4px' }}>
                  <Input 
                    type="email" 
                    placeholder="Enter business email" 
                    aria-label="Business email for newsletter"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF', borderRadius: '6px', height: '40px' }} 
                  />
                  <Button 
                    type="primary" 
                    onClick={handleSubscribe}
                    style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '6px', height: '40px', fontWeight: 600 }}
                  >
                    Subscribe
                  </Button>
                </Flex>
              </Flex>
            </Col>
          </Row>

          {/* 5-Column Navigation Grid */}
          <Row gutter={[32, 36]}>
            {FOOTER_SECTIONS.map((section, idx) => (
              <Col key={idx} xs={12} sm={8} md={6} lg={idx === 0 ? 5 : idx === 1 ? 5 : 4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {section.title}
                  </span>
                  {section.items.map((linkItem) => (
                    linkItem.isExternal ? (
                      <a
                        key={linkItem.path}
                        href={linkItem.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link-redesign"
                      >
                        {linkItem.label}
                      </a>
                    ) : (
                      <Link
                        key={linkItem.path}
                        to={linkItem.path}
                        className="footer-link-redesign"
                      >
                        {linkItem.label}
                      </Link>
                    )
                  ))}
                </div>
              </Col>
            ))}
          </Row>

          <hr style={{ border: 'none', borderTop: '1px solid #1E293B', margin: '48px 0 24px 0' }} />

          {/* Bottom Bar */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={16} style={{ fontSize: '13px', color: '#64748B' }}>
            <span>© {new Date().getFullYear()} Restaurant OS. All rights reserved. Enterprise Restaurant Technology.</span>
            <Flex gap={16} align="center" wrap="wrap">
              <span style={{ fontSize: '12px', background: '#1E293B', padding: '3px 8px', borderRadius: '4px', color: '#94A3B8' }}>v2.0.4 Enterprise</span>
              <Link to="/legal/privacy-policy" className="footer-link-redesign" style={{ fontSize: '13px' }}>Privacy Policy</Link>
              <Link to="/legal/terms-of-service" className="footer-link-redesign" style={{ fontSize: '13px' }}>Terms of Service</Link>
              <a href="/.well-known/security.txt" className="footer-link-redesign" style={{ fontSize: '13px' }}>Security (RFC 9116)</a>
              <a href="/llms.txt" className="footer-link-redesign" style={{ fontSize: '13px' }}>LLMs.txt</a>
            </Flex>
          </Flex>
        </div>
      </Footer>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 1000 }}
          >
            <Button
              type="primary"
              shape="circle"
              aria-label="Scroll back to top"
              icon={<VerticalAlignTopOutlined style={{ fontSize: '18px' }} />}
              size="large"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                background: '#F97316',
                borderColor: '#F97316',
                boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

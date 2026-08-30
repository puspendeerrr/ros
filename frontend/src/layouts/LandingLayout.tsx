import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Flex, Drawer, Input, message, Row, Col } from 'antd';
import { 
  MenuOutlined, 
  VerticalAlignTopOutlined,
  MailOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/auth.store.js';
import logo from '../assets/logo.png';
import logoIcon from '../assets/logo-icon.png';

const { Header, Content, Footer } = Layout;

export const LandingLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      navigate('/');
    }
  };

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
      <style>{`
        .landing-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: ${isScrolled ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 1)'} !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid ${isScrolled ? '#E2E8F0' : '#F1F5F9'};
          box-shadow: ${isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.02)' : 'none'};
          padding: 0 24px;
          height: 64px;
          line-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
        }
        .landing-nav-link {
          color: #475569;
          font-weight: 600;
          font-size: 14px;
          transition: color 0.2s;
          padding: 0 16px;
          text-decoration: none;
          position: relative;
        }
        .landing-nav-link:hover, .landing-nav-link.active {
          color: #F97316;
        }
        .footer-link-redesign {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.2s;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-link-redesign:hover {
          color: #F97316;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Sticky Header */}
      <Header className="landing-header">
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '100%' }} onClick={handleLogoClick}>
          <img 
            src={logo} 
            alt="Restaurant OS" 
            style={{ 
              height: '140px', 
              marginTop: '-56px', 
              marginBottom: '-56px', 
              objectFit: 'contain',
              display: 'inline-block'
            }} 
            className="desktop-nav"
          />
          <img 
            src={logoIcon} 
            alt="ROS" 
            style={{ 
              height: '32px', 
              objectFit: 'contain',
              display: 'none'
            }} 
            className="mobile-menu-btn"
          />
        </div>

        {/* Desktop Navigation Links */}
        <Flex align="center" className="desktop-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`landing-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </Flex>

        {/* Auth CTA Buttons */}
        <Flex align="center" gap={12} className="desktop-nav">
          {isAuthenticated ? (
            <Button 
              type="primary" 
              onClick={() => navigate('/dashboard')}
              style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', fontWeight: 600, height: '40px' }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button type="text" onClick={() => navigate('/login')} style={{ color: '#475569', fontWeight: 600 }}>
                Login
              </Button>
              <Button 
                type="primary" 
                onClick={() => navigate('/signup')}
                style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', fontWeight: 600, height: '40px' }}
              >
                Get Started
              </Button>
            </>
          )}
        </Flex>

        {/* Mobile Hamburger Button */}
        <Button 
          type="text" 
          icon={<MenuOutlined style={{ fontSize: '18px', color: '#475569' }} />} 
          className="mobile-menu-btn" 
          onClick={() => setDrawerVisible(true)}
          style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
      </Header>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <img 
            src={logo} 
            alt="Restaurant OS" 
            style={{ 
              height: '140px', 
              marginTop: '-56px', 
              marginBottom: '-56px', 
              objectFit: 'contain'
            }} 
          />
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width="280px"
      >
        <Flex vertical gap={16} style={{ padding: '8px 0' }}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              style={{ 
                fontSize: '16px', 
                color: location.pathname === link.path ? '#F97316' : '#475569', 
                fontWeight: 600,
                textDecoration: 'none',
                padding: '8px 0',
                borderBottom: '1px solid #F1F5F9'
              }}
              onClick={() => setDrawerVisible(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <Flex vertical gap={12} style={{ marginTop: '24px' }}>
            {isAuthenticated ? (
              <Button 
                type="primary" 
                block 
                size="large"
                onClick={() => {
                  setDrawerVisible(false);
                  navigate('/dashboard');
                }}
                style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', fontWeight: 600 }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  type="default" 
                  block 
                  size="large"
                  onClick={() => {
                    setDrawerVisible(false);
                    navigate('/login');
                  }}
                  style={{ borderRadius: '10px' }}
                >
                  Login
                </Button>
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  onClick={() => {
                    setDrawerVisible(false);
                    navigate('/signup');
                  }}
                  style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', fontWeight: 600 }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Drawer>

      {/* Main Page Content */}
      <Content style={{ background: '#FFFFFF' }}>
        <Outlet />
      </Content>

      {/* Footer Redesign */}
      <Footer style={{ background: '#0F172A', color: '#94A3B8', padding: '80px 24px 40px 24px', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 48]} justify="space-between">
            {/* Branding Column */}
            <Col xs={24} lg={8}>
              <div style={{ marginBottom: '20px' }}>
                <img 
                  src={logo} 
                  alt="Restaurant OS" 
                  style={{ 
                    height: '140px', 
                    marginTop: '-56px', 
                    marginBottom: '-56px', 
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </div>
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.65', maxWidth: '320px', marginBottom: '24px' }}>
                Run your restaurant like a tech company. All the digital menu and QR ordering features you need in one unified, commission-free platform.
              </p>
              <Flex gap={8} wrap="wrap">
                <span style={{ fontSize: '12px', background: '#1E293B', padding: '4px 10px', borderRadius: '4px', color: '#94A3B8', fontWeight: 500 }}>v2.0.4</span>
                <span style={{ fontSize: '12px', background: '#1E293B', padding: '4px 10px', borderRadius: '4px', color: '#94A3B8', fontWeight: 500 }}>React + TS</span>
                <span style={{ fontSize: '12px', background: '#1E293B', padding: '4px 10px', borderRadius: '4px', color: '#94A3B8', fontWeight: 500 }}>Made in India 🇮🇳</span>
              </Flex>
            </Col>

            {/* Links Columns */}
            <Col xs={24} sm={12} lg={8}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Flex vertical gap={12}>
                    <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }}>Product</span>
                    <Link to="/features" className="footer-link-redesign">Features</Link>
                    <Link to="/about" className="footer-link-redesign">About Brand</Link>
                  </Flex>
                </Col>
                <Col span={12}>
                  <Flex vertical gap={12}>
                    <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }}>Support Desk</span>
                    <a href="mailto:support@ros.algorithyum.in" className="footer-link-redesign">
                      <MailOutlined /> Email Support
                    </a>
                    <Link to="/contact" className="footer-link-redesign">
                      <CustomerServiceOutlined /> Contact Sales
                    </Link>
                    <a href="#" className="footer-link-redesign">
                      <BookOutlined /> Documentation
                    </a>
                    <a href="#" className="footer-link-redesign">
                      <MessageOutlined /> Help Center
                    </a>
                  </Flex>
                </Col>
              </Row>
            </Col>

            {/* Newsletter Column */}
            <Col xs={24} sm={12} lg={8}>
              <Flex vertical gap={12} style={{ maxWidth: '320px' }}>
                <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }}>Subscribe to updates</span>
                <span style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>Get latest feature updates, restaurant guides, and system status straight to your inbox.</span>
                <Flex gap={8} style={{ marginTop: '8px' }}>
                  <Input 
                    type="email" 
                    placeholder="Enter email address" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF', borderRadius: '8px', height: '40px' }} 
                  />
                  <Button 
                    type="primary" 
                    onClick={handleSubscribe}
                    style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '8px', height: '40px', fontWeight: 600 }}
                  >
                    Join
                  </Button>
                </Flex>
              </Flex>
            </Col>
          </Row>

          <hr style={{ border: 'none', borderTop: '1px solid #1E293B', margin: '48px 0 24px 0' }} />

          <Flex justify="space-between" align="center" wrap="wrap" gap={16} style={{ fontSize: '13.5px', color: '#64748B' }}>
            <span>© {new Date().getFullYear()} Restaurant OS. All rights reserved.</span>
            <Flex gap={20}>
              <Link to="/privacy" className="footer-link-redesign">Privacy Policy</Link>
              <Link to="/terms" className="footer-link-redesign">Terms of Service</Link>
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

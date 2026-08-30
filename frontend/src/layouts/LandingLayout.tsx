import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Flex, Drawer } from 'antd';
import { MenuOutlined, GithubOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/auth.store.js';
import logo from '../assets/logo.png';
import logoIcon from '../assets/logo-icon.png';

const { Header, Content, Footer } = Layout;

export const LandingLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <style>{`
        .landing-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #F1F5F9;
          padding: 0 24px;
          height: 64px;
          line-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .landing-nav-link {
          color: #475569;
          font-weight: 500;
          font-size: 14px;
          transition: color 0.2s;
          padding: 0 16px;
          text-decoration: none;
        }
        .landing-nav-link:hover, .landing-nav-link.active {
          color: #F97316;
        }
        .footer-link {
          color: #64748B;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
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

        {/* Desktop Navigation links */}
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
              style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '8px', fontWeight: 600 }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button type="text" onClick={() => navigate('/login')} style={{ color: '#475569', fontWeight: 500 }}>
                Login
              </Button>
              <Button 
                type="primary" 
                onClick={() => navigate('/signup')}
                style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '8px', fontWeight: 600 }}
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
                style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '8px', fontWeight: 600 }}
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
                  style={{ borderRadius: '8px' }}
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
                  style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '8px', fontWeight: 600 }}
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

      {/* Footer */}
      <Footer style={{ background: '#0F172A', color: '#94A3B8', padding: '64px 24px 32px 24px', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Flex justify="space-between" wrap="wrap" gap={32} style={{ marginBottom: '48px' }}>
            {/* Branding Column */}
            <div style={{ minWidth: '240px' }}>
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
              <p style={{ marginTop: '16px', color: '#64748B', fontSize: '14px', maxWidth: '300px', lineHeight: '1.6' }}>
                Run your restaurant like a tech company. All the digital menu and QR order tools you need in one commission-free platform.
              </p>
            </div>

            {/* Links Columns */}
            <Flex gap={48} wrap="wrap">
              <Flex vertical gap={12} style={{ minWidth: '120px' }}>
                <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px' }}>Product</span>
                <Link to="/features" className="footer-link">Features</Link>
                <Link to="/pricing" className="footer-link">Pricing</Link>
                <Link to="/about" className="footer-link">About</Link>
              </Flex>

              <Flex vertical gap={12} style={{ minWidth: '120px' }}>
                <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px' }}>Legal</span>
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                <Link to="/terms" className="footer-link">Terms of Service</Link>
              </Flex>

              <Flex vertical gap={12} style={{ minWidth: '120px' }}>
                <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px' }}>Connect</span>
                <a href="https://github.com/puspendeerrr/ros" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <GithubOutlined style={{ marginRight: '6px' }} /> GitHub
                </a>
                <Link to="/contact" className="footer-link">
                  <GlobalOutlined style={{ marginRight: '6px' }} /> Contact Sales
                </Link>
              </Flex>
            </Flex>
          </Flex>

          <hr style={{ border: 'none', borderTop: '1px solid #1E293B', margin: '32px 0' }} />

          <Flex justify="space-between" align="center" wrap="wrap" gap={16} style={{ fontSize: '14px', color: '#64748B' }}>
            <span>© {new Date().getFullYear()} Restaurant OS. All rights reserved.</span>
            <Flex gap={24}>
              <Link to="/privacy" className="footer-link">Privacy</Link>
              <Link to="/terms" className="footer-link">Terms</Link>
            </Flex>
          </Flex>
        </div>
      </Footer>
    </Layout>
  );
};

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Flex, Typography, Card, Drawer, Grid } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  LogoutOutlined,
  QrcodeOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store.js';
import { authService } from '../services/auth.service.js';
import logo from '../assets/logo.png';
import logoIcon from '../assets/logo-icon.png';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const { restaurant, logout } = useAuthStore();

  // Responsiveness states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Breakpoints mapping
  const isMobile = screens.hasOwnProperty('md') ? !screens.md : false;
  const isTablet = screens.hasOwnProperty('md') && screens.hasOwnProperty('lg') ? (screens.md && !screens.lg) : false;

  // Auto-close drawer on location pathname change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: () => {
      logout();
      navigate('/login');
    }
  });

  const getSelectedKey = () => {
    if (location.pathname === '/menu') return 'menu';
    if (location.pathname === '/qr-menu') return 'qr-menu';
    if (location.pathname === '/restaurant') return 'restaurant';
    return 'dashboard';
  };

  const handleMenuClick = (info: { key: string }) => {
    if ((window as any).hasUnsavedChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) return;
      (window as any).hasUnsavedChanges = false;
    }

    if (info.key === 'menu') {
      navigate('/menu');
    } else if (info.key === 'qr-menu') {
      navigate('/qr-menu');
    } else if (info.key === 'restaurant') {
      navigate('/restaurant');
    } else {
      navigate('/');
    }
  };

  const renderSidebarContent = (isMobileView = false, collapsedState = false) => {
    const showFull = !collapsedState || isMobileView;

    return (
      <Flex vertical justify="space-between" style={{ height: '100%', padding: isMobileView ? '16px 0' : '24px 0 16px 0' }}>
        <div>
          {/* Header logo */}
          <div style={{ padding: '0 16px', height: '48px', overflow: 'hidden', textAlign: 'center', marginBottom: '24px' }}>
            {showFull ? (
              <img 
                src={logo} 
                alt="Restaurant OS" 
                style={{ height: '220px', marginTop: '-86px', marginBottom: '-86px', objectFit: 'contain', width: '100%' }} 
              />
            ) : (
              <img 
                src={logoIcon} 
                alt="ROS" 
                style={{ height: '28px', marginTop: '10px', objectFit: 'contain' }} 
              />
            )}
          </div>

          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[getSelectedKey()]}
            onClick={handleMenuClick}
            style={{ background: 'transparent', border: 'none' }}
            items={[
              {
                key: 'dashboard',
                icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
                label: showFull ? 'Dashboard' : null,
                style: { borderRadius: '6px', margin: '4px 12px', width: 'calc(100% - 24px)' }
              },
              {
                key: 'menu',
                icon: <ShopOutlined style={{ fontSize: '16px' }} />,
                label: showFull ? 'Menu' : null,
                style: { borderRadius: '6px', margin: '4px 12px', width: 'calc(100% - 24px)' }
              },
              {
                key: 'qr-menu',
                icon: <QrcodeOutlined style={{ fontSize: '16px' }} />,
                label: showFull ? 'QR Menu' : null,
                style: { borderRadius: '6px', margin: '4px 12px', width: 'calc(100% - 24px)' }
              },
              {
                key: 'restaurant',
                icon: <SettingOutlined style={{ fontSize: '16px' }} />,
                label: showFull ? 'Restaurant' : null,
                style: { borderRadius: '6px', margin: '4px 12px', width: 'calc(100% - 24px)' }
              }
            ]}
          />
        </div>

        {/* Footer info/actions */}
        <div style={{ padding: '0 12px', paddingBottom: isMobileView ? 'env(safe-area-inset-bottom)' : '0' }}>
          {showFull ? (
            <Card
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                marginBottom: '12px',
              }}
              bodyStyle={{ padding: '12px' }}
            >
              <Flex vertical gap={8}>
                <div>
                  <Flex align="center" justify="space-between" style={{ marginBottom: '4px' }}>
                    <Text strong style={{ color: '#F8FAFC', fontSize: '12px', display: 'block', maxWidth: '100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {restaurant?.restaurantName}
                    </Text>
                    <span style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ADE80',
                      fontSize: '8px',
                      padding: '1px 6px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      border: '1px solid rgba(74, 222, 128, 0.2)'
                    }}>
                      ACTIVE
                    </span>
                  </Flex>
                  <Text style={{ color: '#64748B', display: 'block', fontSize: '10px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {restaurant?.ownerName}
                  </Text>
                </div>
                <Flex align="center" justify="space-between" style={{ marginTop: '2px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <Text style={{ color: '#475569', fontSize: '9px' }}>Version</Text>
                  <Text style={{ color: '#94A3B8', fontSize: '9px', fontWeight: 600 }}>v0.3.0</Text>
                </Flex>
              </Flex>
            </Card>
          ) : null}

          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => {
              if ((window as any).hasUnsavedChanges) {
                const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
                if (!confirmLeave) return;
                (window as any).hasUnsavedChanges = false;
              }
              logoutMutation.mutate();
            }}
            loading={logoutMutation.isPending}
            block
            style={{
              color: '#94A3B8',
              textAlign: showFull ? 'left' : 'center',
              height: '42px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: showFull ? 'flex-start' : 'center',
              paddingLeft: showFull ? '16px' : '0px',
              background: 'transparent'
            }}
          >
            {showFull ? 'Sign Out' : null}
          </Button>
        </div>
      </Flex>
    );
  };

  // Determine sidebar configuration
  const sidebarWidth = isMobile ? 0 : (isTablet || isCollapsed ? 80 : 240);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      {/* 1. Mobile Top Header Bar */}
      {isMobile && (
        <Header
          style={{
            background: '#0F172A',
            padding: '0 16px',
            position: 'fixed',
            width: '100%',
            height: '56px',
            lineHeight: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 999,
            paddingTop: 'env(safe-area-inset-top)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: '#FFFFFF', fontSize: '18px' }} />}
            onClick={() => setIsDrawerOpen(true)}
            style={{ 
              width: '44px', 
              height: '44px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          />
          <img 
            src={logo} 
            alt="Restaurant OS" 
            style={{ height: '140px', marginTop: '-55px', marginBottom: '-55px', objectFit: 'contain', width: '120px' }} 
          />
          <div style={{ width: '44px' }} /> {/* Spacing placeholder */}
        </Header>
      )}

      {/* 2. Responsive Sider for Tablet / Desktop */}
      {!isMobile && (
        <Sider
          width={240}
          collapsedWidth={80}
          collapsible
          collapsed={isCollapsed || isTablet}
          onCollapse={(collapsed) => setIsCollapsed(collapsed)}
          theme="dark"
          style={{
            background: '#0F172A',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000
          }}
        >
          {renderSidebarContent(false, isCollapsed || isTablet)}
        </Sider>
      )}

      {/* 3. Mobile Navigation Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={240}
        styles={{
          body: {
            padding: 0,
            background: '#0F172A',
          }
        }}
      >
        {renderSidebarContent(true, false)}
      </Drawer>

      {/* 4. Main Content Layout Container */}
      <Layout 
        style={{ 
          background: '#F8FAFC', 
          marginLeft: `${sidebarWidth}px`, 
          minHeight: '100vh',
          transition: 'margin-left 0.2s ease',
          paddingTop: isMobile ? 'calc(56px + env(safe-area-inset-top))' : '0px'
        }}
      >
        <Content style={{ minHeight: '100%', overflowY: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

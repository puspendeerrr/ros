import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Flex, Typography, Card } from 'antd';
import { DashboardOutlined, ShopOutlined, LogoutOutlined, QrcodeOutlined, SettingOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store.js';
import { authService } from '../services/auth.service.js';
import logo from '../assets/logo.png';

const { Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurant, logout } = useAuthStore();

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
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
        <Flex vertical justify="space-between" style={{ height: '100%', padding: '32px 0 24px 0' }}>
          <div>
            {/* Header logo with generous breathing room */}
            <div style={{ padding: '0 24px', height: '48px', overflow: 'hidden', textAlign: 'center', marginBottom: '32px' }}>
              <img 
                src={logo} 
                alt="Restaurant OS" 
                style={{ height: '220px', marginTop: '-86px', marginBottom: '-86px', objectFit: 'contain', width: '100%' }} 
              />
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
                  label: 'Dashboard',
                  style: { borderRadius: '6px', margin: '4px 12px', width: 'calc(100% - 24px)' }
                },
                {
                  key: 'menu',
                  icon: <ShopOutlined style={{ fontSize: '16px' }} />,
                  label: 'Menu',
                  style: { borderRadius: '6px', margin: '4px 12px', width: 'calc(100% - 24px)' }
                },
                {
                  key: 'qr-menu',
                  icon: <QrcodeOutlined style={{ fontSize: '16px' }} />,
                  label: 'QR Menu',
                  style: { borderRadius: '6px', margin: '4px 12px', width: 'calc(100% - 24px)' }
                },
                {
                  key: 'restaurant',
                  icon: <SettingOutlined style={{ fontSize: '16px' }} />,
                  label: 'Restaurant',
                  style: { borderRadius: '6px', margin: '4px 12px', width: 'calc(100% - 24px)' }
                }
              ]}
            />
          </div>

          {/* Redesigned Footer Card */}
          <div style={{ padding: '0 16px' }}>
            <Card
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                marginBottom: '16px',
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <Flex vertical gap={12}>
                <div>
                  <Flex align="center" justify="space-between" style={{ marginBottom: '6px' }}>
                    <Text strong style={{ color: '#F8FAFC', fontSize: '13px', display: 'block', maxWidth: '110px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {restaurant?.restaurantName}
                    </Text>
                    <span style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: '#4ADE80',
                      fontSize: '9px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      border: '1px solid rgba(74, 222, 128, 0.2)'
                    }}>
                      ACTIVE
                    </span>
                  </Flex>
                  <Text style={{ color: '#64748B', display: 'block', fontSize: '11px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {restaurant?.ownerName}
                  </Text>
                </div>
                <Flex align="center" justify="space-between" style={{ marginTop: '4px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <Text style={{ color: '#475569', fontSize: '10px' }}>Version</Text>
                  <Text style={{ color: '#94A3B8', fontSize: '10px', fontWeight: 600 }}>v0.3.0</Text>
                </Flex>
              </Flex>
            </Card>

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
                textAlign: 'left',
                height: '42px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '16px',
                background: 'transparent'
              }}
            >
              Sign Out
            </Button>
          </div>
        </Flex>
      </Sider>

      {/* Main content Layout shifted to the right of fixed Sider */}
      <Layout style={{ background: '#F8FAFC', marginLeft: '240px', minHeight: '100vh' }}>
        <Content style={{ height: '100vh', overflowY: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

import React from 'react';
import { Card, Button, Typography, Layout, Flex, Descriptions, Space } from 'antd';
import { LogoutOutlined, ShopOutlined, UserOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store.js';
import { authService } from '../services/auth.service.js';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export const Dashboard: React.FC = () => {
  const { restaurant, logout } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
    },
    onError: () => {
      // Hard logout client side anyway
      logout();
    }
  });

  if (!restaurant) return null;

  return (
    <Layout style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Header style={{ 
        background: '#FFFFFF', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #F0F0F0',
        height: '64px'
      }}>
        <Flex align="center" gap={10}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: '#F97316',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'white',
            fontSize: '14px'
          }}>
            R
          </div>
          <Text strong style={{ fontSize: '16px', letterSpacing: '-0.3px' }}>Restaurant OS</Text>
        </Flex>

        <Button 
          icon={<LogoutOutlined />} 
          onClick={() => logoutMutation.mutate()} 
          loading={logoutMutation.isPending}
        >
          Sign Out
        </Button>
      </Header>

      <Content style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
              Welcome back, {restaurant.ownerName}
            </Title>
            <Text type="secondary">
              Managing operations for <strong>{restaurant.restaurantName}</strong>.
            </Text>
          </div>

          <Card style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Descriptions title="Restaurant Owner Profile" bordered column={1}>
              <Descriptions.Item label={<span><ShopOutlined /> Restaurant Name</span>}>
                {restaurant.restaurantName}
              </Descriptions.Item>
              <Descriptions.Item label={<span><UserOutlined /> Owner Name</span>}>
                {restaurant.ownerName}
              </Descriptions.Item>
              <Descriptions.Item label={<span><SafetyCertificateOutlined /> URL Slug</span>}>
                <code>{restaurant.slug}</code>
              </Descriptions.Item>
              <Descriptions.Item label={<span><MailOutlined /> Email Address</span>}>
                {restaurant.email}
              </Descriptions.Item>
              <Descriptions.Item label={<span><PhoneOutlined /> Phone Number</span>}>
                {restaurant.phone}
              </Descriptions.Item>
              <Descriptions.Item label="System Status">
                <Text type="success" strong>ACTIVE</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card style={{ 
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', 
            border: '1px solid #FED7AA',
            borderRadius: '12px'
          }}>
            <Title level={4} style={{ color: '#C2410C', marginTop: 0 }}>Authentication Scope Active</Title>
            <Paragraph style={{ color: '#7C2D12', margin: 0 }}>
              The Authentication module is fully active and validated. This constitutes the baseline foundation of the Restaurant OS platform. Future releases will plug in Menu Management, QR ordering, kitchen dispatch screens, and customer portal apps directly without altering the underlying tenant authentication schema.
            </Paragraph>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

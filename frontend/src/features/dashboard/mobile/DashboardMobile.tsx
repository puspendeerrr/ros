import React from 'react';
import { Card, Typography, Flex, Row, Col, Progress, Empty } from 'antd';
import {
  ShopOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface DashboardMobileProps {
  dashboardData: any;
}

export const DashboardMobile: React.FC<DashboardMobileProps> = ({ dashboardData }) => {
  const {
    restaurant,
    totalCategories,
    totalItems,
    availableItems,
    completionProgress,
    todayStr,
    navigate,
  } = dashboardData;

  if (!restaurant) return null;

  return (
    <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. Welcome Header Section */}
      <Card
        bodyStyle={{ padding: '16px' }}
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.01)',
        }}
      >
        <Flex vertical gap={8}>
          <Flex align="center" justify="space-between">
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>
              TODAY'S SUMMARY
            </Text>
            <span
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#16A34A',
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 600,
              }}
            >
              ACTIVE
            </span>
          </Flex>
          <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
            {restaurant.ownerName}
          </Title>
          <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
            Outlet: <strong>{restaurant.restaurantName}</strong>
          </Text>
          <Flex align="center" gap={6} style={{ marginTop: '4px', background: '#F8FAFC', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', alignSelf: 'flex-start' }}>
            <CalendarOutlined style={{ color: '#F97316', fontSize: '12px' }} />
            <Text style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>{todayStr}</Text>
          </Flex>
        </Flex>
      </Card>

      {/* 2. Today's Summary Metrics */}
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Card bodyStyle={{ padding: '12px' }} style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <Flex align="center" gap={8}>
              <div style={{ background: '#FFF7ED', padding: '8px', borderRadius: '8px' }}>
                <AppstoreOutlined style={{ color: '#F97316', fontSize: '16px' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>Categories</Text>
                <Text strong style={{ fontSize: '18px', color: '#0F172A' }}>{totalCategories}</Text>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col span={12}>
          <Card bodyStyle={{ padding: '12px' }} style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <Flex align="center" gap={8}>
              <div style={{ background: '#EFF6FF', padding: '8px', borderRadius: '8px' }}>
                <ShopOutlined style={{ color: '#3B82F6', fontSize: '16px' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>Total Items</Text>
                <Text strong style={{ fontSize: '18px', color: '#0F172A' }}>{totalItems}</Text>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col span={24}>
          <Card bodyStyle={{ padding: '12px' }} style={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={8}>
                <div style={{ background: '#ECFDF5', padding: '8px', borderRadius: '8px' }}>
                  <CheckCircleOutlined style={{ color: '#10B981', fontSize: '16px' }} />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>Available Options</Text>
                  <Text strong style={{ fontSize: '15px', color: '#0F172A' }}>{availableItems} / {totalItems} Active</Text>
                </div>
              </Flex>
              <Progress type="circle" percent={totalItems > 0 ? Math.round((availableItems / totalItems) * 100) : 0} width={36} strokeWidth={10} strokeColor="#10B981" />
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* 3. Quick Actions */}
      <Card title={<Text strong style={{ fontSize: '14px', color: '#0F172A' }}>Quick Actions</Text>} bodyStyle={{ padding: '12px' }} style={{ borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { title: 'Add Category', icon: <PlusOutlined />, color: '#F97316', bg: '#FFF7ED', path: '/menu' },
            { title: 'Add Item', icon: <ThunderboltOutlined />, color: '#3B82F6', bg: '#EFF6FF', path: '/menu' },
            { title: 'Preview Menu', icon: <EyeOutlined />, color: '#10B981', bg: '#ECFDF5', path: '/menu' },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #F1F5F9',
                borderRadius: '12px',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div style={{ background: action.bg, color: action.color, width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {action.icon}
              </div>
              <Text strong style={{ fontSize: '11px', color: '#1E293B', textAlign: 'center', display: 'block' }}>
                {action.title}
              </Text>
            </button>
          ))}
        </div>
      </Card>

      {/* 4. Menu Status Completion */}
      <Card title={<Text strong style={{ fontSize: '14px', color: '#0F172A' }}>Setup Status</Text>} bodyStyle={{ padding: '16px' }} style={{ borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <Flex align="center" gap={16}>
          <Progress type="circle" percent={completionProgress} width={60} strokeWidth={8} strokeColor="#F97316" />
          <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: '13px', display: 'block', color: '#0F172A', marginBottom: '2px' }}>
              Menu Completion: {completionProgress}%
            </Text>
            <Text type="secondary" style={{ fontSize: '11px', display: 'block', lineHeight: '1.3' }}>
              {completionProgress === 100
                ? 'Your menu is 100% ready!'
                : 'Follow checklist to complete your profile setups.'}
            </Text>
          </div>
        </Flex>
      </Card>

      {/* 5. Recent Activity */}
      <Card
        title={
          <Flex align="center" gap={6}>
            <HistoryOutlined style={{ color: '#64748B' }} />
            <Text strong style={{ fontSize: '14px', color: '#0F172A' }}>Recent Activity</Text>
          </Flex>
        }
        bodyStyle={{ padding: '24px 12px' }}
        style={{ borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '16px' }}
      >
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary" style={{ fontSize: '12px' }}>No updates recorded today.</Text>} />
      </Card>
    </div>
  );
};

import React from 'react';
import { Card, Typography, Flex, Statistic, Row, Col, Space, Progress, Button, Empty } from 'antd';
import {
  ShopOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  EyeOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store.js';
import { menuService } from '../services/menu.service.js';

const { Title, Text, Paragraph } = Typography;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { restaurant } = useAuthStore();

  // Queries (calculated from menu builder datasets)
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => menuService.getCategories(),
  });

  const { data: itemsData, isLoading: loadingItems } = useQuery({
    queryKey: ['items'],
    queryFn: () => menuService.getItems(),
  });

  if (!restaurant) return null;

  const categories = categoriesData?.data || [];
  const items = itemsData?.data || [];

  // Calculations
  const totalCategories = categories.length;
  const totalItems = items.length;
  const availableItems = items.filter((i) => i.isAvailable).length;
  const unavailableItems = items.filter((i) => !i.isAvailable).length;

  // Menu completion percentage calculation
  let completionProgress = 0;
  if (totalCategories > 0) completionProgress += 30;
  if (totalItems > 0) completionProgress += 40;
  if (totalItems >= 3) completionProgress += 30;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Space direction="vertical" size={32} style={{ width: '100%' }}>
        {/* Welcome Section */}
        <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.01)' }}>
          <Row justify="space-between" align="middle" gutter={[20, 20]}>
            <Col xs={24} md={16}>
              <Space direction="vertical" size={4}>
                <Flex align="center" gap={8} wrap="wrap">
                  <Title level={2} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.8px', color: '#0F172A' }}>
                    Welcome back, {restaurant.ownerName}
                  </Title>
                  <span style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#16A34A',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    border: '1px solid rgba(34, 197, 94, 0.15)'
                  }}>
                    ACTIVE STATUS
                  </span>
                </Flex>
                <Text type="secondary" style={{ fontSize: '15px' }}>
                  Managing operations for <strong>{restaurant.restaurantName}</strong>. Here is your overview for today.
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Space style={{ background: '#F8FAFC', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <CalendarOutlined style={{ color: '#F97316' }} />
                <Text style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{todayStr}</Text>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Quick Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(15,23,42,0.02)', border: '1px solid #F1F5F9' }}>
              <Statistic
                title={<Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>Categories</Text>}
                value={totalCategories}
                loading={loadingCategories}
                prefix={<AppstoreOutlined style={{ color: '#F97316', marginRight: '8px' }} />}
                valueStyle={{ fontWeight: 700, color: '#0F172A' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(15,23,42,0.02)', border: '1px solid #F1F5F9' }}>
              <Statistic
                title={<Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>Total Items</Text>}
                value={totalItems}
                loading={loadingItems}
                prefix={<ShopOutlined style={{ color: '#3B82F6', marginRight: '8px' }} />}
                valueStyle={{ fontWeight: 700, color: '#0F172A' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(15,23,42,0.02)', border: '1px solid #F1F5F9' }}>
              <Statistic
                title={<Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>Available Items</Text>}
                value={availableItems}
                loading={loadingItems}
                prefix={<CheckCircleOutlined style={{ color: '#10B981', marginRight: '8px' }} />}
                valueStyle={{ fontWeight: 700, color: '#10B981' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(15,23,42,0.02)', border: '1px solid #F1F5F9' }}>
              <Statistic
                title={<Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>Unavailable Items</Text>}
                value={unavailableItems}
                loading={loadingItems}
                prefix={<CloseCircleOutlined style={{ color: '#EF4444', marginRight: '8px' }} />}
                valueStyle={{ fontWeight: 700, color: '#EF4444' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Empty States CTA */}
        {totalCategories === 0 && (
          <AlertCard 
            title="Create your first category" 
            desc="You haven't created any categories yet. Create categories like 'Appetizers', 'Mains', or 'Drinks' to group your menu items."
            btnText="Create Category" 
            onClick={() => navigate('/menu')} 
          />
        )}
        {totalCategories > 0 && totalItems === 0 && (
          <AlertCard 
            title="Add your first menu item" 
            desc="Categories are set! Now add items with prices, descriptions, and images to complete your guest menu builder workspace."
            btnText="Add Item" 
            onClick={() => navigate('/menu')} 
          />
        )}

        {/* Main Dashboard Rows */}
        <Row gutter={[24, 24]}>
          {/* Quick Actions Panel */}
          <Col xs={24} lg={16}>
            <Card title={<Text strong style={{ fontSize: '16px', color: '#0F172A' }}>Quick Actions</Text>} bordered={false} style={{ boxShadow: '0 4px 12px rgba(15,23,42,0.02)', border: '1px solid #F1F5F9', height: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <ActionCard
                    title="Create Category"
                    desc="Organize food groups"
                    icon={<PlusOutlined style={{ fontSize: '24px', color: '#F97316' }} />}
                    onClick={() => navigate('/menu')}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <ActionCard
                    title="Add Item"
                    desc="Add food options to categories"
                    icon={<ThunderboltOutlined style={{ fontSize: '24px', color: '#3B82F6' }} />}
                    onClick={() => navigate('/menu')}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <ActionCard
                    title="Preview Menu"
                    desc="View guest layout"
                    icon={<EyeOutlined style={{ fontSize: '24px', color: '#10B981' }} />}
                    onClick={() => navigate('/menu')}
                  />
                </Col>
              </Row>

              {/* Recent Activity Card */}
              <div style={{ marginTop: '32px' }}>
                <Title level={5} style={{ color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HistoryOutlined /> Recent Activity
                </Title>
                <Card style={{ background: '#F8FAFC', border: '1px dashed #E2E8F0', borderRadius: '12px', textAlign: 'center', padding: '24px 0' }}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary" style={{ fontSize: '13px' }}>No recent activity yet.</Text>} />
                </Card>
              </div>
            </Card>
          </Col>

          {/* Menu Status Panel */}
          <Col xs={24} lg={8}>
            <Card title={<Text strong style={{ fontSize: '16px', color: '#0F172A' }}>Menu Status</Text>} bordered={false} style={{ boxShadow: '0 4px 12px rgba(15,23,42,0.02)', border: '1px solid #F1F5F9', height: '100%' }}>
              <Flex vertical align="center" justify="center" style={{ padding: '24px 0', textAlign: 'center' }}>
                <Progress
                  type="circle"
                  percent={completionProgress}
                  strokeColor={{
                    '0%': '#FB923C',
                    '100%': '#F97316',
                  }}
                  width={140}
                  strokeWidth={8}
                />
                <div style={{ marginTop: '24px' }}>
                  <Title level={5} style={{ margin: '0 0 4px 0', color: '#0F172A' }}>Menu Completion</Title>
                  <Paragraph type="secondary" style={{ fontSize: '13px', margin: 0 }}>
                    {completionProgress === 0 && 'Get started by creating a category.'}
                    {completionProgress === 30 && 'Nice! Add items to populate the categories.'}
                    {completionProgress === 70 && 'Awesome. Add 3 or more items to complete.'}
                    {completionProgress === 100 && 'Your digital menu is 100% complete and ready!'}
                  </Paragraph>
                </div>

                {/* Progress Tasks checklist */}
                <Flex vertical gap={12} style={{ width: '100%', marginTop: '32px', textAlign: 'left', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <TaskCheck label="Create a category" checked={totalCategories > 0} />
                  <TaskCheck label="Add at least one item" checked={totalItems > 0} />
                  <TaskCheck label="Add 3 or more menu items" checked={totalItems >= 3} />
                </Flex>
              </Flex>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

// Sub-components
interface ActionCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, desc, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '24px 16px',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        background: '#FFFFFF',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="action-card-hover"
    >
      <div style={{ marginBottom: '16px' }}>{icon}</div>
      <Text strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>{title}</Text>
      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>{desc}</Text>
    </div>
  );
};

interface AlertCardProps {
  title: string;
  desc: string;
  btnText: string;
  onClick: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ title, desc, btnText, onClick }) => {
  return (
    <Card style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '16px' }}>
      <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
        <Space direction="vertical" size={2}>
          <Text strong style={{ color: '#C2410C', fontSize: '15px' }}>{title}</Text>
          <Text style={{ color: '#7C2D12', fontSize: '13px' }}>{desc}</Text>
        </Space>
        <Button type="primary" onClick={onClick} icon={<ArrowRightOutlined />}>
          {btnText}
        </Button>
      </Flex>
    </Card>
  );
};

interface TaskCheckProps {
  label: string;
  checked: boolean;
}

const TaskCheck: React.FC<TaskCheckProps> = ({ label, checked }) => {
  return (
    <Flex align="center" justify="space-between" style={{ width: '100%' }}>
      <Text style={{ fontSize: '13px', color: checked ? '#64748B' : '#0F172A', textDecoration: checked ? 'line-through' : 'none' }}>
        {label}
      </Text>
      <span style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: checked ? '#10B981' : '#E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontSize: '10px',
        fontWeight: 'bold',
      }}>
        {checked ? '✓' : ''}
      </span>
    </Flex>
  );
};

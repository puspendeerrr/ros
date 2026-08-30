import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Typography, Card, Flex } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '80px 24px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title level={1} style={{ fontSize: '42px', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>
            Simple, commission-free pricing
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0 auto', lineHeight: '1.6' }}>
            Keep 100% of what you earn. We charge zero commissions.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={12}>
            <Card 
              bordered={false} 
              style={{ 
                borderRadius: '24px', 
                border: '2px solid #F97316', 
                padding: '24px', 
                background: '#FFFFFF',
                boxShadow: '0 10px 30px rgba(249, 115, 22, 0.04)'
              }}
            >
              <div style={{ display: 'inline-block', background: '#FFEDD5', padding: '4px 12px', borderRadius: '20px', color: '#C2410C', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Starter Tier
              </div>
              <Title level={2} style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>Starter Plan</Title>
              <Paragraph style={{ color: '#64748B', marginTop: '8px' }}>Essential digital menu toolkit for your restaurant.</Paragraph>
              <div style={{ margin: '28px 0' }}>
                <span style={{ fontSize: '48px', fontWeight: 900, color: '#0F172A' }}>$0</span>
                <span style={{ color: '#64748B', fontSize: '14px' }}> / forever free</span>
              </div>
              <Button 
                type="primary" 
                size="large" 
                block 
                onClick={() => navigate('/signup')}
                style={{ background: '#F97316', borderColor: '#F97316', height: '48px', borderRadius: '8px', fontWeight: 600 }}
              >
                Get Started
              </Button>
              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />
              <Flex vertical gap={12}>
                <Flex align="center" gap={8}>
                  <CheckOutlined style={{ color: '#22C55E' }} />
                  <Text style={{ fontSize: '14px', color: '#475569' }}>Unlimited categories & items</Text>
                </Flex>
                <Flex align="center" gap={8}>
                  <CheckOutlined style={{ color: '#22C55E' }} />
                  <Text style={{ fontSize: '14px', color: '#475569' }}>High-res QR code generation</Text>
                </Flex>
                <Flex align="center" gap={8}>
                  <CheckOutlined style={{ color: '#22C55E' }} />
                  <Text style={{ fontSize: '14px', color: '#475569' }}>Real-time updates & sync</Text>
                </Flex>
                <Flex align="center" gap={8}>
                  <CheckOutlined style={{ color: '#22C55E' }} />
                  <Text style={{ fontSize: '14px', color: '#475569' }}>Restaurant Profile & Map URL</Text>
                </Flex>
              </Flex>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card 
              bordered={false} 
              style={{ 
                borderRadius: '24px', 
                border: '1px solid #E2E8F0', 
                padding: '24px', 
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'inline-block', background: '#E2E8F0', padding: '4px 12px', borderRadius: '20px', color: '#475569', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Advanced Features
              </div>
              <Title level={2} style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>Pro Plan</Title>
              <Paragraph style={{ color: '#64748B', marginTop: '8px' }}>Designed for scalable operations and delivery order systems.</Paragraph>
              <div style={{ margin: '28px 0' }}>
                <span style={{ fontSize: '48px', fontWeight: 900, color: '#0F172A' }}>$19</span>
                <span style={{ color: '#64748B', fontSize: '14px' }}> / month</span>
              </div>
              <Button 
                type="default" 
                size="large" 
                block 
                disabled
                style={{ height: '48px', borderRadius: '8px', fontWeight: 600 }}
              >
                Coming Soon
              </Button>
              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />
              <Flex vertical gap={12}>
                <Flex align="center" gap={8}>
                  <CheckOutlined style={{ color: '#22C55E' }} />
                  <Text style={{ fontSize: '14px', color: '#475569' }}>Everything in Starter</Text>
                </Flex>
                <Flex align="center" gap={8}>
                  <CheckOutlined style={{ color: '#22C55E' }} />
                  <Text style={{ fontSize: '14px', color: '#475569' }}>Custom domain mapping</Text>
                </Flex>
                <Flex align="center" gap={8}>
                  <CheckOutlined style={{ color: '#22C55E' }} />
                  <Text style={{ fontSize: '14px', color: '#475569' }}>Order management & cart options</Text>
                </Flex>
                <Flex align="center" gap={8}>
                  <CheckOutlined style={{ color: '#22C55E' }} />
                  <Text style={{ fontSize: '14px', color: '#475569' }}>POS & printer integrations</Text>
                </Flex>
              </Flex>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Typography, Card } from 'antd';
import { 
  QrcodeOutlined, 
  BuildOutlined, 
  ShopOutlined, 
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const details = [
    {
      icon: <QrcodeOutlined style={{ fontSize: '32px', color: '#F97316' }} />,
      title: 'QR Code Ecosystem',
      description: 'Generate dynamic QR codes for each table. Link them directly to your public menu. Guests scan, view, and order instantly. High-resolution downloads available in SVG and PNG formats for professional printing.',
    },
    {
      icon: <BuildOutlined style={{ fontSize: '32px', color: '#F97316' }} />,
      title: 'Real-time Menu Management',
      description: 'Add, edit, or toggle items in seconds. Mark dishes as sold out, configure pricing, upload food photography, and write allergen alerts. Updates display to customers instantly.',
    },
    {
      icon: <ShopOutlined style={{ fontSize: '32px', color: '#F97316' }} />,
      title: 'Complete Brand Profiles',
      description: 'Your restaurant, your rules. Add custom banners, upload your logo, define opening and closing times, map coordinates, and phone contacts. Clean layouts keep focus on your food.',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '32px', color: '#F97316' }} />,
      title: 'Lightning-Fast Public Menu Hosting',
      description: 'Host your menu on our premium domain. Optimizations deliver image-heavy menus to customers in milliseconds even under low mobile connectivity.',
    },
  ];

  return (
    <div style={{ padding: '80px 24px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title level={1} style={{ fontSize: '42px', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px' }}>
            Features built for modern restaurants
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0 auto', lineHeight: '1.6' }}>
            Empower your team and delight your guests with the ultimate digital menu toolkit.
          </Paragraph>
        </div>

        <Row gutter={[40, 40]}>
          {details.map((item, idx) => (
            <Col xs={24} md={12} key={idx}>
              <Card 
                bordered={false} 
                style={{ 
                  borderRadius: '20px', 
                  border: '1px solid #E2E8F0', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.01)', 
                  background: '#FFFFFF',
                  padding: '20px'
                }}
              >
                <div style={{ marginBottom: '20px' }}>{item.icon}</div>
                <Title level={3} style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
                  {item.title}
                </Title>
                <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                  {item.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Call to Action */}
        <div style={{ 
          marginTop: '80px', 
          background: 'linear-gradient(135deg, #FFEDD5 0%, #FFF7ED 100%)', 
          padding: '48px', 
          borderRadius: '24px', 
          border: '1px solid #FFD8A8',
          textAlign: 'center'
        }}>
          <Title level={2} style={{ margin: '0 0 12px 0', color: '#7C2D12', fontWeight: 800 }}>
            Ready to experience Restaurant OS features?
          </Title>
          <Paragraph style={{ color: '#9A3412', fontSize: '15px', marginBottom: '24px' }}>
            Set up your restaurant card and build your first menu in minutes.
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/signup')}
            style={{ background: '#F97316', borderColor: '#F97316', height: '48px', padding: '0 28px', borderRadius: '8px', fontWeight: 600 }}
          >
            Start Free
          </Button>
        </div>
      </div>
    </div>
  );
};

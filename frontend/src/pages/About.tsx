import React from 'react';
import { Typography, Row, Col, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

export const About: React.FC = () => {
  return (
    <div style={{ padding: '80px 24px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Title level={1} style={{ fontSize: '42px', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px', textAlign: 'center', marginBottom: '48px' }}>
          About Restaurant OS
        </Title>
        
        <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '24px' }}>
          Restaurant OS was founded with a simple, disruptive mission: <strong>to help restaurants thrive in the digital age without paying premium fees or commissions to middlemen platforms.</strong>
        </Paragraph>
        
        <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', marginBottom: '24px' }}>
          For too long, restaurant owners have faced high software costs, complex setups, and massive commissions just to put their menu online. We believe that digital presence is a basic foundation, not a luxury. That is why we built a clean, powerful, and forever free platform to generate QR codes, build dynamic menus, and manage your restaurant profile.
        </Paragraph>

        <Title level={2} style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginTop: '48px', marginBottom: '16px' }}>
          Our Core Principles
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card bordered={false} style={{ background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%' }}>
              <Title level={4} style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700 }}>0% Commission. Always.</Title>
              <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                We do not stand between you and your customers. Keep 100% of your menu revenue.
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered={false} style={{ background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%' }}>
              <Title level={4} style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700 }}>Slick & Simple UX</Title>
              <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                Digitize your tables, categories, and items in under 5 minutes without needing an IT team.
              </Text>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const Privacy: React.FC = () => {
  return (
    <div style={{ padding: '80px 24px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Title level={1} style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.8px', marginBottom: '32px' }}>
          Privacy Policy
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8' }}>
          Last updated: August 30, 2026
        </Paragraph>
        <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
          At Restaurant OS, we value and respect your privacy. This policy describes how we collect, use, store, and secure information from restaurant owners and visitors to public menu pages.
        </Paragraph>
        <Title level={2} style={{ fontSize: '20px', fontWeight: 700, marginTop: '24px', marginBottom: '12px' }}>
          1. Information We Collect
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
          We collect basic registration information (restaurant name, owner name, email address, phone number, and password hash) when you register. We also store restaurant profile variables like category names, menu items, cover images, business hours, and mapping details to render your public menu.
        </Paragraph>
        <Title level={2} style={{ fontSize: '20px', fontWeight: 700, marginTop: '24px', marginBottom: '12px' }}>
          2. How We Use Information
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
          We use your data only to maintain your session, secure access, and render the restaurant profile and public menu web pages to your customers. We never sell your data or utilize it for targeted advertising.
        </Paragraph>
      </div>
    </div>
  );
};

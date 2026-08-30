import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const Terms: React.FC = () => {
  return (
    <div style={{ padding: '80px 24px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Title level={1} style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.8px', marginBottom: '32px' }}>
          Terms of Service
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8' }}>
          Last updated: August 30, 2026
        </Paragraph>
        <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
          Welcome to Restaurant OS. By using our platform, creating an account, or accessing our services, you agree to comply with and be bound by the following terms.
        </Paragraph>
        <Title level={2} style={{ fontSize: '20px', fontWeight: 700, marginTop: '24px', marginBottom: '12px' }}>
          1. Use of Service
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
          You must provide accurate information when registering. You are responsible for keeping your login credentials confidential and for all activities that occur under your account. You agree not to upload offensive, illegal, or infringing content in your menu builders or restaurant profiles.
        </Paragraph>
        <Title level={2} style={{ fontSize: '20px', fontWeight: 700, marginTop: '24px', marginBottom: '12px' }}>
          2. Lifetime Free Starter Tier
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8' }}>
          Our Starter plan is provided for free with no hidden commission fees. We reserve the right to limit, modify, or update features within this tier to maintain system stability and resource availability.
        </Paragraph>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export interface CtaPlaceholderProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonLink?: string;
}

export const CtaPlaceholder: React.FC<CtaPlaceholderProps> = ({
  title = 'Ready to launch your restaurant’s digital operating system?',
  description = 'Set up your dynamic QR code menu in minutes with zero platform commission.',
  buttonLabel = 'Get Started Free',
  buttonLink = '/signup'
}) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      borderRadius: '12px',
      padding: '36px 32px',
      margin: '36px 0',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)'
    }}>
      <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
        {title}
      </h3>
      <p style={{ fontSize: '15px', color: '#94A3B8', maxWidth: '600px', margin: '0 0 24px 0', lineHeight: '1.6' }}>
        {description}
      </p>
      <Link to={buttonLink}>
        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          style={{
            background: '#F97316',
            borderColor: '#F97316',
            borderRadius: '8px',
            fontWeight: 700,
            height: '44px',
            padding: '0 24px'
          }}
        >
          {buttonLabel}
        </Button>
      </Link>
    </div>
  );
};

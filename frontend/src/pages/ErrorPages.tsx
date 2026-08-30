import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Flex } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

interface ErrorLayoutProps {
  code: string;
  title: string;
  description: string;
}

const ErrorLayout: React.FC<ErrorLayoutProps> = ({ code, title, description }) => {
  const navigate = useNavigate();

  return (
    <Flex 
      vertical 
      align="center" 
      justify="center" 
      style={{ 
        minHeight: '100vh', 
        background: '#0F172A', 
        color: '#FFFFFF',
        padding: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glow effects */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(60px)',
        top: '20%',
        left: '20%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(60px)',
        bottom: '20%',
        right: '20%',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ zIndex: 10, maxWidth: '480px' }}
      >
        <span style={{ fontSize: '96px', fontWeight: 900, color: '#F97316', letterSpacing: '-2px', lineHeight: 1 }}>
          {code}
        </span>
        <Title level={2} style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 800, margin: '24px 0 12px 0' }}>
          {title}
        </Title>
        <Paragraph style={{ color: '#94A3B8', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
          {description}
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => navigate('/')}
          style={{ 
            background: '#F97316', 
            borderColor: '#F97316', 
            height: '48px', 
            borderRadius: '10px', 
            fontWeight: 600,
            padding: '0 28px'
          }}
        >
          Return to Homepage
        </Button>
      </motion.div>
    </Flex>
  );
};

export const NotFound: React.FC = () => {
  return (
    <ErrorLayout 
      code="404" 
      title="Page Not Found" 
      description="The page you are looking for does not exist or has been moved to a different URL."
    />
  );
};

export const Forbidden: React.FC = () => {
  return (
    <ErrorLayout 
      code="403" 
      title="Access Forbidden" 
      description="You do not have permission to access this resource. Please verify your credentials."
    />
  );
};

export const ServerError: React.FC = () => {
  return (
    <ErrorLayout 
      code="500" 
      title="Internal Server Error" 
      description="Something went wrong on our servers. Our engineering team has been notified."
    />
  );
};

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Row, Col, Flex, Typography, Grid } from 'antd';
import { SafetyCertificateOutlined, ThunderboltOutlined, LineChartOutlined } from '@ant-design/icons';

import logo from '../assets/logo.png';

const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const AuthLayout: React.FC = () => {
  const screens = useBreakpoint();
  const isMd = screens.md;

  return (
    <Layout style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <Content style={{ display: 'flex', flexDirection: 'column' }}>
        <Row style={{ flex: 1, minHeight: '100vh' }}>
          {/* Left panel - Branding & Features */}
          {isMd && (
            <Col xs={0} md={10} lg={11} xl={10} style={{ 
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              padding: '64px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // Vertically center the complete hero section
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background graphic glow */}
              <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-20%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
              }} />

              {/* Hero block wrapper */}
              <div style={{ zIndex: 1, maxWidth: '460px', width: '100%' }}>
                {/* Logo directly above the main heading */}
                <div style={{ width: '260px', height: '60px', overflow: 'hidden', marginBottom: '32px' }}>
                  <img 
                    src={logo} 
                    alt="Restaurant OS" 
                    style={{ width: '260px', height: '260px', marginTop: '-100px', objectFit: 'contain' }} 
                  />
                </div>

                {/* Tagline & Core value */}
                <Title level={1} style={{ 
                  color: '#FFFFFF', 
                  fontSize: '36px', 
                  lineHeight: '1.2',
                  fontWeight: 800,
                  marginBottom: '16px',
                  letterSpacing: '-1.0px'
                }}>
                  Run your restaurant like a tech company.
                </Title>
                <Text style={{ color: '#94A3B8', fontSize: '15px', display: 'block', marginBottom: '40px', lineHeight: '1.6' }}>
                  The unified operating system for modern food service operations. Register your owner account to manage menu modules, table ordering, kitchen dispatching, and live operations.
                </Text>

                {/* Micro Features list */}
                <Flex vertical gap={24}>
                  <Flex gap={16} align="start">
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.1)', color: '#F97316', display: 'flex' }}>
                      <ThunderboltOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                      <Title level={5} style={{ color: '#F8FAFC', margin: '0 0 2px 0', fontSize: '15px' }}>Instant Synced Ordering</Title>
                      <Text style={{ color: '#64748B', fontSize: '13px' }}>Deliver guest orders directly to kitchen screens in under 1 second.</Text>
                    </div>
                  </Flex>

                  <Flex gap={16} align="start">
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.1)', color: '#F97316', display: 'flex' }}>
                      <SafetyCertificateOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                      <Title level={5} style={{ color: '#F8FAFC', margin: '0 0 2px 0', fontSize: '15px' }}>Secure Owner Isolation</Title>
                      <Text style={{ color: '#64748B', fontSize: '13px' }}>Enterprise cryptography keeps your menu data and transaction details isolated.</Text>
                    </div>
                  </Flex>

                  <Flex gap={16} align="start">
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.1)', color: '#F97316', display: 'flex' }}>
                      <LineChartOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                      <Title level={5} style={{ color: '#F8FAFC', margin: '0 0 2px 0', fontSize: '15px' }}>Unified Analytics Dashboard</Title>
                      <Text style={{ color: '#64748B', fontSize: '13px' }}>Monitor service speeds, recipe margins, and table turns live.</Text>
                    </div>
                  </Flex>
                </Flex>
              </div>

              {/* Absolute footer text at the bottom */}
              <Text style={{ color: '#475569', fontSize: '12px', position: 'absolute', bottom: '40px', left: '64px' }}>
                © {new Date().getFullYear()} Restaurant OS. All rights reserved.
              </Text>
            </Col>
          )}

          {/* Right panel - Auth Forms */}
          <Col xs={24} md={14} lg={13} xl={14} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FAFAFA',
            padding: '40px 24px'
          }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
              {/* Mobile Logo Header */}
              {!isMd && (
                <Flex align="center" justify="center" style={{ height: '40px', overflow: 'hidden', marginBottom: '32px' }}>
                  <img src={logo} alt="Restaurant OS" style={{ height: '200px', marginTop: '-80px', marginBottom: '-80px', objectFit: 'contain' }} />
                </Flex>
              )}
              <Outlet />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

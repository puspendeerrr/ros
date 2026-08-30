import React, { useState } from 'react';
import { Typography, Form, Input, Button, message, Alert, Row, Col, Tag } from 'antd';
import { motion } from 'framer-motion';
import { 
  MailOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { SEOManager } from '../components/SEOManager.js';

const { Title, Paragraph } = Typography;

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleFinish = () => {
    message.success('Thank you! Your message has been sent successfully.');
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '100px 24px', background: '#FFFFFF', overflow: 'hidden' }}>
      <SEOManager 
        title="Contact Sales & Support" 
        description="Have questions about setting up your restaurant digital menus, custom domain integrations, or scaling limits? Contact our onboarding team." 
      />

      <style>{`
        .contact-glow {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(249,115,22,0.05) 0%, rgba(255,255,255,0) 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .contact-card-redesign {
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 4px 30px rgba(15,23,42,0.01);
          height: 100%;
        }
        .info-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .info-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F97316;
          font-size: 18px;
          flex-shrink: 0;
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <div className="contact-glow" />

        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'inline-block', background: '#FFF7ED', padding: '6px 14px', borderRadius: '30px', color: '#EA580C', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', marginBottom: '16px', border: '1px solid #FFEDD5' }}>
            CONNECT WITH US
          </div>
          <Title level={1} style={{ fontSize: '46px', fontWeight: 900, color: '#0F172A', letterSpacing: '-2px', marginBottom: '16px' }}>
            We are here to support your floor
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
            Have questions about custom setups, POS printing integrations, or scaling limits? Let us help.
          </Paragraph>
        </div>

        {/* Form + Info Grid */}
        <Row gutter={[48, 48]} align="stretch">
          {/* Contact Form */}
          <Col xs={24} md={13}>
            <div className="contact-card-redesign">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Alert 
                    message={<strong style={{ fontSize: '16px' }}>Inquiry Received Successfully!</strong>}
                    description="Our restaurant onboarding specialists are reviewing your catalog details and will email you back within 12 hours." 
                    type="success" 
                    showIcon 
                    style={{ borderRadius: '16px', padding: '20px' }}
                  />
                </motion.div>
              ) : (
                <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="name" label={<span style={{ fontWeight: 650, color: '#475569' }}>Full Name</span>} rules={[{ required: true, message: 'Please enter your name' }]}>
                        <Input placeholder="John Doe" size="large" style={{ borderRadius: '10px', height: '44px' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="email" label={<span style={{ fontWeight: 650, color: '#475569' }}>Work Email</span>} rules={[{ required: true, type: 'email', message: 'Please enter your email' }]}>
                        <Input placeholder="john@restaurant.com" size="large" style={{ borderRadius: '10px', height: '44px' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="brand" label={<span style={{ fontWeight: 650, color: '#475569' }}>Restaurant / Brand Name</span>} rules={[{ required: true, message: 'Please enter your brand name' }]}>
                    <Input placeholder="The Pizza Bistro" size="large" style={{ borderRadius: '10px', height: '44px' }} />
                  </Form.Item>
                  <Form.Item name="message" label={<span style={{ fontWeight: 650, color: '#475569' }}>How can our team help?</span>} rules={[{ required: true, message: 'Please enter details' }]}>
                    <Input.TextArea placeholder="Outline your restaurant catalog size, required integrations..." rows={4} style={{ borderRadius: '12px' }} />
                  </Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    block 
                    style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', height: '50px', fontWeight: 700, fontSize: '15px', marginTop: '16px' }}
                  >
                    Submit Ticket Inquiries
                  </Button>
                </Form>
              )}
            </div>
          </Col>

          {/* Help Desk Metadata Card */}
          <Col xs={24} md={11}>
            <div className="contact-card-redesign" style={{ background: '#F8FAFC' }}>
              <Title level={3} style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Support desk coordinates</Title>
              <Paragraph style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>We prioritize menu launches and table configurations globally.</Paragraph>

              <div className="info-row">
                <div className="info-icon-wrap"><MailOutlined /></div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 700 }}>EMAIL CHANNELS</span>
                  <a href="mailto:support@ros.algorithyum.in" style={{ color: '#0F172A', fontWeight: 700 }}>support@ros.algorithyum.in</a>
                  <span style={{ display: 'block', fontSize: '13px', color: '#64748B', marginTop: '2px' }}>sales@ros.algorithyum.in</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-wrap"><ClockCircleOutlined /></div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 700 }}>RESPONSE TIMES & OPERATING HOURS</span>
                  <span style={{ color: '#0F172A', fontWeight: 700, display: 'block' }}>Average reply under 12 Hours</span>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>Mon - Sun, 9:00 AM - 10:00 PM IST</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-wrap"><EnvironmentOutlined /></div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 700 }}>OFFICE LOCATION</span>
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>Delhi NCR, India — Fully Remote Support</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-icon-wrap"><CustomerServiceOutlined /></div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 700 }}>SUPPORT TAGS ACCEPTS</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    <Tag color="orange">Sales Desk</Tag>
                    <Tag color="blue">Bug Reports</Tag>
                    <Tag color="green">Feature Request</Tag>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

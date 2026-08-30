import React, { useState } from 'react';
import { Typography, Card, Form, Input, Button, message, Alert } from 'antd';

const { Title, Paragraph } = Typography;

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleFinish = () => {
    message.success('Thank you! Your message has been sent successfully.');
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '80px 24px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card bordered={false} style={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.8px', margin: '0 0 8px 0' }}>
              Contact Our Sales Team
            </Title>
            <Paragraph style={{ color: '#64748B', fontSize: '15px' }}>
              Have questions about features, POS integrations or scaling? Get in touch.
            </Paragraph>
          </div>

          {submitted ? (
            <Alert 
              message="Message Received!" 
              description="Our onboarding specialists will contact you at your email address within 24 hours." 
              type="success" 
              showIcon 
            />
          ) : (
            <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
              <Form.Item name="name" label="Your Name" rules={[{ required: true, message: 'Please enter your name' }]}>
                <Input placeholder="John Doe" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
              <Form.Item name="email" label="Work Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                <Input placeholder="john@restaurant.com" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
              <Form.Item name="restaurantName" label="Restaurant / Brand Name" rules={[{ required: true, message: 'Please enter your brand name' }]}>
                <Input placeholder="The Pizza Kitchen" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
              <Form.Item name="message" label="How can we help?" rules={[{ required: true, message: 'Please enter your message' }]}>
                <Input.TextArea placeholder="Tell us about your restaurant details..." rows={4} style={{ borderRadius: '8px' }} />
              </Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '8px', height: '48px', fontWeight: 600, marginTop: '12px' }}
              >
                Send Message
              </Button>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
};

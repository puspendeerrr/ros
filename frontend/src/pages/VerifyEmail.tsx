import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Result, Button, Spin, Flex } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service.js';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const { isLoading, isSuccess, error } = useQuery({
    queryKey: ['verifyEmail', token],
    queryFn: () => authService.verifyEmail(token),
    enabled: !!token,
    retry: false,
  });

  if (!token) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
        <Result
          status="warning"
          title="Verification Token Missing"
          subTitle="The email verification link appears to be invalid or incomplete."
          extra={[
            <Link to="/signup" key="signup">
              <Button type="primary">Create Account</Button>
            </Link>,
          ]}
        />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '40px 12px' }}>
        <Flex vertical align="center" justify="center" gap={20}>
          <Spin size="large" />
          <div style={{ fontSize: '15px', fontWeight: 500, color: '#475569' }}>
            Verifying your restaurant profile...
          </div>
        </Flex>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
        <Result
          status="success"
          title="Email Verified Successfully!"
          subTitle="Your Restaurant OS owner profile is now active. You can proceed to sign in."
          extra={[
            <Link to="/login" key="login">
              <Button type="primary" size="large">
                Sign In to Platform
              </Button>
            </Link>,
          ]}
        />
      </Card>
    );
  }

  return (
    <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
      <Result
        status="error"
        title="Verification Failed"
        subTitle={(error as any)?.response?.data?.message || 'The verification link is invalid or has expired.'}
        extra={[
          <Link to="/signup" key="signup">
            <Button type="primary">Register Again</Button>
          </Link>,
          <Link to="/login" key="login" style={{ marginLeft: '8px' }}>
            <Button>Back to Login</Button>
          </Link>,
        ]}
      />
    </Card>
  );
};

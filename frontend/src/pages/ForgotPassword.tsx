import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Alert, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service.js';

const { Title, Text } = Typography;

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: ForgotFormValues) => authService.forgotPassword(data.email),
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setIsSuccess(true);
    },
  });

  const onSubmit = (data: ForgotFormValues) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
        <Result
          status="info"
          title="Reset Link Sent"
          subTitle={`If ${submittedEmail} is associated with a Restaurant OS account, we have sent instructions to reset your password.`}
          extra={[
            <Link to="/login" key="login">
              <Button type="primary" size="large">
                Back to Sign In
              </Button>
            </Link>,
          ]}
        />
      </Card>
    );
  }

  return (
    <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
      <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748B', marginBottom: '24px', fontWeight: 500 }}>
        <ArrowLeftOutlined /> Back to login
      </Link>

      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: '0 0 8px 0', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Forgot your password?
        </Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Enter the email address associated with your account, and we will send you a link to reset your password.
        </Text>
      </div>

      {mutation.isError && (
        <Alert
          message={(mutation.error as any).response?.data?.message || 'Something went wrong. Please try again.'}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
        <Form.Item
          label="Email Address"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined style={{ color: '#BFBFBF' }} />}
                placeholder="owner@restaurant.com"
                disabled={mutation.isPending}
              />
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '0px' }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={mutation.isPending}
            disabled={!isValid}
            size="large"
            style={{ height: '44px' }}
          >
            Send Reset Instructions
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

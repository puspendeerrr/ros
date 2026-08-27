import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Alert, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service.js';

const { Title, Text } = Typography;

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResetFormValues) =>
      authService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  const onSubmit = (data: ResetFormValues) => {
    if (!token) return;
    mutation.mutate(data);
  };

  if (!token) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
        <Alert
          message="Invalid Link"
          description="The password reset token is missing from the link URL. Please request a new link."
          type="error"
          showIcon
          action={
            <Link to="/forgot-password">
              <Button size="small" danger>
                Forgot Password
              </Button>
            </Link>
          }
        />
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
        <Result
          status="success"
          title="Password Reset Successful"
          subTitle="Your password has been successfully updated. You can now sign in with your new credentials."
          extra={[
            <Link to="/login" key="login">
              <Button type="primary" size="large">
                Go to Sign In
              </Button>
            </Link>,
          ]}
        />
      </Card>
    );
  }

  return (
    <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: '0 0 8px 0', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Reset your password
        </Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Enter a strong, secure new password for your account.
        </Text>
      </div>

      {mutation.isError && (
        <Alert
          message={(mutation.error as any).response?.data?.message || 'Failed to reset password. Link may be expired.'}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
        <Form.Item
          label="New Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined style={{ color: '#BFBFBF' }} />}
                placeholder="Minimum 8 characters"
                disabled={mutation.isPending}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined style={{ color: '#BFBFBF' }} />}
                placeholder="Confirm password"
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
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

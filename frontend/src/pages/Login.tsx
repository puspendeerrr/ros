import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Checkbox, Typography, Alert, Flex } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service.js';
import { useAuthStore } from '../store/auth.store.js';

const { Title, Text } = Typography;

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormValues) =>
      authService.login({ email: data.email, password: data.password }),
    onSuccess: (response) => {
      const { restaurant, accessToken } = response.data;
      setAuth(restaurant, accessToken);
      navigate('/dashboard');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ margin: '0 0 8px 0', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Welcome back
        </Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Enter your credentials to access your Restaurant OS account.
        </Text>
      </div>

      {mutation.isError && (
        <Alert
          message={(mutation.error as any).response?.data?.message || 'Login failed. Please check your credentials.'}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
        <Form.Item
          label="Email address"
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
                placeholder="owner@myrestaurant.com"
                disabled={mutation.isPending}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Password"
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
                placeholder="Enter password"
                disabled={mutation.isPending}
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Flex align="center" justify="space-between">
            <Controller
              name="remember"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox checked={value} onChange={onChange} disabled={mutation.isPending}>
                  Remember me
                </Checkbox>
              )}
            />
            <Link to="/forgot-password" style={{ color: '#F97316', fontWeight: 500, fontSize: '13px' }}>
              Forgot password?
            </Link>
          </Flex>
        </Form.Item>

        <Form.Item style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={mutation.isPending}
            disabled={!isValid}
            size="large"
            style={{ height: '44px' }}
          >
            Sign in
          </Button>
        </Form.Item>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: '13px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#F97316', fontWeight: 600 }}>
            Create one
          </Link>
        </Text>
      </Form>
    </Card>
  );
};

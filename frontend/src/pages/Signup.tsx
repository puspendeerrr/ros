import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button, Checkbox, Typography, Alert, Result } from 'antd';
import { ShopOutlined, UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service.js';

const { Title, Text } = Typography;

const signupSchema = z
  .object({
    restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters'),
    ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      restaurantName: '',
      ownerName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SignupFormValues) =>
      authService.signup({
        restaurantName: data.restaurantName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: (_, variables) => {
      setRegisteredEmail(variables.email);
      setIsSuccess(true);
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <Card bordered={false} style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', padding: '12px' }}>
        <Result
          status="success"
          title="Account Created Successfully"
          subTitle={`We have sent a verification link to ${registeredEmail}. Please check your inbox and verify your email address to activate your account.`}
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
          Create owner account
        </Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Set up your restaurant profile and owner administrator access.
        </Text>
      </div>

      {mutation.isError && (
        <Alert
          message={(mutation.error as any).response?.data?.message || 'Registration failed. Please try again.'}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
        <Form.Item
          label="Restaurant Name"
          validateStatus={errors.restaurantName ? 'error' : ''}
          help={errors.restaurantName?.message}
        >
          <Controller
            name="restaurantName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<ShopOutlined style={{ color: '#BFBFBF' }} />}
                placeholder="e.g. Bella Italia"
                disabled={mutation.isPending}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Owner Name"
          validateStatus={errors.ownerName ? 'error' : ''}
          help={errors.ownerName?.message}
        >
          <Controller
            name="ownerName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined style={{ color: '#BFBFBF' }} />}
                placeholder="e.g. John Doe"
                disabled={mutation.isPending}
              />
            )}
          />
        </Form.Item>

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

        <Form.Item
          label="Phone Number"
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<PhoneOutlined style={{ color: '#BFBFBF' }} />}
                placeholder="e.g. 555-019-2834"
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
                placeholder="Minimum 8 characters"
                disabled={mutation.isPending}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
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

        <Form.Item
          validateStatus={errors.acceptTerms ? 'error' : ''}
          help={errors.acceptTerms?.message}
        >
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Checkbox checked={value} onChange={onChange} disabled={mutation.isPending}>
                I accept the <a href="#terms" style={{ color: '#F97316' }}>Terms and Conditions</a>
              </Checkbox>
            )}
          />
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
            Create Restaurant
          </Button>
        </Form.Item>

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: '13px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#F97316', fontWeight: 600 }}>
            Sign In
          </Link>
        </Text>
      </Form>
    </Card>
  );
};

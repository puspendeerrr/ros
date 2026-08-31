import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { Spin, Flex } from 'antd';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, restaurant } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Spin size="large" tip="Verifying session..." />
      </Flex>
    );
  }

  if (isAuthenticated) {
    const step = restaurant?.onboardingStep;
    const isUnderOnboarding = step !== undefined && step !== null && step < 8;

    if (isUnderOnboarding && location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
    if (!isUnderOnboarding && location.pathname === '/onboarding') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Spin size="large" tip="Verifying session..." />
      </Flex>
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

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
    const isCompleted = restaurant?.onboardingCompleted === true;

    if (!isCompleted && location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
    if (isCompleted && location.pathname === '/onboarding') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, isLoading, restaurant } = useAuthStore();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Spin size="large" tip="Verifying session..." />
      </Flex>
    );
  }

  if (isAuthenticated) {
    const isCompleted = restaurant?.onboardingCompleted === true;
    return <Navigate to={isCompleted ? "/dashboard" : "/onboarding"} replace />;
  }

  return <Outlet />;
};

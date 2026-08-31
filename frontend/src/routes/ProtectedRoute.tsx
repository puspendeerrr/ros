import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { Spin, Flex } from 'antd';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, profileLoaded, restaurant } = useAuthStore();
  const location = useLocation();

  // 1. Still determining auth state (initial app load)
  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Spin size="large" tip="Verifying session..." />
      </Flex>
    );
  }

  // 2. Not authenticated — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Authenticated but profile not yet fetched from backend — keep loading
  // This prevents routing decisions based on stale cached data
  if (!profileLoaded) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Spin size="large" tip="Loading profile..." />
      </Flex>
    );
  }

  // 4. Profile loaded — make routing decisions based on backend truth
  const isCompleted = restaurant?.onboardingCompleted === true;

  if (!isCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  if (isCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, isLoading, profileLoaded, restaurant } = useAuthStore();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Spin size="large" tip="Verifying session..." />
      </Flex>
    );
  }

  if (isAuthenticated) {
    // Wait for profile before deciding redirect destination
    if (!profileLoaded) {
      return (
        <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
          <Spin size="large" tip="Loading profile..." />
        </Flex>
      );
    }
    const isCompleted = restaurant?.onboardingCompleted === true;
    return <Navigate to={isCompleted ? "/dashboard" : "/onboarding"} replace />;
  }

  return <Outlet />;
};

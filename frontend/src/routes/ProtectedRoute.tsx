import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { Spin, Flex } from 'antd';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Spin size="large" tip="Verifying session..." />
      </Flex>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
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

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

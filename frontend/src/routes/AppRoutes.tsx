import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthLayout } from '../layouts/AuthLayout.js';
import { Login } from '../pages/Login.js';
import { Signup } from '../pages/Signup.js';
import { ForgotPassword } from '../pages/ForgotPassword.js';
import { ResetPassword } from '../pages/ResetPassword.js';
import { VerifyEmail } from '../pages/VerifyEmail.js';
import { Dashboard } from '../pages/Dashboard.js';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute.js';
import { useAuthStore } from '../store/auth.store.js';

export const AppRoutes: React.FC = () => {
  const { setAccessToken, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/refresh-token`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data.data;
        setAccessToken(accessToken);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, [setAccessToken, logout, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Dashboard Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        {/* Public Authentication Routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>
        </Route>

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

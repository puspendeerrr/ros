import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthLayout } from '../layouts/AuthLayout.js';
import { MainLayout } from '../layouts/MainLayout.js';
import { Login } from '../pages/Login.js';
import { Signup } from '../pages/Signup.js';
import { ForgotPassword } from '../pages/ForgotPassword.js';
import { ResetPassword } from '../pages/ResetPassword.js';
import { VerifyEmail } from '../pages/VerifyEmail.js';
import { Dashboard } from '../pages/Dashboard.js';
import { Menu } from '../pages/Menu.js';
import { QRMenu } from '../pages/QRMenu.js';
import { PublicMenu } from '../pages/PublicMenu.js';
import { Restaurant } from '../pages/Restaurant.js';
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
        {/* Protected Platform Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/qr-menu" element={<QRMenu />} />
            <Route path="/restaurant" element={<Restaurant />} />
          </Route>
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

        {/* Public Menu Route */}
        <Route path="/r/:restaurantSlug" element={<PublicMenu />} />

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

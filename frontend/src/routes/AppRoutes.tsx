import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { AuthLayout } from '../layouts/AuthLayout.js';
import { MainLayout } from '../layouts/MainLayout.js';
import { LandingLayout } from '../layouts/LandingLayout.js';
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
import { Landing } from '../pages/Landing.js';
import { Features } from '../pages/Features.js';

import { About } from '../pages/About.js';
import { Contact } from '../pages/Contact.js';
import { Privacy } from '../pages/Privacy.js';
import { Terms } from '../pages/Terms.js';
import { NotFound, Forbidden, ServerError } from '../pages/ErrorPages.js';
import { ScrollToTop } from '../components/ScrollToTop.js';
import { SplashLoader } from '../components/SplashLoader.js';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute.js';
import { useAuthStore } from '../store/auth.store.js';

export const AppRoutes: React.FC = () => {
  const { setAccessToken, logout, setLoading } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

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

    // Trigger splash dismissal after 1.2s
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [setAccessToken, logout, setLoading]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatePresence>
        {showSplash && <SplashLoader />}
      </AnimatePresence>

      <Routes>
        {/* Public SaaS Landing & Resource Pages */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        {/* Protected Platform Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
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

        {/* Branded Error Routes */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="/404" element={<NotFound />} />

        {/* Fallback routing */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

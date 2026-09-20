import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { AuthLayout } from '../layouts/AuthLayout.js';
import { MainLayout } from '../layouts/MainLayout.js';
import { LandingLayout } from '../layouts/LandingLayout.js';
import { ScrollToTop } from '../components/ScrollToTop.js';
import { SplashLoader } from '../components/SplashLoader.js';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute.js';
import { useAuthStore } from '../store/auth.store.js';
import { restaurantService } from '../services/restaurant.service.js';

// Route-based code splitting with lazy loading
const Landing = React.lazy(() => import('../pages/Landing.js').then(m => ({ default: m.Landing })));
const Features = React.lazy(() => import('../pages/Features.js').then(m => ({ default: m.Features })));
const About = React.lazy(() => import('../pages/About.js').then(m => ({ default: m.About })));
const Contact = React.lazy(() => import('../pages/Contact.js').then(m => ({ default: m.Contact })));
const Privacy = React.lazy(() => import('../pages/Privacy.js').then(m => ({ default: m.Privacy })));
const Terms = React.lazy(() => import('../pages/Terms.js').then(m => ({ default: m.Terms })));

// Enterprise Architecture Templates & Hubs
const FeatureTemplate = React.lazy(() => import('../templates/FeatureTemplate.js').then(m => ({ default: m.FeatureTemplate })));
const SolutionTemplate = React.lazy(() => import('../templates/SolutionTemplate.js').then(m => ({ default: m.SolutionTemplate })));
const IndustryTemplate = React.lazy(() => import('../templates/IndustryTemplate.js').then(m => ({ default: m.IndustryTemplate })));
const ComparisonTemplate = React.lazy(() => import('../templates/ComparisonTemplate.js').then(m => ({ default: m.ComparisonTemplate })));
const DocsTemplate = React.lazy(() => import('../templates/DocsTemplate.js').then(m => ({ default: m.DocsTemplate })));
const ResourceTemplate = React.lazy(() => import('../templates/ResourceTemplate.js').then(m => ({ default: m.ResourceTemplate })));
const PricingTemplate = React.lazy(() => import('../templates/PricingTemplate.js').then(m => ({ default: m.PricingTemplate })));
const LegalTemplate = React.lazy(() => import('../templates/LegalTemplate.js').then(m => ({ default: m.LegalTemplate })));

const SearchPage = React.lazy(() => import('../pages/SearchPage.js').then(m => ({ default: m.SearchPage })));
const CompareHub = React.lazy(() => import('../pages/CompareHub.js').then(m => ({ default: m.CompareHub })));
const CustomersHub = React.lazy(() => import('../pages/CustomersHub.js').then(m => ({ default: m.CustomersHub })));
const CareersPage = React.lazy(() => import('../pages/CareersPage.js').then(m => ({ default: m.CareersPage })));
const ChangelogPage = React.lazy(() => import('../pages/ChangelogPage.js').then(m => ({ default: m.ChangelogPage })));
const RoadmapPage = React.lazy(() => import('../pages/RoadmapPage.js').then(m => ({ default: m.RoadmapPage })));
const ApiPage = React.lazy(() => import('../pages/ApiPage.js').then(m => ({ default: m.ApiPage })));
const DownloadsPage = React.lazy(() => import('../pages/DownloadsPage.js').then(m => ({ default: m.DownloadsPage })));

const Dashboard = React.lazy(() => import('../pages/Dashboard.js').then(m => ({ default: m.Dashboard })));
const Menu = React.lazy(() => import('../pages/Menu.js').then(m => ({ default: m.Menu })));
const QRMenu = React.lazy(() => import('../pages/QRMenu.js').then(m => ({ default: m.QRMenu })));
const PublicMenu = React.lazy(() => import('../pages/PublicMenu.js').then(m => ({ default: m.PublicMenu })));
const Restaurant = React.lazy(() => import('../pages/Restaurant.js').then(m => ({ default: m.Restaurant })));
const Onboarding = React.lazy(() => import('../pages/Onboarding.js').then(m => ({ default: m.Onboarding })));

const Login = React.lazy(() => import('../pages/Login.js').then(m => ({ default: m.Login })));
const Signup = React.lazy(() => import('../pages/Signup.js').then(m => ({ default: m.Signup })));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword.js').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword.js').then(m => ({ default: m.ResetPassword })));
const VerifyEmail = React.lazy(() => import('../pages/VerifyEmail.js').then(m => ({ default: m.VerifyEmail })));

const NotFound = React.lazy(() => import('../pages/ErrorPages.js').then(m => ({ default: m.NotFound })));
const Forbidden = React.lazy(() => import('../pages/ErrorPages.js').then(m => ({ default: m.Forbidden })));
const ServerError = React.lazy(() => import('../pages/ErrorPages.js').then(m => ({ default: m.ServerError })));

export const AppRoutes: React.FC = () => {
  const { setAccessToken, logout, setLoading, setAuth, setProfileLoaded } = useAuthStore();
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

        // Fetch latest profile from backend (source of truth)
        const profileRes = await restaurantService.getProfile();
        setAuth(profileRes.data, accessToken);
      } catch (error) {
        logout();
        setProfileLoaded(false);
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
  }, [setAccessToken, logout, setLoading, setAuth, setProfileLoaded]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AnimatePresence>
        {showSplash && <SplashLoader />}
      </AnimatePresence>

      <Suspense fallback={null}>
        <Routes>
          {/* Public SaaS Landing & Architecture Routes */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Landing />} />
            
            {/* Features Hierarchy */}
            <Route path="/features" element={<Features />} />
            <Route path="/features/:slug" element={<FeatureTemplate />} />

            {/* Solutions Hierarchy */}
            <Route path="/solutions" element={<Navigate to="/features" replace />} />
            <Route path="/solutions/:slug" element={<SolutionTemplate />} />

            {/* Dedicated Industries Hierarchy */}
            <Route path="/industries" element={<Navigate to="/features" replace />} />
            <Route path="/industries/:slug" element={<IndustryTemplate />} />

            {/* Commercial Comparison Pages */}
            <Route path="/compare" element={<CompareHub />} />
            <Route path="/compare/:slug" element={<ComparisonTemplate />} />

            {/* Versioned Documentation Support */}
            <Route path="/docs" element={<DocsTemplate />} />
            <Route path="/docs/:version" element={<DocsTemplate />} />
            <Route path="/docs/:version/:category/:slug" element={<DocsTemplate />} />

            {/* Resource Center (Glossary, FAQs, Guides) */}
            <Route path="/resources" element={<ResourceTemplate />} />
            <Route path="/resources/:type" element={<ResourceTemplate />} />
            <Route path="/resources/:type/:slug" element={<ResourceTemplate />} />

            {/* Pricing & Proof */}
            <Route path="/pricing" element={<PricingTemplate />} />
            <Route path="/customers" element={<CustomersHub />} />

            {/* Company & Support */}
            <Route path="/company/about" element={<About />} />
            <Route path="/company/careers" element={<CareersPage />} />
            <Route path="/company/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Legal & Governance */}
            <Route path="/legal/privacy-policy" element={<LegalTemplate />} />
            <Route path="/legal/terms-of-service" element={<LegalTemplate />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Ecosystem & Ops */}
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>

          {/* Protected Platform Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
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
      </Suspense>
    </BrowserRouter>
  );
};

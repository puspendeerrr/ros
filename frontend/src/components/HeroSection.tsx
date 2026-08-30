import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Row, Col, Typography } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrcodeOutlined,
  BuildOutlined,
  ShopOutlined,
  LineChartOutlined,
  AppstoreOutlined,
  BranchesOutlined,
  MobileOutlined,
  GlobalOutlined,
  RiseOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import logoIcon from '../assets/logo-icon.png';

const { Title, Paragraph, Text } = Typography;

/* ────────────────────────────────────────────────────────────
   useCountUp — Animated number counter (GPU-friendly)
   ──────────────────────────────────────────────────────────── */
const useCountUp = (target: number, active: boolean, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    const startTime = performance.now();
    let raf: number;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return count;
};

/* ────────────────────────────────────────────────────────────
   HERO VARIANTS DATA (10 product-focused variants)
   ──────────────────────────────────────────────────────────── */
interface FloatingCard {
  icon: string;
  label: string;
  value?: string;
}

interface HeroVariant {
  id: string;
  tab: string;
  tabIcon: React.ReactNode;
  headline: React.ReactNode;
  subtext: string;
  ctaHelper: string;
  badges: string[];
  floatingCards: FloatingCard[];
}

const heroVariants: HeroVariant[] = [
  {
    id: 'dashboard',
    tab: 'Dashboard',
    tabIcon: <AppstoreOutlined />,
    headline: <>Manage Menus, QR Codes & Customers <span style={{ color: '#F97316' }}>From One Dashboard.</span></>,
    subtext: 'One unified cloud dashboard for menu management, QR code generation, customer analytics, and restaurant operations. Everything your restaurant team needs, in one place.',
    ctaHelper: 'Manage everything from one place.',
    badges: ['Unified Dashboard', 'Quick Actions', 'Real-time Metrics', 'Activity Feed', 'Cloud Hosted', 'Role Management'],
    floatingCards: [
      { icon: '📈', label: "Today's Revenue", value: '₹12,400' },
      { icon: '🔄', label: 'Instant Sync' },
      { icon: '🎯', label: '4 Quick Actions' },
    ],
  },
  {
    id: 'qr-menu',
    tab: 'QR Menu',
    tabIcon: <QrcodeOutlined />,
    headline: <>Everything Your Restaurant Needs <span style={{ color: '#F97316' }}>To Go Digital.</span></>,
    subtext: 'Generate unique QR codes for every table, counter, or delivery card. Customers scan once and your full menu loads instantly—no app download required.',
    ctaHelper: 'Ready in under 5 minutes.',
    badges: ['Table QR Codes', 'Instant Scan', 'No App Download', 'Custom Branding', 'Scan Analytics', 'Unlimited Codes'],
    floatingCards: [
      { icon: '📊', label: '126 QR Scans Today' },
      { icon: '📱', label: 'QR Ready to Print' },
      { icon: '✅', label: 'Table 7 Scanned' },
    ],
  },
  {
    id: 'menu-builder',
    tab: 'Menu Builder',
    tabIcon: <BuildOutlined />,
    headline: <>Stop Printing Menus. <span style={{ color: '#F97316' }}>Start Updating Instantly.</span></>,
    subtext: 'Add categories, upload food photos, set prices, mark items sold-out, and toggle availability—all from a fast-loading editor grid. Changes reflect on customer menus within seconds.',
    ctaHelper: 'Update prices, photos & availability instantly.',
    badges: ['Drag & Drop', 'Photo Upload', 'Sold-Out Toggle', 'Category Manager', 'Bulk Import', 'Real-time Sync'],
    floatingCards: [
      { icon: '✅', label: '24 Items Updated' },
      { icon: '⚡', label: 'Menu Updated Live' },
      { icon: '🏷️', label: '6 Categories' },
    ],
  },
  {
    id: 'restaurant-profile',
    tab: 'Restaurant Profile',
    tabIcon: <ShopOutlined />,
    headline: <>Create A Digital Restaurant <span style={{ color: '#F97316' }}>Customers Love.</span></>,
    subtext: 'Publish a professional restaurant page with your logo, cover photo, business hours, contact details, and location. Your digital storefront—live in minutes.',
    ctaHelper: 'Publish your restaurant instantly.',
    badges: ['Logo & Cover', 'Business Hours', 'Contact Info', 'Location Map', 'SEO Optimized', 'Mobile Responsive'],
    floatingCards: [
      { icon: '🟢', label: 'Digital Profile Live' },
      { icon: '📸', label: '12 Photos Uploaded' },
      { icon: '✓', label: 'Restaurant Verified' },
    ],
  },
  {
    id: 'analytics',
    tab: 'Analytics',
    tabIcon: <LineChartOutlined />,
    headline: <>Run Your Restaurant Faster, <span style={{ color: '#F97316' }}>Smarter & Paper-Free.</span></>,
    subtext: 'Track QR scans, popular menu items, daily visitor counts, and customer return rates. Make data-driven decisions to grow your restaurant business across India.',
    ctaHelper: 'Track customer engagement in real time.',
    badges: ['Scan Analytics', 'Popular Items', 'Daily Visitors', 'Return Rates', 'Revenue Tracking', 'Export Reports'],
    floatingCards: [
      { icon: '👥', label: '847 Visitors This Week' },
      { icon: '🔥', label: 'Most Ordered: Biryani' },
      { icon: '📊', label: '+18% This Week' },
    ],
  },
  {
    id: 'multi-branch',
    tab: 'Multi Branch',
    tabIcon: <BranchesOutlined />,
    headline: <>One Platform For <span style={{ color: '#F97316' }}>Every Restaurant Operation.</span></>,
    subtext: 'Manage multiple restaurant branches, cloud kitchens, or franchise outlets from a single login. Compare performance, sync menus, and control permissions across locations.',
    ctaHelper: 'Manage all branches from a single login.',
    badges: ['Branch Switcher', 'Multi-location', 'Unified Menu Sync', 'Per-branch Analytics', 'Role Permissions', 'Franchise Ready'],
    floatingCards: [
      { icon: '🏢', label: '3 Branches Active' },
      { icon: '📊', label: 'Branch Analytics' },
      { icon: '🔀', label: 'Mumbai → Pune' },
    ],
  },
  {
    id: 'customer-experience',
    tab: 'Customer Experience',
    tabIcon: <MobileOutlined />,
    headline: <>Give Every Customer A <span style={{ color: '#F97316' }}>Premium Digital Dining Experience.</span></>,
    subtext: 'Customers scan the QR code on their table and see a beautiful, fast-loading mobile menu. Browse categories, search dishes, view photos and prices—all without downloading an app.',
    ctaHelper: 'Your customers will love the experience.',
    badges: ['Mobile Optimized', 'Category Browse', 'Dish Search', 'Photo Gallery', 'Diet Labels', 'Multi-Language'],
    floatingCards: [
      { icon: '⭐', label: '4.9★ Rating' },
      { icon: '👤', label: 'New Customer' },
      { icon: '🔍', label: 'Search: "Paneer"' },
    ],
  },
  {
    id: 'digital-presence',
    tab: 'Digital Presence',
    tabIcon: <GlobalOutlined />,
    headline: <>Build A Modern Restaurant <span style={{ color: '#F97316' }}>Without Expensive Software.</span></>,
    subtext: 'Get a professional digital presence with your own restaurant URL, SEO-optimized pages, and social sharing. Stand out on Google—no web developer needed.',
    ctaHelper: 'Get a professional website for ₹0.',
    badges: ['Custom URL', 'SEO Ready', 'Google Indexed', 'Social Sharing', 'No Coding', 'Free Forever'],
    floatingCards: [
      { icon: '🌐', label: 'restaurantos.in/cafe' },
      { icon: '🟢', label: 'Website Live' },
      { icon: '📈', label: 'SEO Score: 94' },
    ],
  },
  {
    id: 'growth',
    tab: 'Growth',
    tabIcon: <RiseOutlined />,
    headline: <>From QR Menu To Restaurant Growth — <span style={{ color: '#F97316' }}>Everything In One Place.</span></>,
    subtext: 'Save ₹25,000+ monthly on aggregator commissions and printing costs. Track repeat customers, grow your digital presence, and build direct relationships with every diner.',
    ctaHelper: 'Grow repeat customers without extra effort.',
    badges: ['₹25K+ Monthly Savings', 'Repeat Customers', 'Direct Relationships', 'Zero Commissions', 'Revenue Growth', 'Customer Retention'],
    floatingCards: [
      { icon: '💰', label: '₹25,000 Saved Monthly' },
      { icon: '📈', label: 'Revenue +32%' },
      { icon: '🔁', label: '68% Repeat Customers' },
    ],
  },
  {
    id: 'ai-assistant',
    tab: 'AI Assistant ✨',
    tabIcon: <RobotOutlined />,
    headline: <>Turn Every Table Into A <span style={{ color: '#F97316' }}>Smart Ordering Experience.</span></>,
    subtext: 'Coming soon: AI-powered menu recommendations, demand forecasting, smart pricing suggestions, and automated customer insights—built directly into your Restaurant OS dashboard.',
    ctaHelper: 'AI-powered insights, coming soon.',
    badges: ['AI Recommendations', 'Demand Forecast', 'Smart Pricing', 'Customer Insights', 'Auto Suggestions', 'Coming Soon'],
    floatingCards: [
      { icon: '🤖', label: 'AI: "Add Paneer Tikka"' },
      { icon: '🔮', label: 'Demand Forecast Ready' },
      { icon: '💡', label: 'Smart Insight' },
    ],
  },
];

/* ────────────────────────────────────────────────────────────
   LIVE PRODUCT EVENTS (auto-cycling ambient feed)
   ──────────────────────────────────────────────────────────── */
const liveEvents = [
  { icon: '🟢', text: 'Menu Updated Just Now' },
  { icon: '📡', text: 'QR Menu Published' },
  { icon: '👤', text: 'Customer Viewing Menu' },
  { icon: '✅', text: 'Sync Complete' },
  { icon: '🌐', text: 'Restaurant Online' },
  { icon: '📊', text: '126 QR Scans Today' },
  { icon: '⏱', text: 'Last Updated 2 Minutes Ago' },
  { icon: '🔔', text: 'New Customer Joined' },
  { icon: '📱', text: 'QR Code Scanned — Table 4' },
  { icon: '⚡', text: 'Menu Item Added: Butter Chicken' },
  { icon: '🏪', text: 'Restaurant Profile Published' },
  { icon: '📈', text: '18 Visitors in Last Hour' },
  { icon: '🔄', text: 'Cloud Backup Complete' },
  { icon: '✨', text: 'Digital Presence Score: 94/100' },
  { icon: '🎯', text: 'Completion Checklist: 8/8 Done' },
];

/* ────────────────────────────────────────────────────────────
   MOCKUP RENDERERS — Each variant renders a distinct screen
   ──────────────────────────────────────────────────────────── */

// Shared stagger animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
};
const fadeScaleItem = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

// Counter component for inside mockups
const MockupCounter: React.FC<{ target: number; prefix?: string; suffix?: string; active: boolean }> = ({ target, prefix = '', suffix = '', active }) => {
  const count = useCountUp(target, active, 1200);
  return <>{prefix}{count.toLocaleString('en-IN')}{suffix}</>;
};

// ─── Dashboard Mockup ───
const DashboardMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
    <motion.div variants={staggerItem} style={{ display: 'flex', gap: '8px' }}>
      {[
        { label: 'Revenue', value: 12400, prefix: '₹', color: '#F97316' },
        { label: 'Tables', value: 18, color: '#22C55E' },
        { label: 'QR Scans', value: 347, color: '#3B82F6' },
      ].map(m => (
        <div key={m.label} style={{ flex: 1, background: '#1E293B', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>{m.label}</div>
          <div style={{ fontSize: '16px', fontWeight: 900, color: m.color }}>
            <MockupCounter target={m.value} prefix={m.prefix} active={active} />
          </div>
        </div>
      ))}
    </motion.div>
    <motion.div variants={staggerItem} style={{ display: 'flex', gap: '6px' }}>
      {['Add Item', 'Generate QR', 'View Menu', 'Analytics'].map(a => (
        <div key={a} style={{ flex: 1, background: a === 'Add Item' ? '#F97316' : '#334155', padding: '5px', borderRadius: '6px', fontSize: '9px', fontWeight: 700, textAlign: 'center', color: '#FFFFFF' }}>{a}</div>
      ))}
    </motion.div>
    <motion.div variants={staggerItem} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', flex: 1 }}>
      <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, marginBottom: '8px' }}>Recent Activity</div>
      {['Menu updated — 2 min ago', 'QR scanned — Table 4', 'New item added'].map((item, i) => (
        <motion.div key={i} variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', borderBottom: i < 2 ? '1px solid #334155' : 'none' }}>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
          <span style={{ fontSize: '10px', color: '#94A3B8' }}>{item}</span>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

// ─── QR Menu Mockup ───
const QRMenuMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
    <motion.div variants={staggerItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#F97316' }}>QR Code Generator</span>
      <span style={{ fontSize: '9px', color: '#64748B' }}>Table #7</span>
    </motion.div>
    <motion.div variants={fadeScaleItem} style={{ background: '#FFFFFF', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <QrcodeOutlined style={{ fontSize: '80px', color: '#0F172A' }} />
    </motion.div>
    <motion.div variants={staggerItem} style={{ display: 'flex', gap: '8px' }}>
      <div style={{ flex: 1, background: '#F97316', padding: '8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, textAlign: 'center', color: '#FFFFFF' }}>Download PNG</div>
      <div style={{ flex: 1, background: '#334155', padding: '8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, textAlign: 'center', color: '#FFFFFF' }}>Print Stand</div>
    </motion.div>
    <motion.div variants={staggerItem} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '9px', color: '#64748B' }}>Total Scans</span>
      <span style={{ fontSize: '14px', fontWeight: 900, color: '#22C55E' }}><MockupCounter target={126} active={active} /></span>
    </motion.div>
  </motion.div>
);

// ─── Menu Builder Mockup ───
const MenuBuilderMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', gap: '8px', height: '100%' }}>
    {/* Sidebar */}
    <motion.div variants={staggerItem} style={{ width: '70px', background: '#1E293B', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {['Starters', 'Mains', 'Desserts', 'Drinks'].map((cat, i) => (
        <div key={cat} style={{ padding: '5px 4px', borderRadius: '4px', fontSize: '8px', fontWeight: 600, background: i === 1 ? '#F97316' : 'transparent', color: i === 1 ? '#FFF' : '#94A3B8', textAlign: 'center' }}>{cat}</div>
      ))}
    </motion.div>
    {/* Items */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {[
        { name: 'Paneer Butter Masala', price: '₹280', on: true },
        { name: 'Dal Makhani', price: '₹220', on: true },
        { name: 'Butter Chicken', price: '₹320', on: false },
        { name: 'Gulab Jamun', price: '₹120', on: true },
      ].map((item, i) => (
        <motion.div key={i} variants={staggerItem} style={{ background: '#1E293B', padding: '8px 10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#E2E8F0' }}>{item.name}</div>
            <div style={{ fontSize: '9px', color: '#F97316', fontWeight: 800 }}>{item.price}</div>
          </div>
          <div style={{ width: '28px', height: '14px', borderRadius: '7px', background: item.on ? '#22C55E' : '#475569', position: 'relative', transition: 'background 0.3s' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFFFFF', position: 'absolute', top: '2px', left: item.on ? '16px' : '2px', transition: 'left 0.3s' }} />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ─── Restaurant Profile Mockup ───
const RestaurantProfileMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
    <motion.div variants={fadeScaleItem} style={{ height: '60px', background: 'linear-gradient(135deg, #F97316, #EA580C)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ShopOutlined style={{ color: '#F97316', fontSize: '14px' }} />
      </div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>The Pepper Bistro</div>
        <div style={{ fontSize: '8px', color: '#FFEDD5' }}>Koramangala, Bengaluru</div>
      </div>
    </motion.div>
    {[
      { label: 'BUSINESS HOURS', value: 'Mon – Sun, 11 AM – 11 PM' },
      { label: 'CONTACT', value: '+91 98765 43210' },
      { label: 'CUISINE', value: 'North Indian, Continental' },
    ].map((field, i) => (
      <motion.div key={i} variants={staggerItem} style={{ background: '#1E293B', padding: '8px 10px', borderRadius: '6px' }}>
        <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>{field.label}</div>
        <div style={{ fontSize: '10px', color: '#E2E8F0', fontWeight: 600 }}>{field.value}</div>
      </motion.div>
    ))}
    <motion.div variants={staggerItem} style={{ background: '#F97316', padding: '8px', borderRadius: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#FFFFFF', marginTop: 'auto' }}>
      Save & Publish
    </motion.div>
  </motion.div>
);

// ─── Analytics Mockup ───
const AnalyticsMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
    <motion.div variants={staggerItem} style={{ display: 'flex', gap: '8px' }}>
      {[
        { label: 'Visitors', value: 847, color: '#3B82F6' },
        { label: 'Return Rate', value: 68, suffix: '%', color: '#22C55E' },
      ].map(m => (
        <div key={m.label} style={{ flex: 1, background: '#1E293B', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600 }}>{m.label}</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: m.color }}>
            <MockupCounter target={m.value} suffix={m.suffix} active={active} />
          </div>
        </div>
      ))}
    </motion.div>
    {/* Bar chart */}
    <motion.div variants={staggerItem} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', flex: 1 }}>
      <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, marginBottom: '8px' }}>Popular Items</div>
      {[
        { name: 'Biryani', w: '90%' },
        { name: 'Paneer', w: '72%' },
        { name: 'Dal', w: '58%' },
        { name: 'Naan', w: '45%' },
      ].map((bar, i) => (
        <motion.div key={i} variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ fontSize: '8px', color: '#94A3B8', width: '36px', flexShrink: 0 }}>{bar.name}</span>
          <motion.div
            initial={{ width: 0 }}
            animate={active ? { width: bar.w } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ height: '8px', borderRadius: '4px', background: `linear-gradient(90deg, #F97316, #FB923C)` }}
          />
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

// ─── Multi Branch Mockup ───
const MultiBranchMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
    <motion.div variants={staggerItem} style={{ background: '#1E293B', padding: '8px 10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, color: '#E2E8F0' }}>Branch Switcher</span>
      <span style={{ fontSize: '9px', color: '#F97316', fontWeight: 600 }}>▼ Mumbai HQ</span>
    </motion.div>
    {[
      { name: 'Mumbai HQ', scans: 234, revenue: '₹18,500', active: true },
      { name: 'Pune Outlet', scans: 156, revenue: '₹12,200', active: true },
      { name: 'Delhi NCR', scans: 89, revenue: '₹8,400', active: false },
    ].map((branch, i) => (
      <motion.div key={i} variants={staggerItem} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', border: branch.active ? '1px solid #334155' : '1px solid #1E293B' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#E2E8F0' }}>{branch.name}</span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: branch.active ? '#22C55E' : '#64748B' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '9px', color: '#64748B' }}>Scans: <span style={{ color: '#3B82F6', fontWeight: 700 }}><MockupCounter target={branch.scans} active={active} /></span></span>
          <span style={{ fontSize: '9px', color: '#64748B' }}>Rev: <span style={{ color: '#22C55E', fontWeight: 700 }}>{branch.revenue}</span></span>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// ─── Customer Experience Mockup ───
const CustomerExperienceMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
    <motion.div variants={staggerItem} style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', padding: '12px 16px' }}>
      <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>The Pepper Bistro</div>
      <div style={{ fontSize: '8px', color: '#FFEDD5' }}>Digital Menu</div>
    </motion.div>
    <div style={{ padding: '10px 12px', background: '#FFFFFF', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <motion.div variants={staggerItem} style={{ background: '#F8FAFC', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
        <span style={{ fontSize: '9px', color: '#94A3B8' }}>🔍 Search dishes...</span>
      </motion.div>
      <motion.div variants={staggerItem} style={{ display: 'flex', gap: '4px' }}>
        {['All', 'Starters', 'Mains', 'Desserts'].map((cat, i) => (
          <span key={cat} style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '8px', fontWeight: 600, background: i === 0 ? '#F97316' : '#F8FAFC', color: i === 0 ? '#FFF' : '#475569' }}>{cat}</span>
        ))}
      </motion.div>
      {[
        { name: 'Paneer Tikka', price: '₹260', tag: '🌶️' },
        { name: 'Chicken Biryani', price: '₹340', tag: '⭐' },
        { name: 'Masala Dosa', price: '₹180', tag: '🥬' },
      ].map((dish, i) => (
        <motion.div key={i} variants={staggerItem} style={{ display: 'flex', gap: '8px', padding: '6px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{dish.tag}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A' }}>{dish.name}</div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#F97316' }}>{dish.price}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ─── Digital Presence Mockup ───
const DigitalPresenceMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
    <motion.div variants={staggerItem} style={{ background: '#1E293B', padding: '8px 10px', borderRadius: '6px' }}>
      <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>YOUR RESTAURANT URL</div>
      <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 700 }}>restaurantos.in/pepper-bistro</div>
    </motion.div>
    <motion.div variants={staggerItem} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px' }}>
      <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>SEO PREVIEW</div>
      <div style={{ fontSize: '10px', color: '#3B82F6', fontWeight: 600 }}>The Pepper Bistro — Digital Menu</div>
      <div style={{ fontSize: '8px', color: '#22C55E' }}>restaurantos.in/pepper-bistro</div>
      <div style={{ fontSize: '8px', color: '#94A3B8', marginTop: '2px' }}>View our full menu with categories, prices, and photos. Scan QR for instant access.</div>
    </motion.div>
    <motion.div variants={staggerItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1E293B', padding: '10px', borderRadius: '8px' }}>
      <span style={{ fontSize: '10px', color: '#E2E8F0', fontWeight: 600 }}>Go Live</span>
      <div style={{ width: '28px', height: '14px', borderRadius: '7px', background: '#22C55E', position: 'relative' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFFFFF', position: 'absolute', top: '2px', left: '16px' }} />
      </div>
    </motion.div>
    <motion.div variants={staggerItem} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '9px', color: '#64748B' }}>SEO Score</span>
      <span style={{ fontSize: '14px', fontWeight: 900, color: '#22C55E' }}><MockupCounter target={94} active={active} suffix="/100" /></span>
    </motion.div>
  </motion.div>
);

// ─── Growth Mockup ───
const GrowthMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
    <motion.div variants={staggerItem} style={{ display: 'flex', gap: '8px' }}>
      {[
        { label: 'Monthly Savings', value: '₹25,000+', color: '#22C55E' },
        { label: 'Revenue Growth', value: '+32%', color: '#F97316' },
      ].map(m => (
        <div key={m.label} style={{ flex: 1, background: '#1E293B', padding: '10px', borderRadius: '8px' }}>
          <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600 }}>{m.label}</div>
          <div style={{ fontSize: '16px', fontWeight: 900, color: m.color }}>{m.value}</div>
        </div>
      ))}
    </motion.div>
    <motion.div variants={staggerItem} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px' }}>
      <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>Repeat Customer Rate</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `conic-gradient(#F97316 ${68 * 3.6}deg, #334155 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: '#F97316' }}>
            <MockupCounter target={68} suffix="%" active={active} />
          </div>
        </div>
        <span style={{ fontSize: '9px', color: '#94A3B8' }}>of diners return within 30 days</span>
      </div>
    </motion.div>
    <motion.div variants={staggerItem} style={{ background: '#FFF7ED', padding: '10px', borderRadius: '8px', border: '1px solid #FFD8A8' }}>
      <div style={{ fontSize: '9px', color: '#EA580C', fontWeight: 700, marginBottom: '2px' }}>💡 AI Suggestion</div>
      <div style={{ fontSize: '10px', color: '#92400E' }}>Add "Weekend Brunch" category to increase Saturday traffic by ~15%</div>
    </motion.div>
  </motion.div>
);

// ─── AI Assistant Mockup ───
const AIAssistantMockup: React.FC<{ active: boolean }> = ({ active }) => (
  <motion.div variants={staggerContainer} initial="hidden" animate={active ? 'visible' : 'hidden'} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
    <motion.div variants={staggerItem} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
      <RobotOutlined style={{ color: '#F97316', fontSize: '14px' }} />
      <span style={{ fontSize: '11px', fontWeight: 800, color: '#F97316' }}>AI Assistant</span>
      <span style={{ fontSize: '8px', color: '#64748B', background: '#334155', padding: '2px 6px', borderRadius: '8px', marginLeft: 'auto' }}>BETA</span>
    </motion.div>
    {[
      { title: 'Add Paneer Tikka to Starters', reason: 'High demand in your area — 89% of similar restaurants offer it', type: 'suggestion' },
      { title: 'Demand Forecast: Saturday Peak', reason: 'Expected 40% more footfall. Consider extra staff.', type: 'forecast' },
      { title: 'Smart Pricing: Dal Makhani', reason: 'Competitors average ₹240. Your price ₹220 is competitive.', type: 'pricing' },
    ].map((card, i) => (
      <motion.div key={i} variants={staggerItem} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', borderLeft: `3px solid ${card.type === 'suggestion' ? '#F97316' : card.type === 'forecast' ? '#3B82F6' : '#22C55E'}` }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#E2E8F0', marginBottom: '2px' }}>{card.title}</div>
        <div style={{ fontSize: '8px', color: '#94A3B8' }}>{card.reason}</div>
      </motion.div>
    ))}
  </motion.div>
);

// Map variant ID to mockup component
const mockupMap: Record<string, React.FC<{ active: boolean }>> = {
  'dashboard': DashboardMockup,
  'qr-menu': QRMenuMockup,
  'menu-builder': MenuBuilderMockup,
  'restaurant-profile': RestaurantProfileMockup,
  'analytics': AnalyticsMockup,
  'multi-branch': MultiBranchMockup,
  'customer-experience': CustomerExperienceMockup,
  'digital-presence': DigitalPresenceMockup,
  'growth': GrowthMockup,
  'ai-assistant': AIAssistantMockup,
};

/* ────────────────────────────────────────────────────────────
   SMART VARIANT ORDERING
   ──────────────────────────────────────────────────────────── */
const getInitialVariant = (): number => {
  try {
    const saved = localStorage.getItem('ros-hero-variant');
    const viewed: string[] = JSON.parse(localStorage.getItem('ros-hero-viewed') || '[]');

    if (saved) {
      const lastIdx = heroVariants.findIndex(v => v.id === saved);
      const unseen = heroVariants.filter(v => !viewed.includes(v.id));
      if (unseen.length > 0) {
        const pick = unseen[Math.floor(Math.random() * unseen.length)];
        return heroVariants.findIndex(v => v.id === pick.id);
      }
      // All seen — random but different from last
      let pick = Math.floor(Math.random() * heroVariants.length);
      while (pick === lastIdx && heroVariants.length > 1) {
        pick = Math.floor(Math.random() * heroVariants.length);
      }
      return pick;
    }
  } catch { /* localStorage unavailable */ }
  return Math.floor(Math.random() * heroVariants.length);
};

/* ────────────────────────────────────────────────────────────
   HERO SECTION COMPONENT
   ──────────────────────────────────────────────────────────── */
export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeVariant, setActiveVariant] = useState(getInitialVariant);
  const [liveEventIndex, setLiveEventIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const pillsRef = useRef<HTMLDivElement>(null);

  const variant = heroVariants[activeVariant];
  const MockupComponent = mockupMap[variant.id];

  // Check prefers-reduced-motion
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Live event cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveEventIndex(prev => (prev + 1) % liveEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Persist variant to localStorage
  const handleVariantChange = useCallback((index: number) => {
    setActiveVariant(index);
    try {
      const v = heroVariants[index];
      localStorage.setItem('ros-hero-variant', v.id);
      const viewed: string[] = JSON.parse(localStorage.getItem('ros-hero-viewed') || '[]');
      if (!viewed.includes(v.id)) {
        viewed.push(v.id);
        localStorage.setItem('ros-hero-viewed', JSON.stringify(viewed));
      }
    } catch { /* localStorage unavailable */ }
  }, []);

  // 3D tilt on cursor (desktop ≥ 1024px)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReduced || window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
  }, [prefersReduced]);
  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  // Keyboard navigation for pills
  const handlePillKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % heroVariants.length;
      handleVariantChange(next);
      // Focus the next pill
      const pills = pillsRef.current?.querySelectorAll('[role="tab"]');
      (pills?.[next] as HTMLElement)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + heroVariants.length) % heroVariants.length;
      handleVariantChange(prev);
      const pills = pillsRef.current?.querySelectorAll('[role="tab"]');
      (pills?.[prev] as HTMLElement)?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleVariantChange(index);
    }
  }, [handleVariantChange]);

  // Transition config
  const transitionConfig = prefersReduced
    ? { duration: 0.01 }
    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <>
      <style>{`
        .hero-section-v2 {
          position: relative;
          padding: 32px 24px 48px 24px;
          background: #FFFFFF;
          overflow: hidden;
        }
        .hero-grid-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(249,115,22,0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(249,115,22,0.02) 1px, transparent 1px);
          z-index: 1;
          pointer-events: none;
        }
        .hero-spotlight-v2 {
          position: absolute;
          top: -20%; left: 50%;
          transform: translateX(-50%);
          width: 800px; height: 500px;
          background: radial-gradient(circle, rgba(249,115,22,0.06) 0%, rgba(255,255,255,0) 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 2;
        }
        .hero-glow-v2-1 {
          position: absolute;
          top: -10%; right: -5%;
          width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, rgba(255,255,255,0) 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-glow-v2-2 {
          position: absolute;
          bottom: -10%; left: -10%;
          width: 40vw; height: 40vw;
          background: radial-gradient(circle, rgba(249,115,22,0.04) 0%, rgba(255,255,255,0) 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-text-container {
          min-height: 320px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .hero-headline-v2 {
          font-size: clamp(1.8rem, 1.5rem + 2.5vw, 3.2rem) !important;
          font-weight: 900 !important;
          letter-spacing: -2px !important;
          line-height: 1.08 !important;
          margin: 0 0 20px 0 !important;
          color: #0F172A !important;
          max-width: 540px;
          min-height: 100px;
        }
        .hero-btn-primary {
          background: #F97316 !important;
          border-color: #F97316 !important;
          height: 54px !important;
          padding: 0 36px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          box-shadow: 0 8px 24px rgba(249,115,22,0.25) !important;
          transition: all 0.3s !important;
          position: relative;
          overflow: hidden;
        }
        .hero-btn-primary::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .hero-btn-primary:hover::after {
          left: 100%;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 30px rgba(249,115,22,0.35) !important;
        }
        .hero-btn-secondary {
          height: 54px !important;
          padding: 0 36px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          border-color: #CBD5E1 !important;
          color: #475569 !important;
          transition: all 0.3s !important;
        }
        .hero-btn-secondary:hover {
          background: #F8FAFC !important;
          transform: translateY(-2px) !important;
        }
        .hero-pill {
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          font-weight: 600;
          font-size: 12px;
          color: #475569;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          outline: none;
          user-select: none;
        }
        .hero-pill:hover {
          border-color: #F97316;
          color: #F97316;
        }
        .hero-pill:focus-visible {
          outline: 2px solid #F97316;
          outline-offset: 2px;
        }
        .hero-pill.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }
        .hero-pills-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 0;
        }
        .hero-pills-container::-webkit-scrollbar { display: none; }
        .hero-pills-container > * { scroll-snap-align: start; }
        .hero-laptop-shell {
          position: relative;
          width: 100%;
          height: 280px;
          background: #0F172A;
          border-radius: 14px;
          border: 3px solid #1E293B;
          box-shadow: 0 25px 50px rgba(15,23,42,0.15);
          overflow: hidden;
          transition: transform 0.15s ease-out;
        }
        .hero-laptop-titlebar {
          height: 28px;
          background: #1E293B;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .hero-laptop-dot {
          width: 7px; height: 7px; border-radius: 50%;
        }
        .hero-live-event {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .hero-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22C55E;
          animation: hero-pulse 2s infinite;
        }
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes hero-mockup-glow {
          0%, 100% { box-shadow: 0 25px 50px rgba(15,23,42,0.15); }
          50% { box-shadow: 0 25px 50px rgba(249,115,22,0.08), 0 0 80px rgba(249,115,22,0.04); }
        }
        .hero-laptop-shell { animation: hero-mockup-glow 4s ease-in-out infinite; }
        .hero-badge-chip {
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          color: #EA580C;
          padding: 5px 12px;
          border-radius: 18px;
          font-size: 11.5px;
          font-weight: 650;
          white-space: nowrap;
        }
        .hero-trust-chip {
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .hero-trust-check {
          color: #22C55E;
          font-weight: 700;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-section-v2 *,
          .hero-section-v2 *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        @media (max-width: 768px) {
          .hero-headline-v2 { min-height: auto !important; }
          .hero-text-container { min-height: auto !important; }
        }
      `}</style>

      <section className="hero-section-v2">
        {/* Background layers */}
        <div className="hero-grid-bg" />
        <div className="hero-spotlight-v2" />
        <div className="hero-glow-v2-1" />
        <div className="hero-glow-v2-2" />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Row gutter={[48, 32]} align="middle">
            {/* ─── Left Column: Text ─── */}
            <Col xs={24} lg={11}>
              <div className="hero-text-container">
                {/* Static badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFEDD5', padding: '6px 14px', borderRadius: '30px', marginBottom: '20px', border: '1px solid #FFD8A8', width: 'fit-content' }}>
                  <img src={logoIcon} alt="Icon" style={{ height: '14px' }} />
                  <span style={{ color: '#C2410C', fontWeight: 750, fontSize: '11px', letterSpacing: '0.5px' }}>RELAUNCHED 2.0</span>
                </div>

                {/* Animated content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={transitionConfig}
                  >
                    <Title level={1} className="hero-headline-v2">
                      {variant.headline}
                    </Title>
                    <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, marginBottom: '24px', fontWeight: 400, maxWidth: '500px' }}>
                      {variant.subtext}
                    </Paragraph>
                    <Flex gap={8} wrap="wrap" style={{ marginBottom: '24px' }}>
                      {variant.badges.slice(0, 6).map(badge => (
                        <span key={badge} className="hero-badge-chip">✓ {badge}</span>
                      ))}
                    </Flex>
                  </motion.div>
                </AnimatePresence>

                {/* Static CTA buttons */}
                <Flex gap={16} wrap="wrap">
                  <Button type="primary" size="large" className="hero-btn-primary" onClick={() => navigate('/signup')}>
                    Start Free Now
                  </Button>
                  <Button type="default" size="large" className="hero-btn-secondary" onClick={() => navigate('/contact')}>
                    Book Demo
                  </Button>
                </Flex>

                {/* Contextual CTA helper */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`helper-${variant.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ marginTop: '10px' }}
                  >
                    <Text style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500, fontStyle: 'italic' }}>{variant.ctaHelper}</Text>
                  </motion.div>
                </AnimatePresence>

                {/* Phase 10: Trust chips */}
                <Flex gap={16} wrap="wrap" style={{ marginTop: '20px' }}>
                  {[
                    'Zero Commission',
                    'Setup in 5 Minutes',
                    'Unlimited QR Menus',
                    'Mobile Friendly',
                    'Cloud Hosted',
                    'Instant Menu Updates',
                    'Made for Indian Restaurants 🇮🇳',
                  ].map(chip => (
                    <span key={chip} className="hero-trust-chip">
                      <span className="hero-trust-check">✓</span> {chip}
                    </span>
                  ))}
                </Flex>
              </div>
            </Col>

            {/* ─── Right Column: Mockup ─── */}
            <Col xs={24} lg={13}>
              <div
                style={{ position: 'relative', height: '420px' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Laptop shell */}
                <div
                  className="hero-laptop-shell"
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  }}
                >
                  {/* Titlebar */}
                  <div className="hero-laptop-titlebar">
                    <span className="hero-laptop-dot" style={{ background: '#EF4444' }} />
                    <span className="hero-laptop-dot" style={{ background: '#F59E0B' }} />
                    <span className="hero-laptop-dot" style={{ background: '#10B981' }} />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`title-${variant.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ fontSize: '10px', color: '#64748B', marginLeft: '10px', fontWeight: 650 }}
                      >
                        Restaurant OS — {variant.tab}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Mockup content */}
                  <div style={{ height: 'calc(100% - 28px)', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`mockup-${variant.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ height: '100%', color: '#E2E8F0' }}
                      >
                        {MockupComponent && <MockupComponent active={true} />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Floating cards */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cards-${variant.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {variant.floatingCards.map((card, i) => {
                      const positions = [
                        { top: '60px', left: '-20px', zIndex: 20 },
                        { top: '20px', right: '30px', zIndex: 20 },
                        { bottom: '100px', left: '-10px', zIndex: 20 },
                      ];
                      const pos = positions[i] || positions[0];
                      const floatDelay = i * 0.5;
                      return (
                        <motion.div
                          key={`${variant.id}-card-${i}`}
                          animate={prefersReduced ? {} : { y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                          transition={prefersReduced ? {} : { duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: floatDelay } as any}
                          style={{
                            position: 'absolute',
                            ...pos,
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '8px 14px',
                            boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ fontSize: '14px' }}>{card.icon}</span>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: card.value ? '#0F172A' : '#475569' }}>{card.label}</span>
                            {card.value && <span style={{ display: 'block', fontSize: '14px', fontWeight: 900, color: '#F97316' }}>{card.value}</span>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* Live product event indicator */}
                <div style={{ position: 'absolute', bottom: '16px', right: '20px', zIndex: 30 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={liveEventIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="hero-live-event"
                    >
                      <span className="hero-live-dot" />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                        {liveEvents[liveEventIndex].icon} {liveEvents[liveEventIndex].text}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Col>
          </Row>

          {/* ─── Pill Navigation ─── */}
          <div
            ref={pillsRef}
            className="hero-pills-container"
            role="tablist"
            aria-label="Hero variant navigation"
            style={{ marginTop: '40px' }}
          >
            {heroVariants.map((v, i) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={i === activeVariant}
                tabIndex={i === activeVariant ? 0 : -1}
                className={`hero-pill ${i === activeVariant ? 'active' : ''}`}
                onClick={() => handleVariantChange(i)}
                onKeyDown={(e) => handlePillKeyDown(e, i)}
              >
                {v.tabIcon}
                {v.tab}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

/* ────────────────────────────────────────────────────────────
   SOCIAL PROOF METRICS STRIP (Phase 11)
   ──────────────────────────────────────────────────────────── */
export const SocialProofMetrics: React.FC = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  /* NOTE: These are demo/aspirational metrics for the early launch phase.
     Replace with real production numbers once available. */
  const metrics = [
    { target: 1000, suffix: '+', label: 'Restaurants Ready', prefix: '' },
    { target: 50000, suffix: '+', label: 'QR Scans Served', prefix: '' },
    { target: 99.9, suffix: '%', label: 'Cloud Availability', prefix: '', isDecimal: true },
    { target: 0, suffix: '', label: 'Accessible Anywhere', prefix: '24×7', isStatic: true },
  ];

  return (
    <section ref={ref} style={{ padding: '48px 24px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Row gutter={[32, 32]} justify="center" align="middle">
          {metrics.map((m, i) => (
            <Col xs={12} sm={6} key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', lineHeight: 1.2 }}>
                {m.isStatic ? (
                  m.prefix
                ) : m.isDecimal ? (
                  <>{inView ? '99.9' : '0'}{m.suffix}</>
                ) : (
                  <MetricCounter target={m.target} active={inView} suffix={m.suffix} prefix={m.prefix} />
                )}
              </div>
              <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>{m.label}</div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

// Scroll-triggered counter
const MetricCounter: React.FC<{ target: number; active: boolean; suffix?: string; prefix?: string }> = ({ target, active, suffix = '', prefix = '' }) => {
  const count = useCountUp(target, active, 1800);
  return <>{prefix}{count.toLocaleString('en-IN')}{suffix}</>;
};

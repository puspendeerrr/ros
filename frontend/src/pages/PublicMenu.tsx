import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flex, Input, Typography, Card, Empty, Result, Button, Select, message } from 'antd';
import {
  SearchOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  PhoneOutlined,
  CompassOutlined,
  ShareAltOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { menuService } from '../services/menu.service.js';
import logoIcon from '../assets/logo-icon.png';
import { FoodVegIndicator } from '../components/FoodVegIndicator';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Blur placeholder SVG / Fork and Knife
const ForkKnifePlaceholder: React.FC = () => (
  <div style={{
    width: '80px',
    height: '80px',
    background: '#FFF7ED',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFEDD5',
    border: '1px solid #FFEDD5',
    flexShrink: 0
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8v12M15 11h6M12 3v17M12 3c-1.2 0-2 .8-2 2v4c0 1.2.8 2 2 2M12 7H9M6 3v8a4 4 0 0 0 4 4v5" />
    </svg>
  </div>
);

// Premium Shimmer skeleton card loader
const MenuCardSkeleton: React.FC = () => (
  <div style={{
    padding: '16px 0',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    gap: '16px',
    alignItems: 'start'
  }}>
    <div style={{ flex: 1 }}>
      <div className="shimmer-block" style={{ width: '40%', height: '16px', borderRadius: '4px', marginBottom: '8px' }} />
      <div className="shimmer-block" style={{ width: '80%', height: '12px', borderRadius: '4px', marginBottom: '6px' }} />
      <div className="shimmer-block" style={{ width: '20%', height: '14px', borderRadius: '4px' }} />
    </div>
    <div className="shimmer-block" style={{ width: '80px', height: '80px', borderRadius: '12px', flexShrink: 0 }} />
  </div>
);

export const PublicMenu: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom states for filters
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterNonVeg, setFilterNonVeg] = useState(false);
  const [filterBestseller, setFilterBestseller] = useState(false);
  const [sortBy, setSortBy] = useState<string>('default');

  // Favorites (Saved locally)
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch public menu data
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-menu', restaurantSlug],
    queryFn: () => menuService.getPublicMenu(restaurantSlug || ''),
    retry: false,
  });

  const restaurant = data?.data?.restaurant;
  const categories = data?.data?.categories || [];

  // Update Page Title and Meta Tags dynamically for SEO
  useEffect(() => {
    if (restaurant?.restaurantName) {
      document.title = `${restaurant.restaurantName} | Restaurant OS`;
    }
  }, [restaurant]);

  // Scrollspy & Back to Top behavior
  useEffect(() => {
    const handleScroll = () => {
      // 1. Toggle back-to-top button
      setShowBackToTop(window.scrollY > 300);

      // 2. Simple Scroll Spy logic
      const sections = document.querySelectorAll('.category-section');
      let currentActive = '';
      sections.forEach((section: any) => {
        const rect = section.getBoundingClientRect();
        // Trigger when section header is near the top
        if (rect.top <= 120) {
          currentActive = section.id.replace('cat-', '');
        }
      });
      if (currentActive) {
        setActiveCategory(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // Robust time parser: HH:mm, HH:mm:ss, h:mm AM/PM, h AM/PM
  const parseTimeToMinutes = (timeStr: string): number | null => {
    if (!timeStr) return null;
    const s = timeStr.trim();

    // Try 12-hour AM/PM format: "12 AM", "1:30 PM", "12:00 AM"
    const ampmMatch = s.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(AM|PM)$/i);
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10);
      const minutes = parseInt(ampmMatch[2] || '0', 10);
      const period = ampmMatch[4].toUpperCase();
      if (period === 'AM' && hours === 12) hours = 0;
      if (period === 'PM' && hours !== 12) hours += 12;
      return hours * 60 + minutes;
    }

    // Try 24-hour format: "10:00", "22:00", "13:30:00"
    const h24Match = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (h24Match) {
      const hours = parseInt(h24Match[1], 10);
      const minutes = parseInt(h24Match[2], 10);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return hours * 60 + minutes;
      }
    }

    return null;
  };

  // Convert HH:mm or AM/PM to display-friendly format
  const formatTimeDisplay = (timeStr?: string | null): string => {
    if (!timeStr) return '';
    const minutes = parseTimeToMinutes(timeStr);
    if (minutes === null) return timeStr;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // Open / Closed Calculation helper
  const checkIfOpen = (openTime?: string | null, closeTime?: string | null) => {
    if (!openTime || !closeTime) return true;
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const openMinutes = parseTimeToMinutes(openTime);
      const closeMinutes = parseTimeToMinutes(closeTime);
      if (openMinutes === null || closeMinutes === null) return true;

      if (closeMinutes < openMinutes) {
        // Overnight timing e.g. 10:00 PM to 4:00 AM
        return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
      }
      return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    } catch (e) {
      return true;
    }
  };

  const isOpen = checkIfOpen(restaurant?.openingTime, restaurant?.closingTime);

  // Address line construction
  const locationParts = restaurant ? [restaurant.address, restaurant.city, restaurant.state, restaurant.country].filter(Boolean) : [];
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Address not specified';

  // Toggle favorite helper
  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Share menu details using native Share API or copy-link fallback
  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: restaurant?.restaurantName || 'Digital Menu',
          text: `Checkout the digital menu of ${restaurant?.restaurantName || 'our restaurant'}!`,
          url: shareUrl,
          dialogTitle: 'Share Menu Link',
        });
      } catch (err) {
        console.log('Native share error:', err);
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant?.restaurantName || 'Digital Menu',
          text: `Checkout the digital menu of ${restaurant?.restaurantName || 'our restaurant'}!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Web share error:', err);
      }
    } else {
      // Copy fallback
      if (Capacitor.isNativePlatform()) {
        await Clipboard.write({ string: shareUrl });
      } else {
        navigator.clipboard.writeText(shareUrl);
      }
      message.success('Menu link copied to clipboard!');
    }
  };

  // Scroll to Category smoothly
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`cat-${categoryId}`);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
      setActiveCategory(categoryId);
    }
  };

  // Loading shimmer state
  if (isLoading) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '16px' }}>
        <div className="shimmer-block" style={{ height: '180px', borderRadius: '16px', marginBottom: '24px' }} />
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="shimmer-block" style={{ height: '100px', borderRadius: '16px', marginBottom: '24px' }} />
          <div className="shimmer-block" style={{ height: '48px', borderRadius: '12px', marginBottom: '32px' }} />
          {[1, 2, 3].map((idx) => (
            <div key={idx} style={{ marginBottom: '32px' }}>
              <div className="shimmer-block" style={{ height: '24px', width: '30%', borderRadius: '4px', marginBottom: '16px' }} />
              <MenuCardSkeleton />
              <MenuCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error / 404 / 403 handling
  if (error || !restaurant) {
    const errStatus = (error as any)?.response?.status;
    let title = 'Something went wrong';
    let subTitle = 'An error occurred while loading the menu. Please try again.';
    let status: '404' | '403' | '500' = '500';

    if (errStatus === 404) {
      title = 'Restaurant Not Found';
      subTitle = 'The requested restaurant does not exist or has been removed.';
      status = '404';
    } else if (errStatus === 403) {
      title = 'Access Denied';
      subTitle = 'This restaurant menu is currently unavailable.';
      status = '403';
    }

    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', background: '#F8FAFC', padding: '24px' }}>
        <Card style={{ maxWidth: '500px', width: '100%', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <Result
            status={status}
            title={title}
            subTitle={subTitle}
            extra={<Button type="primary" onClick={() => window.location.reload()} style={{ background: '#F97316', borderColor: '#F97316' }}>Retry</Button>}
          />
        </Card>
      </Flex>
    );
  }

  // Helper check for active categories
  const hasCategories = categories.length > 0;

  // Process items: filter + sort
  const getProcessedItems = (menuItems: any[]) => {
    let result = [...(menuItems || [])];

    // Search query matches
    if (searchQuery.trim()) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter Veg
    if (filterVeg) {
      result = result.filter((item) => item.isVeg);
    }

    // Filter Non-Veg
    if (filterNonVeg) {
      result = result.filter((item) => !item.isVeg);
    }

    // Filter Bestsellers
    if (filterBestseller) {
      result = result.filter((item) => item.isBestseller || item.price > 300); // UI Bestseller filter rule
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  };

  // Check if any processed items exist across all categories
  const hasAnyProcessedItems = categories.some((c: any) => getProcessedItems(c.menuItems).length > 0);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* 1. Shimmer / Global custom style injection */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-block {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .sticky-category-bar::-webkit-scrollbar {
          display: none;
        }
        .category-chip-active {
          background: #F97316 !important;
          color: #FFFFFF !important;
          border-color: #F97316 !important;
        }
        .filter-pill-active {
          background: #F97316 !important;
          color: #FFFFFF !important;
          border-color: #F97316 !important;
        }
        @media (max-width: 576px) {
          .public-restaurant-card-body {
            padding: 16px !important;
          }
        }
      `}</style>

      {/* 2. Top Navigation header */}
      <div 
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
        }}
      >
        <Flex align="center" gap={8}>
          <img src={logoIcon} alt="Logo" style={{ height: '24px', objectFit: 'contain' }} />
          <Text strong style={{ fontSize: '14px', color: '#0F172A', letterSpacing: '-0.5px' }}>Restaurant OS</Text>
        </Flex>
        <Button 
          type="text" 
          icon={<ShareAltOutlined style={{ fontSize: '18px', color: '#64748B' }} />} 
          onClick={handleShare}
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
      </div>

      {/* 3. Cover Background image */}
      <div 
        style={{
          height: '180px',
          backgroundImage: restaurant.coverImageUrl 
            ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${restaurant.coverImageUrl})`
            : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: '100%'
        }}
      />

      {/* 4. Core Container */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 12px 64px 12px', position: 'relative', marginTop: '-60px', zIndex: 10 }}>
        
        {/* Restaurant Profile Card */}
        <Card
          bordered={false}
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            marginBottom: '16px',
            background: '#FFFFFF'
          }}
          bodyStyle={{ padding: '24px 20px' }}
          className="public-restaurant-card-body"
        >
          <Flex align="start" gap={16}>
            {/* Logo */}
            {restaurant.logoUrl ? (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${restaurant.logoUrl}`}
                alt={restaurant.restaurantName}
                loading="lazy"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
            ) : (
              <div 
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  background: '#F97316',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  flexShrink: 0
                }}
              >
                <ShopOutlined />
              </div>
            )}

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800, color: '#0F172A', fontSize: '20px', letterSpacing: '-0.5px' }}>
                {restaurant.restaurantName}
              </Title>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                <EnvironmentOutlined style={{ marginRight: '4px', color: '#F97316' }} /> {locationStr}
              </Text>
              
              {/* Badges row */}
              <Flex gap={8} align="center" wrap="wrap">
                <span
                  style={{
                    background: isOpen ? '#ECFDF5' : '#FEF2F2',
                    color: isOpen ? '#059669' : '#DC2626',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {isOpen ? '🟢 Open Now' : '🔴 Closed'}
                </span>
                {(restaurant.openingTime && restaurant.closingTime) && (
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    ({formatTimeDisplay(restaurant.openingTime)} - {formatTimeDisplay(restaurant.closingTime)})
                  </Text>
                )}
              </Flex>
            </div>
          </Flex>

          {restaurant.description && (
            <Paragraph type="secondary" style={{ margin: '16px 0 0 0', fontSize: '13px', lineHeight: '1.5', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              {restaurant.description}
            </Paragraph>
          )}

          {/* Quick Action Contact Pills */}
          <Flex gap={8} wrap="wrap" style={{ marginTop: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
            {restaurant.phone && (
              <Button 
                type="default" 
                icon={<PhoneOutlined />} 
                href={`tel:${restaurant.phone}`}
                size="middle"
                style={{ borderRadius: '8px', flexGrow: 1 }}
              >
                Call
              </Button>
            )}
            {restaurant.googleMapsUrl && (
              <Button 
                type="default" 
                icon={<CompassOutlined />} 
                href={restaurant.googleMapsUrl}
                target="_blank"
                size="middle"
                style={{ borderRadius: '8px', flexGrow: 1 }}
              >
                Directions
              </Button>
            )}
          </Flex>
        </Card>

        {/* 5. Sticky Search & Combined Filters Area */}
        <Card
          bordered={false}
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(15,23,42,0.02)',
            marginBottom: '16px',
            position: 'sticky',
            top: '56px',
            zIndex: 90,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0'
          }}
          bodyStyle={{ padding: '12px' }}
        >
          <Flex vertical gap={8}>
            {/* Input Search */}
            <Input
              prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
              placeholder="Search dishes by name or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
              allowClear
              style={{
                borderRadius: '8px',
                height: '40px',
                border: '1px solid #E2E8F0'
              }}
            />

            {/* Filter tags pills */}
            <Flex gap={6} wrap="wrap" align="center">
              <button
                onClick={() => { setFilterVeg(!filterVeg); setFilterNonVeg(false); }}
                className={filterVeg ? 'filter-pill-active' : ''}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🌱 Veg
              </button>
              <button
                onClick={() => { setFilterNonVeg(!filterNonVeg); setFilterVeg(false); }}
                className={filterNonVeg ? 'filter-pill-active' : ''}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🔴 Non-Veg
              </button>
              <button
                onClick={() => setFilterBestseller(!filterBestseller)}
                className={filterBestseller ? 'filter-pill-active' : ''}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ⭐ Bestseller
              </button>
              
              {/* Sort Dropdown Selector */}
              <Select
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                bordered={false}
                style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600 }}
                dropdownStyle={{ zIndex: 1000 }}
              >
                <Option value="default">Sort: Default</Option>
                <Option value="price-low">Price: Low to High</Option>
                <Option value="price-high">Price: High to Low</Option>
              </Select>
            </Flex>
          </Flex>
        </Card>

        {/* 6. Sticky Category navigation Chips */}
        {hasCategories && (
          <div 
            className="sticky-category-bar"
            style={{
              position: 'sticky',
              top: '172px',
              zIndex: 89,
              background: '#F8FAFC',
              padding: '8px 0',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              display: 'flex',
              gap: '8px',
              marginBottom: '24px'
            }}
          >
            {categories.map((category: any) => {
              const isActive = activeCategory === category.id;
              const hasMatches = getProcessedItems(category.menuItems).length > 0;

              // Don't show category chip if filter excludes all items inside it
              if (!hasMatches) return null;

              return (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={isActive ? 'category-chip-active' : ''}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        )}

        {/* 7. Menu Categories List */}
        {!hasCategories || !hasAnyProcessedItems ? (
          <Card bordered={false} style={{ borderRadius: '16px', textAlign: 'center', padding: '40px 0', border: '1px solid #E2E8F0' }}>
            <Empty
              description={
                <Flex vertical gap={8} align="center">
                  <Text strong style={{ color: '#475569', fontSize: '15px' }}>No dishes found</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Try adjusting your search query or filters.</Text>
                </Flex>
              }
            />
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {categories.map((category: any) => {
              const categoryItems = getProcessedItems(category.menuItems);

              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id} id={`cat-${category.id}`} className="category-section" style={{ scrollMarginTop: '180px' }}>
                  {/* Category Title */}
                  <Title
                    level={4}
                    style={{
                      borderBottom: '2px solid #FED7AA',
                      paddingBottom: '8px',
                      color: '#0F172A',
                      marginBottom: '16px',
                      fontWeight: 800,
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {category.name}
                  </Title>

                  {/* Item Cards inside Category */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {categoryItems.map((item: any) => {
                      const isFav = favorites.includes(item.id);
                      // Custom bestseller logic based on rating simulation
                      const isBest = item.isBestseller || item.price > 350;

                      return (
                        <Card
                          key={item.id}
                          bordered={false}
                          style={{
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 2px 8px rgba(15,23,42,0.01)',
                            overflow: 'hidden'
                          }}
                          bodyStyle={{ padding: '16px' }}
                        >
                          <Flex gap={16} align="start">
                            
                            {/* Main Details */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Flex align="center" gap={8} wrap="wrap" style={{ marginBottom: '6px' }}>
                                <FoodVegIndicator isVeg={item.isVeg} />
                                {isBest && (
                                  <span style={{
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: '#FFF7ED',
                                    color: '#EA580C',
                                    border: '1px solid #FFEDD5'
                                  }}>
                                    ⭐ Bestseller
                                  </span>
                                )}
                              </Flex>

                              <Title level={5} style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#1E293B', fontSize: '15px' }}>
                                {item.name}
                              </Title>

                              {item.description && (
                                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ margin: '0 0 8px 0', fontSize: '12px', lineHeight: '1.4' }}>
                                  {item.description}
                                </Paragraph>
                              )}

                              {/* Price tags row */}
                              <Flex align="center" gap={8}>
                                <Text strong style={{ color: '#F97316', fontSize: '16px', fontWeight: 700 }}>
                                  ₹{Number(item.price).toFixed(2)}
                                </Text>
                              </Flex>

                              {/* Prep Time Tag */}
                              <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '6px' }}>
                                <ClockCircleOutlined style={{ marginRight: '4px' }} /> Prep time: 15 mins
                              </Text>
                            </div>

                            {/* Image Visualizer */}
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              {item.imageUrl ? (
                                <img
                                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.imageUrl}`}
                                  alt={item.name}
                                  style={{
                                    width: '88px',
                                    height: '88px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                    border: '1px solid #F1F5F9'
                                  }}
                                  loading="lazy"
                                />
                              ) : (
                                <ForkKnifePlaceholder />
                              )}
                              
                              {/* Floating Favorite heart marker (UI action only) */}
                              <button
                                onClick={() => toggleFavorite(item.id)}
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  background: 'rgba(255, 255, 255, 0.9)',
                                  border: 'none',
                                  outline: 'none',
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  cursor: 'pointer',
                                  color: isFav ? '#EF4444' : '#94A3B8'
                                }}
                              >
                                {isFav ? '❤️' : '🤍'}
                              </button>
                            </div>

                          </Flex>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 8. Sticky Back-to-Top Floating Trigger */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '44px',
            height: '44px',
            borderRadius: '22px',
            background: '#F97316',
            color: '#FFFFFF',
            border: 'none',
            outline: 'none',
            boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            zIndex: 100,
            cursor: 'pointer'
          }}
        >
          <ArrowUpOutlined />
        </button>
      )}

      {/* 9. Branded Footer */}
      <div 
        style={{
          background: '#0F172A',
          color: '#94A3B8',
          padding: '40px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <Title level={4} style={{ color: '#F8FAFC', margin: '0 0 6px 0', fontWeight: 800 }}>
              {restaurant.restaurantName}
            </Title>
            <Text style={{ color: '#64748B', fontSize: '13px' }}>
              {locationStr}
            </Text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <Flex align="center" gap={8}>
              <ClockCircleOutlined />
              <span>Hours: {formatTimeDisplay(restaurant.openingTime) || '10:00 AM'} - {formatTimeDisplay(restaurant.closingTime) || '11:00 PM'}</span>
            </Flex>
            {restaurant.phone && (
              <Flex align="center" gap={8}>
                <PhoneOutlined />
                <span>Contact: {restaurant.phone}</span>
              </Flex>
            )}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'center', fontSize: '12px' }}>
            <Paragraph style={{ color: '#475569', margin: '0 0 4px 0' }}>
              Powered by <a href="https://ros.algorithyum.in" target="_blank" rel="noopener noreferrer" style={{ color: '#F97316', fontWeight: 600 }}>Restaurant OS</a>
            </Paragraph>
            <Paragraph style={{ color: '#334155', margin: 0 }}>
              Instantly create commission-free interactive QR Menus.
            </Paragraph>
          </div>

        </div>
      </div>

    </div>
  );
};

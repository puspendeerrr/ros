import React, { useState, useEffect } from 'react';
import { Flex, Input, Typography, Card, Empty, Button, Select, message } from 'antd';
import {
  SearchOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  CompassOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowUpOutlined,
  EnvironmentOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { getFullImageUrl } from '../utils/image';
import { FoodVegIndicator } from '../components/FoodVegIndicator';
import { getThemeStyles } from './PublicMenu';
import logoIcon from '../assets/logo-icon.png';
import { useNetworkStatus } from '../pwa/useNetworkStatus';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Blur placeholder SVG / Fork and Knife
const ForkKnifePlaceholder: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <div style={{
    width: `${size}px`,
    height: `${size}px`,
    background: '#FFF7ED',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFEDD5',
    border: '1px solid #FFEDD5',
    flexShrink: 0
  }}>
    <svg width={Math.round(size * 0.3)} height={Math.round(size * 0.3)} viewBox="0 0 24 24" fill="none" stroke="var(--accent-color, #F97316)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8v12M15 11h6M12 3v17M12 3c-1.2 0-2 .8-2 2v4c0 1.2.8 2 2 2M12 7H9M6 3v8a4 4 0 0 0 4 4v5" />
    </svg>
  </div>
);

interface PublicMenuContentProps {
  restaurant: any;
  categories: any[];
  activeThemeConfig: any;
  previewMode?: boolean;
}

export const PublicMenuContent: React.FC<PublicMenuContentProps> = ({
  restaurant,
  categories,
  activeThemeConfig,
  previewMode = false,
}) => {
  const { isOnline } = useNetworkStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterNonVeg, setFilterNonVeg] = useState(false);
  const [filterBestseller, setFilterBestseller] = useState(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Update Page Title dynamically for SEO if not in preview mode
  useEffect(() => {
    if (!previewMode && restaurant?.restaurantName) {
      document.title = `${restaurant.restaurantName} | Restaurant OS`;
    }
  }, [restaurant, previewMode]);

  // Scrollspy & Back to Top behavior
  useEffect(() => {
    if (previewMode) return;

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      const sections = document.querySelectorAll('.category-section');
      let currentActive = '';
      sections.forEach((section: any) => {
        const rect = section.getBoundingClientRect();
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
  }, [categories, previewMode]);

  const parseTimeToMinutes = (timeStr: string): number | null => {
    if (!timeStr) return null;
    const s = timeStr.trim();

    const ampmMatch = s.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(AM|PM)$/i);
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10);
      const minutes = parseInt(ampmMatch[2] || '0', 10);
      const period = ampmMatch[4].toUpperCase();
      if (period === 'AM' && hours === 12) hours = 0;
      if (period === 'PM' && hours !== 12) hours += 12;
      return hours * 60 + minutes;
    }

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

  const checkIfOpen = (openTime?: string | null, closeTime?: string | null) => {
    if (!openTime || !closeTime) return true;
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const openMinutes = parseTimeToMinutes(openTime);
      const closeMinutes = parseTimeToMinutes(closeTime);
      if (openMinutes === null || closeMinutes === null) return true;

      if (closeMinutes < openMinutes) {
        return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
      }
      return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    } catch (e) {
      return true;
    }
  };

  const isOpen = checkIfOpen(restaurant?.openingTime, restaurant?.closingTime);

  const locationParts = restaurant ? [restaurant.address, restaurant.city, restaurant.state, restaurant.country].filter(Boolean) : [];
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Address not specified';

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleShare = async () => {
    if (previewMode) {
      message.info('Sharing is disabled in Preview mode');
      return;
    }
    const shareUrl = window.location.href;
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: restaurant?.restaurantName || 'Digital Menu',
          text: `Checkout the digital menu of ${restaurant?.restaurantName || 'our restaurant'}!`,
          url: shareUrl,
          dialogTitle: 'Share Menu',
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await Clipboard.write({ url: shareUrl });
        message.success('Menu link copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    if (previewMode) {
      const elem = document.getElementById(`preview-cat-${catId}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    const elem = document.getElementById(`cat-${catId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getProcessedItems = (items: any[]) => {
    let result = [...(items || [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    if (filterVeg) {
      result = result.filter((item) => item.isVeg);
    }
    if (filterNonVeg) {
      result = result.filter((item) => !item.isVeg);
    }

    if (filterBestseller) {
      result = result.filter((item) => item.isBestseller || item.price > 300);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  };

  const hasCategories = categories && categories.length > 0;
  const hasAnyProcessedItems = categories.some((c: any) => getProcessedItems(c.menuItems).length > 0);

  return (
    <div 
      className="public-menu-theme-container" 
      style={{
        ...getThemeStyles(activeThemeConfig),
        width: '100%',
        minHeight: '100%',
        position: 'relative',
        overflowY: 'auto'
      }}
    >
      <style>{`
        .public-menu-theme-container {
          color: var(--text-color) !important;
        }
        .public-menu-theme-container .ant-typography, 
        .public-menu-theme-container h1, 
        .public-menu-theme-container h2, 
        .public-menu-theme-container h3, 
        .public-menu-theme-container h4, 
        .public-menu-theme-container h5, 
        .public-menu-theme-container span {
          color: var(--text-color) !important;
        }
        .public-menu-theme-container .ant-card {
          background: var(--card-color) !important;
          border-radius: var(--card-radius) !important;
          box-shadow: var(--box-shadow) !important;
          border: 1px solid rgba(15, 23, 42, 0.06) !important;
          transition: var(--transition-style);
        }
        .public-menu-theme-container .ant-btn {
          border-radius: var(--button-radius) !important;
          transition: var(--transition-style);
        }
        .public-menu-theme-container .ant-input-wrapper,
        .public-menu-theme-container .ant-input-affix-wrapper {
          border-radius: var(--button-radius) !important;
        }
        .sticky-category-bar::-webkit-scrollbar,
        .filter-pills-row::-webkit-scrollbar {
          display: none;
        }
        .sticky-category-bar,
        .filter-pills-row {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .category-chip-active {
          background: var(--accent-color, #F97316) !important;
          color: #FFFFFF !important;
          border-color: var(--accent-color, #F97316) !important;
        }
        .filter-pill-active {
          background: var(--accent-color, #F97316) !important;
          color: #FFFFFF !important;
          border-color: var(--accent-color, #F97316) !important;
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
          background: 'var(--card-color, #FFFFFF)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
        }}
      >
        <Flex align="center" gap={8}>
          <img src={logoIcon} alt="Logo" style={{ height: '24px', objectFit: 'contain' }} />
          <Text strong style={{ fontSize: '14px', color: 'var(--text-color, #0F172A)', letterSpacing: '-0.5px' }}>Restaurant OS</Text>
        </Flex>
        <Button 
          type="text" 
          icon={<ShareAltOutlined style={{ fontSize: '18px', color: 'var(--secondary-color, #64748B)' }} />} 
          onClick={handleShare}
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
      </div>

      {/* 3. Cover Background image */}
      <div 
        style={{
          height: activeThemeConfig.bannerStyle === 'large' ? '240px' : '140px',
          backgroundImage: restaurant?.coverImageUrl 
            ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${getFullImageUrl(restaurant.coverImageUrl)})`
            : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: '100%',
          transition: 'var(--transition-style)'
        }}
      />

      {/* 4. Core Container */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 12px 64px 12px', position: 'relative', marginTop: '-50px', zIndex: 10 }}>
        
        {!isOnline && !previewMode && (
          <div
            style={{
              background: '#FFEFE6',
              color: '#EA580C',
              border: '1px solid #FFD8C2',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F97316', animation: 'pulseOffline 2s infinite' }} />
            <style>{`
              @keyframes pulseOffline {
                0% { opacity: 0.3; }
                50% { opacity: 1; }
                100% { opacity: 0.3; }
              }
            `}</style>
            <span>Viewing Cached Menu. Reconnect to receive latest updates.</span>
          </div>
        )}

        {/* Restaurant Profile Card */}
        <Card
          bordered={false}
          style={{
            borderRadius: 'var(--card-radius, 16px)',
            boxShadow: 'var(--box-shadow)',
            marginBottom: '16px',
            background: 'var(--card-color, #FFFFFF)'
          }}
          bodyStyle={{ padding: '24px 20px' }}
          className="public-restaurant-card-body"
        >
          <Flex align="start" gap={16} vertical={activeThemeConfig.headerStyle === 'centered'}>
            {/* Logo */}
            {restaurant?.logoUrl ? (
              <img
                src={getFullImageUrl(restaurant.logoUrl)}
                alt={restaurant?.restaurantName}
                loading="lazy"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: activeThemeConfig.logoStyle === 'circle' ? '50%' : activeThemeConfig.logoStyle === 'rounded-square' ? '12px' : '0px',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  objectFit: 'cover',
                  flexShrink: 0,
                  margin: activeThemeConfig.headerStyle === 'centered' ? '0 auto' : '0'
                }}
              />
            ) : (
              <div 
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: activeThemeConfig.logoStyle === 'circle' ? '50%' : activeThemeConfig.logoStyle === 'rounded-square' ? '12px' : '0px',
                  background: 'var(--accent-color, #F97316)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  flexShrink: 0,
                  margin: activeThemeConfig.headerStyle === 'centered' ? '0 auto' : '0'
                }}
              >
                <ShopOutlined />
              </div>
            )}

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, textAlign: activeThemeConfig.headerStyle === 'centered' ? 'center' : 'left' }}>
              <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800, color: 'var(--text-color, #0F172A)', fontSize: '20px', letterSpacing: '-0.5px' }}>
                {restaurant?.restaurantName || 'Restaurant Name'}
              </Title>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                <EnvironmentOutlined style={{ marginRight: '4px', color: 'var(--accent-color, #F97316)' }} /> {locationStr}
              </Text>
              
              {/* Badges row */}
              <Flex gap={8} align="center" wrap="wrap" justify={activeThemeConfig.headerStyle === 'centered' ? 'center' : 'start'}>
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
                {(restaurant?.openingTime && restaurant?.closingTime) && (
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    ({formatTimeDisplay(restaurant.openingTime)} - {formatTimeDisplay(restaurant.closingTime)})
                  </Text>
                )}
              </Flex>
            </div>
          </Flex>

          {restaurant?.description && (
            <Paragraph type="secondary" style={{ margin: '16px 0 0 0', fontSize: '13px', lineHeight: '1.5', borderTop: '1px solid rgba(15, 23, 42, 0.06)', paddingTop: '12px', textAlign: activeThemeConfig.headerStyle === 'centered' ? 'center' : 'left' }}>
              {restaurant.description}
            </Paragraph>
          )}

          {/* Quick Action Contact Pills */}
          <Flex gap={8} wrap="wrap" style={{ marginTop: '16px', borderTop: '1px solid rgba(15, 23, 42, 0.06)', paddingTop: '16px' }}>
            {restaurant?.phone && (
              <Button 
                type="default" 
                icon={<PhoneOutlined />} 
                href={previewMode ? undefined : `tel:${restaurant.phone}`}
                size="middle"
                style={{ borderRadius: 'var(--button-radius, 8px)', flexGrow: 1 }}
              >
                Call
              </Button>
            )}
            {restaurant?.googleMapsUrl && (
              <Button 
                type="default" 
                icon={<CompassOutlined />} 
                href={previewMode ? undefined : restaurant.googleMapsUrl}
                target="_blank"
                size="middle"
                style={{ borderRadius: 'var(--button-radius, 8px)', flexGrow: 1 }}
              >
                Directions
              </Button>
            )}
          </Flex>
        </Card>

        {/* 5. Sticky Search, Filters & Category Header Wrapper */}
        <div
          className="sticky-header-container"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 90,
            background: 'var(--background-color, #F8FAFC)',
            paddingTop: '4px',
            paddingBottom: '8px',
            marginBottom: '16px'
          }}
        >
          <Card
            bordered={false}
            style={{
              borderRadius: 'var(--card-radius, 16px)',
              boxShadow: 'var(--box-shadow)',
              marginBottom: '8px',
              background: 'var(--card-color, #FFFFFF)',
              border: '1px solid rgba(15, 23, 42, 0.06)'
            }}
            bodyStyle={{ padding: '12px' }}
          >
            <Flex vertical gap={8}>
              <Input
                prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
                placeholder="Search dishes by name or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="large"
                allowClear
                style={{
                  borderRadius: 'var(--button-radius, 8px)',
                  height: '40px',
                  border: '1px solid rgba(15, 23, 42, 0.08)'
                }}
              />

              <div 
                className="filter-pills-row"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  overflowX: 'auto', 
                  whiteSpace: 'nowrap',
                  paddingBottom: '2px',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <button
                  onClick={() => { setFilterVeg(!filterVeg); setFilterNonVeg(false); }}
                  className={filterVeg ? 'filter-pill-active' : ''}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    background: filterVeg ? 'var(--accent-color, #F97316)' : 'var(--card-color, #FFFFFF)',
                    color: filterVeg ? '#FFFFFF' : 'var(--text-color, #475569)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
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
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    background: filterNonVeg ? 'var(--accent-color, #F97316)' : 'var(--card-color, #FFFFFF)',
                    color: filterNonVeg ? '#FFFFFF' : 'var(--text-color, #475569)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
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
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    background: filterBestseller ? 'var(--accent-color, #F97316)' : 'var(--card-color, #FFFFFF)',
                    color: filterBestseller ? '#FFFFFF' : 'var(--text-color, #475569)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  ⭐ Bestseller
                </button>
                
                <Select
                  value={sortBy}
                  onChange={(val) => setSortBy(val)}
                  bordered={false}
                  style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}
                  dropdownStyle={{ zIndex: 1000 }}
                >
                  <Option value="default">Sort: Default</Option>
                  <Option value="price-low">Price: Low to High</Option>
                  <Option value="price-high">Price: High to Low</Option>
                </Select>
              </div>
            </Flex>
          </Card>

          {/* 6. Sticky Category navigation Chips */}
          {hasCategories && (
            <div 
              className="sticky-category-bar"
              style={{
                background: 'var(--card-color, #FFFFFF)',
                borderRadius: 'var(--card-radius, 12px)',
                padding: '6px 8px',
                border: '1px solid rgba(15, 23, 42, 0.06)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                display: 'flex',
                gap: '8px',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {categories.map((category: any) => {
                const isActive = activeCategory === category.id;
                const hasMatches = getProcessedItems(category.menuItems).length > 0;

                if (!hasMatches) return null;

                const isUnderline = activeThemeConfig.categoryStyle === 'underline';
                const isCards = activeThemeConfig.categoryStyle === 'cards';
                const isPills = activeThemeConfig.categoryStyle === 'pills';
                
                let chipRadius = '20px';
                if (isPills) chipRadius = '9999px';
                else if (isUnderline) chipRadius = '0px';
                else if (isCards) chipRadius = '8px';

                const btnStyle = isActive
                  ? (isUnderline
                      ? { border: 'none', borderBottom: '3px solid var(--accent-color, #F97316)', background: 'transparent', color: 'var(--accent-color, #F97316)', borderRadius: '0px', padding: '8px 12px', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition-style)', flexShrink: 0 }
                      : { background: 'var(--accent-color, #F97316)', color: '#FFFFFF', border: '1px solid var(--accent-color, #F97316)', borderRadius: chipRadius, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-style)', flexShrink: 0 })
                  : (isUnderline
                      ? { border: 'none', background: 'transparent', color: 'var(--secondary-color, #64748B)', borderRadius: '0px', padding: '8px 12px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-style)', flexShrink: 0 }
                      : { background: 'var(--card-color, #FFFFFF)', color: 'var(--text-color, #475569)', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: chipRadius, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-style)', flexShrink: 0 });

                return (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    style={btnStyle}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. Menu Categories List */}
        {!hasCategories || !hasAnyProcessedItems ? (
          <Card bordered={false} style={{ borderRadius: 'var(--card-radius, 16px)', textAlign: 'center', padding: '40px 0' }}>
            <Empty
              description={
                <Flex vertical gap={8} align="center">
                  <Text strong style={{ color: 'var(--text-color, #475569)', fontSize: '15px' }}>No dishes found</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Try adjusting your search query or filters.</Text>
                </Flex>
              }
            />
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-spacing, 32px)' }}>
            {categories.map((category: any) => {
              const categoryItems = getProcessedItems(category.menuItems);

              if (categoryItems.length === 0) return null;

              return (
                <div 
                  key={category.id} 
                  id={previewMode ? `preview-cat-${category.id}` : `cat-${category.id}`} 
                  className="category-section" 
                  style={{ scrollMarginTop: '145px' }}
                >
                  {/* Category Title */}
                  <Title
                    level={4}
                    style={{
                      borderBottom: '2px solid var(--accent-color, #FED7AA)',
                      paddingBottom: '8px',
                      color: 'var(--text-color, #0F172A)',
                      marginBottom: '16px',
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                      textAlign: activeThemeConfig.headerStyle === 'centered' ? 'center' : 'left'
                    }}
                  >
                    {category.name}
                  </Title>

                  {/* Item Cards inside Category */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {categoryItems.map((item: any) => {
                      const isFav = favorites.includes(item.id);
                      const isBest = item.isBestseller || item.price > 350;

                      const isList = activeThemeConfig.itemCardStyle === 'list';
                      const isCompact = activeThemeConfig.itemCardStyle === 'compact';
                      const cardRadius = isList ? '0px' : 'var(--card-radius, 16px)';
                      const cardBorder = isList ? 'none' : '1px solid rgba(15, 23, 42, 0.06)';
                      const cardShadow = isList ? 'none' : 'var(--box-shadow)';
                      const cardBg = isList ? 'transparent' : 'var(--card-color, #FFFFFF)';
                      const cardBorderBottom = isList ? '1px solid rgba(15, 23, 42, 0.08)' : 'none';
                      const cardPadding = isCompact ? '8px' : '16px';

                      return (
                        <Card
                          key={item.id}
                          bordered={false}
                          style={{
                            borderRadius: cardRadius,
                            border: cardBorder,
                            borderBottom: cardBorderBottom,
                            boxShadow: cardShadow,
                            background: cardBg,
                            overflow: 'hidden'
                          }}
                          bodyStyle={{ padding: cardPadding }}
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
                                    background: 'rgba(255, 247, 237, 0.8)',
                                    color: 'var(--accent-color, #EA580C)',
                                    border: '1px solid rgba(255, 237, 213, 0.6)'
                                  }}>
                                    ⭐ Bestseller
                                  </span>
                                )}
                              </Flex>

                              <Title level={5} style={{ margin: '0 0 4px 0', fontWeight: 700, color: 'var(--text-color, #1E293B)', fontSize: '15px' }}>
                                {item.name}
                              </Title>

                              {item.description && (
                                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ margin: '0 0 8px 0', fontSize: '12px', lineHeight: '1.4' }}>
                                  {item.description}
                                </Paragraph>
                              )}

                              {/* Price tags row */}
                              <Flex align="center" gap={8}>
                                <Text strong style={{ color: 'var(--accent-color, #F97316)', fontSize: '16px', fontWeight: 700 }}>
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
                                  src={getFullImageUrl(item.imageUrl)}
                                  alt={item.name}
                                  style={{
                                    width: isCompact ? '64px' : '88px',
                                    height: isCompact ? '64px' : '88px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                    border: '1px solid rgba(15, 23, 42, 0.08)'
                                  }}
                                  loading="lazy"
                                />
                              ) : (
                                <ForkKnifePlaceholder size={isCompact ? 64 : 80} />
                              )}
                              
                              <button
                                onClick={() => toggleFavorite(item.id)}
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  right: '4px',
                                  background: 'rgba(255, 255, 255, 0.9)',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                  cursor: 'pointer'
                                }}
                              >
                                {isFav ? (
                                  <HeartFilled style={{ color: '#EF4444', fontSize: '14px' }} />
                                ) : (
                                  <HeartOutlined style={{ color: '#64748B', fontSize: '14px' }} />
                                )}
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

      {/* 8. Back to Top Button */}
      {showBackToTop && !previewMode && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--button-color, #0F172A)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            zIndex: 99
          }}
        >
          <ArrowUpOutlined style={{ fontSize: '16px' }} />
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
              {restaurant?.restaurantName || 'Restaurant Name'}
            </Title>
            <Text style={{ color: '#64748B', fontSize: '13px' }}>
              {locationStr}
            </Text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <Flex align="center" gap={8}>
              <ClockCircleOutlined />
              <span>Hours: {formatTimeDisplay(restaurant?.openingTime) || '10:00 AM'} - {formatTimeDisplay(restaurant?.closingTime) || '11:00 PM'}</span>
            </Flex>
            {restaurant?.phone && (
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

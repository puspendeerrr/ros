import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flex, Input, Typography, Card, List, Space, Empty, Spin, Result, Button } from 'antd';
import { SearchOutlined, ClockCircleOutlined, EnvironmentOutlined, ShopOutlined, PhoneOutlined, CompassOutlined } from '@ant-design/icons';
import { menuService } from '../services/menu.service.js';
import logo from '../assets/logo.png';
import logoIcon from '../assets/logo-icon.png';

const { Title, Text, Paragraph } = Typography;

// Fork and Knife placeholder SVG
const ForkKnifePlaceholder: React.FC = () => (
  <div style={{
    width: '72px',
    height: '72px',
    background: '#FFF7ED',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFEDD5',
    border: '1px solid #FFEDD5',
  }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8v12M15 11h6M12 3v17M12 3c-1.2 0-2 .8-2 2v4c0 1.2.8 2 2 2M12 7H9M6 3v8a4 4 0 0 0 4 4v5" />
    </svg>
  </div>
);

export const PublicMenu: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch public menu data
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-menu', restaurantSlug],
    queryFn: () => menuService.getPublicMenu(restaurantSlug || ''),
    retry: false, // Don't keep retrying if it's 404/403
  });

  const restaurant = data?.data?.restaurant;
  const categories = data?.data?.categories || [];

  // Update Page Title and Meta Tags dynamically for SEO
  useEffect(() => {
    if (restaurant?.restaurantName) {
      const name = restaurant.restaurantName;
      document.title = `${name} | Restaurant OS`;

      // Set meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `Explore the digital menu of ${name}. View available items, pricing and dietary options.`);

      // Set Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', `${name} - Digital Menu`);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', `Browse categories, prices, and available options for ${name} on Restaurant OS.`);
    }
  }, [restaurant]);

  // Loading indicator
  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <Spin size="large" tip="Loading menu..." />
      </Flex>
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
          />
        </Card>
      </Flex>
    );
  }

  // Address line construction
  const locationParts = [restaurant.address, restaurant.city, restaurant.state, restaurant.country].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Address not specified';

  // Check if there are any categories and available items to show
  const hasCategories = categories.length > 0;
  const hasItems = categories.some((c: any) => c.menuItems && c.menuItems.length > 0);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <style>{`
        .public-menu-banner {
          width: 100%;
          position: relative;
          background-position: center;
          background-size: cover;
          height: 320px;
        }
        .public-restaurant-logo {
          width: 90px;
          height: 90px;
          border-radius: 50% !important;
          border: 4px solid #FFFFFF;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        }
        @media (max-width: 991px) {
          .public-menu-banner {
            height: 260px;
          }
        }
        @media (max-width: 576px) {
          .public-menu-banner {
            height: 200px;
          }
          .public-restaurant-logo {
            width: 70px;
            height: 70px;
          }
          .public-restaurant-card .ant-card-body {
            padding: 20px 16px !important;
          }
        }
        @media (max-width: 576px) {
          .desktop-branding-logo-wrapper { display: none !important; }
          .mobile-branding-logo-wrapper { display: flex !important; }
        }
        @media (min-width: 577px) {
          .desktop-branding-logo-wrapper { display: flex !important; }
          .mobile-branding-logo-wrapper { display: none !important; }
        }
        @media (max-width: 480px) {
          .public-menu-list .ant-list-item {
            flex-direction: column-reverse !important;
            align-items: flex-start !important;
            gap: 12px;
          }
          .public-menu-list .ant-list-item-extra {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .public-menu-list .ant-list-item-meta {
            width: 100% !important;
          }
        }
      `}</style>
      
      {/* Minimal Branding Bar */}
      <div 
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
        }}
      >
        <a 
          href="https://ros.algorithyum.in" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px', 
            textDecoration: 'none',
            color: '#64748B',
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          {/* Desktop logo wrapper - Centers and clips whitespace of full logo */}
          <div 
            className="desktop-branding-logo-wrapper"
            style={{ 
              height: '32px', 
              width: '144px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src={logo} 
              alt="Restaurant OS" 
              style={{ 
                height: '140px', 
                objectFit: 'contain',
                flexShrink: 0,
                width: 'auto'
              }}
            />
          </div>
          {/* Mobile icon logo wrapper */}
          <div 
            className="mobile-branding-logo-wrapper"
            style={{ 
              height: '32px', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img 
              src={logoIcon} 
              alt="Restaurant OS" 
              style={{ 
                height: '32px', 
                objectFit: 'contain',
                flexShrink: 0,
                width: 'auto'
              }}
            />
          </div>
          <span style={{ height: '18px', width: '1px', background: '#E2E8F0' }} />
          <span>Powered by Restaurant OS</span>
        </a>
      </div>

      {/* Restaurant Header Banner */}
      <div 
        className="public-menu-banner"
        style={{
          backgroundImage: restaurant.coverImageUrl 
            ? `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.35)), url(${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${restaurant.coverImageUrl})`
            : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        }}
      >
        {/* Watermark logo overlay when no cover image exists */}
        {!restaurant.coverImageUrl && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.06,
            width: '320px',
            height: '80px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <img src={logo} alt="Restaurant OS Logo" style={{ height: '320px', objectFit: 'contain' }} />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 16px 64px 16px', position: 'relative', marginTop: '-80px', zIndex: 10 }}>
        {/* Restaurant Header Card */}
        <Card
          bordered={false}
          className="public-restaurant-card"
          style={{
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            marginBottom: '32px',
            background: '#FFFFFF'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <Flex align="start" gap={20} wrap="wrap">
            {restaurant.logoUrl ? (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${restaurant.logoUrl}`}
                alt={restaurant.restaurantName}
                className="public-restaurant-logo"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="public-restaurant-logo"
                style={{
                  background: '#F97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '28px',
                  fontWeight: 'bold'
                }}
              >
                <ShopOutlined />
              </div>
            )}
            
            <Flex vertical gap={6} style={{ flex: 1, minWidth: '240px' }}>
              <Title level={2} style={{ margin: '0 0 2px 0', fontWeight: 800, letterSpacing: '-0.8px', color: '#0F172A', fontSize: '26px' }}>
                {restaurant.restaurantName}
              </Title>
              <Flex gap={12} wrap="wrap" align="center">
                <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                  <EnvironmentOutlined style={{ marginRight: '4px', color: '#F97316' }} /> {locationStr}
                </Text>
                {restaurant.googleMapsUrl && (
                  <Button
                    type="link"
                    icon={<CompassOutlined />}
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: 0, height: 'auto', color: '#F97316', fontSize: '13px', fontWeight: 600 }}
                  >
                    Get Directions
                  </Button>
                )}
              </Flex>
              {restaurant.description && (
                <Paragraph style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>
                  {restaurant.description}
                </Paragraph>
              )}
            </Flex>
          </Flex>

          {/* Operating hours & phone pills */}
          <Flex gap={12} wrap="wrap" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            {(restaurant.openingTime || restaurant.closingTime) && (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: '#FFF7ED', 
                padding: '6px 14px', 
                borderRadius: '20px', 
                border: '1px solid #FFEDD5' 
              }}>
                <ClockCircleOutlined style={{ color: '#F97316', fontSize: '13px' }} />
                <Text style={{ fontSize: '12px', color: '#C2410C', fontWeight: 600 }}>
                  Open: {restaurant.openingTime || '10:00 AM'} - {restaurant.closingTime || '11:00 PM'}
                </Text>
              </div>
            )}
            {restaurant.phone && (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: '#F0FDF4', 
                padding: '6px 14px', 
                borderRadius: '20px', 
                border: '1px solid #DCFCE7' 
              }}>
                <PhoneOutlined style={{ color: '#16A34A', fontSize: '13px' }} />
                <Text style={{ fontSize: '12px', color: '#14532D', fontWeight: 600 }}>
                  Call: {restaurant.phone}
                </Text>
              </div>
            )}
          </Flex>
        </Card>

        {/* Search Filter */}
        <Input
          prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
          placeholder="Search food items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
          style={{
            height: '48px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(15,23,42,0.01)',
            marginBottom: '32px'
          }}
        />

        {/* Categories & Items List */}
        {!hasCategories || !hasItems ? (
          <Card bordered={false} style={{ borderRadius: '16px', textAlign: 'center', padding: '32px 0', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
            <Empty
              description={<Text strong style={{ color: '#64748B' }}>This restaurant hasn't published its menu yet.</Text>}
            />
          </Card>
        ) : (
          <Space direction="vertical" size={40} style={{ width: '100%' }}>
            {categories.map((category: any) => {
              // Filter items inside this category based on search query
              const filteredItems = (category.menuItems || []).filter((item: any) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={category.id}>
                  {/* Category Title */}
                  <Title
                    level={4}
                    style={{
                      borderBottom: '2px solid #FFF7ED',
                      paddingBottom: '8px',
                      color: '#0F172A',
                      marginBottom: '16px',
                      fontWeight: 800,
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {category.name}
                  </Title>

                  {/* Items list */}
                  <List
                    className="public-menu-list"
                    itemLayout="horizontal"
                    dataSource={filteredItems}
                    renderItem={(item: any) => (
                      <List.Item
                        style={{
                          background: '#FFFFFF',
                          padding: '16px 0',
                          borderBottom: '1px solid #F1F5F9',
                        }}
                        extra={
                          item.imageUrl ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.imageUrl}`}
                              alt={item.name}
                              style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '12px',
                                objectFit: 'cover',
                                border: '1px solid #F1F5F9',
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <ForkKnifePlaceholder />
                          )
                        }
                      >
                        <List.Item.Meta
                          title={
                            <Space align="center" size={8}>
                              <Text strong style={{ fontSize: '15px', color: '#1E293B', fontWeight: 700 }}>
                                {item.name}
                              </Text>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: item.isVeg ? '#F0FDF4' : '#FEF2F2',
                                color: item.isVeg ? '#16A34A' : '#DC2626',
                                border: item.isVeg ? '1px solid #BBF7D0' : '1px solid #FECACA'
                              }}>
                                {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                              </span>
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size={2} style={{ marginTop: '2px' }}>
                              <Text strong style={{ color: '#F97316', fontSize: '15px', fontWeight: 700 }}>
                                ₹{Number(item.price).toFixed(2)}
                              </Text>
                              {item.description && (
                                <Paragraph type="secondary" style={{ margin: 0, fontSize: '13px', lineHeight: '1.4' }}>
                                  {item.description}
                                </Paragraph>
                              )}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              );
            })}
          </Space>
        )}
      </div>

      {/* CTA Footer */}
      <div style={{ 
        background: '#F8FAFC', 
        borderTop: '1px solid #E2E8F0', 
        padding: '24px 16px', 
        textAlign: 'center', 
        marginTop: '48px' 
      }}>
        <Paragraph style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
          Powered by <a href="https://ros.algorithyum.in" target="_blank" rel="noopener noreferrer" style={{ color: '#F97316', fontWeight: 600 }}>Restaurant OS</a>
        </Paragraph>
        <Paragraph style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#94A3B8' }}>
          Build your own commission-free restaurant ordering system.
        </Paragraph>
        <Button
          type="primary"
          href="https://ros.algorithyum.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            background: '#F97316', 
            borderColor: '#F97316', 
            borderRadius: '8px', 
            fontSize: '12px', 
            fontWeight: 600,
            height: '36px'
          }}
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

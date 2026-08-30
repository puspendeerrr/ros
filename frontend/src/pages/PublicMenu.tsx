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
        @media (max-width: 576px) {
          .desktop-branding-logo { display: none !important; }
          .mobile-branding-logo { display: inline-block !important; }
        }
        @media (min-width: 577px) {
          .desktop-branding-logo { display: inline-block !important; }
          .mobile-branding-logo { display: none !important; }
        }
      `}</style>
      
      {/* Minimal Branding Bar */}
      <div 
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '8px 16px',
          textAlign: 'center',
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
            gap: '8px', 
            textDecoration: 'none',
            color: '#64748B',
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          <img 
            src={logo} 
            alt="Restaurant OS" 
            className="desktop-branding-logo"
            style={{ height: '14px', objectFit: 'contain' }}
          />
          <img 
            src={logoIcon} 
            alt="Restaurant OS" 
            className="mobile-branding-logo"
            style={{ height: '14px', objectFit: 'contain' }}
          />
          <span style={{ color: '#94A3B8' }}>|</span>
          <span>Powered by Restaurant OS</span>
        </a>
      </div>

      {/* Restaurant Header Banner */}
      <div style={{
        background: restaurant.coverImageUrl 
          ? `url(${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${restaurant.coverImageUrl}) center/cover`
          : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        height: '140px',
        width: '100%',
        position: 'relative'
      }}>
        {/* Transparent overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)'
        }} />
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 16px 64px 16px', position: 'relative', marginTop: '-48px', zIndex: 10 }}>
        {/* Restaurant Header Card */}
        <Card
          bordered={false}
          style={{
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
            marginBottom: '24px',
            background: '#FFFFFF'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          <Flex align="center" gap={16} style={{ marginBottom: '16px' }}>
            {restaurant.logoUrl ? (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${restaurant.logoUrl}`}
                alt={restaurant.restaurantName}
                style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #F1F5F9' }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: '#F97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                <ShopOutlined />
              </div>
            )}
            <div>
              <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800, letterSpacing: '-0.5px', color: '#0F172A' }}>
                {restaurant.restaurantName}
              </Title>
              <Flex gap={12} wrap="wrap" align="center">
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  <EnvironmentOutlined style={{ marginRight: '4px' }} /> {locationStr}
                </Text>
                {restaurant.googleMapsUrl && (
                  <Button
                    type="link"
                    icon={<CompassOutlined />}
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: 0, height: 'auto', color: '#F97316', fontSize: '13px' }}
                  >
                    Get Directions
                  </Button>
                )}
              </Flex>
            </div>
          </Flex>

          {restaurant.description && (
            <Paragraph style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>
              {restaurant.description}
            </Paragraph>
          )}

          {/* Operating hours & phone */}
          <Flex vertical gap={8} style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
            {(restaurant.openingTime || restaurant.closingTime) && (
              <Flex align="center" gap={8}>
                <ClockCircleOutlined style={{ color: '#F97316', fontSize: '13px' }} />
                <Text style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>
                  Hours: {restaurant.openingTime || '10:00 AM'} - {restaurant.closingTime || '11:00 PM'}
                </Text>
              </Flex>
            )}
            {restaurant.phone && (
              <Flex align="center" gap={8}>
                <PhoneOutlined style={{ color: '#F97316', fontSize: '13px' }} />
                <Text style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>
                  Phone: {restaurant.phone}
                </Text>
              </Flex>
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
          <Space direction="vertical" size={32} style={{ width: '100%' }}>
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

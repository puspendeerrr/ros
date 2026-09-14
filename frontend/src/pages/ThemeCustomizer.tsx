import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Button, Space, Spin, Segmented, Popconfirm, Typography } from 'antd';
import { 
  SaveOutlined, 
  UndoOutlined, 
  MobileOutlined, 
  TabletOutlined, 
  DesktopOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useTheme } from '../features/theme/hooks/useTheme';
import { ThemeSidebar } from '../features/theme/components/ThemeSidebar';
import { DevicePreview } from '../features/theme/components/DevicePreview';
import { menuService } from '../services/menu.service';

const { Content, Header } = Layout;
const { Title } = Typography;

// Beautiful Mock Fallbacks if restaurant has no items yet
const mockCategories = [
  {
    id: 'mock-1',
    name: 'Main Courses',
    menuItems: [
      {
        id: 'mock-item-1',
        name: 'Truffle Mushroom Risotto',
        description: 'Creamy carnaroli rice cooked with wild forest mushrooms, fresh herbs, and imported black truffle oil.',
        price: '480',
        imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300',
        isVeg: true,
        isAvailable: true,
        isBestseller: true,
      },
      {
        id: 'mock-item-2',
        name: 'Flame-Grilled Tandoori Chicken',
        description: 'Tender chicken breast marinated in yogurt and aromatic spices, roasted in a clay oven to perfection.',
        price: '395',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300',
        isVeg: false,
        isAvailable: true,
        isBestseller: false,
      }
    ]
  },
  {
    id: 'mock-2',
    name: 'Beverages & Desserts',
    menuItems: [
      {
        id: 'mock-item-3',
        name: 'Dark Chocolate Lava Cake',
        description: 'Decadent chocolate cake with a warm, gooey molten chocolate center. Served with Madagascan vanilla gelato.',
        price: '280',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300',
        isVeg: true,
        isAvailable: true,
        isBestseller: true,
      },
      {
        id: 'mock-item-4',
        name: 'Cold Brew Citrus Iced Coffee',
        description: 'Slow-steeped cold brew infusion with a splash of fresh orange zest and organic agave syrup.',
        price: '180',
        imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300',
        isVeg: true,
        isAvailable: true,
        isBestseller: false,
      }
    ]
  }
];

export const ThemeCustomizer: React.FC = () => {
  const {
    isLoading,
    profile,
    themePresets,
    selectedPresetId,
    themeConfig,
    contrastWarnings,
    isDirty,
    selectPreset,
    updateConfigValue,
    saveTheme,
    resetTheme,
    isSaving,
    isResetting,
  } = useTheme();

  // Active Device View Mode
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
  
  // Mobile Split Tab: 'edit' or 'preview'
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  // Fetch real categories and items to show actual data in preview if available
  const { data: realCategoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => menuService.getCategories(),
  });

  const rawCategories = (realCategoriesData?.data || []) as any[];
  // Fallback to mock data if there are no items created yet
  const categories = rawCategories.length > 0 && rawCategories.some(c => c.menuItems && c.menuItems.length > 0)
    ? rawCategories
    : mockCategories;

  if (isLoading) {
    return (
      <div style={{ height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Loading Customizer Workspace..." />
      </div>
    );
  }

  // Construct preview restaurant object using profile info or fallbacks
  const previewRestaurant = {
    restaurantName: profile?.restaurantName || 'Gourmet Kitchen',
    description: profile?.description || 'Experience delicious artisan cuisine handcrafted by our master chefs.',
    slug: profile?.slug || 'preview',
    logoUrl: profile?.logoUrl,
    coverImageUrl: profile?.coverImageUrl,
    phone: profile?.phone || '+91 98765 43210',
    address: profile?.address || '12, Culinary Street',
    city: profile?.city || 'New Delhi',
    state: profile?.state || 'Delhi',
    country: profile?.country || 'India',
    postalCode: profile?.postalCode,
    googleMapsUrl: profile?.googleMapsUrl,
    openingTime: profile?.openingTime || '09:00 AM',
    closingTime: profile?.closingTime || '11:00 PM',
  };

  return (
    <Layout style={{ height: 'calc(100vh - 56px)', background: '#F8FAFC' }}>
      
      {/* 1. Customizer Toolbar */}
      <Header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          height: '56px',
          lineHeight: '56px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}
      >
        <Space size={16}>
          <Title level={5} style={{ margin: 0, color: '#0F172A', fontWeight: 700 }}>
            Live Studio
          </Title>
          
          {/* Device toggle switches (hidden on small phone views) */}
          <div className="desktop-device-selector" style={{ display: 'block' }}>
            <Segmented
              value={deviceMode}
              onChange={(value: any) => setDeviceMode(value)}
              options={[
                { value: 'mobile', icon: <MobileOutlined /> },
                { value: 'tablet', icon: <TabletOutlined /> },
                { value: 'desktop', icon: <DesktopOutlined /> },
              ]}
              style={{ background: '#F1F5F9' }}
            />
          </div>
        </Space>

        <Space>
          {/* Mobile view Tab selector (Controls vs Preview) */}
          <div className="mobile-view-tabs" style={{ display: 'none' }}>
            <Segmented
              value={mobileTab}
              onChange={(value: any) => setMobileTab(value)}
              options={[
                { value: 'edit', label: 'Controls', icon: <EditOutlined /> },
                { value: 'preview', label: 'Preview', icon: <EyeOutlined /> },
              ]}
              style={{ background: '#F1F5F9' }}
            />
          </div>

          <Popconfirm
            title="Reset Theme"
            description="Are you sure you want to discard your overrides and restore the default preset theme?"
            onConfirm={resetTheme}
            okText="Yes, Reset"
            cancelText="Cancel"
            disabled={isResetting}
          >
            <Button
              icon={<UndoOutlined />}
              disabled={isResetting}
              loading={isResetting}
            >
              Reset
            </Button>
          </Popconfirm>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => saveTheme()}
            loading={isSaving}
            disabled={isSaving || !isDirty}
            style={{
              background: isDirty ? '#4F46E5' : undefined,
              borderColor: isDirty ? '#4F46E5' : undefined,
            }}
          >
            Save Theme
          </Button>
        </Space>
      </Header>

      <Content style={{ display: 'flex', height: 'calc(100% - 56px)', overflow: 'hidden' }}>
        
        {/* CSS styles to toggle device frames responsive layouts */}
        <style>{`
          .customizer-sidebar-wrapper {
            width: 380px;
            flex-shrink: 0;
            height: 100%;
          }
          .customizer-preview-pane {
            flex: 1;
            height: 100%;
            overflow-y: auto;
            background: #F1F5F9;
            padding: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          @media (max-width: 768px) {
            .desktop-device-selector {
              display: none !important;
            }
            .mobile-view-tabs {
              display: block !important;
            }
            .customizer-sidebar-wrapper {
              width: 100% !important;
              display: ${mobileTab === 'edit' ? 'block' : 'none'} !important;
            }
            .customizer-preview-pane {
              display: ${mobileTab === 'preview' ? 'flex' : 'none'} !important;
              padding: 12px !important;
            }
          }
        `}</style>

        {/* Left Controls Panel */}
        <div className="customizer-sidebar-wrapper">
          <ThemeSidebar
            themeConfig={themeConfig}
            selectedPresetId={selectedPresetId}
            themePresets={themePresets}
            contrastWarnings={contrastWarnings}
            selectPreset={selectPreset}
            updateConfigValue={updateConfigValue}
          />
        </div>

        {/* Center Live Preview Viewport Frame */}
        <div className="customizer-preview-pane">
          <DevicePreview
            deviceMode={deviceMode}
            restaurant={previewRestaurant}
            categories={categories}
            themeConfig={themeConfig}
          />
        </div>

      </Content>
    </Layout>
  );
};
export default ThemeCustomizer;

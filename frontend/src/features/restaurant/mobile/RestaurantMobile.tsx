import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Collapse,
  Flex,
  Typography,
  Upload,
} from 'antd';
import {
  SaveOutlined,
  CopyOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  EyeOutlined,
  CameraOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import { Capacitor } from '@capacitor/core';

const { Text, Title } = Typography;
const { Panel } = Collapse;

interface RestaurantMobileProps {
  restaurantData: any;
}

export const RestaurantMobile: React.FC<RestaurantMobileProps> = ({ restaurantData }) => {
  const {
    form,
    logoPreview,
    coverPreview,
    isDirty,
    uploadingLogo,
    uploadingCover,
    publicUrl,
    updateProfileMutation,
    handleImageUpload,
    pickAndUploadNativeImage,
    handleValuesChange,
    handleSave,
    handleCopyLink,
    handleShareMenu,
    handleDownloadQR,
  } = restaurantData;

  const [activeSection, setActiveSection] = useState<string | string[]>(['1']);
  const isNative = Capacitor.isNativePlatform();

  return (
    <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '96px' }}>
      
      {/* Dynamic Header */}
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
          Settings
        </Title>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Configure your digital restaurant profile.
        </Text>
      </div>

      {/* Main Settings Accordion */}
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        requiredMark={false}
      >
        <Collapse
          activeKey={activeSection}
          onChange={(key) => setActiveSection(key)}
          expandIconPosition="end"
          ghost
          style={{ background: 'transparent' }}
        >
          {/* SECTION 1: Basic Branding (Logo / Cover) */}
          <Panel
            header={
              <Flex gap={8} align="center">
                <ShopOutlined style={{ color: '#F97316' }} />
                <Text strong style={{ fontSize: '14px' }}>Basic Branding</Text>
              </Flex>
            }
            key="1"
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              marginBottom: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <Flex vertical gap={16}>
              {/* Logo Upload */}
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  Restaurant Logo
                </Text>
                <Flex align="center" gap={16}>
                  {logoPreview ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${logoPreview}`}
                      alt="Logo"
                      loading="lazy"
                      style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                    />
                  ) : (
                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: '#FFEDD5', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                      OS
                    </div>
                  )}
                  {isNative ? (
                    <Button icon={<CameraOutlined />} onClick={() => pickAndUploadNativeImage('logo')} loading={uploadingLogo}>
                      Upload Photo
                    </Button>
                  ) : (
                    <Upload
                      accept=".jpg,.jpeg,.png,.webp"
                      showUploadList={false}
                      beforeUpload={(file) => handleImageUpload(file, 'logo')}
                    >
                      <Button icon={<CameraOutlined />} loading={uploadingLogo}>Upload</Button>
                    </Upload>
                  )}
                </Flex>
              </div>

              {/* Cover Upload */}
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  Cover Image
                </Text>
                <Flex align="center" gap={16}>
                  {coverPreview ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${coverPreview}`}
                      alt="Cover"
                      loading="lazy"
                      style={{ width: '120px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                    />
                  ) : (
                    <div style={{ width: '120px', height: '48px', borderRadius: '8px', background: '#F1F5F9', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#94A3B8' }}>
                      No cover selected
                    </div>
                  )}
                  {isNative ? (
                    <Button icon={<CameraOutlined />} onClick={() => pickAndUploadNativeImage('cover')} loading={uploadingCover}>
                      Upload Cover
                    </Button>
                  ) : (
                    <Upload
                      accept=".jpg,.jpeg,.png,.webp"
                      showUploadList={false}
                      beforeUpload={(file) => handleImageUpload(file, 'cover')}
                    >
                      <Button icon={<CameraOutlined />} loading={uploadingCover}>Upload</Button>
                    </Upload>
                  )}
                </Flex>
              </div>

              <Form.Item
                name="restaurantName"
                label="Restaurant Name"
                rules={[{ required: true, message: 'Restaurant name is required' }]}
              >
                <Input placeholder="e.g. Pepper Bistro" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item name="description" label="Restaurant Description">
                <Input.TextArea
                  rows={3}
                  placeholder="Describe cuisine style..."
                  maxLength={500}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Flex>
          </Panel>

          {/* SECTION 2: Location & Address */}
          <Panel
            header={
              <Flex gap={8} align="center">
                <EnvironmentOutlined style={{ color: '#F97316' }} />
                <Text strong style={{ fontSize: '14px' }}>Location & Address</Text>
              </Flex>
            }
            key="2"
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              marginBottom: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <Flex vertical gap={12}>
              <Form.Item
                name="address"
                label="Street Address"
                rules={[{ required: true, message: 'Street Address is required' }]}
              >
                <Input placeholder="Street name / Shop number" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'City is required' }]}
              >
                <Input placeholder="City" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'State is required' }]}
              >
                <Input placeholder="State" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="postalCode"
                label="ZIP / Postal Code"
                rules={[{ required: true, message: 'Postal code is required' }]}
              >
                <Input placeholder="ZIP code" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Country is required' }]}
              >
                <Input placeholder="Country" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item name="googleMapsUrl" label="Google Maps Link">
                <Input placeholder="https://maps.google.com/?cid=..." size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Flex>
          </Panel>

          {/* SECTION 3: Timings & Contacts */}
          <Panel
            header={
              <Flex gap={8} align="center">
                <ClockCircleOutlined style={{ color: '#F97316' }} />
                <Text strong style={{ fontSize: '14px' }}>Contacts & Timings</Text>
              </Flex>
            }
            key="3"
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              marginBottom: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <Flex vertical gap={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Phone number is required' }]}
              >
                <Input placeholder="9876543210" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="openingTime"
                label="Opening Time"
                rules={[{ required: true, message: 'Opening hour is required' }]}
              >
                <Input type="time" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Form.Item
                name="closingTime"
                label="Closing Time"
                rules={[{ required: true, message: 'Closing hour is required' }]}
              >
                <Input type="time" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Flex>
          </Panel>

          {/* SECTION 4: Digital Menu Link & QR Actions */}
          <Panel
            header={
              <Flex gap={8} align="center">
                <GlobalOutlined style={{ color: '#F97316' }} />
                <Text strong style={{ fontSize: '14px' }}>Digital QR Menu Link</Text>
              </Flex>
            }
            key="4"
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              marginBottom: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <Flex vertical align="center" gap={16} style={{ paddingTop: '8px' }}>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                <QRCodeCanvas
                  id="preview-qr-canvas"
                  value={publicUrl}
                  size={140}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <Text type="secondary" style={{ fontSize: '11px', textAlign: 'center' }}>
                {publicUrl}
              </Text>

              <Flex vertical gap={8} style={{ width: '100%' }}>
                <Button icon={<CopyOutlined />} onClick={handleCopyLink} block size="large">
                  Copy Link
                </Button>
                <Button icon={<ShareAltOutlined />} onClick={handleShareMenu} block size="large">
                  Share QR Link
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleDownloadQR} block size="large">
                  Download QR Code
                </Button>
                <Button type="link" icon={<EyeOutlined />} onClick={() => window.open(publicUrl, '_blank')} block>
                  View Live Menu
                </Button>
              </Flex>
            </Flex>
          </Panel>
        </Collapse>
      </Form>

      {/* Sticky Save Button at Bottom */}
      <div
        style={{
          position: 'fixed',
          bottom: 'calc(56px + env(safe-area-inset-bottom))',
          left: 0,
          right: 0,
          background: '#FFFFFF',
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
          zIndex: 100,
        }}
      >
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={updateProfileMutation.isPending}
          disabled={!isDirty}
          block
          size="large"
          style={{
            height: '48px',
            borderRadius: '12px',
            background: isDirty ? '#F97316' : '#F1F5F9',
            borderColor: isDirty ? '#F97316' : '#E2E8F0',
            color: isDirty ? '#FFFFFF' : '#94A3B8',
            fontWeight: 600
          }}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

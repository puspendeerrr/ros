import React from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Progress,
  Row,
  Col,
  Flex,
  Typography,
  Space,
  Spin,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  CopyOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  EyeOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  MinusCircleOutlined,
  MailOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';

const { Title, Text, Paragraph } = Typography;

interface RestaurantDesktopProps {
  restaurantData: any;
}

export const RestaurantDesktop: React.FC<RestaurantDesktopProps> = ({ restaurantData }) => {
  const {
    form,
    profile,
    isProfileLoading,
    logoPreview,
    coverPreview,
    isDirty,
    slug,
    formValues,
    uploadingLogo,
    uploadingCover,
    completionPercentage,
    checklistItems,
    completedChecklistCount,
    checklistTotal,
    isAllChecklistDone,
    publicUrl,
    locationStr,
    formattedLastUpdated,
    updateProfileMutation,
    handleImageUpload,
    handleValuesChange,
    handleSave,
    handleCopyLink,
    handleShareMenu,
    handleDownloadQR,
  } = restaurantData;

  if (isProfileLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Spin size="large" tip="Loading restaurant profile..." />
      </Flex>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px' }} className="restaurant-settings-container">
      <Row gutter={[32, 32]}>
        
        {/* LEFT COLUMN: Editor & Progress */}
        <Col xs={24} md={24} lg={15}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            
            {/* Header Title */}
            <div>
              <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0F172A' }}>
                Restaurant Settings
              </Title>
              <Text type="secondary">Manage your restaurant brand profile, contact info, hours, and location.</Text>
            </div>

            {/* Profile Completion Card */}
            <Card
              bordered={false}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <Flex align="center" justify="space-between" wrap="wrap" gap={16} style={{ marginBottom: '16px' }}>
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                    Profile Completion
                  </Title>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Complete these key branding fields to optimize your public menu presence.
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#F97316' }}>
                    {completionPercentage}%
                  </Title>
                </div>
              </Flex>

              <Progress
                percent={completionPercentage}
                strokeColor="#F97316"
                trailColor="#FFEDD5"
                showInfo={false}
                style={{ marginBottom: '20px' }}
              />
            </Card>

            {/* Setup Checklist Card */}
            <Card
              bordered={false}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 700 }}>
                Restaurant Setup Checklist
              </Title>
              <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '16px' }}>
                Follow these steps to configure your digital dining setup.
              </Text>

              <Row gutter={[16, 12]}>
                {checklistItems.map((item: any, idx: number) => (
                  <Col xs={24} sm={12} key={idx}>
                    <Flex align="center" gap={8}>
                      {item.done ? (
                        <CheckCircleFilled style={{ color: '#22C55E', fontSize: '16px' }} />
                      ) : (
                        <MinusCircleOutlined style={{ color: '#94A3B8', fontSize: '16px' }} />
                      )}
                      <Text
                        delete={item.done}
                        style={{ fontSize: '13px', color: item.done ? '#94A3B8' : '#334155', fontWeight: item.done ? 400 : 500 }}
                      >
                        {item.label}
                      </Text>
                    </Flex>
                  </Col>
                ))}
              </Row>

              <Flex align="center" justify="space-between" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <Text strong style={{ color: '#F97316' }}>
                  {completedChecklistCount} / {checklistTotal} Completed
                </Text>
                {isAllChecklistDone && (
                  <Text strong style={{ color: '#22C55E' }}>
                    🎉 Your restaurant is ready to receive customers.
                  </Text>
                )}
              </Flex>
            </Card>

            {/* Form Editor Card */}
            <Card
              bordered={false}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                requiredMark={false}
              >
                {/* SECTION 1: Basic Info */}
                <Title level={4} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '20px', color: '#0F172A', fontWeight: 700 }}>
                  Basic Information
                </Title>

                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item label="Restaurant Logo">
                      <Flex vertical align="center" gap={12} style={{ border: '1px dashed #CBD5E1', padding: '16px', borderRadius: '12px', background: '#F8FAFC' }}>
                        {logoPreview ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${logoPreview}`}
                            alt="Logo"
                            loading="lazy"
                            style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                          />
                        ) : (
                          <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#FFEDD5', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                            OS
                          </div>
                        )}
                        <Upload
                          accept=".jpg,.jpeg,.png,.webp"
                          showUploadList={false}
                          beforeUpload={(file) => handleImageUpload(file, 'logo')}
                        >
                          <Button size="small" icon={<UploadOutlined />} loading={uploadingLogo}>Upload</Button>
                        </Upload>
                      </Flex>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={16}>
                    <Form.Item label="Cover Image">
                      <Flex vertical align="center" gap={12} style={{ border: '1px dashed #CBD5E1', padding: '16px', borderRadius: '12px', background: '#F8FAFC', height: '100%', minHeight: '144px', justifySelf: 'stretch', justifyContent: 'center' }}>
                        {coverPreview ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${coverPreview}`}
                            alt="Cover"
                            loading="lazy"
                            style={{ width: '100%', height: '54px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
                          />
                        ) : (
                          <Text type="secondary" style={{ fontSize: '12px' }}>No cover image selected</Text>
                        )}
                        <Upload
                          accept=".jpg,.jpeg,.png,.webp"
                          showUploadList={false}
                          beforeUpload={(file) => handleImageUpload(file, 'cover')}
                        >
                          <Button size="small" icon={<UploadOutlined />} loading={uploadingCover}>Upload Cover</Button>
                        </Upload>
                      </Flex>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="restaurantName"
                  label="Restaurant Name"
                  rules={[{ required: true, message: 'Restaurant name is required' }]}
                >
                  <Input placeholder="Enter restaurant name" size="large" style={{ borderRadius: '8px' }} />
                </Form.Item>

                <Form.Item name="description" label="Restaurant Description">
                  <Input.TextArea
                    rows={4}
                    placeholder="Describe your restaurant cuisine, vibe, and specialties..."
                    maxLength={1000}
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                {/* SECTION 2: Address & Location */}
                <Title level={4} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginTop: '32px', marginBottom: '20px', color: '#0F172A', fontWeight: 700 }}>
                  Location & Address
                </Title>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Street Address is required' }]}
                >
                  <Input placeholder="123 Food Street, Sector 4" size="large" style={{ borderRadius: '8px' }} />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true, message: 'City is required' }]}
                    >
                      <Input placeholder="New Delhi" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="state"
                      label="State / Region"
                      rules={[{ required: true, message: 'State is required' }]}
                    >
                      <Input placeholder="Delhi" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="postalCode"
                      label="ZIP / Postal Code"
                      rules={[{ required: true, message: 'Postal code is required' }]}
                    >
                      <Input placeholder="110001" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="country"
                      label="Country"
                      rules={[{ required: true, message: 'Country is required' }]}
                    >
                      <Input placeholder="India" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="googleMapsUrl" label="Google Maps Link">
                  <Input prefix={<CompassOutlined />} placeholder="https://maps.google.com/?cid=..." size="large" style={{ borderRadius: '8px' }} />
                </Form.Item>

                {/* SECTION 3: Business Hours & Phone */}
                <Title level={4} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginTop: '32px', marginBottom: '20px', color: '#0F172A', fontWeight: 700 }}>
                  Contact & Timings
                </Title>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[{ required: true, message: 'Phone number is required' }]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="9876543210" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Contact Email">
                      <Input prefix={<MailOutlined />} value={profile?.email} disabled size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={12} sm={12}>
                    <Form.Item
                      name="openingTime"
                      label="Opening Time"
                      rules={[{ required: true, message: 'Opening hour is required' }]}
                    >
                      <Input type="time" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12}>
                    <Form.Item
                      name="closingTime"
                      label="Closing Time"
                      rules={[{ required: true, message: 'Closing hour is required' }]}
                    >
                      <Input type="time" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Space>
        </Col>

        {/* RIGHT COLUMN: Brand Preview & QR Actions */}
        <Col xs={24} md={24} lg={9}>
          <Space direction="vertical" size={24} style={{ width: '100%', position: 'sticky', top: '24px' }}>
            
            {/* Action Bar */}
            <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={updateProfileMutation.isPending}
                  block
                  size="large"
                  disabled={!isDirty}
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    background: isDirty ? '#F97316' : '#F1F5F9',
                    borderColor: isDirty ? '#F97316' : '#E2E8F0',
                    color: isDirty ? '#FFFFFF' : '#94A3B8',
                    fontWeight: 600
                  }}
                >
                  Save Profile Changes
                </Button>
                {formattedLastUpdated && (
                  <Text type="secondary" style={{ fontSize: '11px', textAlign: 'center', display: 'block' }}>
                    Last saved: {formattedLastUpdated}
                  </Text>
                )}
              </Space>
            </Card>

            {/* Public QR Code Card */}
            <Card
              bordered={false}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
              title={<Text strong style={{ fontSize: '15px' }}>Diner Digital Menu</Text>}
            >
              <Flex vertical align="center" gap={16}>
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                  <QRCodeCanvas
                    id="preview-qr-canvas"
                    value={publicUrl}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <Text strong style={{ fontSize: '14px', display: 'block', color: '#1E293B', marginBottom: '4px' }}>
                    {profile?.restaurantName || 'Scan QR Code'}
                  </Text>
                  <Paragraph copyable={{ text: publicUrl }} style={{ color: '#64748B', fontSize: '12px', margin: 0 }}>
                    {slug ? `/r/${slug}` : 'No slug configured'}
                  </Paragraph>
                </div>

                <Flex vertical gap={8} style={{ width: '100%' }}>
                  <Button type="default" icon={<CopyOutlined />} onClick={handleCopyLink} block>
                    Copy Menu URL
                  </Button>
                  <Button type="default" icon={<ShareAltOutlined />} onClick={handleShareMenu} block>
                    Share Digital Link
                  </Button>
                  <Button type="default" icon={<DownloadOutlined />} onClick={handleDownloadQR} block>
                    Download QR Image
                  </Button>
                  <Button type="link" icon={<EyeOutlined />} onClick={() => window.open(publicUrl, '_blank')} block>
                    Open Live Guest Menu
                  </Button>
                </Flex>
              </Flex>
            </Card>

            {/* Diner Live View Preview Card */}
            <Card
              bordered={false}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                background: '#0F172A',
                color: '#F8FAFC',
              }}
            >
              <Flex vertical gap={12}>
                <Title level={5} style={{ color: '#F8FAFC', margin: 0 }}>
                  Branded Visual Settings
                </Title>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Flex align="center" gap={8} style={{ marginBottom: '8px' }}>
                    <EnvironmentOutlined style={{ color: '#F97316' }} />
                    <Text style={{ color: '#E2E8F0', fontSize: '12px' }}>{locationStr}</Text>
                  </Flex>
                  <Flex align="center" gap={8}>
                    <ClockCircleOutlined style={{ color: '#F97316' }} />
                    <Text style={{ color: '#E2E8F0', fontSize: '12px' }}>
                      {formValues.openingTime && formValues.closingTime
                        ? `${formValues.openingTime} - ${formValues.closingTime}`
                        : 'Hours not specified'}
                    </Text>
                  </Flex>
                </div>
              </Flex>
            </Card>

          </Space>
        </Col>

      </Row>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Modal,
  Spin,
  message,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  CopyOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  EyeOutlined,
  ExportOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  MinusCircleOutlined,
  MailOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import { restaurantService } from '../services/restaurant.service.js';
import type { RestaurantProfile } from '../services/restaurant.service.js';
import { menuService } from '../services/menu.service.js';
import { useAuthStore } from '../store/auth.store.js';

const { Title, Text, Paragraph } = Typography;

export const Restaurant: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { restaurant: authRestaurant, setAuth, accessToken } = useAuthStore();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const initialValuesRef = useRef<Partial<RestaurantProfile>>({});

  // 1. Fetch Profile Data
  const { data: profileResponse, isLoading: isProfileLoading } = useQuery({
    queryKey: ['restaurant-profile'],
    queryFn: () => restaurantService.getProfile(),
  });

  const profile = profileResponse?.data;

  // 2. Fetch Category & Item Counts (for checklist)
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-list'],
    queryFn: () => menuService.getCategories(),
  });

  const { data: itemsData } = useQuery({
    queryKey: ['items-list'],
    queryFn: () => menuService.getItems(),
  });

  const categoryCount = categoriesData?.data?.length || 0;
  const itemCount = itemsData?.data?.length || 0;

  // Load profile values into form
  useEffect(() => {
    if (profile) {
      const formValues = {
        restaurantName: profile.restaurantName || '',
        description: profile.description || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        postalCode: profile.postalCode || '',
        googleMapsUrl: profile.googleMapsUrl || '',
        openingTime: profile.openingTime || '',
        closingTime: profile.closingTime || '',
      };
      form.setFieldsValue(formValues);
      initialValuesRef.current = {
        ...formValues,
        logoUrl: profile.logoUrl,
        coverImageUrl: profile.coverImageUrl,
      };
      setLogoPreview(profile.logoUrl || null);
      setCoverPreview(profile.coverImageUrl || null);
      setIsDirty(false);
    }
  }, [profile, form]);

  // Unsaved Changes warning before tab close / reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Sync isDirty with window.hasUnsavedChanges for MainLayout intercept
  useEffect(() => {
    (window as any).hasUnsavedChanges = isDirty;
    return () => {
      (window as any).hasUnsavedChanges = false;
    };
  }, [isDirty]);

  // 3. Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (values: Partial<RestaurantProfile>) => restaurantService.updateProfile(values),
    onSuccess: (res) => {
      message.success('Restaurant profile saved successfully!');
      queryClient.setQueryData(['restaurant-profile'], res);
      
      // Update global auth store to keep Sider/Footer details in sync
      if (authRestaurant && accessToken) {
        setAuth(
          {
            ...authRestaurant,
            restaurantName: res.data.restaurantName,
            phone: res.data.phone,
          },
          accessToken
        );
      }
      
      initialValuesRef.current = {
        ...form.getFieldsValue(),
        logoUrl: res.data.logoUrl,
        coverImageUrl: res.data.coverImageUrl,
      };
      setIsDirty(false);
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update profile');
    },
  });

  // Calculate dynamic fields for Profile Completion and Setup Checklist
  const formValues = Form.useWatch([], form) || {};
  const currentLogo = logoPreview;
  const currentCover = coverPreview;

  // Completion criteria (8 key fields)
  const completionFields = [
    { name: 'Restaurant Name', completed: !!formValues.restaurantName },
    { name: 'Logo', completed: !!currentLogo },
    { name: 'Cover Image', completed: !!currentCover },
    { name: 'Description', completed: !!formValues.description },
    { name: 'Phone', completed: !!formValues.phone },
    { name: 'Address', completed: !!formValues.address },
    { name: 'Business Hours', completed: !!formValues.openingTime && !!formValues.closingTime },
    { name: 'Google Maps URL', completed: !!formValues.googleMapsUrl },
  ];

  const completedCount = completionFields.filter((f) => f.completed).length;
  const completionPercentage = Math.round((completedCount / completionFields.length) * 100);

  // Setup Checklist items
  const isEmailVerified = profile?.status !== 'PENDING';
  const hasLogo = !!currentLogo;
  const hasCover = !!currentCover;
  const hasDescription = !!formValues.description;
  const hasAddress = !!formValues.address;
  const hasHours = !!formValues.openingTime && !!formValues.closingTime;
  const hasCategories = categoryCount > 0;
  const hasItems = itemCount > 0;
  const hasQRMenu = hasCategories && hasItems;

  const checklistItems = [
    { label: 'Verify Email', done: isEmailVerified, suggestion: 'Please verify your email address to activate your account' },
    { label: 'Add Restaurant Logo', done: hasLogo, suggestion: 'Upload a restaurant logo' },
    { label: 'Add Cover Image', done: hasCover, suggestion: 'Upload a background cover image' },
    { label: 'Add Description', done: hasDescription, suggestion: 'Add a restaurant description' },
    { label: 'Add Address', done: hasAddress, suggestion: 'Add your restaurant location address' },
    { label: 'Add Business Hours', done: hasHours, suggestion: 'Add your restaurant opening and closing hours' },
    { label: 'Add At Least One Category', done: hasCategories, suggestion: 'Add at least one category to your Menu' },
    { label: 'Add At Least One Item', done: hasItems, suggestion: 'Add at least one food item to your Menu' },
    { label: 'Generate QR Menu', done: hasQRMenu, suggestion: 'Add category and item to generate your QR menu' },
  ];

  const completedChecklistCount = checklistItems.filter((i) => i.done).length;
  const checklistTotal = checklistItems.length;
  const isAllChecklistDone = completedChecklistCount === checklistTotal;

  // Handle image upload helper
  const handleImageUpload = async (file: File, type: 'logo' | 'cover') => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isImage) {
      message.error('Only JPG, PNG, and WEBP images are allowed!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }

    try {
      const res = await restaurantService.uploadImage(file);
      if (type === 'logo') {
        setLogoPreview(res.data.imageUrl);
        setIsDirty(true);
        message.success('Logo uploaded successfully');
      } else {
        setCoverPreview(res.data.imageUrl);
        setIsDirty(true);
        message.success('Cover image uploaded successfully');
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Upload failed');
    }
    return false; // prevent default upload action
  };

  const handleValuesChange = () => {
    // Check if form values differ from initial values to flag dirty
    const currentForm = form.getFieldsValue();
    let dirty = false;
    for (const key of Object.keys(currentForm)) {
      if (currentForm[key] !== (initialValuesRef.current[key as keyof RestaurantProfile] || '')) {
        dirty = true;
        break;
      }
    }
    if (logoPreview !== initialValuesRef.current.logoUrl) dirty = true;
    if (coverPreview !== initialValuesRef.current.coverImageUrl) dirty = true;

    setIsDirty(dirty);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      updateProfileMutation.mutate({
        ...values,
        logoUrl: logoPreview,
        coverImageUrl: coverPreview,
      });
    }).catch(() => {
      message.error('Please correct the validation errors in the form.');
    });
  };

  // Build the public url
  const slug = profile?.slug || '';
  const publicUrl = window.location.origin.includes('localhost')
    ? `${window.location.origin}/r/${slug}`
    : `https://ros.algorithyum.in/r/${slug}`;

  // Copy URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    message.success('Public Menu link copied to clipboard!');
  };

  // Share using Web Share API or copy fallback
  const handleShareMenu = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: formValues.restaurantName || 'Restaurant Menu',
          text: `Checkout the digital menu of ${formValues.restaurantName || 'our restaurant'}!`,
          url: publicUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Download QR Code as PNG
  const handleDownloadQR = () => {
    const canvas = document.getElementById('preview-qr-canvas') as HTMLCanvasElement;
    if (!canvas) {
      return message.error('Failed to locate QR code canvas');
    }
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slug}-qr-menu.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('QR Code downloaded successfully!');
  };

  if (isProfileLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Spin size="large" tip="Loading restaurant profile..." />
      </Flex>
    );
  }

  // Address line construction for preview
  const locationParts = [formValues.address, formValues.city, formValues.state, formValues.country].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Address not specified';

  // Format date/time
  const formattedLastUpdated = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  return (
    <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto' }}>
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

              {/* Suggestions */}
              {completionPercentage < 100 && (
                <div>
                  <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                    Suggestions to improve your profile:
                  </Text>
                  <Space direction="vertical" size={4}>
                    {completionFields
                      .filter((f) => !f.completed)
                      .map((f, idx) => (
                        <Text key={idx} type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                          • {f.name === 'Logo' ? 'Upload a logo' : f.name === 'Cover Image' ? 'Upload a cover image' : f.name === 'Description' ? 'Add your restaurant description' : f.name === 'Business Hours' ? 'Add business hours' : f.name === 'Google Maps URL' ? 'Add Google Maps URL' : `Add your restaurant ${f.name.toLowerCase()}`}
                        </Text>
                      ))}
                  </Space>
                </div>
              )}
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
                {checklistItems.map((item, idx) => (
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
                          <Button size="small" icon={<UploadOutlined />}>Upload</Button>
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
                          <Button size="small" icon={<UploadOutlined />}>Upload Cover</Button>
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
                    showCount
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Item>

                {/* SECTION 2: Contact Info */}
                <Title level={4} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '20px', marginTop: '32px', color: '#0F172A', fontWeight: 700 }}>
                  Contact Details
                </Title>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[{ required: true, message: 'Phone number is required' }]}
                    >
                      <Input placeholder="Enter contact phone" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Email Address (Read Only)">
                      <Input
                        value={profile?.email}
                        disabled
                        prefix={<MailOutlined />}
                        size="large"
                        style={{ borderRadius: '8px', background: '#F1F5F9', color: '#64748B' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* SECTION 3: Location Info */}
                <Title level={4} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '20px', marginTop: '32px', color: '#0F172A', fontWeight: 700 }}>
                  Location Information
                </Title>

                <Form.Item name="address" label="Street Address">
                  <Input placeholder="Enter street address" size="large" style={{ borderRadius: '8px' }} />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="city" label="City">
                      <Input placeholder="City" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="state" label="State / Province">
                      <Input placeholder="State" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="country" label="Country">
                      <Input placeholder="Country" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="postalCode" label="Postal / ZIP Code">
                      <Input placeholder="Postal Code" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="googleMapsUrl"
                  label="Google Maps URL"
                  rules={[{ type: 'url', message: 'Please enter a valid Google Maps URL' }]}
                >
                  <Input placeholder="https://maps.google.com/..." size="large" style={{ borderRadius: '8px' }} />
                </Form.Item>

                {/* SECTION 4: Hours */}
                <Title level={4} style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '20px', marginTop: '32px', color: '#0F172A', fontWeight: 700 }}>
                  Business Hours
                </Title>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="openingTime" label="Opening Time">
                      <Input placeholder="e.g. 10:00 AM" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="closingTime" label="Closing Time">
                      <Input placeholder="e.g. 10:00 PM" size="large" style={{ borderRadius: '8px' }} />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Submit Action */}
                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    size="large"
                    onClick={handleSave}
                    loading={updateProfileMutation.isPending}
                    style={{
                      background: '#F97316',
                      borderColor: '#F97316',
                      borderRadius: '8px',
                      height: '46px',
                      padding: '0 24px',
                      fontWeight: 600,
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            </Card>

          </Space>
        </Col>

        {/* RIGHT COLUMN: Previews */}
        <Col xs={24} md={24} lg={9}>
          <Space direction="vertical" size={24} style={{ width: '100%', position: 'sticky', top: '32px' }}>
            
            {/* Title */}
            <div>
              <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>
                Brand Preview
              </Title>
              <Text type="secondary">Instantly view how customers see your restaurant profile.</Text>
            </div>

            {/* Simulated Public Menu Header Preview Card */}
            <Card
              bordered={false}
              style={{
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
                overflow: 'hidden',
                background: '#FFFFFF',
              }}
              bodyStyle={{ padding: 0 }}
            >
              {/* Header Banner */}
              <div
                style={{
                  background: currentCover
                    ? `url(${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${currentCover}) center/cover`
                    : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  height: '110px',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.4)',
                  }}
                />
              </div>

              {/* Main Content Info */}
              <div style={{ padding: '20px', position: 'relative', marginTop: '-36px', zIndex: 10 }}>
                {/* Logo and Name */}
                <Flex align="center" gap={12} style={{ marginBottom: '12px' }}>
                  {currentLogo ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${currentLogo}`}
                      alt="Logo"
                      style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #FFFFFF', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                    />
                  ) : (
                    <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '20px', fontWeight: 'bold', border: '2px solid #FFFFFF', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                      OS
                    </div>
                  )}
                  <div style={{ paddingTop: '20px' }}>
                    <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0F172A', fontSize: '16px' }}>
                      {formValues.restaurantName || 'Restaurant Name'}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '2px' }}>
                      <EnvironmentOutlined /> {locationStr}
                    </Text>
                  </div>
                </Flex>

                {/* Description */}
                {formValues.description ? (
                  <Paragraph style={{ color: '#475569', fontSize: '12px', lineHeight: '1.5', margin: '12px 0' }}>
                    {formValues.description}
                  </Paragraph>
                ) : (
                  <Paragraph type="secondary" style={{ fontSize: '12px', fontStyle: 'italic', margin: '12px 0' }}>
                    No description added yet. Add a description to welcome your customers.
                  </Paragraph>
                )}

                {/* Operating Hours */}
                <Space direction="vertical" size={6} style={{ width: '100%', background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                  <Flex align="center" gap={6}>
                    <ClockCircleOutlined style={{ color: '#F97316', fontSize: '12px' }} />
                    <Text style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>
                      Hours: {formValues.openingTime || '10:00 AM'} - {formValues.closingTime || '11:00 PM'}
                    </Text>
                  </Flex>
                  {formValues.phone && (
                    <Flex align="center" gap={6}>
                      <PhoneOutlined style={{ color: '#F97316', fontSize: '12px' }} />
                      <Text style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>
                        Phone: {formValues.phone}
                      </Text>
                    </Flex>
                  )}
                  {formValues.googleMapsUrl && (
                    <Flex align="center" gap={6}>
                      <CompassOutlined style={{ color: '#F97316', fontSize: '12px' }} />
                      <Button
                        type="link"
                        href={formValues.googleMapsUrl}
                        target="_blank"
                        style={{ padding: 0, height: 'auto', fontSize: '11px', color: '#F97316' }}
                      >
                        Get Directions
                      </Button>
                    </Flex>
                  )}
                </Space>
              </div>
            </Card>

            {/* Public Presence Controls */}
            <Card
              bordered={false}
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Title level={5} style={{ margin: '0 0 2px 0', fontWeight: 700 }}>
                Public Presence
              </Title>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '16px' }}>
                Share your digital QR Menu with customers.
              </Text>

              {/* URL Display */}
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9', marginBottom: '16px' }}>
                <Text style={{ fontSize: '12px', wordBreak: 'break-all', fontWeight: 500, color: '#334155' }}>
                  {publicUrl}
                </Text>
              </div>

              {/* Buttons Grid */}
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Button
                    type="default"
                    icon={<ExportOutlined />}
                    href={publicUrl}
                    target="_blank"
                    block
                    style={{ borderRadius: '6px', fontSize: '12px' }}
                  >
                    Open Menu
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="default"
                    icon={<CopyOutlined />}
                    onClick={handleCopyLink}
                    block
                    style={{ borderRadius: '6px', fontSize: '12px' }}
                  >
                    Copy Link
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="default"
                    icon={<ShareAltOutlined />}
                    onClick={handleShareMenu}
                    block
                    style={{ borderRadius: '6px', fontSize: '12px' }}
                  >
                    Share Menu
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => setIsQrModalOpen(true)}
                    block
                    style={{ borderRadius: '6px', fontSize: '12px' }}
                  >
                    View QR
                  </Button>
                </Col>
                <Col span={24}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadQR}
                    block
                    style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '6px', fontSize: '12px' }}
                  >
                    Download QR
                  </Button>
                </Col>
              </Row>

              {/* Last Updated Timestamp */}
              {formattedLastUpdated && (
                <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Last Updated: {formattedLastUpdated}
                  </Text>
                </div>
              )}
            </Card>

          </Space>
        </Col>

      </Row>

      {/* QR Code Modal for viewing */}
      <Modal
        title={`${formValues.restaurantName || 'Restaurant'} QR Menu`}
        open={isQrModalOpen}
        onCancel={() => setIsQrModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsQrModalOpen(false)}>Close</Button>,
          <Button key="download" type="primary" style={{ background: '#F97316', borderColor: '#F97316' }} onClick={handleDownloadQR}>Download PNG</Button>
        ]}
        centered
        width={340}
      >
        <Flex vertical align="center" justify="center" gap={16} style={{ padding: '20px 0' }}>
          <QRCodeCanvas
            id="preview-qr-canvas"
            value={publicUrl}
            size={220}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
          <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
            Customers can scan this QR code to view your digital menu on their mobile devices.
          </Text>
        </Flex>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Progress, Input, Button, Upload, Flex, Typography, Space, Empty, Spin, Switch, Row, Col, message, Select, InputNumber, Badge } from 'antd';
import {
  ShopOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  CameraOutlined,
  CopyOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../store/auth.store';
import { restaurantService } from '../services/restaurant.service';
import { menuService } from '../services/menu.service';
import { QRCodeCanvas } from 'qrcode.react';
import logoIcon from '../assets/logo-icon.png';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';

const { Title, Text, Paragraph } = Typography;

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { restaurant, setAuth, accessToken } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // STEP 2: Restaurant Info State
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [openingTime, setOpeningTime] = useState('10:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [slug, setSlug] = useState('');

  // STEP 3: Branding State
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState('#F97316');

  // STEP 4: Category List State
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  // STEP 5: Menu Items State
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemDescription, setItemDescription] = useState('');
  const [itemIsVeg, setItemIsVeg] = useState(true);
  const [itemImage, setItemImage] = useState<string | null>(null);

  // STEP 6: QR Template
  const [qrTemplate, setQrTemplate] = useState('minimal');
  const [publicUrl, setPublicUrl] = useState('');

  // Fetch initial profile & data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const profRes = await restaurantService.getProfile();
        const rData = profRes.data;

        // Auto-resume from backend saved progress
        if (rData.onboardingStep) {
          setCurrentStep(rData.onboardingStep);
        }

        setRestaurantName(rData.restaurantName || '');
        setPhone(rData.phone || '');
        setEmail(rData.email || '');
        setAddress(rData.address || '');
        setGoogleMapsUrl(rData.googleMapsUrl || '');
        setOpeningTime(rData.openingTime || '10:00');
        setClosingTime(rData.closingTime || '22:00');
        setSlug(rData.slug || '');
        
        if (rData.logoUrl) setLogoPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${rData.logoUrl}`);
        if (rData.coverImageUrl) setCoverPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${rData.coverImageUrl}`);

        // Fetch categories & items
        const catRes = await menuService.getCategories();
        setCategories(catRes.data);
        if (catRes.data.length > 0) {
          setSelectedCategoryId(catRes.data[0].id);
        }

        const itemsRes = await menuService.getItems();
        setMenuItems(itemsRes.data);

        // Fetch QR details
        const qrRes = await menuService.getQRCodeData();
        setPublicUrl(qrRes.data.publicUrl);

      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Sync / Auto-save step in backend
  const saveProgress = async (nextStep: number) => {
    try {
      await restaurantService.updateProfile({ onboardingStep: nextStep });
      if (restaurant && accessToken) {
        setAuth({ ...restaurant, onboardingStep: nextStep }, accessToken);
      }
      setCurrentStep(nextStep);
    } catch (err) {
      console.error('Failed to save onboarding progress:', err);
    }
  };

  // Step 2 Submission (Profile details)
  const handleSaveProfile = async () => {
    if (!restaurantName.trim()) return message.error('Restaurant Name is required.');
    if (!phone.trim()) return message.error('Phone number is required.');

    setLoading(true);
    try {
      await restaurantService.updateProfile({
        restaurantName,
        phone,
        email,
        address,
        googleMapsUrl,
        openingTime,
        closingTime,
      });
      message.success('Restaurant information saved.');
      saveProgress(3);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to save information.');
    } finally {
      setLoading(false);
    }
  };

  // Image Upload helpers
  const handleLogoUpload = async (file: File) => {
    setLoading(true);
    try {
      const res = await restaurantService.uploadImage(file);
      await restaurantService.updateProfile({ logoUrl: res.data.imageUrl });
      setLogoPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${res.data.imageUrl}`);
      message.success('Logo uploaded successfully.');
    } catch (err) {
      message.error('Failed to upload logo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setLoading(true);
    try {
      const res = await restaurantService.uploadImage(file);
      await restaurantService.updateProfile({ coverImageUrl: res.data.imageUrl });
      setCoverPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${res.data.imageUrl}`);
      message.success('Cover image uploaded.');
    } catch (err) {
      message.error('Failed to upload cover image.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Category Quick Add Templates
  const quickAddCategory = async (name: string) => {
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return message.warning(`Category "${name}" already exists.`);
    }
    try {
      const res = await menuService.createCategory(name);
      setCategories((prev) => [...prev, res.data]);
      if (!selectedCategoryId) {
        setSelectedCategoryId(res.data.id);
      }
      message.success(`Added "${name}"`);
    } catch (err) {
      message.error('Failed to add category.');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await menuService.createCategory(newCategoryName);
      setCategories((prev) => [...prev, res.data]);
      setNewCategoryName('');
      if (!selectedCategoryId) {
        setSelectedCategoryId(res.data.id);
      }
      message.success('Category created.');
    } catch (err) {
      message.error('Failed to create category.');
    }
  };

  // Step 5: Add Menu Item
  const handleAddItem = async () => {
    if (!selectedCategoryId) return message.error('Please select or add a category first.');
    if (!itemName.trim()) return message.error('Item name is required.');
    if (itemPrice <= 0) return message.error('Please enter a valid price.');

    try {
      const res = await menuService.createItem({
        name: itemName,
        price: itemPrice,
        description: itemDescription,
        categoryId: selectedCategoryId,
        isVeg: itemIsVeg,
        isAvailable: true,
        imageUrl: itemImage,
      });
      setMenuItems((prev) => [...prev, res.data]);
      setItemName('');
      setItemPrice(0);
      setItemDescription('');
      setItemImage(null);
      message.success('Menu item added successfully.');
    } catch (err) {
      message.error('Failed to add menu item.');
    }
  };

  // Capacitor integrations for step 8
  const handleCopyLink = async () => {
    if (Capacitor.isNativePlatform()) {
      await Clipboard.write({ string: publicUrl });
    } else {
      navigator.clipboard.writeText(publicUrl);
    }
    message.success('Public URL copied to clipboard');
  };

  const handleShare = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: restaurantName,
          text: `Checkout our digital menu online:`,
          url: publicUrl,
        });
      } catch (e) {
        // Ignored
      }
    }
  };

  // Download QR Code layout
  const downloadQR = () => {
    const canvas = document.getElementById('onboarding-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${slug}-qr-menu.png`;
      link.click();
      message.success('QR downloaded successfully.');
    }
  };

  const completeOnboarding = async () => {
    try {
      await restaurantService.updateProfile({ onboardingStep: 8, onboardingCompleted: true });
      if (restaurant && accessToken) {
        setAuth({ ...restaurant, onboardingStep: 8, onboardingCompleted: true }, accessToken);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      navigate('/dashboard', { replace: true });
    }
  };

  if (loading && currentStep === 1) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <Spin size="large" tip="Loading onboarding..." />
      </Flex>
    );
  }

  // Progress calculations
  const totalSteps = 8;
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '40px 16px' }}>
      
      {/* Confetti styles & shimmer keyframes */}
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .pop-card {
          animation: pop 0.4s ease-out;
        }
      `}</style>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        {/* Step Indicator */}
        {currentStep < 8 && (
          <div style={{ marginBottom: '24px' }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
              <Text strong style={{ color: '#475569', fontSize: '14px' }}>Step {currentStep} of {totalSteps}</Text>
              <Text strong style={{ color: '#F97316' }}>{progressPercent}% Complete</Text>
            </Flex>
            <Progress percent={progressPercent} strokeColor="#F97316" showInfo={false} />
          </div>
        )}

        <Card bordered={false} className="pop-card" style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(15,23,42,0.04)', overflow: 'hidden' }}>
          
          {/* STEP 1: Welcome Splash */}
          {currentStep === 1 && (
            <Flex vertical gap={24} align="center" style={{ textAlign: 'center', padding: '20px 12px' }}>
              <div style={{ background: '#FFF7ED', width: '80px', height: '80px', borderRadius: '40px', display: 'flex', alignContent: 'center', justifyItems: 'center', alignItems: 'center', justifyContent: 'center' }}>
                <ShopOutlined style={{ fontSize: '36px', color: '#F97316' }} />
              </div>
              <div>
                <Title level={2} style={{ margin: '0 0 8px 0', fontWeight: 800 }}>Welcome to Restaurant OS</Title>
                <Paragraph type="secondary" style={{ fontSize: '15px' }}>
                  Let's publish your digital interactive menu and QR codes in under 10 minutes.
                </Paragraph>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', width: '100%', border: '1px solid #E2E8F0' }}>
                <Text strong style={{ color: '#475569' }}>⏰ Estimated setup time: 5–10 Minutes</Text>
              </div>

              <Button type="primary" size="large" onClick={() => saveProgress(2)} block style={{ height: '48px', borderRadius: '12px', background: '#F97316', borderColor: '#F97316', fontSize: '16px', fontWeight: 700 }}>
                Start Setup
              </Button>
            </Flex>
          )}

          {/* STEP 2: Restaurant details */}
          {currentStep === 2 && (
            <Flex vertical gap={24}>
              <div>
                <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Restaurant Information</Title>
                <Text type="secondary">Enter the public details customers will see on your menu.</Text>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <Text strong style={{ fontSize: '13px' }}>Restaurant Name *</Text>
                  <Input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} size="large" placeholder="e.g. Punjabi Tadka" style={{ marginTop: '6px', borderRadius: '8px' }} />
                </div>

                <div>
                  <Text strong style={{ fontSize: '13px' }}>Phone Number *</Text>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} size="large" placeholder="e.g. +91 9876543210" style={{ marginTop: '6px', borderRadius: '8px' }} />
                </div>

                <div>
                  <Text strong style={{ fontSize: '13px' }}>Cuisine type</Text>
                  <Input value={cuisine} onChange={(e) => setCuisine(e.target.value)} size="large" placeholder="e.g. Indian, Chinese" style={{ marginTop: '6px', borderRadius: '8px' }} />
                </div>

                <div>
                  <Text strong style={{ fontSize: '13px' }}>Email address</Text>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} size="large" placeholder="e.g. contact@restaurant.com" style={{ marginTop: '6px', borderRadius: '8px' }} />
                </div>

                <div>
                  <Text strong style={{ fontSize: '13px' }}>Address</Text>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} size="large" placeholder="e.g. Shop 4, MG Road, New Delhi" style={{ marginTop: '6px', borderRadius: '8px' }} />
                </div>

                <div>
                  <Text strong style={{ fontSize: '13px' }}>Google Maps URL</Text>
                  <Input value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)} size="large" placeholder="Paste maps link" style={{ marginTop: '6px', borderRadius: '8px' }} />
                </div>
              </div>

              <Flex gap={12}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(1)} style={{ borderRadius: '10px' }} />
                <Button type="primary" size="large" onClick={handleSaveProfile} block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '12px' }}>
                  Continue
                </Button>
              </Flex>
            </Flex>
          )}

          {/* STEP 3: Branding */}
          {currentStep === 3 && (
            <Flex vertical gap={24}>
              <div>
                <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Branding & Styling</Title>
                <Text type="secondary">Upload your logo and cover banner image to customize look.</Text>
              </div>

              {/* Logo upload */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Restaurant Logo</Text>
                <Flex align="center" gap={16}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', background: '#F1F5F9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShopOutlined style={{ fontSize: '24px', color: '#94A3B8' }} />
                    </div>
                  )}
                  <Upload beforeUpload={(file) => { handleLogoUpload(file); return false; }} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Upload Logo</Button>
                  </Upload>
                </Flex>
              </div>

              {/* Cover upload */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Cover Banner Image</Text>
                <Flex align="center" gap={16}>
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" style={{ width: '160px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '160px', height: '80px', background: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CameraOutlined style={{ fontSize: '24px', color: '#94A3B8' }} />
                    </div>
                  )}
                  <Upload beforeUpload={(file) => { handleCoverUpload(file); return false; }} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>Upload Cover Banner</Button>
                  </Upload>
                </Flex>
              </div>

              {/* Theme color picker */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Brand Color Accent</Text>
                <Flex gap={8} wrap="wrap">
                  {['#F97316', '#DC2626', '#16A34A', '#2563EB', '#7C3AED', '#0F172A'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setThemeColor(col)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '18px',
                        background: col,
                        border: themeColor === col ? '3px solid #000000' : '1px solid #E2E8F0',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Flex>
              </div>

              <Flex gap={12}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(2)} style={{ borderRadius: '10px' }} />
                <Button type="primary" size="large" onClick={() => saveProgress(4)} block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '12px' }}>
                  Continue
                </Button>
              </Flex>
            </Flex>
          )}

          {/* STEP 4: Create Categories */}
          {currentStep === 4 && (
            <Flex vertical gap={24}>
              <div>
                <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Create Categories</Title>
                <Text type="secondary">Group your items by adding categories like Appetizers, Starters, or Desserts.</Text>
              </div>

              {/* Quick Template chips */}
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>Suggested Categories (Click to Add):</Text>
                <Flex gap={8} wrap="wrap">
                  {['Starters', 'Main Course', 'Desserts', 'Beverages', 'Chinese', 'Italian'].map((suggested) => (
                    <Button key={suggested} size="small" style={{ borderRadius: '12px' }} onClick={() => quickAddCategory(suggested)}>
                      + {suggested}
                    </Button>
                  ))}
                </Flex>
              </div>

              {/* Add category form */}
              <Flex gap={8}>
                <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Type custom category name e.g. Breads" size="large" style={{ borderRadius: '8px' }} />
                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleAddCategory} style={{ background: '#F97316', borderColor: '#F97316' }} />
              </Flex>

              {/* Created category list */}
              {categories.length > 0 ? (
                <Card size="small" style={{ background: '#F8FAFC', borderRadius: '12px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Your Categories ({categories.length}):</Text>
                  <Flex gap={6} wrap="wrap">
                    {categories.map((c) => (
                      <span key={c.id} style={{ background: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
                        {c.name}
                      </span>
                    ))}
                  </Flex>
                </Card>
              ) : (
                <Empty description="No categories added yet. Click suggestions above to start." />
              )}

              <Flex gap={12}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(3)} style={{ borderRadius: '10px' }} />
                <Button type="primary" size="large" onClick={() => saveProgress(5)} disabled={categories.length === 0} block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '12px' }}>
                  Continue
                </Button>
              </Flex>
            </Flex>
          )}

          {/* STEP 5: Add Menu Items */}
          {currentStep === 5 && (
            <Flex vertical gap={24}>
              <div>
                <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Add Menu Items</Title>
                <Text type="secondary">Add food items with pricing, description, and veg indicators.</Text>
              </div>

              {/* Add Item form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <Text strong style={{ fontSize: '12px' }}>Select Category</Text>
                  <Select value={selectedCategoryId} onChange={(val) => setSelectedCategoryId(val)} size="large" style={{ width: '100%', marginTop: '6px' }}>
                    {categories.map((c) => (
                      <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text strong style={{ fontSize: '12px' }}>Item Name *</Text>
                  <Input value={itemName} onChange={(e) => setItemName(e.target.value)} size="large" placeholder="e.g. Butter Paneer Masala" style={{ marginTop: '6px', borderRadius: '8px' }} />
                </div>

                <Row gutter={12}>
                  <Col span={12}>
                    <Text strong style={{ fontSize: '12px' }}>Price (₹) *</Text>
                    <InputNumber min={1} value={itemPrice} onChange={(val) => setItemPrice(val || 0)} style={{ width: '100%', marginTop: '6px' }} size="large" />
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>Type Badge</Text>
                    <Switch checked={itemIsVeg} onChange={(val) => setItemIsVeg(val)} checkedChildren="🌱 VEG" unCheckedChildren="🔴 NON-VEG" />
                  </Col>
                </Row>

                <div>
                  <Text strong style={{ fontSize: '12px' }}>Short Description</Text>
                  <Input.TextArea value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} rows={2} placeholder="Brief details about preparation, ingredients etc." style={{ marginTop: '6px', borderRadius: '8px' }} />
                </div>

                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddItem} style={{ background: '#F97316', borderColor: '#F97316' }}>
                  Add Item to Menu
                </Button>
              </div>

              {/* Progress counter */}
              <div style={{ textAlign: 'center' }}>
                <Badge count={`${menuItems.length} items added`} style={{ backgroundColor: '#10B981' }} />
              </div>

              <Flex gap={12}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(4)} style={{ borderRadius: '10px' }} />
                <Button type="primary" size="large" onClick={() => saveProgress(6)} disabled={menuItems.length === 0} block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '12px' }}>
                  Continue
                </Button>
              </Flex>
            </Flex>
          )}

          {/* STEP 6: Generate QR */}
          {currentStep === 6 && (
            <Flex vertical gap={24} align="center" style={{ textAlign: 'center' }}>
              <div style={{ width: '100%', textAlign: 'left' }}>
                <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Verify Menu QR Code</Title>
                <Text type="secondary">Choose style overlays and download for printing.</Text>
              </div>

              {/* Select template styling */}
              <Flex gap={8} wrap="wrap" justify="center">
                {['minimal', 'luxury', 'cafe', 'dark'].map((t) => (
                  <Button
                    key={t}
                    type={qrTemplate === t ? 'primary' : 'default'}
                    onClick={() => setQrTemplate(t)}
                    size="small"
                    style={{ borderRadius: '12px', textTransform: 'capitalize' }}
                  >
                    {t}
                  </Button>
                ))}
              </Flex>

              {/* QR Render box */}
              <div style={{
                background: qrTemplate === 'dark' ? '#0F172A' : '#FFFFFF',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Text strong style={{ color: qrTemplate === 'dark' ? '#FFFFFF' : '#000000', marginBottom: '12px' }}>{restaurantName}</Text>
                <QRCodeCanvas
                  id="onboarding-qr-canvas"
                  value={publicUrl}
                  size={160}
                  level="H"
                  fgColor={qrTemplate === 'dark' ? '#F8FAFC' : qrTemplate === 'luxury' ? '#854D0E' : '#0F172A'}
                  bgColor={qrTemplate === 'dark' ? '#0F172A' : '#FFFFFF'}
                  imageSettings={{
                    src: logoIcon,
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
                <Text style={{ fontSize: '11px', color: qrTemplate === 'dark' ? '#94A3B8' : '#64748B', marginTop: '12px', fontWeight: 600 }}>Scan to View Menu</Text>
              </div>

              <Button icon={<DownloadOutlined />} onClick={downloadQR} block style={{ borderRadius: '10px' }}>
                Download High-Resolution PNG
              </Button>

              <Flex gap={12} style={{ width: '100%' }}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(5)} style={{ borderRadius: '10px' }} />
                <Button type="primary" size="large" onClick={() => saveProgress(7)} block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '12px' }}>
                  Continue
                </Button>
              </Flex>
            </Flex>
          )}

          {/* STEP 7: Preview Public Menu */}
          {currentStep === 7 && (
            <Flex vertical gap={24}>
              <div>
                <Title level={3} style={{ margin: '0 0 4px 0', fontWeight: 800 }}>Preview Digital Menu</Title>
                <Text type="secondary">Review formatting details before launching live to customers.</Text>
              </div>

              {/* Simple card preview of public menu styling */}
              <Card style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }} bodyStyle={{ padding: '20px' }}>
                <Flex align="center" gap={12}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '56px', height: '56px', background: '#F97316', borderRadius: '12px', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}><ShopOutlined /></div>
                  )}
                  <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{restaurantName}</Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{cuisine || 'Multi-cuisine'} | {address || 'Location specified'}</Text>
                  </div>
                </Flex>

                <div style={{ marginTop: '20px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Menu Summary Check:</Text>
                  <Space direction="vertical">
                    <Text type="secondary">• Categories created: {categories.length}</Text>
                    <Text type="secondary">• Total items added: {menuItems.length}</Text>
                  </Space>
                </div>
              </Card>

              <Flex gap={12}>
                <Button size="large" icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(6)} style={{ borderRadius: '10px' }} />
                <Button type="primary" size="large" onClick={() => saveProgress(8)} block style={{ background: '#10B981', borderColor: '#10B981', borderRadius: '12px' }}>
                  Publish Menu Live! 🎉
                </Button>
              </Flex>
            </Flex>
          )}

          {/* STEP 8: Success Congrats Screen */}
          {currentStep === 8 && (
            <Flex vertical gap={24} align="center" style={{ textAlign: 'center', padding: '20px 12px' }}>
              <div style={{ fontSize: '64px' }}>🎉</div>
              <div>
                <Title level={2} style={{ margin: '0 0 8px 0', fontWeight: 800, color: '#10B981' }}>Congratulations!</Title>
                <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Your Restaurant is Live</Title>
              </div>

              <div style={{ width: '100%', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <Text strong style={{ display: 'block', color: '#475569', marginBottom: '8px', fontSize: '13px' }}>Customer Link URL:</Text>
                <Flex gap={8} align="center" justify="center">
                  <Text ellipsis style={{ maxWidth: '280px', color: '#F97316', fontWeight: 600 }}>{publicUrl}</Text>
                  <Button size="small" icon={<CopyOutlined />} onClick={handleCopyLink} />
                  <Button size="small" icon={<ShareAltOutlined />} onClick={handleShare} />
                </Flex>
              </div>

              <div style={{ display: 'inline-block', padding: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px' }}>
                <QRCodeCanvas
                  value={publicUrl}
                  size={120}
                  level="H"
                />
              </div>

              <Button type="primary" size="large" onClick={completeOnboarding} block style={{ height: '48px', borderRadius: '12px', background: '#F97316', borderColor: '#F97316', fontSize: '16px', fontWeight: 700 }}>
                Go To Dashboard
              </Button>
            </Flex>
          )}

        </Card>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import {
  Card,
  List,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Switch,
  Typography,
  Empty,
  Popconfirm,
  Statistic,
  Space,
  Flex,
  Row,
  Col,
  Drawer,
  Radio,
  message,
  Grid,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '../services/menu.service.js';
import type { Category, MenuItem } from '../types/menu.js';

const { Title, Text, Paragraph } = Typography;

// Zod item validation schema
const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Item name is too long'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  price: z.coerce.number().positive('Price must be a positive number'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional().nullable(),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export const Menu: React.FC = () => {
  const queryClient = useQueryClient();
  const screens = Grid.useBreakpoint();
  const drawerWidth = screens.md ? 450 : '100%';

  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Queries
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => menuService.getCategories(),
  });

  const { data: itemsData, isLoading: loadingItems } = useQuery({
    queryKey: ['items'],
    queryFn: () => menuService.getItems(),
  });

  const categories = categoriesData?.data || [];
  const items = itemsData?.data || [];

  // Derived Stats
  const totalCategories = categories.length;
  const totalItems = items.length;
  const availableItems = items.filter((i) => i.isAvailable).length;
  const unavailableItems = items.filter((i) => !i.isAvailable).length;

  // React Hook Form for Items
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      imageUrl: '',
      isVeg: true,
      isAvailable: true,
    },
  });

  // Automatically select first category if none is selected
  React.useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  // Mutations - Categories
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => menuService.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      setCategoryNameInput('');
      message.success('Category created successfully');
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to create category');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => menuService.updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryNameInput('');
      message.success('Category updated successfully');
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update category');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => menuService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setSelectedCategoryId(null);
      message.success('Category deleted successfully');
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to delete category');
    },
  });

  // Mutations - Items
  const createItemMutation = useMutation({
    mutationFn: (data: any) => menuService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setIsItemModalOpen(false);
      reset();
      setUploadedImageUrl(null);
      message.success('Item created successfully');
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to create item');
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => menuService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setIsItemModalOpen(false);
      setEditingItem(null);
      reset();
      setUploadedImageUrl(null);
      message.success('Item updated successfully');
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update item');
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => menuService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      message.success('Item deleted successfully');
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to delete item');
    },
  });

  const toggleItemAvailableMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      menuService.updateItem(id, { isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      message.success('Item availability toggled');
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to toggle availability');
    },
  });

  // Handlers - Categories
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryNameInput('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category);
    setCategoryNameInput(category.name);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryNameInput.trim()) {
      return message.error('Category name is required');
    }
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, name: categoryNameInput });
    } else {
      createCategoryMutation.mutate(categoryNameInput);
    }
  };

  const handleDeleteCategory = (categoryId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const hasItems = items.some((item) => item.categoryId === categoryId);

    if (hasItems) {
      Modal.confirm({
        title: 'Delete Category',
        icon: <ExclamationCircleOutlined style={{ color: '#F97316' }} />,
        content: 'This category contains items. Deleting it will permanently remove all items inside it. Do you want to continue?',
        okText: 'Yes, Delete All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          deleteCategoryMutation.mutate(categoryId);
        },
      });
    } else {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  // Handlers - Items
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setUploadedImageUrl(null);
    reset({
      name: '',
      description: '',
      price: undefined,
      categoryId: selectedCategoryId || '',
      imageUrl: '',
      isVeg: true,
      isAvailable: true,
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setUploadedImageUrl(item.imageUrl);
    reset({
      name: item.name,
      description: item.description,
      price: Number(item.price),
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (values: ItemFormValues) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data: values });
    } else {
      createItemMutation.mutate(values);
    }
  };

  // Upload Handlers
  const handleImageUpload = async (file: File) => {
    // 1. File Type Validation
    const isAllowedType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    if (!isAllowedType) {
      message.error('Only JPG, PNG, and WEBP image files are allowed!');
      return false;
    }

    // 2. File Size Validation
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }

    setUploadingImage(true);
    try {
      const response = await menuService.uploadImage(file);
      const { imageUrl } = response.data;
      setUploadedImageUrl(imageUrl);
      setValue('imageUrl', imageUrl, { shouldValidate: true });
      message.success('Image uploaded successfully');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }

    return false; // Stop automatic upload
  };

  // Filter Items
  const filteredItems = items.filter((item) => {
    const matchesCategory = item.categoryId === selectedCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCategoryName = categories.find((c) => c.id === selectedCategoryId)?.name || 'Items';

  return (
    <div style={{ padding: '32px 24px' }} className="menu-builder-container">
      <style>{`
        @media (max-width: 768px) {
          .menu-builder-container .ant-card {
            min-height: auto !important;
          }
        }
        @media (max-width: 576px) {
          .menu-builder-container {
            padding: 16px 12px !important;
          }
          .menu-item-list .ant-list-item {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .menu-item-list .ant-list-item-meta {
            width: 100% !important;
            display: flex !important;
            align-items: flex-start !important;
          }
          .menu-item-list .ant-list-item-meta-content {
            width: 100% !important;
            flex: 1 !important;
            min-width: 0 !important;
          }
          .menu-item-list .ant-list-item-extra {
            margin-left: 0 !important;
            margin-top: 12px !important;
            width: 100% !important;
            justify-content: flex-end !important;
            display: flex !important;
            gap: 12px;
          }
          .menu-builder-container .ant-card-body {
            padding: 16px !important;
          }
        }
      `}</style>
      {/* Top Header Section */}
      <Flex align="center" justify="space-between" style={{ marginBottom: '24px' }}>
        <div>
          <Title level={2} style={{ margin: '0 0 4px 0', letterSpacing: '-0.5px', fontWeight: 700 }}>
            Menu Builder
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Build and manage your restaurant categories and items.
          </Text>
        </div>
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => setIsPreviewOpen(true)}
          size="large"
        >
          Preview Menu
        </Button>
      </Flex>

      {/* Dynamic Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Statistic title="Total Categories" value={totalCategories} valueStyle={{ color: '#F97316', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Statistic title="Total Items" value={totalItems} valueStyle={{ fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Statistic title="Available Items" value={availableItems} valueStyle={{ color: '#52C41A', fontWeight: 700 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <Statistic title="Unavailable Items" value={unavailableItems} valueStyle={{ color: '#FF4D4F', fontWeight: 700 }} />
          </Card>
        </Col>
      </Row>

      {/* Workspace Panel */}
      <Row gutter={24}>
        {/* Left Side: Categories */}
        <Col xs={24} md={8} style={{ marginBottom: '24px' }}>
          <Card
            title="Categories"
            bordered={false}
            extra={
              <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleOpenAddCategory}>
                Add
              </Button>
            }
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)', height: '100%', minHeight: '500px' }}
          >
            {loadingCategories ? (
              <Empty description="Loading Categories..." />
            ) : categories.length === 0 ? (
              <Empty description="No Categories found. Click Add to create one." />
            ) : (
              <List
                dataSource={categories}
                renderItem={(category) => (
                  <List.Item
                    onClick={() => setSelectedCategoryId(category.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      background: selectedCategoryId === category.id ? '#FFF7ED' : 'transparent',
                      borderBottom: 'none',
                      marginBottom: '4px',
                      border: selectedCategoryId === category.id ? '1px solid #FED7AA' : '1px solid transparent',
                    }}
                  >
                    <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                      <Text strong={selectedCategoryId === category.id} style={{ color: selectedCategoryId === category.id ? '#C2410C' : '#334155' }}>
                        {category.name}
                      </Text>
                      <Space>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined style={{ color: '#64748B' }} />}
                          onClick={(e) => handleOpenEditCategory(category, e)}
                        />
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => handleDeleteCategory(category.id, e)}
                        />
                      </Space>
                    </Flex>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Right Side: Items */}
        <Col xs={24} md={16}>
          <Card
            title={activeCategoryName}
            bordered={false}
            extra={
              selectedCategoryId && (
                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleOpenAddItem}>
                  Add Item
                </Button>
              )
            }
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)', minHeight: '500px' }}
          >
            {!selectedCategoryId ? (
              <Empty description="Select or create a category to view items." />
            ) : (
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {/* Search Bar */}
                <Input
                  prefix={<SearchOutlined style={{ color: '#BFBFBF' }} />}
                  placeholder="Search items by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ height: '40px' }}
                />

                {loadingItems ? (
                  <Empty description="Loading Items..." />
                ) : filteredItems.length === 0 ? (
                  <Empty description="No items found. Add items to this category to get started." />
                ) : (
                  <List
                    className="menu-item-list"
                    itemLayout="horizontal"
                    dataSource={filteredItems}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          background: '#FFFFFF',
                          padding: '16px',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                          border: '1px solid #F0F0F0',
                        }}
                        extra={
                          <Space size={16}>
                            <Flex vertical align="end" gap={6}>
                              <Text type="secondary" style={{ fontSize: '12px' }}>Available</Text>
                              <Switch
                                size="small"
                                checked={item.isAvailable}
                                loading={toggleItemAvailableMutation.isPending}
                                onChange={(checked) =>
                                  toggleItemAvailableMutation.mutate({ id: item.id, isAvailable: checked })
                                }
                              />
                            </Flex>
                            <Button
                              type="text"
                              icon={<EditOutlined style={{ color: '#64748B' }} />}
                              onClick={() => handleOpenEditItem(item)}
                            />
                            <Popconfirm
                              title="Delete Item"
                              description="Are you sure you want to permanently delete this item?"
                              okText="Delete"
                              cancelText="Cancel"
                              okButtonProps={{ danger: true }}
                              onConfirm={() => deleteItemMutation.mutate(item.id)}
                            >
                              <Button type="text" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                          </Space>
                        }
                      >
                        <List.Item.Meta
                          avatar={
                            item.imageUrl ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.imageUrl}`}
                                alt={item.name}
                                style={{
                                  width: '64px',
                                  height: '64px',
                                  borderRadius: '6px',
                                  objectFit: 'cover',
                                  border: '1px solid #E2E8F0',
                                }}
                              />
                            ) : null
                          }
                          title={
                            <Flex align="center" gap={8} wrap="wrap" style={{ width: '100%' }}>
                              <Text strong style={{ fontSize: '15px', color: '#1E293B' }}>{item.name}</Text>
                              <span
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: item.isVeg ? '#F0FDF4' : '#FEF2F2',
                                  color: item.isVeg ? '#16A34A' : '#DC2626',
                                  border: item.isVeg ? '1px solid #BBF7D0' : '1px solid #FECACA',
                                }}
                              >
                                {item.isVeg ? 'VEG' : 'NON-VEG'}
                              </span>
                            </Flex>
                          }
                          description={
                            <Flex vertical gap={4} style={{ marginTop: '4px', width: '100%' }}>
                              <Text strong style={{ color: '#F97316', fontSize: '15px' }}>
                                ₹{Number(item.price).toFixed(2)}
                              </Text>
                              {item.description && (
                                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: '13px' }}>
                                  {item.description}
                                </Paragraph>
                              )}
                            </Flex>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      {/* Category Modal (Add / Edit) */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={isCategoryModalOpen}
        onOk={handleSaveCategory}
        onCancel={() => setIsCategoryModalOpen(false)}
        confirmLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
        okText="Save"
      >
        <Form layout="vertical" style={{ marginTop: '16px' }}>
          <Form.Item label="Category Name" required>
            <Input
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              placeholder="e.g. Beverages"
              maxLength={50}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Item Modal (Add / Edit) */}
      <Modal
        title={editingItem ? 'Edit Item' : 'Add Item'}
        open={isItemModalOpen}
        onOk={handleSubmit(handleSaveItem)}
        onCancel={() => setIsItemModalOpen(false)}
        confirmLoading={createItemMutation.isPending || updateItemMutation.isPending}
        okText="Save"
        okButtonProps={{ disabled: !isValid }}
        width={500}
      >
        <Form layout="vertical" style={{ marginTop: '16px' }} requiredMark={false}>
          <Form.Item label="Item Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message} required>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="e.g. Margherita Pizza" maxLength={100} />}
            />
          </Form.Item>

          <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input.TextArea
                  value={value || ''}
                  onChange={onChange}
                  placeholder="Describe your item details, ingredients..."
                  maxLength={500}
                  rows={3}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Price (₹)" validateStatus={errors.price ? 'error' : ''} help={errors.price?.message} required>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={0.01} step={0.5} style={{ width: '100%' }} placeholder="249.00" />
              )}
            />
          </Form.Item>

          {/* Local Image Upload */}
          <Form.Item label="Item Image">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              disabled={uploadingImage}
            >
              {uploadedImageUrl ? (
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${uploadedImageUrl}`}
                  alt="Uploaded preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <div>
                  {uploadingImage ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '8px' }}>
              Allowed formats: JPG, PNG, WEBP. Max size: 2MB.
            </Text>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Food Type">
                <Controller
                  name="isVeg"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
                      <Radio.Button value={true}>VEG</Radio.Button>
                      <Radio.Button value={false}>NON-VEG</Radio.Button>
                    </Radio.Group>
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Available">
                <Controller
                  name="isAvailable"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch checked={value} onChange={onChange} />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Live Preview Drawer */}
      <Drawer
        title="Guest Menu Live Preview"
        placement="right"
        onClose={() => setIsPreviewOpen(false)}
        open={isPreviewOpen}
        width={drawerWidth}
        bodyStyle={{ background: '#F8FAFC', padding: '24px 16px' }}
      >
        {categories.length === 0 ? (
          <Empty description="No categories or items to preview." />
        ) : (
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {categories.map((category) => {
              const categoryItems = items.filter((i) => i.categoryId === category.id && i.isAvailable);

              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id}>
                  <Title
                    level={5}
                    style={{
                      borderBottom: '2px solid #F1F5F9',
                      paddingBottom: '8px',
                      color: '#1E293B',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {category.name}
                  </Title>
                  <List
                    dataSource={categoryItems}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          padding: '12px 0',
                          borderBottom: '1px solid #F1F5F9',
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            item.imageUrl ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.imageUrl}`}
                                alt={item.name}
                                style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                              />
                            ) : null
                          }
                          title={
                            <Flex align="center" justify="space-between">
                              <Space size={6}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: item.isVeg ? '#16A34A' : '#DC2626',
                                  }}
                                />
                                <Text strong style={{ color: '#0F172A', fontSize: '14px' }}>{item.name}</Text>
                              </Space>
                              <Text strong style={{ color: '#F97316', fontSize: '14px' }}>
                                ₹{Number(item.price).toFixed(2)}
                              </Text>
                            </Flex>
                          }
                          description={
                            item.description ? (
                              <Paragraph type="secondary" style={{ margin: 0, fontSize: '12px', lineHeight: '1.4' }}>
                                {item.description}
                              </Paragraph>
                            ) : null
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
      </Drawer>
    </div>
  );
};

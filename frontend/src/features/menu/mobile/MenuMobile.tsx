import React from 'react';
import {
  Card,
  Button,
  Switch,
  Typography,
  Empty,
  Input,
  Drawer,
  Form,
  InputNumber,
  Radio,
  Flex,
  Collapse,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { Controller } from 'react-hook-form';
import type { Category, MenuItem } from '../../../types/menu';
import { FoodVegIndicator } from '../../../components/FoodVegIndicator';
import { Capacitor } from '@capacitor/core';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface MenuMobileProps {
  menuData: any; // Return type of useMenu hook
}

export const MenuMobile: React.FC<MenuMobileProps> = ({ menuData }) => {
  const {
    categories,
    items,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    isItemModalOpen,
    setIsItemModalOpen,
    editingItem,
    uploadingImage,
    uploadedImageUrl,
    control,
    handleSubmit,
    errors,
    isValid,
    handleOpenAddItem,
    handleOpenEditItem,
    handleSaveItem,
    handleImageUpload,
    pickAndUploadImage,
    toggleItemAvailableMutation,
    deleteItemMutation,
  } = menuData;

  const isNative = Capacitor.isNativePlatform();

  // Group items by category for mobile accordion rendering
  const getItemsByCategory = (categoryId: string) => {
    return items.filter(
      (item: MenuItem) =>
        item.categoryId === categoryId &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div style={{ padding: '16px 12px', minHeight: '100%' }}>
      {/* Search Bar - Sticky style */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#F8FAFC',
          paddingBottom: '12px',
          marginBottom: '16px',
        }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
          allowClear
          style={{
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 4px rgba(15, 23, 42, 0.02)',
            height: '48px',
          }}
        />
      </div>

      {/* Accordion List Categories */}
      {categories.length === 0 ? (
        <Empty
          description="No categories created yet."
          style={{ marginTop: '48px' }}
        />
      ) : (
        <Collapse
          accordion
          ghost
          activeKey={selectedCategoryId || undefined}
          onChange={(key) => setSelectedCategoryId(Array.isArray(key) ? key[0] : key)}
          expandIconPosition="end"
          style={{ background: 'transparent' }}
        >
          {categories.map((category: Category) => {
            const categoryItems = getItemsByCategory(category.id);
            return (
              <Panel
                header={
                  <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: '16px', color: '#0F172A', wordBreak: 'break-word' }}>
                      {category.name}
                    </Text>
                    <span
                      style={{
                        background: '#E2E8F0',
                        color: '#475569',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {categoryItems.length}
                    </span>
                  </Flex>
                }
                key={category.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                }}
              >
                {categoryItems.length === 0 ? (
                  <Empty
                    description="No matching items in this category."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {categoryItems.map((item: MenuItem) => (
                      <Card
                        key={item.id}
                        bodyStyle={{ padding: '12px' }}
                        style={{
                          borderRadius: '8px',
                          border: '1px solid #F1F5F9',
                          background: '#FAFAFA',
                        }}
                      >
                        <Flex gap={12} align="start">
                          {/* Item Image */}
                          {item.imageUrl ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.imageUrl}`}
                              alt={item.name}
                              loading="lazy"
                              style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '8px',
                                background: '#E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CameraOutlined style={{ fontSize: '20px', color: '#94A3B8' }} />
                            </div>
                          )}

                          {/* Details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Flex justify="space-between" align="start">
                              <div>
                                <Flex gap={6} align="center" style={{ marginBottom: '4px' }}>
                                  <FoodVegIndicator isVeg={item.isVeg} />
                                  <Text strong style={{ fontSize: '15px', color: '#0F172A' }}>
                                    {item.name}
                                  </Text>
                                </Flex>
                                <Text strong style={{ color: '#F97316', fontSize: '14px' }}>
                                  ₹{Number(item.price).toFixed(2)}
                                </Text>
                              </div>

                              {/* Availability Switch */}
                              <Switch
                                checked={item.isAvailable}
                                size="small"
                                loading={toggleItemAvailableMutation.isPending}
                                onChange={(checked) =>
                                  toggleItemAvailableMutation.mutate({
                                    id: item.id,
                                    isAvailable: checked,
                                  })
                                }
                              />
                            </Flex>

                            {item.description && (
                              <Paragraph
                                ellipsis={{ rows: 2 }}
                                type="secondary"
                                style={{ fontSize: '11px', margin: '6px 0 0 0' }}
                              >
                                {item.description}
                              </Paragraph>
                            )}

                            {/* Actions */}
                            <Flex justify="end" gap={12} style={{ marginTop: '12px' }}>
                              <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleOpenEditItem(item)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                loading={deleteItemMutation.isPending}
                                onClick={() => deleteItemMutation.mutate(item.id)}
                              >
                                Delete
                              </Button>
                            </Flex>
                          </div>
                        </Flex>
                      </Card>
                    ))}
                  </div>
                )}
              </Panel>
            );
          })}
        </Collapse>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleOpenAddItem}
        style={{
          position: 'fixed',
          bottom: 'calc(80px + env(safe-area-inset-bottom))',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          background: '#F97316',
          color: '#FFFFFF',
          border: 'none',
          outline: 'none',
          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          zIndex: 100,
          cursor: 'pointer',
        }}
      >
        <PlusOutlined />
      </button>

      {/* Slid-up Bottom Sheet Form Editor */}
      <Drawer
        title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        placement="bottom"
        height="85%"
        onClose={() => setIsItemModalOpen(false)}
        open={isItemModalOpen}
        bodyStyle={{ padding: '20px 16px' }}
        headerStyle={{ borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}
        style={{ borderRadius: '16px 16px 0 0' }}
      >
        <Form layout="vertical" onFinish={handleSubmit(handleSaveItem)}>
          {/* Item Name */}
          <Form.Item label="Item Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="e.g. Butter Chicken" size="large" />}
            />
          </Form.Item>

          {/* Price */}
          <Form.Item label="Price (₹)" validateStatus={errors.price ? 'error' : ''} help={errors.price?.message}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} size="large" min={0} />}
            />
          </Form.Item>

          {/* Category Selection */}
          <Form.Item label="Category" validateStatus={errors.categoryId ? 'error' : ''} help={errors.categoryId?.message}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categories.map((c: Category) => (
                    <Radio.Button key={c.id} value={c.id} style={{ borderRadius: '6px' }}>
                      {c.name}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              )}
            />
          </Form.Item>

          {/* Veg / Non-Veg */}
          <Form.Item label="Food Type">
            <Controller
              name="isVeg"
              control={control}
              render={({ field }) => (
                <Radio.Group
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value={true}>Vegetarian</Radio.Button>
                  <Radio.Button value={false}>Non-Vegetarian</Radio.Button>
                </Radio.Group>
              )}
            />
          </Form.Item>

          {/* Image Picker */}
          <Form.Item label="Food Image">
            <Flex gap={12} align="center">
              {isNative && (
                <Button icon={<CameraOutlined />} size="large" onClick={pickAndUploadImage} loading={uploadingImage}>
                  Take Photo
                </Button>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                style={{ display: isNative ? 'none' : 'block' }}
              />
            </Flex>
            {uploadedImageUrl && (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${uploadedImageUrl}`}
                alt="Upload preview"
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '12px' }}
              />
            )}
          </Form.Item>

          {/* Description */}
          <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} value={field.value || ''} placeholder="Describe the item ingredients, portion size, etc." rows={3} />
              )}
            />
          </Form.Item>

          {/* Availability */}
          <Form.Item label="Available">
            <Controller
              name="isAvailable"
              control={control}
              render={({ field }) => <Switch checked={field.value} onChange={(checked) => field.onChange(checked)} />}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block disabled={!isValid} style={{ height: '48px', background: '#F97316', borderColor: '#F97316' }}>
            Save Item
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

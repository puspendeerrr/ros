import React from 'react';
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Controller } from 'react-hook-form';
import type { Category, MenuItem } from '../../../types/menu';

const { Title, Text, Paragraph } = Typography;

interface MenuDesktopProps {
  menuData: any; // Return type of useMenu hook
}

export const MenuDesktop: React.FC<MenuDesktopProps> = ({ menuData }) => {
  const {
    categories,
    items,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    isPreviewOpen,
    setIsPreviewOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    editingCategory,
    categoryNameInput,
    setCategoryNameInput,
    isItemModalOpen,
    setIsItemModalOpen,
    editingItem,
    uploadingImage,
    uploadedImageUrl,
    totalCategories,
    totalItems,
    availableItems,
    unavailableItems,
    filteredItems,
    activeCategoryName,
    control,
    handleSubmit,
    errors,
    isValid,
    handleOpenAddCategory,
    handleOpenEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
    handleOpenAddItem,
    handleOpenEditItem,
    handleSaveItem,
    handleImageUpload,
    toggleItemAvailableMutation,
    deleteItemMutation,
  } = menuData;

  return (
    <div style={{ padding: '32px 24px' }}>
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
            {categories.length === 0 ? (
              <Empty description="No Categories found. Click Add to create one." />
            ) : (
              <List
                dataSource={categories}
                renderItem={(category: Category) => (
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
                      <Text strong={selectedCategoryId === category.id} style={{ color: selectedCategoryId === category.id ? '#C2410C' : '#334155', wordBreak: 'break-word', flex: 1, minWidth: 0 }}>
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

                {filteredItems.length === 0 ? (
                  <Empty description="No items found. Add items to this category to get started." />
                ) : (
                  <List
                    className="menu-item-list"
                    itemLayout="horizontal"
                    dataSource={filteredItems}
                    renderItem={(item: MenuItem) => (
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
                                loading="lazy"
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
        confirmLoading={false}
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
        confirmLoading={false}
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
        width={450}
        bodyStyle={{ background: '#F8FAFC', padding: '24px 16px' }}
      >
        {categories.length === 0 ? (
          <Empty description="No categories or items to preview." />
        ) : (
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {categories.map((category: Category) => {
              const categoryItems = items.filter((i: MenuItem) => i.categoryId === category.id && i.isAvailable);

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
                    renderItem={(item: MenuItem) => (
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
                                loading="lazy"
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

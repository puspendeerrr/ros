import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Upload,
  Image,
  Popconfirm,
  Row,
  Col,
  Space,
  Tag,
  Empty,
  Spin,
  message,
  Tooltip,
} from 'antd';
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HolderOutlined,
  EyeOutlined,
  InboxOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService, type GalleryImage } from '../services/restaurant.service.js';
import { useAuthStore } from '../store/auth.store.js';
import { getImageUrl } from '../utils/image.js';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

export const Gallery: React.FC = () => {
  const queryClient = useQueryClient();
  const { restaurant } = useAuthStore();
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Fetch current gallery images
  const {
    data: galleryResponse,
    isLoading,
  } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => restaurantService.getGallery(),
  });

  const images: GalleryImage[] = galleryResponse?.data || [];

  // 2. Mutations
  const reorderMutation = useMutation({
    mutationFn: (imageIds: string[]) => restaurantService.reorderGallery(imageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      message.success('Gallery order updated');
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to update gallery order');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: string) => restaurantService.deleteGalleryImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      message.success('Photo removed from gallery');
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to delete photo');
    },
  });

  // 3. File upload handler (supports multiple files)
  const handleUpload = async (fileList: File[]) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    try {
      await restaurantService.uploadGallery(fileList);
      message.success(
        fileList.length === 1
          ? 'Image uploaded successfully'
          : `${fileList.length} images uploaded successfully`
      );
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // 4. Reorder Helpers
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newOrder = [...images];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    const imageIds = newOrder.map((img) => img.id);
    reorderMutation.mutate(imageIds);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) {
      setDraggedIdx(null);
      return;
    }

    const newOrder = [...images];
    const [moved] = newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIndex, 0, moved);

    setDraggedIdx(null);
    const imageIds = newOrder.map((img) => img.id);
    reorderMutation.mutate(imageIds);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header section */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          gap: '16px',
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, color: '#0F172A', fontWeight: 800 }}>
            Photo Gallery
          </Title>
          <Text style={{ color: '#64748B', fontSize: '14px' }}>
            Showcase your restaurant ambience, dining spaces, and signature dishes on your public menu.
          </Text>
        </div>

        {restaurant?.slug && (
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/r/${restaurant.slug}`, '_blank')}
            style={{ borderRadius: '8px', fontWeight: 600 }}
          >
            View Live Menu
          </Button>
        )}
      </div>

      {/* Upload Drop Zone Card */}
      <Card
        style={{
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Dragger
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          showUploadList={false}
          disabled={isUploading}
          beforeUpload={(_, fileList) => {
            // Validate all files
            const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
            const validFiles: File[] = [];

            for (const f of fileList) {
              if (!allowedMime.includes(f.type)) {
                message.error(`${f.name} is not a valid JPG, PNG, or WEBP image.`);
                continue;
              }
              if (f.size > 5 * 1024 * 1024) {
                message.error(`${f.name} exceeds the 5 MB maximum size limit.`);
                continue;
              }
              validFiles.push(f);
            }

            if (validFiles.length > 0) {
              handleUpload(validFiles);
            }
            return false; // Prevent automatic antd post
          }}
          style={{
            padding: '32px 16px',
            background: '#F8FAFC',
            borderRadius: '12px',
            border: '2px dashed #CBD5E1',
          }}
        >
          <p className="ant-upload-drag-icon" style={{ marginBottom: '12px' }}>
            {isUploading ? (
              <Spin size="large" />
            ) : (
              <InboxOutlined style={{ color: '#F97316', fontSize: '48px' }} />
            )}
          </p>
          <p
            className="ant-upload-text"
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: '4px',
            }}
          >
            {isUploading ? 'Uploading photos...' : 'Click or drag photos here to upload'}
          </p>
          <p className="ant-upload-hint" style={{ color: '#64748B', fontSize: '13px' }}>
            Supports JPG, JPEG, PNG, or WEBP • Maximum 5 MB per image • Upload multiple files at once
          </p>
        </Dragger>
      </Card>

      {/* Gallery Grid Section */}
      <Card
        style={{
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '16px',
          }}
        >
          <Space align="center" size={8}>
            <PictureOutlined style={{ fontSize: '18px', color: '#F97316' }} />
            <Text strong style={{ fontSize: '16px', color: '#1E293B' }}>
              Uploaded Photos
            </Text>
            <Tag color="orange" style={{ borderRadius: '12px', fontWeight: 700 }}>
              {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
            </Tag>
          </Space>

          {images.length > 1 && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Drag cards or use arrow buttons to arrange order
            </Text>
          )}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '12px', color: '#64748B' }}>Loading gallery photos...</div>
          </div>
        ) : images.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Paragraph strong style={{ margin: '8px 0 4px', color: '#334155' }}>
                  No photos in your gallery yet
                </Paragraph>
                <Paragraph type="secondary" style={{ fontSize: '13px', margin: 0 }}>
                  Upload photos of your dining hall, interior, or dishes to attract visitors on your public QR menu.
                </Paragraph>
              </div>
            }
            style={{ padding: '40px 0' }}
          />
        ) : (
          <Image.PreviewGroup>
            <Row gutter={[16, 16]}>
              {images.map((image, index) => {
                const resolvedUrl = getImageUrl(image.url);

                return (
                  <Col xs={24} sm={12} md={8} lg={6} xl={6} key={image.id}>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      style={{
                        height: '100%',
                        opacity: draggedIdx === index ? 0.4 : 1,
                        cursor: 'grab',
                        transition: 'transform 0.2s, opacity 0.2s',
                      }}
                    >
                      <Card
                        hoverable
                        styles={{ body: { padding: '12px' } }}
                        style={{
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          background: '#FFFFFF',
                        }}
                      >
                        {/* Image Preview Container */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '4/3',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#F1F5F9',
                            marginBottom: '10px',
                          }}
                        >
                          <Image
                            src={resolvedUrl}
                            alt={image.title || `Gallery photo ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            wrapperStyle={{
                              width: '100%',
                              height: '100%',
                            }}
                          />
                          <Tag
                            color="rgba(15, 23, 42, 0.75)"
                            style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              margin: 0,
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              border: 'none',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            #{index + 1}
                          </Tag>
                        </div>

                        {/* Controls Toolbar */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '6px',
                            borderTop: '1px solid #F1F5F9',
                          }}
                        >
                          {/* Reordering Directional Controls */}
                          <Space size={4}>
                            <Tooltip title="Move Left">
                              <Button
                                size="small"
                                icon={<ArrowLeftOutlined />}
                                disabled={index === 0 || reorderMutation.isPending}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveImage(index, 'left');
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Move Right">
                              <Button
                                size="small"
                                icon={<ArrowRightOutlined />}
                                disabled={index === images.length - 1 || reorderMutation.isPending}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveImage(index, 'right');
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Drag to reorder">
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  color: '#94A3B8',
                                  padding: '0 4px',
                                  cursor: 'grab',
                                }}
                              >
                                <HolderOutlined />
                              </span>
                            </Tooltip>
                          </Space>

                          {/* Delete Confirmation */}
                          <Popconfirm
                            title="Delete photo?"
                            description="Are you sure you want to remove this photo from your gallery?"
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
                            onConfirm={() => deleteMutation.mutate(image.id)}
                          >
                            <Button
                              danger
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              style={{ color: '#EF4444' }}
                            />
                          </Popconfirm>
                        </div>
                      </Card>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Image.PreviewGroup>
        )}
      </Card>
    </div>
  );
};

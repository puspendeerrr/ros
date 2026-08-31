import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { menuService } from '../../../services/menu.service';
import type { Category, MenuItem } from '../../../types/menu';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Item name is too long'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
  price: z.coerce.number().positive('Price must be a positive number'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional().nullable(),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

export const useMenu = () => {
  const queryClient = useQueryClient();

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

  // Haptic feedback trigger helper
  const triggerHaptic = async (style = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (e) {
        // Ignored
      }
    }
  };

  // Mutations - Categories
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => menuService.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      setCategoryNameInput('');
      message.success('Category created successfully');
      triggerHaptic(ImpactStyle.Medium);
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
      triggerHaptic(ImpactStyle.Medium);
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
      triggerHaptic(ImpactStyle.Medium);
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
      triggerHaptic(ImpactStyle.Medium);
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
      triggerHaptic(ImpactStyle.Medium);
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
      triggerHaptic(ImpactStyle.Medium);
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
      triggerHaptic(ImpactStyle.Light);
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

  // Image Upload - Web & Capacitor Camera picker support
  const pickAndUploadImage = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Uri,
        });

        if (image.webPath) {
          setUploadingImage(true);
          const response = await fetch(image.webPath);
          const blob = await response.blob();
          const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

          const uploadRes = await menuService.uploadImage(file);
          const { imageUrl } = uploadRes.data;
          setUploadedImageUrl(imageUrl);
          setValue('imageUrl', imageUrl, { shouldValidate: true });
          message.success('Image uploaded via camera successfully');
          triggerHaptic(ImpactStyle.Light);
        }
      } catch (err: any) {
        if (err.message !== 'User cancelled photos app') {
          message.error('Native photo picking failed');
        }
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    const isAllowedType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    if (!isAllowedType) {
      message.error('Only JPG, PNG, and WEBP image files are allowed!');
      return false;
    }

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
      triggerHaptic(ImpactStyle.Light);
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

  return {
    categories,
    items,
    loadingCategories,
    loadingItems,
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
    setUploadedImageUrl,
    totalCategories,
    totalItems,
    availableItems,
    unavailableItems,
    filteredItems,
    activeCategoryName,
    control,
    handleSubmit,
    setValue,
    reset,
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
    pickAndUploadImage,
    toggleItemAvailableMutation,
    deleteItemMutation,
  };
};

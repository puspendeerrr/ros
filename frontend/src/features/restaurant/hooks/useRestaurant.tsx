import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { restaurantService } from '../../../services/restaurant.service';
import type { RestaurantProfile } from '../../../services/restaurant.service';
import { menuService } from '../../../services/menu.service';
import { useAuthStore } from '../../../store/auth.store';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useRestaurant = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { restaurant: authRestaurant, setAuth, accessToken } = useAuthStore();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
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

  // Sync isDirty with window.hasUnsavedChanges
  useEffect(() => {
    (window as any).hasUnsavedChanges = isDirty;
    return () => {
      (window as any).hasUnsavedChanges = false;
    };
  }, [isDirty]);

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

  // 3. Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (values: Partial<RestaurantProfile>) => restaurantService.updateProfile(values),
    onSuccess: (res) => {
      message.success('Restaurant profile saved successfully!');
      queryClient.setQueryData(['restaurant-profile'], res);
      triggerHaptic(ImpactStyle.Medium);

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

  // Handle native camera photo upload
  const pickAndUploadNativeImage = async (type: 'logo' | 'cover') => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Uri,
        });

        if (image.webPath) {
          if (type === 'logo') setUploadingLogo(true);
          else setUploadingCover(true);

          const response = await fetch(image.webPath);
          const blob = await response.blob();
          const file = new File([blob], `${type}.jpg`, { type: 'image/jpeg' });

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
          triggerHaptic(ImpactStyle.Light);
        }
      } catch (err: any) {
        if (err.message !== 'User cancelled photos app') {
          message.error('Native picker upload failed');
        }
      } finally {
        setUploadingLogo(false);
        setUploadingCover(false);
      }
    }
  };

  // Handle image upload helper for web file input
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
      triggerHaptic(ImpactStyle.Light);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Upload failed');
    }
    return false; // prevent default upload action
  };

  const handleValuesChange = () => {
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

  // Copy URL to clipboard - utilizing Capacitor Clipboard on native
  const handleCopyLink = async () => {
    if (Capacitor.isNativePlatform()) {
      await Clipboard.write({
        string: publicUrl,
      });
    } else {
      navigator.clipboard.writeText(publicUrl);
    }
    message.success('Public Menu link copied to clipboard!');
    triggerHaptic(ImpactStyle.Light);
  };

  // Share using Web/Capacitor Share API
  const handleShareMenu = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: formValues.restaurantName || 'Restaurant Menu',
          text: `Checkout the digital menu of ${formValues.restaurantName || 'our restaurant'}!`,
          url: publicUrl,
          dialogTitle: 'Share Menu QR link',
        });
        triggerHaptic(ImpactStyle.Light);
      } catch (err) {
        console.log('Native share failed:', err);
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: formValues.restaurantName || 'Restaurant Menu',
          text: `Checkout the digital menu of ${formValues.restaurantName || 'our restaurant'}!`,
          url: publicUrl,
        });
      } catch (err) {
        console.log('Web share failed:', err);
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
    triggerHaptic(ImpactStyle.Light);
  };

  const locationParts = [formValues.address, formValues.city, formValues.state, formValues.country].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Address not specified';

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

  return {
    form,
    profile,
    isProfileLoading,
    logoPreview,
    coverPreview,
    isDirty,
    isQrModalOpen,
    setIsQrModalOpen,
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
    pickAndUploadNativeImage,
    handleValuesChange,
    handleSave,
    handleCopyLink,
    handleShareMenu,
    handleDownloadQR,
    slug,
    formValues,
  };
};

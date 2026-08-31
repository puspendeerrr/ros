import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import { menuService } from '../../../services/menu.service';
import { useAuthStore } from '../../../store/auth.store';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';

export interface QRItem {
  id: string;
  name: string;
  type: 'restaurant' | 'table' | 'bulk';
  tableNumber?: string;
  publicUrl: string;
  folder: string;
  status: 'active' | 'archived' | 'disabled';
  createdAt: string;
  template: string;
  fgColor: string;
  bgColor: string;
}

export const useQRStudio = () => {
  const { restaurant } = useAuthStore();
  
  // Guided step wizard state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1: QR Type selection
  const [qrType, setQrType] = useState<'restaurant' | 'table' | 'bulk'>('restaurant');
  const [singleTableNumber, setSingleTableNumber] = useState<string>('1');
  const [bulkStart, setBulkStart] = useState<number>(1);
  const [bulkEnd, setBulkEnd] = useState<number>(10);
  const [selectedFolder, setSelectedFolder] = useState<string>('Restaurant');

  // STEP 2: Template selection
  const [activeTemplate, setActiveTemplate] = useState<string>('minimal');

  // STEP 3: Simple Branding & Simple Customization
  const [restaurantName, setRestaurantName] = useState<string>(restaurant?.restaurantName || 'My Restaurant');
  const [scanMessage, setScanMessage] = useState<string>('Scan to View Menu');
  const [showTableNumber, setShowTableNumber] = useState<boolean>(true);
  const [logoSize, setLogoSize] = useState<number>(30);
  const [logoPadding, setLogoPadding] = useState<number>(4);
  const [dotsType, setDotsType] = useState<'rounded' | 'square'>('square');
  const [cornersType, setCornersType] = useState<'square' | 'rounded' | 'extra-rounded'>('square');
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [fgColor, setFgColor] = useState<string>('#0F172A');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  // STEP 4: Live Preview aspects
  const [previewAspect, setPreviewAspect] = useState<'qr' | 'sticker' | 'tent' | 'a4' | 'card'>('qr');

  // Fetch base QR data (slug, etc.)
  const { data: qrData, isLoading } = useQuery({
    queryKey: ['qr-code-studio'],
    queryFn: () => menuService.getQRCodeData(),
  });

  const publicUrl = qrData?.data?.publicUrl || '';
  const slug = qrData?.data?.restaurantSlug || 'menu';

  // QR List & History Center (Stateful for management CRUD)
  const [qrList, setQrList] = useState<QRItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  // Load initial restaurant QR
  useEffect(() => {
    if (publicUrl && qrList.length === 0) {
      setQrList([
        {
          id: 'rest-qr-1',
          name: 'Main Restaurant QR',
          type: 'restaurant',
          publicUrl: publicUrl,
          folder: 'Restaurant',
          status: 'active',
          createdAt: new Date().toLocaleDateString(),
          template: 'minimal',
          fgColor: '#0F172A',
          bgColor: '#FFFFFF',
        },
      ]);
    }
  }, [publicUrl]);

  // Handle Template Changes (Updates colors/styling automatically)
  const applyTemplate = (templateName: string) => {
    setActiveTemplate(templateName);
    triggerHaptic(ImpactStyle.Light);
    
    switch (templateName) {
      case 'luxury':
        setFgColor('#854D0E'); // Gold
        setBgColor('#FFFDFB');
        setDotsType('rounded');
        setCornersType('extra-rounded');
        setTransparentBg(false);
        break;
      case 'cafe':
        setFgColor('#451A03'); // Coffee brown
        setBgColor('#FAF8F5');
        setDotsType('rounded');
        setCornersType('rounded');
        setTransparentBg(false);
        break;
      case 'modern':
        setFgColor('#1E3A8A'); // Dark Blue
        setBgColor('#F8FAFC');
        setDotsType('rounded');
        setCornersType('rounded');
        setTransparentBg(false);
        break;
      case 'dark':
        setFgColor('#F8FAFC');
        setBgColor('#0F172A');
        setDotsType('square');
        setCornersType('square');
        setTransparentBg(false);
        break;
      case 'traditional':
        setFgColor('#9A3412'); // Saffron orange
        setBgColor('#FFFBEB');
        setDotsType('rounded');
        setCornersType('rounded');
        setTransparentBg(false);
        break;
      case 'fastfood':
        setFgColor('#DC2626'); // Red
        setBgColor('#FFFBEB');
        setDotsType('square');
        setCornersType('square');
        setTransparentBg(false);
        break;
      case 'minimal-white':
        setFgColor('#000000');
        setBgColor('#FFFFFF');
        setDotsType('square');
        setCornersType('square');
        setTransparentBg(true);
        break;
      case 'minimal':
      default:
        setFgColor('#0F172A');
        setBgColor('#FFFFFF');
        setDotsType('square');
        setCornersType('square');
        setTransparentBg(false);
        break;
    }
  };

  // Helper trigger haptic
  const triggerHaptic = async (style = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (e) {
        // Ignored
      }
    }
  };

  // Generate QR action (Saves it to lists/management history)
  const handleGenerate = () => {
    triggerHaptic(ImpactStyle.Medium);

    if (qrType === 'restaurant') {
      const exists = qrList.some((q) => q.type === 'restaurant');
      if (exists) {
        message.warning('Restaurant QR is already generated.');
        return;
      }
      const newQR: QRItem = {
        id: `rest-${Date.now()}`,
        name: `${restaurantName} Main Menu QR`,
        type: 'restaurant',
        publicUrl,
        folder: selectedFolder,
        status: 'active',
        createdAt: new Date().toLocaleDateString(),
        template: activeTemplate,
        fgColor,
        bgColor,
      };
      setQrList((prev) => [newQR, ...prev]);
      message.success('Main Restaurant QR Code generated.');
    } else if (qrType === 'table') {
      const tableUrl = `${publicUrl}?table=${singleTableNumber}`;
      const newQR: QRItem = {
        id: `tbl-${Date.now()}`,
        name: `Table ${singleTableNumber} QR`,
        type: 'table',
        tableNumber: singleTableNumber,
        publicUrl: tableUrl,
        folder: selectedFolder,
        status: 'active',
        createdAt: new Date().toLocaleDateString(),
        template: activeTemplate,
        fgColor,
        bgColor,
      };
      setQrList((prev) => [newQR, ...prev]);
      message.success(`QR Code for Table ${singleTableNumber} generated.`);
    } else if (qrType === 'bulk') {
      if (bulkStart > bulkEnd) {
        message.error('Start table must be less than or equal to End table.');
        return;
      }
      const totalToGen = bulkEnd - bulkStart + 1;
      if (totalToGen > 100) {
        message.error('Max bulk generation limit is 100 tables at once.');
        return;
      }

      const generated: QRItem[] = [];
      for (let i = bulkStart; i <= bulkEnd; i++) {
        const tableUrl = `${publicUrl}?table=${i}`;
        generated.push({
          id: `bulk-tbl-${i}-${Date.now()}`,
          name: `Table ${i} QR`,
          type: 'table',
          tableNumber: String(i),
          publicUrl: tableUrl,
          folder: selectedFolder,
          status: 'active',
          createdAt: new Date().toLocaleDateString(),
          template: activeTemplate,
          fgColor,
          bgColor,
        });
      }
      setQrList((prev) => [...generated, ...prev]);
      message.success(`Successfully generated QR Codes for ${totalToGen} tables.`);
    }

    // Advance to Preview Step
    setCurrentStep(4);
  };

  // QR List actions (Rename, Duplicate, Archive, Delete)
  const handleRename = (id: string, newName: string) => {
    setQrList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, name: newName } : q))
    );
    message.success('QR renamed successfully.');
  };

  const handleDuplicate = (id: string) => {
    const item = qrList.find((q) => q.id === id);
    if (item) {
      const duplicated: QRItem = {
        ...item,
        id: `${item.id}-dup-${Date.now()}`,
        name: `${item.name} (Copy)`,
        createdAt: new Date().toLocaleDateString(),
      };
      setQrList((prev) => [duplicated, ...prev]);
      message.success('QR duplicated successfully.');
      triggerHaptic(ImpactStyle.Light);
    }
  };

  const handleToggleStatus = (id: string, newStatus: 'active' | 'archived' | 'disabled') => {
    setQrList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
    message.success(`QR status updated to ${newStatus}.`);
  };

  const handleDelete = (id: string) => {
    setQrList((prev) => prev.filter((q) => q.id !== id));
    message.success('QR deleted successfully.');
    triggerHaptic(ImpactStyle.Medium);
  };

  // Capacitor integrations
  const copyLink = async (url: string) => {
    if (Capacitor.isNativePlatform()) {
      await Clipboard.write({ string: url });
    } else {
      navigator.clipboard.writeText(url);
    }
    message.success('Public URL copied to clipboard');
    triggerHaptic(ImpactStyle.Light);
  };

  const shareNative = async (url: string, name: string) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: name,
          text: `Checkout our digital menu using QR Code:`,
          url: url,
        });
        triggerHaptic(ImpactStyle.Light);
      } catch (e) {
        // Ignored
      }
    }
  };

  // Processed lists based on search/filter
  const filteredQRs = qrList.filter((q) => {
    const matchesSearch = q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (q.tableNumber && q.tableNumber.includes(searchQuery));
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesStatus = q.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return {
    currentStep,
    setCurrentStep,
    qrType,
    setQrType,
    singleTableNumber,
    setSingleTableNumber,
    bulkStart,
    setBulkStart,
    bulkEnd,
    setBulkEnd,
    selectedFolder,
    setSelectedFolder,
    activeTemplate,
    applyTemplate,
    restaurantName,
    setRestaurantName,
    scanMessage,
    setScanMessage,
    showTableNumber,
    setShowTableNumber,
    logoSize,
    setLogoSize,
    logoPadding,
    setLogoPadding,
    dotsType,
    setDotsType,
    cornersType,
    setCornersType,
    transparentBg,
    setTransparentBg,
    fgColor,
    setFgColor,
    bgColor,
    setBgColor,
    previewAspect,
    setPreviewAspect,
    publicUrl,
    slug,
    isLoading,
    qrList,
    filteredQRs,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    handleGenerate,
    handleRename,
    handleDuplicate,
    handleToggleStatus,
    handleDelete,
    copyLink,
    shareNative,
    triggerHaptic,
  };
};

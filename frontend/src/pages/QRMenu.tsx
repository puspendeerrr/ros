import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Flex, Space, Input, InputNumber, Popconfirm, Table, Tooltip, message, Spin, Segmented } from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
import { menuService } from '../services/menu.service.js';
import { useAuthStore } from '../store/auth.store.js';
import logoIcon from '../assets/logo-icon.png';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const { Title, Text } = Typography;

interface TableQRItem {
  id: string;
  name: string;
  tableNumber: string;
  publicUrl: string;
}

// 1. Reusable Organic Marketing Footer component
const StandeeFooter: React.FC<{ fgColor: string; isLight: boolean }> = ({ fgColor, isLight }) => (
  <div style={{
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: `1px solid ${isLight ? '#F1F5F9' : '#1E293B'}`,
    textAlign: 'center',
    fontSize: '11px',
    color: isLight ? '#94A3B8' : '#64748B',
    width: '100%',
    lineHeight: '1.4'
  }}>
    <div style={{ fontWeight: 500, color: isLight ? '#94A3B8' : '#64748B' }}>
      Powered by <span style={{ fontWeight: 600, color: fgColor }}>Restaurant OS</span>
    </div>
    <div style={{ fontSize: '10px', color: isLight ? '#94A3B8' : '#64748B' }}>Create your own QR Menu</div>
    <span style={{ color: '#F97316', fontWeight: 700, fontSize: '11px', display: 'inline-block', marginTop: '2px' }}>
      ros.algorithyum.in
    </span>
  </div>
);

// Template definitions
const templates = {
  white: { name: 'Classic White', bg: '#FFFFFF', fg: '#0F172A', accent: '#F97316', border: '#E2E8F0', isLight: true },
  dark: { name: 'Modern Dark', bg: '#0F172A', fg: '#FFFFFF', accent: '#38BDF8', border: '#1E293B', isLight: false },
  wood: { name: 'Cafe Wood', bg: '#FAF7F2', fg: '#451A03', accent: '#D97706', border: '#EFECE6', isLight: true },
  gold: { name: 'Luxury Gold', bg: '#FDFBF7', fg: '#854D0E', accent: '#B45309', border: '#F5ECE1', isLight: true },
  black: { name: 'Minimal Black', bg: '#FFFFFF', fg: '#000000', accent: '#000000', border: '#E2E8F0', isLight: true }
};

// Format layout definitions
const formats = {
  stand: { name: 'Table Stand', width: '310px', height: '480px', borderRadius: '24px' },
  tent: { name: 'Tent Card', width: '290px', height: '530px', borderRadius: '8px' },
  poster: { name: 'A4 Poster', width: '320px', height: '460px', borderRadius: '0px' },
  sticker: { name: 'Sticker', width: '290px', height: '290px', borderRadius: '50%' }
};

export const QRMenu: React.FC = () => {
  const { restaurant } = useAuthStore();
  const [viewMode, setViewMode] = useState<'restaurant' | 'tables'>('restaurant');

  // Custom Standee designer configurations
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('white');
  const [selectedFormat, setSelectedFormat] = useState<keyof typeof formats>('stand');

  // Table QR generator states
  const [tableMode, setTableMode] = useState<'single' | 'bulk'>('single');
  const [singleTable, setSingleTable] = useState<string>('1');
  const [bulkStart, setBulkStart] = useState<number>(1);
  const [bulkEnd, setBulkEnd] = useState<number>(10);
  const [tableList, setTableList] = useState<TableQRItem[]>([]);

  // Fetch QR data details
  const { data: qrData, isLoading } = useQuery({
    queryKey: ['qr-code-studio-simple-marketing'],
    queryFn: () => menuService.getQRCodeData(),
  });

  const publicUrl = qrData?.data?.publicUrl || '';
  const slug = qrData?.data?.restaurantSlug || 'menu';
  const restaurantName = restaurant?.restaurantName || 'My Restaurant';
  const logoUrl = restaurant?.logoUrl 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${restaurant.logoUrl}`
    : null;

  // Sync Table QR list initial default table
  useEffect(() => {
    if (publicUrl && tableList.length === 0) {
      setTableList([
        {
          id: 'tbl-1',
          name: 'Table 1 QR',
          tableNumber: '1',
          publicUrl: `${publicUrl}?table=1`,
        }
      ]);
    }
  }, [publicUrl]);

  // Haptic trigger helper
  const triggerHaptic = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (e) {}
    }
  };

  const handleTemplateChange = (key: keyof typeof templates) => {
    triggerHaptic();
    setSelectedTemplate(key);
  };

  const handleFormatChange = (key: keyof typeof formats) => {
    triggerHaptic();
    setSelectedFormat(key);
  };

  // Bulk / Single Table QR generator
  const handleGenerateTables = () => {
    triggerHaptic();
    if (tableMode === 'single') {
      if (!singleTable.trim()) return message.error('Please enter a table number.');
      const exists = tableList.some((t) => t.tableNumber === singleTable);
      if (exists) return message.warning(`Table ${singleTable} already exists.`);

      const newTbl: TableQRItem = {
        id: `tbl-${Date.now()}`,
        name: `Table ${singleTable} QR`,
        tableNumber: singleTable,
        publicUrl: `${publicUrl}?table=${singleTable}`,
      };
      setTableList((prev) => [newTbl, ...prev]);
      message.success(`Table ${singleTable} QR Code generated.`);
    } else {
      if (bulkStart > bulkEnd) return message.error('Start table must be less than or equal to End table.');
      const total = bulkEnd - bulkStart + 1;
      if (total > 100) return message.error('Max bulk generation limit is 100 tables.');

      const newTables: TableQRItem[] = [];
      for (let i = bulkStart; i <= bulkEnd; i++) {
        const tNum = String(i);
        if (!tableList.some((t) => t.tableNumber === tNum)) {
          newTables.push({
            id: `tbl-bulk-${i}-${Date.now()}`,
            name: `Table ${i} QR`,
            tableNumber: tNum,
            publicUrl: `${publicUrl}?table=${i}`,
          });
        }
      }
      setTableList((prev) => [...newTables, ...prev]);
      message.success(`Generated ${newTables.length} new table QR codes.`);
    }
  };

  // Delete table code
  const handleDeleteTable = (id: string) => {
    setTableList((prev) => prev.filter((t) => t.id !== id));
    message.success('Table QR deleted.');
  };

  // WYSIWYG Standee Canvas Generator
  const drawStandeeCanvas = (subText: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const activeTemp = templates[selectedTemplate];

    // Determine dimensions based on aspect format
    let width = 400;
    let height = 580;
    if (selectedFormat === 'sticker') {
      height = 400;
    } else if (selectedFormat === 'tent') {
      height = 680;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw background
    ctx.fillStyle = activeTemp.bg;
    ctx.fillRect(0, 0, width, height);

    // Draw borders & guides
    if (selectedFormat === 'sticker') {
      // Draw sticker circular safe cut guide line
      ctx.strokeStyle = activeTemp.isLight ? '#CBD5E1' : '#1E293B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(200, 200, 190, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Top color stripe indicator (Not for Minimal Black)
      if (selectedTemplate !== 'black') {
        ctx.fillStyle = activeTemp.accent;
        ctx.fillRect(0, 0, width, 16);
      }
      
      // Dashed fold lines for Tent cards
      if (selectedFormat === 'tent') {
        ctx.strokeStyle = activeTemp.isLight ? '#94A3B8' : '#475569';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(0, 70);
        ctx.lineTo(width, 70);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Centered Title Header
    ctx.fillStyle = activeTemp.fg;
    ctx.textAlign = 'center';
    
    let textY = selectedFormat === 'tent' ? 120 : 65;
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText(restaurantName.substring(0, 24), 200, textY);

    // "Scan QR to View Menu"
    ctx.fillStyle = activeTemp.isLight ? '#64748B' : '#94A3B8';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('SCAN QR TO VIEW MENU', 200, textY + 30);

    // "No App Required"
    ctx.fillStyle = activeTemp.accent;
    ctx.font = '700 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('NO APP REQUIRED', 200, textY + 50);

    // Draw QR Code onto stand
    const qrCanvas = document.getElementById('qr-standee-hidden-canvas') as HTMLCanvasElement;
    if (qrCanvas) {
      const qrSize = selectedFormat === 'sticker' ? 140 : 180;
      const qrX = 200 - (qrSize / 2);
      const qrY = textY + 70;
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
    }

    // Table number badge
    if (subText) {
      const pillY = textY + 280;
      ctx.fillStyle = activeTemp.accent;
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillText(subText.toUpperCase(), 200, pillY);
    }

    // Branding Footer (WYSIWYG identical rendering)
    const footerY = height - 70;
    ctx.strokeStyle = activeTemp.isLight ? '#F1F5F9' : '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, footerY);
    ctx.lineTo(width - 40, footerY);
    ctx.stroke();

    ctx.fillStyle = activeTemp.isLight ? '#94A3B8' : '#64748B';
    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('Powered by Restaurant OS', 200, footerY + 22);

    ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('Create your own QR Menu', 200, footerY + 38);

    ctx.fillStyle = '#F97316';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('ros.algorithyum.in', 200, footerY + 54);

    return canvas;
  };

  const handleDownloadPNG = (subText: string) => {
    const canvas = drawStandeeCanvas(subText);
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${slug}-qr-standee.png`;
    link.click();
    message.success('PNG standee downloaded.');
  };

  const handlePrint = (subText: string) => {
    const canvas = drawStandeeCanvas(subText);
    if (!canvas) return;
    const imgData = canvas.toDataURL('image/png');
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Standee - ${restaurantName}</title>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 98vh;
              margin: 0;
              background: #FFFFFF;
            }
            img {
              max-width: 100%;
              max-height: 95vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" />
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = async (targetUrl: string, name: string) => {
    triggerHaptic();
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({
          title: name,
          text: `Scan this standee QR code to explore Punjabi/Indian menu of ${restaurantName}:`,
          url: targetUrl,
        });
      } catch (e) {}
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Scan this standee QR code to explore Punjabi/Indian menu of ${restaurantName}:`,
          url: targetUrl,
        });
      } catch (e) {}
    } else {
      await Clipboard.write({ string: targetUrl });
      message.success('Link copied to clipboard.');
    }
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" tip="Loading standee designer..." />
      </Flex>
    );
  }

  const activeTemp = templates[selectedTemplate];
  const activeForm = formats[selectedFormat];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Hidden QR Code Canvas used for canvas image drawing */}
      <div style={{ display: 'none' }}>
        <QRCodeCanvas
          id="qr-standee-hidden-canvas"
          value={viewMode === 'restaurant' ? publicUrl : `${publicUrl}?table=${singleTable}`}
          size={350}
          level="H"
          imageSettings={{
            src: logoIcon,
            x: undefined,
            y: undefined,
            height: 48,
            width: 48,
            excavate: true,
          }}
        />
      </div>

      {/* VIEW MODE 1: Restaurant Standee Designer */}
      {viewMode === 'restaurant' && (
        <Flex vertical gap={24} align="center">
          
          {/* Formats Segmented selector */}
          <Segmented
            block
            value={selectedFormat}
            onChange={(val) => handleFormatChange(val as any)}
            options={[
              { label: 'Table Stand', value: 'stand' },
              { label: 'Tent Card', value: 'tent' },
              { label: 'A4 Poster', value: 'poster' },
              { label: 'Sticker', value: 'sticker' },
            ]}
            style={{ width: '100%', maxWidth: '340px' }}
          />

          {/* WYSIWYG Standee Frame Preview */}
          <div style={{
            width: '100%',
            maxWidth: activeForm.width,
            height: activeForm.height,
            background: activeTemp.bg,
            color: activeTemp.fg,
            borderRadius: activeForm.borderRadius,
            boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
            border: `1px solid ${activeTemp.border}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            padding: '24px 16px',
            boxSizing: 'border-box',
            transition: 'all 0.3s'
          }}>
            {/* Top colored band */}
            {selectedFormat !== 'sticker' && selectedTemplate !== 'black' && (
              <div style={{ height: '8px', background: activeTemp.accent, width: '100%', position: 'absolute', top: 0, left: 0 }} />
            )}

            {/* Dash fold lines guides for Tent Cards */}
            {selectedFormat === 'tent' && (
              <div style={{ position: 'absolute', top: '50px', left: 0, right: 0, borderBottom: `1px dashed ${activeTemp.isLight ? '#94A3B8' : '#475569'}`, textAlign: 'center' }}>
                <span style={{ fontSize: '8px', color: activeTemp.accent, fontWeight: 700 }}>FOLD LINE</span>
              </div>
            )}

            {/* Logo */}
            <div style={{ marginTop: selectedFormat === 'tent' ? '50px' : '12px' }}>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={restaurantName}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '3px solid #FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: activeTemp.accent,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  {restaurantName[0]}
                </div>
              )}
            </div>

            {/* Restaurant Details */}
            <Title level={4} style={{ margin: '12px 0 2px 0', fontWeight: 800, color: activeTemp.fg, textAlign: 'center', fontSize: '18px' }}>
              {restaurantName}
            </Title>
            <span style={{ fontSize: '10px', fontWeight: 700, color: activeTemp.isLight ? '#64748B' : '#94A3B8', letterSpacing: '0.8px', marginBottom: '4px' }}>
              SCAN QR TO VIEW MENU
            </span>
            <span style={{ fontSize: '9px', fontWeight: 800, color: activeTemp.accent, letterSpacing: '0.5px', marginBottom: '20px' }}>
              NO APP REQUIRED
            </span>

            {/* QR Canvas frame */}
            <div style={{
              background: '#FFFFFF',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              display: 'inline-flex'
            }}>
              <QRCodeCanvas
                value={publicUrl}
                size={selectedFormat === 'sticker' ? 120 : 160}
                level="H"
                imageSettings={{
                  src: logoIcon,
                  x: undefined,
                  y: undefined,
                  height: 28,
                  width: 28,
                  excavate: true,
                }}
              />
            </div>

            {/* Organic Brand Marketing Footer */}
            <StandeeFooter fgColor={activeTemp.fg} isLight={activeTemp.isLight} />
          </div>

          {/* Quick-ready Template Selection Bar */}
          <div style={{ width: '100%', maxWidth: '340px', marginTop: '12px' }}>
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Select Design Style:</Text>
            <Flex gap={8} wrap="wrap" justify="center">
              {(Object.keys(templates) as Array<keyof typeof templates>).map((key) => {
                const isSelected = selectedTemplate === key;
                return (
                  <Button
                    key={key}
                    onClick={() => handleTemplateChange(key)}
                    type={isSelected ? 'primary' : 'default'}
                    size="small"
                    style={{
                      borderRadius: '12px',
                      background: isSelected ? '#F97316' : '#FFFFFF',
                      borderColor: isSelected ? '#F97316' : '#E2E8F0',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      fontWeight: 600
                    }}
                  >
                    {templates[key].name}
                  </Button>
                );
              })}
            </Flex>
          </div>

          {/* Direct standee actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%', maxWidth: '340px', marginTop: '16px' }}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadPNG('')}
              size="large"
              style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '12px', height: '48px', fontWeight: 600 }}
            >
              Download PNG
            </Button>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={() => handlePrint('')}
              size="large"
              style={{ borderRadius: '12px', height: '48px', fontWeight: 600 }}
            >
              Download PDF
            </Button>
            <Button
              type="default"
              icon={<PrinterOutlined />}
              onClick={() => handlePrint('')}
              size="large"
              style={{ borderRadius: '12px', height: '48px', fontWeight: 600 }}
            >
              Print Standee
            </Button>
            <Button
              type="default"
              icon={<ShareAltOutlined />}
              onClick={() => handleShare(publicUrl, restaurantName)}
              size="large"
              style={{ borderRadius: '12px', height: '48px', fontWeight: 600 }}
            >
              Share QR
            </Button>
          </div>

          {/* Transition link to Table QR panel */}
          <Card bordered={false} style={{ width: '100%', maxWidth: '340px', borderRadius: '16px', background: '#F1F5F9', border: '1px solid #E2E8F0', marginTop: '12px' }} bodyStyle={{ padding: '12px 16px' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text strong style={{ fontSize: '13px', color: '#1E293B', display: 'block' }}>Need Table-wise QR?</Text>
                <Text type="secondary" style={{ fontSize: '11px' }}>Generate individual QR standees per table</Text>
              </div>
              <Button type="link" onClick={() => setViewMode('tables')} style={{ padding: 0, color: '#F97316', fontWeight: 700 }}>
                Generate Table QR →
              </Button>
            </Flex>
          </Card>

        </Flex>
      )}

      {/* VIEW MODE 2: Table QR management */}
      {viewMode === 'tables' && (
        <Flex vertical gap={24}>
          <Flex align="center" gap={8}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => setViewMode('restaurant')} type="text" />
            <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Table QR Configuration</Title>
          </Flex>

          {/* Table standee configurations */}
          <Card bordered={false} style={{ borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              
              <Segmented
                block
                value={tableMode}
                onChange={(val) => setTableMode(val as any)}
                options={[
                  { label: 'Single Table QR', value: 'single' },
                  { label: 'Bulk Tables Pack', value: 'bulk' },
                ]}
              />

              {tableMode === 'single' ? (
                <div>
                  <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Table Number</Text>
                  <Input value={singleTable} onChange={(e) => setSingleTable(e.target.value)} placeholder="e.g. 5" size="large" style={{ borderRadius: '8px' }} />
                </div>
              ) : (
                <Flex gap={12}>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Start Table</Text>
                    <InputNumber min={1} value={bulkStart} onChange={(val) => setBulkStart(val || 1)} style={{ width: '100%', borderRadius: '8px' }} size="large" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>End Table</Text>
                    <InputNumber min={1} value={bulkEnd} onChange={(val) => setBulkEnd(val || 10)} style={{ width: '100%', borderRadius: '8px' }} size="large" />
                  </div>
                </Flex>
              )}

              <Button
                type="primary"
                onClick={handleGenerateTables}
                block
                size="large"
                style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', height: '44px', fontWeight: 600 }}
              >
                Generate Table QRs
              </Button>
            </Space>
          </Card>

          {/* Active List */}
          <Card bordered={false} title={<Text strong style={{ fontSize: '14px', color: '#0F172A' }}>Active Table QR Codes</Text>} style={{ borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <Table
              dataSource={tableList}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
              columns={[
                {
                  title: 'Table Number',
                  dataIndex: 'tableNumber',
                  key: 'tableNumber',
                  render: (val) => <Text strong style={{ color: '#0F172A' }}>Table {val}</Text>
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, record) => (
                    <Space size={8}>
                      <Tooltip title="Download PNG">
                        <Button icon={<DownloadOutlined />} onClick={() => handleDownloadPNG(`TABLE ${record.tableNumber}`)} size="small" />
                      </Tooltip>
                      <Tooltip title="Print stand">
                        <Button icon={<PrinterOutlined />} onClick={() => handlePrint(`TABLE ${record.tableNumber}`)} size="small" />
                      </Tooltip>
                      <Tooltip title="Share Link">
                        <Button icon={<ShareAltOutlined />} onClick={() => handleShare(record.publicUrl, record.name)} size="small" />
                      </Tooltip>
                      <Popconfirm title="Delete QR Code?" onConfirm={() => handleDeleteTable(record.id)}>
                        <Button danger icon={<DeleteOutlined />} size="small" />
                      </Popconfirm>
                    </Space>
                  )
                }
              ]}
            />
          </Card>
        </Flex>
      )}

    </div>
  );
};

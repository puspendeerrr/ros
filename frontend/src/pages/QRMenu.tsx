import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Flex, Space, Input, InputNumber, Popconfirm, Table, Tooltip, message, Spin, Segmented } from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
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

export const QRMenu: React.FC = () => {
  const { restaurant } = useAuthStore();
  const [viewMode, setViewMode] = useState<'restaurant' | 'tables'>('restaurant');

  // Table QR generator states
  const [tableMode, setTableMode] = useState<'single' | 'bulk'>('single');
  const [singleTable, setSingleTable] = useState<string>('1');
  const [bulkStart, setBulkStart] = useState<number>(1);
  const [bulkEnd, setBulkEnd] = useState<number>(10);
  const [tableList, setTableList] = useState<TableQRItem[]>([]);

  // Fetch QR data details
  const { data: qrData, isLoading } = useQuery({
    queryKey: ['qr-code-studio-simple'],
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

  // Actions: Download PNG, PDF, Print, Share
  const handleDownloadPNG = (subText: string) => {
    triggerHaptic();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 580;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 400, 580);

    // Top Brand Accent Stripe
    ctx.fillStyle = '#F97316';
    ctx.fillRect(0, 0, 400, 16);

    // Header Title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.textAlign = 'center';
    ctx.fillText(restaurantName.substring(0, 24), 200, 70);

    // Scan Instruction
    ctx.fillStyle = '#475569';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('SCAN TO VIEW MENU', 200, 110);

    // Render QR Code onto canvas
    const qrCanvas = document.getElementById('qr-hidden-canvas') as HTMLCanvasElement;
    if (qrCanvas) {
      // Draw QR image
      ctx.drawImage(qrCanvas, 75, 140, 250, 250);
    }

    // Subtext table number or custom scan prompts
    if (subText) {
      ctx.fillStyle = '#F97316';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillText(subText.toUpperCase(), 200, 430);
    }

    // Footer OS Branding
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('Powered by Restaurant OS', 200, 510);
    
    ctx.fillStyle = '#F97316';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('restaurantos.in', 200, 535);

    // Link trigger download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${slug}-qr-stand.png`;
    link.click();
  };

  const handlePrint = (subText: string) => {
    triggerHaptic();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Menu - ${restaurantName}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 95vh;
              margin: 0;
              background: #F8FAFC;
            }
            .stand {
              width: 320px;
              background: #FFFFFF;
              border: 1px solid #E2E8F0;
              border-radius: 24px;
              padding: 40px 24px;
              text-align: center;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            }
            .header-accent {
              height: 8px;
              background: #F97316;
              border-radius: 4px;
              width: 60px;
              margin: 0 auto 24px auto;
            }
            h1 { font-size: 24px; margin: 0 0 8px 0; color: #0F172A; font-weight: 800; }
            h2 { font-size: 14px; margin: 0 0 32px 0; color: #64748B; letter-spacing: 1px; font-weight: 700; }
            .qr-wrapper {
              background: #FFFFFF;
              padding: 16px;
              border-radius: 16px;
              border: 1px solid #F1F5F9;
              display: inline-block;
            }
            .pill {
              display: inline-block;
              margin-top: 24px;
              background: #FFF7ED;
              color: #EA580C;
              font-weight: 700;
              font-size: 15px;
              padding: 4px 16px;
              border-radius: 20px;
              border: 1px solid #FFEDD5;
            }
            .footer { margin-top: 40px; font-size: 12px; color: #94A3B8; font-weight: 500; }
            .footer-url { color: #F97316; font-weight: 700; font-size: 13px; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="stand">
            <div class="header-accent"></div>
            <h1>${restaurantName}</h1>
            <h2>SCAN TO VIEW MENU</h2>
            <div class="qr-wrapper">
              <img src="${publicUrl}" id="qr-img" width="220" height="220" />
            </div>
            ${subText ? `<div class="pill">${subText.toUpperCase()}</div>` : ''}
            <div class="footer">Powered by Restaurant OS</div>
            <div class="footer-url">restaurantos.in</div>
          </div>
          <script>
            // Draw QR into img source using window parent canvas
            const parentCanvas = window.opener.document.getElementById('qr-hidden-canvas');
            if (parentCanvas) {
              document.getElementById('qr-img').src = parentCanvas.toDataURL('image/png');
            }
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
          text: `Scan this QR to view the menu for ${restaurantName}:`,
          url: targetUrl,
        });
      } catch (e) {}
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Scan this QR to view the menu for ${restaurantName}:`,
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
        <Spin size="large" tip="Loading your QR Menu..." />
      </Flex>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Hidden QR Code Canvas used for print/image grabs */}
      <div style={{ display: 'none' }}>
        <QRCodeCanvas
          id="qr-hidden-canvas"
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

      {/* VIEW MODE 1: Standard Restaurant QR stand */}
      {viewMode === 'restaurant' && (
        <Flex vertical gap={24} align="center">
          
          {/* Paytm / UPI style stand mockup */}
          <div style={{
            width: '100%',
            maxWidth: '340px',
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* Top orange stripe */}
            <div style={{ height: '12px', background: '#F97316', width: '100%' }} />

            {/* Logo Avatar */}
            <div style={{ marginTop: '24px' }}>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={restaurantName}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '3px solid #FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#F97316',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  {restaurantName[0]}
                </div>
              )}
            </div>

            {/* Restaurant Name */}
            <Title level={4} style={{ margin: '12px 16px 4px 16px', fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
              {restaurantName}
            </Title>

            {/* Instruction prompt */}
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '1px', marginBottom: '24px' }}>
              SCAN TO VIEW MENU
            </span>

            {/* QR Canvas Container */}
            <div style={{
              background: '#FFFFFF',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              display: 'inline-flex'
            }}>
              <QRCodeCanvas
                value={publicUrl}
                size={180}
                level="H"
                imageSettings={{
                  src: logoIcon,
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }}
              />
            </div>

            {/* Stand footer */}
            <div style={{ marginTop: '32px', paddingBottom: '24px', textAlign: 'center' }}>
              <Text style={{ color: '#94A3B8', fontSize: '12px', display: 'block', fontWeight: 500 }}>Powered by Restaurant OS</Text>
              <Text style={{ color: '#F97316', fontSize: '13px', fontWeight: 700, display: 'block', marginTop: '2px' }}>restaurantos.in</Text>
            </div>
          </div>

          {/* Action grid (4 primary items) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%', maxWidth: '340px' }}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadPNG('')}
              size="large"
              style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '12px', height: '48px', fontWeight: 600 }}
            >
              PNG
            </Button>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={() => handlePrint('')}
              size="large"
              style={{ borderRadius: '12px', height: '48px', fontWeight: 600 }}
            >
              PDF
            </Button>
            <Button
              type="default"
              icon={<PrinterOutlined />}
              onClick={() => handlePrint('')}
              size="large"
              style={{ borderRadius: '12px', height: '48px', fontWeight: 600 }}
              block
            >
              Print
            </Button>
            <Button
              type="default"
              icon={<ShareAltOutlined />}
              onClick={() => handleShare(publicUrl, restaurantName)}
              size="large"
              style={{ borderRadius: '12px', height: '48px', fontWeight: 600 }}
            >
              Share
            </Button>
          </div>

          {/* Secondary section navigation */}
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

      {/* VIEW MODE 2: Table-wise QR configuration center */}
      {viewMode === 'tables' && (
        <Flex vertical gap={24}>
          <Flex align="center" gap={8}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => setViewMode('restaurant')} type="text" />
            <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Table QR Configuration</Title>
          </Flex>

          {/* Configuration panel */}
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(15,23,42,0.02)', border: '1px solid #E2E8F0' }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              
              <Segmented
                block
                value={tableMode}
                onChange={(val) => setTableMode(val as any)}
                options={[
                  { label: 'Single Table QR', value: 'single' },
                  { label: 'Bulk Tables Pack', value: 'bulk' },
                ]}
                style={{ marginBottom: '8px' }}
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
                icon={<PlusOutlined />}
                onClick={handleGenerateTables}
                block
                size="large"
                style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px', height: '44px' }}
              >
                Generate Table QRs
              </Button>
            </Space>
          </Card>

          {/* Generated Table QRs List */}
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

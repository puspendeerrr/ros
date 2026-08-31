import React, { useState } from 'react';
import { Card, Button, Radio, Input, Switch, Collapse, InputNumber, Flex, Space, Typography, Popconfirm, Drawer } from 'antd';
import {
  CopyOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import logoIcon from '../../../assets/logo-icon.png';

const { Text } = Typography;
const { Panel } = Collapse;

interface QRStudioMobileProps {
  qrStudioData: any;
}

export const QRStudioMobile: React.FC<QRStudioMobileProps> = ({ qrStudioData }) => {
  const {
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
    activeTemplate,
    applyTemplate,
    restaurantName,
    setRestaurantName,
    scanMessage,
    setScanMessage,
    logoSize,
    transparentBg,
    setTransparentBg,
    fgColor,
    setFgColor,
    bgColor,
    setBgColor,
    previewAspect,
    setPreviewAspect,
    publicUrl,
    filteredQRs,
    searchQuery,
    setSearchQuery,
    handleGenerate,
    handleDelete,
    copyLink,
    shareNative,
  } = qrStudioData;

  const [isManagementOpen, setIsManagementOpen] = useState(false);

  // Download trigger helper
  const triggerDownload = (format: 'png' | 'svg' | 'pdf') => {
    const canvas = document.getElementById('mobile-studio-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/png');
    if (format === 'png') {
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `mobile-qr-${activeTemplate}.png`;
      link.click();
    } else if (format === 'svg') {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><image href="${imgData}" x="0" y="0" height="200" width="200"/></svg>`;
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mobile-qr-${activeTemplate}.svg`;
      link.click();
    } else if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<html><body><img src="${imgData}" /><script>window.print();</script></body></html>`);
      }
    }
  };

  const renderMobileFrame = () => {
    const qrCanvas = (
      <QRCodeCanvas
        id="mobile-studio-canvas"
        value={publicUrl}
        size={130}
        fgColor={fgColor}
        bgColor={transparentBg ? 'transparent' : bgColor}
        level="H"
        imageSettings={{
          src: logoIcon,
          x: undefined,
          y: undefined,
          height: logoSize - 4,
          width: logoSize - 4,
          excavate: true,
        }}
      />
    );

    return (
      <div style={{
        background: transparentBg ? 'transparent' : bgColor,
        padding: '16px',
        borderRadius: '12px',
        border: transparentBg ? '2px dashed #94A3B8' : '1px solid #E2E8F0',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: transparentBg ? 'none' : '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <Text strong style={{ color: fgColor, fontSize: '12px', marginBottom: '8px' }}>{restaurantName}</Text>
        {qrCanvas}
        <Text style={{ color: fgColor, fontSize: '10px', marginTop: '8px', fontWeight: 600 }}>{scanMessage}</Text>
      </div>
    );
  };

  return (
    <div style={{ padding: '16px 12px 80px 12px', minHeight: '100vh', background: '#F8FAFC' }}>
      
      {/* STICKY TOP PREVIEW WRAPPER */}
      <Card
        bordered={false}
        style={{
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          marginBottom: '20px',
          position: 'sticky',
          top: '64px',
          zIndex: 80,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          textAlign: 'center'
        }}
        bodyStyle={{ padding: '12px' }}
      >
        <div style={{ transform: 'scale(0.95)' }}>
          {renderMobileFrame()}
        </div>
        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '6px' }}>
          Aspect Aspect: {previewAspect.toUpperCase()}
        </Text>
      </Card>

      {/* WIZARD CARD STEPS */}
      <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        
        {/* Step Indicator Header */}
        <Flex justify="space-between" align="center" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '16px' }}>
          <Text strong style={{ fontSize: '14px', color: '#0F172A' }}>Step {currentStep} of 5</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {currentStep === 1 && 'QR Type'}
            {currentStep === 2 && 'Design Theme'}
            {currentStep === 3 && 'Branding'}
            {currentStep === 4 && 'Confirm Layout'}
            {currentStep === 5 && 'Download'}
          </Text>
        </Flex>

        {/* STEP 1: Select Type */}
        {currentStep === 1 && (
          <Flex vertical gap={16}>
            <Radio.Group value={qrType} onChange={(e) => setQrType(e.target.value)} style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size={8}>
                <div onClick={() => setQrType('restaurant')} style={{ border: qrType === 'restaurant' ? '2px solid #F97316' : '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', background: '#FFFFFF' }}>
                  <Radio value="restaurant">
                    <Text strong style={{ fontSize: '13px' }}>Main Restaurant QR</Text>
                  </Radio>
                </div>
                <div onClick={() => setQrType('table')} style={{ border: qrType === 'table' ? '2px solid #F97316' : '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', background: '#FFFFFF' }}>
                  <Radio value="table">
                    <Text strong style={{ fontSize: '13px' }}>Table QR Code</Text>
                  </Radio>
                </div>
                <div onClick={() => setQrType('bulk')} style={{ border: qrType === 'bulk' ? '2px solid #F97316' : '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', background: '#FFFFFF' }}>
                  <Radio value="bulk">
                    <Text strong style={{ fontSize: '13px' }}>Bulk Table Generation</Text>
                  </Radio>
                </div>
              </Space>
            </Radio.Group>

            {qrType === 'table' && (
              <Input value={singleTableNumber} onChange={(e) => setSingleTableNumber(e.target.value)} placeholder="Enter Table Number e.g. 5" size="large" />
            )}

            {qrType === 'bulk' && (
              <Flex gap={12}>
                <InputNumber min={1} value={bulkStart} onChange={(val) => setBulkStart(val || 1)} placeholder="Start" style={{ width: '50%' }} size="large" />
                <InputNumber min={1} value={bulkEnd} onChange={(val) => setBulkEnd(val || 10)} placeholder="End" style={{ width: '50%' }} size="large" />
              </Flex>
            )}

            <Button type="primary" size="large" onClick={() => setCurrentStep(2)} block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px' }}>
              Continue
            </Button>
          </Flex>
        )}

        {/* STEP 2: Select Template */}
        {currentStep === 2 && (
          <Flex vertical gap={16}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { key: 'minimal', name: 'Minimal' },
                { key: 'luxury', name: 'Luxury Gold' },
                { key: 'cafe', name: 'Cafe Brown' },
                { key: 'modern', name: 'Modern Blue' },
                { key: 'dark', name: 'Night Slate' },
                { key: 'traditional', name: 'Traditional' },
              ].map((temp) => (
                <button
                  key={temp.key}
                  onClick={() => applyTemplate(temp.key)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: activeTemplate === temp.key ? '2px solid #F97316' : '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {temp.name}
                </button>
              ))}
            </div>

            <Flex gap={8}>
              <Button onClick={() => setCurrentStep(1)} size="large" style={{ borderRadius: '10px' }}>Back</Button>
              <Button type="primary" onClick={() => setCurrentStep(3)} size="large" block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px' }}>
                Next
              </Button>
            </Flex>
          </Flex>
        )}

        {/* STEP 3: Customize Branding */}
        {currentStep === 3 && (
          <Flex vertical gap={16}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600 }}>Restaurant Header Title</label>
              <Input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} size="large" style={{ borderRadius: '8px', marginTop: '4px' }} />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600 }}>Instruction message</label>
              <Input value={scanMessage} onChange={(e) => setScanMessage(e.target.value)} size="large" style={{ borderRadius: '8px', marginTop: '4px' }} />
            </div>

            <Collapse ghost>
              <Panel header="Colors & styling" key="colors">
                <Flex gap={12}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px' }}>Foreground Color</label>
                    <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ height: '36px', padding: 0 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px' }}>Background Color</label>
                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ height: '36px', padding: 0 }} disabled={transparentBg} />
                  </div>
                </Flex>
                
                <div style={{ marginTop: '12px' }}>
                  <Text style={{ fontSize: '12px', marginRight: '12px' }}>Transparent Background</Text>
                  <Switch checked={transparentBg} onChange={(val) => setTransparentBg(val)} />
                </div>
              </Panel>
            </Collapse>

            <Flex gap={8}>
              <Button onClick={() => setCurrentStep(2)} size="large" style={{ borderRadius: '10px' }}>Back</Button>
              <Button type="primary" onClick={handleGenerate} size="large" block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px' }}>
                Generate QR
              </Button>
            </Flex>
          </Flex>
        )}

        {/* STEP 4: Live Preview aspects */}
        {currentStep === 4 && (
          <Flex vertical gap={16}>
            <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
              Confirm your printable layout parameters below.
            </Text>

            <Flex gap={4} wrap="wrap" justify="center">
              {[
                { key: 'qr', label: 'QR Only' },
                { key: 'sticker', label: 'Sticker' },
                { key: 'tent', label: 'Tent Card' },
                { key: 'card', label: 'Card' },
              ].map((aspect) => (
                <Button
                  key={aspect.key}
                  type={previewAspect === aspect.key ? 'primary' : 'default'}
                  onClick={() => setPreviewAspect(aspect.key as any)}
                  size="small"
                  style={{ borderRadius: '12px' }}
                >
                  {aspect.label}
                </Button>
              ))}
            </Flex>

            <Flex gap={8}>
              <Button onClick={() => setCurrentStep(3)} size="large" style={{ borderRadius: '10px' }}>Back</Button>
              <Button type="primary" onClick={() => setCurrentStep(5)} size="large" block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px' }}>
                Next
              </Button>
            </Flex>
          </Flex>
        )}

        {/* STEP 5: Mobile Downloads */}
        {currentStep === 5 && (
          <Flex vertical gap={12}>
            <Button type="primary" icon={<DownloadOutlined />} size="large" onClick={() => triggerDownload('png')} block style={{ background: '#F97316', borderColor: '#F97316', borderRadius: '10px' }}>
              Download High-Res PNG
            </Button>
            <Button icon={<DownloadOutlined />} size="large" onClick={() => triggerDownload('svg')} block style={{ borderRadius: '10px' }}>
              Download Scalable SVG
            </Button>
            <Button size="large" onClick={() => setCurrentStep(1)} block style={{ borderRadius: '10px' }}>
              Create Another Code
            </Button>
          </Flex>
        )}

      </Card>

      {/* Floating trigger to open drawer management tools */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}>
        <Button
          type="primary"
          icon={<FolderOpenOutlined />}
          onClick={() => setIsManagementOpen(true)}
          style={{
            height: '48px',
            borderRadius: '24px',
            background: '#0F172A',
            borderColor: '#0F172A',
            boxShadow: '0 4px 12px rgba(15,23,42,0.15)'
          }}
        >
          Manage QRs
        </Button>
      </div>

      {/* Slide-Up Bottom Sheet Drawer containing history items */}
      <Drawer
        title="QR Management Center"
        placement="bottom"
        onClose={() => setIsManagementOpen(false)}
        open={isManagementOpen}
        height="80%"
        bodyStyle={{ padding: '16px' }}
      >
        <Flex vertical gap={16}>
          <Input
            placeholder="Search table QRs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: '8px' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredQRs.map((item: any) => (
              <Card key={item.id} size="small" style={{ borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <Flex justify="space-between" align="center">
                  <div>
                    <Text strong style={{ fontSize: '13px' }}>{item.name}</Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: '11px' }}>
                      Generated: {item.createdAt} | Folder: {item.folder}
                    </Text>
                  </div>

                  <Space size={4}>
                    <Button icon={<CopyOutlined />} size="small" onClick={() => copyLink(item.publicUrl)} />
                    <Button icon={<ShareAltOutlined />} size="small" onClick={() => shareNative(item.publicUrl, item.name)} />
                    <Popconfirm title="Delete QR Code" onConfirm={() => handleDelete(item.id)}>
                      <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                  </Space>
                </Flex>
              </Card>
            ))}
          </div>
        </Flex>
      </Drawer>

    </div>
  );
};

import React, { useState } from 'react';
import { Card, Steps, Radio, Input, Button, InputNumber, Flex, Space, Typography, Select, Switch, Slider, Tooltip, Collapse, Table, Popconfirm, Form, Row, Col } from 'antd';
import {
  RightOutlined,
  LeftOutlined,
  CopyOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  SwapOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import logoIcon from '../../../assets/logo-icon.png';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface QRStudioDesktopProps {
  qrStudioData: any;
}

export const QRStudioDesktop: React.FC<QRStudioDesktopProps> = ({ qrStudioData }) => {
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
  } = qrStudioData;

  const [renameValue, setRenameValue] = useState<string>('');
  const [renamingId, setRenamingId] = useState<string | null>(null);

  // Download Trigger Handler
  const triggerDownload = (format: 'png' | 'svg' | 'pdf') => {
    const canvas = document.getElementById('studio-qr-canvas') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    if (format === 'png') {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `restaurant-qr-${activeTemplate}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'svg') {
      // Create SVG representation
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="100%" height="100%" fill="${transparentBg ? 'none' : bgColor}"/>
        <!-- Simplified SVG embed -->
        <image href="${canvas.toDataURL('image/png')}" x="0" y="0" height="300" width="300"/>
      </svg>`;
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `restaurant-qr-${activeTemplate}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      // Mock Print trigger via opening new window containing canvas
      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Print Layout</title></head>
            <body style="display:flex;align-items:center;justify-content:center;height:90vh;margin:0;">
              <div style="border:1px dashed #CBD5E1;padding:40px;border-radius:16px;text-align:center;">
                <h2>${restaurantName}</h2>
                <img src="${imgData}" width="350" height="350" />
                <p style="font-weight:bold;font-size:20px;">${scanMessage}</p>
              </div>
              <script>window.onload = function() { window.print(); }</script>
            </body>
          </html>
        `);
      }
    }
  };

  // Preview Aspect Frame Stylings
  const renderPreviewFrame = () => {
    const qrCanvasComponent = (
      <QRCodeCanvas
        id="studio-qr-canvas"
        value={publicUrl}
        size={160}
        fgColor={fgColor}
        bgColor={transparentBg ? 'transparent' : bgColor}
        level="H"
        imageSettings={{
          src: logoIcon,
          x: undefined,
          y: undefined,
          height: logoSize,
          width: logoSize,
          excavate: true,
        }}
      />
    );

    switch (previewAspect) {
      case 'sticker':
        return (
          <div style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: bgColor,
            border: '2px dashed #94A3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            position: 'relative'
          }}>
            {/* Cut marks wrapper */}
            <span style={{ position: 'absolute', top: 12, fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>STICKER BLEED BORDER</span>
            <Title level={5} style={{ margin: '0 0 12px 0', color: fgColor, textAlign: 'center' }}>{restaurantName}</Title>
            {qrCanvasComponent}
            <Text strong style={{ marginTop: '12px', color: fgColor, fontSize: '12px' }}>{scanMessage}</Text>
          </div>
        );
      case 'tent':
        return (
          <div style={{
            width: '240px',
            height: '340px',
            background: bgColor,
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 16px',
            borderRadius: '8px',
            position: 'relative'
          }}>
            <div style={{ borderBottom: '1px dashed #E2E8F0', width: '100%', paddingBottom: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '9px', color: '#F97316', fontWeight: 700 }}>TENT CARD FOLD LINE</span>
            </div>
            {qrCanvasComponent}
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ color: fgColor, display: 'block', fontSize: '13px' }}>{scanMessage}</Text>
              <Text type="secondary" style={{ fontSize: '10px' }}>Powered by Restaurant OS</Text>
            </div>
          </div>
        );
      case 'a4':
        return (
          <div style={{
            width: '320px',
            height: '440px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px 24px',
            position: 'relative'
          }}>
            {/* Crop marks mock */}
            <div style={{ position: 'absolute', top: 4, left: 4, width: '16px', height: '16px', borderTop: '1px solid #000', borderLeft: '1px solid #000' }} />
            <div style={{ position: 'absolute', top: 4, right: 4, width: '16px', height: '16px', borderTop: '1px solid #000', borderRight: '1px solid #000' }} />
            <div style={{ position: 'absolute', bottom: 4, left: 4, width: '16px', height: '16px', borderBottom: '1px solid #000', borderLeft: '1px solid #000' }} />
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: '16px', height: '16px', borderBottom: '1px solid #000', borderRight: '1px solid #000' }} />
            
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: '0 0 4px 0', fontWeight: 800, color: '#0F172A' }}>{restaurantName}</Title>
              <span style={{ height: '2px', width: '32px', background: '#F97316', display: 'inline-block' }} />
            </div>
            
            <div style={{ padding: '24px', background: bgColor, borderRadius: '16px', border: '1px solid #F1F5F9' }}>
              {qrCanvasComponent}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Title level={5} style={{ margin: '0 0 4px 0', color: '#1E293B', fontWeight: 700 }}>{scanMessage}</Title>
              {showTableNumber && (
                <span style={{ fontSize: '11px', background: '#F8FAFC', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
                  Table No. {qrType === 'table' ? singleTableNumber : '1'}
                </span>
              )}
            </div>
          </div>
        );
      case 'card':
        return (
          <div style={{
            width: '260px',
            height: '260px',
            background: bgColor,
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            {qrCanvasComponent}
            <Text strong style={{ marginTop: '12px', color: fgColor, fontSize: '12px' }}>{scanMessage}</Text>
          </div>
        );
      case 'qr':
      default:
        return (
          <div style={{
            padding: '24px',
            background: transparentBg ? 'transparent' : bgColor,
            borderRadius: '12px',
            border: transparentBg ? '2px dashed #94A3B8' : '1px solid #E2E8F0',
            boxShadow: transparentBg ? 'none' : '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            {qrCanvasComponent}
          </div>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Step Wizard Progress tracker */}
      <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', marginBottom: '32px' }}>
        <Steps
          current={currentStep - 1}
          onChange={(step) => setCurrentStep(step + 1)}
          items={[
            { title: 'Type' },
            { title: 'Template' },
            { title: 'Branding' },
            { title: 'Preview' },
            { title: 'Download' },
          ]}
        />
      </Card>

      <Row gutter={32}>
        {/* LEFT COLUMN: Premium Preview & Aspect Toggles */}
        <Col xs={24} lg={11} style={{ marginBottom: '24px' }}>
          <Card
            bordered={false}
            title={<Text strong style={{ fontSize: '15px' }}>Studio Preview Screen</Text>}
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              minHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
          >
            {/* Live Visual Render */}
            <Flex justify="center" align="center" style={{ minHeight: '360px', padding: '24px 0' }}>
              {renderPreviewFrame()}
            </Flex>

            {/* Layout Toggles */}
            <Flex gap={8} wrap="wrap" justify="center" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              {[
                { key: 'qr', label: 'QR Only' },
                { key: 'sticker', label: 'Round Sticker' },
                { key: 'tent', label: 'Tent Card' },
                { key: 'card', label: 'Table Card' },
                { key: 'a4', label: 'A4 Poster' },
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
          </Card>
        </Col>

        {/* RIGHT COLUMN: Step-by-Step Settings wizard panels */}
        <Col xs={24} lg={13}>
          <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', minHeight: '520px' }}>
            
            {/* STEP 1: Select QR Type */}
            {currentStep === 1 && (
              <Flex vertical gap={24}>
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Choose QR Scope Type</Title>
                  <Text type="secondary">Define what link destination this QR represents.</Text>
                </div>

                <Radio.Group value={qrType} onChange={(e) => setQrType(e.target.value)} size="large" style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }} size={12}>
                    <Card hoverable style={{ border: qrType === 'restaurant' ? '2px solid #F97316' : '1px solid #E2E8F0', borderRadius: '12px' }} onClick={() => setQrType('restaurant')}>
                      <Radio value="restaurant">
                        <Text strong style={{ fontSize: '15px' }}>Single Restaurant QR</Text>
                        <Paragraph type="secondary" style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                          Generates a single permanent QR code linking directly to your guest digital menu.
                        </Paragraph>
                      </Radio>
                    </Card>

                    <Card hoverable style={{ border: qrType === 'table' ? '2px solid #F97316' : '1px solid #E2E8F0', borderRadius: '12px' }} onClick={() => setQrType('table')}>
                      <Radio value="table">
                        <Text strong style={{ fontSize: '15px' }}>Single Table QR</Text>
                        <Paragraph type="secondary" style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                          Generates a QR code mapping to a specific table number (e.g. Table 4).
                        </Paragraph>
                      </Radio>
                    </Card>

                    <Card hoverable style={{ border: qrType === 'bulk' ? '2px solid #F97316' : '1px solid #E2E8F0', borderRadius: '12px' }} onClick={() => setQrType('bulk')}>
                      <Radio value="bulk">
                        <Text strong style={{ fontSize: '15px' }}>Bulk Table Pack</Text>
                        <Paragraph type="secondary" style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                          Auto generate sequences of table QRs at once (e.g. Tables 1 to 50).
                        </Paragraph>
                      </Radio>
                    </Card>
                  </Space>
                </Radio.Group>

                {/* Conditional Inputs */}
                {qrType === 'table' && (
                  <Form layout="vertical">
                    <Form.Item label="Table Identifier / Number" required>
                      <Input value={singleTableNumber} onChange={(e) => setSingleTableNumber(e.target.value)} size="large" placeholder="e.g. 5" />
                    </Form.Item>
                  </Form>
                )}

                {qrType === 'bulk' && (
                  <Row gutter={16}>
                    <Col span={12}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Start Table</label>
                      <InputNumber min={1} value={bulkStart} onChange={(val) => setBulkStart(val || 1)} style={{ width: '100%' }} size="large" />
                    </Col>
                    <Col span={12}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>End Table</label>
                      <InputNumber min={1} value={bulkEnd} onChange={(val) => setBulkEnd(val || 10)} style={{ width: '100%' }} size="large" />
                    </Col>
                  </Row>
                )}

                <Form layout="vertical">
                  <Form.Item label="Organization Category/Folder">
                    <Select value={selectedFolder} onChange={(val) => setSelectedFolder(val)} size="large">
                      <Select.Option value="Restaurant">Main Restaurant</Select.Option>
                      <Select.Option value="Dining Hall">Ground Floor Dining Hall</Select.Option>
                      <Select.Option value="Outdoor">Outdoor Patio / Lawn</Select.Option>
                      <Select.Option value="VIP">VIP Lounge Cabin</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>

                <Button type="primary" size="large" icon={<RightOutlined />} iconPosition="end" onClick={() => setCurrentStep(2)} block style={{ background: '#F97316', borderColor: '#F97316', height: '48px', borderRadius: '12px' }}>
                  Continue to Design
                </Button>
              </Flex>
            )}

            {/* STEP 2: Choose Template */}
            {currentStep === 2 && (
              <Flex vertical gap={24}>
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Select Visual Template</Title>
                  <Text type="secondary">Predefined branding colors and eye layouts.</Text>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[
                    { key: 'minimal', name: 'Minimal Dark', fg: '#0F172A', bg: '#FFFFFF' },
                    { key: 'luxury', name: 'Luxury Gold', fg: '#854D0E', bg: '#FFFDFB' },
                    { key: 'cafe', name: 'Cafe Coffee', fg: '#451A03', bg: '#FAF8F5' },
                    { key: 'modern', name: 'Navy Modern', fg: '#1E3A8A', bg: '#F8FAFC' },
                    { key: 'dark', name: 'Slate Night', fg: '#F8FAFC', bg: '#0F172A' },
                    { key: 'traditional', name: 'Saffron traditional', fg: '#9A3412', bg: '#FFFBEB' },
                    { key: 'fastfood', name: 'Crispy Red', fg: '#DC2626', bg: '#FFFBEB' },
                    { key: 'minimal-white', name: 'White Transparent', fg: '#000000', bg: '#FFFFFF' },
                  ].map((temp) => (
                    <Card
                      key={temp.key}
                      hoverable
                      onClick={() => applyTemplate(temp.key)}
                      style={{
                        border: activeTemplate === temp.key ? '2px solid #F97316' : '1px solid #E2E8F0',
                        borderRadius: '12px',
                        background: temp.bg,
                        textAlign: 'center'
                      }}
                      bodyStyle={{ padding: '16px' }}
                    >
                      <Text strong style={{ color: temp.fg, fontSize: '13px' }}>{temp.name}</Text>
                    </Card>
                  ))}
                </div>

                <Flex gap={12}>
                  <Button size="large" icon={<LeftOutlined />} onClick={() => setCurrentStep(1)} style={{ borderRadius: '12px' }}>
                    Back
                  </Button>
                  <Button type="primary" size="large" onClick={() => setCurrentStep(3)} block style={{ background: '#F97316', borderColor: '#F97316', height: '48px', borderRadius: '12px' }}>
                    Continue to Branding
                  </Button>
                </Flex>
              </Flex>
            )}

            {/* STEP 3: Branding & Simplicity Settings */}
            {currentStep === 3 && (
              <Flex vertical gap={24}>
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Configure Branding Settings</Title>
                  <Text type="secondary">Customize labels, colors, and layout indicators.</Text>
                </div>

                <Form layout="vertical">
                  <Form.Item label="Restaurant Heading text">
                    <Input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} size="large" />
                  </Form.Item>

                  <Form.Item label="Scan Message instructions">
                    <Input value={scanMessage} onChange={(e) => setScanMessage(e.target.value)} size="large" />
                  </Form.Item>

                  <Form.Item label="Show Table Number on prints">
                    <Switch checked={showTableNumber} onChange={(val) => setShowTableNumber(val)} />
                  </Form.Item>

                  {/* Advanced settings collapsed */}
                  <Collapse ghost style={{ marginTop: '8px' }}>
                    <Panel header="Advanced Styling Controls" key="styling">
                      <Row gutter={16}>
                        <Col span={12}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Foreground Color</label>
                          <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ height: '38px' }} />
                        </Col>
                        <Col span={12}>
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Background Color</label>
                          <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ height: '38px' }} disabled={transparentBg} />
                        </Col>
                      </Row>

                      <div style={{ marginTop: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Transparent Background</label>
                        <Switch checked={transparentBg} onChange={(val) => setTransparentBg(val)} />
                      </div>

                      <div style={{ marginTop: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>QR Dot Shape</label>
                        <Radio.Group value={dotsType} onChange={(e) => setDotsType(e.target.value)}>
                          <Radio.Button value="square">Square</Radio.Button>
                          <Radio.Button value="rounded">Rounded</Radio.Button>
                        </Radio.Group>
                      </div>

                      <div style={{ marginTop: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Corner Eye Shape</label>
                        <Radio.Group value={cornersType} onChange={(e) => setCornersType(e.target.value)}>
                          <Radio.Button value="square">Square</Radio.Button>
                          <Radio.Button value="rounded">Rounded</Radio.Button>
                          <Radio.Button value="extra-rounded">Double Circular</Radio.Button>
                        </Radio.Group>
                      </div>

                      <div style={{ marginTop: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Center logo Size</label>
                        <Slider min={20} max={44} value={logoSize} onChange={(val) => setLogoSize(val)} />
                      </div>
                    </Panel>
                  </Collapse>
                </Form>

                <Flex gap={12}>
                  <Button size="large" icon={<LeftOutlined />} onClick={() => setCurrentStep(2)} style={{ borderRadius: '12px' }}>
                    Back
                  </Button>
                  <Button type="primary" size="large" onClick={handleGenerate} block style={{ background: '#F97316', borderColor: '#F97316', height: '48px', borderRadius: '12px' }}>
                    Generate QR Menu
                  </Button>
                </Flex>
              </Flex>
            )}

            {/* STEP 4: Live Preview Confirmation */}
            {currentStep === 4 && (
              <Flex vertical gap={24} align="center" style={{ textAlign: 'center' }}>
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Confirm Layout Design</Title>
                  <Text type="secondary">Review print margins and bleed borders before downloading.</Text>
                </div>

                <Card style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '12px', padding: '16px', width: '100%' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Format Configuration Checklist:</Text>
                  <Space direction="vertical" style={{ textAlign: 'left', width: '100%' }}>
                    <Text type="secondary">• 300 DPI high resolution print-ready</Text>
                    <Text type="secondary">• Bleed boundary guides adjusted automatically</Text>
                    <Text type="secondary">• Auto-centered branding texts</Text>
                  </Space>
                </Card>

                <Flex gap={12} style={{ width: '100%' }}>
                  <Button size="large" icon={<LeftOutlined />} onClick={() => setCurrentStep(3)} style={{ borderRadius: '12px' }}>
                    Back
                  </Button>
                  <Button type="primary" size="large" onClick={() => setCurrentStep(5)} block style={{ background: '#F97316', borderColor: '#F97316', height: '48px', borderRadius: '12px' }}>
                    Proceed to Download
                  </Button>
                </Flex>
              </Flex>
            )}

            {/* STEP 5: High DPI Downloads */}
            {currentStep === 5 && (
              <Flex vertical gap={24}>
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Download Print Assets</Title>
                  <Text type="secondary">Select your preferred export layout format.</Text>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <Card hoverable style={{ textAlign: 'center', borderRadius: '12px' }} onClick={() => triggerDownload('png')}>
                    <DownloadOutlined style={{ fontSize: '24px', color: '#F97316', marginBottom: '12px' }} />
                    <Text strong style={{ display: 'block' }}>High-Res PNG</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>Lossless transparency</Text>
                  </Card>

                  <Card hoverable style={{ textAlign: 'center', borderRadius: '12px' }} onClick={() => triggerDownload('svg')}>
                    <DownloadOutlined style={{ fontSize: '24px', color: '#3B82F6', marginBottom: '12px' }} />
                    <Text strong style={{ display: 'block' }}>Scalable SVG</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>Infinite scaling vector</Text>
                  </Card>

                  <Card hoverable style={{ textAlign: 'center', borderRadius: '12px', gridColumn: 'span 2' }} onClick={() => triggerDownload('pdf')}>
                    <PrinterOutlined style={{ fontSize: '24px', color: '#10B981', marginBottom: '12px' }} />
                    <Text strong style={{ display: 'block' }}>Print PDF Layout</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>Ready for A4/Tent cards printing</Text>
                  </Card>
                </div>

                <Button size="large" block onClick={() => setCurrentStep(1)} style={{ borderRadius: '12px' }}>
                  Create Another QR Code
                </Button>
              </Flex>
            )}

          </Card>
        </Col>
      </Row>

      {/* 10. BOTTOM SECTION: QR Management Center & History logs */}
      <div style={{ marginTop: '48px' }}>
        <Card
          bordered={false}
          title={<Text strong style={{ fontSize: '16px', color: '#0F172A' }}>QR Management & History</Text>}
          style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
        >
          {/* Filters row */}
          <Flex gap={12} wrap="wrap" style={{ marginBottom: '20px' }}>
            <Input
              placeholder="Search table number or QR name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '280px', borderRadius: '8px' }}
            />

            <Select value={filterType} onChange={(val) => setFilterType(val)} style={{ width: '150px' }}>
              <Select.Option value="all">All QR Types</Select.Option>
              <Select.Option value="restaurant">Restaurant QR</Select.Option>
              <Select.Option value="table">Table QR</Select.Option>
            </Select>

            <Select value={filterStatus} onChange={(val) => setFilterStatus(val)} style={{ width: '150px' }}>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="archived">Archived</Select.Option>
              <Select.Option value="disabled">Disabled</Select.Option>
            </Select>
          </Flex>

          {/* Table list */}
          <Table
            dataSource={filteredQRs}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text: any, record: any) => (
                  <div>
                    {renamingId === record.id ? (
                      <Input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => {
                          handleRename(record.id, renameValue);
                          setRenamingId(null);
                        }}
                        onPressEnter={() => {
                          handleRename(record.id, renameValue);
                          setRenamingId(null);
                        }}
                        autoFocus
                        size="small"
                        style={{ width: '160px' }}
                      />
                    ) : (
                      <Space>
                        <Text strong style={{ color: '#0F172A' }}>{text}</Text>
                        <Button
                          type="text"
                          icon={<EditOutlined style={{ fontSize: '12px' }} />}
                          onClick={() => {
                            setRenamingId(record.id);
                            setRenameValue(record.name);
                          }}
                          size="small"
                        />
                      </Space>
                    )}
                  </div>
                )
              },
              {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render: (val) => (
                  <span style={{ textTransform: 'capitalize', fontSize: '12px', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', color: '#475569', fontWeight: 600 }}>
                    {val}
                  </span>
                )
              },
              {
                title: 'Folder',
                dataIndex: 'folder',
                key: 'folder',
                render: (val) => (
                  <Space style={{ color: '#64748B', fontSize: '12px' }}>
                    <FolderOpenOutlined /> {val}
                  </Space>
                )
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (val: any, record: any) => (
                  <Select
                    value={val}
                    onChange={(newVal) => handleToggleStatus(record.id, newVal as any)}
                    size="small"
                    bordered={false}
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="archived">Archived</Select.Option>
                    <Select.Option value="disabled">Disabled</Select.Option>
                  </Select>
                )
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_: any, record: any) => (
                  <Space size={12}>
                    <Tooltip title="Copy Public URL">
                      <Button icon={<CopyOutlined />} onClick={() => copyLink(record.publicUrl)} size="small" />
                    </Tooltip>
                    <Tooltip title="Share QR Link">
                      <Button icon={<ShareAltOutlined />} onClick={() => shareNative(record.publicUrl, record.name)} size="small" />
                    </Tooltip>
                    <Tooltip title="Duplicate QR">
                      <Button icon={<SwapOutlined />} onClick={() => handleDuplicate(record.id)} size="small" />
                    </Tooltip>
                    <Popconfirm
                      title="Delete QR Code"
                      description="Are you sure you want to permanently delete this QR?"
                      onConfirm={() => handleDelete(record.id)}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                  </Space>
                )
              }
            ]}
          />
        </Card>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Card, Typography, Button, Space, Flex, Input, message, Spin, Row, Col } from 'antd';
import {
  CopyOutlined,
  PrinterOutlined,
  FileImageOutlined,
  CodeOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { menuService } from '../services/menu.service.js';
import { useAuthStore } from '../store/auth.store.js';

const { Title, Text, Paragraph } = Typography;

export const QRMenu: React.FC = () => {
  const { restaurant } = useAuthStore();
  const [copied, setCopied] = useState(false);

  // Fetch public URL details
  const { data: qrData, isLoading } = useQuery({
    queryKey: ['qr-code'],
    queryFn: () => menuService.getQRCodeData(),
  });

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" tip="Loading QR Code details..." />
      </Flex>
    );
  }

  const publicUrl = qrData?.data?.publicUrl || '';
  const slug = qrData?.data?.restaurantSlug || 'menu';
  const restaurantName = restaurant?.restaurantName || 'Restaurant';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    message.success('Public URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPNG = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
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
    message.success('PNG downloaded successfully');
  };

  const downloadSVG = () => {
    const svgElement = document.getElementById('qr-svg');
    if (!svgElement) {
      return message.error('Failed to locate QR code SVG');
    }
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = `${slug}-qr-menu.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('SVG downloaded successfully');
  };

  const printQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) {
      return message.error('Print failed: canvas not ready');
    }
    const imgData = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Menu - ${restaurantName}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 90vh;
                margin: 0;
                text-align: center;
                color: #0F172A;
              }
              .container {
                border: 2px solid #E2E8F0;
                border-radius: 24px;
                padding: 48px;
                background: #FFFFFF;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                max-width: 400px;
              }
              h1 {
                font-size: 28px;
                font-weight: 800;
                margin: 0 0 8px 0;
                letter-spacing: -0.5px;
              }
              p {
                font-size: 16px;
                color: #64748B;
                margin: 0 0 32px 0;
              }
              .qr-box {
                margin: 0 auto;
                padding: 16px;
                border: 1px solid #E2E8F0;
                border-radius: 16px;
                display: inline-block;
                background: #F8FAFC;
              }
              .footer {
                margin-top: 32px;
                font-size: 12px;
                color: #94A3B8;
                font-weight: 500;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${restaurantName}</h1>
              <p>Scan the QR code to view our digital menu</p>
              <div class="qr-box">
                <img src="${imgData}" width="250" height="250" alt="QR Code" />
              </div>
              <div class="footer">Powered by Restaurant OS</div>
            </div>
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
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }} className="qr-menu-container">
      <style>{`
        .qr-menu-container {
          padding: 40px 24px;
        }
        @media (max-width: 576px) {
          .qr-menu-container {
            padding: 16px 12px;
          }
          #qr-canvas {
            width: 140px !important;
            height: 140px !important;
          }
        }
      `}</style>
      <Space direction="vertical" size={32} style={{ width: '100%' }}>
        {/* Header section */}
        <div>
          <Title level={2} style={{ margin: '0 0 4px 0', letterSpacing: '-0.8px', fontWeight: 700 }}>
            QR Menu Generator
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Generate, print and download your custom restaurant menu QR code.
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Left panel: QR code display */}
          <Col xs={24} md={10}>
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 12px rgba(15,23,42,0.02)',
                border: '1px solid #F1F5F9',
                textAlign: 'center',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              {/* Dynamic QR canvas used for printing & PNG download */}
              <div style={{ display: 'inline-block', padding: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', marginBottom: '16px' }}>
                <QRCodeCanvas
                  id="qr-canvas"
                  value={publicUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* Hidden SVG version specifically for vector download */}
              <div style={{ display: 'none' }}>
                <QRCodeSVG
                  id="qr-svg"
                  value={publicUrl}
                  size={400}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <Paragraph type="secondary" style={{ margin: 0, fontSize: '13px' }}>
                Scan this QR code using a phone camera to test your public menu live.
              </Paragraph>
            </Card>
          </Col>

          {/* Right panel: Information & download buttons */}
          <Col xs={24} md={14}>
            <Card
              bordered={false}
              style={{
                boxShadow: '0 4px 12px rgba(15,23,42,0.02)',
                border: '1px solid #F1F5F9',
                borderRadius: '16px',
                height: '100%',
              }}
            >
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                {/* Link input */}
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px', color: '#0F172A', fontSize: '14px' }}>
                    Your Restaurant's Public Menu URL
                  </Text>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      readOnly
                      value={publicUrl}
                      style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', height: '42px', fontWeight: 500 }}
                    />
                    <Button
                      type="primary"
                      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                      onClick={copyToClipboard}
                      style={{ height: '42px' }}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </Space.Compact>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '8px 0' }} />

                {/* Actions list */}
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '16px', color: '#0F172A', fontSize: '14px' }}>
                    QR Code Actions
                  </Text>

                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      <Button
                        type="default"
                        icon={<FileImageOutlined />}
                        onClick={downloadPNG}
                        block
                        size="large"
                        style={{ height: '48px', borderRadius: '10px' }}
                      >
                        Download PNG
                      </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Button
                        type="default"
                        icon={<CodeOutlined />}
                        onClick={downloadSVG}
                        block
                        size="large"
                        style={{ height: '48px', borderRadius: '10px' }}
                      >
                        Download SVG
                      </Button>
                    </Col>
                    <Col span={24}>
                      <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={printQR}
                        block
                        size="large"
                        style={{ height: '48px', borderRadius: '10px', background: '#F97316' }}
                      >
                        Print QR Code
                      </Button>
                    </Col>
                  </Row>
                </div>

                {/* Integration notice */}
                <div style={{ padding: '16px', borderRadius: '12px', background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
                  <Text strong style={{ color: '#C2410C', display: 'block', marginBottom: '4px', fontSize: '13px' }}>
                    🖨️ Printing Guidelines
                  </Text>
                  <Paragraph style={{ color: '#7C2D12', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
                    For best scanning results, place printed QR codes on table cards or display stands at at least 4x4 cm in size. Ensure your print is crisp and high contrast.
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

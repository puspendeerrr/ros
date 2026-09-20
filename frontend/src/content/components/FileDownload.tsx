import React from 'react';
import { DownloadOutlined, FilePdfOutlined, FileImageOutlined, FileZipOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export interface FileDownloadProps {
  title: string;
  description?: string;
  downloadUrl: string;
  fileFormat: 'pdf' | 'svg' | 'png' | 'zip';
  fileSizeFormatted: string;
  checksumSha256?: string;
}

export const FileDownload: React.FC<FileDownloadProps> = ({
  title,
  description,
  downloadUrl,
  fileFormat,
  fileSizeFormatted,
  checksumSha256
}) => {
  const renderIcon = () => {
    switch (fileFormat) {
      case 'pdf': return <FilePdfOutlined style={{ fontSize: '24px', color: '#EF4444' }} />;
      case 'zip': return <FileZipOutlined style={{ fontSize: '24px', color: '#8B5CF6' }} />;
      case 'svg':
      case 'png':
      default:
        return <FileImageOutlined style={{ fontSize: '24px', color: '#F97316' }} />;
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '10px',
      padding: '20px 24px',
      margin: '20px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #E2E8F0'
        }}>
          {renderIcon()}
        </div>
        <div>
          <div style={{ fontWeight: 750, fontSize: '15px', color: '#0F172A', marginBottom: '2px' }}>
            {title}
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748B', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ textTransform: 'uppercase', fontWeight: 700, color: '#F97316' }}>{fileFormat}</span>
            <span>•</span>
            <span>{fileSizeFormatted}</span>
            {checksumSha256 && (
              <>
                <span>•</span>
                <span title={`SHA-256: ${checksumSha256}`}>SHA256 verified</span>
              </>
            )}
          </div>
          {description && (
            <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
              {description}
            </div>
          )}
        </div>
      </div>

      <a href={downloadUrl} download>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          style={{
            background: '#F97316',
            borderColor: '#F97316',
            borderRadius: '8px',
            fontWeight: 700,
            height: '40px'
          }}
        >
          Download Asset
        </Button>
      </a>
    </div>
  );
};

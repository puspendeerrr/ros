import React from 'react';
import { Collapse, Radio, Slider, Select, Card, Alert, Space, Typography } from 'antd';
import { BgColorsOutlined, FontColorsOutlined, LayoutOutlined, SettingOutlined, WarningOutlined } from '@ant-design/icons';
import type { ThemeConfig } from '../types';

const { Panel } = Collapse;
const { Text, Title, Paragraph } = Typography;

interface ThemeSidebarProps {
  themeConfig: ThemeConfig;
  selectedPresetId: string;
  themePresets: any[];
  contrastWarnings: string[];
  selectPreset: (id: string) => void;
  updateConfigValue: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void;
}

export const ThemeSidebar: React.FC<ThemeSidebarProps> = ({
  themeConfig,
  selectedPresetId,
  themePresets,
  contrastWarnings,
  selectPreset,
  updateConfigValue,
}) => {
  // Common styled color picker block
  const renderColorRow = (label: string, value: string, onChange: (color: string) => void) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
        <Text style={{ fontSize: '13px', color: '#64748B' }}>{label}</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text style={{ fontSize: '11px', fontFamily: 'monospace', color: '#475569' }}>{value.toUpperCase()}</Text>
          <div
            style={{
              position: 'relative',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '2px solid #E2E8F0',
              cursor: 'pointer',
              background: value,
              overflow: 'hidden'
            }}
          >
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                width: '36px',
                height: '36px',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const fontOptions = [
    { label: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
    { label: 'Inter (Modern Sans)', value: 'Inter, sans-serif' },
    { label: 'Outfit (Warm Friendly)', value: 'Outfit, sans-serif' },
    { label: 'Georgia (Elegant Serif)', value: 'Georgia, serif' },
  ];

  const spacingOptions = [
    { label: 'Compact', value: 'compact' },
    { label: 'Comfortable', value: 'comfortable' },
    { label: 'Luxury (Relaxed)', value: 'luxury' },
  ];

  const radiusOptions = [
    { label: 'Sharp Square (0px)', value: '0px' },
    { label: 'Soft Round (8px)', value: '8px' },
    { label: 'Standard (12px)', value: '12px' },
    { label: 'Pill (16px)', value: '16px' },
    { label: 'Extra Curved (24px)', value: '24px' },
  ];

  const buttonStyleOptions = [
    { label: 'Rounded corners', value: 'rounded' },
    { label: 'Square edges', value: 'square' },
    { label: 'Pill shapes', value: 'pill' },
  ];

  const shadowOptions = [
    { label: 'Flat (No Shadows)', value: 'none' },
    { label: 'Soft Glow', value: 'soft' },
    { label: 'Deep Elevation', value: 'strong' },
  ];

  const dividerOptions = [
    { label: 'Solid borders', value: 'solid' },
    { label: 'Dashed borders', value: 'dashed' },
    { label: 'Borderless clean', value: 'none' },
  ];

  return (
    <div style={{ padding: '16px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', height: '100%', overflowY: 'auto' }}>
      <Title level={4} style={{ margin: '0 0 16px 0', color: '#0F172A', fontWeight: 800 }}>
        Theme Customizer
      </Title>

      {/* WCAG Accessibility contrast warnings */}
      {contrastWarnings.length > 0 && (
        <Alert
          message="WCAG Contrast Alert"
          description={
            <div style={{ fontSize: '11px', marginTop: '4px' }}>
              {contrastWarnings.map((warn, index) => (
                <div key={index} style={{ marginBottom: '4px', display: 'flex', gap: '6px', alignItems: 'start' }}>
                  <WarningOutlined style={{ color: '#EAB308', marginTop: '2px' }} />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '16px', borderRadius: '8px' }}
        />
      )}

      {/* Accordion Settings Collapse */}
      <Collapse
        defaultActiveKey={['presets', 'colors']}
        expandIconPosition="end"
        ghost
        style={{ margin: '-8px' }}
      >
        {/* SECTION 1: Preset Themes */}
        <Panel 
          header={
            <Space>
              <BgColorsOutlined style={{ color: '#6366F1' }} />
              <Text strong style={{ fontSize: '14px', color: '#1E293B' }}>Select Theme Preset</Text>
            </Space>
          } 
          key="presets"
          style={{ borderBottom: '1px solid #F1F5F9' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', padding: '4px 0' }}>
            {themePresets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <Card
                  key={preset.id}
                  hoverable
                  onClick={() => selectPreset(preset.id)}
                  style={{
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #6366F1' : '1px solid #E2E8F0',
                    background: isSelected ? '#F5F3FF' : '#FFFFFF',
                    padding: '0px',
                    transition: 'all 0.2s'
                  }}
                  bodyStyle={{ padding: '10px 12px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: '13px', color: isSelected ? '#4F46E5' : '#1E293B', display: 'block' }}>
                        {preset.name}
                      </Text>
                      <Paragraph style={{ color: '#64748B', fontSize: '11px', margin: 0, lineHeight: 1.3 }}>
                        {preset.description}
                      </Paragraph>
                    </div>
                    {/* Small swatch bullets */}
                    <div style={{ display: 'flex', gap: '3px', marginLeft: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: preset.config.primaryColor }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: preset.config.backgroundColor }} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Panel>

        {/* SECTION 2: Custom Colors */}
        <Panel 
          header={
            <Space>
              <SettingOutlined style={{ color: '#3B82F6' }} />
              <Text strong style={{ fontSize: '14px', color: '#1E293B' }}>Brand Colors</Text>
            </Space>
          } 
          key="colors"
          style={{ borderBottom: '1px solid #F1F5F9' }}
        >
          <div style={{ padding: '4px 0' }}>
            {renderColorRow('Primary Brand Color', themeConfig.primaryColor, (c) => updateConfigValue('primaryColor', c))}
            {renderColorRow('Accent Action Color', themeConfig.accentColor, (c) => updateConfigValue('accentColor', c))}
            {renderColorRow('Menu Background Color', themeConfig.backgroundColor, (c) => updateConfigValue('backgroundColor', c))}
            {renderColorRow('Menu Card Background', themeConfig.cardColor, (c) => updateConfigValue('cardColor', c))}
            {renderColorRow('Standard Text Color', themeConfig.textColor, (c) => updateConfigValue('textColor', c))}
            {renderColorRow('Secondary Description', themeConfig.secondaryColor, (c) => updateConfigValue('secondaryColor', c))}
            {renderColorRow('Button Actions Color', themeConfig.buttonColor, (c) => updateConfigValue('buttonColor', c))}
          </div>
        </Panel>

        {/* SECTION 3: Typography */}
        <Panel 
          header={
            <Space>
              <FontColorsOutlined style={{ color: '#10B981' }} />
              <Text strong style={{ fontSize: '14px', color: '#1E293B' }}>Typography & Font Size</Text>
            </Space>
          } 
          key="typography"
          style={{ borderBottom: '1px solid #F1F5F9' }}
        >
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Font Family</Text>
              <Select
                value={themeConfig.fontFamily}
                onChange={(v) => updateConfigValue('fontFamily', v)}
                style={{ width: '100%' }}
                options={fontOptions}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyItems: 'space-between', width: '100%', marginBottom: '4px' }}>
                <Text style={{ fontSize: '12px', color: '#64748B' }}>Font Size Scale</Text>
                <Text style={{ fontSize: '11px', fontWeight: 600, color: '#3B82F6', marginLeft: 'auto' }}>
                  {themeConfig.fontSizeScale.toFixed(2)}x
                </Text>
              </div>
              <Slider
                min={0.8}
                max={1.3}
                step={0.05}
                value={themeConfig.fontSizeScale}
                onChange={(v) => updateConfigValue('fontSizeScale', v)}
              />
            </div>
          </div>
        </Panel>

        {/* SECTION 4: Layout Configuration */}
        <Panel 
          header={
            <Space>
              <LayoutOutlined style={{ color: '#F59E0B' }} />
              <Text strong style={{ fontSize: '14px', color: '#1E293B' }}>Layout Styles</Text>
            </Space>
          } 
          key="layout"
          style={{ borderBottom: '1px solid #F1F5F9' }}
        >
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Header Layout Style</Text>
              <Radio.Group
                value={themeConfig.headerStyle}
                onChange={(e) => updateConfigValue('headerStyle', e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="classic" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Classic</Radio.Button>
                <Radio.Button value="centered" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Centered</Radio.Button>
                <Radio.Button value="modern" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Modern</Radio.Button>
              </Radio.Group>
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Restaurant Logo Shape</Text>
              <Radio.Group
                value={themeConfig.logoStyle}
                onChange={(e) => updateConfigValue('logoStyle', e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="circle" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Circle</Radio.Button>
                <Radio.Button value="rounded-square" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Rounded</Radio.Button>
                <Radio.Button value="square" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Square</Radio.Button>
              </Radio.Group>
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Hero Banner height</Text>
              <Radio.Group
                value={themeConfig.bannerStyle}
                onChange={(e) => updateConfigValue('bannerStyle', e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="compact" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Compact</Radio.Button>
                <Radio.Button value="large" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Large</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </Panel>

        {/* SECTION 5: Component Details */}
        <Panel 
          header={
            <Space>
              <SettingOutlined style={{ color: '#EC4899' }} />
              <Text strong style={{ fontSize: '14px', color: '#1E293B' }}>Card & Component Styling</Text>
            </Space>
          } 
          key="components"
          style={{ borderBottom: '1px solid #F1F5F9' }}
        >
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Category Navigation Bar</Text>
              <Radio.Group
                value={themeConfig.categoryStyle}
                onChange={(e) => updateConfigValue('categoryStyle', e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="pills" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Pills</Radio.Button>
                <Radio.Button value="underline" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Underline</Radio.Button>
                <Radio.Button value="cards" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Cards</Radio.Button>
              </Radio.Group>
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Menu Item Card Layout</Text>
              <Select
                value={themeConfig.itemCardStyle}
                onChange={(v) => updateConfigValue('itemCardStyle', v)}
                style={{ width: '100%' }}
                options={[
                  { label: 'Comfortable spacing', value: 'comfortable' },
                  { label: 'Compact layout', value: 'compact' },
                  { label: 'Luxury (Elegant border)', value: 'luxury' },
                  { label: 'List style (Borderless)', value: 'list' },
                ]}
              />
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Border Radius Curve</Text>
              <Select
                value={themeConfig.cardRadius}
                onChange={(v) => updateConfigValue('cardRadius', v)}
                style={{ width: '100%' }}
                options={radiusOptions}
              />
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Button Border Styling</Text>
              <Radio.Group
                value={themeConfig.buttonStyle}
                onChange={(e) => updateConfigValue('buttonStyle', e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '100%', display: 'flex' }}
              >
                {buttonStyleOptions.map((opt) => (
                  <Radio.Button key={opt.value} value={opt.value} style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>
                    {opt.label.split(' ')[0]}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Section Spacing</Text>
              <Select
                value={themeConfig.sectionSpacing}
                onChange={(v) => updateConfigValue('sectionSpacing', v)}
                style={{ width: '100%' }}
                options={spacingOptions}
              />
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Shadow System</Text>
              <Radio.Group
                value={themeConfig.shadowStyle}
                onChange={(e) => updateConfigValue('shadowStyle', e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '100%', display: 'flex' }}
              >
                {shadowOptions.map((opt) => (
                  <Radio.Button key={opt.value} value={opt.value} style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>
                    {opt.label.split(' ')[0]}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Divider System</Text>
              <Select
                value={themeConfig.dividerStyle}
                onChange={(v) => updateConfigValue('dividerStyle', v)}
                style={{ width: '100%' }}
                options={dividerOptions}
              />
            </div>

            <div>
              <Text style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '6px' }}>Layout Animation Speed</Text>
              <Radio.Group
                value={themeConfig.animationLevel}
                onChange={(e) => updateConfigValue('animationLevel', e.target.value)}
                optionType="button"
                buttonStyle="solid"
                style={{ width: '100%', display: 'flex' }}
              >
                <Radio.Button value="none" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Off</Radio.Button>
                <Radio.Button value="subtle" style={{ flex: 1, textAlign: 'center', fontSize: '11px' }}>Subtle</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { restaurantService } from '../../../services/restaurant.service';
import { themePresets } from '../presets';
import type { ThemeConfig } from '../types';

// Helper: Convert HEX to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Helper: Get relative luminance of a color
const getLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map((v) => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Helper: Calculate contrast ratio between two HEX colors
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return 5.0; // fallback safe score

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export const useTheme = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Profile Data
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['restaurant-profile'],
    queryFn: () => restaurantService.getProfile(),
  });

  const profile = profileResponse?.data;

  // Active theme states
  const [selectedPresetId, setSelectedPresetId] = useState<string>('minimal');
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(themePresets[0].config);
  const [originalConfig, setOriginalConfig] = useState<ThemeConfig>(themePresets[0].config);
  const [contrastWarnings, setContrastWarnings] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize theme from profile
  useEffect(() => {
    if (profile) {
      const dbPresetId = profile.themeId || 'minimal';
      const preset = themePresets.find((p) => p.id === dbPresetId) || themePresets[0];
      
      let config = { ...preset.config };
      if (profile.themeConfig) {
        try {
          const parsedConfig = typeof profile.themeConfig === 'string'
            ? JSON.parse(profile.themeConfig)
            : profile.themeConfig;
          config = { ...config, ...parsedConfig };
        } catch (e) {
          console.error('Failed to parse database themeConfig', e);
        }
      }

      setSelectedPresetId(dbPresetId);
      setThemeConfig(config);
      setOriginalConfig(config);
      setIsDirty(false);
    }
  }, [profile]);

  // Run contrast checks whenever colors change
  useEffect(() => {
    const warnings: string[] = [];

    // Check 1: Text vs Background
    const textBgRatio = calculateContrastRatio(themeConfig.textColor, themeConfig.backgroundColor);
    if (textBgRatio < 4.5) {
      warnings.push(`Text and Background contrast ratio is low (${textBgRatio.toFixed(2)}:1). Recommended is 4.5:1.`);
    }

    // Check 2: Button text contrast (Button Color vs white or inverse text)
    const buttonRatio = calculateContrastRatio(themeConfig.buttonColor, '#FFFFFF');
    if (buttonRatio < 4.5) {
      warnings.push(`White text on primary buttons has low contrast (${buttonRatio.toFixed(2)}:1). Recommended is 4.5:1.`);
    }

    // Check 3: Card Text vs Card Background
    const cardRatio = calculateContrastRatio(themeConfig.textColor, themeConfig.cardColor);
    if (cardRatio < 4.5) {
      warnings.push(`Text on menu cards has low contrast (${cardRatio.toFixed(2)}:1). Recommended is 4.5:1.`);
    }

    setContrastWarnings(warnings);
  }, [themeConfig.textColor, themeConfig.backgroundColor, themeConfig.buttonColor, themeConfig.cardColor]);

  // Handle Preset select
  const selectPreset = (presetId: string) => {
    const preset = themePresets.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setThemeConfig(preset.config);
      setIsDirty(JSON.stringify(preset.config) !== JSON.stringify(originalConfig));
    }
  };

  // Update specific config fields
  const updateConfigValue = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    const nextConfig = {
      ...themeConfig,
      [key]: value,
    };
    setThemeConfig(nextConfig);
    setIsDirty(JSON.stringify(nextConfig) !== JSON.stringify(originalConfig));
  };

  // Mutations
  const saveThemeMutation = useMutation({
    mutationFn: () => restaurantService.updateTheme(selectedPresetId, themeConfig),
    onSuccess: (res) => {
      message.success('Theme saved successfully!');
      queryClient.setQueryData(['restaurant-profile'], res);
      setOriginalConfig(themeConfig);
      setIsDirty(false);
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to save theme configuration');
    },
  });

  const resetThemeMutation = useMutation({
    mutationFn: () => restaurantService.resetTheme(),
    onSuccess: (res) => {
      message.success('Theme reset to defaults');
      queryClient.setQueryData(['restaurant-profile'], res);
      setIsDirty(false);
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to reset theme');
    },
  });

  return {
    isLoading,
    profile,
    themePresets,
    selectedPresetId,
    themeConfig,
    contrastWarnings,
    isDirty,
    selectPreset,
    updateConfigValue,
    saveTheme: () => saveThemeMutation.mutate(),
    resetTheme: () => resetThemeMutation.mutate(),
    isSaving: saveThemeMutation.isPending,
    isResetting: resetThemeMutation.isPending,
  };
};

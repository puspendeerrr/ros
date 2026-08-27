import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#F97316',
    colorInfo: '#F97316',
    borderRadius: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgLayout: '#FAFAFA',
  },
  components: {
    Button: {
      controlHeight: 42,
      controlHeightLG: 48,
      fontWeight: 500,
      borderRadius: 6,
    },
    Input: {
      controlHeight: 42,
      borderRadius: 6,
    },
    Card: {
      borderRadiusLG: 16,
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemColor: '#94A3B8',
      darkItemSelectedBg: '#F97316',
      darkItemSelectedColor: '#FFFFFF',
      darkItemHoverBg: '#1E293B',
      darkItemHoverColor: '#FFFFFF',
    },
  },
};

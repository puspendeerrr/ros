export interface ThemeConfig {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  buttonColor: string;
  textColor: string;

  // Typography
  fontFamily: string;
  fontSizeScale: number; // 0.8 to 1.4

  // Spacing & Border Radius
  cardRadius: string; // '0px', '8px', '12px', '16px', '24px'
  buttonStyle: 'rounded' | 'square' | 'pill';
  sectionSpacing: 'comfortable' | 'compact' | 'luxury';

  // Component Layout Styles
  categoryStyle: 'pills' | 'underline' | 'cards' | 'chips';
  itemCardStyle: 'compact' | 'comfortable' | 'luxury' | 'list';
  headerStyle: 'classic' | 'centered' | 'modern';
  bannerStyle: 'compact' | 'large';
  logoStyle: 'circle' | 'rounded-square' | 'square';
  shadowStyle: 'none' | 'soft' | 'strong';
  dividerStyle: 'solid' | 'dashed' | 'none';
  animationLevel: 'none' | 'subtle';
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  config: ThemeConfig;
}

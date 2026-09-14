import { z } from 'zod';

export const themeConfigSchema = z.object({
  // Colors
  primaryColor: z.string().min(3).max(30),
  secondaryColor: z.string().min(3).max(30),
  accentColor: z.string().min(3).max(30),
  backgroundColor: z.string().min(3).max(30),
  cardColor: z.string().min(3).max(30),
  buttonColor: z.string().min(3).max(30),
  textColor: z.string().min(3).max(30),

  // Typography
  fontFamily: z.string(),
  fontSizeScale: z.coerce.number().positive(),

  // Spacing & Border Radius
  cardRadius: z.string(),
  buttonStyle: z.enum(['rounded', 'square', 'pill']),
  sectionSpacing: z.enum(['comfortable', 'compact', 'luxury']),

  // Component Layout Styles
  categoryStyle: z.enum(['pills', 'underline', 'cards', 'chips']),
  itemCardStyle: z.enum(['compact', 'comfortable', 'luxury', 'list']),
  headerStyle: z.enum(['classic', 'centered', 'modern']),
  bannerStyle: z.enum(['compact', 'large']),
  logoStyle: z.enum(['circle', 'rounded-square', 'square']),
  shadowStyle: z.enum(['none', 'soft', 'strong']),
  dividerStyle: z.enum(['solid', 'dashed', 'none']),
  animationLevel: z.enum(['none', 'subtle']),
});

export const updateThemeSchema = z.object({
  themeId: z.string().min(1, 'themeId is required'),
  themeConfig: themeConfigSchema.optional().nullable(),
});

export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;

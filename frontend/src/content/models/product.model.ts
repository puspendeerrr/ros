import type { BaseContentItem } from './base.model.js';

export interface FeatureContentItem extends BaseContentItem {
  contentType: 'feature';
  featureCategory: 'menu_ordering' | 'operations_pos' | 'enterprise' | 'growth';
  highlights: string[];
  specs: Record<string, string>;
  interactiveDemoUrl?: string;
}

export interface SolutionContentItem extends BaseContentItem {
  contentType: 'solution';
  targetBusinessType: string;
  businessSize: string;
  coreProblemsSolved: string[];
  workflowSteps: Array<{ title: string; desc: string }>;
}

export interface IndustryContentItem extends BaseContentItem {
  contentType: 'industry';
  verticalName: string;
  averageTableTurnMinutes: number;
  criticalPainPoint: string;
  specializedFeatures: string[];
}

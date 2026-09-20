import type { BaseContentItem } from './base.model.js';

export interface BlogContentItem extends BaseContentItem {
  contentType: 'blog';
  heroImageUrl?: string;
  heroImageAlt?: string;
  estimatedReadTime: string;
}

export interface GuideContentItem extends BaseContentItem {
  contentType: 'guide';
  targetOutcome: string;
  estimatedCompletionTime: string;
  toolsRequired?: string[];
  keyTakeaways: string[];
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  summary: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface TutorialContentItem extends BaseContentItem {
  contentType: 'tutorial';
  prerequisites: string[];
  steps: TutorialStep[];
  githubRepoUrl?: string;
}

export interface CaseStudyMetric {
  metricName: string;
  beforeValue: string;
  afterValue: string;
  percentageChange?: string;
}

export interface CaseStudyContentItem extends BaseContentItem {
  contentType: 'case_study';
  clientName: string;
  clientIndustry: string;
  clientLocations: number;
  heroQuote: {
    quote: string;
    speakerName: string;
    speakerRole: string;
  };
  metrics: CaseStudyMetric[];
}

export interface WhitepaperContentItem extends BaseContentItem {
  contentType: 'whitepaper';
  pdfDownloadUrl?: string;
  executiveSummary: string;
  academicReferences?: string[];
}

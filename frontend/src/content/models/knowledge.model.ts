import type { BaseContentItem } from './base.model.js';

export interface FAQQuestionAnswer {
  question: string;
  answer: string;
  category?: string;
}

export interface FAQContentItem extends BaseContentItem {
  contentType: 'faq';
  faqs: FAQQuestionAnswer[];
}

export interface GlossaryContentItem extends BaseContentItem {
  contentType: 'glossary';
  term: string;
  definition: string;
  etymology?: string;
  synonyms?: string[];
}

export interface ComparisonMatrixRow {
  capability: string;
  restaurantOs: string | boolean;
  competitor: string | boolean;
  importance: 'critical' | 'high' | 'medium';
}

export interface ComparisonContentItem extends BaseContentItem {
  contentType: 'comparison';
  competitorName: string;
  competitorCategory: string;
  whySwitchSummary: string;
  matrix: ComparisonMatrixRow[];
  keyAdvantages: string[];
}

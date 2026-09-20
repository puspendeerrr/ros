/**
 * Search Intent Matrix Engine
 * Maps content types, search intents, and target audience to strategic CTA funnels.
 */

import type { ContentType, SearchIntent } from '../../content/models/base.model.ts';
import type { SearchIntentType } from '../types/programmatic.types.ts';

export interface IntentStrategy {
  intent: SearchIntentType;
  primaryGoal: string;
  recommendedCta: {
    label: string;
    targetPath: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  contentDepthRequirementWords: number;
}

export class IntentMatrixEngine {
  private static readonly INTENT_STRATEGIES: Record<SearchIntentType, IntentStrategy> = {
    informational: {
      intent: 'informational',
      primaryGoal: 'Educate the reader, establish technical authority, and answer questions thoroughly.',
      recommendedCta: {
        label: 'Read Complete Guide',
        targetPath: '/resources/guides',
        variant: 'secondary',
      },
      contentDepthRequirementWords: 800,
    },
    commercial_investigation: {
      intent: 'commercial_investigation',
      primaryGoal: 'Compare architectures, feature matrices, hardware requirements, and ROI economics.',
      recommendedCta: {
        label: 'Compare All Systems',
        targetPath: '/compare',
        variant: 'primary',
      },
      contentDepthRequirementWords: 600,
    },
    commercial: {
      intent: 'commercial',
      primaryGoal: 'Demonstrate specific operational capabilities and invite product exploration.',
      recommendedCta: {
        label: 'Explore Live Demo',
        targetPath: '/features',
        variant: 'primary',
      },
      contentDepthRequirementWords: 450,
    },
    transactional: {
      intent: 'transactional',
      primaryGoal: 'Convert qualified restaurateur or manager into registered active workspace.',
      recommendedCta: {
        label: 'Start Free Today',
        targetPath: '/signup',
        variant: 'primary',
      },
      contentDepthRequirementWords: 300,
    },
    navigational: {
      intent: 'navigational',
      primaryGoal: 'Route returning customer, developer, or teammate directly to destination.',
      recommendedCta: {
        label: 'Open Dashboard',
        targetPath: '/dashboard',
        variant: 'outline',
      },
      contentDepthRequirementWords: 150,
    },
  };

  /**
   * Resolves the canonical search intent for a given content type and existing metadata.
   */
  public static resolveIntent(contentType: ContentType, declaredIntent?: SearchIntent): SearchIntentType {
    if (declaredIntent) {
      if (declaredIntent === 'informational') return 'informational';
      if (declaredIntent === 'commercial') return 'commercial';
      if (declaredIntent === 'transactional') return 'transactional';
      if (declaredIntent === 'navigational') return 'navigational';
    }

    switch (contentType) {
      case 'comparison':
        return 'commercial_investigation';
      case 'feature':
      case 'solution':
      case 'industry':
        return 'commercial';
      case 'guide':
      case 'tutorial':
      case 'documentation':
      case 'faq':
      case 'glossary':
      case 'whitepaper':
      case 'blog':
        return 'informational';
      case 'download':
        return 'transactional';
      case 'changelog':
      case 'roadmap':
        return 'navigational';
      default:
        return 'informational';
    }
  }

  public static getStrategy(intent: SearchIntentType): IntentStrategy {
    return this.INTENT_STRATEGIES[intent] || this.INTENT_STRATEGIES.informational;
  }
}

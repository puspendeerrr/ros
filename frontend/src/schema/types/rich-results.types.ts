export type RichResultType =
  | 'article'
  | 'breadcrumb'
  | 'faq'
  | 'howto'
  | 'software_app'
  | 'sitelinks_searchbox'
  | 'profile_page'
  | 'video';

export interface RichResultCriteria {
  type: RichResultType;
  requiredFields: string[];
  recommendedFields: string[];
  documentationUrl: string;
}

export const GOOGLE_RICH_RESULTS_SPECS: Record<RichResultType, RichResultCriteria> = {
  article: {
    type: 'article',
    requiredFields: ['headline', 'image', 'datePublished', 'author'],
    recommendedFields: ['dateModified', 'description', 'publisher', 'mainEntityOfPage'],
    documentationUrl: 'https://developers.google.com/search/docs/appearance/structured-data/article'
  },
  breadcrumb: {
    type: 'breadcrumb',
    requiredFields: ['itemListElement'],
    recommendedFields: [],
    documentationUrl: 'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb'
  },
  faq: {
    type: 'faq',
    requiredFields: ['mainEntity'],
    recommendedFields: [],
    documentationUrl: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage'
  },
  howto: {
    type: 'howto',
    requiredFields: ['name', 'step'],
    recommendedFields: ['description', 'image', 'totalTime'],
    documentationUrl: 'https://developers.google.com/search/docs/appearance/structured-data/how-to'
  },
  software_app: {
    type: 'software_app',
    requiredFields: ['name'],
    recommendedFields: ['operatingSystem', 'applicationCategory', 'offers'],
    documentationUrl: 'https://developers.google.com/search/docs/appearance/structured-data/software-app'
  },
  sitelinks_searchbox: {
    type: 'sitelinks_searchbox',
    requiredFields: ['target', 'query-input'],
    recommendedFields: [],
    documentationUrl: 'https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox'
  },
  profile_page: {
    type: 'profile_page',
    requiredFields: ['mainEntity'],
    recommendedFields: [],
    documentationUrl: 'https://developers.google.com/search/docs/appearance/structured-data/profile-page'
  },
  video: {
    type: 'video',
    requiredFields: ['name', 'description', 'thumbnailUrl', 'uploadDate'],
    recommendedFields: ['contentUrl', 'embedUrl'],
    documentationUrl: 'https://developers.google.com/search/docs/appearance/structured-data/video'
  }
};

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  targetType: string;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

import { GLOBAL_ENTITY_IDS, resolveArticleId, resolveTechArticleId, resolveWebPageId } from '../entities/entity-ids.ts';
import type {
  SchemaArticle,
  SchemaFAQPage,
  SchemaQuestion,
  SchemaHowTo,
  SchemaHowToStep,
  SchemaDefinedTerm,
  SchemaDefinedTermSet,
  SchemaItemList,
  SchemaPerson,
  SchemaVideoObject
} from '../types/schema.types.ts';

export function createArticleSchema(props: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorPersonId?: string;
  authorName?: string;
  author?: {
    name: string;
    jobTitle?: string;
    sameAs?: string[];
  } | string;
  isTechArticle?: boolean;
  dependencies?: string;
  wordCount?: number;
}): SchemaArticle {
  const schemaType = props.isTechArticle ? 'TechArticle' : 'Article';
  const entityId = props.isTechArticle ? resolveTechArticleId(props.url) : resolveArticleId(props.url);

  const article: SchemaArticle = {
    '@type': schemaType,
    '@id': entityId,
    headline: props.headline,
    description: props.description,
    url: props.url,
    datePublished: props.datePublished,
    dateModified: props.dateModified || props.datePublished,
    publisher: { '@id': GLOBAL_ENTITY_IDS.organization },
    mainEntityOfPage: { '@id': resolveWebPageId(props.url) },
    image: props.image
  };

  if (props.authorPersonId) {
    article.author = { '@id': props.authorPersonId };
  } else if (typeof props.author === 'string') {
    article.author = {
      '@type': 'Person',
      '@id': `${props.url}#author`,
      name: props.author
    };
  } else if (props.author && typeof props.author === 'object') {
    article.author = {
      '@type': 'Person',
      '@id': `${props.url}#author`,
      name: props.author.name,
      jobTitle: props.author.jobTitle,
      sameAs: props.author.sameAs
    };
  } else if (props.authorName) {
    article.author = {
      '@type': 'Person',
      '@id': `${props.url}#author`,
      name: props.authorName
    };
  } else {
    // Default to publisher Organization if no author specified
    article.author = { '@id': GLOBAL_ENTITY_IDS.organization };
  }

  if (props.isTechArticle && props.dependencies) {
    article.dependencies = props.dependencies;
  }

  return article;
}

export function createFAQPageSchema(
  pageUrlOrProps: string | { url?: string; pageUrl?: string; questions?: Array<{ question: string; answer: string }>; faqs?: Array<{ question: string; answer: string }> },
  maybeFaqs?: Array<{ question: string; answer: string }>
): SchemaFAQPage {
  let pageUrl: string;
  let faqs: Array<{ question: string; answer: string }>;

  if (typeof pageUrlOrProps === 'object') {
    pageUrl = pageUrlOrProps.url || pageUrlOrProps.pageUrl || '';
    faqs = pageUrlOrProps.questions || pageUrlOrProps.faqs || [];
  } else {
    pageUrl = pageUrlOrProps;
    faqs = maybeFaqs || [];
  }

  const questions: SchemaQuestion[] = faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }));

  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: questions
  };
}

export function createHowToSchema(props: {
  pageUrl?: string;
  url?: string;
  name: string;
  description: string;
  totalTime?: string;
  steps: Array<{ name: string; text: string; image?: string }>;
}): SchemaHowTo {
  const url = props.pageUrl || props.url || '';
  const steps: SchemaHowToStep[] = props.steps.map((s, idx) => ({
    '@type': 'HowToStep',
    position: idx + 1,
    name: s.name,
    text: s.text,
    image: s.image
  }));

  return {
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: props.name,
    description: props.description,
    totalTime: props.totalTime,
    step: steps
  };
}

export function createDefinedTermSchema(props: {
  termId?: string;
  term?: string;
  name?: string;
  definition?: string;
  description?: string;
  termCode?: string;
  termSetId?: string;
  inDefinedTermSetUrl?: string;
}): SchemaDefinedTerm {
  const name = props.name || props.term || '';
  const desc = props.description || props.definition || '';
  const id = props.termId || (props.inDefinedTermSetUrl ? `${props.inDefinedTermSetUrl}#${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}` : `#term-${encodeURIComponent(name.toLowerCase())}`);

  return {
    '@type': 'DefinedTerm',
    '@id': id,
    name,
    description: desc,
    termCode: props.termCode,
    inDefinedTermSet: (props.termSetId || props.inDefinedTermSetUrl) ? { '@id': props.termSetId || props.inDefinedTermSetUrl! } : undefined
  };
}

export function createDefinedTermSetSchema(props: {
  termSetId: string;
  name: string;
  description: string;
}): SchemaDefinedTermSet {
  return {
    '@type': 'DefinedTermSet',
    '@id': props.termSetId,
    name: props.name,
    description: props.description
  };
}

export function createComparisonItemListSchema(props: {
  pageUrl?: string;
  url?: string;
  name: string;
  description: string;
  matrixRows?: Array<{ capability: string; restaurantOs: string | boolean; competitor: string | boolean }>;
  items?: Array<{ name: string; url?: string; description?: string }>;
}): SchemaItemList {
  const pageUrl = props.pageUrl || props.url || '';
  let itemListElements: any[] = [];

  if (props.matrixRows && props.matrixRows.length > 0) {
    itemListElements = props.matrixRows.map((row, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: row.capability,
      description: `Restaurant OS: ${row.restaurantOs} vs Competitor: ${row.competitor}`
    }));
  } else if (props.items && props.items.length > 0) {
    itemListElements = props.items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
      description: item.description
    }));
  }

  return {
    '@type': 'ItemList',
    '@id': `${pageUrl}#comparison-matrix`,
    name: props.name,
    description: props.description,
    itemListElement: itemListElements
  };
}

export function createPersonSchema(props: {
  personId: string;
  name: string;
  jobTitle?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}): SchemaPerson {
  return {
    '@type': 'Person',
    '@id': props.personId,
    name: props.name,
    jobTitle: props.jobTitle,
    worksFor: { '@id': GLOBAL_ENTITY_IDS.organization },
    sameAs: props.sameAs,
    knowsAbout: props.knowsAbout
  };
}

export function createVideoObjectSchema(props: {
  pageUrl: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
}): SchemaVideoObject {
  return {
    '@type': 'VideoObject',
    '@id': `${props.pageUrl}#video`,
    name: props.name,
    description: props.description,
    thumbnailUrl: props.thumbnailUrl,
    uploadDate: props.uploadDate,
    contentUrl: props.contentUrl,
    embedUrl: props.embedUrl
  };
}

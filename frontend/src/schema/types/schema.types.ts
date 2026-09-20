/**
 * Strongly Typed Schema.org Type Definitions
 * Covers Core Things, Global Entities, Content Types, and Customer Stubs.
 */

export interface SchemaNode {
  '@context'?: string;
  '@type': string;
  '@id'?: string;
  [key: string]: unknown;
}

export interface JsonLdDocument {
  '@context': string;
  '@graph': SchemaNode[];
}

export interface SchemaEntityReference {
  '@id': string;
}

export interface SchemaPostalAddress extends SchemaNode {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface SchemaContactPoint extends SchemaNode {
  '@type': 'ContactPoint';
  contactType: string;
  email?: string;
  telephone?: string;
  availableLanguage?: string[];
}

export interface SchemaImageObject extends SchemaNode {
  '@type': 'ImageObject';
  '@id'?: string;
  url: string;
  contentUrl?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface SchemaOrganization extends SchemaNode {
  '@type': 'Organization';
  '@id': string;
  name: string;
  legalName?: string;
  url: string;
  logo?: SchemaImageObject | SchemaEntityReference;
  image?: string;
  description?: string;
  foundingDate?: string;
  sameAs?: string[];
  contactPoint?: SchemaContactPoint[];
  knowsAbout?: string[];
}

export interface SchemaBrand extends SchemaNode {
  '@type': 'Brand';
  '@id': string;
  name: string;
  url?: string;
  logo?: string | SchemaImageObject;
  description?: string;
}

export interface SchemaSearchAction extends SchemaNode {
  '@type': 'SearchAction';
  '@id'?: string;
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

export interface SchemaWebSite extends SchemaNode {
  '@type': 'WebSite';
  '@id': string;
  name: string;
  url: string;
  publisher?: SchemaEntityReference;
  potentialAction?: SchemaSearchAction[];
  inLanguage?: string;
}

export interface SchemaBreadcrumbElement {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

export interface SchemaBreadcrumbList extends SchemaNode {
  '@type': 'BreadcrumbList';
  '@id': string;
  itemListElement: SchemaBreadcrumbElement[];
}

export interface SchemaWebPage extends SchemaNode {
  '@type': 'WebPage' | 'CollectionPage' | 'ProfilePage';
  '@id': string;
  url: string;
  name: string;
  description?: string;
  isPartOf?: SchemaEntityReference;
  primaryImageOfPage?: SchemaEntityReference;
  breadcrumb?: SchemaEntityReference;
  inLanguage?: string;
  datePublished?: string;
  dateModified?: string;
}

export interface SchemaPerson extends SchemaNode {
  '@type': 'Person';
  '@id': string;
  name: string;
  url?: string;
  jobTitle?: string;
  worksFor?: SchemaEntityReference;
  sameAs?: string[];
  knowsAbout?: string[];
}

export interface SchemaSoftwareApplication extends SchemaNode {
  '@type': 'SoftwareApplication';
  '@id': string;
  name: string;
  operatingSystem?: string;
  applicationCategory?: string;
  applicationSubCategory?: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    description?: string;
  };
  featureList?: string[];
  screenshot?: string[];
  publisher?: SchemaEntityReference;
}

export interface SchemaArticle extends SchemaNode {
  '@type': 'Article' | 'BlogPosting' | 'TechArticle';
  '@id': string;
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: SchemaPerson | SchemaOrganization | SchemaEntityReference;
  publisher?: SchemaEntityReference;
  mainEntityOfPage?: SchemaEntityReference;
  image?: string | SchemaImageObject | SchemaEntityReference;
  articleSection?: string;
  keywords?: string[];
  dependencies?: string; // For TechArticle
}

export interface SchemaQuestion extends SchemaNode {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface SchemaFAQPage extends SchemaNode {
  '@type': 'FAQPage';
  '@id'?: string;
  mainEntity: SchemaQuestion[];
}

export interface SchemaHowToStep extends SchemaNode {
  '@type': 'HowToStep';
  position?: number;
  name: string;
  text: string;
  image?: string;
}

export interface SchemaHowTo extends SchemaNode {
  '@type': 'HowTo';
  '@id': string;
  name: string;
  description: string;
  step: SchemaHowToStep[];
  totalTime?: string;
}

export interface SchemaDefinedTerm extends SchemaNode {
  '@type': 'DefinedTerm';
  '@id': string;
  name: string;
  description: string;
  inDefinedTermSet?: SchemaEntityReference;
}

export interface SchemaDefinedTermSet extends SchemaNode {
  '@type': 'DefinedTermSet';
  '@id': string;
  name: string;
  description: string;
}

export interface SchemaItemList extends SchemaNode {
  '@type': 'ItemList';
  '@id'?: string;
  name: string;
  description?: string;
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    description?: string;
  }>;
}

export interface SchemaVideoObject extends SchemaNode {
  '@type': 'VideoObject';
  '@id': string;
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
}

// Stubs for future Customer & Merchant Showcase
export interface SchemaLocalBusiness extends SchemaNode {
  '@type': 'LocalBusiness' | 'Restaurant';
  '@id': string;
  name: string;
  image?: string;
  address?: SchemaPostalAddress;
  servesCuisine?: string[];
  priceRange?: string;
  hasMenu?: string;
  telephone?: string;
}

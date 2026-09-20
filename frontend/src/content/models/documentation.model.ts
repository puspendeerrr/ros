import type { BaseContentItem } from './base.model.js';

export type DocVersion = 'latest' | 'v1' | 'v2';

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  parameters?: Array<{ name: string; type: string; required: boolean; description: string }>;
  responseExample?: Record<string, unknown> | string;
}

export interface DocumentationContentItem extends BaseContentItem {
  contentType: 'documentation';
  version: DocVersion;
  section: string;
  order: number;
  apiEndpoints?: ApiEndpointSpec[];
  tableOfContents?: Array<{ id: string; title: string; level: number }>;
}

/**
 * Central JSON-LD Schema Pipeline for Restaurant OS
 * Orchestrates global and contextual schema generators into a unified @graph document.
 */

import { JsonLdGraphBuilder } from './graph.builder.ts';
import type { JsonLdDocument, SchemaNode } from '../types/schema.types.ts';
import {
  createOrganizationSchema,
  createBrandSchema,
  createWebSiteSchema,
  createSoftwareApplicationSchema,
  createWebPageSchema,
  createBreadcrumbListSchema,
} from '../generators/global.generators.ts';
import type { BreadcrumbItem } from '../../utils/schema.ts';

export interface PageSchemaContext {
  /** Canonical URL for the page */
  url: string;
  /** Title of the webpage */
  title: string;
  /** Meta description */
  description?: string;
  /** Primary language tag (e.g. 'en-US') */
  inLanguage?: string;
  /** Breadcrumb items leading to this page */
  breadcrumbs?: BreadcrumbItem[];
  /** Date published in ISO format */
  datePublished?: string;
  /** Date modified in ISO format */
  dateModified?: string;
  /** Primary entity node or additional schema nodes for the page */
  pageEntities?: (SchemaNode | null | undefined)[];
}

export class JsonLdPipeline {
  private static instance: JsonLdPipeline;

  private constructor() {}

  public static getInstance(): JsonLdPipeline {
    if (!JsonLdPipeline.instance) {
      JsonLdPipeline.instance = new JsonLdPipeline();
    }
    return JsonLdPipeline.instance;
  }

  /**
   * Generates a complete, interconnected, validated JSON-LD @graph document for a page.
   */
  public generatePageGraph(context: PageSchemaContext): JsonLdDocument {
    const builder = new JsonLdGraphBuilder();

    // 1. Core Global Entities (Always present in graph for identity resolution)
    builder.addNode(createOrganizationSchema());
    builder.addNode(createBrandSchema());
    builder.addNode(createWebSiteSchema());
    builder.addNode(createSoftwareApplicationSchema());

    // 2. WebPage Node
    const webPageNode = createWebPageSchema({
      url: context.url,
      name: context.title,
      description: context.description,
      inLanguage: context.inLanguage,
      datePublished: context.datePublished,
      dateModified: context.dateModified,
    });
    builder.addNode(webPageNode);

    // 3. Breadcrumb Node (if provided)
    if (context.breadcrumbs && context.breadcrumbs.length > 0) {
      builder.addNode(createBreadcrumbListSchema(context.breadcrumbs));
    }

    // 4. Contextual Page Entities (Articles, FAQs, HowTos, DefinedTerms, ItemLists)
    if (context.pageEntities && context.pageEntities.length > 0) {
      for (const entity of context.pageEntities) {
        if (entity) {
          builder.addNode(entity);
        }
      }
    }

    // 5. Build, deduplicate, and compress into @graph
    return builder.build();
  }

  /**
   * Serializes the document into safe inline script JSON-LD format.
   * Encodes dangerous HTML entities to prevent XSS injection.
   */
  public serializeToScript(document: JsonLdDocument): string {
    const jsonString = JSON.stringify(document, null, 2);
    // Escape unsafe characters for inline script tag embedding
    return jsonString
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  }
}

export const jsonLdPipeline = JsonLdPipeline.getInstance();

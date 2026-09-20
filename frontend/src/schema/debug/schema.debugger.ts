/**
 * Development-Only Schema Debugger
 * Completely tree-shaken in production builds using import.meta.env.DEV check.
 */

import type { JsonLdDocument, SchemaNode } from '../types/schema.types.ts';
import { SchemaValidator } from '../validators/schema.validator.ts';

export interface SchemaDebugReport {
  timestamp: string;
  totalEntities: number;
  entities: Array<{
    type: string;
    id?: string;
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  jsonLdRaw: JsonLdDocument;
}

export class SchemaDebugger {
  /**
   * Logs a formatted debug report to the console in development mode.
   * Does nothing in production.
   */
  public static inspect(document: JsonLdDocument): SchemaDebugReport | null {
    if (!import.meta.env.DEV) {
      return null;
    }

    const graph = (document['@graph'] || [document]) as SchemaNode[];
    const validationResults = SchemaValidator.validateGraph(graph);

    const report: SchemaDebugReport = {
      timestamp: new Date().toISOString(),
      totalEntities: graph.length,
      entities: graph.map((node, idx) => {
        const res = validationResults[idx];
        return {
          type: String(node['@type']),
          id: node['@id'] ? String(node['@id']) : undefined,
          valid: res.valid,
          errors: res.errors.map((e) => `[${e.field}] ${e.message}`),
          warnings: res.warnings.map((w) => `[${w.field}] ${w.message}`),
        };
      }),
      jsonLdRaw: document,
    };

    console.groupCollapsed(
      `%c[SchemaDebugger] Graph Inspected: ${graph.length} Entities (%c${
        report.entities.filter((e) => !e.valid).length === 0 ? 'ALL VALID' : 'ERRORS FOUND'
      }%c)`,
      'color: #6366f1; font-weight: bold;',
      report.entities.filter((e) => !e.valid).length === 0 ? 'color: #10b981;' : 'color: #ef4444;',
      'color: inherit;'
    );
    console.table(report.entities);
    console.log('Raw JSON-LD Document:', document);
    console.groupEnd();

    return report;
  }
}

/**
 * Unified Schema Validator Orchestrator
 * Coordinates Google Rich Results, Schema.org standard, and Search Console adapters.
 */

import type { SchemaNode } from '../types/schema.types.ts';
import type { ValidationResult, ValidationError, ValidationWarning } from '../types/rich-results.types.ts';
import { GoogleRichResultsAdapter } from './google-rich-results.adapter.ts';
import { SchemaOrgAdapter } from './schema-org.adapter.ts';
import { SearchConsoleAdapter } from './search-console.adapter.ts';

export interface MultiValidationResult {
  valid: boolean;
  targetType: string;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  details: {
    googleRichResults: ValidationResult;
    schemaOrg: ValidationResult;
    searchConsole: ValidationResult;
  };
}

export class SchemaValidator {
  /**
   * Validates a schema node across all 3 compliance adapters.
   */
  public static validateNode(node: SchemaNode): MultiValidationResult {
    const googleResult = GoogleRichResultsAdapter.validate(node);
    const schemaOrgResult = SchemaOrgAdapter.validate(node);
    const gscResult = SearchConsoleAdapter.validate(node);

    const allErrors: ValidationError[] = [
      ...googleResult.errors,
      ...schemaOrgResult.errors,
      ...gscResult.errors,
    ];

    const allWarnings: ValidationWarning[] = [
      ...googleResult.warnings,
      ...schemaOrgResult.warnings,
      ...gscResult.warnings,
    ];

    return {
      valid: allErrors.length === 0,
      targetType: node['@type'] || 'Unknown',
      errors: allErrors,
      warnings: allWarnings,
      details: {
        googleRichResults: googleResult,
        schemaOrg: schemaOrgResult,
        searchConsole: gscResult,
      },
    };
  }

  /**
   * Validates all nodes in a JSON-LD @graph.
   */
  public static validateGraph(graph: SchemaNode[]): MultiValidationResult[] {
    return graph.map((node) => this.validateNode(node));
  }
}

/**
 * Schema.org Standard Compliance Adapter
 * Validates structural integrity, @id syntax, and property types according to Schema.org standards.
 */

import type { SchemaNode } from '../types/schema.types.ts';
import type { ValidationResult, ValidationError, ValidationWarning } from '../types/rich-results.types.ts';

export class SchemaOrgAdapter {
  public static validate(node: SchemaNode): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 1. Check @type presence
    if (!node['@type'] || typeof node['@type'] !== 'string') {
      errors.push({
        field: '@type',
        message: 'Schema.org entities must have a non-empty string @type',
        code: 'SCHEMAORG_MISSING_TYPE',
      });
      return { valid: false, targetType: 'Unknown', errors, warnings };
    }

    // 2. Check @id format if present
    if (node['@id']) {
      const id = String(node['@id']);
      if (!id.startsWith('http://') && !id.startsWith('https://') && !id.startsWith('urn:')) {
        errors.push({
          field: '@id',
          message: `Schema.org @id must be an absolute URI or URN: "${id}"`,
          code: 'SCHEMAORG_INVALID_ID_URI',
        });
      }
    } else {
      warnings.push({
        field: '@id',
        message: `Entity of type "${node['@type']}" lacks a canonical @id URI; entity graph referencing will be degraded`,
        code: 'SCHEMAORG_MISSING_ID',
      });
    }

    // 3. Check for disallowed custom types
    if (node['@type'] === 'Comparison') {
      errors.push({
        field: '@type',
        message: 'Comparison is NOT a valid Schema.org vocabulary type. Use Article, TechArticle, ItemList, or CreativeWork instead.',
        code: 'SCHEMAORG_INVALID_COMPARISON_TYPE',
      });
    }

    // 4. Validate recursive properties
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith('@')) continue;
      if (val && typeof val === 'object') {
        if (Array.isArray(val)) {
          val.forEach((item, idx) => {
            if (item && typeof item === 'object' && !item['@type'] && !item['@id']) {
              warnings.push({
                field: `${key}[${idx}]`,
                message: `Nested object in "${key}" lacks both @type and @id`,
                code: 'SCHEMAORG_UNTYPED_NESTED_OBJECT',
              });
            }
          });
        } else if (typeof val === 'object' && !(val as any)['@type'] && !(val as any)['@id']) {
          warnings.push({
            field: key,
            message: `Nested object in property "${key}" lacks @type or @id`,
            code: 'SCHEMAORG_UNTYPED_NESTED_OBJECT',
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      targetType: node['@type'],
      errors,
      warnings,
    };
  }
}

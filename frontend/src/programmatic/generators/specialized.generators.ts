/**
 * Specialized Page Generators for Programmatic Landing Pages
 */

import type { PageTemplateType } from '../types/programmatic.types.ts';
import { BasePageGenerator } from './base.generator.ts';

export class FeaturePageGenerator extends BasePageGenerator {
  public readonly template: PageTemplateType = 'FeatureTemplate';
}

export class SolutionPageGenerator extends BasePageGenerator {
  public readonly template: PageTemplateType = 'SolutionTemplate';
}

export class IndustryPageGenerator extends BasePageGenerator {
  public readonly template: PageTemplateType = 'IndustryTemplate';
}

export class ComparisonPageGenerator extends BasePageGenerator {
  public readonly template: PageTemplateType = 'ComparisonTemplate';
}

export class DocumentationPageGenerator extends BasePageGenerator {
  public readonly template: PageTemplateType = 'DocsTemplate';
}

export class ResourcePageGenerator extends BasePageGenerator {
  public readonly template: PageTemplateType = 'ResourceTemplate';
}

export class PricingPageGenerator extends BasePageGenerator {
  public readonly template: PageTemplateType = 'PricingTemplate';
}

export class LegalPageGenerator extends BasePageGenerator {
  public readonly template: PageTemplateType = 'LegalTemplate';
}

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  contentId: string;
  field?: string;
  message: string;
  severity: ValidationSeverity;
  ruleCode: string;
}

export interface ContentValidationReport {
  timestamp: string;
  totalItemsChecked: number;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
  passed: boolean;
}

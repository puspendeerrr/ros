import type { MDXComponentMap } from './mdx.types.js';
import {
  CodeBlock,
  Callout,
  MediaView,
  ContentTable,
  ComparisonTable,
  ProsAndCons,
  Timeline,
  Checklist,
  FAQAccordion,
  CtaPlaceholder,
  Quote,
  MetricCards,
  Steps,
  Tabs,
  YouTube,
  Badge,
  MermaidDiagram,
  Terminal,
  FileDownload,
  MathBlock
} from '../components/index.js';

export const DEFAULT_MDX_COMPONENTS: MDXComponentMap = {
  // Named MDX Components
  CodeBlock,
  Callout,
  MediaView,
  ContentTable,
  ComparisonTable,
  ProsAndCons,
  Timeline,
  Checklist,
  FAQAccordion,
  CtaPlaceholder,
  Quote,
  MetricCards,
  Steps,
  Tabs,
  YouTube,
  Badge,
  MermaidDiagram,
  Terminal,
  FileDownload,
  MathBlock,

  // HTML Element Overrides
  pre: (props: any) => {
    const code = props.children?.props?.children || props.children || '';
    const language = props.children?.props?.className?.replace('language-', '') || 'bash';
    return CodeBlock({ code: String(code), language });
  },
  blockquote: (props: any) => {
    return Quote({ quote: props.children, authorName: 'Industry Insight' });
  }
};

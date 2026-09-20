import type React from 'react';

export type MDXNodeType =
  | 'element'
  | 'text'
  | 'component';

export interface MDXCompiledNode {
  type: MDXNodeType;
  tag?: string; // HTML tag (p, h1, pre) or Component name (Callout, CodeBlock)
  props?: Record<string, unknown>;
  children?: Array<MDXCompiledNode | string>;
  value?: string; // For text nodes
}

export interface CompiledMDXDocument {
  slug: string;
  frontmatter: Record<string, unknown>;
  ast: MDXCompiledNode;
  compiledAt: string;
}

export type MDXComponentFunction = React.ComponentType<any>;

export type MDXComponentMap = Record<string, MDXComponentFunction | undefined>;

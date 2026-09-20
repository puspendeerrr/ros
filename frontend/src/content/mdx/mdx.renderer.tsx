import React from 'react';
import type { MDXCompiledNode, CompiledMDXDocument, MDXComponentMap } from './mdx.types.js';
import { DEFAULT_MDX_COMPONENTS } from './mdx.components.js';

export interface MDXRendererProps {
  document?: CompiledMDXDocument;
  node?: MDXCompiledNode;
  components?: Partial<MDXComponentMap>;
}

export const MDXRenderer: React.FC<MDXRendererProps> = ({
  document,
  node,
  components = {}
}) => {
  const mergedComponents: MDXComponentMap = {
    ...DEFAULT_MDX_COMPONENTS,
    ...components
  };

  const rootNode = node || document?.ast;
  if (!rootNode) return null;

  const renderNode = (n: MDXCompiledNode | string, index: number): React.ReactNode => {
    if (typeof n === 'string') return n;

    if (n.type === 'text') {
      return n.value || '';
    }

    const Tag = (n.tag && mergedComponents[n.tag]) || n.tag || 'div';

    const childNodes = (n.children || []).map((child, idx) => renderNode(child, idx));

    return React.createElement(
      Tag,
      { key: index, ...(n.props || {}) },
      childNodes.length > 0 ? childNodes : undefined
    );
  };

  return <div className="ros-mdx-content">{renderNode(rootNode, 0)}</div>;
};

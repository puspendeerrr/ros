/**
 * Build-Time Markdown & MDX AST Compiler
 * Parses headings (h1, h2, h3), extracts structural hierarchy, and builds safe AST nodes
 * without client-side runtime parsing.
 */

import type { MDXCompiledNode } from '../mdx/mdx.types.ts';
import type { HeadingItem } from './types.ts';

export class BuildTimeMdxCompiler {
  /**
   * Compiles raw markdown string into MDXCompiledNode AST and extracts structured heading tree.
   */
  public static compile(markdown: string): { ast: MDXCompiledNode; headings: HeadingItem[]; readingTimeMinutes: number } {
    const lines = markdown.split(/\r?\n/);
    const headings: HeadingItem[] = [];
    const children: Array<MDXCompiledNode | string> = [];
    let wordCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) continue;

      // Count words for reading time (approx 200 words / min)
      const words = trimmed.split(/\s+/).filter(Boolean);
      wordCount += words.length;

      // Heading detection
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        headings.push({ level, text, id });

        children.push({
          type: 'element',
          tag: `h${level}`,
          props: { id },
          children: [text],
        });
        continue;
      }

      // Blockquote detection
      if (trimmed.startsWith('>')) {
        const quoteText = trimmed.replace(/^>\s*/, '');
        children.push({
          type: 'element',
          tag: 'blockquote',
          children: [quoteText],
        });
        continue;
      }

      // Codeblock detection (single or triple backtick)
      if (trimmed.startsWith('```')) {
        const lang = trimmed.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        children.push({
          type: 'element',
          tag: 'pre',
          props: { className: lang ? `language-${lang}` : undefined },
          children: [codeLines.join('\n')],
        });
        continue;
      }

      // Default paragraph
      children.push({
        type: 'element',
        tag: 'p',
        children: [trimmed],
      });
    }

    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const ast: MDXCompiledNode = {
      type: 'element',
      tag: 'div',
      props: { className: 'ros-compiled-content' },
      children,
    };

    return {
      ast,
      headings,
      readingTimeMinutes,
    };
  }
}

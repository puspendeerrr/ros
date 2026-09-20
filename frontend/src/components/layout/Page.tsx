/**
 * Layout Primitive: Page
 * Top-level view scaffold with semantic main landmark and standard page-level layout constraints.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface PageProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const Page: React.FC<PageProps> = ({
  as: Component = 'main',
  className,
  children,
  ...props
}) => {
  return (
    <Component
      id="main-content"
      role="main"
      className={cn('min-h-screen w-full bg-white text-slate-900', className)}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Data Component: EmptyTable
 * Empty state view specifically formatted inside table containers.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';
import { EmptyState } from '../ui/empty-state.tsx';
import { FileText } from '../../lib/icons.ts';

export interface EmptyTableProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  colSpan?: number;
  className?: string;
}

export const EmptyTable: React.FC<EmptyTableProps> = ({
  title = 'No records found',
  description = 'There are currently no items matching your criteria.',
  action,
  colSpan = 6,
  className,
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className={cn('p-8 text-center', className)}>
        <EmptyState
          icon={<FileText className="w-5 h-5" />}
          title={title}
          description={description}
          action={action}
        />
      </td>
    </tr>
  );
};

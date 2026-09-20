/**
 * Data Component: Pagination
 * Accessible table pagination with previous, next, and page jump controls.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';
import { Button } from '../ui/button.tsx';
import { ChevronLeft, ChevronRight } from '../../lib/icons.ts';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
  ...props
}) => {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-100 bg-white select-none',
        className
      )}
      {...props}
    >
      {totalItems !== undefined && (
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-700">{Math.min(totalItems, (currentPage - 1) * (itemsPerPage || 10) + 1)}</span> to{' '}
          <span className="font-bold text-slate-700">{Math.min(totalItems, currentPage * (itemsPerPage || 10))}</span> of{' '}
          <span className="font-bold text-slate-700">{totalItems}</span> results
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <span className="text-xs font-semibold px-2 text-slate-600">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

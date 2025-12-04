import React from 'react';
import type { Virtualizer } from '@tanstack/react-virtual';

interface VirtualizedGridProps<T> {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  items: T[];
  columns: number;
  renderRow: (rowItems: T[]) => React.ReactNode;
}

export function VirtualizedGrid<T>({
  virtualizer,
  items,
  columns,
  renderRow,
}: VirtualizedGridProps<T>) {
  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      style={{
        height: `${totalSize}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const startIndex = virtualRow.index * columns;
        const endIndex = Math.min(startIndex + columns, items.length);
        const rowItems = items.slice(startIndex, endIndex);

        return (
          <div
            key={virtualRow.index}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderRow(rowItems)}
          </div>
        );
      })}
    </div>
  );
}

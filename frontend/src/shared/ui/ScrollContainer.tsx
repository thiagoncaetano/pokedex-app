import { ReactNode, forwardRef } from 'react';

interface ScrollContainerProps {
  children: ReactNode;
}

export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
  ({ children }, ref) => {
    return (
      <div 
        ref={ref}
        className="flex-1 overflow-y-auto pr-2 -mr-2 relative"
      >
        {children}
      </div>
    );
  }
);

ScrollContainer.displayName = 'ScrollContainer';

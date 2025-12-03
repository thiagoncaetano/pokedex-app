import React, { memo } from 'react';

interface EmptyStateProps {
  message: string;
  icon?: string;
  title?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = memo(({ 
  message, 
  icon = '🔍', 
  title = 'No results found',
  className = ''
}) => {
  return (
    <div className={`col-span-full text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

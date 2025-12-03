import React, { memo } from 'react';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = memo(({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-md ${className}`}>
      {/* Pokémon Image Skeleton */}
      <div className="aspect-square bg-gray-200 rounded-xl mb-3 animate-pulse" />
      
      {/* Pokémon Info Skeleton */}
      <div className="space-y-2">
        {/* Name skeleton */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
        
        {/* Number skeleton */}
        <div className="h-3 bg-gray-200 rounded w-12 mx-auto" />
        
        {/* Types skeleton */}
        <div className="flex justify-center gap-1">
          <div className="h-5 bg-gray-200 rounded-full w-12 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded-full w-12 animate-pulse" />
        </div>
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

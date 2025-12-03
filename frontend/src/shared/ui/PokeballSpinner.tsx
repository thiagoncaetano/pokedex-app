import React from 'react';

interface PokeballSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PokeballSpinner({ size = 'md', className = '' }: PokeballSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 rounded-full bg-red-500 border-2 border-black">
        <div className="absolute top-1/2 left-0 right-0 h-1/2 bg-white rounded-b-full border-b-2 border-black"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-white rounded-full border-2 border-black">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white rounded-full"></div>
        </div>
      </div>
      <div className={`absolute inset-0 rounded-full bg-red-500 border-2 border-black animate-spin ${sizeClasses[size]}`}>
        <div className="absolute top-1/2 left-0 right-0 h-1/2 bg-white rounded-b-full border-b-2 border-black"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-white rounded-full border-2 border-black">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

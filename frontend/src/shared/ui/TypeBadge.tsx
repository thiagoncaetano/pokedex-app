import React, { memo } from 'react';

interface TypeBadgeProps {
  type: string;
  className?: string;
}

const defaultTypeColors: Record<string, string> = {
  grass: 'bg-green-100 text-green-800',
  fire: 'bg-red-100 text-red-800',
  water: 'bg-blue-100 text-blue-800',
  electric: 'bg-yellow-100 text-yellow-800',
  psychic: 'bg-pink-100 text-pink-800',
  ice: 'bg-cyan-100 text-cyan-800',
  dragon: 'bg-purple-100 text-purple-800',
  dark: 'bg-gray-700 text-white',
  fairy: 'bg-pink-100 text-pink-800',
  normal: 'bg-gray-100 text-gray-800',
  fighting: 'bg-orange-100 text-orange-800',
  flying: 'bg-indigo-100 text-indigo-800',
  poison: 'bg-purple-100 text-purple-800',
  ground: 'bg-yellow-100 text-yellow-800',
  rock: 'bg-yellow-100 text-yellow-800',
  bug: 'bg-green-100 text-green-800',
  ghost: 'bg-purple-100 text-purple-800',
  steel: 'bg-gray-100 text-gray-800',
};

export const TypeBadge: React.FC<TypeBadgeProps> = memo(({ type, className = '' }) => {
  const getColorClass = (type: string): string => {
    return defaultTypeColors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <span 
      className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${getColorClass(type)} ${className}`}
    >
      {type}
    </span>
  );
});

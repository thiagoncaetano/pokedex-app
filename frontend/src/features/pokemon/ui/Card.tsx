import React, { useState, memo } from 'react';
import { Pokemon } from '@/features/pokemon/types/pokemon';
import { TypeBadge } from '@/shared/ui/TypeBadge';

interface CardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
}

// Lazy Image Component
const LazyImage: React.FC<{ src: string; alt: string; className: string }> = memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
      )}
      
      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-4xl">🔴</div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        loading="lazy"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// Main Card Component
export const Card = React.memo<CardProps>(({ pokemon, onClick }) => {
  const handleClick = () => {
    onClick?.(pokemon);
  };

  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      {/* Pokémon Image */}
      <div className="aspect-square bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
        {pokemon.imageUrl ? (
          <LazyImage 
            src={pokemon.imageUrl} 
            alt={pokemon.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl">🔴</div>
        )}
      </div>
      
      {/* Pokémon Info */}
      <h3 className="font-bold text-gray-900 text-center capitalize text-sm mb-1">
        {pokemon.name}
      </h3>
      <p className="text-gray-500 text-center text-xs mb-2">
        #{pokemon.number}
      </p>
      
      {/* Pokémon Types */}
      {pokemon.types && pokemon.types.length > 0 && (
        <div className="flex justify-center gap-1 flex-wrap">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

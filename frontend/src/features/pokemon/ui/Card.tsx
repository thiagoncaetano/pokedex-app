import React, { useState, memo } from 'react';
import { BasicPokemon } from '@/features/pokemon/types/pokemon';

interface CardProps {
  pokemon: BasicPokemon;
  onClick?: (pokemon: BasicPokemon) => void;
}

// Lazy Image Component
const LazyImage: React.FC<{ src: string; alt: string; className: string }> = memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
      )}
      
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-4xl">🔴</div>
        </div>
      )}
      
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
      className="relative aspect-square bg-white rounded-2xl transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden"
      style={{
        boxShadow: '2px 4px 6px 2px rgba(162, 160, 160, 0.3), 1px 1px 4px 2px rgba(162, 160, 160, 0.3)'
      }}
      onClick={handleClick}
    >
      {/* Pokemon ID */}
      <div className="absolute top-2 right-2 text-gray-500 text-md">
        #{String(pokemon.id).padStart(3, '0')}
      </div>

      {/* Pokemon Image */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img 
          src={pokemon.image} 
          alt={pokemon.name}
          className="w-[60%] h-[60%] sm:w-[70%] sm:h-[70%] md:w-[75%] md:h-[75%] object-contain"
          loading="lazy"
        />
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-1"
        style={{
          height: '45%',
          borderRadius: '15px 15px 0 0',
          backgroundColor: '#EFEFEF'
        }}
      >
        {/* Pokemon Name */}
        <h3 className="font-normal text-gray-900 text-center capitalize mb-1 text-lg sm:text-lg md:text-lg lg:text-lg xl:text-xl">
          {pokemon.name}
        </h3>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

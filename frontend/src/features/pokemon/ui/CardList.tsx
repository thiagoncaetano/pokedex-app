import React, { useCallback } from 'react';
import { Card } from './Card';
import SkeletonCard from '@/shared/ui/SkeletonCard';
import { BasicPokemon } from '@/features/pokemon/types/pokemon';

interface CardListProps {
  pokemons: BasicPokemon[];
  onCardClick?: (pokemon: BasicPokemon) => void;
  isLoading?: boolean;
}

// Main CardList Component
export const CardList = React.memo<CardListProps>(({ pokemons, onCardClick, isLoading }) => {
  // Memoize the click handler to prevent unnecessary re-renders
  const handleCardClick = useCallback((pokemon: BasicPokemon) => {
    onCardClick?.(pokemon);
  }, [onCardClick]);

  // Show skeleton loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 mx-1 sm:mx-2 mb-0">
        <div className="mx-auto">
          <div className="mb-4">
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
          
          <div className="h-[calc(100vh-260px)] sm:h-[calc(100vh-260px)] md:h-[calc(100vh-270px)] lg:h-[calc(100vh-280px)] overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
              {Array.from({ length: 24 }, (_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (pokemons.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 mx-1 sm:mx-2 mb-0">
        <div className="mx-auto text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pokémons found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 mx-1 sm:mx-2 mb-0">
      <div className="mx-auto">
        <div className="mb-4 text-sm text-gray-600">
          Found <span className="font-semibold">{pokemons.length}</span> {pokemons.length === 1 ? 'pokémon' : 'pokémons'}
        </div>
        
        {/* Scrollable cards container */}
        <div className="h-[calc(100vh-260px)] sm:h-[calc(100vh-260px)] md:h-[calc(100vh-265px)] lg:h-[calc(100vh-265px)] overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-1">
            {pokemons.map((pokemon) => (
              <Card 
                key={pokemon.id} 
                pokemon={pokemon} 
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

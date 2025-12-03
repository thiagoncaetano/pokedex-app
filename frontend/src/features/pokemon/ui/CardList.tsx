import React, { memo, useCallback } from 'react';
import { Card } from './Card';
import { SkeletonCard } from '@/shared/ui/SkeletonCard';
import { Pokemon } from '@/shared/types/pokemon';

interface CardListProps {
  pokemons: Pokemon[];
  onCardClick?: (pokemon: Pokemon) => void;
}

// Main CardList Component
export const CardList = React.memo<CardListProps>(({ pokemons, onCardClick }) => {
  // Memoize the click handler to prevent unnecessary re-renders
  const handleCardClick = useCallback((pokemon: Pokemon) => {
    onCardClick?.(pokemon);
  }, [onCardClick]);

  // Show skeleton loading state
  if (!pokemons) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 mx-2 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (pokemons.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 mx-2 mb-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pokémon found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mx-2 mb-8">
      <div className="max-w-7xl mx-auto">
        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600">
          Found <span className="font-semibold">{pokemons.length}</span> pokémon
        </div>
        
        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
  );
});

CardList.displayName = 'CardList';

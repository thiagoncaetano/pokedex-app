import React, { useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card } from './Card';
import { PokeballSpinner } from '@/shared/ui/PokeballSpinner';
import { NotFound } from '@/shared/ui/NotFound';
import { ScrollContainer } from '@/shared/ui/ScrollContainer';
import { BasicPokemon } from '@/features/pokemon/types/pokemon';
import { useColumnCount } from '@/hooks/useColumnCount';
import { CARD_HEIGHT, GAP } from '@/shared/constants/virtualization';
import { SkeletonGrid } from './SkeletonGrid';
import { VirtualizedGrid } from '@/shared/ui/VirtualizedGrid';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface CardListProps {
  pokemons: BasicPokemon[];
  onCardClick?: (pokemon: BasicPokemon) => void;
  isFetchingNextPage?: boolean;
  isSearchApiFetching?: boolean;
  isLoading?: boolean;
  onEndReached?: () => void;
}


export const CardList = React.memo<CardListProps>(({ pokemons, onCardClick, isLoading, isFetchingNextPage, isSearchApiFetching, onEndReached }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const columns = useColumnCount();

  // Memoize the click handler to prevent unnecessary re-renders
  const handleCardClick = useCallback((pokemon: BasicPokemon) => {
    onCardClick?.(pokemon);
  }, [onCardClick]);

  const rowCount = Math.ceil(pokemons.length / columns);

  // Setup virtualizer
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT + GAP,
    overscan: 3,
  });

  useIntersectionObserver(
    observerTarget,
    () => {
      if (!isFetchingNextPage && onEndReached) {
        onEndReached();
      }
    },
    {
      threshold: 0.1,
      disabled: !onEndReached,
    },
  );

  // Show skeleton only on initial load (no pokemons yet)
  if ((isLoading || !!isSearchApiFetching) && pokemons.length === 0) {
    return <SkeletonGrid />;
  }

  return (
    <div className="flex-1 overflow-hidden px-1 sm:px-2 pb-2">
      <div className="bg-white rounded-3xl shadow-lg h-full flex flex-col mx-1 sm:mx-2 mb-0">
        <div className="p-3 sm:p-4 md:p-6 flex flex-col h-full">
          <div className="mb-4 text-sm text-gray-600 flex-shrink-0">
            Found <span className="font-semibold">{pokemons.length}</span> {pokemons.length === 1 ? 'pokémon' : 'pokémons'}
          </div>

          {/* Scrollable cards container */}
          <ScrollContainer ref={parentRef}>
            {pokemons.length === 0 ? (
              <NotFound message="Nothing found" />
            ) : (
              <>
                <VirtualizedGrid
                  virtualizer={virtualizer}
                  items={pokemons}
                  columns={columns}
                  renderRow={(rowPokemons) => (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-1">
                      {rowPokemons.map((pokemon) => (
                        <Card
                          key={pokemon.id}
                          pokemon={pokemon}
                          onClick={handleCardClick}
                        />
                      ))}
                    </div>
                  )}
                />

                {isFetchingNextPage && (
                  <div
                    className="absolute w-full flex justify-center py-4 z-10"
                    style={{ top: `${virtualizer.getTotalSize()}px` }}
                  >
                    <PokeballSpinner size="lg" />
                  </div>
                )}
              </>
            )}

            <div
              ref={observerTarget}
              className="absolute w-full h-15"
              style={{ top: `${virtualizer.getTotalSize() + (isFetchingNextPage ? 60 : 0)}px` }}
            />
          </ScrollContainer>
        </div>
      </div>
    </div>
  );
});

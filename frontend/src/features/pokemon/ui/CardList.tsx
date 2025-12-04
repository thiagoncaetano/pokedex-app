import React, { useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card } from './Card';
import SkeletonCard from '@/shared/ui/SkeletonCard';
import { PokeballSpinner } from '@/shared/ui/PokeballSpinner';
import { NotFound } from '@/shared/ui/NotFound';
import { ScrollContainer } from '@/shared/ui/ScrollContainer';
import { BasicPokemon } from '@/features/pokemon/types/pokemon';
import { useColumnCount } from '@/hooks/useColumnCount';
import { CARD_HEIGHT, GAP } from '@/shared/constants/virtualization';

interface CardListProps {
  pokemons: BasicPokemon[];
  onCardClick?: (pokemon: BasicPokemon) => void;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  isSearchApiFetching?: boolean;
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


  useEffect(() => {
    const element = observerTarget.current;
    if (isLoading || isFetchingNextPage || !element || !onEndReached) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onEndReached();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [isLoading, isFetchingNextPage, onEndReached, pokemons]);

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

  return (
    <div className="bg-white rounded-3xl shadow-lg h-full flex flex-col mx-1 sm:mx-2 mb-0">
      <div className="p-3 sm:p-4 md:p-6 flex flex-col h-full">
        <div className="mb-4 text-sm text-gray-600 flex-shrink-0">
          Found <span className="font-semibold">{pokemons.length}</span> {pokemons.length === 1 ? 'pokémon' : 'pokémons'}
        </div>
        
        {/* Scrollable cards container */}
        <ScrollContainer ref={parentRef}>
          { !!isSearchApiFetching ? (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <PokeballSpinner size="lg" />
            </div>
          ) : pokemons.length === 0 ? (
            <NotFound message="Nothing found" />
          ) : (
            <>
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const startIndex = virtualRow.index * columns;
                const endIndex = Math.min(startIndex + columns, pokemons.length);
                const rowPokemons = pokemons.slice(startIndex, endIndex);

              return (
                <div
                  key={virtualRow.index}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-1">
                    {rowPokemons.map((pokemon) => (
                      <Card 
                        key={pokemon.id} 
                        pokemon={pokemon} 
                        onClick={handleCardClick}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
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
            className="absolute w-full h-4 bg-transparent"
            style={{ top: `${virtualizer.getTotalSize() + (isFetchingNextPage ? 60 : 0)}px` }}
          />
        </ScrollContainer>
      </div>
    </div>
  );
});

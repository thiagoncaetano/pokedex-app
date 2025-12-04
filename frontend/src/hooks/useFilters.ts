import { useState, useEffect, useMemo } from 'react';
import { BasicPokemon } from '@/features/pokemon/types/pokemon';
import { SortBy, SortByType } from '@/types/filters';

interface FiltersState {
  searchQuery: string;
  sortBy: SortByType;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useFilters() {
  const [filters, setFilters] = useState<FiltersState>({
    searchQuery: '',
    sortBy: SortBy.NUMBER
  });

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const setSortBy = (sortBy: SortByType) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  // Debounced search query for API calls
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 400);

  // Pure filter + sort function - no external dependencies besides filters state
  const filterPokemons = (pokemons: BasicPokemon[], query: string): BasicPokemon[] => {
    const trimmedQuery = query.trim();

    let result: BasicPokemon[];

    if (!trimmedQuery) {
      // Raw data
      result = pokemons;
    } else {
      const cleanQuery = trimmedQuery.toLowerCase();

      // Search by id
      if (!isNaN(Number(cleanQuery))) {
        result = pokemons.filter(pokemon => pokemon.id.toString().includes(cleanQuery));
      } else {
        // Search by name
        result = pokemons.filter(pokemon => 
          pokemon.name.toLowerCase().includes(cleanQuery)
        );
      }
    }

    // Sort results according to current sortBy
    const sorted = [...result].sort((a, b) => {
      if (filters.sortBy === SortBy.NAME) {
        return a.name.localeCompare(b.name);
      }
      // NUMBER sort: use id as numeric order
      return a.id - b.id;
    });

    return sorted;
  };

  return {
    searchQuery: filters.searchQuery,
    sortBy: filters.sortBy,
    debouncedSearchQuery,
    filterPokemons,
    setSearchQuery,
    setSortBy
  };
}

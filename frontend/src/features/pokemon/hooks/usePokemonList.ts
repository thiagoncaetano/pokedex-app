import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PokemonAdapter } from '../adapter/PokemonAdapter';
import { PokemonFilters } from '../types/pokemon';

const adapter = new PokemonAdapter();

export function usePokemonList() {
  const getDetailById = (id: number) => {
    return useQuery({
      queryKey: ['pokemon-detail', id],
      queryFn: () => adapter.getDetailById(id),
      enabled: !!id,
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  const getBasicInfosByParam = (param: string) => {
    return useQuery({
      queryKey: ['pokemon-by-param', param],
      queryFn: () => adapter.getBasicInfosByParam(param),
      enabled: !!param,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    });
  };

  const getInfinitePokemons = (filters: PokemonFilters) => {
    return useInfiniteQuery({
      queryKey: ['pokemon-infinite', filters],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const response = await adapter.getInfinitePokemons({
          ...filters,
          page: pageParam,
        });
        return response;
      },
      initialPageParam: 2,
      getNextPageParam: (lastPage: any) => {
        const nextPage = lastPage.pagination.page + 1;
        return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
      },
      enabled: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    // getBasicInfosByIds,
    getDetailById,
    getBasicInfosByParam,
    getInfinitePokemons,
  };
}

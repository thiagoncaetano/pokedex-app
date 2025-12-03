import { useQuery } from '@tanstack/react-query';
import { PokemonAdapter } from '../adapter/PokemonAdapter';

const adapter = new PokemonAdapter();

export function usePokemonDetails() {
  const getBasicInfosByIds = (ids: number[]) => {
    return useQuery({
      queryKey: ['pokemon-basic-infos', ids],
      queryFn: () => adapter.getBasicInfosByIds(ids),
      enabled: ids.length > 0,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const getDetailById = (id: number) => {
    return useQuery({
      queryKey: ['pokemon-detail', id],
      queryFn: () => adapter.getDetailById(id),
      enabled: !!id,
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  return {
    getBasicInfosByIds,
    getDetailById,
  };
}
